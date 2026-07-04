#!/usr/bin/env python3
"""
Lee PDFs de una carpeta de Google Drive, clasifica cada uno automáticamente
y sube a la tabla Supabase correspondiente con embeddings Gemini.

Tablas destino:
  articulos_botanicos   → planta, fitoterapia, herbal, medicinal...
  articulos_formulacion → formulación, emulsión, shampoo, surfactante...
  articulos_belleza     → piel, cosmética, cabello, skin, hair...

Uso:
    python leer_drive.py
    python leer_drive.py --dry-run   # Solo clasifica, no sube a Supabase
    python leer_drive.py --limite 10 # Procesa solo los primeros N PDFs
"""

import io
import json
import os
import sys
import time
import argparse
import re
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Dependencias ───────────────────────────────────────────────────────────────

try:
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaIoBaseDownload
    from google.oauth2 import service_account
except ImportError:
    print("Ejecuta: pip install google-api-python-client google-auth")
    sys.exit(1)

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Ejecuta: pip install pymupdf")
    sys.exit(1)

try:
    from google import genai as google_genai
    import google.auth
except ImportError:
    print("Ejecuta: pip install google-genai")
    sys.exit(1)

try:
    from supabase import create_client
except ImportError:
    print("Ejecuta: pip install supabase")
    sys.exit(1)

# ── Configuración ──────────────────────────────────────────────────────────────

DRIVE_FOLDER_ID = "15GNj4A2ky5KEzNuIrTvABgRzHZkvRGWo"
SA_KEY_FILE     = Path("gemini_service_account.json")
EMBED_MODEL     = "text-embedding-004"
SNIPPET_MAX     = 600
BATCH_SIZE      = 50
DELAY_SECONDS   = 0.05
PROGRESS_FILE   = Path("leer_drive_progreso.json")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://powpibehemondwobngxh.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
GCP_PROJECT  = "gen-lang-client-0826649426"
GCP_LOCATION = "us-central1"

DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
GENAI_SCOPES = ["https://www.googleapis.com/auth/cloud-platform"]

# ── Clasificador ───────────────────────────────────────────────────────────────

RULES = [
    (
        "articulos_botanicos",
        r"planta|fitoterapia|herbal|botanical|herb\b|medicinal plant|phytotherapy"
        r"|ethnobotany|ethnobotanica|phytochemical|plant extract|planta medicinal"
        r"|traditional medicine|medicina tradicional",
    ),
    (
        "articulos_formulacion",
        r"formulaci[oó]n|emulsi[oó]n|shampoo|champú|surfactant|surfactante"
        r"|emulsifier|emulsificante|rheolog|reolog|thickener|espesante"
        r"|preservative|conservante|excipient|excipiente|pomade|pomada"
        r"|cream formul|lotion formul|gel formul|ointment|ungüento|syndet",
    ),
    (
        "articulos_belleza",
        r"piel|cosmética|cosm[eé]tic|cabello|hair|skin\b|facial|skincare"
        r"|anti.?aging|antienvejecimiento|moisturi[sz]|hidrataci[oó]n"
        r"|acne|acné|microbiome|microbioma|barrier|barrera cut[aá]nea",
    ),
]


def classify(text: str) -> str:
    """Devuelve la tabla destino según el contenido del texto."""
    text_lower = text.lower()
    scores = {}
    for table, pattern in RULES:
        matches = len(re.findall(pattern, text_lower))
        if matches:
            scores[table] = matches
    if not scores:
        return "articulos_belleza"  # fallback
    return max(scores, key=scores.get)


# ── Google Drive ───────────────────────────────────────────────────────────────

def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        str(SA_KEY_FILE), scopes=DRIVE_SCOPES
    )
    return build("drive", "v3", credentials=creds)


def list_pdfs(service, folder_id: str = DRIVE_FOLDER_ID) -> list[dict]:
    """Lista todos los PDFs de la carpeta y sus subcarpetas (recursivo)."""
    pdfs       = []
    subfolders = []
    page_token = None

    while True:
        resp = service.files().list(
            q=f"'{folder_id}' in parents and trashed=false",
            fields="nextPageToken, files(id, name, mimeType, size)",
            pageSize=1000,
            pageToken=page_token,
        ).execute()
        for f in resp.get("files", []):
            if f["mimeType"] == "application/pdf":
                pdfs.append(f)
            elif f["mimeType"] == "application/vnd.google-apps.folder":
                subfolders.append(f)
        page_token = resp.get("nextPageToken")
        if not page_token:
            break

    for subfolder in subfolders:
        print(f"  Entrando en subcarpeta: {subfolder['name']}")
        pdfs.extend(list_pdfs(service, subfolder["id"]))

    return pdfs


def download_pdf(service, file_id: str, max_retries: int = 4) -> bytes:
    """Descarga un PDF de Drive con reintentos ante errores de red."""
    for attempt in range(max_retries):
        try:
            request = service.files().get_media(fileId=file_id)
            buf     = io.BytesIO()
            dl      = MediaIoBaseDownload(buf, request)
            done    = False
            while not done:
                _, done = dl.next_chunk()
            return buf.getvalue()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt
            print(f"    [red intento {attempt+1}/{max_retries}] {e} — {wait}s...")
            time.sleep(wait)


# ── Extracción de texto ────────────────────────────────────────────────────────

def extract_text(pdf_bytes: bytes, max_pages: int = 10) -> str:
    """Extrae texto plano de las primeras N páginas del PDF."""
    doc   = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = min(len(doc), max_pages)
    parts = []
    for i in range(pages):
        parts.append(doc[i].get_text())
    return " ".join(parts).strip()


# ── Embeddings ─────────────────────────────────────────────────────────────────

def get_genai_client():
    creds = service_account.Credentials.from_service_account_file(
        str(SA_KEY_FILE), scopes=GENAI_SCOPES
    )
    return google_genai.Client(
        vertexai=True,
        project=GCP_PROJECT,
        location=GCP_LOCATION,
        credentials=creds,
    )


def embed_with_retry(client, text: str, max_retries: int = 5) -> list[float]:
    for attempt in range(max_retries):
        try:
            response = client.models.embed_content(model=EMBED_MODEL, contents=text)
            return list(response.embeddings[0].values)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt
            print(f"    [retry {attempt+1}/{max_retries}] {e} — {wait}s...")
            time.sleep(wait)


# ── Supabase ───────────────────────────────────────────────────────────────────

def build_row(filename: str, text: str, embedding: list[float]) -> dict:
    """Construye la fila para insertar en Supabase."""
    snippet = text[:SNIPPET_MAX]
    # Intenta extraer título de la primera línea no vacía
    title   = next((l.strip() for l in text.splitlines() if len(l.strip()) > 10), filename)
    return {
        "title":     title[:500],
        "authors":   "",
        "year":      "",
        "journal":   "",
        "source":    "drive_pdf",
        "plant_key": "",
        "doi":       "",
        "snippet":   snippet,
        "embedding": embedding,
    }


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Leer PDFs de Drive y subir a Supabase")
    parser.add_argument("--dry-run", action="store_true", help="Clasifica sin subir a Supabase")
    parser.add_argument("--limite",  type=int, default=0,  help="Procesar solo los primeros N PDFs (0 = todos)")
    parser.add_argument("--reset",   action="store_true", help="Ignorar progreso guardado y empezar desde cero")
    args = parser.parse_args()

    if not SA_KEY_FILE.exists():
        print(f"No se encontró {SA_KEY_FILE}")
        sys.exit(1)

    if not args.dry_run and not SUPABASE_KEY:
        print("Falta SUPABASE_KEY. Ejecuta: $env:SUPABASE_KEY='tu_key'")
        sys.exit(1)

    # Clientes
    print("Conectando con Google Drive...")
    drive_service = get_drive_service()

    supabase = None
    if not args.dry_run:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    genai_client = None
    if not args.dry_run:
        print("Inicializando cliente Gemini...")
        genai_client = get_genai_client()

    # Listar PDFs
    print(f"\nListando PDFs en carpeta {DRIVE_FOLDER_ID}...")
    pdfs = list_pdfs(drive_service)
    if not pdfs:
        print("No se encontraron PDFs en la carpeta.")
        sys.exit(0)

    if args.limite:
        pdfs = pdfs[:args.limite]

    print(f"PDFs encontrados: {len(pdfs)}\n")
    print("=" * 60)

    # Cargar progreso previo (IDs ya procesados con éxito)
    done_ids: set[str] = set()
    if not args.reset and PROGRESS_FILE.exists():
        try:
            done_ids = set(json.loads(PROGRESS_FILE.read_text(encoding="utf-8")))
            print(f"Retomando — ya procesados: {len(done_ids)} PDFs\n")
        except Exception:
            done_ids = set()

    stats = {"articulos_botanicos": 0, "articulos_formulacion": 0, "articulos_belleza": 0, "errores": 0}

    for i, pdf_file in enumerate(pdfs, 1):
        name    = pdf_file["name"]
        file_id = pdf_file["id"]

        if file_id in done_ids:
            print(f"[{i}/{len(pdfs)}] {name}  (ya procesado, omitido)")
            continue

        print(f"[{i}/{len(pdfs)}] {name}")

        try:
            pdf_bytes = download_pdf(drive_service, file_id)
            text      = extract_text(pdf_bytes)

            if not text.strip():
                print("    Sin texto extraíble (PDF escaneado?) — omitido")
                stats["errores"] += 1
                done_ids.add(file_id)
                PROGRESS_FILE.write_text(json.dumps(list(done_ids)), encoding="utf-8")
                continue

            table = classify(text)
            print(f"    → Tabla: {table}")

            if args.dry_run:
                stats[table] += 1
                done_ids.add(file_id)
                continue

            snippet   = text[:SNIPPET_MAX]
            embedding = embed_with_retry(genai_client, snippet)

            row = build_row(name, text, embedding)
            supabase.table(table).insert(row).execute()
            stats[table] += 1
            print(f"    Subido a {table}")

            done_ids.add(file_id)
            PROGRESS_FILE.write_text(json.dumps(list(done_ids)), encoding="utf-8")

        except Exception as e:
            print(f"    ERROR: {e}")
            stats["errores"] += 1

        time.sleep(DELAY_SECONDS)

    if not args.dry_run and PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()

    print("\n" + "=" * 60)
    print("Resumen:")
    print(f"  articulos_botanicos:   {stats['articulos_botanicos']}")
    print(f"  articulos_formulacion: {stats['articulos_formulacion']}")
    print(f"  articulos_belleza:     {stats['articulos_belleza']}")
    print(f"  Errores / omitidos:    {stats['errores']}")
    print(f"  Total procesados:      {sum(stats.values())}")


if __name__ == "__main__":
    main()

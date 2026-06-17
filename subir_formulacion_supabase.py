#!/usr/bin/env python3
"""
Sube los artículos de biblioteca-formulacion/ a la tabla articulos_formulacion en Supabase.
Lee los todos.json directamente, genera embeddings con google-generativeai (API key)
y hace insert por lotes.

Uso:
    python subir_formulacion_supabase.py
    python subir_formulacion_supabase.py --reset   # Empieza desde cero
"""

import json
import sys
import time
import argparse
import os
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    from google import genai
    import google.auth
    import google.auth.transport.requests
    from google.oauth2 import service_account
except ImportError:
    print("Ejecuta: pip install google-genai google-auth")
    sys.exit(1)

try:
    from supabase import create_client
except ImportError:
    print("Ejecuta: pip install supabase")
    sys.exit(1)

# ── Configuración ──────────────────────────────────────────────────────────────

BIBLIOTECA_DIR = Path("biblioteca-formulacion")
TABLE          = "articulos_formulacion"
EMBED_MODEL    = "text-embedding-004"
BATCH_SIZE     = 50
PROGRESS_FILE  = Path("subir_formulacion_progreso.txt")

SA_KEY_FILE  = Path("gemini_service_account.json")
GCP_PROJECT  = "gen-lang-client-0826649426"
GCP_LOCATION = "us-central1"

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://powpibehemondwobngxh.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# ── Auth ───────────────────────────────────────────────────────────────────────

def get_credentials():
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    if SA_KEY_FILE.exists():
        return service_account.Credentials.from_service_account_file(
            str(SA_KEY_FILE), scopes=scopes
        )
    try:
        credentials, _ = google.auth.default(scopes=scopes)
        return credentials
    except Exception as e:
        print(f"ERROR: No se encontró {SA_KEY_FILE} ni credenciales por defecto: {e}")
        sys.exit(1)

# ── Carga de artículos ─────────────────────────────────────────────────────────

def load_all_articles() -> list[dict]:
    articles = []
    for todos_path in sorted(BIBLIOTECA_DIR.rglob("todos.json")):
        topic_key = todos_path.parent.name
        try:
            with open(todos_path, encoding="utf-8") as f:
                items = json.load(f)
            for item in items:
                item["_topic_key"] = topic_key
            articles.extend(items)
            print(f"  {topic_key}: {len(items)} artículos")
        except Exception as e:
            print(f"  [WARN] {todos_path}: {e}")
    return articles

def build_snippet(article: dict) -> str:
    parts = []
    title = (article.get("title") or "").strip()
    if title:
        parts.append(title)
    abstract = (article.get("abstract") or "").strip()
    if abstract:
        parts.append(abstract)
    journal = (article.get("journal") or "").strip()
    if journal:
        parts.append(f"Revista: {journal}")
    return " | ".join(parts)[:600]

# ── Embeddings con retry ───────────────────────────────────────────────────────

def embed_with_retry(client, text: str, max_retries: int = 5) -> list[float]:
    for attempt in range(max_retries):
        try:
            response = client.models.embed_content(model=EMBED_MODEL, contents=text)
            return list(response.embeddings[0].values)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt
            print(f"  [retry {attempt+1}/{max_retries}] {e} — esperando {wait}s...")
            time.sleep(wait)

# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Ignorar progreso y empezar desde cero")
    args = parser.parse_args()

    if not BIBLIOTECA_DIR.exists():
        print(f"Carpeta no encontrada: {BIBLIOTECA_DIR}")
        sys.exit(1)
    if not SA_KEY_FILE.exists():
        print(f"No se encontró {SA_KEY_FILE}. Colócalo en el directorio del proyecto.")
        sys.exit(1)
    if not SUPABASE_KEY:
        print("Falta SUPABASE_KEY. Ejecuta: $env:SUPABASE_KEY='tu_key'")
        sys.exit(1)

    credentials = get_credentials()
    gemini_client = genai.Client(
        vertexai=True,
        project=GCP_PROJECT,
        location=GCP_LOCATION,
        credentials=credentials,
    )
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    print(f"\nCargando artículos desde {BIBLIOTECA_DIR}/")
    articles = load_all_articles()
    total = len(articles)
    print(f"Total: {total} artículos\n")

    if total == 0:
        print("Sin artículos. Revisa que biblioteca-formulacion/ tenga todos.json")
        sys.exit(1)

    offset = 0
    if not args.reset and PROGRESS_FILE.exists():
        try:
            offset = int(PROGRESS_FILE.read_text(encoding="utf-8-sig").strip())
            print(f"Retomando desde artículo {offset}...")
        except ValueError:
            offset = 0

    subidos = offset
    print(f"Subiendo a tabla: {TABLE}")
    print("=" * 50)

    while offset < total:
        batch = articles[offset : offset + BATCH_SIZE]
        rows  = []

        for article in batch:
            snippet   = build_snippet(article)
            embedding = embed_with_retry(gemini_client, snippet)
            rows.append({
                "title":     (article.get("title") or "")[:500],
                "authors":   ", ".join(article.get("authors") or [])[:300],
                "year":      str(article.get("year") or ""),
                "journal":   (article.get("journal") or "")[:200],
                "source":    article.get("source") or "pubmed",
                "plant_key": article.get("_topic_key") or "",
                "doi":       article.get("doi") or "",
                "snippet":   snippet,
                "embedding": embedding,
            })
            time.sleep(0.05)

        supabase.table(TABLE).insert(rows).execute()
        subidos += len(rows)
        offset  += BATCH_SIZE
        PROGRESS_FILE.write_text(str(offset))
        print(f"Subidos: {subidos}/{total}")

    PROGRESS_FILE.unlink(missing_ok=True)
    print("\n" + "=" * 50)
    print(f"Completado: {subidos} artículos en '{TABLE}'")


if __name__ == "__main__":
    main()

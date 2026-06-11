import chromadb
from pathlib import Path
from supabase import create_client
from google import genai
import google.auth
import google.auth.transport.requests
from google.oauth2 import service_account
import time
import os

CHROMA_DIR   = Path("biblioteca-cientifica/.chroma_db")
COLLECTION   = "articulos_botanicos"
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://powpibehemondwobngxh.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
GCP_PROJECT  = "gen-lang-client-0826649426"
GCP_LOCATION = "us-central1"
SA_KEY_FILE  = Path("gemini_service_account.json")
EMBED_MODEL  = "text-embedding-004"
BATCH_SIZE   = 100
PROGRESS_FILE = Path("subir_progreso.txt")

def get_credentials():
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    if SA_KEY_FILE.exists():
        return service_account.Credentials.from_service_account_file(str(SA_KEY_FILE), scopes=scopes)
    credentials, _ = google.auth.default(scopes=scopes)
    return credentials

def embed_with_retry(client, text, max_retries=5):
    for attempt in range(max_retries):
        try:
            response = client.models.embed_content(model=EMBED_MODEL, contents=text)
            return list(response.embeddings[0].values)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt
            print(f"  Error embedding (intento {attempt+1}/{max_retries}): {e}. Reintentando en {wait}s...")
            time.sleep(wait)

credentials = get_credentials()
client = genai.Client(
    vertexai=True,
    project=GCP_PROJECT,
    location=GCP_LOCATION,
    credentials=credentials,
)

client_chroma = chromadb.PersistentClient(path=str(CHROMA_DIR))
col = client_chroma.get_collection(COLLECTION)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

total = col.count()
print(f"Total artículos: {total}")

# Retomar desde el último offset guardado
offset = 0
if PROGRESS_FILE.exists():
    offset = int(PROGRESS_FILE.read_text(encoding="utf-8-sig").strip())
    print(f"Retomando desde offset {offset}...")

subidos = offset

while offset < total:
    results = col.get(
        limit=BATCH_SIZE,
        offset=offset,
        include=["documents", "metadatas"]
    )
    rows = []
    for doc, meta in zip(results["documents"], results["metadatas"]):
        snippet = doc[:600]
        embedding = embed_with_retry(client, snippet)
        rows.append({
            "title":     meta.get("title", ""),
            "authors":   meta.get("authors", ""),
            "year":      str(meta.get("year", "")),
            "journal":   meta.get("journal", ""),
            "source":    meta.get("source", ""),
            "plant_key": meta.get("plant_key", ""),
            "doi":       meta.get("doi", ""),
            "snippet":   snippet,
            "embedding": embedding,
        })
        time.sleep(0.05)
    supabase.table("articulos_botanicos").insert(rows).execute()
    subidos += len(rows)
    offset += BATCH_SIZE
    PROGRESS_FILE.write_text(str(offset))
    print(f"Subidos: {subidos}/{total}")

PROGRESS_FILE.unlink(missing_ok=True)
print("¡Listo! Todos los artículos subidos a Supabase.")

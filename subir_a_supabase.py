import chromadb
from pathlib import Path
from supabase import create_client
import time

CHROMA_DIR = Path("biblioteca-cientifica/.chroma_db")
COLLECTION = "articulos_botanicos"
import os
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://powpibehemondwobngxh.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
BATCH_SIZE = 100

client_chroma = chromadb.PersistentClient(path=str(CHROMA_DIR))
col = client_chroma.get_collection(COLLECTION)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

total = col.count()
print(f"Total artículos: {total}")

offset = 0
subidos = 0

while offset < total:
    results = col.get(
        limit=BATCH_SIZE,
        offset=offset,
        include=["documents", "metadatas", "embeddings"]
    )
    rows = []
    for doc, meta, emb in zip(results["documents"], results["metadatas"], results["embeddings"]):
        rows.append({
            "title": meta.get("title", ""),
            "authors": meta.get("authors", ""),
            "year": str(meta.get("year", "")),
            "journal": meta.get("journal", ""),
            "source": meta.get("source", ""),
            "plant_key": meta.get("plant_key", ""),
            "doi": meta.get("doi", ""),
            "snippet": doc[:600],
            "embedding": emb.tolist() if hasattr(emb, "tolist") else list(emb),
        })
    supabase.table("articulos_botanicos").insert(rows).execute()
    subidos += len(rows)
    offset += BATCH_SIZE
    print(f"Subidos: {subidos}/{total}")
    time.sleep(0.5)

print("¡Listo! Todos los artículos subidos a Supabase.")

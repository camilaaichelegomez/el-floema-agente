#!/usr/bin/env python3
"""
Sistema RAG (Retrieval-Augmented Generation) para la biblioteca científica.
Indexa todos los artículos de todos.json con ChromaDB y sentence-transformers.
Permite búsqueda semántica con citación de fuente.

Uso:
    python rag_biblioteca.py --build          # Construir/actualizar índice
    python rag_biblioteca.py "consulta"       # Buscar (reconstruye si no existe)
    python rag_biblioteca.py --build --query "consulta"
"""

import argparse
import json
import sys
from pathlib import Path

# Windows consoles default to cp1252; force UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    import chromadb
    from chromadb.config import Settings
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Dependencias faltantes. Ejecuta:")
    print("  pip install chromadb sentence-transformers")
    sys.exit(1)

# ── Configuración ──────────────────────────────────────────────────────────────

BIBLIOTECA_DIR = Path("biblioteca-cientifica")
CHROMA_DIR     = Path("biblioteca-cientifica/.chroma_db")
COLLECTION     = "articulos_botanicos"
EMBED_MODEL    = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
TOP_K_DEFAULT  = 8

# ── Carga de datos ─────────────────────────────────────────────────────────────

def load_all_articles() -> list[dict]:
    """Lee todos los todos.json recursivamente y devuelve lista plana de artículos."""
    articles = []
    for todos_path in sorted(BIBLIOTECA_DIR.rglob("todos.json")):
        plant_key = todos_path.parent.name
        try:
            with open(todos_path, encoding="utf-8") as f:
                items = json.load(f)
            for item in items:
                item["_plant_key"] = plant_key
                item["_todos_path"] = str(todos_path)
            articles.extend(items)
        except Exception as e:
            print(f"[WARN] No se pudo leer {todos_path}: {e}")
    return articles


def make_document(article: dict) -> tuple[str, dict]:
    """Construye el texto indexable y los metadatos para un artículo."""
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

    doc_text = " | ".join(parts) if parts else title or "Sin contenido"

    metadata = {
        "title":     title[:500],
        "source":    str(article.get("source") or ""),
        "year":      int(article.get("year") or 0),
        "journal":   str(journal)[:200],
        "doi":       str(article.get("doi") or ""),
        "url":       str(article.get("url") or ""),
        "plant_key": str(article.get("_plant_key") or ""),
        "authors":   ", ".join(article.get("authors") or [])[:300],
    }

    return doc_text, metadata


def build_unique_id(article: dict, idx: int) -> str:
    doi = (article.get("doi") or "").strip()
    if doi:
        return f"doi:{doi.replace('/', '_')}"
    title_slug = "".join(c if c.isalnum() else "_" for c in (article.get("title") or "")[:60])
    return f"art_{idx}_{title_slug}"


# ── Construcción del índice ────────────────────────────────────────────────────

def build_index(force: bool = False) -> chromadb.Collection:
    """Construye o actualiza el índice ChromaDB con todos los artículos."""
    print(f"Cargando modelo de embeddings: {EMBED_MODEL}")
    model = SentenceTransformer(EMBED_MODEL)

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    if force:
        try:
            client.delete_collection(COLLECTION)
            print("Colección anterior eliminada.")
        except Exception:
            pass

    collection = client.get_or_create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"},
    )

    articles = load_all_articles()
    print(f"Artículos encontrados: {len(articles)}")

    # IDs ya indexados
    existing_ids: set[str] = set()
    if collection.count() > 0:
        existing_ids = set(collection.get(include=[])["ids"])
        print(f"Ya indexados: {len(existing_ids)} — solo se agregarán nuevos.")

    batch_docs, batch_ids, batch_metas, batch_embeds = [], [], [], []
    BATCH = 64
    added = 0

    for idx, article in enumerate(articles):
        doc_id = build_unique_id(article, idx)
        if doc_id in existing_ids:
            continue

        doc_text, metadata = make_document(article)
        batch_docs.append(doc_text)
        batch_ids.append(doc_id)
        batch_metas.append(metadata)

        if len(batch_docs) >= BATCH:
            embeddings = model.encode(batch_docs, show_progress_bar=False).tolist()
            collection.add(
                ids=batch_ids,
                documents=batch_docs,
                metadatas=batch_metas,
                embeddings=embeddings,
            )
            added += len(batch_docs)
            print(f"  Indexados: {added}/{len(articles) - len(existing_ids)}", end="\r")
            batch_docs, batch_ids, batch_metas = [], [], []

    if batch_docs:
        embeddings = model.encode(batch_docs, show_progress_bar=False).tolist()
        collection.add(
            ids=batch_ids,
            documents=batch_docs,
            metadatas=batch_metas,
            embeddings=embeddings,
        )
        added += len(batch_docs)

    print(f"\nÍndice listo: {collection.count()} artículos totales ({added} nuevos).")
    return collection


# ── Búsqueda semántica ─────────────────────────────────────────────────────────

def get_collection() -> chromadb.Collection:
    if not CHROMA_DIR.exists():
        raise FileNotFoundError("Índice no encontrado. Ejecuta: python rag_biblioteca.py --build")
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    return client.get_collection(COLLECTION)


def semantic_search(query: str, top_k: int = TOP_K_DEFAULT) -> list[dict]:
    """Busca semánticamente en el índice y devuelve artículos con metadatos y score."""
    model = SentenceTransformer(EMBED_MODEL)
    collection = get_collection()

    query_embedding = model.encode([query]).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    output = []
    ids       = results["ids"][0]
    docs      = results["documents"][0]
    metas     = results["metadatas"][0]
    distances = results["distances"][0]

    for i, (doc_id, doc, meta, dist) in enumerate(zip(ids, docs, metas, distances)):
        similarity = round(1 - dist, 4)
        output.append({
            "rank":       i + 1,
            "similarity": similarity,
            "title":      meta.get("title", ""),
            "authors":    meta.get("authors", ""),
            "year":       meta.get("year") or None,
            "journal":    meta.get("journal", ""),
            "source":     meta.get("source", ""),
            "plant_key":  meta.get("plant_key", ""),
            "doi":        meta.get("doi", ""),
            "url":        meta.get("url", ""),
            "snippet":    doc[:300],
        })

    return output


def format_citation(result: dict) -> str:
    """Formatea una cita APA simplificada."""
    authors = result.get("authors") or "Autor desconocido"
    year    = result.get("year") or "s.f."
    title   = result.get("title") or "Sin título"
    journal = result.get("journal") or ""
    doi     = result.get("doi") or ""
    url     = result.get("url") or ""

    citation = f"{authors} ({year}). {title}."
    if journal:
        citation += f" {journal}."
    if doi:
        citation += f" https://doi.org/{doi}"
    elif url:
        citation += f" {url}"
    return citation


def print_results(results: list[dict]) -> None:
    if not results:
        print("Sin resultados.")
        return

    print(f"\n{'=' * 70}")
    print(f"  {len(results)} resultados más relevantes")
    print(f"{'=' * 70}\n")

    for r in results:
        score_bar = "#" * int(r["similarity"] * 20)
        print(f"#{r['rank']}  [{r['similarity']:.3f}] {score_bar}")
        print(f"  Planta: {r['plant_key']} | Fuente: {r['source']}")
        print(f"  {r['title']}")
        if r.get("snippet"):
            print(f"  >> {r['snippet'][:200]}...")
        print(f"  Cita: {format_citation(r)}")
        print()


# ── CLI ────────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="RAG — Biblioteca Científica Botánica")
    parser.add_argument("query", nargs="?", help="Consulta semántica")
    parser.add_argument("--build",   action="store_true", help="Construir/actualizar índice")
    parser.add_argument("--rebuild", action="store_true", help="Reconstruir índice desde cero")
    parser.add_argument("--top",     type=int, default=TOP_K_DEFAULT, help=f"Número de resultados (default: {TOP_K_DEFAULT})")
    parser.add_argument("--json",    action="store_true", help="Salida en JSON")
    args = parser.parse_args()

    if args.build or args.rebuild:
        build_index(force=args.rebuild)

    if args.query:
        if not CHROMA_DIR.exists():
            print("Índice no encontrado, construyendo primero...")
            build_index()

        results = semantic_search(args.query, top_k=args.top)

        if args.json:
            print(json.dumps(results, ensure_ascii=False, indent=2))
        else:
            print_results(results)

    elif not args.build and not args.rebuild:
        parser.print_help()


if __name__ == "__main__":
    main()

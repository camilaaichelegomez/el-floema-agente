#!/usr/bin/env python3
"""
Scraper PubMed — Formulación Cosmética
Busca artículos científicos sobre formulación y los guarda en biblioteca-formulacion/
en formato JSON compatible con el sistema RAG del proyecto El Floema.

Uso:
    python scraping_formulacion.py                              # Todos los temas
    python scraping_formulacion.py --tema shampoo_formulation_surfactants
    python scraping_formulacion.py --max 50                    # 50 artículos por tema
"""

import json
import sys
import time
import argparse
import xml.etree.ElementTree as ET
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    import requests
except ImportError:
    print("Dependencia faltante. Ejecuta: pip install requests")
    sys.exit(1)

# ── Configuración ──────────────────────────────────────────────────────────────

BIBLIOTECA_DIR = Path("biblioteca-formulacion")
MAX_PER_TOPIC  = 100
BATCH_SIZE     = 50
DELAY_SECONDS  = 0.4

EUTILS_BASE    = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"

TOPICS = [
    ("shampoo formulation surfactants",          "shampoo_formulation_surfactants"),
    ("solid shampoo syndet bar formulation",     "solid_shampoo_syndet_bar"),
    ("hair conditioner ingredients",             "hair_conditioner_ingredients"),
    ("facial cleanser syndet formulation",       "facial_cleanser_syndet"),
    ("cream emulsion cosmetic formulation",      "cream_emulsion_cosmetic"),
    ("ointment pomade topical formulation",      "ointment_pomade_topical"),
    ("body butter natural cosmetics",            "body_butter_natural"),
    ("body lotion moisturizer formulation",      "body_lotion_moisturizer"),
    ("serum active ingredients skin",            "serum_active_ingredients_skin"),
    ("facial cream antiaging formulation",       "facial_cream_antiaging"),
    ("bath salts minerals skin",                 "bath_salts_minerals_skin"),
    ("bath foam bubble bath formulation",        "bath_foam_bubble_bath"),
    ("soap cold process natural",                "soap_cold_process_natural"),
    ("natural preservatives cosmetics stability","natural_preservatives_cosmetics"),
    ("plant extracts cosmetic efficacy",         "plant_extracts_cosmetic_efficacy"),
    ("emulsifiers natural cosmetics",            "emulsifiers_natural_cosmetics"),
    ("thickeners rheology cosmetics",            "thickeners_rheology_cosmetics"),
    ("skin penetration active ingredients",      "skin_penetration_active_ingredients"),
    ("hair treatment mask conditioning",         "hair_treatment_mask_conditioning"),
    ("body scrub exfoliant formulation",         "body_scrub_exfoliant"),
]

# ── API PubMed E-utilities ─────────────────────────────────────────────────────

def esearch(query: str, max_results: int) -> list[str]:
    r = requests.get(
        f"{EUTILS_BASE}/esearch.fcgi",
        params={
            "db":      "pubmed",
            "term":    query,
            "retmax":  max_results,
            "retmode": "json",
            "sort":    "relevance",
        },
        timeout=30,
    )
    r.raise_for_status()
    return r.json().get("esearchresult", {}).get("idlist", [])


def efetch_xml(pmids: list[str]) -> ET.Element:
    r = requests.get(
        f"{EUTILS_BASE}/efetch.fcgi",
        params={
            "db":      "pubmed",
            "id":      ",".join(pmids),
            "rettype": "xml",
            "retmode": "xml",
        },
        timeout=60,
    )
    r.raise_for_status()
    return ET.fromstring(r.content)


def _iter_text(elem) -> str:
    return "".join(elem.itertext()).strip() if elem is not None else ""


def parse_articles(root: ET.Element) -> list[dict]:
    articles = []
    for pubmed_article in root.findall(".//PubmedArticle"):
        medline = pubmed_article.find(".//MedlineCitation")
        if medline is None:
            continue
        art = medline.find(".//Article")
        if art is None:
            continue

        title = _iter_text(art.find("ArticleTitle"))

        abstract_parts = []
        abstract_elem = art.find("Abstract")
        if abstract_elem is not None:
            for text_elem in abstract_elem.findall("AbstractText"):
                label   = text_elem.get("Label", "")
                content = _iter_text(text_elem)
                if content:
                    abstract_parts.append(f"{label}: {content}" if label else content)
        abstract = " ".join(abstract_parts)

        journal = _iter_text(art.find(".//Journal/Title"))

        year: int | str = ""
        year_elem = art.find(".//Journal/JournalIssue/PubDate/Year")
        if year_elem is not None and year_elem.text:
            year = year_elem.text.strip()
        else:
            medline_date = art.find(".//Journal/JournalIssue/PubDate/MedlineDate")
            if medline_date is not None and medline_date.text:
                year = medline_date.text.strip()[:4]
        if isinstance(year, str) and year.isdigit():
            year = int(year)

        authors = []
        for author in art.findall(".//AuthorList/Author"):
            last = (author.findtext("LastName") or "").strip()
            fore = (author.findtext("ForeName") or "").strip()
            coll = (author.findtext("CollectiveName") or "").strip()
            if last:
                authors.append(f"{last} {fore}".strip())
            elif coll:
                authors.append(coll)

        pmid = (medline.findtext("PMID") or "").strip()
        doi  = ""
        for aid in pubmed_article.findall(".//ArticleIdList/ArticleId"):
            if aid.get("IdType") == "doi":
                doi = (aid.text or "").strip()
                break

        articles.append({
            "title":    title,
            "abstract": abstract,
            "journal":  journal,
            "source":   "pubmed",
            "year":     year,
            "doi":      doi,
            "url":      f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" if pmid else "",
            "authors":  authors,
        })

    return articles


# ── Scraping por tema ──────────────────────────────────────────────────────────

def scrape_topic(query: str, topic_key: str, max_results: int) -> list[dict]:
    print(f"\n[{topic_key}]")
    print(f"  Búsqueda: «{query}»")

    pmids = esearch(query, max_results)
    print(f"  PMIDs encontrados: {len(pmids)}")
    if not pmids:
        return []

    all_articles  = []
    total_batches = (len(pmids) + BATCH_SIZE - 1) // BATCH_SIZE

    for i in range(0, len(pmids), BATCH_SIZE):
        batch     = pmids[i:i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        print(f"  Batch {batch_num}/{total_batches} ({len(batch)} artículos)...", end=" ", flush=True)
        try:
            root   = efetch_xml(batch)
            parsed = parse_articles(root)
            all_articles.extend(parsed)
            print(f"OK → {len(parsed)} parseados")
        except Exception as e:
            print(f"ERROR: {e}")
        time.sleep(DELAY_SECONDS)

    return all_articles


def save_topic(articles: list[dict], topic_key: str) -> Path:
    folder   = BIBLIOTECA_DIR / topic_key
    folder.mkdir(parents=True, exist_ok=True)
    out_path = folder / "todos.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    return out_path


# ── CLI ────────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Scraper PubMed — Formulación Cosmética El Floema")
    parser.add_argument(
        "--tema",
        help="Clave del tema (ej: shampoo_formulation_surfactants). Sin este flag se descargan todos.",
    )
    parser.add_argument(
        "--max",
        type=int,
        default=MAX_PER_TOPIC,
        help=f"Artículos por tema (default: {MAX_PER_TOPIC})",
    )
    args = parser.parse_args()

    topics_to_run = TOPICS
    if args.tema:
        topics_to_run = [(q, k) for q, k in TOPICS if k == args.tema or q == args.tema]
        if not topics_to_run:
            print(f"Tema «{args.tema}» no encontrado.")
            print("Temas disponibles:")
            for _, k in TOPICS:
                print(f"  {k}")
            sys.exit(1)

    BIBLIOTECA_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Scraping PubMed — {len(topics_to_run)} tema(s) · {args.max} artículos c/u")
    print(f"Destino: {BIBLIOTECA_DIR.resolve()}")
    print("=" * 60)

    total_articles = 0
    total_topics   = 0

    for query, topic_key in topics_to_run:
        articles = scrape_topic(query, topic_key, args.max)
        if articles:
            out_path = save_topic(articles, topic_key)
            print(f"  Guardados: {len(articles)} artículos → {out_path}")
            total_articles += len(articles)
            total_topics   += 1
        else:
            print(f"  Sin resultados para: {topic_key}")
        time.sleep(DELAY_SECONDS)

    print("\n" + "=" * 60)
    print(f"Completado: {total_articles} artículos en {total_topics}/{len(topics_to_run)} temas")
    print(f"Carpeta: {BIBLIOTECA_DIR.resolve()}")


if __name__ == "__main__":
    main()

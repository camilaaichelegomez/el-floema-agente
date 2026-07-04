#!/usr/bin/env python3
"""
Descargador de PDFs de acceso abierto.
Lee todos los todos.json en biblioteca-cientifica/, filtra artículos con pdf_url,
y descarga los PDFs a biblioteca-cientifica/pdfs/<carpeta>/.

Uso:
    python descargar_pdfs.py               # descarga todo
    python descargar_pdfs.py --only matico maqui
    python descargar_pdfs.py --dry-run     # muestra qué descargaría sin descargar
"""

import argparse
import json
import logging
import re
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    print("Dependencia faltante. Ejecuta: pip install requests")
    sys.exit(1)

BIBLIOTECA_DIR = Path("biblioteca-cientifica")
PDFS_DIR       = BIBLIOTECA_DIR / "pdfs"
REQUEST_DELAY  = 1.5   # segundos entre descargas
TIMEOUT        = 30    # segundos por descarga
MAX_SIZE_MB    = 50    # rechaza archivos mayores a este límite

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s | %(message)s",
    handlers=[logging.StreamHandler()],
)
log = logging.getLogger(__name__)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _slugify(text: str, max_chars: int = 60) -> str:
    """Convierte texto a nombre de archivo seguro."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "_", text)
    return text[:max_chars].strip("_")


def _make_filename(article: dict) -> str:
    year  = article.get("year") or "s_f"
    title = article.get("title") or "sin_titulo"
    authors = article.get("authors") or []
    first_author = ""
    if authors:
        # toma el apellido del primer autor
        raw = authors[0].split(",")[0].strip()
        first_author = _slugify(raw, 20) + "_"

    title_slug = _slugify(" ".join(title.split()[:6]), 50)
    return f"{year}_{first_author}{title_slug}.pdf"


def _is_pdf(response: requests.Response) -> bool:
    content_type = response.headers.get("Content-Type", "")
    return "application/pdf" in content_type or response.content[:4] == b"%PDF"


# ── Descarga individual ────────────────────────────────────────────────────────

def download_pdf(url: str, dest: Path, dry_run: bool = False) -> bool:
    """Descarga un PDF a dest. Devuelve True si tuvo éxito (o si ya existía)."""
    if dest.exists():
        log.debug(f"  Ya existe: {dest.name}")
        return True

    if dry_run:
        log.info(f"  [dry-run] descargaría → {dest}")
        return True

    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; PlantMedicineBot/1.0; research use)"}
        r = requests.get(url, headers=headers, timeout=TIMEOUT, stream=True, allow_redirects=True)
        r.raise_for_status()

        # verificar tamaño antes de descargar completo
        content_length = r.headers.get("Content-Length")
        if content_length and int(content_length) > MAX_SIZE_MB * 1024 * 1024:
            log.warning(f"  Omitido (>{MAX_SIZE_MB} MB): {dest.name}")
            return False

        content = b"".join(r.iter_content(chunk_size=8192))

        if not _is_pdf(r) and not content[:4] == b"%PDF":
            log.warning(f"  No es PDF ({r.headers.get('Content-Type', '?')}): {url[:80]}")
            return False

        dest.write_bytes(content)
        size_kb = len(content) // 1024
        log.info(f"  OK {size_kb:>5} KB → {dest.name}")
        return True

    except requests.exceptions.HTTPError as e:
        log.warning(f"  HTTP {e.response.status_code}: {url[:80]}")
    except requests.exceptions.Timeout:
        log.warning(f"  Timeout: {url[:80]}")
    except Exception as e:
        log.warning(f"  Error: {e} | {url[:80]}")
    return False


# ── Recolector de artículos con PDF ───────────────────────────────────────────

def find_pdf_articles(only_keys: set[str] | None = None) -> dict[str, list[dict]]:
    """
    Recorre biblioteca-cientifica/ buscando todos.json con pdf_url.
    Devuelve dict {folder_relativa: [articulos_con_pdf]}.
    Respeta subcarpetas anidadas (ej: fundamentos/metabolitos).
    """
    result: dict[str, list[dict]] = {}

    for todos_path in sorted(BIBLIOTECA_DIR.rglob("todos.json")):
        # carpeta relativa a BIBLIOTECA_DIR, sin "todos.json"
        rel_folder = todos_path.parent.relative_to(BIBLIOTECA_DIR)
        folder_key = str(rel_folder).replace("\\", "/")

        # filtro --only: compara contra el primer segmento de la ruta
        if only_keys:
            top_level = folder_key.split("/")[0]
            if top_level not in only_keys and folder_key not in only_keys:
                continue

        try:
            articles = json.loads(todos_path.read_text(encoding="utf-8"))
        except Exception as e:
            log.warning(f"No se pudo leer {todos_path}: {e}")
            continue

        with_pdf = [a for a in articles if a.get("pdf_url")]
        if with_pdf:
            result[folder_key] = with_pdf

    return result


# ── Motor principal ────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Descargador de PDFs de acceso abierto")
    parser.add_argument("--only", nargs="+", metavar="CLAVE",
                        help="Procesar solo estas carpetas (ej: --only matico fundamentos/metabolitos)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Muestra qué descargaría sin descargar nada")
    args = parser.parse_args()

    only_keys = set(args.only) if args.only else None

    pdf_articles = find_pdf_articles(only_keys)
    if not pdf_articles:
        log.info("No se encontraron artículos con pdf_url en las carpetas seleccionadas.")
        return

    total_found = sum(len(v) for v in pdf_articles.values())
    log.info(f"Artículos con PDF disponible: {total_found} en {len(pdf_articles)} carpeta(s)")
    if args.dry_run:
        log.info("Modo dry-run — no se descargará nada\n")

    PDFS_DIR.mkdir(parents=True, exist_ok=True)

    total_ok = 0
    total_fail = 0
    report: list[dict] = []

    for folder_key, articles in pdf_articles.items():
        dest_dir = PDFS_DIR / folder_key
        dest_dir.mkdir(parents=True, exist_ok=True)

        log.info(f"\n[{folder_key}] {len(articles)} PDFs disponibles")

        for article in articles:
            url      = article["pdf_url"]
            filename = _make_filename(article)
            dest     = dest_dir / filename

            ok = download_pdf(url, dest, dry_run=args.dry_run)
            if ok:
                total_ok += 1
            else:
                total_fail += 1

            report.append({
                "folder": folder_key,
                "title": article.get("title"),
                "year": article.get("year"),
                "doi": article.get("doi"),
                "pdf_url": url,
                "file": str(dest.relative_to(PDFS_DIR)) if ok else None,
                "status": "ok" if ok else "error",
            })

            if not args.dry_run:
                time.sleep(REQUEST_DELAY)

    # guardar reporte
    report_path = PDFS_DIR / "reporte_descargas.json"
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    log.info(f"\n{'=' * 60}")
    log.info(f"Descargados: {total_ok}  |  Fallidos: {total_fail}")
    log.info(f"Reporte: {report_path}")
    log.info(f"PDFs en:    {PDFS_DIR.resolve()}")


if __name__ == "__main__":
    main()

# Renders pages of a practice test's source PDF to PNG so they can be looked at.
# Usage: python scripts/tests-page.py <test-id> <page> [<page> ...]
#   → content/tests/.work/<test-id>/p<page>.png   (prints the paths)

import json
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = Path.home() / "Downloads"

test_id, pages = sys.argv[1], [int(p) for p in sys.argv[2:]]
test = json.loads((ROOT / "content" / "tests" / "source" / f"{test_id}.json").read_text(encoding="utf-8"))
doc = pymupdf.open(PDF_DIR / test["pdf"])
out = ROOT / "content" / "tests" / ".work" / test_id
out.mkdir(parents=True, exist_ok=True)
for p in pages:
    if not 1 <= p <= doc.page_count:
        print(f"page {p} out of range (1-{doc.page_count})")
        continue
    path = out / f"p{p}.png"
    doc[p - 1].get_pixmap(dpi=110).save(path)
    print(path)

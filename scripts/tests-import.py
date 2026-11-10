# Imports the past-paper practice tests from DSAT_questions.xlsx (+ the TalimSAT PDFs for figures)
# into content/tests/source/<test-id>.json and public/tests/img/<test-id>/<key>-<n>.webp.
#
# Usage: python scripts/tests-import.py [xlsx] [pdf-dir]
#   defaults: ~/Desktop/past_papers/DSAT_questions.xlsx, ~/Downloads
# Needs: pip install openpyxl pymupdf pillow
#
# The source text is kept close to the xlsx (hard-wrapped PDF lines are re-joined; R&W passage and
# question are split heuristically). Agents then review each test against its PDF and write
# content/tests/answers/<test-id>.json (answer check, fixes, figures, explanations); see content/tests/REVIEWING.md.

import io
import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

import openpyxl
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
HOME = Path.home()
XLSX = Path(sys.argv[1]) if len(sys.argv) > 1 else HOME / "Desktop" / "past_papers" / "DSAT_questions.xlsx"
PDF_DIR = Path(sys.argv[2]) if len(sys.argv) > 2 else HOME / "Downloads"
OUT_JSON = ROOT / "content" / "tests" / "source"
OUT_IMG = ROOT / "public" / "tests" / "img"

MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

DOMAINS = {
    "Information and Ideas": "information-ideas",
    "Craft and Structure": "craft-structure",
    "Expression of Ideas": "expression-ideas",
    "Standard English Conventions": "conventions",
    "Algebra": "algebra",
    "Advanced Math": "advanced-math",
    "Problem-Solving and Data Analysis": "problem-solving",
    "Geometry and Trigonometry": "geometry-trig",
}
SKILLS = {
    "Central Ideas and Details": "central-ideas",
    "Command of Evidence": None,  # textual or quantitative: decided below
    "Inferences": "inferences",
    "Words in Context": "words-in-context",
    "Text Structure and Purpose": "text-structure-purpose",
    "Cross-Text Connections": "cross-text-connections",
    "Rhetorical Synthesis": "rhetorical-synthesis",
    "Transitions": "transitions",
    "Boundaries": "boundaries",
    "Form, Structure, and Sense": "form-structure-sense",
    "Linear equations in one variable": "linear-equations-one-var",
    "Linear functions": "linear-functions",
    "Linear equations in two variables": "linear-equations-two-var",
    "Systems of two linear equations in two variables": "systems-linear",
    "Linear inequalities in one or two variables": "linear-inequalities",
    "Nonlinear functions": "nonlinear-functions",
    "Nonlinear equations in one variable and systems of equations in two variables": "nonlinear-equations",
    "Equivalent expressions": "equivalent-expressions",
    "Ratios, rates, proportional relationships, and units": "ratios-rates",
    "Percentages": "percentages",
    "One-variable data: Distributions and measures of center and spread": "one-var-data",
    "Two-variable data: Models and scatterplots": "two-var-data",
    "Probability and conditional probability": "probability",
    "Inference from sample statistics and margin of error": "inference-sample",
    "Evaluating statistical claims: Observational studies and experiments": "statistical-claims",
    "Area and volume": "area-volume",
    "Lines, angles, and triangles": "lines-angles-triangles",
    "Right triangles and trigonometry": "right-triangles-trig",
    "Circles": "circles",
}

# First words of an R&W question stem (the line after the passage).
STEM = re.compile(
    r"^(Which|What|Based on|According to|The student wants|As used in|How |In the text|Why |To which|"
    r"The main purpose|The text|Text 2|It can most reasonably|The author|The researchers?|Which choice)",
)


def s(v):
    return "" if v is None else str(v).replace("\r\n", "\n").strip()


def unwrap(text, width=70):
    """Re-joins lines the PDF hard-wrapped (a long line followed by more text)."""
    lines = [l.rstrip() for l in text.split("\n")]
    out = []
    for line in lines:
        if out and out[-1] and line and len(out[-1]) >= width and not re.match(r"^(•|-\s|Text [12]\b)", line):
            out[-1] += " " + line.strip()
        else:
            out.append(line.strip())
    return re.sub(r"\n{3,}", "\n\n", "\n".join(out)).strip()


def split_rw(text):
    """R&W: passage + question stem → (passage, prompt). The stem starts on its own line."""
    lines = text.split("\n")
    for i in range(len(lines) - 1, 0, -1):
        if STEM.match(lines[i].strip()):
            return unwrap("\n".join(lines[:i])), unwrap("\n".join(lines[i:]))
    return "", unwrap(text)


def slug(year, month, version, form):
    return f"{year}-{MONTHS.index(month) + 1:02d}-{version.lower()}-{form.lower()}"


def find_pdf(test):
    for p in PDF_DIR.glob(f"{test}*TalimSAT*.pdf"):
        if p.name.startswith(test + ",") or p.name.startswith(test + " ("):
            return p
    return None


def save_images(doc, page_no, test_id, key):
    """Embedded raster images on the question's page (largest first) → webp. Returns [{src, w, h}]."""
    page = doc[page_no - 1]
    found = []
    for info in page.get_images(full=True):
        xref, smask = info[0], info[1]
        rects = page.get_image_rects(xref)
        if not rects:
            continue
        r = rects[0]
        if r.width < 40 or r.height < 25:  # logos / icons
            continue
        pix = pymupdf.Pixmap(doc, xref)
        if smask:
            pix = pymupdf.Pixmap(pix, pymupdf.Pixmap(doc, smask))
        if pix.n - pix.alpha >= 4:  # CMYK
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        if img.mode in ("RGBA", "LA", "P"):
            bg = Image.new("RGB", img.size, "white")
            img = img.convert("RGBA")
            bg.paste(img, mask=img.split()[3])
            img = bg
        found.append((r.y0, r.x0, img, r))
    found.sort(key=lambda t: (round(t[0]), t[1]))  # reading order
    out = []
    folder = OUT_IMG / test_id
    for n, (_, _, img, r) in enumerate(found, 1):
        folder.mkdir(parents=True, exist_ok=True)
        name = f"{key}-{n}.webp"
        img.save(folder / name, "WEBP", quality=88)
        out.append({"src": f"/tests/img/{test_id}/{name}", "w": img.width, "h": img.height, "y": round(r.y0)})
    return out


def main():
    print(f"Reading {XLSX}")
    wb = openpyxl.load_workbook(XLSX, read_only=True)
    tests_rows = list(wb["Tests"].iter_rows(values_only=True))
    th = {k: i for i, k in enumerate(tests_rows[0])}
    q_rows = list(wb["Questions"].iter_rows(values_only=True))
    qh = {k: i for i, k in enumerate(q_rows[0])}
    by_test = defaultdict(list)
    for r in q_rows[1:]:
        if r[qh["Test"]]:
            by_test[s(r[qh["Test"]])].append(r)

    OUT_JSON.mkdir(parents=True, exist_ok=True)
    stats = defaultdict(int)
    index = []
    for t in tests_rows[1:]:
        if not t[th["Test"]]:
            continue
        name = s(t[th["Test"]])
        year, month, version, form = int(t[th["Year"]]), s(t[th["Month"]]), s(t[th["Exam version"]]), s(t[th["Form"]])
        test_id = slug(year, month, version, form)
        pdf = find_pdf(name)
        if not pdf:
            print(f"  ! no PDF for {name}")
            stats["no_pdf"] += 1
        doc = pymupdf.open(pdf) if pdf else None

        questions = []
        for r in sorted(by_test[name], key=lambda r: (0 if s(r[qh["Section"]]).startswith("Reading") else 1, int(r[qh["Module"]]), int(r[qh["Q#"]]))):
            section = "rw" if s(r[qh["Section"]]).startswith("Reading") else "math"
            module, n = int(r[qh["Module"]]), int(r[qh["Q#"]])
            key = f"{'rw' if section == 'rw' else 'm'}{module}-{n:02d}"
            spr = s(r[qh["Type"]]).startswith("Student")
            raw = s(r[qh["Question"]]).replace("\nStudent-produced response: enter your answer in the grid.", "")
            q = {"key": key, "section": section, "module": module, "n": n, "type": "spr" if spr else "mcq"}
            if section == "rw":
                passage, prompt = split_rw(raw)
                if passage:
                    q["passage"] = passage
                q["prompt"] = prompt
            else:
                q["prompt"] = unwrap(raw)
            if not spr:
                q["choices"] = {c: unwrap(s(r[qh[c]])) for c in "ABCD"}
            q["answer"] = s(r[qh["Correct answer"]])
            q["answerConfidence"] = s(r[qh["Confidence"]])
            dom = s(r[qh["Domain"]])
            skill_name = s(r[qh["Skill"]])
            q["domain"] = DOMAINS.get(dom, "")
            has_fig = s(r[qh["Has figure"]]) == "yes"
            if skill_name == "Command of Evidence":
                q["skill"] = "command-of-evidence-quantitative" if has_fig else "command-of-evidence-textual"
            else:
                q["skill"] = SKILLS.get(skill_name, "")
            if not q["domain"] or not q["skill"]:
                stats["unmapped_skill"] += 1
            page = int(r[qh["PDF page"]]) if r[qh["PDF page"]] else None
            q["page"] = page
            if has_fig:
                q["hasFigure"] = True
            if doc and page:
                imgs = save_images(doc, page, test_id, key)
                if imgs:
                    q["images"] = imgs
                    stats["with_images"] += 1
                elif has_fig:
                    stats["figure_without_image"] += 1
            questions.append(q)

        sections = sorted({q["section"] for q in questions}, key=lambda x: 0 if x == "rw" else 1)
        test = {
            "id": test_id,
            "title": name,
            "year": year,
            "month": MONTHS.index(month) + 1,
            "version": version,
            "form": form,
            "sections": sections,
            "answerSource": "key" if "answer key" in s(t[th["Answer source"]]).lower() else "solved",
            "pdf": pdf.name if pdf else None,
            "questions": questions,
        }
        (OUT_JSON / f"{test_id}.json").write_text(json.dumps(test, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        index.append({"id": test_id, "title": name, "questions": len(questions), "sections": sections, "pdf": test["pdf"]})
        stats["tests"] += 1
        stats["questions"] += len(questions)
        if doc:
            doc.close()

    (OUT_JSON / "_index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(dict(stats))


if __name__ == "__main__":
    main()

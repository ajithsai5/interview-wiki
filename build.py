#!/usr/bin/env python3
"""
build.py — scan the wiki's markdown notes and generate app/notes-data.js,
the data file the viewer (app/index.html) reads.

Run from the repo root:

    python build.py            # regenerate app/notes-data.js
    python build.py --open     # ...and open the viewer in your browser

No third-party dependencies. Re-run it whenever you add or edit notes.
"""

import json
import os
import re
import sys
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.join(ROOT, "app")
OUT = os.path.join(APP_DIR, "notes-data.js")

# Top-level folders that hold wiki pages -> the domain label shown in the app.
# Add a row here when you add a new domain folder.
DOMAIN_BY_FOLDER = {
    "ml-fundamentals": "ML Fundamentals",
    "deep-learning":   "Deep Learning",
    "llms":            "LLMs / GenAI",
    "system-design":   "System Design",
    "dsa":             "DSA & Coding",
    "mlops":           "MLOps & Infra",
    "math":            "Math Foundations",
    "behavioral":      "Behavioral",
    "recruiter-hm":    "Recruiter & HM",
}

# Folders we never scan for pages.
SKIP_DIRS = {".git", "app", "raw", "node_modules", ".obsidian", "assets"}

# Map the wiki's frontmatter `status` vocabulary -> the app's status vocabulary.
STATUS_MAP = {
    "learning":     "learning",
    "reviewing":    "reviewing",
    "needs-review": "reviewing",
    "review":       "reviewing",
    "solid":        "mastered",
    "mastered":     "mastered",
    "new":          "new",
}

WIKILINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")


def split_frontmatter(text):
    """Return (frontmatter_dict, body_str). Tolerates files with no frontmatter."""
    if text.startswith("﻿"):
        text = text.lstrip("﻿")
    if not text.lstrip().startswith("---"):
        return {}, text
    # find the opening --- and the next --- line
    lines = text.splitlines()
    if lines[0].strip() != "---":
        return {}, text
    fm_lines = []
    body_start = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            body_start = i + 1
            break
        fm_lines.append(lines[i])
    if body_start is None:
        return {}, text
    body = "\n".join(lines[body_start:]).lstrip("\n")
    return parse_frontmatter(fm_lines), body


def parse_frontmatter(fm_lines):
    """Minimal YAML-ish parser: key: value, with inline [a, b] lists."""
    fm = {}
    for raw in fm_lines:
        line = raw.rstrip()
        if not line.strip() or line.strip().startswith("#"):
            continue
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if not m:
            continue
        key, val = m.group(1).strip(), m.group(2).strip()
        if val.startswith("[") and val.endswith("]"):
            inner = val[1:-1].strip()
            fm[key] = [s.strip().strip("'\"") for s in inner.split(",") if s.strip()] if inner else []
        else:
            fm[key] = val.strip("'\"")
    return fm


def strip_leading_h1(body):
    """Drop a leading `# Title` line — the app renders the title in its header."""
    lines = body.lstrip("\n").splitlines()
    if lines and re.match(r"^#\s+\S", lines[0]):
        lines = lines[1:]
        while lines and not lines[0].strip():
            lines.pop(0)
        return "\n".join(lines)
    return body


def slug_from(path):
    return os.path.splitext(os.path.basename(path))[0]


def title_from_slug(slug):
    return slug.replace("-", " ").replace("_", " ").strip().title()


def collect_notes():
    notes = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        rel = os.path.relpath(dirpath, ROOT)
        parts = [] if rel == "." else rel.split(os.sep)
        if not parts:
            continue  # skip files at repo root (README, CLAUDE, index, log, ...)
        top = parts[0]
        domain = DOMAIN_BY_FOLDER.get(top, title_from_slug(top))
        for fn in filenames:
            if not fn.lower().endswith(".md"):
                continue
            if fn.lower() == "readme.md":
                continue
            path = os.path.join(dirpath, fn)
            with open(path, "r", encoding="utf-8") as f:
                fm, body = split_frontmatter(f.read())
            slug = slug_from(path)
            body = strip_leading_h1(body)
            note = {
                "id": slug,
                "title": fm.get("title") or title_from_slug(slug),
                "domain": fm.get("domain") or domain,
                "tags": fm.get("tags") if isinstance(fm.get("tags"), list) else (
                    [fm["tags"]] if fm.get("tags") else []),
                "status": STATUS_MAP.get(str(fm.get("status", "new")).lower(), "new"),
                "updated": fm.get("updated", ""),
                "body": body.rstrip() + "\n",
                "_path": os.path.relpath(path, ROOT).replace(os.sep, "/"),
            }
            if fm.get("difficulty"):
                note["difficulty"] = fm["difficulty"]
            notes.append(note)
    return notes


def resolve_related(notes):
    """Derive `related` ids from [[wikilinks]] in each body (by slug or title)."""
    by_slug = {n["id"].lower(): n["id"] for n in notes}
    by_title = {n["title"].lower(): n["id"] for n in notes}
    for n in notes:
        seen, related = set(), []
        for target in WIKILINK_RE.findall(n["body"]):
            key = target.strip().lower()
            rid = by_slug.get(key) or by_title.get(key)
            if rid and rid != n["id"] and rid not in seen:
                seen.add(rid)
                related.append(rid)
        n["related"] = related


def main():
    notes = collect_notes()
    notes.sort(key=lambda n: (n["domain"].lower(), n["title"].lower()))
    resolve_related(notes)

    payload = [
        {k: v for k, v in n.items() if k != "_path"}
        for n in notes
    ]

    os.makedirs(APP_DIR, exist_ok=True)
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    js = (
        "/* AUTO-GENERATED by build.py — do not edit by hand.\n"
        "   Edit the .md files, then re-run: python build.py */\n"
        "window.WIKI_NOTES = " + body + ";\n"
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(js)

    print(f"Wrote {len(payload)} note(s) -> {os.path.relpath(OUT, ROOT)}")
    by_dom = {}
    for n in notes:
        by_dom.setdefault(n["domain"], 0)
        by_dom[n["domain"]] += 1
    for dom, c in sorted(by_dom.items()):
        print(f"  {c:>3}  {dom}")

    if "--open" in sys.argv:
        webbrowser.open("file:///" + os.path.join(APP_DIR, "index.html").replace(os.sep, "/"))


if __name__ == "__main__":
    main()

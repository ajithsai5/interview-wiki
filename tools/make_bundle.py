#!/usr/bin/env python3
"""Build dist/wiki-upload.zip — everything to drop into inkpioneers.in/wiki/.

The sync endpoint is baked INLINE into index.html (a separate config file gets
blocked by some host security rules). This script sets that inline endpoint.

Outputs:
  - dist/wiki-upload.zip   full bundle (files at the zip ROOT)
  - dist/index.html        just the patched index.html (for a one-file re-upload)

Run from the repo root:  python tools/make_bundle.py
"""
import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
SERVER = os.path.join(ROOT, "server")
DIST = os.path.join(ROOT, "dist")
ENDPOINT = "https://inkpioneers.in/wiki/sync.php"

os.makedirs(DIST, exist_ok=True)
zip_path = os.path.join(DIST, "wiki-upload.zip")

# patch index.html: set the inline SYNC_CONFIG endpoint
index_src = open(os.path.join(APP, "index.html"), encoding="utf-8").read()
patched_index = index_src.replace(
    'window.SYNC_CONFIG = { endpoint: "" }',
    'window.SYNC_CONFIG = { endpoint: "%s" }' % ENDPOINT,
)
if ENDPOINT not in patched_index:
    raise SystemExit("ERROR: could not find the inline SYNC_CONFIG line in index.html")

with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8", newline="") as f:
    f.write(patched_index)

with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, _dirs, files in os.walk(APP):
        for fn in files:
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, APP).replace(os.sep, "/")
            if rel == "index.html":
                z.writestr(rel, patched_index)
            else:
                z.write(full, rel)
    z.write(os.path.join(SERVER, "sync.php"), "sync.php")
    z.write(os.path.join(SERVER, "config.sample.php"), "config.sample.php")

print("wrote", os.path.relpath(zip_path, ROOT), "(%d KB)" % (os.path.getsize(zip_path) // 1024))
print("wrote", os.path.relpath(os.path.join(DIST, "index.html"), ROOT), "(patched, for single-file re-upload)")
print("endpoint baked in:", ENDPOINT)

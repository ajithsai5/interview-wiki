#!/usr/bin/env python3
"""Build dist/wiki-upload.zip — everything to drop into inkpioneers.in/wiki/.

The bundle is FLAT (no content/ or icons/ subfolders) because some File Manager
extractors drop nested folders. So index.html and manifest.webmanifest are
rewritten to reference the flattened filenames, and the sync endpoint is baked
inline into index.html (a separate config file gets 403'd by host security).

Outputs:
  - dist/wiki-upload.zip   flat bundle (every file at the zip ROOT)
  - dist/index.html        the patched index.html (reference copy)

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

# --- patch index.html: set endpoint inline + flatten content//icons references ---
index_src = open(os.path.join(APP, "index.html"), encoding="utf-8").read()
patched_index = index_src.replace(
    'window.SYNC_CONFIG = { endpoint: "" }',
    'window.SYNC_CONFIG = { endpoint: "%s" }' % ENDPOINT,
)
if ENDPOINT not in patched_index:
    raise SystemExit("ERROR: could not find the inline SYNC_CONFIG line in index.html")
patched_index = patched_index.replace('src="content/', 'src="').replace('href="icons/', 'href="')

# --- patch manifest: flatten icon paths ---
patched_manifest = open(os.path.join(APP, "manifest.webmanifest"), encoding="utf-8").read()
patched_manifest = patched_manifest.replace('"src": "icons/', '"src": "')

with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8", newline="") as f:
    f.write(patched_index)

seen = {}
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, _dirs, files in os.walk(APP):
        for fn in files:
            full = os.path.join(dirpath, fn)
            arc = os.path.basename(full)            # FLATTEN: drop any subfolder
            if arc in seen:
                raise SystemExit("ERROR: filename collision when flattening: " + arc)
            seen[arc] = True
            if arc == "index.html":
                z.writestr("index.html", patched_index)
            elif arc == "manifest.webmanifest":
                z.writestr("manifest.webmanifest", patched_manifest)
            else:
                z.write(full, arc)
    z.write(os.path.join(SERVER, "sync.php"), "sync.php")
    z.write(os.path.join(SERVER, "config.sample.php"), "config.sample.php")

print("wrote", os.path.relpath(zip_path, ROOT), "(%d KB, FLAT — no subfolders)" % (os.path.getsize(zip_path) // 1024))
print("endpoint baked in:", ENDPOINT)

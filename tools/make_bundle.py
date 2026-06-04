#!/usr/bin/env python3
"""Build dist/wiki-upload.zip — everything to drop into inkpioneers.in/wiki/.

Contents sit at the zip ROOT (so extracting into /wiki/ puts files directly there):
  - all of app/  (with sync-config.js endpoint pre-set to the /wiki/ URL)
  - sync.php
  - config.sample.php  (rename to config.php on the server and fill in)

Run from the repo root:  python tools/make_bundle.py
"""
import os
import re
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
SERVER = os.path.join(ROOT, "server")
DIST = os.path.join(ROOT, "dist")
ENDPOINT = "https://inkpioneers.in/wiki/sync.php"

os.makedirs(DIST, exist_ok=True)
out = os.path.join(DIST, "wiki-upload.zip")

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, _dirs, files in os.walk(APP):
        for fn in files:
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, APP).replace(os.sep, "/")
            if rel == "sync-config.js":
                txt = open(full, encoding="utf-8").read()
                txt = re.sub(r'endpoint:\s*"[^"]*"', 'endpoint: "%s"' % ENDPOINT, txt)
                z.writestr(rel, txt)
            else:
                z.write(full, rel)
    z.write(os.path.join(SERVER, "sync.php"), "sync.php")
    z.write(os.path.join(SERVER, "config.sample.php"), "config.sample.php")

print("wrote", os.path.relpath(out, ROOT), "(%d KB)" % (os.path.getsize(out) // 1024))
print("endpoint pre-set to:", ENDPOINT)

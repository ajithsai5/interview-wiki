#!/usr/bin/env python3
"""
deploy.py — one-command publish to your server over FTPS.

It (1) rebuilds notes-data.js from your .md notes, (2) builds the flat bundle,
and (3) uploads every file into your /wiki/ folder via secure FTP. Your
config.php on the server is never touched (it isn't in the bundle).

Setup once:
  - Copy deploy-config.sample.json -> deploy-config.json and fill in your FTP
    details (deploy-config.json is git-ignored; it holds your FTP password).

Use:
  python deploy.py          # build + upload everything to /wiki/
  python deploy.py --ls     # just connect and show folders (to find remote_dir)

Tip: double-click deploy.bat on Windows.
"""
import ftplib
import io
import json
import os
import ssl
import subprocess
import sys
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
CONFIG = os.path.join(ROOT, "deploy-config.json")
DIST_ZIP = os.path.join(ROOT, "dist", "wiki-upload.zip")


def load_config():
    if os.path.exists(CONFIG):
        with open(CONFIG, encoding="utf-8") as f:
            return json.load(f)
    # CI / GitHub Actions: read from environment variables (secrets)
    if os.environ.get("FTP_HOST"):
        return {
            "host": os.environ["FTP_HOST"],
            "port": int(os.environ.get("FTP_PORT", "21")),
            "tls": os.environ.get("FTP_TLS", "true").lower() != "false",
            "user": os.environ["FTP_USER"],
            "pass": os.environ["FTP_PASS"],
            "remote_dir": os.environ.get("FTP_REMOTE_DIR", "public_html/wiki"),
        }
    sys.exit(
        "Missing deploy-config.json.\n"
        "Copy deploy-config.sample.json to deploy-config.json and fill in your\n"
        "FTP host / username / password / remote_dir (see DEPLOY.md)."
    )


def connect(cfg):
    host = cfg["host"]
    port = int(cfg.get("port", 21))
    if cfg.get("tls", True):
        ctx = ssl.create_default_context()
        # shared hosts often have mismatched certs; encrypt but don't verify
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        ftp = ftplib.FTP_TLS(context=ctx)
        ftp.connect(host, port, timeout=30)
        ftp.login(cfg["user"], cfg["pass"])
        ftp.prot_p()
    else:
        ftp = ftplib.FTP()
        ftp.connect(host, port, timeout=30)
        ftp.login(cfg["user"], cfg["pass"])
    ftp.set_pasv(True)
    return ftp


def list_remote(cfg):
    ftp = connect(cfg)
    try:
        print("Connected. Current dir:", ftp.pwd())
        print("\nTop-level here:")
        ftp.retrlines("LIST")
        for probe in ("public_html", "public_html/wiki", cfg.get("remote_dir", "")):
            if not probe:
                continue
            try:
                ftp.cwd("/" + probe.lstrip("/"))
                print("\n/%s :" % probe.lstrip("/"))
                ftp.retrlines("LIST")
            except Exception as e:
                print("\n(can't open /%s: %s)" % (probe.lstrip("/"), e))
    finally:
        ftp.quit()


def build():
    py = sys.executable
    subprocess.run([py, os.path.join(ROOT, "build.py")], cwd=ROOT, check=True)
    subprocess.run([py, os.path.join(ROOT, "tools", "make_bundle.py")], cwd=ROOT, check=True)


def upload(cfg):
    if not os.path.exists(DIST_ZIP):
        sys.exit("dist/wiki-upload.zip missing — run build first.")
    ftp = connect(cfg)
    try:
        ftp.cwd("/" + cfg["remote_dir"].lstrip("/"))
        z = zipfile.ZipFile(DIST_ZIP)
        n = 0
        for name in z.namelist():
            # never overwrite the server's real config.php (it isn't in the zip,
            # but be explicit), and skip the sample to avoid clutter
            if name in ("config.php", "config.sample.php"):
                continue
            ftp.storbinary("STOR " + name, io.BytesIO(z.read(name)))
            print("  uploaded", name)
            n += 1
        print("\nDone — uploaded %d files to /%s" % (n, cfg["remote_dir"].lstrip("/")))
        print("Open your site and hard-refresh to see the update.")
    finally:
        ftp.quit()


def main():
    cfg = load_config()
    if "--ls" in sys.argv:
        list_remote(cfg)
        return
    build()
    upload(cfg)


if __name__ == "__main__":
    main()

# One-command deploy

Publish note changes to your server (`inkpioneers.in/wiki/`) without ever touching
File Manager. After editing notes, run **`deploy.bat`** — it rebuilds and uploads
over secure FTP. Your `config.php` on the server is never touched.

## One-time setup
1. **Get FTP details** from your host. On **Hostinger**: hPanel → **Files → FTP
   Accounts**. Note the **FTP hostname** (e.g. `ftp.inkpioneers.in` or an IP),
   **username**, and **password** (create/reset it there if needed).
2. In the repo, copy **`deploy-config.sample.json`** → **`deploy-config.json`** and
   fill it in:
   ```json
   {
     "host": "ftp.inkpioneers.in",
     "port": 21,
     "tls": true,
     "user": "your-ftp-username",
     "pass": "your-ftp-password",
     "remote_dir": "public_html/wiki"
   }
   ```
   `deploy-config.json` is git-ignored — your password stays on your machine only.
3. **Find the right `remote_dir`** (the folder that holds the wiki). Run:
   ```
   python deploy.py --ls
   ```
   It lists your server folders. You want the path ending in `/wiki` — usually
   `public_html/wiki` (some hosts use `domains/inkpioneers.in/public_html/wiki`).
   Put that in `remote_dir`.

## Every time after that
- Edit/add `.md` notes → double-click **`deploy.bat`** (or run `python deploy.py`).
- It rebuilds `notes-data.js`, makes the flat bundle, and uploads all app files to
  `/wiki/`. Open the site and hard-refresh; new notes appear (and sync is untouched).

## Fully automatic — deploy on every `git push` (GitHub Actions)
The repo includes `.github/workflows/deploy.yml`, which rebuilds and uploads to
`/wiki/` automatically whenever you push to `main`. It uses three repo **Secrets**
(Settings → Secrets and variables → Actions): `FTP_HOST`, `FTP_USERNAME`,
`FTP_PASSWORD`. With those set, you don't run anything — edit a `.md`, commit,
push, and the site updates in ~1 minute. (`deploy.bat` still works for a manual
push without committing.)

To rotate the FTP password later: change it in hPanel, then update the secret:
```
gh secret set FTP_PASSWORD       # paste the new value when prompted
```

## Notes
- Uses **FTPS** (encrypted) when `"tls": true`. If your host only does plain FTP,
  set `"tls": false` (less secure — password sent in clear).
- It uploads the **flat** bundle (no subfolders), so the earlier extraction issues
  can't happen again.
- It never uploads or deletes `config.php` — your DB credentials and sync stay put.

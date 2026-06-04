# Self-hosted install + sync (on your own server)

Host the wiki on `inkpioneers.in` and sync your note **status** between phone and
laptop using a tiny PHP + MySQL endpoint on your own server. Nothing leaves your
infrastructure; no third party.

> ⚠️ **Do NOT delete your WordPress blog.** Put the wiki in a **`/wiki/` subfolder**
> — the blog keeps working at the main domain. If you ever decide to replace the
> site at the root, **export your WordPress posts + database first** (cPanel →
> Backup, or Tools → Export in WP admin). Deletion is irreversible.

## The pieces
- **`app/`** — the static wiki (what your browser loads). Goes in `public_html/wiki/`.
- **`server/sync.php`** — the sync endpoint. Goes next to the app (so it's at
  `https://inkpioneers.in/wiki/sync.php`).
- **`server/config.php`** — your DB credentials + sync passphrase (you create it
  from `config.sample.php`; never committed; PHP runs it, so it's never shown as text).
- **A MySQL table** (`ipw_progress`) — stores only your status/review data.

## Step 1 — Create a MySQL database (cPanel)
1. cPanel → **MySQL® Databases**.
2. Create a database (e.g. `inkpio_wiki`), a user, a password, and **add the user
   to the database with All Privileges**. Note all three values.

## Step 2 — Create the table (phpMyAdmin)
1. cPanel → **phpMyAdmin** → pick your new database → **SQL** tab.
2. Paste the contents of **`server/schema.sql`** → **Go**.

## Step 3 — Make config.php
1. Copy `server/config.sample.php` → `server/config.php`.
2. Fill in `DB_HOST` (usually `localhost`), `DB_NAME`, `DB_USER`, `DB_PASS`, and a
   long random `SYNC_KEY` (your sync passphrase — you'll type it once per device).

## Step 4 — Upload
Using cPanel **File Manager** (or FTP):
1. Create folder `public_html/wiki/`.
2. Upload **everything inside `app/`** into `public_html/wiki/`
   (tip: zip the `app` folder, upload the zip, then "Extract" — then move the files
   so they sit directly in `/wiki/`, not `/wiki/app/`).
3. Upload **`server/sync.php`** and your filled **`server/config.php`** into the
   same `public_html/wiki/` folder.
4. If WordPress's routing hijacks `/wiki/`, drop a file `public_html/wiki/.htaccess`
   containing one line: `RewriteEngine Off`.

## Step 5 — Point the app at your endpoint
Edit **`app/sync-config.js`** and set:
```js
window.SYNC_CONFIG = { endpoint: "https://inkpioneers.in/wiki/sync.php" };
```
Re-upload that one file (or set it before Step 4). *(Tell me your final URL and
I'll set this for you and rebuild.)*

## Step 6 — Use it
1. On the **laptop**, open `https://inkpioneers.in/wiki/` → click **"Sign in to
   sync"** (sidebar) → enter your `SYNC_KEY` passphrase.
2. On the **phone** (Chrome), open the same URL → menu → **Install app** → open it
   → **"Sign in to sync"** → enter the **same** passphrase.
3. Now marking a status on either device shows on the other. It works offline —
   changes queue and flush when you're back online (newest change wins).

## Day-to-day
- **Add/edit notes** on the laptop → run `build.py` → re-upload the changed files
  in `/wiki/` (at least `notes-data.js`). *(We can automate this later.)*
- **Study anywhere**: install + offline reading work because it's served over https.

## Security / privacy notes
- The `SYNC_KEY` is checked **on the server**; it's never stored in the files your
  browser downloads. It's a shared personal secret — use a long passphrase; anyone
  who has it can read/write your progress.
- Your **progress** lives in your MySQL table. Your **notes text** is served at the
  `/wiki/` URL (public). To gate the whole thing, add HTTP auth via cPanel
  ("Directory Privacy" on the `wiki` folder) or an `.htaccess` password.
- `config.php` is safe on the server (executed, not served) and is git-ignored.

## Notes / limits
- **Reset progress** in sync mode clears *this device*; the server keeps values
  until overwritten. To wipe everything, empty the `ipw_progress` table.
- Conflict resolution is **last-write-wins** per note (by change timestamp).

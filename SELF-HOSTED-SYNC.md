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

## Step 1 — Database (reuse WordPress's — nothing to create)
Your WordPress site already has a MySQL database. We reuse it and add one small
table that **creates itself** on first run — so there's no phpMyAdmin step. In
Step 3 you'll copy WordPress's DB login (the four `DB_*` values from your site's
`wp-config.php`) into `config.php`. (`server/schema.sql` is only there if you ever
want to create the table by hand.)

## Step 2 — Get file access to your server
`wp-admin` (posts/pages) can't create folders or upload these files — it's only the
content editor. Get file access one of two ways:

- **Easiest, from inside WordPress — the "WP File Manager" plugin:**
  wp-admin → **Plugins → Add New** → search **"File Manager"** → install
  **WP File Manager** (by *mndpsingh287*) → **Activate**. A new **WP File Manager**
  item appears in the left menu — it's a file browser for your server.
- **Or your hosting control panel** (cPanel / hPanel from wherever you bought
  hosting) → **File Manager**, or an FTP app like FileZilla.

> Tip: if you use the plugin, you can **deactivate/delete it** once uploading is done.

## Step 3 — Make config.php
1. Copy `server/config.sample.php` → `server/config.php`.
2. Fill in `DB_HOST` (usually `localhost`), `DB_NAME`, `DB_USER`, `DB_PASS`, and a
   long random `SYNC_KEY` (your sync passphrase — you'll type it once per device).

## Step 4 — Create the /wiki/ folder and upload
Using the file access from Step 2:
1. Open your **WordPress root** folder — the one containing `wp-config.php`,
   `wp-content`, `wp-admin` (in WP File Manager it's the top folder; in cPanel it's
   usually `public_html`).
2. **New folder** → name it `wiki`.
3. Open `wiki` and **upload** the bundle: everything inside `app/`, plus `sync.php`
   and your filled `config.php`. Easiest: upload the ready-made
   **`dist/wiki-upload.zip`** and use **Extract** — make sure files land directly in
   `/wiki/` (not `/wiki/app/`).
4. If `https://inkpioneers.in/wiki/` shows a WordPress 404 instead of the wiki,
   create a file `wiki/.htaccess` containing one line: `RewriteEngine Off`.

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

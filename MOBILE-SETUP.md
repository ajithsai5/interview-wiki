# Install on your phone + sync progress across devices

This makes the wiki an **installable app** on your Android phone that works
**offline**, and keeps your note **status** (New / Learning / Reviewing /
Mastered) **in sync** between phone and laptop — offline-capable, reconciled when
you're back online.

You author notes only on the laptop (unchanged). Only your *progress* syncs.
The hard offline-sync work is done by Firebase, not custom code.

> Until you finish Part A, the app runs in **local-only mode** (progress saved in
> each browser separately) — nothing is broken; sync is just off.

---

## Part A — turn on sync (Firebase, web console only, ~5 min)

1. Go to <https://console.firebase.google.com> → **Add project** → name it
   (e.g. `interview-wiki`) → you can disable Analytics → Create.
2. **Add a Web app:** in the project, click the **`</>`** (Web) icon → register
   an app (any nickname) → it shows a `firebaseConfig` block. Copy the values.
3. Paste those values into **`app/firebase-config.js`** (replace the `PASTE_…`
   placeholders for `apiKey`, `authDomain`, `projectId`, `appId`). *(Or just send
   me the config block and I'll paste it.)*
4. **Enable Google sign-in:** left menu → **Build → Authentication → Get started
   → Sign-in method → Google → Enable** (pick a support email) → Save.
5. **Create the database:** **Build → Firestore Database → Create database** →
   *Production mode* → pick a region → Enable.
6. **Set the security rules:** Firestore → **Rules** tab → replace everything with
   the contents of **`firestore.rules`** in this repo → **Publish**. (This makes
   each person's progress private to their own login.)

That's the whole backend. There is **no server to run.**

---

## Part B — put it online so the phone can load it

A phone can't open the files off the laptop; the `app/` folder must be served
once over **https**. Pick one:

### Option 1 — Cloudflare Pages (no Node, all web UI) — easiest
1. <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages → Connect
   to Git** → authorize and pick the `interview-wiki` repo.
2. Build settings: **Framework preset = None**, **Build command = (leave empty)**,
   **Build output directory = `app`** → Save and Deploy.
3. You get a URL like `https://interview-wiki.pages.dev`. It **auto-redeploys**
   every time you `git push`.
   *(Optional privacy: Cloudflare → the project → add **Access** to require your
   Google login before the site loads.)*

### Option 2 — Firebase Hosting (needs Node + the Firebase CLI)
Tell me and I'll install Node + `firebase-tools` for you. Then: `firebase login`
(opens your browser once), and I run `firebase deploy`. URL: `https://<project>.web.app`.

---

## Part C — let Google sign-in work on that URL
Firebase console → **Authentication → Settings → Authorized domains → Add domain**
→ add your hosting domain (e.g. `interview-wiki.pages.dev`). `localhost` is
already allowed for testing. **If you skip this, the sign-in popup fails.**

---

## Part D — install on the phone
1. Open your URL in **Chrome on Android**.
2. Chrome menu (⋮) → **Install app** (or **Add to Home screen**). An icon lands on
   your home screen; it opens fullscreen and works offline.
3. Tap **"Sign in to sync"** (bottom of the sidebar) → sign in with Google.
4. On the **laptop**, open the same URL and sign in with the **same Google
   account**. Now statuses you set on either device appear on the other.

---

## Day-to-day
- **Add/edit notes:** on the laptop, edit `.md` → run `build.py` → `git push`
  (Cloudflare auto-deploys) or `firebase deploy`. The phone shows new notes next
  time it's online; it keeps working offline in between.
- **Study anywhere:** mark statuses on the phone offline; when it reconnects, the
  changes sync to the laptop automatically (most recent change wins on conflict).

## Privacy
- Your **progress** (status + timestamps) is private to your Google login (enforced
  by `firestore.rules`).
- Your **note text** is served by the host so the phone can load it. The repo stays
  private on GitHub; to also gate the live site, add Cloudflare **Access** (Option 1).

## Troubleshooting
- *Sign-in popup closes / fails* → finish **Part C** (authorized domains).
- *No "Install app" option* → make sure you opened the **https** URL (not a local
  file) and reloaded once.
- *Phone shows old notes* → it updates when online; pull-to-refresh or reopen.
- *Want to wipe progress* → "Reset progress" in the sidebar (clears this account's
  synced progress too).

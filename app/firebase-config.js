/* Firebase web config.
   ---------------------------------------------------------------------------
   LEAVE THE PLACEHOLDERS to run the app in local-only mode (progress stored in
   this browser only — no cross-device sync). To turn ON phone<->laptop sync:

   1. Create a free Firebase project (see MOBILE-SETUP.md).
   2. Firebase console -> Project settings -> "Your apps" -> Web app -> copy the
      config values into the fields below.

   These values are NOT secret — a Firebase web apiKey is a public identifier;
   security comes from Auth + Firestore rules. Safe to commit. */
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  appId: "PASTE_APP_ID"
};

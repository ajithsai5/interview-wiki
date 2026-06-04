/* Self-hosted sync config.
   Set `endpoint` to your uploaded sync.php URL to enable phone<->laptop sync,
   e.g. "https://inkpioneers.in/wiki/sync.php". Leave it empty for local-only.

   No secret goes here. The sync passphrase (SYNC_KEY) is typed once per device
   when you click "Sign in to sync" and is kept only in that device's browser —
   it is never written into these served files. */
window.SYNC_CONFIG = {
  endpoint: ""
};

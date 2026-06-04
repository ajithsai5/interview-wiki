<?php
// Copy this file to  config.php  (same folder) and fill in your values.
// config.php holds secrets (DB password + sync key) and must NOT be committed
// or be web-readable as source — it's already in .gitignore, and PHP files are
// executed (not served as text) by the server.

define('DB_HOST', 'localhost');          // usually 'localhost' on shared hosting
define('DB_NAME', 'YOUR_DATABASE_NAME');
define('DB_USER', 'YOUR_DB_USER');
define('DB_PASS', 'YOUR_DB_PASSWORD');

// A long random passphrase. You'll type this once on each device to connect sync.
// It is checked on the SERVER only — it is never stored in the served web files.
define('SYNC_KEY', 'change-me-to-a-long-random-passphrase');

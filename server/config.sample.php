<?php
// Copy this file to  config.php  (same folder) and fill in your values.
// config.php holds secrets (DB password + sync key) and must NOT be committed
// or be web-readable as source — it's already in .gitignore, and PHP files are
// executed (not served as text) by the server.

// EASIEST: reuse the database WordPress already uses. Open your site's
// wp-config.php (File Manager -> the WordPress root) and copy the four DB_* values
// from there into the four lines below. The sync table is created automatically.
define('DB_HOST', 'localhost');          // = DB_HOST in wp-config.php (often 'localhost')
define('DB_NAME', 'YOUR_DATABASE_NAME'); // = DB_NAME in wp-config.php
define('DB_USER', 'YOUR_DB_USER');       // = DB_USER in wp-config.php
define('DB_PASS', 'YOUR_DB_PASSWORD');   // = DB_PASSWORD in wp-config.php

// A long random passphrase. You'll type this once on each device to connect sync.
// It is checked on the SERVER only — it is never stored in the served web files.
define('SYNC_KEY', 'change-me-to-a-long-random-passphrase');

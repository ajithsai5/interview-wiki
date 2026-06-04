-- Progress table for self-hosted sync. Run once (e.g. in cPanel -> phpMyAdmin).
-- Stores ONLY your note status/review data — never the note text.
CREATE TABLE IF NOT EXISTS ipw_progress (
  note_id    VARCHAR(190) PRIMARY KEY,
  status     VARCHAR(20)  NOT NULL,
  reviewed   BIGINT       NOT NULL DEFAULT 0,   -- last-reviewed time (ms since epoch)
  updated_at BIGINT       NOT NULL DEFAULT 0    -- last-change time (ms) — used for conflict resolution
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

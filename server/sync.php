<?php
/* ============================================================
   sync.php — minimal personal progress sync (PHP + MySQL).
   Stores ONLY your note status/review data, not the notes themselves.

   GET  sync.php            -> { "progress": [ {id,status,reviewed,updatedAt}, ... ] }
   POST sync.php  (JSON)    -> { "progress": [ {id,status,reviewed,updatedAt}, ... ] }
                               upserts; newest updatedAt wins (last-write-wins).
   Auth: header  X-Sync-Key: <your passphrase>   (compared to SYNC_KEY in config.php)
   ============================================================ */

require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
// The app may be opened from the server itself or from http://localhost during
// dev, so allow any origin. Security is the sync key, not the origin.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Sync-Key');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(204); exit; }

// ---- auth ----
$key = isset($_SERVER['HTTP_X_SYNC_KEY']) ? $_SERVER['HTTP_X_SYNC_KEY'] : '';
if (!is_string($key) || !hash_equals(SYNC_KEY, $key)) {
    http_response_code(401);
    echo json_encode(['error' => 'unauthorized']);
    exit;
}

// ---- db (everything wrapped so any DB error is reported back; safe because the
//      request already passed the sync-key auth check above) ----
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Auto-create the table on first run, so there's no separate phpMyAdmin step.
    $pdo->exec("CREATE TABLE IF NOT EXISTS ipw_progress (
        note_id    VARCHAR(190) PRIMARY KEY,
        status     VARCHAR(20)  NOT NULL,
        reviewed   BIGINT       NOT NULL DEFAULT 0,
        updated_at BIGINT       NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    if ($method === 'GET') {
        $rows = $pdo->query(
            "SELECT note_id AS id, status, reviewed, updated_at AS updatedAt FROM ipw_progress"
        )->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as &$r) { $r['reviewed'] = (int)$r['reviewed']; $r['updatedAt'] = (int)$r['updatedAt']; }
        echo json_encode(['progress' => $rows]);
        exit;
    }

    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (!is_array($body)) { http_response_code(400); echo json_encode(['error' => 'bad_json']); exit; }
        $items = isset($body['progress']) && is_array($body['progress'])
            ? $body['progress']
            : (isset($body['id']) ? [$body] : []);

        // last-write-wins by updated_at
        $sql = "INSERT INTO ipw_progress (note_id, status, reviewed, updated_at)
                VALUES (:id, :status, :reviewed, :updatedAt)
                ON DUPLICATE KEY UPDATE
                  status     = IF(VALUES(updated_at) >= updated_at, VALUES(status), status),
                  reviewed   = IF(VALUES(updated_at) >= updated_at, VALUES(reviewed), reviewed),
                  updated_at = GREATEST(updated_at, VALUES(updated_at))";
        $stmt = $pdo->prepare($sql);
        $n = 0;
        foreach ($items as $it) {
            if (empty($it['id']) || !isset($it['status'])) continue;
            $stmt->execute([
                ':id'        => substr((string)$it['id'], 0, 190),
                ':status'    => substr((string)$it['status'], 0, 20),
                ':reviewed'  => (int)(isset($it['reviewed']) ? $it['reviewed'] : 0),
                ':updatedAt' => (int)(isset($it['updatedAt']) ? $it['updatedAt'] : 0),
            ]);
            $n++;
        }
        echo json_encode(['ok' => true, 'saved' => $n]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed']);

} catch (Exception $e) {
    // shows the real reason (wrong DB user/password/name/host, etc.)
    http_response_code(500);
    echo json_encode(['error' => 'db', 'detail' => $e->getMessage()]);
    exit;
}

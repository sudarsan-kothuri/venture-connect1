<?php
/**
 * VENTURE CONNECT - Database Connection Handler
 * Tagline: From Idea to Investment
 *
 * Configured for standard local development environments (XAMPP / WAMP / MAMP / LAMP).
 */

header('Content-Type: application/json; charset=utf-8');

// Database configuration settings
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'venture_connect');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Establishes and returns a PDO database connection.
 *
 * @return PDO|null
 */
function getDBConnection() {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 5,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Return null so calling scripts can output a friendly, contextual response
        error_log('Database Connection Error: ' . $e->getMessage());
        return null;
    }
}
?>
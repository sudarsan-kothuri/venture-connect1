<?php
/**
 * VENTURE CONNECT - Contact Enquiry Backend Handler
 * Tagline: From Idea to Investment
 *
 * Validates, sanitizes, and records visitor enquiries into MySQL via PDO prepared statements.
 */

// Enable error reporting during development
error_reporting(E_ALL);
ini_set('display_errors', '0');

require_once __DIR__ . '/db.php';

// Detect whether the request expects JSON
$isAjax = false;
if (
    (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') ||
    (!empty($_SERVER['CONTENT_TYPE']) && stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) ||
    (!empty($_SERVER['HTTP_ACCEPT']) && stripos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
) {
    $isAjax = true;
}

// Function to send structured response
function sendResponse($status, $message, $extra = [], $isAjax = true) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status === 'success' ? 200 : 400);
        echo json_encode(array_merge([
            'status' => $status,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ], $extra));
        exit;
    } else {
        // Fallback for direct browser form submissions without JavaScript
        $redirectUrl = '../index.html?contact_status=' . urlencode($status) . '&contact_msg=' . urlencode($message) . '#contact';
        header("Location: $redirectUrl");
        exit;
    }
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Invalid request method. Only POST submissions are accepted.', [], $isAjax);
}

// Extract inputs (supporting both JSON payload and standard form data)
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

if (is_array($jsonData)) {
    $fullName = trim($jsonData['full_name'] ?? '');
    $email    = trim($jsonData['email'] ?? '');
    $subject  = trim($jsonData['subject'] ?? '');
    $message  = trim($jsonData['message'] ?? '');
    $honeypot = trim($jsonData['bot_field'] ?? '');
} else {
    $fullName = trim($_POST['full_name'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $subject  = trim($_POST['subject'] ?? '');
    $message  = trim($_POST['message'] ?? '');
    $honeypot = trim($_POST['bot_field'] ?? '');
}

// Anti-spam honeypot verification
if (!empty($honeypot)) {
    // Silently acknowledge bots without writing to the database
    sendResponse('success', 'Thank you! Your enquiry has been received.', [], $isAjax);
}

// Input validation checks
$errors = [];

if (empty($fullName)) {
    $errors[] = 'Full name is required.';
} elseif (mb_strlen($fullName) < 2 || mb_strlen($fullName) > 255) {
    $errors[] = 'Full name must be between 2 and 255 characters.';
}

if (empty($email)) {
    $errors[] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
} elseif (mb_strlen($email) > 255) {
    $errors[] = 'Email address is too long.';
}

if (empty($subject)) {
    $errors[] = 'Subject is required.';
} elseif (mb_strlen($subject) < 3 || mb_strlen($subject) > 255) {
    $errors[] = 'Subject must be between 3 and 255 characters.';
}

if (empty($message)) {
    $errors[] = 'Message is required.';
} elseif (mb_strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters long.';
} elseif (mb_strlen($message) > 5000) {
    $errors[] = 'Message cannot exceed 5000 characters.';
}

if (!empty($errors)) {
    sendResponse('error', implode(' ', $errors), ['errors' => $errors], $isAjax);
}

// Connect to MySQL
$pdo = getDBConnection();

if (!$pdo) {
    sendResponse(
        'error',
        'Database connection failed. Please ensure MySQL is running in your local environment (e.g. XAMPP) and the database `venture_connect` is imported.',
        ['help' => 'Run `venture_connect.sql` in phpMyAdmin or MySQL CLI.'],
        $isAjax
    );
}

// Prepare and execute insertion
try {
    $sql = 'INSERT INTO contact_messages (full_name, email, subject, message, created_at) 
            VALUES (:full_name, :email, :subject, :message, NOW())';
            
    $stmt = $pdo->prepare($sql);
    $executed = $stmt->execute([
        ':full_name' => htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8'),
        ':email'     => filter_var($email, FILTER_SANITIZE_EMAIL),
        ':subject'   => htmlspecialchars($subject, ENT_QUOTES, 'UTF-8'),
        ':message'   => htmlspecialchars($message, ENT_QUOTES, 'UTF-8')
    ]);

    if ($executed) {
        $insertId = $pdo->lastInsertId();
        sendResponse(
            'success',
            'Thank you, ' . htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8') . '! Your message has been saved in the Venture Connect database. Our ecosystem team will get back to you shortly.',
            ['enquiry_id' => $insertId],
            $isAjax
        );
    } else {
        sendResponse('error', 'Unable to record your message. Please try again later.', [], $isAjax);
    }
} catch (PDOException $e) {
    error_log('Contact Insert Query Error: ' . $e->getMessage());
    sendResponse('error', 'A database error occurred while saving your message: ' . $e->getMessage(), [], $isAjax);
}
?>
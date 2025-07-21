<?php
session_start();
header('Content-Type: application/json');

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Sanitization functions
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function sanitizePhone($number) {
    return preg_replace('/[^\d\+]/', '', $number);
}

// Basic honeypot anti-spam
if (!empty($_POST['website']) || !empty($_POST['url'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Spam detected.'
    ]);
    exit;
}

// CSRF check
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid CSRF token.'
    ]);
    exit;
}

// Sanitize inputs
$full_name = sanitize($_POST['full_name'] ?? '');
$email = sanitize($_POST['email'] ?? '');
$phone = sanitizePhone($_POST['phone'] ?? '');
$subject = sanitize($_POST['subject'] ?? 'Contact Form Submission');
$message = sanitize($_POST['message'] ?? '');

// Validate inputs
if ($full_name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format.'
    ]);
    exit;
}

if (!preg_match('/^\+?\d{10,15}$/', $phone)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid phone number.'
    ]);
    exit;
}

// Email settings
$recipient = 'mohan4u96@gmail.com';
$fromAddress = 'no-reply@craftikmodularinteriors.in';
$replyTo = "$full_name <$email>";

$headers = implode("\r\n", [
    "From: Neospace Integrals <$fromAddress>",
    "Reply-To: $replyTo",
    "Content-Type: text/html; charset=UTF-8"
]);

$emailSubject = $subject;
$body = "
    <h2>New Contact Form</h2>
    <p><strong>Name:</strong> $full_name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Message:</strong><br>" . nl2br($message) . "</p>
";

if (!mail($recipient, $emailSubject, $body, $headers)) {
    error_log("Mail to admin failed.");
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message. Please try again later.'
    ]);
    exit;
}

// Auto-reply
$autoReplySubject = 'Thank You for Contacting Us';
$autoReplyBody = "
    <h2>Thank You, $full_name!</h2>
    <p>We have received your message and will respond soon.</p>
    <hr>
    <p><strong>Your Message:</strong><br>" . nl2br($message) . "</p>
    <p>Best regards,<br>Craftik Interiors</p>
";

$autoReplyHeaders = implode("\r\n", [
    "From: Craftik Interiors <$fromAddress>",
    "Content-Type: text/html; charset=UTF-8"
]);

mail($email, $autoReplySubject, $autoReplyBody, $autoReplyHeaders);

// Update CSRF token
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
session_regenerate_id(true);

// Final response
echo json_encode([
    'success' => true,
    'message' => 'Form submitted successfully.',
    'csrf_token' => $_SESSION['csrf_token']
]);
?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $role = 'user'; // default role

    if (empty($username) || empty($email) || empty($password)) {
        echo 'error: missing data';
        exit;
    }

    $file = '../files/users.txt';

    $lines = file($file, FILE_IGNORE_NEW_LINES);
    $maxId = 0;
    for ($i = 1; $i < count($lines); $i++) {  // Skip header
        $parts = explode(',', $lines[$i]);
        if (count($parts) >= 1 && is_numeric($parts[0])) {
            $maxId = max($maxId, (int)$parts[0]);
        }
    }
    $id = $maxId + 1;

    // Check if username or email already exists
    for ($i = 1; $i < count($lines); $i++) {
        $parts = explode(',', $lines[$i]);
        if (count($parts) >= 3) {
            if ($parts[1] === $username) {
                echo 'error: username exists';
                exit;
            }
            if ($parts[2] === $email) {
                echo 'error: email exists';
                exit;
            }
        }
    }

    $newLine = "$id,$username,$email,$password,$role" . PHP_EOL;
    if (!is_writable($file)) {
        echo 'error: file not writable';
        exit;
    }
    if (file_put_contents($file, $newLine, FILE_APPEND) !== false) {
        echo 'success';
    } else {
        echo 'error: write failed';
    }
} else {
    echo 'error: invalid method';
}
?>
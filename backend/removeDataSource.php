<?php
$errorLevel = error_reporting();
error_reporting(0);

$path = "../databases/";
$dsn = null;
$feedback = [];

if (isset($_GET["dsn"]))
    $dsn = filter_var($_GET["dsn"], FILTER_SANITIZE_STRING);

$isDeleted = unlink($path . $dsn . ".json");

if ($isDeleted) {
    $feedback["code"] = 0;
    $feedback["message"] = $dsn . " deleted, successfully.";
} else {
    $feedback["code"] = -1;
    $feedback["message"] = "Error while deleting " . $dsn;
}

echo json_encode($feedback);

error_reporting($errorLevel);
?>
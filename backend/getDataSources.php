<?php
$errorLevel = error_reporting();
error_reporting(0);

$feedback = [];
$directory = "../databases";
$dataSourceNames = [];
$files = scandir($directory);
if (!$files) {
	array_push(
		$feedback, 
		array(
			"code" => -1,
			"message" => "Error while scanning databases directory!" 
		)
	);

	echo json_encode($feedback);
	exit();
}

foreach($files as $key => $file)
	if ($file !== "." && $file !== ".." && substr($file, -5) === ".json")
		array_push($dataSourceNames, substr($file, 0, -5));

echo json_encode($dataSourceNames);
error_reporting($errorLevel);
?>
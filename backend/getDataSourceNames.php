<?php
$directory = "../databases";
$files = scandir($directory);
$dataSourceNames = [];

foreach($files as $key => $file)
	if ($file !== "." && $file !== ".." && substr($file, -5) === ".json")
		array_push($dataSourceNames, substr($file, 0, -5));

echo json_encode($dataSourceNames);
?>
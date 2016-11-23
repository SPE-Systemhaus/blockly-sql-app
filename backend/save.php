<?php
// getting data
$xml = $_POST['xml'];
echo $xml;
$name = $_POST['name'];
//$container = $_POST['container'];
$file ="../samples/". $name .".xml";

try {
    // saving xml data into a file
    $handle = fopen($file, 'w');
    fwrite($handle, $xml);
    fclose($handle);
} catch (Exception $e) {
    throw new Exception("Speichern ist fehlgeschlagen !", 0, $e);
}
?>

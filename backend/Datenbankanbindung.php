<?php

/* PHP Page to establish the database 
 * connection an write the database 
 * in an XML File. */

/* Reference to the MySQLi-Database that is
 * accessed by all operations of the class.
 */
//$_database = null;

unlink("../../tmp/newXML.xml");

/* Connection without odbc */
/**
 * Reference to the MySQLi-Database that is
 * accessed by all operations of the class.
 */
//$_database = null;
//  $this->_database = new mysqli("localhost", "root", "", "classicmodels");

/* Connection with odbc
 * DNS: Exampledata
 * User:root
 * Password:         */
$datenbank = $_POST['datenbank'];

if($datenbank == "conn")
{
   $newconn= odbc_connect('Exampledata', 'root', '');
if (!$newconn) {
    exit("Connection Failed: " . $conn);
}
}else
{
  $newconn=odbc_connect('Lizenzdata','root','');
if (!$newconn) {
    exit("Connection Failed: " . $lizenzdata);
}; 
}
/*
 * SQL statements to select the Tablenames and rows for the data-Xml
 * @param $Tables: Container for the table selection
 * @param $Columtabs: Container for the colum selection
 */
$Tables = odbc_tables($newconn);
if (!$Tables) {
    exit("Error in SQL");
}

$Columtabs = odbc_columns($newconn);
if (!$Columtabs) {
    exit("Error in SQL");
}

/* Arrays for the table and collum-Names
 * @param: $tables: Array for tablenames [tablename]
 * @param: $collumt: Array for tablenames of the colum selection[tablename]
 * @param: $tcol: Array for columnames [columname]
 * @param: $colum:2D- Array for the combination of table - and columnames [[tablename],[columname]]
 */

$tables = array();
$collumt = array();
$tcol = array();
$colum = array();
$type = array();
/*
 * Function to retrieve the names of the tables from the selection and sogn it an array
 */

while (odbc_fetch_row($Tables)) {

    array_push($tables, odbc_result($Tables, "TABLE_NAME"));
}
$max = sizeof($tables);


/*
 * Function to retrieve the names of the collums from the selection and sign it to an 2D-Array
 */

while (odbc_fetch_row($Columtabs)) {

    array_push($collumt, odbc_result($Columtabs, "COLUMN_NAME"));
    array_push($tcol, odbc_result($Columtabs, "TABLE_NAME"));
    array_push($type, odbc_result($Columtabs, "TYPE_NAME"));
}
$bla = sizeof($tcol);

for ($n = 0; $n < $bla; $n++) {
    $colum[$n] = array();
    $colum[$n]["Table"] = $tcol[$n];
    $colum[$n]["Column"] = $collumt[$n];
    $colum[$n]["Type"] = $type[$n];
}

//for ($x = 0; $x < $bla; $x++) {
//    $colum[$x] = array();
//    echo $colum[$x]["Table"]; 
//    echo $colum[$x]["Column"]; 
//    echo $colum[$x]["Type"]; 
//}
$maxCol = sizeof($colum);


/* @param $Middle: variable to recieve a String from an Array
 * @param $mTable: variable to recieve a String from an Array
 * @param $mRow: variable to recieve a String from an Array
 */
$Middle;
$mTable;
$mRow;
$mType;
/* Start of the XML */
$xmlDom = new DOMDocument();
$xmlDom->appendChild($xmlDom->createElement('Tabels'));
$xmlRoot = $xmlDom->documentElement;

/* Filling the XML with data */

for ($x = 0; $x < $max; $x++) {
    $Middle = $tables[$x];

    $xmlRowElementNode = $xmlDom->createElement($Middle);


    for ($i = 0; $i < $maxCol; $i++) {
        $mTable = $colum[$i]["Table"];
        if ($mTable == $Middle) {
            $Mrow = $colum[$i]["Column"];
            $mType = $colum[$i]["Type"];
            $xmlRowElement = $xmlDom->createElement($Mrow);
           $xmlText = $xmlDom->createTextNode($mType);
$xmlRowElement->appendChild($xmlText);
            $xmlRowElementNode->appendChild($xmlRowElement);
        }
    }
    $xmlRoot->appendChild($xmlRowElementNode);
}




/* Saving XML to an document */

$xmlDom->save("../../tmp/newXML.xml");
odbc_close($newconn);
?>
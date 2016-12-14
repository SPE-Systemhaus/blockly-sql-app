# SQL Blockly App
We (SPE Systemhaus Gmbh) developed a SQL Workspace for Blockly, so that anyone can use this visual code editor and generate SQL Statements. Therefore new blocks were created to build these SQL Statements. A transformation from SQL Statements into SQL Blocks is possible, too. For this purpose we developed a SQL Parser which parses the statements and create a Blockly XML to load it into the workspace. For this parser we used a Parser Generator named Jison [https://zaa.ch/jison/docs/#usage-from-the-command-line].

## Abhängigkeiten
The Google Blockly Project is required [https://github.com/google/blockly].

Die SQL Blockly App muss in die DocumentRoot geklont werden. In der DocumentRoot muss sich ebenfalls neben dem Ordner mit dieser App ein Ordner mit dem Namen "common" befinden. Dieser sollte wiederum einen Ordner "libs" enthalten, in der sich blockly befindet. [common/libs/blockly]. Bei Verwendung von Blockly-Plugins sollte in dem Ordner "common" ebenfalls ein Ordner "plugins" angelegt werden, indem sich die Blockly-Plugins befinden sollten. 

## Connect with your database
To use the SQL Blockly App with a real database, you have to use ODBC (Open Database Connectivity). Create a ODBC Connection to your Database. If the connection is established you can add the connection into the SQL Blockly Workspace.
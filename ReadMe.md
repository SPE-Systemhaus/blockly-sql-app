# SQL Blockly App
We (SPE Systemhaus Gmbh) developed a Blockly SQL Workspace, so that anyone can use this visual code editor and generate SQL Statements. Therefore new blocks were created to build these SQL Statements. A transformation from SQL Statements into SQL Blocks is possible, too. For this purpose we developed a SQL Parser which parses the statements and create a Blockly XML to load it into the workspace. You can play on our Demo workspace on [http://sql.print2forms.de].

For this parser we used a Parser Generator named Jison [https://zaa.ch/jison/].


## Story
A bachelor's degree candidate started to develop it and write about the concept in her thesis. After she left us this project got dusty, because it wasn't 100% finished. So after 2 years we decided to remove the dust, rework the project, finish it and to publish it for all. Another Blockly Project we developed is a Regex Wizard [http://regex.print2forms.de/]. 

## Requirements
The Google Blockly Library [https://github.com/google/blockly] is required, to use the SQL Workspace. You can download the actual release from this link: [https://github.com/google/blockly/zipball/master]

## Requirements for development
If you want to start developing on this project, you need to install 
* NodeJS [https://nodejs.org/],
* Grunt [http://gruntjs.com/],
* Jison [https://zaa.ch/jison/] and 
* Bower [https://bower.io/]. 

Bower fetches the requirements of the needed Blocky Plugins [https://github.com/SPE-Systemhaus].

Die SQL Blockly App muss in die DocumentRoot geklont werden. In der DocumentRoot muss sich ebenfalls neben dem Ordner mit dieser App ein Ordner mit dem Namen "common" befinden. Dieser sollte wiederum einen Ordner "libs" enthalten, in der sich blockly befindet. [common/libs/blockly]. Bei Verwendung von Blockly-Plugins sollte in dem Ordner "common" ebenfalls ein Ordner "plugins" angelegt werden, indem sich die Blockly-Plugins befinden sollten.

## Connect with your database
To use the SQL Blockly App with a real database, you have to use ODBC (Open Database Connectivity). Create a ODBC Connection to your Database. If the connection is established you can add the connection into the SQL Blockly Workspace.
# SQL Blockly App
We (SPE Systemhaus Gmbh) developed a Blockly SQL Workspace, so that anyone can use this visual code editor and generate SQL Statements. Therefore new blocks were created to build these SQL Statements. A transformation from SQL Statements into SQL Blocks is possible, too. For this purpose we developed a SQL Parser which parses the statements and create a Blockly XML to load it into the workspace. You can play on our Demo workspace on [http://sql.print2forms.de].

## Story
A bachelor's degree candidate started to develop it and write about the concept in her thesis. After she left us this project got dusty, because it wasn't 100% finished. So after 2 years we decided to remove the dust, rework the project, finish it and to publish it for all. Another Blockly Project we developed is a Regex Wizard [http://regex.print2forms.de/]. 

## Requirements
The Google Blockly Library [https://github.com/google/blockly] is required, to use the SQL Workspace. You can download the actual release from this link: [https://github.com/google/blockly/zipball/master]
If you want to use the compressed version, you have to build this version by your own, because the date picker is commented and only if you need it you can comment this line out. So you have to go into the file core/blockly.js and comment the line with the following code `goog.require('Blockly.FieldDate');` out.

## Requirements for development
If you want to start developing on this project, you need to install 
* NodeJS [https://nodejs.org/],
* Grunt [http://gruntjs.com/],
* Bower [https://bower.io/] and
* Jison [https://zaa.ch/jison/]. 

Bower fetches the requirements of the needed Blocky Plugins [https://github.com/SPE-Systemhaus].

## Connect with your database
To use the SQL Blockly App with a real database, you have to use ODBC (Open Database Connectivity). Create a ODBC Connection to your Database. If the connection is established you can add the connection into the SQL Blockly Workspace.
# SQL Blockly App
We (SPE Systemhaus Gmbh) developed a Blockly SQL Workspace, so that anyone can use this visual code editor and generate SQL Statements. Therefore new blocks were created to build these SQL Statements. A transformation from SQL Statements into SQL Blocks is possible, too. For this purpose we developed a SQL Parser which parses the statements and create a Blockly XML to load it into the workspace. You can play on our Demo workspace on [http://sql.print2forms.de].

## Story
A bachelor's degree candidate started to develop it and write about the concept in her thesis. After she left the company this project got dusty, because it wasn't 100% finished. So after 2 years we decided to remove the dust, rework the project, finish it and to publish it for all.

## Requirements
The Google Blockly Library [https://github.com/google/blockly] is required, to use the SQL Workspace. You can download the actual release from this link: [https://github.com/google/blockly/zipball/master] or use the version I pushed into this repo, because if you want to use the compressed version, you have to build this version by your own, because the date picker is commented and only if you need it you can comment this line out. So you have to go into the file "core/blockly.js" and comment the line with the following code `goog.require('Blockly.FieldDate');` out or use the version in the libs folder of this repository.

## Requirements for development
If you want to start developing on this project, you need to install 
* NodeJS [https://nodejs.org/],
* Grunt [http://gruntjs.com/],
* Bower [https://bower.io/],
* Jison [https://zaa.ch/jison/],
* Google Closure Compiler [https://developers.google.com/closure/library/] (only if you want to build the Blockly library by yourself)
* Python (only if you want to build the Blockly library by yourself)

By using Bower all requirements will be fetched that are required for use and development. 

* Clone this repository
* `npm install` -> Getting all Grunt dependencies
* `bower update` -> Getting all Bower dependencies

For building Blockly by yourself you have todo two things:
* rename the folder "../common/modules/google-closure-library" to "../common/modules/closure-library"
* Go to file "../common/modules/GoogleBlockly/core/blockly.js" and comment out this line `goog.require('Blockly.FieldDate');`

## Connect with your database
To use the SQL Blockly App with a real database, you have to use ODBC (Open Database Connectivity). Create a ODBC Connection to your Database. If the connection is established you can add the connection into the SQL Blockly Workspace.
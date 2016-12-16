# SQL Blockly App
We (SPE Systemhaus Gmbh) developed a Blockly SQL Workspace, so that anyone can use this visual code editor and generate SQL Statements. Therefore new blocks were created to build these SQL Statements. A transformation from SQL Statements into SQL Blocks is possible, too. For this purpose we developed a SQL Parser which parses the statements and create a Blockly XML to load it into the workspace. You can play on our Demo Workspace on [http://sql.print2forms.de].

## Goal
The goal is giving people, with less knowledge of SQL, the ability to develop SQL Statements. No Joins are supported. Our audience are managers and housewives. 

## Requirements
The Google Blockly Library [https://github.com/google/blockly] is required, to use the SQL Workspace. You can download the actual release from this link: [https://github.com/google/blockly/zipball/master] or use the version I pushed into this repository. If you want to use the compressed version from the download, you have to build this version by your own, because the date picker is commented and only if you need it you can comment this line out. So you have to go into the file "core/blockly.js" and comment the line with the following code ```Javascript goog.require('Blockly.FieldDate');` out or use the version in the libs folder of this repository. 

PHP is required, additionally. Watch out: PHP 5.6 has a problem with ODBC connections !!! So you can't update or add ODBC connections to load the tables to the Blockly Workspace. 

## Requirements for development
If you want to start developing on this project, you need to install:
* Git [https://git-scm.com/]
* NodeJS [https://nodejs.org/]
* Bower [https://bower.io/] type `npm install -g bower`

If you want to build the Blockly library by yourself you need following, too:
* Python [https://www.python.org/]

By using Bower all requirements will be fetched that are required for production and development. You only have to do the following steps:
1. `git clone http://git ...` Cloning repository
2. `npm install` -> Getting all Grunt dependencies
3. `bower update` -> Getting all Bower dependencies
4. `grunt withJison` -> Building Parser
5. `grunt` -> Building SQL Workspace as single file

For building Blockly by yourself you have todo two things:
* rename the folder "../common/modules/google-closure-library" to "../common/modules/closure-library"
* Go to file "../common/modules/GoogleBlockly/core/blockly.js" and comment out this line `goog.require('Blockly.FieldDate');` because Date fields are used in the Workspace.

## Connecting with a database
To use the SQL Blockly App with a real database, you have to use ODBC (Open Database Connectivity). Create a ODBC Connection to your Database. If the connection is established you can add the connection into the SQL Blockly Workspace. ODBC 

## Parser
The Parser is generated with the help of the Jison Parser Generator [https://zaa.ch/jison/]. We created a grammar that can parse a set of SQL Statements which are relevant for SQL Newbies. In the folder docs of this repository a syntax diagram is located, which you can open in a webbrowser to get an overview of the developed SQL Grammar for Newbies. Preferably we tried to develop a generic Grammar which fits to MSSQL, MySQL, Oracle SQL, DB2 SQL, ...

## Structure

### Source
* Parser
* Blocks
* Generator
* constants.js
* main.js

## Story
A bachelor's degree candidate started to develop it and write about the concept in her thesis. After she left the company this project got dusty, because it wasn't 100% finished. So after 2 years we decided to remove the dust, rework the project, finish it and publish it for all.
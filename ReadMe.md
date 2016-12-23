# SQL Blockly App
The [SPE Systemhaus Gmbh](https://spe-systemhaus.de) developed a Blockly SQL workspace that enables everyone to visually edit and generate SQL statements. To achieve this, new blocks were created. A transformation from SQL statements into SQL Blocks is possible, as well. For this purpose we developed a SQL parser which parses the statements and create a Blockly XML to load it into the workspace. Try it out at our [Demo Workspace](https://sql.spe-systemhaus.de).

## Goal
We want everybody to be able to to generate simple SQL statements 
The goal is to give people, with less knowledge of SQL, the ability to develop their own SQL Statements. Our audience are managers and housewives.

## Usage
Since the SQL workspace is licensed under the Apache-2.0 License everybody is free to use it in their own projects.

## Requirements

- The [Google Blockly Library](https://github.com/google/blockly) is required, to use the SQL workspace. You can download the actual release from [here](https://github.com/google/blockly/zipball/master) or use the version available in this repository. If you want to use a compressed version, you have to build it your own. This is due to blocklys date picker which is deactivated in stock blockly but can be enabled by *commenting* the corresponind code lines *in*. To do this you have to edit the file `core/blockly.js` and comment the line with the following code `goog.require('Blockly.FieldDate');`. Alternativly you can use the `blockly.js` distributed in the libs folder of this repository. 

- Additionally, PHP is required. Watch out: PHP 5.6 has a problem with ODBC connections !!! So you can't update or add ODBC connections to load the tables to the Blockly Workspace. 

## Requirements for development
If you want to start developing on this project, you need to install:
* [Git](https://git-scm.com)
* [NodeJS](https://nodejs.org)
* [Bower](https://bower.io) type `npm install -g bower`
* [Grunt](http://gruntjs.com) type `npm install -g grunt`

By using Bower all requirements will be fetched that are required for production and development. You only have to do the following steps, initially:
1. `git clone https://github.com/SPE-Systemhaus/blockly-sql-app.git` -> Cloning repository
2. `npm install` -> Getting all Grunt dependencies
3. `bower update` -> Getting all Bower dependencies

For developing you can use the following commands:
* `grunt parser` -> Generates the Parser from the Grammar located in "src/parser/SQLGrammar.jison" into the build folder
* `grunt debug` -> Building SQL Workspace for debugging without concating the needed modules from the common folder in the build folder
* `grunt` or `grunt release` -> Create a release version with concating all modules from the common folder generate min version and min map file in dist folder

For building Blockly by yourself you have to do two things:
* Go to file "../common/modules/GoogleBlockly/core/blockly.js" and comment in this line `goog.require('Blockly.FieldDate');` because date fields are used in the workspace.
* [Python](https://www.python.org)

## Connecting with a database
ODBC (Open Database Connectivity) is used to connect the SQL Blockly App with a real database. Create a ODBC connection to your database. If the connection is established you can add the connection into the SQL Blockly workspace. For configuring for Windows see the following technet article:
* via [PowerShell](https://technet.microsoft.com/en-us/library/hh771022(v=wps.630).aspx)
* via [GUI](https://technet.microsoft.com/en-us/library/cc879308(v=sql.105).aspx)

## Parser
The parser is generated with the help of the [Jison](https://zaa.ch/jison) parser generator. We created a grammar that can parse a set of SQL statements which are relevant for SQL newbies. In the folder docs of this repository a syntax diagram is located, which you can open in a webbrowser to get an overview of the developed *SQL Grammar for Newbies* or see it [here](http://sql.spe-systemhaus.de/doc/syntax_diagram.xhtml) online. Preferably we tried to develop a generic grammar which fits to MSSQL, MySQL, Oracle SQL, DB2 SQL.

**Beware that the app doesn't support joins.**

## Directory structure

### backend (PHP)
* The three functions addDataSource, getDataSource and removeDataSource are located here
* Handles the ODBC connections and saving the DB structure into the database folder

### doc
* You find here a syntax diagram for the developed grammar as a xhtml file which was generated using the [Raildroad Diagram Generator](http://www.bottlecaps.de/rr/ui)
* There is a text file which is a cleaned grammar for the Railroad Diagram Generator

### help
* Location of the help files
* At the moment only english help

### lang
* The language files will be stored here 
* At the moment we support english and german.

### database
* Database meta data that is recieved using ODBC is stored here and used as cache so we don't have to repeadetly query the database. This even enables the user to go offline entirely.

### src
* Parser
    * Contains the SQL Grammar that is used to generate the parser using [Jison](http://zaa.ch/jison)
    * Location of the SQLXML class, which will be used to generate the Blockly XML to load this XML Dom into the Blockly Workspace.
* Blocks
    * Design and Behaviour of the block categories.
* Generator
    * Implementation of the SQL Blockly Generator.
* constants.js
    * Holds some global variables in the SQLBlockly namespace.
* exceptions.js
    * All own implemented exceptions are located in this file.
* Language.js
    * Holds some functions to change and update the language files.
    * The language files will be loaded, dynamically.
* main.js
    * Starting point of the application is the main() function, which is called onloading the body.
* SQLHelper.js
    * Has some help functions for generating blocks.

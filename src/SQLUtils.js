'use strict';

/*
 * Global variables and arrays for the SQL functions
 *
 * @param {type}Titel represents the title of a help page
 * @param {type}coBO represents the bordercolour of the helpdiv
 * @param {type}Table represents the tables of the database
 * @param {type}Column represents the columns of the database, also holds the corresponding colours
 * @param {type}colprod represents the colourgradients of the statement
 */
var Title = "";
var coBO = "";
var Table = new Array();
var Column = new Array();
var colprod = new Array();
var xmli;

var editor = null;

function clearInputList(block) {
    for (var inputKey in block.inputList)    /* Clearing inputs if exist */
        block.removeInput(block.inputList[inputKey].name);
}

/*-----------------------------------------------------------------------------
 * Reading XML - files
 *
 *@param {type} url the location of the xml
 *@returns {xhttp.responseXML}
 *----------------------------------------------------------------------------*/
function loadXMLDoc(url) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, false);
    xhttp.send("");
    return xhttp.responseXML;
}

/*------------------------------------------------------------------------------
 * load xml for the data
 *
 * @returns {xml}
 *----------------------------------------------------------------------------*/
function loadXMDW() {
    var xml = new XMLHttpRequest();
    xml.open('GET', 'samples/newXML.xml', false);
    xml.send("");
    xmli = xml.responseXML.documentElement;
}

/*------------------------------------------------------------------------------
 * Get lables  from XML
 *----------------------------------------------------------------------------*/
function getTableDatafromXML() {
    var x = xmli;
    var element;
    for (var i = 0; i < x.childNodes.length; i++)
    {
        element = x.childNodes[i];
        if (element.nodeType == 1)
        {
            Table[i] = new Array();
            Table[i][0] = element.nodeName;
        }
    }
}

/*------------------------------------------------------------------------------
 * Get colums  from XML
 *----------------------------------------------------------------------------*/
function getXMLColums() {
    var x = xmli;
    var element;
    var attribut;
    var type;

    for (var i = 0; i < x.childNodes.length; i++)
    {
        element = x.childNodes[i];
        if (element.nodeType == 1)
        {

            Column[i] = new Array();
            Column[i][0] = element.nodeName;//Give the Firstnode the Tablename
            if (element.hasChildNodes() == true)
            {
                for (var j = 1; j <= element.childNodes.length; j++)
                {

                    attribut = element.childNodes[j - 1];
                    for (var k = 1; k <= attribut.childNodes.length; k++) {
                        type = attribut.childNodes[k - 1];
                        //console.log(attribut.childNodes[k - 1].nodeValue);
                        if (attribut.nodeType == 1 && type.nodeType == 3)
                        {
                            Column[i][j] = new Array();
                            Column[i][j][1] = attribut.nodeName;//Give the Columns of the tavle
                            Column[i][j][2] = type.nodeValue;
                        }
                    }
                }
            }
        }
    }
}

/*------------------------------------------------------------------------------
 * Get Dropdown from  string
 *----------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------
 * Fill Dropdown with data from a String (unsused)
 *
 * @param {type} values - represents the dropdown values
 * @returns {Array}
 *----------------------------------------------------------------------------*/
function setDropdownValues(values) {
    var values_ = new Array();
    var optionValues = new String(values_);
    var optionsForTabeles = new Array();
    var options = values;
    optionValues = options.split(',');
    for (var j = 0; j < optionValues.length; j++) {

        optionsForTabeles[j] = new Array(); //3 Dimension
        optionsForTabeles [j][0] = optionValues[j];
        optionsForTabeles[j][1] = optionValues[j];
    }
    return optionsForTabeles;
}

/*------------------------------------------------------------------------------
 * Get dropdown data from global variables
 *----------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------
 * Get data for the column dropdown from global variable Table
 * @param {type} type -represents the type of the table
 * @returns {Array}
 *----------------------------------------------------------------------------*/
function getTableDropdowndataFromXML() {
    var optionsForTabeles = new Array();
    for (var j = 0; j < Table.length; j++) {
        optionsForTabeles[j] = new Array(); //3 Dimension
        optionsForTabeles [j][0] = Table[j][0];
        optionsForTabeles[j][1] = Table[j][0];
    }
    return optionsForTabeles;
}

/*------------------------------------------------------------------------------
 * Get data for the column dropdown from global variable Column
 *
 * @param {type} tabledata represents name of the choosen table
 * @param {type} type represents the type of chossen Table
 * @returns {Array}
 *----------------------------------------------------------------------------*/
function getColumDatafromXML(tabledata, type) {
    var optionForColums = new Array();
    optionForColums[0] = new Array();
    var i = 0;
    var j = 1;

    for (var x = 0; x < Column.length; x++) {
        for (var z = 1; z < Column[x].length; z++) {
            if (type == 'cols') {
                if (Column[x][0] == tabledata) {

                    optionForColums [i] = new (Array);
                    optionForColums [i][0] = Column[x][z][1];
                    optionForColums[i][1] = Column[x][z][1];
                    //Numeric
                    if (Column[x][z][2] == 'integer' ||
                        Column[x][z][2] == 'integer unsigned' ||
                        Column[x][z][2] == 'double' ||
                        Column[x][z][2] == 'smallint' ||
                        Column[x][z][2] == 'float' ||
                        Column[x][z][2] == 'bigint' ||
                        Column[x][z][2] == 'decimal') {
                        optionForColums[i][2] = 255;
                        i++;
                    } else {
                        //date
                        if (Column[x][z][2] == 'date' ||
                            Column[x][z][2] == 'datetime') {
                            optionForColums[i][2] = 330;
                            i++;
                        } else {
                            //text
                            if (Column[x][z][2] == 'varchar' ||
                                Column[x][z][2] == 'text') {
                                optionForColums[i][2] = 15;
                                i++;
                            } else {
                                //bool
                                if (Column[x][z][2] == 'tinyint' ||
                                    Column[x][z][2] == 'tinyint unsigned') {
                                    optionForColums[i][2] = 160;
                                    i++;
                                }
                            }

                        }
                    }
                }

            }
            else {
                optionForColums [0][0] = "*";
                optionForColums[0][1] = "*";
                optionForColums[0][2] = 115;
                if (Column[x][0] == tabledata) {
                    optionForColums [j] = new (Array);
                    optionForColums [j][0] = Column[x][z][1];
                    optionForColums[j][1] = Column[x][z][1];
                    //numeric
                    if (Column[x][z][2] == 'integer' ||
                        Column[x][z][2] == 'integer unsigned' ||
                        Column[x][z][2] == 'double' ||
                        Column[x][z][2] == 'smallint' ||
                        Column[x][z][2] == 'float' ||
                        Column[x][z][2] == 'bigint' ||
                        Column[x][z][2] == 'decimal') {
                        optionForColums[j][2] = 255;
                        j++;
                    }
                    else {
                        //date
                        if (Column[x][z][2] == 'date' ||
                            Column[x][z][2] == 'datetime') {
                            optionForColums[j][2] = 330;
                            j++;
                        }
                        else {
                            //text
                            if (Column[x][z][2] == 'varchar' ||
                                Column[x][z][2] == 'text') {
                                optionForColums[j][2] = 15;
                                j++;
                            }
                            else {
                                //bool
                                if (Column[x][z][2] == 'tinyint' ||
                                    Column[x][z][2] == 'tinyint unsigned') {
                                    optionForColums[j][2] = 160;
                                    j++;
                                }
                            }

                        }
                    }
                }
            }
        }
    }

    return optionForColums;
}

/**
 * This functions returns an array with columns, which can 
 * be used in Blockly DropDownFieldValues.
 * 
 * @param {String} tableName Name of the table, which should return all columns.
 * @pram {bool} withAll Return with '*' as column or not as first entry. 
 * @return {Array} optionsForColumns Every Column of the requested table.
 */
function getColumnDropdowndataFromXML(tableName, withAll) {
    var optionsForColumns = new Array();
    
    for (var i = 0; i < Column.length; i++) {
        if (Column[i][0] === tableName) {
            if (withAll) {
                optionsForColumns[0] = new Array();
                optionsForColumns[0][0] = "*";
                optionsForColumns[0][1] = "*";
            }

            for (var j = 1; j < Column[i].length; j++) {
                var optCnt = j;

                if (!withAll)
                    optCnt = j - 1;

                optionsForColumns[optCnt] = new Array();
                optionsForColumns[optCnt][0] = Column[i][j][1];
                optionsForColumns[optCnt][1] = Column[i][j][1];
            }
        }
    }

    return optionsForColumns;
}

/*-----------------------------------------------------------------------------
 * Checking inputs
 *----------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
 * Checking the text inputs of the of an textinputfiled. Sets an alert if there
 * are to much variables.
 *
 * @ param {type} text- the inputtext
 * @return {text}
 *----------------------------------------------------------------------------*/
function checkNumeric(text) {
    var exp = /^-?(\d+(\.\d{0,4})?)$/g;
    try {
        if (text.match(exp))
            return text;

        return null;
    } catch (e) {
        return text;
    }
}

/*------------------------------------------------------------------------------
 * Loading the data from database into the Xml and filling the global
 * variables
 *----------------------------------------------------------------------------*/
function getData() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.response);
        }
    };
    loadXMDW();
    getTableDatafromXML();
    getXMLColums();
}

/*------------------------------------------------------------------------------
 * Set the colour of a block, if it is the parent Block of a particular block
 *
 * @ param {type} object-symbolizes the block, which uses the function
 *----------------------------------------------------------------------------*/
function colourTheParent(block) {
    if (!block)
        return;
    
    var parent = block.getParent();
    var gradient = new ColourGradient();

    if (parent) {
        block.lastConnectedParent = parent;
        
        if (parent.getColour !== block.getColour()) {
            switch(parent.type) {
                case "compare_operator" :
                case "conditions" :
                case "logical_conjunction" :
                case "to":
                    gradient.setHorizontalGradient(/*parent,*/ block);
                    break;
            }
        }
    } else {    /* Resetting color if disonnected */
        if (block.lastConnectedParent)
            block.lastConnectedParent.setColour(
                block.lastConnectedParent.getColour()
            );
    }
}

/*------------------------------------------------------------------------------
 * Closes the help div
 *----------------------------------------------------------------------------*/
function closehelp() {
    if (document.getElementById('help').style.display == 'block') {
        var help = document.getElementById('help');
        var close = document.getElementById('close');
        help.style.display = "none";
        close.style.visibility = 'hidden';
    } else {
        if (document.getElementById('showTestSQL').style.display == 'block') {
            var help = document.getElementById('showTestSQL');
            var close = document.getElementById('closed');
            help.style.display = "none";
            close.style.visibility = 'hidden';
        } else {
            if (document.getElementById('writeSQL').style.display == 'block') {
                var help = document.getElementById('writeSQL');
                var close = document.getElementById('closea');
                var area = help.childNodes[3];
                area.value = '';
                help.style.display = "none";
                close.style.visibility = 'hidden';
            }
        }
    }
}

/**
 * Getting the colour of the first table_column child. If there is more
 * than one child, the colour of the block will be taken.
 * 
 * @param {Blockly.Block} block Current block.
 * @return {String} colour The colour of the child or of the current block.
 */
function getChildColour(block) {
    var stopColor = block.getColour();
    var children = block.getChildren();

    /* Get the colour of the first table_column block and set 
        this on the select block */
    for (var childKey in children) {
        var child = children[childKey];
        if (child.type === "tables_and_columns") {
            if (child.getChildren().length === 0) {
                stopColor = child.getColour();
                return stopColor;
            }
        }
    }

    return stopColor;
}

function checkUndefined(value) {
    if (typeof value === "undefined")
        return false;

    return value;
}

function createBlock(workspace, name) {
    var block = workspace.newBlock(name);
    block.initSvg();
    block.render();

    return block;
}

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

    //Column.length = 0;

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
 * Changes to horizontal coloursheme
 *
 * @ param {type} object-symbolizes the block, which uses the function
 * @ param {type} colour-symbolizes the block, which colours the object
 *----------------------------------------------------------------------------*/
function horizontalColouration(object, colour) {
    switch (colour.getColour()) {
        case  15 :
            //text gradient
            object.setColour(3160);
            break;
        case 160:
            //bool
            object.setColour(160);
            break;
        case 255:
            //numeric gradient
            object.setColour(2160);
            break;
        case 330:
            //date gradient
            object.setColour(1160);
    }
}
/*------------------------------------------------------------------------------
 * Changes to vertical coloursheme
 *
 * @ param {type} object-symbolizes the block, which uses the function
 * @ param {type} colour-symbolizes the block, which colours the object
 *----------------------------------------------------------------------------*/
function verticalColouration(object, colour) {
    switch (colour.getColour()) {
        case  15 :
            //text gradient
            object.setColour(5015);
            break;
        case 160:
            //bool
            object.setColour(160);
            break;
        case 255:
            //numeric gradient
            object.setColour(6255);
            break;
        case 330:
            //date gradient
            object.setColour(4330);
            break;
        case 115:
            //list gradient
            object.setColour(7115);
            break;
    }
}
/*------------------------------------------------------------------------------
 * Changes to full coloursheme
 *
 * @ param {type} object-symbolizes the block, which uses the function
 * @ param {type} colour-symbolizes the block, which colours the object
 *----------------------------------------------------------------------------*/
function fullColouration(object, colour) {
    switch (colour.getColour()) {
        //setting the colour
        case  15 :
            //text
            object.setColour(15);
            break;
        case 160:
            //bool
            object.setColour(160);
            break;
        case 255:
            //numeric
            object.setColour(255);
            break;
        case 330:
            //date
            object.setColour(330);
            break;
        case 115:
            //list
            object.setColour(115);
            break;
    }
}
/*------------------------------------------------------------------------------
 * Changes vertical to horizontal coloursheme
 *
 * @ param {type} object-symbolizes the block, which uses the function
 * @ param {type} colour-symbolizes the block, which colours the object
 *----------------------------------------------------------------------------*/
function verticaltohorizontal(object, colour) {
    switch (colour.getColour()) {
        case 160:
            //bool
            object.setColour(160);
            break;
        case 4330:
            //date gradient
            object.setColour(1160);
            break;
        case 5015:
            //text gradient
            object.setColour(3160);
            break;
        case 6255:
            //numeric gradient
            object.setColour(2160);
            break;
        case 7115:
            //list gradient
            object.setColour(9160);
            break;
    }
}



/*------------------------------------------------------------------------------
 * Set the colour of a block, if it is the parent Block of a particular block
 *
 * @ param {type} object-symbolizes the block, which uses the function
 *----------------------------------------------------------------------------*/
function colourTheParent(block) {
    var parent = block.getParent();
    var gradient = new ColourGradient();

    if (parent) {       
        if (parent.getColour !== block.getColour() &&
            Blockly.dragMode_ === Blockly.DRAG_NONE) {
            switch(parent.type) {
                case "compare_operator" :
                case "conditions" :
                case "logical_conjunction" :
                    gradient.setHorizontalGradient(parent, block);
                    break;
            }
        }
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

/*------------------------------------------------------------------------------
 * Fetchs a link in the help div
 *
 * @param{type} link symolises the link which is klicked
 * @param{type} colour represents the bordercolour
 *----------------------------------------------------------------------------*/
function fetchthelink(link, color) {
    var a = window.object.document.getElementById("help"), b = window.object.document.getElementById("content"), c = b.getElementsByTagName("h1"), e = new XMLHttpRequest, f = window.object.document.getElementById("close");

    if (link) {
        coBO = a.style.borderColor;
        Title = c[0].innerHTML;
        a.style.borderColor = color;
        var string = '<span  class="right pointer" style ="color:' + color + '; font-weight: bold;" onclick="fetchthelink();">'
                + 'BACK'
                + '</span>';

        e.open("GET", link, !1);
        e.send("");
        0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
        b.innerHTML = e.response;
        var j = window.object.document.getElementById('aliasback');
        j.innerHTML = string;
        if (Title == "Alias variable")
            window.location.hash = "#alias";
    } else {   
        switch (Title) {    //catching the back-button link
            case "Alias variable" :
                e.open("GET", "Help/fieldname_get.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Groupfunction":
                e.open("GET", "Help/groupfunction/avg.html", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Select":
                e.open("GET", "Help/select.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Insert":
                e.open("GET", "Help/insert.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Update":
                e.open("GET", "Help/update.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Subselect (section 'SELECT')":
                e.open("GET", "Help/sub_select.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Subselect (section 'WHERE')":
                e.open("GET", "Help/sub_select_where.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Tables and columns(list)":
                e.open("GET", "Help/tables_and_colums.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Tables and columns(variable)":
                e.open("GET", "Help/tables_and_colums.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "OR":
                e.open("GET", "Help/OR_BOOL.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "NOT":
                e.open("GET", "Help/conditions.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Numeric variable":
                e.open("GET", "Help/num.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Text variable":
                e.open("GET", "Help/string.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Date variable":
                e.open("GET", "Help/date.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Boolean variable":
                e.open("GET", "Help/bool.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Distinct":
                e.open("GET", "Help/distinct.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "Mathematically operator":
                e.open("GET", "Help/terms_simple_expressions.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
            case "TO":
                e.open("GET", "Help/to.html ", !1);
                e.send("");
                0 < b.childNodes.length && b.removeChild(b.childNodes[0]);
                b.innerHTML = e.response;
                a.style.borderColor = coBO;
                break;
        }
    }
}
/*------------------------------------------------------------------------------
 * Function to toggle html elements
 *
 * @param table - symbolizes the html element
 * @param picture -symbolizes the picture, which toggles the element
 *----------------------------------------------------------------------------*/

function toggleTable(table, picture)
{

    if (document.getElementById(table).style.display == "table") {
        document.getElementById(table).style.display = "none";
        document.getElementById(picture).src = "Files/help_screens/black22.png";
        document.getElementById(picture).alt = "More ";

    } else {
        document.getElementById(picture).src = "Files/help_screens/minus42.png";
        document.getElementById(table).style.display = "table";
        document.getElementById(picture).alt = "Less ";
    }
}
/*------------------------------------------------------------------------------
 * Function to set the stop value sof the svg colour gradients
 *
 * @param object -symbolizes the Block, which uses the function
 *----------------------------------------------------------------------------*/
function setgradientheight(object) {
    //if (object.getColour() > 160) {
        var blockHeight = object.svg_.height;
        var inputs = object.inputList;
        var selectinputHeight = inputs[0].renderHeight;
        var whereInputHeight = inputs[1].renderHeight;
        var startGrad = (100 / blockHeight) * (selectinputHeight + 10);
        var stopGrad = (100 / blockHeight) * (selectinputHeight + whereInputHeight + 20);
        var firstGrad = Math.round(startGrad) + "%";
        var secondGrad = Math.round(stopGrad) + "%";
        var temp = new Array();
        if (colprod.length > 0) {
            for (var x = 0; x < colprod.length; x++) {
                if (colprod[x][4] == object.getColour())
                {
                    if (colprod[x][0] > blockHeight && colprod[x][3] != object.id)
                    {
                        temp = colprod[x];
                    }
                }
            }
        }
        if (temp.length > 0) {
            switch (object.getColour()) {
                case 6255:
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[4].childNodes[0].setAttribute("offset", temp[1] + '%');
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[4].childNodes[1].setAttribute("offset", temp[2] + '%');
                    break;
                case 5015:
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[5].childNodes[0].setAttribute("offset", temp[1] + '%');
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[5].childNodes[1].setAttribute("offset", temp[2] + '%');
                    break;
                case 4330:
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[6].childNodes[0].setAttribute("offset", temp[1] + '%');
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[6].childNodes[1].setAttribute("offset", temp[2] + '%');
                    break;
                case 7115:
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[7].childNodes[0].setAttribute("offset", temp[1] + '%');
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[7].childNodes[1].setAttribute("offset", temp[2] + '%');
                    break;
            }
        } else {
            switch (object.getColour()) {
                case 6255:
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[4].childNodes[0].setAttribute("offset", firstGrad);
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[4].childNodes[1].setAttribute("offset", secondGrad);
                    break;
                case 5015:
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[5].childNodes[0].setAttribute("offset", firstGrad);
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[5].childNodes[1].setAttribute("offset", secondGrad);
                    break;
                case 4330:
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[6].childNodes[0].setAttribute("offset", firstGrad);
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[6].childNodes[1].setAttribute("offset", secondGrad);
                    break;
                case 7115:
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[7].childNodes[0].setAttribute("offset", firstGrad);
                    object.workspace.svgGroup_.childNodes[1].ownerSVGElement.childNodes[0].childNodes[7].childNodes[1].setAttribute("offset", secondGrad);
                    break;
            }

            var z = colprod.length - 1;
            colprod[z + 1] = new Array();
            colprod[z + 1][0] = blockHeight;//length of block
            colprod[z + 1][1] = Math.round(startGrad);//min grad
            colprod[z + 1][2] = Math.round(stopGrad);//7max grad
            colprod[z + 1][3] = object.id;//Id of object
            colprod[z + 1][4] = object.getColour();

        }
    //}
}
/*------------------------------------------------------------------------------
 * Function to set colour of the if-function-block
 *
 * @param object -symbolizes the Block, which uses the function
 * @param child -symbolizes the Block, colours the object
 *----------------------------------------------------------------------------*/
function colourIF(object, child) {
    switch (child.getColour()) {
        //Setting colourgradient and adjusting the stop parameters
        case  15 :
            //text gradient
            object.setColour(15);
            break;
        case  5015 :
            //text gradient
            object.setColour(15);
            break;
        case 160:
            //bool
            object.setColour(160);
            break;
        case 255:
            //numeric gradient
            object.setColour(255);
            break;
        case 6255:
            //numeric gradient
            object.setColour(255);
            break;
        case 330:
            //date gradient
            object.setColour(330);
            break;
        case 4330:
            //date gradient
            object.setColour(330);
            break;
        case 115:
            //list gradient
            object.setColour(115);
            break;
        case 7115:
            //list gradient
            object.setColour(115);
            break;
    }
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
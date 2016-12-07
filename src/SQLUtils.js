/*******************************************************************************
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)
 * 
 ******************************************************************************/

var dbStructure = {};   /* Global Database Structure, which is read from the JSON file */
var editor = null;      /* Global SQL Code Editor variable */

/**
 * Loading database Structure into the Global Database Structure variable.
 * A JSON file will be read from the folder "databases", which was generated.
 * 
 * @param {String} dsn Data Source Name of the ODBC connection.
 */
function loadDatabaseStructure(dsn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "databases/" + dsn + ".json", true);
    xhr.responseType = "json";
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            dbStructure = xhr.response;
            initBlockly();
        }
    };

    xhr.send();
}

/**
 * Get all existing tables of the global Database Structure variable
 * as Array.
 * 
 * @return {Array} tables All tables that 
 */
function getTablesArrayFromStructure() {
    return Object.keys(dbStructure);
}

/**
 * Get all columns of the global Database Structure variable by
 * a given table name as Array.
 * 
 * @param {String} tableName Name of the table, that should return his columns.
 * @return {Array} columns All columns that are in the table.
 */
function getColumnsArrayFromStructure(tableName) {
    return dbStructure[tableName];
}

/**
 * This functions returns an array with columns, which can 
 * be used in Blockly DropDownFieldValues.
 * 
 * @return {Array} options Array for Blockly.Dropdown.
 */
function getTableDropdowndata() {
    var tables = getTablesArrayFromStructure();
    var options = [];

    for (var table in dbStructure) {
        var option = [];
        option[0] = table;
        option[1] = table;
        options.push(option);
    }

    return options;
}

/**
 * This functions returns an array with columns, which can 
 * be used in Blockly DropDownFieldValues.
 * 
 * @param {String} tableName Name of the table, which should return all columns.
 * @pram {bool} withAll Return with '*' as column or not as first entry. 
 * @return {Array} options Array for Blockly.Dropdown.
 */
function getColumnDropdowndata(tableName, withAll) {   
    var columns = getColumnsArrayFromStructure(tableName);
    var options = new Array();

    if (withAll) {
        options[0] = new Array();
        options[0][0] = "*";
        options[0][1] = "*";
    }

    for (var i = 0; i < columns.length; i++) {
        var optCnt = i;
        
        if (withAll)
            optCnt++;

        options[optCnt] = new Array();
        options[optCnt][0] = columns[i].name;
        options[optCnt][1] = columns[i].name;
    }

    return options;
}

/**
 * Checking the text inputs of the of an textinputfiled. Sets an alert if there
 * are to much variables.
 *
 * @param {type} text- the inputtext
 * @return {text}
 */
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

/**
 * Set the colour of a block, if it is the parent Block of a particular block.
 *
 * @param {type} object-symbolizes the block, which uses the function
 */
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

/**
 * Checking if value is undefined.
 * 
 * @param {any} value Value that should be checked.
 * @return {any} value/bool Returns if undefined false, else the sent value.
 */
function checkUndefined(value) {
    if (typeof value === "undefined")
        return false;

    return value;
}

/**
 * Create on the specific workspace a new Blockly.Block.
 * 
 * @param {Blockly.Workspace} workspace Blockly Workspace, where the block should be added.
 * @param {String} name Name of the block that should be created.
 * @return {Blockly.Block} block The created block.
 */
function createBlock(workspace, name) {
    var block = workspace.newBlock(name);
    block.initSvg();
    block.render();

    return block;
}

/**
 * Clearing all inputs of a block that are existing at the moment.
 * 
 * @param {Blockly.Block} block The inputs of this block will be removed.
 */
function clearInputList(block) {
    for (var inputKey in block.inputList)
        block.removeInput(block.inputList[inputKey].name);
}

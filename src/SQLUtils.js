/******************************************************************************
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)                   *
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)            *
 ******************************************************************************/

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

        if (parent.getColour() !== block.getColour()) {
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
        /*if (block.lastConnectedParent)
            block.lastConnectedParent.setColour(
                block.lastConnectedParent.getColour()
            ); */
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

function addGroupByInput(block) {
    block.groupByCount_ = 1;
    block.appendStatementInput('group_by')
         .setCheck(["table_column", "name"])
         .appendField(SQLBlocks.Msg.Blocks.GROUP_BY);
}

function addHavingInput(block) {
    block.groupByHavingCount_ = 1;
    block.appendValueInput('having')
         .setCheck(["LogicOPs", "condition", "table_column"])
         .appendField(SQLBlocks.Msg.Blocks.HAVING);
}

function addOrderByInput(block) {
    block.orderByCount_ = 1;
    block.appendStatementInput('order_by')
         .setCheck(["table_column", "name"])
         .appendField(SQLBlocks.Msg.Blocks.ORDER_BY);
    block.appendDummyInput("sort")
         .appendField(new Blockly.FieldDropdown(sort), "sort");
}

function addLimitInput(block) {
    block.limitCount_ = 1;
    block.appendValueInput('limit')
         .setCheck('number')
         .appendField(SQLBlocks.Msg.Blocks.LIMIT);
}

function addAliasInput(block) {
    block.aliasCount_ = 1;
    block.appendDummyInput('VALUE')
         .appendField(SQLBlocks.Msg.Blocks.VARIABLES_SET_TITLE)
         .appendField(new Blockly.FieldTextInput(
            Blockly.Msg.VARIABLES_SET_ITEM), 'VAR');
    block.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    block.contextMenuType_ = 'fieldname_get';
}

function removeGroupByInput(block) {
    if (block.getInput("group_by")) {
        block.groupByCount_ = 0;
        block.removeInput("group_by");

        removeHavingInput(block);
    }
}

function removeHavingInput(block) {
    if (block.getInput("having")) {
        block.groupByHavingCount_ = 0;
        block.removeInput("having");
    }
}

function removeOrderByInput(block) {
    if (block.getInput("order_by")) {
        block.orderByCount_ = 0;
        block.removeInput('order_by');
        block.removeInput('sort');
    }
}

function removeLimitInput(block) {
    if (block.getInput("limit")) {
        block.limitCount_ = 0;
        block.removeInput('limit');
    }
}

function removeAliasInput(block) {
    if (block.getInput("VALUE")) {
        block.aliasCount_ = 0;
        block.removeInput("VALUE");
    }
}

function decomposeGroupBy(workspace, block, mutator) {
    if (block.groupByCount_ === 1) {
        var groupByBlock = createBlock(workspace, "group_by");
        mutator.getInput("group_by").connection.connect(groupByBlock.outputConnection);
        
        if (block.groupByHavingCount_) {
            var havingBlock = createBlock(workspace, "having");
            groupByBlock.getInput("having").connection.connect(havingBlock.outputConnection);
        }
    }
}

function composeGroupBy(block, mutator) {
    var groupByBlock = mutator.getInputTargetBlock("group_by");
    if (groupByBlock) {
        if (block.groupByCount_ === 0)
            addGroupByInput(block);                  

        if (groupByBlock.getInputTargetBlock("having")) {
            if (block.groupByHavingCount_ < 1)
                addHavingInput(block);           
        } else
            removeHavingInput(block);
    } else
        removeGroupByInput(block);     
}

function decomposeOrderBy(workspace, block, mutator) {
    if (block.orderByCount_ === 1) {
        var orderByBlock = createBlock(workspace, "order_by");
        mutator.getInput("order_by").connection.connect(orderByBlock.outputConnection);
    }
}

function composeOrderBy(block, mutator) {
    if (mutator.getInputTargetBlock("order_by")) {
        if (block.orderByCount_ === 0)
            addOrderByInput(block);
    } else 
        removeOrderByInput(block);
}

function decomposeLimit(workspace, block, mutator) {
    if (block.limitCount_ === 1) {
        var limitBlock = createBlock(workspace, "limit");
        mutator.getInput("limit").connection.connect(limitBlock.outputConnection);
    }
}

function composeLimit(block, mutator) {
    if (mutator.getInputTargetBlock("limit")) {
        if (block.limitCount_ === 0)
            addLimitInput(block);
    } else
        removeLimitInput(block);          
}

function decomposeAlias(workspace, block, mutator) {
    if (block.aliasCount_ === 1) {
        var aliasBlock = createBlock(workspace, "alias");
        mutator.getInput("alias").connection.connect(aliasBlock.outputConnection);
    }
}

function composeAlias(block, mutator) {
    if (mutator.getInputTargetBlock("alias")) {
        if (block.aliasCount_ === 0)
            addAliasInput(block);
    } else
        removeAliasInput(block);
}

function sortInputs(block) {
    /* Priority array */
    var inputPriority = {
        "bla" : 1,
        "select" : 2,
        "Clause" : 3,
        "group_by" : 4,
        "having" : 5,
        "order_by" : 6,
        "sort" : 7,
        "limit" : 8,
        "VALUE" : 9     /* ALIAS */
    };
    
    block.inputList.sort(function(a, b) {
        console.log(a.name);
        console.log(b.name);
        console.log(inputPriority[a.name] - inputPriority[b.name]);
        return inputPriority[a.name] - inputPriority[b.name];
    });

    block.render();
}

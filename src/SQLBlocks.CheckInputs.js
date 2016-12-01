/*******************************************************************************
 * Inside this file are the Check functions for the SQL Blocks, to reduce
 * user errors while building SQL Statements.
 * 
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)
 * 
 ******************************************************************************/

/*------------------------------------------------------------------------------
 * Checking the variableinsert
 * @ param{type} object-symbolizes the block, which uses the function
 *----------------------------------------------------------------------------*/
function checkInsertStatement(object) {
    var sC = object.setCount_;
    var tab = new Array();

    for (var i = 0; i <= sC; i++) {
        if (object.getInputTargetBlock('set' + i) != null) {
            var toElement = object.getInputTargetBlock('set' + i);
            var insertElement = toElement.getInputTargetBlock('A');

            if (insertElement != null) {
                tab[i] = new Array();
                tab[i][0] = insertElement.getFieldValue('tabele');
                tab[i][1] = insertElement.getFieldValue('Column');
                if (tab.length > 1) {
                    if (tab[0][0] == tab[i][0]) { //Compare the Tables 
                        for (var j = 0; j < tab.length - 1; j++) {
                            if (tab[j][1] == tab[i][1]) {
                                if (insertElement.warning) {
                                    if (insertElement.warning.getText() !== SQLBlocks.Msg.Warnings.TWO_VALUES_SAME_COLUMN) {
                                        insertElement.setWarningText(SQLBlocks.Msg.Warnings.TWO_VALUES_SAME_COLUMN);
                                    }
                                } else
                                    insertElement.setWarningText(SQLBlocks.Msg.Warnings.TWO_VALUES_SAME_COLUMN);
                            } else {
                                insertElement.setWarningText(null);
                            }
                        }
                    } else {
                        if (insertElement.warning) {
                            if (insertElement.msg !== SQLBlocks.Msg.Warnings.TWO_VALUES_SAME_COLUMN) {
                                insertElement.setWarningText(SQLBlocks.Msg.Warnings.DIFFERENT_TABLES);
                            } else
                                insertElement.setWarningText(null);
                        } else
                            insertElement.setWarningText(null);
                    }
                }
            }
        } else
            break;
    }
}

/*------------------------------------------------------------------------------
 * Checking the values of the update and insert block
 * 
 * @param[type} object- the object, which inputs are going to be checked
 *----------------------------------------------------------------------------*/
function checkUpdate(object) {
    if (object.getInputTargetBlock('up') != null) {//evaluate which objetc ware checking
        var target = object.getInputTargetBlock('up');
        var table = target.getFieldValue('tabele');

        while (target != null) {
            if (target.type == 'tables_and_colums') {
                if (target.childBlocks_.length > 0) {
                    var childoftarget = target.childBlocks_[0];
                    var tmp = childoftarget.getFieldValue('tabele');
                    if (tmp == table) {
                        msg = null;
                        object.setWarningText(msg);
                        target = childoftarget;
                    } else {
                        msg = SQLBlocks.Msg.Warnings.DIFFERENT_TABLES;
                        object.setWarningText(msg);
                        target = null;
                    }
                } else
                    target = null;
            } else {
                //any input type, whch is not tables and colums , will be unpluged
                target.unplug(true, true);
                target = null;
            }
        }
    }
}

/* Checking if blocks are comparable from the input */
function checkTypeByColour(block) {
    var inputBlockA = block.getInputTargetBlock("A");
    var inputBlockB = block.getInputTargetBlock("B");
    var colourA = null;
    var colourB = null;

    if (inputBlockA) {
        if (inputBlockA.type === "tables_and_columns_var") {
            var table = inputBlockA.getFieldValue("tabele");
            var column = inputBlockA.getFieldValue("Column");
            colourA = sqlHelp.getTypeColour(table, column);
        } else
            colourA = inputBlockA.getColour();
    }

    if (inputBlockB) {
        if (inputBlockB.type === "tables_and_columns_var") {
            var table = inputBlockB.getFieldValue("tabele");
            var column = inputBlockB.getFieldValue("Column");
            colourB = sqlHelp.getTypeColour(table, column);
        } else
            colourB = inputBlockB.getColour();
    }

    if (colourA !== colourB && colourB !== null && colourA !== null) {
        //inputBlockB.disconnectUiEffect();
        inputBlockB.unplug(true, true);  
        inputBlockB.moveBy(100, 100);          
    }
}

/**
 * Checking if block is numeric. If it is not numeric the block
 * will be doomed, by unplugging and moving it from the connected
 * block away.
 * 
 * @param {Blockly.Block} block Block that should be checked.
 */
function allowOnlyNumeric(block) {
    if (block) {
        if (block.getColour() !== SQLBlockly.Colours.number) {
            block.unplug(true, true);
            block.moveBy(100, 100);
        }
    }
}

/*------------------------------------------------------------------------------
 * Checking the variable inputs of the group-function. Sets an alert if there 
 * are to much variables.
 * 
 * @ param{type} object- symbolizes the block, which uses the function
 *----------------------------------------------------------------------------*/
function groupFunctioneval(object) {

    if (object.getInputTargetBlock("group") != null) {
        var variableBlocks = object.getInputTargetBlock("group");

        var directory = object.getFieldValue("group_function");

        if (directory == 'avg' || directory == 'max' || directory == 'min') {
//valid parameter
            if (variableBlocks.type == 'tables_and_colums')
            {
                if (variableBlocks.childBlocks_.length > 0)
                {
//don't link the blocks on this level
                    variableBlocks.childBlocks_[0].unplug(true, true);
                }

            }
            else {
//valid parameter with distinct
                if (variableBlocks.type == 'distinct')
                {
//distinct has it's own input-chekcer so no checking here

                    if (variableBlocks.childBlocks_.length == 1)
                    {
                        var childofchild = variableBlocks.getInputTargetBlock('distinct2');
                        if (childofchild.childBlocks_length > 0)
//don't link the blocks on this level
                            childofchild.childBlocks_[0].unplug(true, true);
                    }
                }
                else
                {
//wrong value, don't link the Blocks
                    variableBlocks.unplug(true, true);
                }
            }
        }
        else
        {
//valid parameter
            if (variableBlocks.type == 'tables_and_colums')
            {
                if (variableBlocks.childBlocks_.length > 0)
                {//don't link the blocks on this level
                    variableBlocks.childBlocks_[0].unplug(true, true);
//count = 2;
                }
            }
            else {
//wrong value, don't link the Blocks
                variableBlocks.unplug(true, true);
            }
        }
    }
}

/*------------------------------------------------------------------------------
 * Checking the variable inputs. Sets an alert if there are to much variables.
 * 
 * @ param{type} object-symbolizes the block, which uses the function
 *----------------------------------------------------------------------------*/
function groupbyval(object) {
    if (object.getInputTargetBlock('select') != null) {
//Check the relevant inputs 
        var select = object.getInputTargetBlock('select');
        var msg = null;
        var a = 0;
        var d = 0;
        var y = 0;
        var i = 0;
        var child = new Array();
        var tablecolumn = new Array();
        var block = "";
        if (select.childBlocks_)
        {
            while (select != null) {
//Counting the number of tables in the select statement
                if (select.type == 'tables_and_colums')
                {
                    a++;
                    tablecolumn[i] = new Array();
//Save the values of the fields for compare
                    tablecolumn[i][0] = select.getFieldValue('tabele');
                    tablecolumn[i][1] = select.getFieldValue('Column');
                    i++;
//Check if there are more tables
                    if (select.childBlocks_.length > 0) {

                        select = select.childBlocks_[y];
                    }
                    else {
//If not set value null
                        select = null;
                    }
                }
                else {
//Count also the table in distinct 
                    if (select.type == 'distinct')
                    {
                        if (select.getInputTargetBlock('distinct2'))
                        {
                            if (select.getInputTargetBlock('distinct2').type == 'tables_and_colums') {
                                var target = select.getInputTargetBlock('distinct2')
                                a++;
                                tablecolumn[i] = new Array();
//Save the values of the fields for compare
                                tablecolumn[i][0] = target.getFieldValue('tabele');
                                tablecolumn[i][1] = target.getFieldValue('Column');
                                i++;
                                if (select.nextConnection.targetConnection.sourceBlock_) {
//Setting select to the next block
                                    select = select.nextConnection.targetConnection.sourceBlock_;
                                } else {
                                    select = null;
                                }
                            }

                        }
                        else {
                            select = null;
                        }
                    }
                    else {
                        if (select.type == "sub_select") {
                            if (select.getInput("VALUE"))
                            {
                                a++;
//Save the values for compare
                                tablecolumn[i] = new Array();
                                tablecolumn[i][0] = select.getFieldValue('VAR');
                                select = null;
                            }
                            else
                            {
                                if (select.getInputTargetBlock('select') != null)
                                {
                                    block = select.getInputTargetBlock('select');
                                    a++;
                                    tablecolumn[i] = new Array();
//Sav the values for compare                                    
                                    tablecolumn[i][0] = block.getFieldValue('tabele');
                                    tablecolumn[i][1] = block.getFieldValue('Column');
                                    i++;
                                    if (block.childBlocks_.length > 0) {

                                        select = block.childBlocks_[y];
                                    }
                                    else {
                                        select = null;
                                    }
                                }
                                else {
                                    select = null;
                                }
                            }
                        }
                        else {
                            select = null;
                        }
                    }
                }
            }
        }

        if (object.getInput('group_by') || 
            object.getInput('group_by_have') ||
            object.getInput('order_by')) {

            var gt = new Array();

            if (object.getInput('group_by')) {
                child = object.getInputTargetBlock('group_by');
            } else {
                if (object.getInput('group_by_have')) {
                    child = object.getInputTargetBlock('group_by_have');
                } else {
                    if (object.getInput('order_by')) {
                        child = object.getInputTargetBlock('order_by');
                    }
                }
            }

            while (child != null) {
                if (child.type == 'tables_and_colums') {
                    d++;
                    gt[0] = new Array();
                    gt[0][0] = child.getFieldValue('tabele');

                    gt[0][1] = child.getFieldValue('Column');
//Compare th number of values
                    if (d > a) {
                        child.unplug(true, true);
                        break;
                    } else {
                        if (d < a) {
                            if (object.getInput('order_by')) {
                                object.setWarningText(null);
                            } else {
                                object.setWarningText(SQLBlocks.Msg.Warnings.NOT_ENOUGH_TABLES);
                            }
                            object.setWarningText(SQLBlocks.Msg.Warnings.NOT_ENOUGH_TABLES);
                        } else {
                            if (d = a) {
                                object.setWarningText(null);
                            }
                        }
                    }
                    
                    //Compare the values
                    for (var x = 0; x < tablecolumn.length; x++) {
                        if (gt[0][0] == tablecolumn[x][0])
                        {
                            if (gt[0][1] != tablecolumn[x][1] && tablecolumn[x][1]) {
                                msg = SQLBlocks.Msg.Warnings.WRONG_COLUMN;
                            } else {
                                msg = null;
                                tablecolumn.splice(x, 1);
                                break;
                            }
                        }
                        else {
                            if (gt[0][0] != tablecolumn[x][0]) {
                                msg = SQLBlocks.Msg.Warnings.WRONG_COLUMN;
                            }
                        }
                    }

                    child.setWarningText(msg);

                    if (child.childBlocks_.length > 0) {
                        child = child.childBlocks_[y];
                    } else
                        child = null;
                } else {
                    if (child.type = "fieldname_get") {
                        d++;
                        gt[0] = new Array();
                        gt[0][0] = child.getFieldValue('VAR');
                        
                        //Compare the number of values
                        if (d > a) {
                            child.unplug(true, true);
                            break;
                        }
                        else {
                            if (d < a) {
                                if (object.getInput('order_by')) {
                                    object.setWarningText(null);
                                } else {
                                    object.setWarningText(SQLBlocks.Msg.Warnings.NOT_ENOUGH_TABLES);
                                }
                            }
                            else {
                                if (d = a) {
                                    object.setWarningText(null);
                                }
                            }
                        }
                        
                        //compare the values
                        for (var x = 0; x < tablecolumn.length; x++) {
                            if (gt[0][0] != tablecolumn[x][0]) {
                                msg = SQLBlocks.Msg.Warnings.WRONG_ALIAS;
                            }
                            else {
                                msg = null;

                                tablecolumn.splice(x, 1);
                                break;
                            }
                        }

                        child.setWarningText(msg);
                        child = null;
                    } else {
                        child.unplug(true, true);
                        child = null;
                    }
                }
            }
        }
    }
}

/*------------------------------------------------------------------------------
 * Checking the variable inputs of the other-function. Sets an alert if there 
 * are to much variables.
 * 
 * @ param{type} object- symbolizes the Block, which uses the function
 *----------------------------------------------------------------------------*/
function othereval(object) {
    var msg = null;

    var miss = 0;
    var count = 0;
    var variableBlocks = new Array();
    var directory = object.getFieldValue("other_function");

    if (directory == 'greatest' || directory == 'least')
    {
        var z = object.valueCount_;
        variableBlocks[0] = object.getInputTargetBlock("object");
        //missing variable
        for (var y = 1; y <= z; y++) {
            if (object.getInputTargetBlock("object" + y) != null)
                variableBlocks[y] = object.getInputTargetBlock("object" + y);
        }
        for (var x = 0; x < object.childBlocks_.length; x++) {
            if (variableBlocks.length <= 1)
                count = 4;
            if (variableBlocks[x].childBlocks_.length > 0)
                variableBlocks[x].childBlocks_[0].unplug(true, true);
            if (variableBlocks[x + 1].getColour() != object.getColour())
                variableBlocks[x + 1].unplug(true, true);
        }
    }

    if (directory == 'nvl')
    {
        var a = 0;

        if (object.getInputTargetBlock("object") != null) {
            variableBlocks[a] = object.getInputTargetBlock("object");
            a++;
        }
        if (object.getInputTargetBlock("expr") != null) {
            variableBlocks[a] = object.getInputTargetBlock("expr");
            a++;
        }
//missing variable
        if (variableBlocks.length == 1) {
            count = 1;
            miss = 1;
        }
        else
        {
            if (variableBlocks.length > 1) {

                if (variableBlocks[1].getColour() != object.getColour())
                {
                    variableBlocks[1].unplug(true, true);
                }
            }
        }
    }

    if (directory == 'decode')
    {
        var a = 0;
        if (object.getInputTargetBlock("object") != null) {
            variableBlocks[a] = object.getInputTargetBlock("object");
            a++;
        }
        if (object.getInputTargetBlock("expr") != null) {
            variableBlocks[a] = object.getInputTargetBlock("expr");
            a++;
        }
        if (object.getInputTargetBlock("expr2") != null) {
            variableBlocks[a] = object.getInputTargetBlock("expr2");
            a++;
        }
//missing variable
        if (variableBlocks.length == 1) {
            count = 1;
            miss = 2;
        }
        if (variableBlocks.length == 2) {
            count = 1;
            miss = 1;
        }
    }

    if (count == 1) {
        msg = 'Missing statement. Needed ' + miss + 'more';
    }

    if (count == 4) {
        msg = 'Missing parameters.Needed minimal 2.';
    }

    object.setWarningText(msg);
}

/*------------------------------------------------------------------------------
 * Checking the variable inputs of the char-function. Sets an alert if there 
 * are to much variables.
 * 
 * @ param{type} object- symbolizes the block, which uses the function
 *----------------------------------------------------------------------------*/
function chareval(object) {
    var msg = null;
    var count = 0;
    var miss = 0;
    var variableBlocks = new Array();
    var z = 0;
    var directory = object.getFieldValue("char_function");
    if (directory == 'lpad' || directory == 'rpad') 
    {
        if (object.getInputTargetBlock("option") != null) {
            variableBlocks[z] = object.getInputTargetBlock("option");
            z++;
        }
        if (object.getInputTargetBlock("num") != null) {
            variableBlocks[z] = object.getInputTargetBlock("num");
            z++;
        }
        if (object.getInputTargetBlock("option2") != null) {
            variableBlocks[z] = object.getInputTargetBlock("option2");
            z++;
        }
        for (var x = 0; x < variableBlocks.length; x++) {

            var col = variableBlocks[x].getColour();
//valid parameters
            if (variableBlocks[x].type == 'tables_and_colums_var' && col != 15)
            {
//don't link the blocks on this level
                variableBlocks[x].unplug(true, true);
            }
        }
//missing value
        if (variableBlocks.length == 1) {
            count = 6;
            miss = 2;
        }
        else {
//missing value
            if (variableBlocks.length == 2) {
                count = 6;
                miss = 1;
            }
        }
    }
    else {
        if (directory == 'replace') {
            if (object.getInputTargetBlock("option") != null) {
                variableBlocks[z] = object.getInputTargetBlock("option");
                z++;
            }
            if (object.getInputTargetBlock("option2") != null) {
                variableBlocks[z] = object.getInputTargetBlock("option2");
                z++;
            }
            if (object.getInputTargetBlock("option3") != null) {
                variableBlocks[z] = object.getInputTargetBlock("option3");
                z++;
            }
            for (var x = 0; x < variableBlocks.length; x++) {
                var col = variableBlocks[x].getColour();
//valid parameters
                if (variableBlocks[x].type == 'tables_and_colums_var' && col != SQLBlockly.Colours.string)
                {
//don't link the blocks on this level
                    variableBlocks[x].unplug(true, true);
                }
//missing value
                if (variableBlocks.length == 1) {
                    count = 6;
                    miss = 2;
                }
                else {
//missing value
                    if (variableBlocks.length == 2) {
                        count = 6;
                        miss = 1;
                    }
                }
            }
        }
        else {
            if (directory == 'substring')
            {
                if (object.getInputTargetBlock("option") != null) {
                    variableBlocks[z] = object.getInputTargetBlock("option");
                    z++;
                }
                if (object.getInputTargetBlock("num") != null) {
                    variableBlocks[z] = object.getInputTargetBlock("num");
                    z++;
                }
                for (var x = 0; x < variableBlocks.length; x++) {
                    var col = variableBlocks[x].getColour();
//first valid parameter
                    if (variableBlocks[x].type == 'tables_and_colums_var' && col != SQLBlockly.Colours.string)
                    {
//don't link the blocks on this level
                        variableBlocks[x].unplug(true, true);
                    }
                }
//missing value
                if (variableBlocks.length == 1) {
                    count = 6;
                    miss = 1;
                }
            }
            else {
                if (directory == 'instr')
                {
                    if (object.getInputTargetBlock("option") != null) {
                        variableBlocks[z] = object.getInputTargetBlock("option");
                        z++;
                    }
                    if (object.getInputTargetBlock("option2") != null) {
                        variableBlocks[z] = object.getInputTargetBlock("option2");
                        z++;
                    }
                    for (var x = 0; x < variableBlocks.length; x++) {
                        var col = variableBlocks[x].getColour();
//first valid parameter
                        if (variableBlocks[x].type == 'tables_and_colums_var' && col != SQLBlockly.Colours.string)
                        {
//don't link the blocks on this level
                            variableBlocks[x].unplug(true, true);
                        }
                    }
//missing value
                    if (variableBlocks.length == 1) {
                        count = 6;
                        miss = 1;
                    }
                }
                else {
                    if (directory == 'str_to_date')
                    {
                        if (object.getInputTargetBlock("option") != null) {
                            variableBlocks[z] = object.getInputTargetBlock("option");
                            z++;
                        }
                        if (object.getInputTargetBlock("option2") != null) {
                            variableBlocks[z] = object.getInputTargetBlock("option2");
                            z++;
                        }
                        for (var x = 0; x < variableBlocks.length; x++) {
                            var col = variableBlocks[x].getColour();
                            if (col != 15 && variableBlocks[x].type == 'tables_and_colums_var') //valid parameter
                            {
                                //don't link the blocks on this level
                                variableBlocks[x].unplug(true, true);
                            }
                        }
                    }
                    else
                    {
                        if (object.getInputTargetBlock("option") != null) {
                            variableBlocks = object.getInputTargetBlock("option");


                            var col = variableBlocks.getColour();
//first valid parameter
                            if (variableBlocks.type == 'tables_and_colums_var' && col != SQLBlockly.Colours.string)
                            {
                                //don't link the blocks on this level
                                variableBlocks.unplug(true, true);
                            }
                        }
                    }
                }
            }
        }
    }
    if (count == 0) {
        msg = null;
    }

    if (count == 6) {
        msg = 'Missing statement. Needed ' + miss + ' more';
    }

    object.setWarningText(msg);
}

/*------------------------------------------------------------------------------
 * Checking the variable inputs of the date-function. Sets an alert if there 
 * are to much variables.
 * 
 * @ param{type} object- symbolizes the Block, which uses the function
 *----------------------------------------------------------------------------*/
function dateeval(object) {
    var msg = null;
    var count = 0;
    if (object.getInputTargetBlock("object") != null) {
        var variableBlocks = object.getInputTargetBlock('object');
        var childofchild = new Array();
        var miss = 0;
        var directory = object.getFieldValue("date_function");
//parameter of function which can be use as variable
        if (directory == 'sysdate' || directory == 'now' || directory == "curdate")
        {
//no warnings needed here
            count = 0;
        } else {
            if (directory == 'date_format')
            {
                var col = variableBlocks.getColour();
//valid parameter
                if (variableBlocks.type == 'tables_and_colums_var' && col != 330)
                {
//don't link the blocks on this level
                    variableBlocks.unplug(true, true);
                }
            }
            else {
                if (directory == "extract")
                {
//valid parameter
                    if (variableBlocks.type == 'date'
                            || variableBlocks.type == 'datefunction')
                    {
                        if (variableBlocks.childBlocks_)
                        {
                            if (variableBlocks.getInputTargetBlock('object') != null) {
                                childofchild = variableBlocks.getInputTargetBlock('object')

                                //don't link the blocks on this level

                                if (childofchild.type == 'datefunction' || childofchild[y].type == 'date')
                                {
                                    if (childofchild.getFieldValue("date_function") == 'now'
                                            || childofchild.getFieldValue("date_function") == 'sysdate'
                                            || childofchild.getFieldValue("date_function") == 'curdate')
                                    {
                                        count = 0;
                                    }
                                    else
                                        //don't link the blocks on this level
                                        childofchild.unplug(true, true);
                                }
                                else
                                {

                                    if (childofchild.type == 'tables_and_colums_var')
                                    {
                                        var col = childofchild.getColour();
                                        if (col != 330)
                                        {
                                            childofchild.unplug(true, true);
                                        }
                                    }
                                    else
                                        //don't link the blocks on this level
                                        childofchild.unplug(true, true);
                                }
                            }
                        }
                    }
                    else
                    {
                        if (variableBlocks.type == 'tables_and_colums_var')
                        {
                            var col = variableBlocks.getColour();
                            if (col != 330)
                            {
                                //don't link the blocks on this level
                                variableBlocks.unplug(true, true);
                            }
                        }
                    }
                }
                else {
//valid parameter
                    if (variableBlocks.type == 'date')
                    {
//do nothing
                    }
                    else {
//if the valid is datefunction, only use sysdate or now
                        if (variableBlocks.type == 'datefunction')
                        {
                            if (variableBlocks.getFieldValue("date_function") == 'now'
                                    || variableBlocks.getFieldValue("date_function") == 'sysdate'
                                    || variableBlocks.getFieldValue("date_function") == 'curdate')
                            {
                                //no warnings needed here
                                count = 0;
                            }
                            else {
                                //don't link the blocks on this level
                                variableBlocks.unplug(true, true);
                            }
                            if (variableBlocks.childBlocks_.length == 1) {
                                // count = 3;
                                childofchild = variableBlocks.getInputTargetBlock("object");

                                //don't link the blocks on this level
                                childofchild.unplug(true, true);
                            }
                        }
                        else {
                            if (variableBlocks.type == 'tables_and_colums_var')
                            {
                                var col = variableBlocks.getColour();
                                if (col != 330)
                                {
                                    //don't link the blocks on this level
                                    variableBlocks.unplug(true, true);
                                }

                            }
                        }
                    }
                }
            }
        }
    }
    if (count == 0) {
        msg = null;
    }
    if (count == 1) {
        msg = 'Missing statement. Needed ' + miss + 'more.';
    }
    object.setWarningText(msg);
}

/*------------------------------------------------------------------------------
 * Checking the compare inputsfor the subselect. 
 * 
 * @ param{type} object- symbolizes the Block, which uses the function
 *----------------------------------------------------------------------------*/
function checksub(object) {
    if (object.parentBlock_)
    {
        var parent = object.parentBlock_;
        if (parent.type == "compare_operator")
        {
            var inputA = parent.getInputTargetBlock('A');
            var inputB = parent.getInputTargetBlock('B');
            if (inputA.type == object.type && object.getColour() != 7115) {
                var col = object.getColour();
                var col2 = inputB.getColour();
                if (col == 160 && col2 != 160)
                {
                    inputB.unplug(true, true);
                }
                else {
                    if (col == 4330 && col2 != 330)
                    {
                        inputB.unplug(true, true);
                    }
                    else {
                        if (col == 6255 && col2 != 255)
                        {
                            inputB.unplug(true, true);
                        }
                        else {
                            if (col == 5015 && col2 != 15)
                            {
                                inputB.unplug(true, true);
                            }
                        }
                    }
                }
            }
            else {
                if (inputB.type == object.type && object.getColour() != 7115) {
                    var col = inputA.getColour();
                    var col2 = object.getColour();
                    if (col == 160 && col2 != 160)
                    {
                        object.unplug(true, true);
                    }
                    else {
                        if (col2 != 4330 && col == 330)
                        {
                            object.unplug(true, true);
                        }
                        else {
                            if (col2 != 6255 && col == 255)
                            {
                                object.unplug(true, true);
                            }
                            else {
                                if (col2 != 5015 && col == 15)
                                {
                                    object.unplug(true, true);
                                }
                            }
                        }
                    }
                }
            }
        }

    }
}
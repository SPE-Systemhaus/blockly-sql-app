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
function groupbyval(object)
{
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
        if (object.getInput('group_by')
                || object.getInput('group_by_have')
                || object.getInput('order_by'))
        {
            var gt = new Array();
            if (object.getInput('group_by')) {
                child = object.getInputTargetBlock('group_by');
            }
            else
            {
                if (object.getInput('group_by_have')) {
                    child = object.getInputTargetBlock('group_by_have');
                } else
                {
                    if (object.getInput('order_by')) {
                        child = object.getInputTargetBlock('order_by');
                    }
                }
            }

            while (child != null) {

                if (child.type == 'tables_and_colums')
                {
                    d++;
                    gt[0] = new Array();
                    gt[0][0] = child.getFieldValue('tabele');

                    gt[0][1] = child.getFieldValue('Column');
//Compare th number of values
                    if (d > a) {
                        child.unplug(true, true);
                        break;
                    }
                    else {
                        if (d < a) {
                            if (object.getInput('order_by')) {
                                object.setWarningText(null);
                            } else {
                                object.setWarningText("Not engought Tables. Please use all tables used in select");
                            }
                            object.setWarningText("Not engought Tables. Please use all tables used in select");
                        }
                        else {
                            if (d = a) {
                                object.setWarningText(null);
                            }
                        }
                    }
//Compare the values
                    for (var x = 0; x < tablecolumn.length; x++)
                    {
                        if (gt[0][0] == tablecolumn[x][0])
                        {
                            if (gt[0][1] != tablecolumn[x][1] && tablecolumn[x][1])
                            {
                                msg = "Wrong column. Please use only tables and columns which are in the select.";
                            }
                            else {
                                msg = null;
                                tablecolumn.splice(x, 1);
                                break;
                            }
                        }
                        else {
                            if (gt[0][0] != tablecolumn[x][0])
                            {
                                msg = "Wrong table.Please use only tables and columns which are in the select.";
                            }

                        }
                    }
                    child.setWarningText(msg);

                    if (child.childBlocks_.length > 0) {
                        child = child.childBlocks_[y];
                    }
                    else
                        child = null;
                }
                else {
                    if (child.type = "fieldname_get")
                    {
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
                                    object.setWarningText("Not engought Tables. Please use all tables used in select");
                                }
                            }
                            else {
                                if (d = a) {
                                    object.setWarningText(null);
                                }
                            }
                        }
//compare the values
                        for (var x = 0; x < tablecolumn.length; x++)
                        {
                            if (gt[0][0] != tablecolumn[x][0])
                            {
                                msg = "Wrong alias. Please use only alias which are used in subselects."
                            }
                            else {
                                msg = null;

                                tablecolumn.splice(x, 1);
                                break;
                            }
                        }
                        child.setWarningText(msg);
                        child = null;
                    }
                    else {
                        child.unplug(true, true);
                        child = null;
                    }
                }
            }
        }
    }
}
/*------------------------------------------------------------------------------
 * Checking the variable inputs. Sets an alert if there are to much variables.
 * 
 * @ param{type} object-symbolizes the block, which uses the function
 *----------------------------------------------------------------------------*/
function checkTableInputsCompare(object, directory) {
    var field = "";
    if (directory != 'like' && directory != 'isnull' && directory != 'isnotnull' && Blockly.Block.dragMode_ == 0)
//Using dragmode_ == 0, so that the inputs are only checked if the Block is not dragged.
//Corrects unlikly dragbehaviour
    {//valid parameter
        var Block = object.getInputTargetBlock('A');
//var Block2 = object.getInputTargetBlock('B');
        if (Block != null)
        {//Do nothing 
            var Block2 = object.getInputTargetBlock('B');
            if (Block2 == null) {
            }
        }
        else
        {
            if (Block == null)
            {

            }
        }
        var col = typeof Block.getColour() !== "null" ? Block.getColour() : 0;
        var col2 = typeof Block.getColour() !== "null" ? Block2.getColour() : 0;
        if (col == 15)
        {
            if (col2 == 15 || Block2.type == "sub_select_where")
            {
                //Do nothing 
            }
            else {
                if (Block2.type == 'charfunction') {

                    field = Block2.getFieldValue('char_function');
                    if (field == 'length'
                            || field == 'ascii') {
                        //don't link the blocks with wrong type
                        Block2.unplug(true, true);
                    }
                }
                else
                    //don't link the blocks with wrong type
                    Block2.unplug(true, true);
            }
        }
        else
        {
            if (col == 330)
            {
                if (col2 == 330 || Block2.type == "sub_select_where") {
                } else
                    //don't link the blocks with wrong type
                    Block2.unplug(true, true);
            } else
            {
                if (col == 255)
                {
                    if (col2 == 255 || Block2.type == "sub_select_where" || Block2.type == 'charfunction' && Block2.getFieldValue('char_function') == 'length'
                            || Block2.type == 'charfunction' && Block2.getFieldValue('char_function') == 'ascii') {
                    }
                    else
                        //don't link the blocks with wrong type
                        Block2.unplug(true, true);
                }
                else
                {
                    if (col == 160)
                    {

                        if (col2 == 160 || Block2.type == "sub_select_where") {
                        }
                        else
                            //don't link the blocks with wrong type
                            Block2.unplug(true, true);
                    }
                }
            }
        }
    }
    else
    {
        if (Blockly.Block.dragMode_ == 0 && directory == 'like')
                //Using dragmode_ == 0, so that the inputs are only checked if the Block is not dragged.
                        //Corrects unlikly dragbehaviour
                        {
                            //valid parameter
                            var Blockl = object.getInputTargetBlock('A');
                            if (Blockl != null) {
                                col = Blockl.getColour();
                                if (Blockl.type == 'string' || Blockl.type == 'tables_and_colums_var' && col == 15)
                                {
                                }
                                else {
                                    Blockl.unplug(true, true);
                                }

                                var Blocks = object.getInputTargetBlock('B');
                                if (Blocks != null) {
                                    var cols = Blocks.getColour();
                                    if (Blockl.type == 'string' && Blocks.type != 'string'
                                            || Blockl.type == 'tables_and_colums_var' && col == 15 && Blocks.type != 'string'
                                            || Blockl.type == 'tables_and_colums_var' && col == 15 && Blocks.type == 'tables_and_colums_var' && cols != 15) {
                                        //don't link the blocks with wrong type
                                        Blocks.unplug(true, true);
                                    }
                                }
                                else {
                                }
                            }
                            else
                            {
                            }

                        }
            }
}

/*------------------------------------------------------------------------------
 * Checking the variable inputs of the number-function. Sets an alert if there 
 * are to much variables.
 * 
 * @ param{type} object- symbolizes the Block, which uses the function
 *-----------------------------------------------------------------------------*/
function numberfunctioneval(object) {
    var msg = null;
    var count = 0;
    if (object.getInputTargetBlock("object") != null) {
        var variableBlocks = object.getInputTargetBlock('object');
        var directory = object.getFieldValue("number_function");

        if (directory == 'mod' || directory == 'power' || directory == 'round' || directory == 'truncate')
        {
            var secondBlock = object.getInputTargetBlock('number');

            var col = variableBlocks.getColour();
            //first valid parameter
            if (variableBlocks.type == 'tables_and_colums_var' && col != 255)
            {
                //don't link the blocks on this level
                variableBlocks.unplug(true, true);
            }
            //missing variable
            if (variableBlocks != null && secondBlock == null || variableBlocks == null && secondBlock != null) {
                count = 4;
            }
        }
        else
        {
            var col = variableBlocks.getColour();
            if (variableBlocks.type == 'tables_and_colums_var' && col != 255)
            {
                //don't link the blocks on this level
                variableBlocks.unplug(true, true);

            }
        }
    }
    if (count == 4) {
        msg = 'Missing statement.';
    }
    object.setWarningText(msg);
}
/*------------------------------------------------------------------------------
 * Checking the variable inputs of the other-function. Sets an alert if there 
 * are to much variables.
 * 
 * @ param{type} object- symbolizes the Block, which uses the function
 *----------------------------------------------------------------------------*/
function othereval(object)
{
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
function chareval(object)
{
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
                if (variableBlocks[x].type == 'tables_and_colums_var' && col != 15)
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
                    if (variableBlocks[x].type == 'tables_and_colums_var' && col != 15)
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
                        if (variableBlocks[x].type == 'tables_and_colums_var' && col != 15)
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
                            if (variableBlocks.type == 'tables_and_colums_var' && col != 15)
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
 * Checking the variable inputs of the math opertaor. Sets an alert if there 
 * are to much variables.
 * 
 * @ param{type} object- symbolizes the Block, which uses the function
 *----------------------------------------------------------------------------*/
function checkMathInputs(object)
{
    var block = object.childBlocks_;
    for (var i = 0; i < block.length; i++)
    {
        var col = block[i].getColour();
        if (col != 255)
        {
            block[i].unplug(true, true);
        }
    }
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
/*------------------------------------------------------------------------------
 * Checking the colours to avoid recolouring if colours already match.
 * 
 * @param[type} object- the object which is going to colour the parent
 * @param[type} parent - the object which is going to be coloured
 * @return sameColour - the value which starts or suppresses the colouring
 *----------------------------------------------------------------------------*/
function checkColour(object, parent) {
    var col = object.getColour();
    var pcol = parent.getColour();
    var gcol = 0
    if (parent.parentBlock_) {
        var gp = parent.parentBlock_;
        gcol = gp.getColour();
    }
    var sameColour = false;
    if (object.childBlocks_.length > 0) {
        if (pcol == 7115) {
            if (gcol == 115 || gcol == 7115 || gcol == 0)
                sameColour = true;
        } else {
            sameColour = false;
        }
    } else {
        if (col == 160 && pcol == 160) {
            sameColour = true;
        } else {
            if (pcol == 4330 && col == 330
                    || pcol == 330 && col == 330
                    || pcol == 1160 && col == 330)
            {
                if (gcol == 4330 || gcol == 330 || gcol == 0)
                    sameColour = true;
            }
            else {
                if (pcol == 6255 && col == 255
                        || pcol == 255 && col == 255
                        || pcol == 2160 && col == 255)
                {
                    if (gcol == 2555 || gcol == 6255 || gcol == 0)
                        sameColour = true;
                } else {
                    if (pcol == 5015 && col == 15
                            || pcol == 15 && col == 15
                            || pcol == 3160 && col == 255)
                    {
                        if (gcol == 15 || gcol == 5015 || gcol == 0)
                            sameColour = true;
                    } else {
                        if (pcol == 7115 && col == 115
                                || pcol == 115 && col == 115) {
                            if (gcol == 115 || gcol == 7115 || gcol == 0)
                                sameColour = true;
                        }
                    }
                }
            }
        }
    }
    if (parent.nextConnection != null) {
        if (parent.nextConnection.targetConnection != null) {
            if (parent.nextConnection.targetConnection.sourceBlock_ != null) {
                if (sameColour == true && parent.nextConnection.targetConnection.sourceBlock_)
                {
                    sameColour = false;
                }
            }
        }
    }
    return sameColour;
}

/*------------------------------------------------------------------------------
 * Checking the values of the update and insert block
 * 
 * @param[type} object- the object, which inputs are going to be checked
 *----------------------------------------------------------------------------*/
function checkUpdate(object) {
    var msg = null;
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
                        msg = "All tables must be the same. Please use the same table used in the first block.";
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
/*------------------------------------------------------------------------------
 * Checking the values of the 'SET'-section of update or insert
 * 
 * @param[type} object- the object which inputs will be checked
 *----------------------------------------------------------------------------*/
function checkSetUpdate(object) {
    if (object.getInputTargetBlock('up') != null) {
        var target = object.getInputTargetBlock('up');

        var a = 0;
        var msg = null;
        var vals = new Array();
        while (target != null)
        {
            if (target.type == 'tables_and_colums')
            {
//saving values for comaprison
                vals[a] = new Array();
                vals[a][0] = target.getFieldValue('tabele');

                vals[a][1] = target.getFieldValue('Column');
                a++;
                if (target.childBlocks_.length > 0)
                { // setting child block as target
                    target = target.childBlocks_[0];
                }
                else
                    target = null;
            }
            else
            {
                target = null;
            }
        }
        var count = object.setCount_;
        for (var b = 0; b <= count; b++) {
            if (object.getInputTargetBlock('set' + b)) {
                var childs = object.getInputTargetBlock('set' + b);
                var cor = 'set' + b;
                if (childs.getInputTargetBlock('A'))
                {
                    var child = childs.getInputTargetBlock('A');

                }
                var dir = '';

                if (child != null) {
                    for (var x = 0; x < vals.length; x++)
                    {
//checking if the right tables are pluged in
                        if (vals[x][0] == child.getFieldValue('tabele'))
                        {
                            if (vals[x][1] == child.getFieldValue('Column'))
                            {
                                msg = null;
                                if (childs.getInputTargetBlock('B')) {
                                    checkTableInputsCompare(childs, dir);
                                }
                                vals.splice(x, 1);
                                break;

                            }
                            else {
                                msg = "Wrong column. Please use only tables and columns used in the 'INSERT INTO'.";

                            }
                        }
                        else
                        {
                            msg = "Wrong table. Please use only tables and columns used in the 'INSERT INTO'.";
                        }
                    }
                    child.setWarningText(msg);
                    child = null;
                }
            }
        }
    }
}
/*------------------------------------------------------------------------------
 * Checking the variableinsert
 * @ param{type} object-symbolizes the block, which uses the function
 *----------------------------------------------------------------------------*/
function checkInsertSET(object)
{
    var sC = object.setCount_;
    var tab = new Array();
    var msg = null;
    for (var i = 0; i <= sC; i++)
    {
        if (object.getInputTargetBlock('set' + i) != null) {
            var toElement = object.getInputTargetBlock('set' + i);
            if (toElement.getInputTargetBlock('A') != null)
            {
                var insertElement = toElement.getInputTargetBlock('A');
                tab[i] = new Array();
                tab[i][0] = insertElement.getFieldValue('tabele');
                tab[i][1] = insertElement.getFieldValue('Column');
                if (tab.length > 1)
                {
                    if (tab[0][0] == tab[i][0])//Compare the Tables
                    {
                        msg = null;
                        insertElement.setWarningText(msg);
                        for (var j = 0; j < tab.length - 1; j++)
                        {
                            if (tab[j][1] == tab[i][1])
                            {
                                msg = "Attention you are inserting two values in the same column. Please choose another column.";
                                insertElement.setWarningText(msg);
                            }
                            else {
                                msg = null;
                                insertElement.setWarningText(msg);
                            }
                        }

                    }
                    else {
                        msg = "Attention you are using different tables. Please cuse the same table in the whole insert.";
                        insertElement.setWarningText(msg);
                    }
                }
            }
        } else
            break;

    }
}

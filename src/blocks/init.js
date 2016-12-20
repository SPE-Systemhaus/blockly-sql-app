/*******************************************************************************
 * This file has the init function and creates the Toolbox XML.
 * 
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)
 *
 ******************************************************************************/

var sqlHelp = null;

/*------------------------------------------------------------------------------
 * Initializes the sql blocks.
 * Generating the toolbox and reading rules and items.
 *
 * @returns {String} Toolbox sidebar blocks
 *----------------------------------------------------------------------------*/
Blockly.Blocks['init'] = function () {
    sqlHelp = new SQLHelper();

    return '<xml id="toolbox" style="display: none">' +
            '<category name="' + SQLBlocks.Msg.Toolbox.COMMANDS + '">' +
                '<block type="select"></block>' +
                '<block type="insert"></block>' +
                '<block type="update"></block>' +
                '<block type="sub_select"></block>' +
                '<block type="sub_select_where"></block>' +
                '<block type="distinct"></block>' +
            '</category>' +
            '<category name="' + SQLBlocks.Msg.Toolbox.FIELDS + '">' +
                '<block type="tables_and_columns"></block>' +
                '<block type="tables_and_columns_var"></block>' +
            '</category>' +
            '<category name="' + SQLBlocks.Msg.Toolbox.OPERATORS + '">' +
                '<block type="compare_operator"></block>' +
                '<block type="compare_operator">' +
                    '<value name="A">' +
                        '<block type="tables_and_columns_var"></block>' +
                    '</value>' +
                '</block>' +
                '<block type="to"></block>' +
                '<block type="to">' + 
                    '<value name="A">' +
                        '<block type="tables_and_columns_var"></block>' +
                    '</value>' +
                '</block>' +
                '<block type="logical_conjunction"></block>' +
                '<block type="conditions"></block>' +
                '<block type="terms_simple_expressions"></block>' +
            '</category>' +
            '<category name="' + SQLBlocks.Msg.Toolbox.VALUES + '">' +
                '<block type="num"></block>' +
                '<block type="string"></block>' +
                '<block type="date" ></block>' +
                '<block type="fieldname_get"></block>' +
                '<block type="bool"></block>' +
                '<block type="array"></block>' +
            '</category>' +
            '<category name="' + SQLBlocks.Msg.Toolbox.FUNCTIONS + '">' +
                '<block type="groupfunction"></block>' +
                '<block type="charfunction"></block> ' +
                '<block type="numberfunction"></block>' +
                '<block type="datefunction"></block>' +
                //'<block type="otherfunction"></block>' +
            '</category>' +
           '</xml>';
};
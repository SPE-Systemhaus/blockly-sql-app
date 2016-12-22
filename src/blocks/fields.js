/******************************************************************************
 * This file contains the field blocks.          
 * 
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)
 *                                                                                                  
 ******************************************************************************/

/*------------------------------------------------------------------------------
 * table_and_columns-represents the tables and columns of a specified SQL
 * database. Can be used with clauses, functions and operators.
 *
 * @module sql_blocks
 * @class tables_and_columns
 *-----------------------------------------------------------------------------*/
Blockly.Blocks['tables_and_columns'] = {
    /**
     * Initialization of the table_and_colums block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.table = Object.keys(dbStructure)[0];
        this.column = "*";

        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.list);
        this.setup();
        this.setPreviousStatement(true, ["table_column", "group_function", "sub_select", "otherfunction", "name"]);
        this.setNextStatement(true, ["table_column", "group_function", "sub_select", "otherfunction", "name"]);
        this.setTooltip(SQLBlocks.Msg.Tooltips.TABLES_AND_COLUMNS);
    },
    /**
     * The setup function gets a table and column and updates the SQL 
     * tables and columns and sets the given values.
     *
     * @method setup
     * @param {String} table Name of selected table.
     * @param {String} column Name of selected column.
     * @this Blockly.Block
     */
    setup: function () {
        var block = this;
        var tableDropdown = new Blockly.FieldDropdown(
            sqlHelp.getTableDropdowndata(),
            function (table) {
                /* Updating this block */
                block.updateShape(table, "*");
                block.table = table;
                block.column = "*";

                /* Updating parent block */
                var parent = block.getParent();
                if (parent)
                    parent.onchange();
            }
        );

        var columnDropdown = new Blockly.FieldDropdown(
            sqlHelp.getColumnDropdowndata(this.table, true),
            function (column) {
                /* Updating this block */
                var table = block.getFieldValue("tabele");
                block.updateShape(table, column);

                block.table = table;
                block.column = column;

                /* Updating parent block */
                var parent = block.getParent();
                if (parent)
                    parent.onchange();
            }
        );

        /* Setting dropdown values for table and column */
        tableDropdown.setValue(this.table);
        columnDropdown.setValue(this.column);

        block.setColour(
            sqlHelp.getTypeColour(this.table, this.column)
        );

        block.appendDummyInput('Table')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(tableDropdown, 'tabele')
            .appendField(" ", 'space')
            .appendField(columnDropdown, "Column");
    },
    /**
     * The mutationToDom function creates the mutator element in the
     * XML DOM and filling it with the path attribute.
     * It is beeing called whenever the block is beeing written
     * to XML.
     *
     * @method mutationToDom
     * @return container selected container
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var table = this.getFieldValue('tabele');
        var column = this.getFieldValue('Column');
        var container = document.createElement('mutation');
        container.setAttribute('tabele', table);
        container.setAttribute('Column', column);
        container.setAttribute('color', this.getColour());

        return container;
    },
    /**
     * The domToMutation function gets the mutator attribute from the
     * XML and restore it in the JavaScript DOM.
     * It is beeing called whenever the block is beeing restored
     * to the Workspace.
     *
     * @method domToMutation
     * @param xmlElement has the xmlDom inside
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        var table = xmlElement.getAttribute("tabele");
        var column = xmlElement.getAttribute("Column");
        var color = xmlElement.getAttribute("color");

        this.updateShape(table, column);

        if (color)
            this.setColour(color);
    },
    /**
     * The updateShape function is refreshing the tables-Array
     * and is creating a new block with the choosen table 
     * and column.
     * 
     * @param table Name of the selecting table.
     * @param column Name of the selecting column.
     * @method updateShape
     * @this Blockly.Block
     */
    updateShape: function (table, column) {
        this.removeInput('Table');       
        this.table = table;
        this.column = column;
        this.setup();
    },
    /**
     * onchange evaluates the input of the group by/group by having and colours
     * the parent
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        sqlHelp.colourTheParent(this);
    }
};

/*------------------------------------------------------------------------------
 * table_and_columns_int-represents the tables and columns with integer values
 * of a specified SQL database. Can be used with clauses, functions and operators.
 *
 * @module sql_blocks
 * @class tables_and_columns_var
 *----------------------------------------------------------------------------*/
Blockly.Blocks['tables_and_columns_var'] = {
    /**
     * Initialization of the table_and_colums_int block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        var table = Object.keys(dbStructure)[0];
        var column = dbStructure[table][0].name;

        this.columnType = null;

        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.list);
        this.setup(table, column);
        this.setTooltip(SQLBlocks.Msg.Tooltips.TABLES_AND_COLUMNS_VAR);

        this.setOutput(true, "table_column_var");
    },
    /**
     * The setup function gets a table and column and updates the SQL 
     * tables and columns and sets the given values.
     *
     * @method setup
     * @param {String} table Name of selected table.
     * @param {String} column Name of selected column.
     * @this Blockly.Block
     */
    setup: function (table, column) {
        var block = this;
        var tableDropdown = new Blockly.FieldDropdown(
            sqlHelp.getTableDropdowndata(),
            function (table) {
                block.updateShape(table, dbStructure[table][0].name);

                /* Updating parent block */
                var parent = block.getParent();
                if (parent)
                    parent.onchange();
            }
        );
        var columnDropdown = new Blockly.FieldDropdown(
            sqlHelp.getColumnDropdowndata(table, false),
            function (column) {
                var table = block.getFieldValue("tabele");
                var type = sqlHelp.getType(table, column);
                block.updateShape(table, column);
                block.onchange();
                block.setOutput(true, type);

                /* Updating parent block */
                var parent = block.getParent();
                if (parent)
                    parent.onchange();
            }
        );

        /* Setting dropdown values for table and column */
        tableDropdown.setValue(table);
        columnDropdown.setValue(column);

        block.setColour(
            sqlHelp.getTypeColour(table, column)
        );

        block.appendDummyInput('Table')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(tableDropdown, 'tabele')
            .appendField(" ", 'Abstand')
            .appendField(columnDropdown, "Column");
    },
    /**
     * The mutationToDom function creates the mutator element in the
     * XML DOM and filling it with the path attribute.
     * It is beeing called whenever the block is beeing written
     * to XML.
     *
     * @method mutationToDom
     * @return container selected container
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var table = this.getFieldValue('tabele');
        var column = this.getFieldValue('Column');
        var container = document.createElement('mutation');
        container.setAttribute('tabele', table);
        container.setAttribute('Column', column);
        container.setAttribute("color", this.getColour());

        return container;
    },
    /**
     * The domToMutation function gets the mutator attribute from the
     * XML and restore it in the JavaScript DOM.
     * It is beeing called whenever the block is beeing restored
     * to the Workspace.
     *
     * @method domToMutation
     * @param xmlElement has the xmlDom inside
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        var table = xmlElement.getAttribute("tabele");
        var column = xmlElement.getAttribute("Column");
        var color = xmlElement.getAttribute("color");

        this.updateShape(table, column);

        if (color)     
            this.setColour(color);
    },
    /**
     * The updateShape function is refreshing the tables-Array
     * and is creating a new block with the choosen directory.
     *
     * @param table Name of the selecting table.
     * @param column Name of the selecting column.
     * @method updateShape
     * @this Blockly.Block
     */
    updateShape: function (table, column) {
        this.removeInput('Table');
        this.setup(table, column);
    },
    /**
     * onchange sets the colour and checks the inputs of the compare_operator
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        sqlHelp.colourTheParent(this);
    }
};
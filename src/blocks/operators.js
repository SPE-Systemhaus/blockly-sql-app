/******************************************************************************
 * This file contains the operator blocks.    
 * 
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)
 *
 ******************************************************************************/

/*------------------------------------------------------------------------------
 * to operator symbolizes the to of the set to statement in the insert and
 * upgrade function
 *
 * @module sql_blocks
 * @class to
 *----------------------------------------------------------------------------*/
Blockly.Blocks['to'] = {
    /**
     * Initialization of the to block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.list);
        this.appendValueInput("A")
            .setCheck("table_column_var");
        this.appendValueInput("B")
            .appendField(SQLBlocks.Msg.Blocks.TO)
            .setCheck(["date", "condition", "sub_select", "bool", "numberfunction", "charfunction", "ArithmethikOPs", "datefunction", "sub_select", "number", "string"]);
        this.setOutput(true, 'TO');
        this.setTooltip(SQLBlocks.Msg.Tooltips.TO);
    },
    /**
     * onchange sets the colour of the to block
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        /* Checking if nothing is connected, colour the block to his standard color. */
        if (!this.getInputTargetBlock("A") && !this.getInputTargetBlock("B"))
            this.setColour(this.getColour());

        //checkTypeByColour(this);
    }
};
/*------------------------------------------------------------------------------
 * Compare - is one of the operators. It compares specific statemes with each
 * other.
 *
 * @module sql_blocks
 * @class compare_operator
 *----------------------------------------------------------------------------*/
Blockly.Blocks['compare_operator'] = {
    /**
     * Initialization of the compare_operator block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function (dir) {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.boolean);
        this.setOutput(true, "condition");
        this.setup(this, "EQ");
        this.setInputsInline(false);
    },
    /**
     * The setup function is beeing called on the initialziation and on
     * every update. It appends the object dummy and is reloading the
     * path from Directories.
     *
     * @param input the actual blockly object
     * @param dir checks the type of fielddropdown value 'table'
     * @param index has the count of the container
     * @method setup
     * @this Blockly.Block
     */
    setup: function (input, dir) {
        var dropdown = new Blockly.FieldDropdown(SQLBlocks.Msg.DROPDOWN.COMPAREOPERATORS, function (option) {
            this.sourceBlock_.updateShape(option);
        });

        sqlHelp.clearInputList(this);

        if (dir != '') {
            dropdown.setValue(dir);

            if (dir == "isnull" || dir == "isnotnull") {
                var ifInput = input.appendValueInput('A')
                    .setAlign(Blockly.ALIGN_LEFT)
                    .appendField("", 'Abstand')
                    .setCheck(["condition", "table_column_var", "charfunction", "groupfunction"]);
                input.appendDummyInput('D')
                    .appendField(dropdown, 'OP');
                //Restoring the input
                if (this.valueConnection1_) {
                    ifInput.connection.connect(this.valueConnection1_);
                }
                var thisBlock = this;
                input.setTooltip(function () {
                    var op = thisBlock.getFieldValue('OP');
                    var TOOLTIPS = {
                        'isnull': SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.NULL,
                        'isnotnull': SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.NOT_NULL
                    };
                    return TOOLTIPS[op];
                });
            } else {
                if (dir == 'like') {
                    var ifInput = input.appendValueInput('A')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .setCheck(["string", "table_column_var", "charfunction", "groupfunction"]);
                    input.appendDummyInput()
                        .appendField(dropdown, "OP");
                    var doInput = input.appendValueInput('B')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .setCheck(["string", "table_column_var", "charfunction", "groupfunction"]);

                    //Restoring the inputs
                    if (this.valueConnection1_) {
                        ifInput.connection.connect(this.valueConnection1_);
                    }

                    if (this.valueConnection2_) {
                        doInput.connection.connect(this.valueConnection2_);
                    }
                } else {
                    input.appendValueInput('A')
                        .setAlign(Blockly.ALIGN_LEFT)
                        .appendField("", 'Abstand')
                        .setCheck(["date", "condition", "bool", "numberfunction", "charfunction", "ArithmethikOPs", "datefunction", "table_column_var", "sub_select", "number", "string", "groupfunction", "BolleanOPs"]);

                    input.appendDummyInput()
                        .setAlign(Blockly.ALIGN_LEFT)
                        .appendField(dropdown, "OP");

                    input.appendValueInput('B')
                        .setCheck(["date", "condition", "bool", "numberfunction", "charfunction", "ArithmethikOPs", "datefunction", "table_column_var", "sub_select", "number", "string", "groupfunction", "BolleanOPs", "Array"]);
                    // Assign 'this' to a variable for use in the tooltip closure below.
                    //Restoring the inputs

                    if (this.valueConnection1_) {
                        ifInput.connection.connect(this.valueConnection1_);
                    }
                    if (this.valueConnection2_) {
                        doInput.connection.connect(this.valueConnection2_);
                    }

                    var thisBlock = this;
                    input.setTooltip(function () {
                        var op = thisBlock.getFieldValue('OP');
                        var TOOLTIPS = {
                            'EQ': SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.EQ,
                            'NEQ': SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.NEQ,
                            'LT': SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.LT,
                            'LTE': SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.LTE,
                            'GT': SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.GT,
                            'GTE': SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.GTE
                        };
                        return TOOLTIPS[op];
                    });
                }
            }
        }
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
        var container = document.createElement('mutation');
        var colour = this.getColour();
        var ops = this.getFieldValue('OP');
        container.setAttribute('OP', ops);
        container.setAttribute("colour", colour);
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
        if (!xmlElement)
            xmlElement = this.mutationToDom();

        this.updateShape(xmlElement.getAttribute('OP'));
        var colour = xmlElement.getAttribute('colour');
        this.setColour(colour);
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function () {
        // Store a pointer to any connected child blocks.
        var clauseBlock = this;

        var inputIf = this.getInput('A');
        clauseBlock.valueConnection1_ =
            inputIf && inputIf.connection.targetConnection;
        if (this.getInput('B')) {
            var inputDo = this.getInput('B');
            clauseBlock.valueConnection2_ =
                inputDo && inputDo.connection.targetConnection;
        }
    },
    /**
     * The updateShape function is refreshing the operator array
     * and is creating a new block with the choosen directory.
     *
     * @param dir has the selected directory value
     * @method updateShape
     * @this Blockly.Block
     */
    updateShape: function (dir) {
        this.saveConnections();
        if (dir != false) {
            this.removeInput('A');
            if (this.getInput('B'))
                this.removeInput('B');

            if (this.getInput('D'))
                this.removeInput('D');

            this.setup(this, dir);
        }
    },
    /**
     * Checks if the parameters are valid for the compare expressions.
     * Unplugs the block if they are unvalid.
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        /* Checking if nothing is connected, colour the block to his standard color. */
        if (!this.getInputTargetBlock("A") && !this.getInputTargetBlock("B"))
            this.setColour(this.getColour());

        //checkTypeByColour(this);
    }
};

/*------------------------------------------------------------------------------
 * Logical Conjunction - The logical AND/OR in sql
 *
 * @module sql_blocks
 * @class logical_conjunction
 *----------------------------------------------------------------------------*/
Blockly.Blocks['logical_conjunction'] = {
    /**
     * Initialization of the AND_BOOL block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.boolean);
        this.appendValueInput('A')
            .setAlign(Blockly.ALIGN_CENTRE)
            .setCheck(["condition", "BolleanOPs", "bool", "LogicOPs"]);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(SQLBlocks.Msg.DROPDOWN.LOGICALCONJUNCTION), 'operator');
        this.appendValueInput('B')
            .setAlign(Blockly.ALIGN_RIGHT)
            .setCheck(["condition", "BolleanOPs", "bool", "LogicOPs"]);
        this.setOutput(true, 'BolleanOPs');
        this.setTooltip(SQLBlocks.Msg.Tooltips.LOGICAL_CONJUNCTION);
        this.setInputsInline(false);
    }
};

/*------------------------------------------------------------------------------
 * conditions- set the not condition for a statement
 *
 * @module sql_blocks
 * @class conditions
 *----------------------------------------------------------------------------*/
Blockly.Blocks['conditions'] = {
    /**
     * Initialization of the condtions block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.boolean);
        this.setOutput(true, "condition");
        this.appendValueInput('A')
            .appendField(SQLBlocks.Msg.Blocks.NOT)
            .setCheck(["LogicOPs", "bool", "table_column_var",
                "BolleanOPs", "condition"]);
        this.setTooltip(SQLBlocks.Msg.Tooltips.CONDITIONS);
    }
};
/*------------------------------------------------------------------------------
 * terms_simple_expressions-used to asign simple mathematical operations to an SQL
 * statement
 *
 * @module sql_blocks
 * @class terms_simple_expressions
 *----------------------------------------------------------------------------*/
Blockly.Blocks['terms_simple_expressions'] = {
    /**
     * Initialization of terms_simple_expressions block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.number);
        this.setOutput(true, "ArithmethikOPs");
        this.appendValueInput('A')
            .setCheck(["table_column_var", "number", "ArithmethikOPs", "numberfunction"]);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField(new Blockly.FieldDropdown(SQLBlocks.Msg.DROPDOWN.MATHOPERATORS), 'OP');
        this.appendValueInput('B')
            .setAlign(Blockly.ALIGN_LEFT)
            .setCheck(["table_column_var", "number", "ArithmethikOPs", "numberfunction"]);
        this.setInputsInline(false);

        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            var op = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'PLUS': SQLBlocks.Msg.Tooltips.SIMPLE_TERM.PLUS,
                'MINUS': SQLBlocks.Msg.Tooltips.SIMPLE_TERM.MINUS,
                'DIVIDE': SQLBlocks.Msg.Tooltips.SIMPLE_TERM.DIVIDE,
                'MULTIPLICATE': SQLBlocks.Msg.Tooltips.SIMPLE_TERM.MULTIPLICATE
            };
            return TOOLTIPS[op];
        });
    }
};
/******************************************************************************
 * This file contains the function blocks.                                                                  
 * 
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)
 *                                       
 ******************************************************************************/

/*------------------------------------------------------------------------------
 * groupfunction-host all the sqlfunctions to group a columns value
 *
 * @module sql_blocks
 * @class groupfunction
 *----------------------------------------------------------------------------*/
Blockly.Blocks['groupfunction'] = {
    /**
     * Initialization of the groupfunction block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.setup(this, 'avg');
        this.setPreviousStatement(true, ["group_function", "table_column", "distinct", "sub_select"]);
        this.setNextStatement(true, ["group_function", "table_column", "distinct", "sub_select"]);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'fieldname_get';
    },
    /**
     * Return all variables referenced by this block.
     * @return {!Array.<string>} List of variable names.
     * @this Blockly.Block
     */
    getVars: function () {
        return [this.getFieldValue('VAR')];
    },
    /**
     * Notification that a variable is renaming.
     * If the name matches one of this block's variables, rename it.
     * @param {string} oldName Previous name of variable.
     * @param {string} newName Renamed variable.
     * @this Blockly.Block
     */
    renameVar: function (oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
            this.setFieldValue(newName, 'VAR');
        }
    },
    /**
     * The setup function fills the dropdownlist and gives the block a new shape for each dropdown
     * element.
     *
     * @method setup
     * @param input the actual blockly object
     * @param groupdir the standard choosed container
     * @this Blockly.Block
     */
    setup: function (input, groupdir) {
        var dropdown = new Blockly.FieldDropdown(group, function (option) {
            this.sourceBlock_.updateShape(option);

        });
        var ifInput;

        if (groupdir != '') {
            dropdown.setValue(groupdir);
            ifInput = input.appendStatementInput("group")
                .appendField(dropdown, "group_function")
                .setCheck(["table_column", "distinct"]);
            input.appendDummyInput('VALUE')
                .appendField(SQLBlocks.Msg.Blocks.AS)
                .appendField(new Blockly.FieldTextInput(
                    "dummy_variable"), 'VAR');
            var thisBlock = input;
            input.setHelpUrl(function () {
                var op = thisBlock.getFieldValue('group_function');
                var HelpURL = {
                    'count': 'groupfunction_count',
                    'min': 'groupfunction_min',
                    'max': 'groupfunction_max',
                    'avg': 'groupfunction_avg',
                    'stddev': 'groupfunction_stddev',
                    'sum': 'groupfunction_sum',
                    'variance': 'groupfunction_variance'
                };
                return HelpURL[op];
            });
            input.setTooltip(function () {
                var op = thisBlock.getFieldValue('group_function');
                var TOOLTIPS = {
                    'count': SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.COUNT,
                    'min': SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.MIN,
                    'max': SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.MAX,
                    'avg': SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.AVG,
                    'stddev': SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.STDDEV,
                    'sum': SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.SUM,
                    'variance': SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.VARIANCE
                };
                return TOOLTIPS[op];
            });
            //Restoring all childblocks
            if (this.statementConnection1_) {
                ifInput.connection.connect(this.statementConnection1_);
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
        var table = this.getFieldValue('group_function');
        //var colour = this.getColour();
        container.setAttribute('groupfunction', table);
        //container.setAttribute('color', colour);
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
        if (xmlElement) {
            this.updateShape(xmlElement.getAttribute("groupfunction"));
            //var colour = xmlElement.getAttribute("color");
            //this.setColour(colour);
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function () {
        // Store a pointer to any connected child blocks.
        var clauseBlock = this;

        var inputIf = this.getInput('group');
        clauseBlock.statementConnection1_ =
            inputIf && inputIf.connection.targetConnection;
    },
    /**
     * The updateShape function is refreshing the group array
     * and is creating a new block with the choosen directory.
     *
     * @param dirgroup has the selected directory value
     * @method updateShape
     * @this Blockly.Block
     */
    updateShape: function (dirgroup) {
        this.saveConnections();
        if (dirgroup != false) {
            this.removeInput('group');

            if (this.getInput('VALUE'))
                this.removeInput('VALUE');

            this.setup(this, dirgroup);
        }
    },
    /**
     * Checks if the parameters are valid for the groupfunction
     * Unpluggs the block if they are unvalid
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        //Check inputs
        //groupFunctioneval(this);
    },
    customContextMenu: Blockly.Blocks['fieldname_get'].customContextMenu
};
/*------------------------------------------------------------------------------
 * numberfunction-host al the sqlfunctions for numbers
 *
 * @module sql_blocks
 * @class numberfunction
 *----------------------------------------------------------------------------*/
Blockly.Blocks['numberfunction'] = {
    /**
     * Initialization of the numberfunction block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function (dirnum) {
        if (!dirnum)
            dirnum = "abs";

        this.setColour(SQLBlockly.Colours.number);
        this.setup(this, dirnum);
        this.setOutput(true, "numberfunction");
    },
    /**
     * The setup function fills the dropdownlist and gives the block a new shape for each dropdown
     * element.
     *
     * @method setup
     * @param input the actual blockly object
     * @param dirnum the standard choosed container
     * @this Blockly.Block
     */
    setup: function (input, dirnum) {
        var dropdown = new Blockly.FieldDropdown(numbers, function (option) {
            this.sourceBlock_.updateShape(option);
        });

        sqlHelp.clearInputList(this);

        if (dirnum != '') {
            dropdown.setValue(dirnum);
            //constructing the Block for modulo, power, round and truncate
            if (dirnum == 'mod' || dirnum == 'power' || dirnum == 'round' || dirnum == 'truncate') {
                var ifInput = input.appendValueInput('object')
                    .appendField(dropdown, 'number_function')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["table_column_var", "number", "numberfunction"]);
                var doInput = input.appendValueInput('number')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck("number", "numberfunction");
                var thisBlock = input;

                //restore the childblocks
                if (this.valueConnection1_)
                    ifInput.connection.connect(this.valueConnection1_);

                if (this.valueConnection2_)
                    doInput.connection.connect(this.valueConnection2_);

                input.setHelpUrl(function () {
                    var op = thisBlock.getFieldValue('number_function');
                    var HelpURL = {
                        'mod': 'numberfunction_mod',
                        'power': 'numberfunction_power',
                        'round': 'numberfunction_round',
                        'sign': 'numberfunction_sign',
                        'truncate': 'numberfunction_truncate'
                    };
                    return HelpURL[op];
                });
                input.setTooltip(function () {
                    var op = thisBlock.getFieldValue('number_function');
                    var TOOLTIPS = {
                        'mod': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.MOD,
                        'power': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.POWER,
                        'round': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.ROUND,
                        'sign': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.SIGN,
                        'truncate': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.TRUNCATE
                    };
                    return TOOLTIPS[op];
                });
            } else {
                //Constructing the Block for the other number unctions
                var ifInput = input.appendValueInput('object')
                    .appendField(dropdown, 'number_function')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["table_column_var", "number", "numberfunction"]);
                var thisBlock = input;
                input.setHelpUrl(function () {
                    var op = thisBlock.getFieldValue('number_function');
                    var HelpURL = {
                        'abs': 'numberfunction_abs',
                        'ceil': 'numberfunction_ceil',
                        'floor': 'numberfunction_floor',
                        'sqrt': 'numberfunction_sqrt'
                    };
                    return HelpURL[op];
                });
                input.setTooltip(function () {
                    var op = thisBlock.getFieldValue('number_function');
                    var TOOLTIPS = {
                        'abs': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.ABS,
                        'ceil': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.CEIL,
                        'floor': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.FLOOR,
                        'sqrt': SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.SQRT
                    };
                    return TOOLTIPS[op];
                });
                //Restore the childblocks
                if (this.valueConnection1_)
                    ifInput.connection.connect(this.valueConnection1_);
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
        var table = this.getFieldValue('number_function');
        container.setAttribute('numberfunction', table);
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
        this.updateShape(xmlElement.attributes[0].value);
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function () {
        var clauseBlock = this;

        var inputIf = this.getInput('object');
        clauseBlock.valueConnection1_ =
            inputIf && inputIf.connection.targetConnection;

        if (this.getInput('number')) {
            var inputdo = this.getInput('number');
            clauseBlock.valueConnection2_ =
                inputdo && inputdo.connection.targetConnection;
        }
    },
    /**
     * The updateShape function is refreshing the number Array
     * and is creating a new block with the choosen directory.
     *
     * @param dirnum has the selected directory value
     * @method updateShape
     * @this Blockly.Block
     */
    updateShape: function (dirnum) {
        this.saveConnections();
        if (dirnum != false) {
            this.removeInput('object');

            if (this.getInput('number')) {
                this.removeInput('number');
            }

            this.setup(this, dirnum);
        }
    },
    /**
     * Checks if the parameters are valid for the numberfunction
     * Unpluggs the if  unvalid and sets the parent colour
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        /* Forcing only numeric blocks */
        allowOnlyNumeric(this.getInputTargetBlock("object"));
        allowOnlyNumeric(this.getInputTargetBlock("number"));

        /* Colouring */
        sqlHelp.colourTheParent(this);
    }
};
/*------------------------------------------------------------------------------
 * otherfunction-host sql functions like decode, not null and least/greatest
 *
 * @module sql_blocks
 * @class otherfunction
 *----------------------------------------------------------------------------*/
Blockly.Blocks['otherfunction'] = {
    /**
     * Initialization of the otherfunction block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setup(this, 'decode');
        this.setPreviousStatement(true, "otherfunction");
        this.setNextStatement(true, ["otherfunction", "groupfunction", "table_colum"]);
        this.valueCount_ = 2;
    },
    /**
     * The setup function fills the dropdownlist and gives the block a new shape for each dropdown
     * element.
     *
     * @method setup
     * @param input the actual blockly object
     * @param dirother the standard choosed container
     * @this Blockly.Block
     */
    setup: function (input, dirother) {
        var mut = new Blockly.Mutator(['more']);
        var dropdown = new Blockly.FieldDropdown(other, function (option) {
            this.sourceBlock_.updateShape(option);
        });

        if (dirother != '') {
            dropdown.setValue(dirother);

            if (dirother == 'decode') {
                input.setMutator(false);
                input.appendValueInput('object')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(dropdown, 'other_function')
                    .setCheck(["LogicOPs"]);
                input.appendValueInput('expr')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["datefunction", "table_column_var", "bool", "string", "date", "number"]);
                input.appendValueInput('expr2')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["datefunction", "table_column_var", "bool", "string", "date", "number"]);
                input.setHelpUrl('otherfunction_decode');
                input.setTooltip(SQLBlocks.Msg.Tooltips.OTHER_FUNCTION.DECODE);
            }

            if (dirother == 'greatest' || dirother == 'least') {
                input.setMutator(mut);
                input.appendStatementInput('object')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(dropdown, 'other_function')
                    .setCheck("table_column");
                input.appendStatementInput('object1')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck("table_column");
                var thisBlock = this;
                input.setHelpUrl(function () {
                    var op = thisBlock.getFieldValue('other_function');
                    var HelpURL = {
                        'greatest': 'otherfunction_greatest',
                        'least': 'otherfunction_least'
                    };
                    return HelpURL[op];
                });
                input.setTooltip(function () {
                    var op = thisBlock.getFieldValue('other_function');
                    var TOOLTIPS = {
                        'greatest': SQLBlocks.Msg.Tooltips.OTHER_FUNCTION.GREATEST,
                        'least': SQLBlocks.Msg.Tooltips.OTHER_FUNCTION.LEAST
                    };
                    return TOOLTIPS[op];
                });
            }

            if (dirother == 'nvl') {
                input.setMutator(false);
                input.appendStatementInput('object')
                    .setAlign(Blockly.ALIGN_LEFT)
                    .appendField(dropdown, 'other_function')
                    .setCheck(["datefunction", "table_column_var", "table_column", "sub_select", "bool", "string", "date", "number"]);
                input.appendValueInput('expr')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["datefunction", "bool", "string", "date", "number"]);
                this.interpolateMsg(
                    SQLBlocks.Msg.Blocks.VARIABLES_SET_TITLE + ' %1 ',
                    ['VAR', new Blockly.FieldTextInput("dummy_variable")],
                    Blockly.ALIGN_LEFT);
                input.setHelpUrl('otherfunction_ifnull');
                input.setTooltip(SQLBlocks.Msg.Tooltips.OTHER_FUNCTION.NVL);
            }
        }
    },
    /**
     * The setup function fills the mutated inputs and gives the block a new
     * shape for each mutated element.
     *
     * @method setup
     * @param input the actual blockly object
     * @param x actual number of mutator-blocks
     * @this Blockly.Block
     */
    setup2: function (input, x) {
        input.appendStatementInput('object' + x)
            .setAlign(Blockly.ALIGN_RIGHT)
            .setCheck("table_column");
    },
    /**
     * The mutationToDom function creates the mutator element in the
     * XML DOM and filling it with the other_function attribute.
     * It is beeing called whenever the block is beeing written
     * to XML.
     *
     * @method mutationToDom
     * @return container selected container
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var functions = this.getFieldValue('other_function');
        var colour = this.getColour();
        container.setAttribute('other_function', functions);
        container.setAttribute('color', colour);

        if (this.getInput('expr')) {
            var expr = this.getInput('expr');
            container.setAttribute('expr', expr);
        }

        if (this.getInput('expr2')) {
            var expr = this.getInput('expr2');
            container.setAttribute('expr2', expr);
        }

        container.setAttribute('value', this.valueCount_);

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
        var dirother = xmlElement.attributes[0].value;
        var colour = xmlElement.getAttribute("color");

        if (dirother == 'least' || dirother == 'greatest') {
            this.updateShape(xmlElement.attributes[0].value);
            this.valueCount_ = parseInt(xmlElement.getAttribute('value'), 10);
            for (var x = 2; x <= this.valueCount_; x++) {
                this.setup2(this, x);
            }
        } else {
            this.updateShape(xmlElement.attributes[0].value);
        }

        if (colour)
            this.setColour(colour);
        else
            this.setColour(this.getColour());
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock = sqlHelp.createBlock(workspace, 'ADD');
        containerBlock.setColour(SQLBlockly.Colours.list);
        var connection = containerBlock.getInput('STACK').connection;

        for (var x = 2; x <= this.valueCount_; x++) {
            var newInput = sqlHelp.createBlock(workspace, 'more');
            connection.connect(newInput.previousConnection);
            connection = newInput.nextConnection;
        }

        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        // Disconnect all the elseif input blocks and remove the inputs.
        for (var x = this.valueCount_; x > 1; x--) {
            this.removeInput('object' + x);
        }
        this.valueCount_ = 1;
        // Rebuild the block's optional inputs.
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'more':
                    this.valueCount_++;
                    var ifInput = this.setup2(this, this.valueCount_);
                    if (clauseBlock.valueConnection_) {
                        ifInput.connection.connect(clauseBlock.valueConnection_);
                    }

                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function (containerBlock) {
        // Store a pointer to any connected child blocks.
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 2;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'more':
                    var inputIf = this.getInput('option' + x);
                    clauseBlock.valueConnection_ =
                        inputIf && inputIf.connection.targetConnection;

                    x++;
                    break;

                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
    },
    /**
     * The updateShape function is refreshing the other Array
     * and is creating a new block with the choosen directory.
     *
     * @param dirother has the selected directory value
     * @method updateShape
     */
    updateShape: function (dirother) {
        if (dirother != false) {

            if (this.getInput('object1'))
                for (var j = 1; j <= this.valueCount_; j++)
                    this.removeInput('object' + j);

            if (this.getInput('object'))
                this.removeInput('object');

            if (this.getInput('expr'))
                this.removeInput('expr');

            if (this.getInput('expr2'))
                this.removeInput('expr2');

            if (this.getInput(''))
                this.removeInput('');
        }

        this.valueCount_ = 1;

        this.setup(this, dirother);
    },
    /**
     * Return all variables referenced by this block.
     * @return {!Array.<string>} List of variable names.
     * @this Blockly.Block
     */
    getVars: function () {
        return [this.getFieldValue('VAR')];
    },
    /**
     * Notification that a variable is renaming.
     * If the name matches one of this block's variables, rename it.
     *
     * @param {string} oldName Previous name of variable.
     * @param {string} newName Renamed variable.
     * @this Blockly.Block
     */
    renameVar: function (oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR')))
            this.setFieldValue(newName, 'VAR');
    },
    /**
     * Checks if the parameters are valid for the otherfunction
     * Unpluggs blocks if unvalid .
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        //othereval(this);
    }
};
/*------------------------------------------------------------------------------
 * charfunction-host all sql functions for chars and strings
 *
 * @module sql_blocks
 * @class charfunction
 *----------------------------------------------------------------------------*/
Blockly.Blocks['charfunction'] = {
    /**
     * Initialization of the charfunction block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {

        this.setColour(SQLBlockly.Colours.string);
        this.setOutput(true, "charfunction");
        this.setup(this, 'lower');

        this.setHelpUrl(this.type);
    },
    /**
     * The setup function fills the dropdownlist and gives the block a new shape for each dropdown
     * element.
     *
     * @method setup
     * @param input the actual blockly object
     * @param dirchar the standard choosed container
     * @this Blockly.Block
     */
    setup: function (input, dirchar) {
        var dropdown = new Blockly.FieldDropdown(funct, function (option) {
            this.sourceBlock_.updateShape(option);
        });
        if (dirchar != '') {
            dropdown.setValue(dirchar);
            if (dirchar == 'lpad' || dirchar == 'rpad') {
                var ifInput = input.appendValueInput("option")
                    .appendField(dropdown, 'char_function')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["string", "table_column_var"]);
                var elseInput = input.appendValueInput("num")
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck("number");
                var doInput = input.appendValueInput("option2")
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["string", "table_column_var"]);
                var thisBlock = input;
                input.setTooltip(function () {
                    var op = thisBlock.getFieldValue('char_function');
                    var TOOLTIPS = {
                        'rpad': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.RPAD,
                        'lpad': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LPAD
                    };
                    return TOOLTIPS[op];
                });
                //Restore the childblocks
                if (this.valueConnection1_) {
                    ifInput.connection.connect(this.valueConnection1_);
                }
                if (this.valueConnection2_) {
                    doInput.connection.connect(this.valueConnection2_);
                }
                if (this.valueConnection3_) {
                    elseInput.connection.connect(this.valueConnection3_);
                }
            } else {
                if (dirchar == 'replace') {
                    var ifInput = input.appendValueInput("option")
                        .appendField(dropdown, 'char_function')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .setCheck(["string", "table_column_var"]);
                    var doInput = input.appendValueInput("option2")
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .setCheck(["string", "table_column_var"]);
                    var nInput = input.appendValueInput("option3")
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .setCheck(["string", "table_colum_var"]);

                    //Restore the childblocks
                    if (this.valueConnection1_)
                        ifInput.connection.connect(this.valueConnection1_);

                    if (this.valueConnection2_)
                        doInput.connection.connect(this.valueConnection2_);

                    if (this.valueConnection4_)
                        nInput.connection.connect(this.valueConnection4_);

                    input.setTooltip(SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.REPLACE);
                }
                else {
                    if (dirchar == 'substring') {
                        var ifInput = input.appendValueInput("option")
                            .appendField(dropdown, 'char_function')
                            .setAlign(Blockly.ALIGN_RIGHT)
                            .setCheck(["string", "table_column_var"]);
                        var elseInput = input.appendValueInput("num")
                            .setAlign(Blockly.ALIGN_RIGHT)
                            .setCheck("number");
                        //Restore the childblocks
                        if (this.valueConnection1_)
                            ifInput.connection.connect(this.valueConnection1_);

                        if (this.valueConnection3_)
                            elseInput.connection.connect(this.valueConnection3_);

                        input.setTooltip(SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.SUBSTRING);
                    } else {
                        if (dirchar == "instr") {
                            var ifInput = input.appendValueInput("option")
                                .appendField(dropdown, 'char_function')
                                .setAlign(Blockly.ALIGN_RIGHT)
                                .setCheck(["string", "table_column_var"]);
                            var doInput = input.appendValueInput("option2")
                                .setAlign(Blockly.ALIGN_RIGHT)
                                .setCheck(["string", "table_column_var"]);
                            //Restore the childblocks
                            if (this.valueConnection1_) {
                                ifInput.connection.connect(this.valueConnection1_);
                            }
                            if (this.valueConnection2_) {
                                doInput.connection.connect(this.valueConnection2_);
                            }
                            input.setTooltip(SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.INSTR);

                        }
                        else {
                            if (dirchar == 'str_to_date') {
                                ifInput = input.appendValueInput('option')
                                    .appendField(dropdown, 'char_function')
                                    .setAlign(Blockly.ALIGN_LEFT)
                                    .setCheck(["string", "table_column_var"]);
                                input.appendDummyInput("option4")
                                    .appendField(new Blockly.FieldTextInput("%d,%m,%Y"), "charsets");
                                input.setTooltip(SQLBlocks.Msg.Tooltips.CONVERSION_FUNCTION.STR_TO_DATE);
                                //Restore the childblocks
                                if (this.valueConnection1_) {
                                    ifInput.connection.connect(this.valueConnection1_);
                                }
                            } else {
                                var ifInput = input.appendValueInput("option")
                                    .appendField(dropdown, 'char_function')
                                    .setAlign(Blockly.ALIGN_RIGHT)
                                    .setCheck(["string", "table_column_var"]);
                                //restore the childblocks
                                if (this.valueConnection1_) {
                                    ifInput.connection.connect(this.valueConnection1_);
                                }
                                var thisBlock = this;
                                this.setTooltip(function () {
                                    var op = thisBlock.getFieldValue('char_function');
                                    var TOOLTIPS = {
                                        'lower': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LOWER,
                                        'ltrim': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LTRIM,
                                        'rtrim': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.RTRIM,
                                        'soundex': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.SOUNDEX,
                                        'upper': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.UPPER,
                                        'ascii': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.ASCII,
                                        'length': SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LENGTH
                                    };
                                    return TOOLTIPS[op];
                                });

                            }
                        }
                    }
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
        var table = this.getFieldValue('char_function');
        container.setAttribute('charfunction', table);
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
        this.updateShape(xmlElement.attributes[0].value);
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function () {
        // Store a pointer to any connected child blocks.
        var clauseBlock = this;

        var inputIf = this.getInput('option');
        clauseBlock.valueConnection1_ =
            inputIf && inputIf.connection.targetConnection;
        if (this.getInput('option2')) {
            var inputDo = this.getInput('option2');
            clauseBlock.valueConnection2_ =
                inputDo && inputDo.connection.targetConnection;
        }
        if (this.getInput('num')) {
            var inputelse = this.getInput('num');
            clauseBlock.valueConnection3_ =
                inputelse && inputelse.connection.targetConnection;
        }
        if (this.getInput('option3')) {
            var inputDo = this.getInput('option3');
            clauseBlock.valueConnection4_ =
                inputDo && inputDo.connection.targetConnection;
        }
    },
    /**
     * The updateShape function is refreshing the funct Array
     * and is creating a new block with the choosen directory.
     *
     * @param dirchar has the selected directory value
     * @method updateShape
     * @this Blockly.Block
     */

    updateShape: function (dirchar) {
        this.saveConnections();

        if (dirchar != false) {
            this.removeInput('option');
            if (this.getInput('option2'))
                this.removeInput('option2');

            if (this.getInput('option3'))
                this.removeInput('option3');

            if (this.getInput('option3'))
                this.removeInput('option3');

            if (this.getInput('option4'))
                this.removeInput('option4');

            if (this.getInput('num'))
                this.removeInput('num');

            this.setup(this, dirchar);
        }
    },
    /**
     * Checks if the parameters are valid for the charfunction
     * Unpluggs blocks if unvalid and sets parent colour.
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        sqlHelp.colourTheParent(this);
        chareval(this); //Checking the inputs
    }
};
/*------------------------------------------------------------------------------
 * datefunction-host sql functions for date
 *
 * @module sql_blocks
 * @class datefunction
 *----------------------------------------------------------------------------*/
Blockly.Blocks['datefunction'] = {
    /**
     * Initialization of the datefunction block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.date);
        this.setup(this, 'now');
        this.setOutput(true, "datefunction");
    },
    /**
     * The setup function fills the dropdownlist and gives the block a new shape for each dropdown
     * element.
     *
     * @method setup
     * @param input Blockly.Block
     * @param dirdate the standard choosed container
     * @this Blockly.Block
     */
    setup: function (input, dirdate) {
        var dropdown = new Blockly.FieldDropdown(datefunct, function (option) {
            this.sourceBlock_.updateShape(option);
        });
        if (dirdate != '') {
            dropdown.setValue(dirdate);
            if (dirdate == 'sysdate' || dirdate == 'now' || dirdate == "curdate") {
                input.appendDummyInput('vals3')
                    .setAlign(Blockly.ALIGN_LEFT)
                    .appendField(dropdown, 'date_function');
                var thisBlock = input;
                input.setHelpUrl(function () {
                    var op = thisBlock.getFieldValue('date_function');
                    var HelpURL = {
                        'now': 'datefunction_now',
                        'sysdate': 'datefunction_sysdate',
                        'curdate': 'datefunction_curdate'
                    };
                    return HelpURL[op];
                });
                input.setTooltip(function () {
                    var op = thisBlock.getFieldValue('date_function');
                    var TOOLTIPS = {
                        'now': SQLBlocks.Msg.Tooltips.DATE_FUNCTION.NOW,
                        'sysdate': SQLBlocks.Msg.Tooltips.DATE_FUNCTION.SYSDATE,
                        'curdate': SQLBlocks.Msg.Tooltips.DATE_FUNCTION.CURDATE
                    };
                    return TOOLTIPS[op];
                });
            }
            //constructing the block for date to string conversion
            if (dirdate == 'date_format') {
                ifInput = input.appendValueInput('object')
                    .appendField(dropdown, 'date_function')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["date", "datefunction", "table_column_var"]);
                input.appendDummyInput("vals3")
                    .appendField(new Blockly.FieldTextInput("%d,%m,%Y"), "vals");
                input.setHelpUrl('conversion_date_format');
                input.setTooltip(SQLBlocks.Msg.Tooltips.CONVERSION_FUNCTION.DATE_FORMAT);
                //Restore the childblocks
                if (this.valueConnection1_) {
                    ifInput.connection.connect(this.valueConnection1_);
                }
            }

            if (dirdate == 'add_months' || dirdate == 'sub_months') {
                var ifInput = input.appendValueInput('object')
                    .appendField(dropdown, 'date_function')
                    .setAlign(Blockly.ALIGN_LEFT)
                    .setCheck(["date", "datefunction", "table_column_var"]);
                input.appendDummyInput('vals')
                    .appendField(SQLBlocks.Msg.Blocks.INTERVAL)
                    .appendField(" ")
                    .appendField(new Blockly.FieldTextInput("", checkNumeric), "intervallvalue")
                    .appendField(" ")
                    .appendField(new Blockly.FieldDropdown(time), "UNIT");
                var thisBlock = this;
                input.setHelpUrl(function () {
                    var op = thisBlock.getFieldValue('date_function');
                    var HelpURL = {
                        'add_months': 'datefunction_date_add',
                        'sub_months': 'datefunction_date_sub'
                    };
                    return HelpURL[op];
                });

                input.setTooltip(SQLBlocks.Msg.Tooltips.DATE_FUNCTION.ADD_MONTHS);

                if (this.valueConnection1_) //Restore the childblocks
                    ifInput.connection.connect(this.valueConnection1_);
            }

            if (dirdate == "extract") {
                var select = new Blockly.FieldDropdown(time);

                input.appendDummyInput('vals2')
                    .appendField(dropdown, 'date_function')
                    .appendField(" ", 'Abstand');
                input.appendDummyInput('vals')
                    .appendField(select, "UNIT");

                var ifInput = input.appendValueInput("object")
                    .appendField('FROM')
                    .setAlign(Blockly.ALIGN_LEFT)
                    .setCheck(["date", "datefunction", "table_column_var"]);

                input.setHelpUrl('datefunction_extract');
                input.setTooltip(SQLBlocks.Msg.Tooltips.DATE_FUNCTION.EXTRACT);

                if (this.valueConnection1_) //Restore the childblocks
                    ifInput.connection.connect(this.valueConnection1_);
            }

            if (dirdate == 'last_day' ||
                dirdate == 'month' ||
                dirdate == 'year' ||
                dirdate == "date"
            ) {
                var ifInput = input.appendValueInput('object')
                    .appendField(dropdown, 'date_function')
                    .setAlign(Blockly.ALIGN_LEFT)
                    .setCheck(["date", "datefunction", "table_column_var"]);
                var thisBlock = this;
                input.setHelpUrl(function () {
                    var op = thisBlock.getFieldValue('date_function');
                    var HelpURL = {
                        'last_day': 'datefunction_last-day',
                        'month': 'datefunction_month',
                        'year': 'datefunction_year',
                        'date': 'datefunction_date'
                    };
                    return HelpURL[op];
                });
                input.setTooltip(function () {
                    var op = thisBlock.getFieldValue('date_function');
                    var TOOLTIPS = {
                        'last_day': SQLBlocks.Msg.Tooltips.DATE_FUNCTION.LAST_DAY,
                        'date': SQLBlocks.Msg.Tooltips.DATE_FUNCTION.DATE,
                        'month': SQLBlocks.Msg.Tooltips.DATE_FUNCTION.MONTH,
                        'year': SQLBlocks.Msg.Tooltips.DATE_FUNCTION.YEAR

                    };
                    return TOOLTIPS[op];
                });

                if (this.valueConnection1_) //Restore th childblcoks
                    ifInput.connection.connect(this.valueConnection1_);
            }
        }
    },
    /**
     * The mutationToDom function creates the mutator element in the
     * XML DOM and filling it with the date_function attribute.
     * It is beeing called whenever the block is beeing written
     * to XML.
     *
     * @method mutationToDom
     * @return container selected container
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var functions = this.getFieldValue('date_function');
        container.setAttribute('date_function', functions);
        if (this.getInput('vals')) {
            var unit = this.getFieldValue('UNIT');
            container.setAttribute('UNIT', unit);
        }

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
        this.updateShape(xmlElement.attributes[0].value);
        if (this.getInput('vals'))
            this.setFieldValue(xmlElement.attributes[1].value, 'UNIT');
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function () {
        // Store a pointer to any connected child blocks.
        var clauseBlock = this;

        var inputIf = this.getInput('object');
        clauseBlock.valueConnection1_ =
            inputIf && inputIf.connection.targetConnection;
    },
    /**
     * The updateShape function is refreshing the datefunct Array
     * and is creating a new block with the choosen directory.
     *
     * @method updateShape
     * @param dirdate has the selected directory value
     * @this Blockly.Block
     */
    updateShape: function (dirdate) {
        this.saveConnections();
        if (dirdate != false) {
            if (this.getInput('object'))
                this.removeInput('object');

            if (this.getInput('vals'))
                this.removeInput('vals');

            if (this.getInput('vals2'))
                this.removeInput('vals2');

            if (this.getInput('vals3'))
                this.removeInput('vals3');

            this.setup(this, dirdate);
        }
    },
    /**
     * Checks if the parameters are valid for the datefunction
     * Unpluggs blocks if unvalid and sets parent colour.
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        sqlHelp.colourTheParent(this);
        dateeval(this);         //Checking the inputs
    }
};
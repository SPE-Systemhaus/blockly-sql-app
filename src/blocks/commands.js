/******************************************************************************
 * This file contains the command blocks.   
 * 
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)
 *                                                                  
 ******************************************************************************/

/*------------------------------------------------------------------------------
 * select-is the top level of the select comand. It is the default
 * object for this command and  contains all available blocks to represent
 * a select-clause.
 *
 * @module sql_blocks
 * @class select
 *----------------------------------------------------------------------------*/
Blockly.Blocks['select'] = {
    /**
     * Initialization of the select block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.list);
        this.gradient = new ColourGradient();
        this.appendDummyInput("dummy_variable");
        this.appendStatementInput("select")
            .appendField(SQLBlocks.Msg.Blocks.SELECT)
            .setAlign(Blockly.ALIGN_CENTER)
            .setCheck(["table_column", "distinct", "group_function", "otherfunction", "sub_select"]);
        this.appendValueInput("Clause")
            .setAlign(Blockly.ALIGN_CENTER)
            .appendField(SQLBlocks.Msg.Blocks.WHERE)
            .setCheck(["BolleanOPs", "LogicOPs", "bool", "condition"]);
        this.setTooltip(SQLBlocks.Msg.Tooltips.SELECT);
        this.duplicate_ = false;
        this.setMutator(new Blockly.Mutator(["group_by", "having", "order_by", "limit"]));
        this.limitCount_ = 0;
        this.groupByCount_ = 0;
        this.groupByHavingCount_ = 0;
        this.orderByCount_ = 0;
        this.sortDirection = "asc";
    },
    /**
     * Create XML to represent the number of additional inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('limit', this.limitCount_);
        container.setAttribute('groupby', this.groupByCount_);
        container.setAttribute('groupbyhaving', this.groupByHavingCount_);
        container.setAttribute('orderby', this.orderByCount_);
        container.setAttribute('color', this.getColour());
        container.setAttribute('sortDirection', this.sortDirection);

        return container;
    },
    /**
     * Parse XML to restore the additional inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        if (!xmlElement)
            return null;

        this.limitCount_ = parseInt(xmlElement.getAttribute('limit'), 10);
        this.groupByCount_ = parseInt(xmlElement.getAttribute('groupby'), 10);
        this.groupByHavingCount_ = parseInt(xmlElement.getAttribute('groupbyhaving'), 10);
        this.orderByCount_ = parseInt(xmlElement.getAttribute('orderby'), 10);

        if (this.groupByCount_)
            sqlHelp.addGroupByInput(this);
        
        if (this.groupByHavingCount_)
            sqlHelp.addHavingInput(this);
        
        if (this.orderByCount_)
            sqlHelp.addOrderByInput(this);

        if (this.limitCount_)
            sqlHelp.addLimitInput(this);
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var mutator = sqlHelp.createBlock(workspace, 'opts_select');

        sqlHelp.decomposeGroupBy(workspace, this, mutator);
        sqlHelp.decomposeOrderBy(workspace, this, mutator);
        sqlHelp.decomposeLimit(workspace, this, mutator);
        sqlHelp.decomposeAlias(workspace, this, mutator);
        
        var inputs = ["Clause", "limit", "group_by", "group_by_have", "order_by", "having", "sort"];
        this.gradient.setVerticalGradient(
            this, {
                "start": "#5BA58C",
                "stop": sqlHelp.getChildColour(this)
            },
            inputs
        );

        return mutator;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (mutator) {       
        sqlHelp.composeGroupBy(this, mutator);             
        sqlHelp.composeOrderBy(this, mutator);
        sqlHelp.composeLimit(this, mutator);
        sqlHelp.composeAlias(this, mutator);
        sqlHelp.sortInputs(this);   
    },
    /**
     * onchange evaluates the input of the group by/group by having
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        var inputs = ["Clause", "limit", "group_by", "group_by_have", "order_by", "having", "sort"];
        this.gradient.setVerticalGradient(
            this, {
                "start": "#5BA58C",
                "stop": sqlHelp.getChildColour(this)
            },
            inputs
        );

        var selectBlock = this;
        /** TRYOUT ... TODO: Find a way to do this without Timeout 
        window.setTimeout(function () {
            selectBlock.gradient.setVerticalGradient(
                selectBlock, {
                    "start": "#5BA58C",
                    "stop": sqlHelp.getChildColour(selectBlock)
                },
                inputs
            );
        }, 100); */

    }
};

/*------------------------------------------------------------------------------
 * insert - is the top level of the insert comand. It is the default
 * object for this command and contains all available blocks to represent
 * a insert-clause.
 *
 * @module sql_blocks
 * @class insert
 *----------------------------------------------------------------------------*/
Blockly.Blocks['insert'] = {
    /**
     * Initialization of the insert block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.gradient = new ColourGradient();
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput("bl");
        this.appendDummyInput("ins")
            .appendField(SQLBlocks.Msg.Blocks.INSERT_VALUES);
        this.appendValueInput("set0")
            .setCheck("TO")
            .appendField(SQLBlocks.Msg.Blocks.SET);
        this.setTooltip(SQLBlocks.Msg.Tooltips.INSERT);
        this.duplicate_ = false;
        this.setMutator(new Blockly.Mutator(["into"]));
        this.setCount_ = 0;
    },
    /**
     * Create XML to represent the number of additional inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var mutation = document.createElement('mutation');
        mutation.setAttribute("set", this.setCount_);
        return mutation;
    },
    /**
     * Parse XML to restore the additional inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.setCount_ = parseInt(xmlElement.getAttribute('set'), 10);

        for (var x = 1; x <= this.setCount_; x++) {
            this.appendValueInput('set' + x)
                .setCheck("TO")
                .appendField(SQLBlocks.Msg.Blocks.SET);
        }
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

        for (var s = 1; s <= this.setCount_; s++) {
            var setBlock = sqlHelp.createBlock(workspace, 'into');
            connection.connect(setBlock.previousConnection);
            connection = setBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        // Disconnect the limit input blocks and remove the inputs.
        if (this.setCount_) {
            for (var y = 1; y <= this.setCount_; y++)
                this.removeInput('set' + y);
        }
        this.setCount_ = 0;
        // Rebuild the block's optional inputs.
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'into':
                    this.setCount_++;
                    var setInput = this.appendValueInput('set' + this.setCount_)
                        .setCheck("TO")
                        .appendField(SQLBlocks.Msg.Blocks.SET);

                    // Reconnect any child blocks.
                    if (clauseBlock.valueConnection_) {
                        setInput.connection.connect(clauseBlock.valueConnection_);
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
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        var t = 1;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'into':
                    var inputSET = this.getInput('set' + t);
                    clauseBlock.valueConnection_ =
                        inputSET && inputSET.connection.targetConnection;
                    t++;
                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
    },
    /**
     * onchange evaluates the input of the set statement and recolours the
     * block
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        /* Counting Inputs */
        this.setCount_ = 0;
        while (this.getInput('set' + (this.setCount_ + 1)) !== null)
            this.setCount_++;

        /* Checking SET TO inputs */
        checkInsertStatement(this);
    }
};

/*------------------------------------------------------------------------------
 * update-is the top level of the update comand. It is the default
 * object for this command and  contains all available blocks to represent
 * a update-clause.
 *
 * @module sql_blocks
 * @class update
 *----------------------------------------------------------------------------*/
Blockly.Blocks['update'] = {
    /**
     * Initialization of the update block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.gradient = new ColourGradient();
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput('bl');
        this.appendDummyInput("up")
            .appendField(SQLBlocks.Msg.Blocks.UPDATE);
        this.appendValueInput('set0')
            .setCheck("TO")
            .appendField(SQLBlocks.Msg.Blocks.SET);
        this.appendValueInput("Clause")
            .appendField(SQLBlocks.Msg.Blocks.WHERE)
            .setCheck(["BolleanOPs", "LogicOPs", "bool", "condition"]);
        this.setTooltip(SQLBlocks.Msg.Tooltips.UPDATE);
        this.duplicate_ = false;
        this.setMutator(new Blockly.Mutator(["set"]));
        this.setCount_ = 0;
    },
    /**
     * Create XML to represent the number of additional inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        if (!this.setCount_) {
            return null;
        }
        var container = document.createElement('mutation');
        if (this.setCount_) {
            container.setAttribute('set', this.setCount_);
        }

        var colour = this.getColour();
        container.setAttribute('color', colour);
        return container;
    },
    /**
     * Parse XML to restore the additional inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.setCount_ = parseInt(xmlElement.getAttribute('set'), 10);
        var colour = xmlElement.getAttribute('color');

        if (colour)
            this.setColour(colour);
        else
            this.setColour(this.getColour());

        if (this.setCount_) {
            for (var x = 1; x <= this.setCount_; x++) {
                var setInput = this.appendValueInput('set' + x)
                    .setCheck("TO")
                    .appendField(SQLBlocks.Msg.Blocks.SET);
                // sort the inputs after type
                var temp = this.inputList;
                var tin = new Array();
                var b = 0;
                var d = 0;
                for (var a = 0; a < temp.length; a++) {
                    if (temp[a].name == setInput.name) {
                        b = a;
                        tin = temp[a];
                        for (var c = 0; c < temp.length; c++) {
                            if (temp[c].name == 'Clause') {
                                d = c;
                            }
                        }
                        temp[b] = temp[d];
                        temp[d] = tin;
                    }
                }
                this.inputList = temp;
            }
        }
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

        for (var s = 1; s <= this.setCount_; s++) {
            var setBlock = sqlHelp.createBlock(workspace, 'set');
            connection.connect(setBlock.previousConnection);
            connection = setBlock.nextConnection;
        }

        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        // Disconnect the limit input blocks and remove the inputs.
        if (this.setCount_) {
            for (var y = 1; y <= this.setCount_; y++)
                this.removeInput('set' + y);
        }
        this.setCount_ = 0;
        // Rebuild the block's optional inputs.
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'set':
                    this.setCount_++;
                    var setInput = this.appendValueInput('set' + this.setCount_)
                        .setCheck("TO")
                        .appendField(SQLBlocks.Msg.Blocks.SET);

                    // Reconnect any child blocks.
                    if (clauseBlock.valueConnection_) {
                        setInput.connection.connect(clauseBlock.valueConnection_);
                    }
                    //sort the inputs after type
                    var temp = this.inputList;
                    var tin = new Array();
                    var b = 0;
                    var d = 0;
                    for (var a = 0; a < temp.length; a++) {
                        if (temp[a].name == setInput.name) {
                            b = a;
                            tin = temp[a];
                            for (var c = 0; c < temp.length; c++) {
                                if (temp[c].name == 'Clause') {
                                    d = c;
                                }
                            }
                            temp[b] = temp[d];
                            temp[d] = tin;
                        }
                    }
                    this.inputList = temp;
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
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        var t = 1;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'set':
                    var inputSET = this.getInput('set' + t);
                    clauseBlock.valueConnection_ =
                        inputSET && inputSET.connection.targetConnection;
                    t++;
                    break;

                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Updating color and check inputs by onchange.
     * 
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        this.gradient.setVerticalGradient(
            this, {
                "start": "#5BA58C",
                "stop": sqlHelp.getChildColour(this)
            },
            ["Clause"]
        );

        checkUpdate(this);
    }
};

/*------------------------------------------------------------------------------
 * sub select-is like the select block, the first block of an select clause.
 *It is the default object for this command and  contains all available blocks
 *to represent a select-clause.
 *
 * @module sql_blocks
 * @class sub_select
 *----------------------------------------------------------------------------*/
Blockly.Blocks['sub_select'] = {
    /**
     * Initialization of the sub_select block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.list);
        this.gradient = new ColourGradient();
        this.appendDummyInput("bla");
        this.appendStatementInput("select")
            .appendField(SQLBlocks.Msg.Blocks.SUBSELECT)
            .setCheck(["table_column", "group_function", "distinct", "otherfunction"]);
        this.appendValueInput("Clause")
            .appendField(SQLBlocks.Msg.Blocks.WHERE)
            .setCheck(["BolleanOPs", "LogicOPs", "bool", "condition"]);

        this.setPreviousStatement(true, "sub_select");
        this.setNextStatement(true, "sub_select");
        this.setTooltip(SQLBlocks.Msg.Tooltips.SUB_SELECT);

        this.setMutator(new Blockly.Mutator(["group_by", "having", "order_by", "limit", "alias"]));
        this.limitCount_ = 0;
        this.groupByCount_ = 0;
        this.groupByHavingCount_ = 0;
        this.orderByCount_ = 0;
        this.aliasCount_ = 0;
    },
    /**
     * Create XML to represent the number of the additional inputs
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        if (!this.limitCount_ &&
            !this.groupByCount_ &&
            !this.groupByHavingCount_ &&
            !this.aliasCount_ &&
            !this.orderByCount_
        )
            return null;

        var container = document.createElement('mutation');
        if (this.limitCount_)
            container.setAttribute('limit', this.limitCount_);

        if (this.groupByCount_)
            container.setAttribute('groupby', this.groupByCount_);

        if (this.groupByHavingCount_)
            container.setAttribute('having', this.groupByHavingCount_);

        if (this.orderByCount_)
            container.setAttribute('orderby', this.orderByCount_);

        if (this.aliasCount_)
            container.setAttribute('alias', this.aliasCount_);

        var colour = this.getColour();
        container.setAttribute('color', colour);

        return container;
    },
    /**
     * Parse XML to restore the addtional.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.limitCount_ = parseInt(xmlElement.getAttribute('limit'), 10);
        this.groupByCount_ = parseInt(xmlElement.getAttribute('groupby'), 10);
        this.groupByHavingCount_ = parseInt(xmlElement.getAttribute('having'), 10);
        this.orderByCount_ = parseInt(xmlElement.getAttribute('orderby'), 10);
        this.aliasCount_ = parseInt(xmlElement.getAttribute('alias'), 10);
        var colour = xmlElement.getAttribute("color");

        if (colour)
            this.setColour(colour);
        else
            this.setColour(this.getColour());

        if (this.aliasCount_)
            sqlHelp.addAliasInput(this);

        if (this.groupByCount_)
            sqlHelp.addGroupByInput(this);
        
        if (this.groupByHavingCount_)
            sqlHelp.addHavingInput(this);
        
        if (this.orderByCount_)
            sqlHelp.addOrderByInput(this);

        if (this.limitCount_)
            sqlHelp.addLimitInput(this);
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var mutator = sqlHelp.createBlock(workspace, "opts_subselect");

        sqlHelp.decomposeGroupBy(workspace, this, mutator);
        sqlHelp.decomposeOrderBy(workspace, this, mutator);
        sqlHelp.decomposeLimit(workspace, this, mutator);
        sqlHelp.decomposeAlias(workspace, this, mutator);

        return mutator;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (mutator) {
        sqlHelp.composeGroupBy(this, mutator);             
        sqlHelp.composeOrderBy(this, mutator);
        sqlHelp.composeLimit(this, mutator);
        sqlHelp.composeAlias(this, mutator);
        sqlHelp.sortInputs(this);        
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
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR')))
            this.setFieldValue(newName, 'VAR');
    },
    /**
     * onchange evaluates the input of the group by/group by having
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        this.gradient.setVerticalGradient(
            this, {
                "start": "#5BA58C",
                "stop": sqlHelp.getChildColour(this)
            },
            ["Clause", "limit", "group_by", "group_by_having", "order_by", "alias"]
        );
    }
};

/*------------------------------------------------------------------------------
 * sub select-is like the select block, the first block of an select clause.
 *It is the default object for this command and  contains all available blocks
 *to represent a select-clause.
 *
 * @module sql_blocks
 * @class sub_select_where
 *----------------------------------------------------------------------------*/
Blockly.Blocks['sub_select_where'] = {
    /**
     * Initialization of the sub_select block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.list);
        this.gradient = new ColourGradient();
        this.appendDummyInput("bla");
        this.appendStatementInput("select")
            .appendField(SQLBlocks.Msg.Blocks.SUBSELECT)
            .setCheck(["table_column", "group_function", "distinct", "otherfunction"]);
        this.appendValueInput("Clause")
            .appendField(SQLBlocks.Msg.Blocks.WHERE)
            .setCheck(["BolleanOPs", "LogicOPs", "bool", "condition"]);
        this.setOutput(true, "sub_select");
        this.setMutator(new Blockly.Mutator(["group_by", "having", "order_by", "limit", "alias"]));
        this.setTooltip(SQLBlocks.Msg.Tooltips.SUB_SELECT);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'fieldname_get';
        this.limitCount_ = 0;
        this.groupByCount_ = 0;
        this.groupByHavingCount_ = 0;
        this.orderByCount_ = 0;
        this.aliasCount_ = 0;
    },
    /**
     * Create XML to represent the number of the additional inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var colour = this.getColour();
        container.setAttribute('color', colour);

        if (!this.limitCount_ &&
            !this.groupByCount_ &&
            !this.groupByHavingCount_ &&
            !this.aliasCount_ &&
            !this.orderByCount_)
            return null;

        if (this.limitCount_)
            container.setAttribute('limit', this.limitCount_);

        if (this.groupByCount_)
            container.setAttribute('groupby', this.groupByCount_);

        if (this.groupByHavingCount_)
            container.setAttribute('groupbyhaving', this.groupByHavingCount_);

        if (this.orderByCount_)
            container.setAttribute('orderby', this.orderByCount_);

        if (this.aliasCount_)
            container.setAttribute('alias', this.aliasCount_);

        return container;
    },
    /**
     * Parse XML to restore the additional inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
     domToMutation: function (xmlElement) {
        this.limitCount_ = parseInt(xmlElement.getAttribute('limit'), 10);
        this.groupByCount_ = parseInt(xmlElement.getAttribute('groupby'), 10);
        this.groupByHavingCount_ = parseInt(xmlElement.getAttribute('having'), 10);
        this.orderByCount_ = parseInt(xmlElement.getAttribute('orderby'), 10);
        this.aliasCount_ = parseInt(xmlElement.getAttribute('alias'), 10);
        var colour = xmlElement.getAttribute("color");

        if (colour)
            this.setColour(colour);
        else
            this.setColour(this.getColour());

        if (this.aliasCount_)
            sqlHelp.addAliasInput(this);

        if (this.groupByCount_)
            sqlHelp.addGroupByInput(this);
        
        if (this.groupByHavingCount_)
            sqlHelp.addHavingInput(this);
        
        if (this.orderByCount_)
            sqlHelp.addOrderByInput(this);

        if (this.limitCount_)
            sqlHelp.addLimitInput(this);
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var mutator = sqlHelp.createBlock(workspace, "opts_subselect");

        sqlHelp.decomposeGroupBy(workspace, this, mutator);
        sqlHelp.decomposeOrderBy(workspace, this, mutator);
        sqlHelp.decomposeLimit(workspace, this, mutator);
        sqlHelp.decomposeAlias(workspace, this, mutator);

        return mutator;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (mutator) {
        sqlHelp.composeGroupBy(this, mutator);             
        sqlHelp.composeOrderBy(this, mutator);
        sqlHelp.composeLimit(this, mutator);
        sqlHelp.composeAlias(this, mutator);
        sqlHelp.sortInputs(this);        
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
     * onchange evaluates the input of the group by/group by having
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        this.gradient.setVerticalGradient(
            this, {
                "start": "#5BA58C",
                "stop": sqlHelp.getChildColour(this)
            },
            ["Clause", "limit", "group_by", "group_by_having", "order_by", "alias"]
        );
    }
};

/*------------------------------------------------------------------------------
 * distinct-irepresents the distinct-operator of sql. can be used with
 *group-function and table_columns.
 *
 * @module sql_blocks
 * @class distinct
 *----------------------------------------------------------------------------*/
Blockly.Blocks['distinct'] = {
    /**
     * Initialization of the distinct block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput("distinct2")
            .appendField(SQLBlocks.Msg.Blocks.DISTINCT);
        this.setPreviousStatement(true, "distinct");
        this.setNextStatement(true, ["table_column", "group_function", "sub_select"]);
        this.setTooltip(SQLBlocks.Msg.Tooltips.DISTINCT);
    }
};


/*******************************************************************************
 * MUTATORS                                                                    *
 *******************************************************************************/
Blockly.Blocks['ADD'] = {
    /**
     * Initialization of the ADD block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.mutators);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.ADD);
        this.appendStatementInput('STACK');
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.ADD);
        this.contextMenu = false;
    }
};

Blockly.Blocks['opts_select'] = {
    /**
     * Initialization of the opts_select block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.mutators);
        this.appendValueInput('group_by')
            .appendField(SQLBlocks.Msg.Blocks.GROUP_BY)
            .setCheck(["group_by"]);
        this.appendValueInput('order_by')
            .appendField(SQLBlocks.Msg.Blocks.ORDER_BY)
            .setCheck(["order_by"]);
        this.appendValueInput('limit')
            .appendField(SQLBlocks.Msg.Blocks.LIMIT)
            .setCheck(["limit"]);
        
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.ADD);
        this.contextMenu = false;
    }
};

Blockly.Blocks['opts_subselect'] = {
    /**
     * Initialization of the ADD block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.mutators);
        this.appendValueInput('group_by')
            .appendField(SQLBlocks.Msg.Blocks.GROUP_BY)
            .setCheck(["group_by"]);
        this.appendValueInput('order_by')
            .appendField(SQLBlocks.Msg.Blocks.ORDER_BY)
            .setCheck(["order_by"]);
        this.appendValueInput('limit')
            .appendField(SQLBlocks.Msg.Blocks.LIMIT)
            .setCheck(["limit"]);
        this.appendValueInput('alias')
            .appendField(SQLBlocks.Msg.Blocks.AS)
            .setCheck(["alias"]);    
        
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.ADD);
        this.contextMenu = false;
    }
};

Blockly.Blocks['more'] = {
    /**
     * Initialization of the more block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.MORE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.OR);
        this.contextMenu = false;
    }
};

Blockly.Blocks['alias'] = {
    /**
     * Initialization of the more block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.AS);

        this.setOutput(true, "alias");
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.AS);
        this.contextMenu = false;
    }
};

Blockly.Blocks['group_by'] = {
    /**
     * Initialization of the more block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendValueInput("having")
            .appendField(SQLBlocks.Msg.Blocks.GROUP_BY)
            .setCheck(["having"]);
        
        this.setOutput(true, "group_by");
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.GROUP_BY);
        this.contextMenu = false;
    }
};

Blockly.Blocks['having'] = {
    /**
     * Initialization of the more block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput("having")
            .appendField(SQLBlocks.Msg.Blocks.HAVING);
        
        this.setOutput(true, "having");
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.GROUP_BY_HAVING);
        this.contextMenu = false;
    }
};

Blockly.Blocks['order_by'] = {
    /**
     * Initialization of the more block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.ORDER_BY);
        
        this.setOutput(true, "order_by");
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.ORDER_BY);
        this.contextMenu = false;
    }
};

Blockly.Blocks['limit'] = {
    /**
     * Initialization of the more block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.LIMIT);
        
        this.setOutput(true, "limit");
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.LIMIT);
        this.contextMenu = false;
    }
};

Blockly.Blocks['set'] = {
    /**
     * Initialization of the set block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.SET);
        this.setPreviousStatement(true, "set");
        this.setNextStatement(true, "set");
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.SET);
        this.contextMenu = false;
    }
};

Blockly.Blocks['into'] = {
    /**
     * Initialization of the set block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.SET);
        this.setPreviousStatement(true, "into");
        this.setNextStatement(true, "into");
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.INTO);
        this.contextMenu = false;
    }
};
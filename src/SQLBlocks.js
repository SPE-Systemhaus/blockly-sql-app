var sqlHelp = null;

/*******************************************************************************
 * Inside this file the SQL Blocks will be defined and initialized.
 ******************************************************************************/
/**
 * Initializes the sql blocks.
 * Generating the toolbox and reading rules and items.
 *
 * @returns {String} Toolbox sidebar blocks
 */
Blockly.Blocks['init'] = function () {
    sqlHelp = new SQLHelper();

    return '<xml id="toolbox" style="display: none">' +
               '<category name="commands">' +
                   '<block type="select"></block>' +
                   '<block type="insert"></block>' +
                   '<block type="update"></block>' +
                   '<block type="sub_select"></block>' +
                   '<block type="sub_select_where"></block>' +
                   '<block type="distinct"></block>' +
               '</category>' +
               '<category name="tables">' +
                   '<block type="tables_and_columns"></block>' +
                   '<block type="tables_and_columns_var"></block>' +
               '</category>' +
               '<category name="operators">' +
                   '<block type="compare_operator"></block>' +
                   '<block type="to"></block>' +
                   '<block type="logical_conjunction"></block>' +
                   '<block type="conditions"></block>' +
                   '<block type="terms_simple_expressions"></block>' +
               '</category>' +
               '<category name="values">' +
                   '<block type="num"></block>' +
                   '<block type="string"></block>' +
                   '<block type="date" ></block>' +
                   '<block type="fieldname_get"></block>' +
                   '<block type="bool"></block>' +
               '</category>' +
               '<category name="functions">' +
                   '<block type="groupfunction"></block>' +
                   '<block type="charfunction"></block> ' +
                   '<block type="numberfunction"></block>' +
                   '<block type="datefunction"></block>' +
                   //'<block type="otherfunction"></block>' +
               '</category>' +
           '</xml>';
};
/*------------------------------------------------------------------------------
 * Commands and tables
 *----------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------
 * insert-is the top level of the insert comand. It is the default
 * object for this command and  contains all available blocks to represent
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
        this.setColour("#74A55B");
        this.appendDummyInput("bl");
        this.appendDummyInput("ins")
            .appendField(Blockly.Msg.INSERT_VALUES);
        this.appendValueInput("set0")
            .setCheck("TO")
            .appendField(Blockly.Msg.SET);
        this.setTooltip("");
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
        if (!this.setCount_)
            return null;

        var container = document.createElement('mutation');
        if (this.setCount_)
            container.setAttribute('set', this.setCount_);

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
        var colour = xmlElement.getAttribute("color");

        if (colour)
            this.setColour(colour);
        else
            this.setColour(this.getColour());

        if (this.setCount_) {
            for (var x = 1; x <= this.setCount_; x++) {
                this.appendValueInput('set' + x)
                        .setCheck("TO")
                        .appendField(Blockly.Msg.SET);
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
        var containerBlock = createBlock(workspace, 'ADD');
        containerBlock.setColour(115);
        var connection = containerBlock.getInput('STACK').connection;

        for (var s = 1; s <= this.setCount_; s++) {
            var setBlock = createBlock(workspace, 'into');
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
                            .appendField(Blockly.Msg.SET);

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
     * onchange evaluates the input of the set statement  and recolours the
     * block
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        var stopHeight = this.getInput("bl").renderHeight + this.getInput("ins").renderHeight;

        this.gradient.setVerticalGradient(
            this, {
                "start" : "#5BA58C",
                "stop" : this.getColour()
            }, {
                "start" : 0,
                "stop" : stopHeight
            }
        );


        var empty = 0;
        if (Blockly.Block.dragMode_ == 0) {
            //No type checking and colouring , while the block is dragged
            //check update input
            if (this.getInputTargetBlock('set0'))
                checkInsertSET(this);   //check set statement

            for (var d = 0; d <= this.setCount_; d++)
                if (this.getInputTargetBlock('set' + d) == null ||
                    this.getInputTargetBlock('set' + d).childBlocks_.length == 0)
                    empty++;

            if (empty == this.setCount_ + 1)
                this.setColour(100);
        }
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
        this.setColour("#74A55B");
        this.appendDummyInput('bl');
        this.appendDummyInput("up")
                .appendField(Blockly.Msg.UPDATE);
        this.appendValueInput('set0')
                .setCheck("TO")
                .appendField(Blockly.Msg.SET);
        this.appendValueInput("Clause")
                .appendField(Blockly.Msg.WHERE)
                .setCheck(["BolleanOPs", "LogicOPs", "bool"]);
        this.setTooltip('');
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
                                   .appendField(Blockly.Msg.SET);
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
        var containerBlock = createBlock(workspace, 'ADD');
        containerBlock.setColour(115);
        var connection = containerBlock.getInput('STACK').connection;

        for (var s = 1; s <= this.setCount_; s++) {
            var setBlock = createBlock(workspace, 'set');
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
                            .appendField(Blockly.Msg.SET);

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
     * onchange evaluates the input of the group by/group by having
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
        if (!this.workspace)
            return;

        var stopHeight = this.getInput("bl").renderHeight + this.getInput("up").renderHeight;

        this.gradient.setVerticalGradient(
            this, {
                "start" : "#5BA58C",
                "stop" : this.getColour()
            }, {
                "start" : 0,
                "stop" : stopHeight
            }
        );

        if (Blockly.Block.dragMode_ == 0) {
            //No type checking and colouring , while the block is dragged
            checkUpdate(this);
            if (this.getInputTargetBlock('set0')) {
                checkSetUpdate(this);
            }
        }
    }
};
/*------------------------------------------------------------------------------
 * select-is the top level of the select comand. It is the default
 *object for this command and  contains all available blocks to represent
 *a select-clause.
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
        this.setColour("#74A55B");
        this.gradient = new ColourGradient();
        this.appendDummyInput("Dummy");
        this.appendStatementInput("select")
                .appendField(Blockly.Msg.SELECT)
                .setAlign(Blockly.ALIGN_CENTER)
                .setCheck(["table_column", "distinct", "group_function", "otherfunction", "sub_select"]);
        this.appendValueInput("Clause")
                .setAlign(Blockly.ALIGN_CENTER)
                .appendField(Blockly.Msg.WHERE)
                .setCheck(["BolleanOPs", "LogicOPs", "bool", "condition"]);
        this.setTooltip('');
        this.duplicate_ = false;
        this.setMutator(new Blockly.Mutator(["group_by", "group_by_having", "order_by", "limit"]));
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
            xmlElement = this.mutationToDom();

        this.limitCount_ = parseInt(xmlElement.getAttribute('limit'), 10);
        this.groupByCount_ = parseInt(xmlElement.getAttribute('groupby'), 10);
        this.groupByHavingCount_ = parseInt(xmlElement.getAttribute('groupbyhaving'), 10);
        this.orderByCount_ = parseInt(xmlElement.getAttribute('orderby'), 10);

        if (this.groupByCount_) {
            this.appendStatementInput('group_by')
                    .setCheck(["table_column", "name"])
                    .appendField(Blockly.Msg.GOUP_BY);
        }
        if (this.groupByHavingCount_) {
            this.appendStatementInput('group_by_have')
                    .setCheck(["table_column", "name"])
                    .appendField(Blockly.Msg.GOUP_BY);
            this.appendValueInput('having')
                    .setCheck("LogicOPs")
                    .appendField(Blockly.Msg.HAVING);
        }
        if (this.orderByCount_) {
            this.appendStatementInput('order_by')
                    .setCheck(["table_column", "name"])
                    .appendField(Blockly.Msg.ORDER_BY);
            this.appendDummyInput("sort")
                    .appendField(new Blockly.FieldDropdown([
                        ["ASCENDANT", "asc"],
                        ["DESCENDANT", "desc"]
                    ]), "sort");
            this.setFieldValue(this.sortDirection, "sort");
        }
        if (this.limitCount_) {
            this.appendValueInput('limit')
                    .setCheck('number')
                    .appendField(Blockly.Msg.LIMIT);
        }
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock = createBlock(workspace, 'ADD');
        var connection = containerBlock.getInput('STACK').connection;
        //containerBlock.setColour(115);

        if (this.groupByCount_) {
            var groupByBlock = createBlock(workspace, 'group_by');
            connection.connect(groupByBlock.previousConnection);
            connection = groupByBlock.nextConnection;
        }

        if (this.groupByHavingCount_) {
            var groupByHavingBlock = createBlock(workspace, 'group_by_having');
            connection.connect(groupByHavingBlock.previousConnection);
            connection = groupByHavingBlock.nextConnection;
        }

        if (this.orderByCount_) {
            var orderBlock = createBlock(workspace, 'order_by');
            connection.connect(orderBlock.previousConnection);
            connection = orderBlock.nextConnection;
        }

        if (this.limitCount_) {
            var limitBlock = createBlock(workspace, 'limit');
            connection.connect(limitBlock.previousConnection);
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
        if (this.limitCount_)
            this.removeInput('limit');

        this.limitCount_ = 0;
        // Disconnect all the group by input blocks and remove the inputs.
        if (this.groupByCount_)
            this.removeInput('group_by');

        this.groupByCount_ = 0;
        // Disconnect all the group by having input blocks and remove the inputs.
        if (this.groupByHavingCount_) {
            this.removeInput('group_by_have');
            this.removeInput('having');
        }
        this.groupByHavingCount_ = 0;
        // Disconnect all the order by input blocks and remove the inputs.
        if (this.orderByCount_) {
            this.removeInput('order_by');
            this.removeInput('sort');
        }
        this.orderByCount_ = 0;
        // Rebuild the block's optional inputs.
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'limit':
                    this.limitCount_++;
                    var limitInput = this.appendValueInput('limit');
                    limitInput.setCheck('number');
                    limitInput.appendField(Blockly.Msg.LIMIT);

                    // Reconnect any child blocks.
                    if (clauseBlock.valueConnection_) {
                        limitInput.connection.connect(clauseBlock.valueConnection_);
                    }
                    break;
                case 'group_by':
                    this.groupByCount_++;
                    var groupInput = this.appendStatementInput('group_by');
                    groupInput.setCheck(["table_column", "name"]);
                    groupInput.appendField(Blockly.Msg.GOUP_BY);
                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_) {
                        groupInput.connection.connect(clauseBlock.statementConnection_);
                    }
                    break;
                case 'group_by_having':
                    this.groupByHavingCount_++;
                    var groupHInput = this.appendStatementInput('group_by_have');
                    groupHInput.setCheck(["table_column", "name"]);
                    groupHInput.appendField(Blockly.Msg.GOUP_BY);
                    var havingInput = this.appendValueInput("having");
                    havingInput.setCheck("LogicOPs");
                    havingInput.appendField(Blockly.Msg.HAVING);
                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_) {
                        groupHInput.connection.connect(clauseBlock.statementConnection_);
                    }
                    if (clauseBlock.valueConnection_) {
                        havingInput.connection.connect(clauseBlock.valueConnection_);
                    }
                    break;
                case 'order_by':
                    this.orderByCount_++;
                    var orderInput = this.appendStatementInput('order_by');
                    orderInput.setCheck(["table_column", "name"]);
                    orderInput.appendField(Blockly.Msg.ORDER_BY);
                    var sortDummy = this.appendDummyInput("sort");
                    sortDummy.appendField(new Blockly.FieldDropdown(sort), "sort");

                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_) {
                        orderInput.connection.connect(clauseBlock.statementConnection_);
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
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'limit':
                    var inputLimit = this.getInput('limit');
                    clauseBlock.valueConnection_ =
                            inputLimit && inputLimit.connection.targetConnection;
                    break;
                case 'group_by':
                    var inputgroup = this.getInput('group_by');
                    clauseBlock.statementConnection_ =
                            inputgroup && inputgroup.connection.targetConnection;
                    break;
                case 'group_by_having':
                    var inputgroupH = this.getInput('group_by_have');
                    clauseBlock.statementConnection_ =
                            inputgroupH && inputgroupH.connection.targetConnection;
                    break;
                case 'order_by':
                    var inputgroup = this.getInput('order_by');
                    clauseBlock.statementConnection_ =
                            inputgroup && inputgroup.connection.targetConnection;
                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
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

        var msg = null;

        var stopColor = this.getColour();
        var children = this.getChildren();

        for (var childKey in children) {
            var child = children[childKey];
            if (child.type === "tables_and_columns") {
                if (child.getChildren().length === 0) {
                    stopColor = child.getColour();
                    break;
                }
            }
        }

        this.gradient.setVerticalGradient(
            this, {
                "start" : "#5BA58C",
                "stop" : stopColor
            }, {
                "start" : this.getInput("select").renderHeight,
                "stop" : this.getInput("Clause").renderHeight
            }
        );


        // No type checking and colouring , while the block is dragged
        if (Blockly.dragMode_ === Blockly.DRAG_NONE) {

            if (this.groupByCount_) {
                if (!this.getInputTargetBlock('group_by'))
                    msg = null;
                groupbyval(this);
            } else {
                if (this.groupByHavingCount_) {
                    if (!this.getInputTargetBlock('group_by_have')) {
                        msg = null;
                    }
                    groupbyval(this);
                } else {
                    if (this.orderByCount_) {
                        if (!this.getInputTargetBlock('gorder_by')) {
                            msg = null;
                        }
                        groupbyval(this);
                    }
                }
            }

            /*

            if (this.getInputTargetBlock('select') == null) {
                this.setColour(7115);
            } else {
                if (this.getInputTargetBlock('select') != null)
                {
                    var tc = this.getInputTargetBlock('select');
                    if (tc.type == "sub_select")
                    {
                        if (tc.getInputTargetBlock('select') == null) {
                            this.setColour(7115);
                        }
                    }
                }
            }

            */
        }

        this.setWarningText(msg);
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
        this.setColour("#74A55B");
        this.appendDummyInput("distinct2")
            .appendField(Blockly.Msg.DISTINCT);
        this.setPreviousStatement(true, "distinct");
        this.setNextStatement(true, ["table_column", "group_function", "sub_select", "distinct"]);
        this.setTooltip('');
    },
    /**
     * Create XML to represent the number of the additional inputs
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var colour = this.getColour();
        container.setAttribute('colorHue_', colour);
        return container;
    },
    /**
     * Parse XML to restore the addtional.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        var colour = xmlElement.attributes [0].value;
        this.setColour(colour);
    },
    /**
     * onchnage checks the input-statements.
     *
     * @method:onchange
     * @this Blockly.Block
     */
    onchange: function ()
    {
        if (!this.workspace)
            return;

        if (Blockly.Block.dragMode_ == 0) {
            if (this.getInputTargetBlock('distinct2')) {
                var variableBlocks = this.getInputTargetBlock('distinct2');
                if (this.getInputTargetBlock('distinct2').type == 'tables_and_columns') {
                    if (variableBlocks.childBlocks_.length > 0) {
                        variableBlocks.childBlocks_[0].unplug(true, true);

                    }
                }
            }
            //Recolour the Block if there are no inputs
            if (this.getInputTargetBlock('distinct2') == null) {
                this.setColour(115);
                if (this.parentBlock_)
                {
                    this.parentBlock_.setColour(7115);
                    if (this.parentBlock_.parentBlock_)
                    {
                        var pop = this.parentBlock_.parentBlock_;
                        if (pop.type == 'compare_operator')
                            pop.setColour(160);
                    }
                }
            }
        }
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
        this.setColour("#74A55B");
        this.gradient = new ColourGradient();
        this.appendDummyInput("bla");
        this.appendStatementInput("select")
                .appendField(Blockly.Msg.SUBSELECT)
                .setCheck(["table_column", "group_function", "distinct", "otherfunction"]);
        this.appendValueInput("Clause")
                .appendField(Blockly.Msg.WHERE)
                .setCheck(["BolleanOPs", "LogicOPs", "bool"]);

        this.setPreviousStatement(true, "sub_select");
        this.setNextStatement(true, "sub_select");
        this.setTooltip('');

        this.setMutator(new Blockly.Mutator(["alias", "group_by", "group_by_having", "order_by", "limit"]));
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
            container.setAttribute('groupbyhaving', this.groupByHavingCount_);

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
        this.groupByHavingCount_ = parseInt(xmlElement.getAttribute('groupbyhaving'), 10);
        this.orderByCount_ = parseInt(xmlElement.getAttribute('orderby'), 10);
        this.aliasCount_ = parseInt(xmlElement.getAttribute('alias'), 10);
        var colour = xmlElement.getAttribute("color");

        if (colour)
          this.setColour(colour);
        else
          this.setColour(this.getColour());

        if (this.aliasCount_) {
          this.appendDummyInput('VALUE')
              .appendField(Blockly.Msg.VARIABLES_SET_TITLE)
              .appendField(new Blockly.FieldTextInput(
                           Blockly.Msg.VARIABLES_SET_ITEM), 'VAR');
          this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
          this.contextMenuType_ = 'fieldname_get';
        }

        if (this.groupByCount_)
          this.appendStatementInput('group_by')
              .setCheck(["table_column", "name"])
              .appendField(Blockly.Msg.GROUP_BY);

        if (this.groupByHavingCount_) {
          this.appendStatementInput('group_by_have')
              .setCheck(["table_column", "name"])
              .appendField(Blockly.Msg.GROUP_BY);
          this.appendValueInput('having')
              .setCheck("LogicOPs")
              .appendField(Blockly.Msg.HAVING);
        }

        if (this.orderByCount_) {
          this.appendStatementInput('order_by')
              .setCheck(["table_column", "name"])
              .appendField(Blockly.Msg.ORDER_BY);
          this.appendDummyInput("sort")
              .appendField(new Blockly.FieldDropdown(sort), "sort");
        }

        if (this.limitCount_)
          this.appendValueInput('limit')
              .setCheck('number')
              .appendField(Blockly.Msg.LIMIT);
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock = createBlock(workspace, 'ADD');
        containerBlock.setColour(115);
        var connection = containerBlock.getInput('STACK').connection;

        if (this.aliasCount_) {
            var asBlock = createBlock(workspace, 'alias');
            connection.connect(asBlock.previousConnection);
            connection = asBlock.nextConnection;
        }

        if (this.groupByCount_) {
            var groupByBlock = createBlock(workspace, 'group_by');
            connection.connect(groupByBlock.previousConnection);
            connection = groupByBlock.nextConnection;
        }

        if (this.groupByHavingCount_) {
            var groupByHavingBlock = createBlock(workspace, 'group_by_having');
            connection.connect(groupByHavingBlock.previousConnection);
            connection = groupByHavingBlock.nextConnection;
        }

        if (this.orderByCount_) {
            var orderBlock = createBlock(workspace, 'order_by');
            connection.connect(orderBlock.previousConnection);
            connection = orderBlock.nextConnection;
        }

        if (this.limitCount_) {
            var limitBlock = createBlock(workspace, 'limit');
            connection.connect(limitBlock.previousConnection);
            connection = limitBlock.nextConnection;
        }

        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        // Disconnect the alias input blocks and remove the inputs.
        if (this.aliasCount_)
            this.removeInput('VALUE');
        this.aliasCount_ = 0;

        // Disconnect the limit input blocks and remove the inputs.
        if (this.limitCount_)
            this.removeInput('limit');
        this.limitCount_ = 0;

        // Disconnect all the group by input blocks and remove the inputs.
        if (this.groupByCount_)
            this.removeInput('group_by');

        this.groupByCount_ = 0;
        // Disconnect all the group by having input blocks and remove the inputs.
        if (this.groupByHavingCount_) {
            this.removeInput('group_by_have');
            this.removeInput('having');
        }

        this.groupByHavingCount_ = 0;
        // Disconnect all the order by input blocks and remove the inputs.
        if (this.orderByCount_) {
            this.removeInput('order_by');
            this.removeInput('sort');
        }
        this.orderByCount_ = 0;

        // Rebuild the block's optional inputs.
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'limit':
                    this.limitCount_++;
                    var limitInput = this.appendValueInput('limit');
                    limitInput.setCheck('number');
                    limitInput.appendField(Blockly.Msg.LIMIT);

                    // Reconnect any child blocks.
                    if (clauseBlock.valueConnection_) {
                        limitInput.connection.connect(clauseBlock.valueConnection_);
                    }
                    break;
                case 'group_by':
                    this.groupByCount_++;
                    var groupInput = this.appendStatementInput('group_by');
                    groupInput.setCheck(["table_column", "name"]);
                    groupInput.appendField(Blockly.Msg.GROUP_BY);
                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_)
                        groupInput.connection.connect(clauseBlock.statementConnection_);
                    break;
                case 'group_by_having':
                    this.groupByHavingCount_++;
                    var groupHInput = this.appendStatementInput('group_by_have');
                    groupHInput.setCheck(["table_column", "name"]);
                    groupHInput.appendField(Blockly.Msg.GROUP_BY);
                    var havingInput = this.appendValueInput('having');
                    havingInput.setCheck("LogicOPs");
                    havingInput.appendField(Blockly.Msg.HAVING);
                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_)
                        groupHInput.connection.connect(clauseBlock.statementConnection_);

                    if (clauseBlock.valueConnection_)
                        havingInput.connection.connect(clauseBlock.valueConnection_);
                    break;
                case 'order_by':
                    this.orderByCount_++;
                    var orderInput = this.appendStatementInput('order_by');
                    orderInput.setCheck(["table_column", "name"]);
                    orderInput.appendField(Blockly.Msg.ORDER_BY);
                    var sortDummy = this.appendDummyInput("sort");
                    sortDummy.appendField(new Blockly.FieldDropdown(sort), "sort");

                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_)
                        orderInput.connection.connect(clauseBlock.statementConnection_);

                    break;
                case 'alias':
                    this.aliasCount_++;

                    //Alias
                    //Old version:
                    var aliasDummy = this.appendDummyInput('VALUE');
                    aliasDummy.appendField(Blockly.Msg.VARIABLES_SET_TITLE);
                    aliasDummy.appendField(new Blockly.FieldTextInput(
                            Blockly.Msg.VARIABLES_SET_ITEM), 'VAR');
                    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
                    this.contextMenuType_ = 'fieldname_get';
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
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'limit':
                    var inputLimit = this.getInput('limit');
                    clauseBlock.valueConnection_ =
                            inputLimit && inputLimit.connection.targetConnection;
                    break;
                case 'group_by':
                    var inputgroup = this.getInput('group_by');
                    clauseBlock.statementConnection_ =
                            inputgroup && inputgroup.connection.targetConnection;
                    break;
                case 'group_by_having':
                    var inputgroupH = this.getInput('group_by_have');
                    clauseBlock.statementConnection_ =
                            inputgroupH && inputgroupH.connection.targetConnection;
                    break;
                case 'order_by':
                    var inputgroup = this.getInput('order_by');
                    clauseBlock.statementConnection_ =
                            inputgroup && inputgroup.connection.targetConnection;
                    break;
                case 'alias':
                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
        }
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
        
        var stopColor = this.getColour();
        var children = this.getChildren();
        var selectHeight = this.getInput("select").renderHeight;

        for (var childKey in children) {
            var child = children[childKey];
            if (child.type === "tables_and_columns") {
                if (child.getChildren().length === 0) {
                    stopColor = child.getColour();
                    break;
                }
            }
        }

        this.gradient.setVerticalGradient(
            this, {
                "start" : "#5BA58C",
                "stop" : stopColor
            }, {
                "start" : selectHeight,
                "stop" : this.getHeightWidth().height - selectHeight
            }
        );

        var msg = null;
        if (Blockly.Block.dragMode_ == 0) {
            //No type checking and colouring , while the block is dragged
            if (this.groupByCount_) {
                if (!this.getInputTargetBlock('group_by'))
                    msg = null;

                groupbyval(this);
            } else {
                if (this.groupByHavingCount_) {
                    if (!this.getInputTargetBlock('group_by_have'))
                        msg = null;

                    groupbyval(this);
                } else {
                    if (this.orderByCount_) {
                        if (!this.getInputTargetBlock('gorder_by'))
                            msg = null;

                        groupbyval(this);
                    }
                }
            }
        }
        this.setWarningText(msg);
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
        this.setColour("#74A55B");
        this.gradient = new ColourGradient();
        this.appendDummyInput("bla");
        this.appendStatementInput("select")
                .appendField(Blockly.Msg.SUBSELECT)
                .setCheck(["table_column", "group_function", "distinct", "otherfunction"]);
        this.appendValueInput("Clause")
                .appendField(Blockly.Msg.WHERE)
                .setCheck(["BolleanOPs", "LogicOPs", "bool", "condition"]);
        this.setOutput(true, "sub_select");
        this.setMutator(new Blockly.Mutator(["alias", "group_by", "group_by_having", "order_by", "limit"]));
        this.setTooltip('');
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
        this.groupByHavingCount_ = parseInt(xmlElement.getAttribute('groupbyhaving'), 10);
        this.orderByCount_ = parseInt(xmlElement.getAttribute('orderby'), 10);
        this.aliasCount_ = parseInt(xmlElement.getAttribute('alias'), 10);
        var len = xmlElement.attributes.length - 1;

        var colour = xmlElement.getAttribute("color");
        if (!colour)
            colour = this.getColour();

        this.setColour(colour);
        if (this.aliasCount_) {
            //Alias
            //Old version:
            this.appendDummyInput('VALUE')
                .appendField(Blockly.Msg.VARIABLES_SET_TITLE)
                .appendField(new Blockly.FieldTextInput(
                        Blockly.Msg.VARIABLES_SET_ITEM), 'VAR');
        }
        if (this.groupByCount_) {
            this.appendStatementInput('group_by')
                .setCheck(["table_column", "name"])
                .appendField(Blockly.Msg.GROUP_BY);
        }
        if (this.groupByHavingCount_) {
            this.appendStatementInput('group_by_have')
                .setCheck(["table_column", "name"])
                .appendField(Blockly.Msg.GROUP_BY);
            this.appendValueInput('having')
                .setCheck("LogicOPs")
                .appendField(Blockly.Msg.HAVING);
        }
        if (this.orderByCount_) {
            this.appendStatementInput('order_by')
                .setCheck(["table_column", "name"])
                .appendField(Blockly.Msg.ORDER_BY);
            this.appendDummyInput("sort")
                .appendField(new Blockly.FieldDropdown(sort), "sort");
        }
        if (this.limitCount_) {
            this.appendValueInput('limit')
                .setCheck('number')
                .appendField(Blockly.Msg.LIMIT);
        }
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock = createBlock(workspace, 'ADD');
        containerBlock.setColour(115);
        var connection = containerBlock.getInput('STACK').connection;

        if (this.aliasCount_) {
            var asBlock = createBlock(workspace, 'alias');
            connection.connect(asBlock.previousConnection);
            connection = asBlock.nextConnection;
        }
        if (this.groupByCount_) {
            var groupByBlock = createBlock(workspace, 'group_by');
            connection.connect(groupByBlock.previousConnection);
            connection = groupByBlock.nextConnection;
        }
        if (this.groupByHavingCount_) {
            var groupByHavingBlock = createBlock(workspace, 'group_by_having');
            connection.connect(groupByHavingBlock.previousConnection);
            connection = groupByHavingBlock.nextConnection;
        }
        if (this.orderByCount_) {
            var orderBlock = createBlock(workspace, 'order_by');
            connection.connect(orderBlock.previousConnection);
            connection = orderBlock.nextConnection;
        }
        if (this.limitCount_) {
            var limitBlock = createBlock(workspace, 'limit');
            connection.connect(limitBlock.previousConnection);
            connection = limitBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        // Disconnect the alias input blocks and remove the inputs.
        if (this.aliasCount_) {
            this.removeInput('VALUE');
        }

        this.aliasCount_ = 0;
        // Disconnect the limit input blocks and remove the inputs.
        if (this.limitCount_)
            this.removeInput('limit');

        this.limitCount_ = 0;
        // Disconnect all the group by input blocks and remove the inputs.
        if (this.groupByCount_)
            this.removeInput('group_by');

        this.groupByCount_ = 0;
        // Disconnect all the group by having input blocks and remove the inputs.
        if (this.groupByHavingCount_) {
            this.removeInput('group_by_have');
            this.removeInput('having');
        }
        this.groupByHavingCount_ = 0;
        // Disconnect all the order by input blocks and remove the inputs.
        if (this.orderByCount_) {
            this.removeInput('order_by');
            this.removeInput('sort');
        }
        this.orderByCount_ = 0;
        // Rebuild the block's optional inputs.
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'limit':
                    this.limitCount_++;
                    var limitInput = this.appendValueInput('limit');
                    limitInput.setCheck('number');
                    limitInput.appendField(Blockly.Msg.LIMIT);

                    // Reconnect any child blocks.
                    if (clauseBlock.valueConnection_) {
                        limitInput.connection.connect(clauseBlock.valueConnection_);
                    }
                    break;
                case 'group_by':
                    this.groupByCount_++;
                    var groupInput = this.appendStatementInput('group_by');
                    groupInput.setCheck(["table_column", "name"]);
                    groupInput.appendField(Blockly.Msg.GROUP_BY);
                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_) {
                        groupInput.connection.connect(clauseBlock.statementConnection_);
                    }
                    break;
                case 'group_by_having':
                    this.groupByHavingCount_++;
                    var groupHInput = this.appendStatementInput('group_by_have');
                    groupHInput.setCheck(["table_column", "name"]);
                    groupHInput.appendField(Blockly.Msg.GROUP_BY);
                    var havingInput = this.appendValueInput('having');
                    havingInput.setCheck("LogicOPs");
                    havingInput.appendField(Blockly.Msg.HAVING);
                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_) {
                        groupHInput.connection.connect(clauseBlock.statementConnection_);
                    }
                    if (clauseBlock.valueConnection_) {
                        havingInput.connection.connect(clauseBlock.valueConnection_);
                    }
                    break;
                case 'order_by':
                    this.orderByCount_++;
                    var orderInput = this.appendStatementInput('order_by');
                    orderInput.setCheck(["table_column", "name"]);
                    orderInput.appendField(Blockly.Msg.ORDER_BY);
                    var sortDummy = this.appendDummyInput("sort");
                    sortDummy.appendField(new Blockly.FieldDropdown(sort), "sort");

                    // Reconnect any child blocks.
                    if (clauseBlock.statementConnection_) {
                        orderInput.connection.connect(clauseBlock.statementConnection_);
                    }
                    break;
                case 'alias':
                    this.aliasCount_++;

                    //Alias
                    //Old version:
                    var aliasDummy = this.appendDummyInput('VALUE');
                    aliasDummy.appendField(Blockly.Msg.VARIABLES_SET_TITLE);
                    aliasDummy.appendField(new Blockly.FieldTextInput(
                            Blockly.Msg.VARIABLES_SET_ITEM), 'VAR');
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
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'limit':
                    var inputLimit = this.getInput('limit');
                    clauseBlock.valueConnection_ =
                            inputLimit && inputLimit.connection.targetConnection;
                    break;
                case 'group_by':
                    var inputgroup = this.getInput('group_by');
                    clauseBlock.statementConnection_ =
                            inputgroup && inputgroup.connection.targetConnection;
                    break;
                case 'group_by_having':
                    var inputgroupH = this.getInput('group_by_have');
                    clauseBlock.statementConnection_ =
                            inputgroupH && inputgroupH.connection.targetConnection;
                    break;
                case 'order_by':
                    var inputgroup = this.getInput('order_by');
                    clauseBlock.statementConnection_ =
                            inputgroup && inputgroup.connection.targetConnection;
                    break;
                case 'alias':
                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                    clauseBlock.nextConnection.targetBlock();
        }
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

        var stopColor = this.getColour();
        var children = this.getChildren();
        var selectHeight = this.getInput("select").renderHeight;

        for (var childKey in children) {
            var child = children[childKey];
            if (child.type === "tables_and_columns") {
                if (child.getChildren().length === 0) {
                    stopColor = child.getColour();
                    break;
                }
            }
        }

        this.gradient.setVerticalGradient(
            this, {
                "start" : "#5BA58C",
                "stop" : stopColor
            }, {
                "start" : selectHeight,
                "stop" : this.getHeightWidth().height - selectHeight
            }
        );

        if (Blockly.Block.dragMode_ == 0) {
            //No colouring and type checking, while dragging the block
            if (this.groupByCount_) {   //Checking the inputs of GROUP BY
                groupbyval(this);
            } else {
                if (this.groupByHavingCount_) {//Checking the Inputs of GROUP BY HAVING
                    groupbyval(this);
                }
            }

            /* if (this.getInputTargetBlock('select') == null) {
                //Colouring th block
                this.setColour("#74A55B");
            } */
        }
    }
};

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
        var table = Column[0][0];
        var column = "*";
        this.setHelpUrl(this.type);
        this.setColour("#74A55B");       
        this.setup(table, column);
        this.setPreviousStatement(true, ["table_column", "group_function", "sub_select", "otherfunction", "name"]);
        this.setNextStatement(true, ["table_column", "group_function", "sub_select", "otherfunction", "name"]);
        this.setTooltip('');
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
            getTableDropdowndataFromXML(), 
            function (table) {
                block.updateShape(table, "*");
            }
        );

        var columnDropdown = new Blockly.FieldDropdown(
             getColumnDropdowndataFromXML(table, true), 
             function (column) {
                var table = block.getFieldValue("tabele");
                block.updateShape(table, column);
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
    mutationToDom: function() {
        var table = this.getFieldValue('tabele');
        var column = this.getFieldValue('Column');
        var container = document.createElement('mutation');
        container.setAttribute('tabele', table);
        container.setAttribute('Column', column);

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
        this.updateShape(table, column);    
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
        this.setup(table, column);
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
        
        var parent = this.getParent();

        if (parent) {
            colourTheParent(this);

            if (parent.type == 'select' || 
                parent.type == 'sub_select' || 
                parent.type == 'sub_select_where') {
                    //evaluate the group by input if there is this input
                    if (parent.getInput('group_by_have') || 
                        parent.getInput('group_by')) {
                            groupbyval(parent);
                    }
                }
        }
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
        var table = Column[0][0];
        var column = Column[0][1][1];
        
        this.setHelpUrl(this.type);
        this.setColour("#74A55B");       
        this.setup(table, column);
        this.setTooltip('');

        this.lastConnectedParent = null;
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
            getTableDropdowndataFromXML(), 
            function (table) {
                block.updateShape(table, "*");
            }
        );
        var columnDropdown = new Blockly.FieldDropdown(
             getColumnDropdowndataFromXML(table, false), 
             function (column) {
                var table = block.getFieldValue("tabele");
                block.updateShape(table, column);
             }
        );

        console.log(getColumnDropdowndataFromXML(table, false));

        /* Setting dropdown values for table and column */
        tableDropdown.setValue(table);
        columnDropdown.setValue(column);

        console.log(table);
        console.log(column);

        block.setColour(
            sqlHelp.getTypeColour(table, column)
        );

        block.appendDummyInput('Table')
             .setAlign(Blockly.ALIGN_RIGHT)
             .appendField(tableDropdown, 'tabele')
             .appendField(" ", 'Abstand')
             .appendField(columnDropdown, "Column");

        block.setOutput(true, "table_column_var");
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
        this.updateShape(table, column);    
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
        
        var parent = this.getParent();
        colourTheParent(this);

        if (parent) {
            if (parent.type == 'compare_operator') {
                //checking inputs of compare
                var direpar = parent.getFieldValue('OP');
                checkTableInputsCompare(parent, direpar);
            }

            this.lastConnectedParent = parent;
        } else {    /* Resetting color if disonnected */
            if (this.lastConnectedParent)
                this.lastConnectedParent.setColour(
                    this.lastConnectedParent.getColour()
                );
        }
    }
};

/*------------------------------------------------------------------------------
 * Operators
 *----------------------------------------------------------------------------*/
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
        this.setColour("#5BA58C");
        this.appendValueInput("A")
            .setCheck("table_column_var");
        this.appendValueInput("B")
            .appendField(Blockly.Msg.TO)
            .setCheck(["date", "condition", "bool", "numberfunction", "charfunction", "ArithmethikOPs", "datefunction", "sub_select", "number", "string"]);
        this.setOutput(true, 'TO');
        this.setTooltip('');
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

      //No type checking and colouring , while the block is dragged  
      if (Blockly.Block.dragMode_ == 0) {
        checkTableInputsCompare(this, 'EQ');
      }
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
      this.setColour("#5BA58C");
      this.setOutput(true, "LogicOPs");
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
      var dropdown = new Blockly.FieldDropdown(OPERATORS, function (option) {
          this.sourceBlock_.updateShape(option);
      });

      clearInputList(this);

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
                  'isnull': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NULL,
                  'isnotnull': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NOT_NULL
              };
              return TOOLTIPS[op];
          });
          input.setColour(160);
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
                input.setColour(3160);
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
                      .setCheck(["date", "condition", "bool", "numberfunction", "charfunction", "ArithmethikOPs", "datefunction", "table_column_var", "sub_select", "number", "string", "groupfunction"]);

              input.appendDummyInput()
                      .setAlign(Blockly.ALIGN_LEFT)
                      .appendField(dropdown, "OP");

              input.appendValueInput('B')
                      .setCheck(["date", "condition", "bool", "numberfunction", "charfunction", "ArithmethikOPs", "datefunction", "table_column_var", "sub_select", "number", "string", "groupfunction"]);
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
                      'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
                      'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
                      'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
                      'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
                      'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
                      'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
                  };
                  return TOOLTIPS[op];
              });
              input.setColour(160);
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
        var dir = this.getFieldValue('OP');
        if (!this.workspace)
            return;

        //colourTheParent(this);

        /* 
        if (Blockly.dragMode_ === Blockly.DRAG_NONE) {
          //No checking of type ans colour changes, while the block is dragged
          //Setting the colour of the block if there are no inputs
        if (this.getInputTargetBlock('A') == null) {
            if (dir != 'like') {
                colourTheParent(this);
            }
          }

        if (this.getParent()) {
            //checking inputs of the block
            if (this.getParent().type != 'update' && this.getParent().type != 'insert')
                checkTableInputsCompare(this, dir);
        }
          
        } 
        */
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
      this.setColour(160);
      this.appendValueInput('A')
              .setAlign(Blockly.ALIGN_CENTRE)
              .setCheck(["condition", "BolleanOPs", "bool", "LogicOPs"]);
      this.appendDummyInput()
              .appendField(new Blockly.FieldDropdown(logical_conjunction), 'operator');
      this.appendValueInput('B')
              .setAlign(Blockly.ALIGN_RIGHT)
              .setCheck(["condition", "BolleanOPs", "bool", "LogicOPs"]);
      this.setOutput(true, 'BolleanOPs');
      //this.setMutator(new Blockly.Mutator(['AND']));
      // Assign 'this' to a variable for use in the tooltip closure below.
      this.setTooltip('Boolean and operator. Extending with the star icon');
      this.setInputsInline(false);
      //this.andCount_ = 0;
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
      this.setColour(160);
      this.setOutput(true, "condition");
      this.appendValueInput('A')
          .appendField(Blockly.Msg.NOT)
          .setCheck(["LogicOPs", "number", "bool", "table_column_var",
                     "date", "datefunction", "string", "BolleanOPs",
                     "condition"]);
      this.setTooltip(Blockly.Msg.BOOLEAN_TOOLTIP_NOT);
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
      var OPERATORS = [
        ['+', 'PLUS'],
        ['-', 'MINUS'],
        ['/', 'DIVIDE'],
        ['*', 'MULTIPLICATE']
      ];

      this.setHelpUrl(this.type);
      this.setColour(255);
      this.setOutput(true, "ArithmethikOPs");
      this.appendValueInput('A')
          .setCheck(["table_column_var", "number", "ArithmethikOPs", "numberfunction"]);
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_CENTRE)
          .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
      this.appendValueInput('B')
          .setAlign(Blockly.ALIGN_LEFT)
          .setCheck(["table_column_var", "number", "ArithmethikOPs", "numberfunction"]);
      this.setInputsInline(false);

      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
      this.setTooltip(function () {
        var op = thisBlock.getFieldValue('OP');
        var TOOLTIPS = {
          'PLUS': Blockly.Msg.SIMPLE_TERM_TOOLTIP_PLUS,
          'MINUS': Blockly.Msg.SIMPLE_TERM_TOOLTIP_MINUS,
          'DIVIDE': Blockly.Msg.SIMPLE_TERM_TOOLTIP_DIVIDE,
          'MULTIPLICATE': Blockly.Msg.SIMPLE_TERM_TOOLTIP_MULTIPLICATE
        };
        return TOOLTIPS[op];
      });
    },
    /**
     * Checks if the parameters are valid for the arithmetik expressions
     * Sends an alert message when they are unvalid
     *
     * @method onchange
     * @this Blockly.Block
     */
    onchange: function () {
      if (!this.workspace)
          return;

      if (Blockly.Block.dragMode_ == 0) {
        //No checking of type and colour changes, while the block is dragged
        if (this.parentBlock_) {
          var check = checkColour(this, this.parentBlock_);
          if (!check) {
              //Set the colour of the parent only if its not the same
              colourTheParent(this);
          }
        }
        checkMathInputs(this);
      }
    }
};
/*------------------------------------------------------------------------------
 * Variables
 *----------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------
 * bool-symbolizes the bool variables
 *
 * @module sql_blocks
 * @class bool
 *----------------------------------------------------------------------------*/
Blockly.Blocks['bool'] = {
    /**
     * Initialization of the bool block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
      this.setHelpUrl(this.type);
      this.setColour(160);
      this.appendDummyInput('boolean')
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(new Blockly.FieldDropdown(bool), "BOOL");
      this.setOutput(true, "bool");
      this.setTooltip('Boolean variable');
    },
    /*
     * onchange sets the Colour of a specified Parent
     *
     * @method:onchnage
     * @this Blockly.Block
     */
    onchange: function () {
      if (!this.workspace)
        return;

      if (Blockly.Block.dragMode_ == 0) {
        //No checking of type ans colour changes, while the block is dragged
        if (this.parentBlock_) {
          var check = checkColour(this, this.parentBlock_);

          //Set the colour of the parent only if its not the same
          if (!check)
            colourTheParent(this);
        }
      }
    }
};
/*------------------------------------------------------------------------------
 * num-symbolizes the numeric variables
 *
 * @module sql_blocks
 * @class num
 *----------------------------------------------------------------------------*/
Blockly.Blocks['num'] = {
    /**
     * Initialization of the num block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(255);
        this.appendDummyInput('number')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldTextInput("0", checkNumeric), "NUM");
        this.setOutput(true, "number");
        this.setTooltip(Blockly.Msg.NUMBER_TOOLTIP);
    },
    /*
     * onchange sets the colour of a specified parent
     *
     * @method:onchnage
     * @this Blockly.Block
     */
    onchange: function () {
      if (!this.workspace)
        return;
      if (Blockly.Block.dragMode_ == 0) {
        //No checking of type ans colour changes, while the block is dragged
        if (this.parentBlock_) {
          var check = checkColour(this, this.parentBlock_);
          if (!check) {
              //Set the colour of the parent only if its not the same
              colourTheParent(this);
          }
        }
      }
    }
};
/*------------------------------------------------------------------------------
 * string-symbolizes the string variables
 *
 * @module sql_blocks
 * @class string
 *----------------------------------------------------------------------------*/
Blockly.Blocks['string'] = {
    /**
     * Initialization of the string block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(this.type);
        this.setColour(15);
        this.appendDummyInput("string")
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(new Blockly.FieldTextInput(""), "String");
        this.setOutput(true, "string");
        this.setTooltip(Blockly.Msg.STRING_TOOLTIP);
    },
    /*
     * onchange sets the colour of a specified parent
     *
     * @method:onchnage
     * @this Blockly.Block
     */
    onchange: function () {
      var msg = null;
      if (!this.workspace)
          return;
      if (Blockly.Block.dragMode_ == 0) {
          //No checking of type ans colour changes, while the block is dragged
          if (this.parentBlock_) {
              var check = checkColour(this, this.parentBlock_);
              if (!check) {
                  //Set the colour of the parent only if its not the same
                  colourTheParent(this);
              }
          }
      }
      var string = this.getFieldValue("String");

      if (string == "")
        msg = Blockly.Msg.STRING_WARNING;


      this.setWarningText(msg);
    }
};
/*------------------------------------------------------------------------------
 * date-symbolizes the date variables
 *
 * @module sql_blocks
 * @class date
 *----------------------------------------------------------------------------*/
Blockly.Blocks['date'] = {
    /**
     * Initialization of the date block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {

        this.setHelpUrl(this.type);
        this.setColour(330);
        this.appendDummyInput()
                .setAlign(Blockly.ALIGN_LEFT)
                .appendField(new Blockly.FieldDate("2016-01-01"), "Date_")
                .appendField(" ");
        this.setOutput(true, "date");
        this.setTooltip(Blockly.Msg.DATE_VAR);
    },
    /*
     * onchange sets the colour of a specified parent and loads the datepciker onclick
     *
     * @method:onchange
     * @this Blockly.Block
     */
    onchange: function () {
      if (!this.workspace)
        return;

      if (Blockly.Block.dragMode_ == 0) {
        //No checking of type ans colour changes, while the block is dragged
        if (this.parentBlock_) {
          var check = checkColour(this, this.parentBlock_);
          if (!check)
            //Set the colour of the parent only if its not the same
            colourTheParent(this);
        }
      }
    }
};
/*------------------------------------------------------------------------------
 * fieldname_get-symbolizes the alias give in the group_function
 *
 * @module sql_blocks
 * @class fieldname_get
 *----------------------------------------------------------------------------*/
Blockly.Blocks['fieldname_get'] = {
    /**
     * Initialization of the fieldname_get block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
      this.setHelpUrl(this.type);
      this.setColour(115);
      this.setup(this);
//        this.appendDummyInput()
//                .appendField(new Blockly.FieldVariable(Blockly.Msg.VARIABLES_GET_ITEM), 'VAR');
      this.setPreviousStatement(true, "name");
      this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    },
    setup: function (object) {
      var variable = new Blockly.FieldVariable(Blockly.Msg.VARIABLES_GET_ITEM);
      if (variable.getValue() == " ") {
          var list = Blockly.Variables.allUsedVariables(object);
          console.log(list);
          if (list.length > 0)
            variable.setValue(list[0]);
          else
            variable.setValue("dummy");
      }
      object.appendDummyInput()
            .appendField(variable, 'VAR');
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
     * Add menu option to create getter/setter block for this setter/getter.
     * @param {!Array} options List of menu options to add to.
     * @this Blockly.Block
     */
    customContextMenu: function (options) {
      var option = {enabled: true};
      var name = this.getFieldValue('VAR');
      var xmlField = goog.dom.createDom('field', null, name);
      xmlField.setAttribute('name', 'VAR');
      var xmlBlock = goog.dom.createDom('block', null, xmlField);
      xmlBlock.setAttribute('type', this.contextMenuType_);
      option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
      options.push(option);
    }
};

/*------------------------------------------------------------------------------
 * Functions
 *----------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------
 * groupfunction-host all the sqlfunctions to group a columns value
 *
 * @module sql_blocks
 * @class groupfunction
 *----------------------------------------------------------------------------*/
Blockly.Blocks['groupfunction_factor'] = {
    /**
     * Initialization of the groupfunction block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
      this.setColour(115);
      this.setup(this, 'avg');
      this.setOutput(true, "groupfunction");
      //this.setPreviousStatement(true, ["group_function", "tables_and_columns"]);
      //this.setNextStatement(true, ["group_function", "tables_and_columns"]);
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
      if (Blockly.Names.equals(oldName, this.getFieldValue('VAR')))
          this.setFieldValue(newName, 'VAR');
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
          //Constructing the Block for minimal, maximal and count
          if (groupdir == 'min' || groupdir == 'count' || groupdir == 'max') {
              ifInput = input.appendStatementInput("group")
                      .appendField(dropdown, "group_function")
                      .setCheck(["table_column", "distinct"]);
              var thisBlock = input;
              input.setHelpUrl(function () {
                  var op = thisBlock.getFieldValue('group_function');
                  var HelpURL = {
                      'count': 'groupfunction_count',
                      'min': 'groupfunction_min',
                      'max': 'groupfunction_max'
                  };
                  return HelpURL[op];
              });
              input.setTooltip(function () {
                  var op = thisBlock.getFieldValue('group_function');
                  var TOOLTIPS = {
                      'count': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_COUNT,
                      'min': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_MIN,
                      'max': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_MAX
                  };
                  return TOOLTIPS[op];
              });
              //Restoring all childblocks
              if (this.statementConnection1_) {
                ifInput.connection.connect(this.statementConnection1_);
              }
          } else { //Constructing the Block for average, summarise, stddev and variance
            ifInput = input.appendStatementInput("group")
                           .appendField(dropdown, "group_function")
                           .setCheck(["table_column", "distinct"]);
            input.appendDummyInput('VALUE')
                  .appendField("AS")
                  .appendField(new Blockly.FieldTextInput(
                              Blockly.Msg.VARIABLES_SET_ITEM), 'VAR');

            var thisBlock = input;
            input.setHelpUrl(function () {
              var op = thisBlock.getFieldValue('group_function');
              var HelpURL = {
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
                  'avg': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_AVG,
                  'stddev': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_STDDEV,
                  'sum': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_SUM,
                  'variance': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_VARIANCE

              };
              return TOOLTIPS[op];
            });

            //Restoring all childblocks
            if (this.statementConnection1_) {
              ifInput.connection.connect(this.statementConnection1_);
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
        var table = this.getFieldValue('group_function');
        var colour = this.getColour();
        container.setAttribute('groupfunction', table);
        container.setAttribute('colourHue_', colour);
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
        console.log(xmlElement);
        if (xmlElement) {
            this.updateShape(xmlElement.attributes [0].value);
            var colour = xmlElement.attributes [1].value;
            this.setColour(colour);
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

      if (Blockly.Block.dragMode_ == 0) {
        //No type checking and colouring while block is dragged
        //Check inputs
        groupFunctioneval(this);
        if (this.getInputTargetBlock('group') == null) {
          //Set the colour of the block
          this.setColour(115);

          if (this.parentBlock_) {
            if (this.parentBlock_.type == "select"
                || this.parentBlock_.type == "sub_select"
                || this.parentBlock_.type == "sub_select_where"
              ) { //Set parent colour
              this.parentBlock_.setColour(7115);
              if (this.parentBlock_.parentBlock_) {//set the grandparent colour
                var pop = this.parentBlock_.parentBlock_;
                if (pop.type == 'compare_operator' && pop.getInputTargetBlock('A') == this.parentBlock_)
                    pop.setColour(160);
              }
            }
          }
        }
      }
    },
    customContextMenu: Blockly.Blocks['fieldname_get'].customContextMenu
};

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
      this.setColour(115);
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
            .appendField(Blockly.Msg.AS)
            .appendField(new Blockly.FieldTextInput(
                    Blockly.Msg.VARIABLES_SET_ITEM), 'VAR');
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
              'count': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_COUNT,
              'min': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_MIN,
              'max': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_MAX,
              'avg': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_AVG,
              'stddev': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_STDDEV,
              'sum': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_SUM,
              'variance': Blockly.Msg.GROUP_FUNCTION_TOOLTIP_VARIANCE
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
    mutationToDom:
            function ()
            {
                var container = document.createElement('mutation');
                var table = this.getFieldValue('group_function');
                var colour = this.getColour();
                container.setAttribute('groupfunction', table);
                container.setAttribute('colourHue_', colour);
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
      console.log(xmlElement);
      if (xmlElement) {
        this.updateShape(xmlElement.attributes [0].value);
        var colour = xmlElement.attributes [1].value;
        this.setColour(colour);
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
      if (Blockly.Block.dragMode_ == 0) {
        //No type checking and colouring while block is dragged
        //Check inputs
        groupFunctioneval(this);
        if (this.getInputTargetBlock('group') == null) {
          //Set the colour of the block
          this.setColour(115);

          if (this.parentBlock_) {
            if (this.parentBlock_.type == "select"
                || this.parentBlock_.type == "sub_select"
                || this.parentBlock_.type == "sub_select_where"
              ) {//Set parent colour
              this.parentBlock_.setColour(7115);
              if (this.parentBlock_.parentBlock_) {//set the grandparent colour
                  var pop = this.parentBlock_.parentBlock_;
                  if (pop.type == 'compare_operator' && pop.getInputTargetBlock('A') == this.parentBlock_)
                      pop.setColour(160);
              }
            }
          }
        }
      }
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

      this.setColour(255);
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

      clearInputList(this);

      if (dirnum != '') {
        dropdown.setValue(dirnum);
        //constructing the Block for modulo, power, round and truncate
        if (dirnum == 'mod' || dirnum == 'power' || dirnum == 'round' || dirnum == 'truncate') {
            var ifInput = input.appendValueInput('object')
                    .appendField(dropdown, 'number_function')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(["table_column_var", "number"]);
            var doInput = input.appendValueInput('number')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck("number");
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
                    'mod': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_MOD,
                    'power': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_POWER,
                    'round': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_ROUND,
                    'sign': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_SIGN,
                    'truncate': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_TRUNCATE
                };
                return TOOLTIPS[op];
            });
        } else {
            //Constructing the Block for the other number unctions
            var ifInput = input.appendValueInput('object')
                               .appendField(dropdown, 'number_function')
                               .setAlign(Blockly.ALIGN_RIGHT)
                               .setCheck(["table_column_var", "number"]);
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
                    'abs': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_ABS,
                    'ceil': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_CEIL,
                    'floor': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_FLOOR,
                    'sqrt': Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_SQRT
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
      this.updateShape(xmlElement.attributes [0].value);
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

/*
            for (var i = 0; i < numbers.length; i++)
                if (numbers[i] == dirnum)
                    break;
*/

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

      if (Blockly.Block.dragMode_ == 0) {
        //No type checking and colouring while block is dragged
        if (this.parentBlock_) {
          var check = checkColour(this, this.parentBlock_);
          if (!check) {
              //Set the colour of the parent only if its not the same
              colourTheParent(this);
          }
        }
        //Check the Inputs
        numberfunctioneval(this);
      }
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
                input.setTooltip(Blockly.Msg.OTHER_FUNCTION_TOOLTIP_DECODE);
                input.setColour(160);
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
                        'greatest': Blockly.Msg.OTHER_FUNCTION_TOOLTIP_GREATEST,
                        'least': Blockly.Msg.OTHER_FUNCTION_TOOLTIP_LEAST
                    };
                    return TOOLTIPS[op];
                });
                input.setColour(115);
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
                        Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ',
                        ['VAR', new Blockly.FieldTextInput(Blockly.Msg.VARIABLES_SET_ITEM)],
                        Blockly.ALIGN_LEFT);
                input.setHelpUrl('otherfunction_ifnull');
                input.setTooltip(Blockly.Msg.OTHER_FUNCTION_TOOLTIP_NVL);
                input.setColour(115);
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
        var dirother = xmlElement.attributes [0].value;
        var colour = xmlElement.getAttribute("color");

        if (dirother == 'least' || dirother == 'greatest') {
            this.updateShape(xmlElement.attributes [0].value);
            this.valueCount_ = parseInt(xmlElement.getAttribute('value'), 10);
            for (var x = 2; x <= this.valueCount_; x++) {
                this.setup2(this, x);
            }
        } else {
            this.updateShape(xmlElement.attributes [0].value);
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
        var containerBlock = createBlock(workspace, 'ADD');
        containerBlock.setColour(115);
        var connection = containerBlock.getInput('STACK').connection;

        for (var x = 2; x <= this.valueCount_; x++) {
            var newInput = createBlock(workspace, 'more');
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

        var dir = this.getFieldValue("other_function");
        if (Blockly.Block.dragMode_ == 0) {
            //No type checking and colouring while block is dragged
            othereval(this);
            if (dir != "decode") {
                //Set the colour of the Block if there are no inputs
                if (this.getInputTargetBlock('object') == null)
                    this.setColour(115);

                if (this.parentBlock_) {    //Colour the parent
                    if (this.parentBlock_.type != "tables_and_columns") {
                        if (this.parentBlock_.type != "otherfunction") {
                            this.parentBlock_.setColour(7115);
                            if (this.parentBlock_.parentBlock_) {   //Set the grandparent colour
                                var pop = this.parentBlock_.parentBlock_;
                                if (pop.type == 'compare_operator')
                                    pop.setColour(160);
                            }
                        }
                    }
                }
                if (dir == "decode") {
                    if (this.parentBlock_) {    //Colour the parent
                        var p = this.parentBlock_;
                        if (p.type == 'select' ||
                            p.type == 'sub_select' ||
                            p.type == 'sub_select_where'
                          ) {
                            if (this.parentBlock_) {
                                var check = checkColour(this, this.parentBlock_);
                                if (!check) //Set the colour of the parent only if its not the same
                                    p.setColour(160);
                            }
                        }
                    }
                }
            }
        }
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

        this.setColour(15);
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
    setup: function (input, dirchar)
    {
        var dropdown = new Blockly.FieldDropdown(funct, function (option) {
            this.sourceBlock_.updateShape(option);
        });
        if (dirchar != '') {
            dropdown.setValue(dirchar);
            if (dirchar == 'lpad' || dirchar == 'rpad')
            {
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
                        'rpad': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_RPAD,
                        'lpad': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_LPAD
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

                    input.setTooltip(Blockly.Msg.CHAR_FUNCTION_TOOLTIP_REPLACE);
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

                        input.setTooltip(Blockly.Msg.CHAR_FUNCTION_TOOLTIP_SUBSTRING);
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
                            input.setTooltip(Blockly.Msg.CHAR_FUNCTION_TOOLTIP_INSTR);

                        }
                        else {
                            if (dirchar == 'str_to_date') {
                                ifInput = input.appendValueInput('option')
                                        .appendField(dropdown, 'char_function')
                                        .setAlign(Blockly.ALIGN_LEFT)
                                        .setCheck(["string", "table_column_var"]);
                                input.appendDummyInput("option4")
                                        .appendField(new Blockly.FieldTextInput("%d,%m,%Y"), "charsets");
                                input.setColour(15);
                                input.setTooltip(Blockly.Msg.CONVERSION_FUNCTION_TOOLTIP_STR_TO_DATE);
                                //Restore the childblocks
                                if (this.valueConnection1_) {
                                    ifInput.connection.connect(this.valueConnection1_);
                                }
                            } else
                            {
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
                                        'lower': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_LOWER,
                                        'ltrim': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_LTRIM,
                                        'rtrim': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_RTRIM,
                                        'soundex': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_SOUNDEX,
                                        'upper': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_UPPER,
                                        'ascii': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_ASCII,
                                        'length': Blockly.Msg.CHAR_FUNCTION_TOOLTIP_LENGTH
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
        this.updateShape(xmlElement.attributes [0].value);
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

        if (Blockly.Block.dragMode_ == 0) {
            //No type checking and colouring while block is dragged
            if (this.parentBlock_) {
                var check = checkColour(this, this.parentBlock_);
                if (!check) //Set the colour of the parent only if its not the same
                    colourTheParent(this);
            }
            chareval(this); //Checking the inputs
        }
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
        this.setColour(330);
        this.setup(this, 'sysdate');
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
                        'now': Blockly.Msg.DATE_FUNCTION_TOOLTIP_NOW,
                        'sysdate': Blockly.Msg.DATE_FUNCTION_TOOLTIP_SYSDATE,
                        'curdate': Blockly.Msg.DATE_FUNCTION_TOOLTIP_CURDATE
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
                input.setColour(330);
                input.setHelpUrl('conversion_date_format');
                input.setTooltip(Blockly.Msg.CONVERSION_FUNCTION_TOOLTIP_DATE_FORMAT);
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
                     .appendField(Blockly.Msg.INTERVAL)
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

                input.setTooltip(Blockly.Msg.Date_FUNCTION_TOOLTIP_ADD_MONTHS);

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
                input.setTooltip(Blockly.Msg.DATE_FUNCTION_TOOLTIP_EXTRACT);

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
                        'last_day': Blockly.Msg.DATE_FUNCTION_TOOLTIP_LAST_DAY,
                        'date': Blockly.Msg.DATE_FUNCTION_TOOLTIP_DATE,
                        'month': Blockly.Msg.DATE_FUNCTION_TOOLTIP_MONTH,
                        'year': Blockly.Msg.DATE_FUNCTION_TOOLTIP_YEAR

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
        this.updateShape(xmlElement.attributes [0].value);
        if (this.getInput('vals'))
            this.setFieldValue(xmlElement.attributes [1].value, 'UNIT');
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

        if (Blockly.Block.dragMode_ == 0) {
            //No type checking and colouring while block is dragged
            if (this.parentBlock_) {
                var check = checkColour(this, this.parentBlock_);
                if (!check) //Set the colour of the parent only if its not the same
                    colourTheParent(this);
            }
            //Checking the inputs
            dateeval(this);
        }
    }
};

/*******************************************************************************
 * Mutator blocks section
 ******************************************************************************/
Blockly.Blocks['ADD'] = {
    /**
     * Initialization of the ADD block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(160);
        this.appendDummyInput()
            .appendField(Blockly.Msg.ADD);
        this.appendStatementInput('STACK');
        this.setTooltip(Blockly.Msg.ADD_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['AND'] = {
    /**
     * Initialization of the AND block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(160);
        this.appendDummyInput()
            .appendField(Blockly.Msg.AND);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.AND_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['OR'] = {
    /**
     * Initialization of the OR block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(160);
        this.appendDummyInput()
            .appendField(Blockly.Msg.OR);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.OR_TOOLTIP);
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
        this.setColour(115);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MORE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.OR_TOOLTIP);
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
        this.setColour(115);
        this.appendDummyInput()
            .appendField(Blockly.Msg.AS);
        this.setPreviousStatement(true, "alias");
        this.setNextStatement(true, ["limit", "group_by", "order_by"]);
        this.setTooltip(Blockly.Msg.AS_TOOLTIP);
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
        this.setColour(115);
        this.appendDummyInput()
            .appendField(Blockly.Msg.GROUP_BY);
        this.setPreviousStatement(true, "group_by");
        this.setNextStatement(true, "limit");
        this.setTooltip(Blockly.Msg.GROUP_BY_TOOLTIP);
        this.contextMenu = false;
    },
    onchange: function () {
        if (!this.workspace)
            return;

        if (checkUndefined(Blockly.Block.dragMode_) == 0)
            if (checkUndefined(this.childBlocks_[0]))
                if (checkUndefined(this.childBlocks_[0].type) != 'limit')
                    this.childBlocks_[0].unplug(true, true);
    }
};
Blockly.Blocks['group_by_having'] = {
    /**
     * Initialization of the more block.
     * Sets color, helpUrl, inputs, outputs and the tooltip of this block.
     *
     * @method init
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(115);
        this.appendDummyInput()
            .appendField(Blockly.Msg.GROUP_BY)
            .appendField(Blockly.Msg.HAVING);
        this.setPreviousStatement(true, "group_by");
        this.setNextStatement(true, "limit");
        this.setTooltip(Blockly.Msg.GROUP_BY_HAVING_TOOLTIP);
        this.contextMenu = false;
    },
    onchange: function () {
        if (!this.workspace)
            return;

        if (checkUndefined(Blockly.Block.dragMode_) == 0)
            if (checkUndefined(this.childBlocks_[0]))
                if (checkUndefined(this.childBlocks_[0].type) != 'limit')
                    this.childBlocks_[0].unplug(true, true);
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
        this.setColour(115);
        this.appendDummyInput()
            .appendField(Blockly.Msg.ORDER_BY);
        this.setPreviousStatement(true, "order_by");
        this.setNextStatement(true, "limit");
        this.setTooltip(Blockly.Msg.ORDER_BY_TOOLTIP);
        this.contextMenu = false;
    },
    onchange: function () {
        if (!this.workspace)
            return;

        if (checkUndefined(Blockly.Block.dragMode_) == 0)
            if (checkUndefined(this.childBlocks_[0]))
                if (checkUndefined(this.childBlocks_[0].type) != 'limit')
                    this.childBlocks_[0].unplug(true, true);
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
        this.setColour(115);
        this.appendDummyInput()
                .appendField(Blockly.Msg.LIMIT);
        this.setPreviousStatement(true, "limit");
        this.setTooltip(Blockly.Msg.LIMIT_TOOLTIP);
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
        this.setColour(115);
        this.appendDummyInput()
            .appendField(Blockly.Msg.SET);
        this.setPreviousStatement(true, "set");
        this.setNextStatement(true, "set");
        this.setTooltip(Blockly.Msg.SET_TOOLTIP);
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
        this.setColour(115);
        this.appendDummyInput()
            .appendField(Blockly.Msg.INTO);
        this.setPreviousStatement(true, "into");
        this.setNextStatement(true, "into");
        this.setTooltip(Blockly.Msg.INTO_TOOLTIP);
        this.contextMenu = false;
    }
};

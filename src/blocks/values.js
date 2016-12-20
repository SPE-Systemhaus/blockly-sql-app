/******************************************************************************
 * This file contains the variable blocks.                 
 * 
 * @author Kirsten Schwarz, SPE Systemhaus GmbH (2013-2014)
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH (since 2016)
 *                                                                                        
 ******************************************************************************/

Blockly.Blocks['array'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(this.type);
    this.setColour(SQLBlockly.Colours.list);
    this.itemCount_ = 2;
    this.updateShape_();
    this.setOutput(true, 'Array');
    this.setMutator(new Blockly.Mutator(['list_entry']));
    this.setTooltip(SQLBlocks.Msg.Tooltips.ARRAY);
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('list');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('list_entry');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('ADD' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField(SQLBlocks.Msg.Blocks.ARRAY_EMPTY);
    }
    // Add new inputs.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        var input = this.appendValueInput('ADD' + i)
                        .setCheck(["string", "number", "date", "bool"]);
        if (i == 0) {
          input.appendField(SQLBlocks.Msg.Blocks.ARRAY);
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  }
};
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
        this.setColour(SQLBlockly.Colours.boolean);
        this.appendDummyInput('boolean')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldDropdown(bool), "BOOL");
        this.setOutput(true, "bool");
        this.setTooltip(SQLBlocks.Msg.Tooltips.BOOL);
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

        sqlHelp.colourTheParent(this);
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
        this.setColour(SQLBlockly.Colours.number);
        this.appendDummyInput('number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldTextInput("0", checkNumeric), "NUM");
        this.setOutput(true, "number");
        this.setTooltip(SQLBlocks.Msg.Tooltips.NUMBER);
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

        sqlHelp.colourTheParent(this);
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
        this.setColour(SQLBlockly.Colours.string);
        this.appendDummyInput("string")
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(new Blockly.FieldTextInput(""), "String");
        this.setOutput(true, "string");
        this.setTooltip(SQLBlocks.Msg.Tooltips.STRING);
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

        sqlHelp.colourTheParent(this);
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
        this.setColour(SQLBlockly.Colours.date);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(new Blockly.FieldDate("2016-01-01"), "Date_")
            .appendField(" ");
        this.setOutput(true, "date");
        this.setTooltip(SQLBlocks.Msg.Tooltips.DATE);
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

        sqlHelp.colourTheParent(this);
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
        this.setColour(SQLBlockly.Colours.list);
        this.setup(this);
        //        this.appendDummyInput()
        //                .appendField(new Blockly.FieldVariable(SQLBlocks.Msg.Blocks.VARIABLES_GET_ITEM), 'VAR');
        this.setPreviousStatement(true, "name");
        this.setTooltip(SQLBlocks.Msg.Tooltips.GET);
    },
    setup: function (object) {
        var variable = new Blockly.FieldVariable(SQLBlocks.Msg.Blocks.VARIABLES_GET_ITEM);
        if (variable.getValue() == " ") {
            var list = Blockly.Variables.allUsedVariables(object);
            if (list.length > 0)
                variable.setValue(list[0]);
            else
                variable.setValue("dummy_variable");
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
        var option = { enabled: true };
        var name = this.getFieldValue('VAR');
        var xmlField = goog.dom.createDom('field', null, name);
        xmlField.setAttribute('name', 'VAR');
        var xmlBlock = goog.dom.createDom('block', null, xmlField);
        xmlBlock.setAttribute('type', this.contextMenuType_);
        option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
        options.push(option);
    }
};

/*******************************************************************************
 * MUTATORS                                                                    *
 *******************************************************************************/
Blockly.Blocks['list'] = {
    init: function () {
        this.setColour(SQLBlockly.Colours.mutators);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.LIST);
        this.appendStatementInput('STACK');
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.LIST);
        this.contextMenu = false;
    }
};

Blockly.Blocks['list_entry'] = {
    init: function () {
        this.setColour(SQLBlockly.Colours.list);
        this.appendDummyInput()
            .appendField(SQLBlocks.Msg.Blocks.LIST_ENTRY);
        this.setPreviousStatement(true, "list_entry");
        this.setNextStatement(true, "list_entry");
        this.setTooltip(SQLBlocks.Msg.Tooltips.Mutators.LIST_ENTRY);
        this.contextMenu = false;
    }
};
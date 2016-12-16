function SQLHelper() {

  var __construct = function() {
  }()

  this.separateTableFromColumn = function(column) {
    var separated = { "table" : null, "column" : null };

    if (column.indexOf(".") !== -1) {
      var separator = column.indexOf(".");
      var end = column.length;
      separated.table = column.substring(0, separator);
      separated.column = column.substring(separator + 1, end);
    } else
      separated.column = column;

    return separated;
  };

  this.getTableOfColumn = function(checkColumn) {
    console.warn("This table is only the first occurence!");

    for (var table in dbStructure) {
      var columns = dbStructure[table];

      for (columnKey in columns) {
        if (checkColumn === columns[columnKey].name)
          return table;
      }
    }

    return null;
  };

  this.getTypeColour = function(table, column) {
    var columns = getColumnsArrayFromStructure(table);
    var columnIndex = -1;

    if (column === "*")
      return SQLBlockly.Colours.list;

    /* Check if column exists */
    columns.forEach(function(columnObject, index) {
      if (column === columnObject.name)
        columnIndex = index
    });

    if (columnIndex !== -1) {
      var type = columns[columnIndex].type.toLowerCase().trim();

      switch(type) {
          case "int":
          case "int unsigned":
          case "integer":
          case "integer unsigned":
          case "tinyint":
          case "tinyint unsigned":
          case "smallint":
          case "smallint unsigned":
          case "mediumint":
          case "mediumint unsigned":
          case "bigint":
          case "bigint unsigned":
          case "double":
          case "float":
          case "decimal":
              return SQLBlockly.Colours.number;
          case "char":
          case "varchar":
          case "text":
          case "string":
              return SQLBlockly.Colours.string;
          case "date":
          case "datetime":
              return SQLBlockly.Colours.date;
          case "bool":
          case "boolean":
          case "binary":
              return SQLBlockly.Colours.boolean;
          case "enum":
              return SQLBlockly.Colours.list;
          case "blob":
              return SQLBlockly.Colours.undefined;
          default:
              return SQLBlockly.Colours.undefined;
      }
    }

    console.warn("Type of column is not in list, yet!");
    return SQLBlockly.Colours.undefined;
  };

  this.getTypeByColour = function(color) {
    switch(color) {
      case SQLBlockly.Colours.string:
        return "string";
      case SQLBlockly.Colours.number:
        return "number";
      case SQLBlockly.Colours.date:
        return "date";
      case SQLBlockly.Colours.boolean:
        return "bool";
    }

    return "undefined";
  };

  this.getType = function(table, column) {
    var columns = getColumnsArrayFromStructure(table);
    var color = this.getTypeColour(table, column);

    switch(color) {
      case SQLBlockly.Colours.string:
        return "string";
      case SQLBlockly.Colours.number:
        return "number";
      case SQLBlockly.Colours.date:
        return "date";
      case SQLBlockly.Colours.boolean:
        return "bool";
      case SQLBlockly.Colours.list:
        return "tables_column_var";
    }

    return null;
  };

  /**
   * This functions returns an array with columns, which can
   * be used in Blockly DropDownFieldValues.
   *
   * @return {Array} options Array for Blockly.Dropdown.
   */
  this.getTableDropdowndata = function() {
      var tables = getTablesArrayFromStructure();
      var options = [];

      for (var table in dbStructure) {
          var option = [];
          option[0] = table;
          option[1] = table;
          options.push(option);
      }

      return options;
  };

  /**
   * This functions returns an array with columns, which can
   * be used in Blockly DropDownFieldValues.
   *
   * @param {String} tableName Name of the table, which should return all columns.
   * @pram {bool} withAll Return with '*' as column or not as first entry.
   * @return {Array} options Array for Blockly.Dropdown.
   */
  this.getColumnDropdowndata = function(tableName, withAll) {
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
  };

  /**
   * Set the colour of a block, if it is the parent Block of a particular block.
   * If the parent block has blocks with different colors, it will be colored
   * back to his standard color.
   *
   * @param {type} object-symbolizes the block, which uses the function
   */
  this.colourTheParent = function(block) {
      if (!block)
          return;

      var parent = block.getParent();
      var gradient = new ColourGradient();

      if (parent) {
          block.lastConnectedParent = parent;

          /* Getting the colors of all children of the parent block */
          var multipleColors = false;
          var children = parent.getChildren();
          var colors = [];
          children.forEach(function(block) {
              var color = block.getColour();

              if (!(color in colors))
                  colors.push(color);
          });

          /* Check if different colours are used in the parent block */
          if (colors.length > 1) {
              colors.forEach(function(color) {
                  if (colors[0] !== color) {
                      multipleColors = true;
                      parent.setColour(parent.getColour());
                  }
              });
          }

          if (parent.getColour() !== block.getColour() && !multipleColors) {
              switch(parent.type) {
                  case "compare_operator" :
                  case "conditions" :
                  case "logical_conjunction" :
                  case "to":
                  case "array":
                      gradient.setHorizontalGradient(/*parent,*/ block);
                      break;
              }
          }
      }
  };

  /**
   * Getting the colour of the first table_column child. If there is more
   * than one child, the colour of the block will be taken.
   *
   * @param {Blockly.Block} block Current block.
   * @return {String} colour The colour of the child or of the current block.
   */
  this.getChildColour = function(block) {
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
  };

  /**
   * Create on the specific workspace a new Blockly.Block.
   *
   * @param {Blockly.Workspace} workspace Blockly Workspace, where the block should be added.
   * @param {String} name Name of the block that should be created.
   * @return {Blockly.Block} block The created block.
   */
  this.createBlock = function(workspace, name) {
    var block = workspace.newBlock(name);
    block.initSvg();
    block.render();

    return block;
  };

  /**
   * Clearing all inputs of a block that are existing at the moment.
   *
   * @param {Blockly.Block} block The inputs of this block will be removed.
   */
  this.clearInputList = function(block) {
    for (var inputKey in block.inputList)
        block.removeInput(block.inputList[inputKey].name);
  };

  this.addGroupByInput = function(block) {
    block.groupByCount_ = 1;
    block.appendStatementInput('group_by')
        .setCheck(["table_column", "name"])
        .appendField(SQLBlocks.Msg.Blocks.GROUP_BY);
  };

  this.addHavingInput = function(block) {
    block.groupByHavingCount_ = 1;
    block.appendValueInput('having')
        .setCheck(["LogicOPs", "condition", "table_column"])
        .appendField(SQLBlocks.Msg.Blocks.HAVING);
  }

  this.addOrderByInput = function(block) {
    block.orderByCount_ = 1;
    block.appendStatementInput('order_by')
        .setCheck(["table_column", "name"])
        .appendField(SQLBlocks.Msg.Blocks.ORDER_BY);
    block.appendDummyInput("sort")
        .appendField(new Blockly.FieldDropdown(sort), "sort");
  };

  this.addLimitInput = function(block) {
    block.limitCount_ = 1;
    block.appendValueInput('limit')
        .setCheck('number')
        .appendField(SQLBlocks.Msg.Blocks.LIMIT);
  }

  this.addAliasInput = function(block) {
    block.aliasCount_ = 1;
    block.appendDummyInput('VALUE')
        .appendField(SQLBlocks.Msg.Blocks.VARIABLES_SET_TITLE)
        .appendField(new Blockly.FieldTextInput(
            Blockly.Msg.VARIABLES_SET_ITEM), 'VAR');
    block.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    block.contextMenuType_ = 'fieldname_get';
  }

  this.decomposeGroupBy = function(workspace, block, mutator) {
    if (block.groupByCount_ === 1) {
        var groupByBlock = this.createBlock(workspace, "group_by");
        mutator.getInput("group_by").connection.connect(groupByBlock.outputConnection);

        if (block.groupByHavingCount_) {
            var havingBlock = this.createBlock(workspace, "having");
            groupByBlock.getInput("having").connection.connect(havingBlock.outputConnection);
        }
    }
  };

  this.composeGroupBy = function(block, mutator) {
    var groupByBlock = mutator.getInputTargetBlock("group_by");
    if (groupByBlock) {
        if (block.groupByCount_ === 0)
            this.addGroupByInput(block);

        if (groupByBlock.getInputTargetBlock("having")) {
            if (block.groupByHavingCount_ < 1)
                this.addHavingInput(block);
        } else
            removeHavingInput(block);
    } else
        removeGroupByInput(block);
  };

  this.decomposeOrderBy = function(workspace, block, mutator) {
    if (block.orderByCount_ === 1) {
        var orderByBlock = this.createBlock(workspace, "order_by");
        mutator.getInput("order_by").connection.connect(orderByBlock.outputConnection);
    }
  };

  this.composeOrderBy = function(block, mutator) {
    if (mutator.getInputTargetBlock("order_by")) {
        if (block.orderByCount_ === 0)
            this.addOrderByInput(block);
    } else
        removeOrderByInput(block);
  };

  this.decomposeLimit = function(workspace, block, mutator) {
    if (block.limitCount_ === 1) {
        var limitBlock = this.createBlock(workspace, "limit");
        mutator.getInput("limit").connection.connect(limitBlock.outputConnection);
    }
  };

  this.composeLimit = function(block, mutator) {
    if (mutator.getInputTargetBlock("limit")) {
        if (block.limitCount_ === 0)
            this.addLimitInput(block);
    } else
        removeLimitInput(block);
  };

  this.decomposeAlias = function(workspace, block, mutator) {
    if (block.aliasCount_ === 1) {
        var aliasBlock = this.createBlock(workspace, "alias");
        mutator.getInput("alias").connection.connect(aliasBlock.outputConnection);
    }
  };

  this.composeAlias = function(block, mutator) {
    if (mutator.getInputTargetBlock("alias")) {
        if (block.aliasCount_ === 0)
            this.addAliasInput(block);
    } else
        removeAliasInput(block);
  };

  this.sortInputs = function(block) {
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
        return inputPriority[a.name] - inputPriority[b.name];
    });

    //block.render();
    block.onchange();
  };

  var removeGroupByInput = function(block) {
    if (block.getInput("group_by")) {
        block.groupByCount_ = 0;
        block.removeInput("group_by");

        removeHavingInput(block);
    }
  }.bind(this);

  var removeHavingInput = function(block) {
    if (block.getInput("having")) {
        block.groupByHavingCount_ = 0;
        block.removeInput("having");
    }
  }.bind(this);

  var removeOrderByInput = function(block) {
    if (block.getInput("order_by")) {
        block.orderByCount_ = 0;
        block.removeInput('order_by');
        block.removeInput('sort');
    }
  }.bind(this);

  var removeLimitInput = function(block) {
    if (block.getInput("limit")) {
        block.limitCount_ = 0;
        block.removeInput('limit');
    }
  }.bind(this);

  var removeAliasInput = function(block) {
    if (block.getInput("VALUE")) {
        block.aliasCount_ = 0;
        block.removeInput("VALUE");
    }
  }.bind(this);

} /* End of Class */

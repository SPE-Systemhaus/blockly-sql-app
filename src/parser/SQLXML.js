/******************************************************************************
 * The SQLXML class has functions that helps to generate a blockly compatible *
 * XML format to use in the Blockly SQL Generator.                            *
 *                                                                            *
 * @author Michael Kolodziejczyk, SPE Systemhaus GmbH                         * 
 ******************************************************************************/
function SQLXML() {

  var xml = null;
  var sqlHelp = null;

  var pSelect = null;
  var pInsert = null;
  var pUpdate = null;

  var allColumnsCnt = 0;

  var __construct = function() {
    sqlHelp = new SQLHelper();

    pSelect = new SQLStatement();
    pInsert = new SQLStatement();
    pUpdate = new SQLStatement();
  }()

  this.printSQLOnWorkspace = function(node) {
    createXMLHeader();
    xml.appendChild(node);

    console.log(xml);

    Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
    Blockly.mainWorkspace.render();

    delete pSelect;
    delete pInsert;
    delete pUpdate;
    delete sqlHelp;
  };

  this.createSelect = function (parsed) {
    pSelect = parsed;

    var fields = {};
    var mutations = {
      "groupby" : 0,
      "groupbyhaving" : 0,
      "orderby" : 0,
      "limit" : 0
    };
    var values = {};
    var statements = {};

    console.log(pSelect);

    if (pSelect.selection) {
      var next = document.createElement("next");
      next.appendChild(pSelect.columns);
      pSelect.selection.appendChild(next);
      statements["select"] = pSelect.selection;
    } else {
      statements["select"] = pSelect.columns;
    }

    for (var blockKey in pSelect.columns.getElementsByTagName("block")) {
      var block = pSelect.columns.getElementsByTagName("block")[blockKey];

      if (typeof block === "object") {  /* Change groupfunction_factor into normal groupfunction */
        if (block.getAttribute("type") === "groupfunction_factor")
          block.setAttribute("type", "groupfunction");
      }
    }

    checkTables(pSelect.tables, pSelect.columns);

    if (pSelect.where)
      values["Clause"] = pSelect.where;

    if (pSelect.groupby) {
      checkTables(pSelect.tables, pSelect.groupby.expressions);
      mutations["groupby"] = 1;
      statements["group_by"] = pSelect.groupby.expressions;
      
      if (pSelect.groupby.having) {
        mutations["groupbyhaving"] = 1;
        values["having"] = pSelect.groupby.having;
      }
    }

    if (pSelect.orderby) {
      checkTables(pSelect.tables, pSelect.orderby.expressions);
      mutations["orderby"] = 1;
      statements["order_by"] = pSelect.orderby.expressions;
      mutations["sortDirection"] = fields["sort"] =
        (pSelect.orderby.direction) ? pSelect.orderby.direction.toLowerCase() : "asc";
    }

    if (pSelect.limit) {
      mutations["limit"] = 1;
      values["limit"] = pSelect.limit;
    }

    var selectBlock = createXMLBlock(
      "select",
      statements,
      values,
      fields,
      mutations
    );

    allColumnsCnt = 0;

    return selectBlock;
  };

  this.createInsert = function(parsed) {
    var insertBlock = null;
    var values = [];
    var valuesCnt = 0;

    pInsert = parsed;

    if (pInsert.columns === '*')
      pInsert.columns = getColumnsArrayFromStructure(pInsert.table);

//      if (pInsert.columns.length !== pInsert.values.length)
//        console.warn("Columns and Values has not the same length!");

    for (var parsedColumn in pInsert.columns) {
      var key = "set" + valuesCnt;
      var tableNode = this.createTableVar({ "table" : [pInsert.table], "column" : [pInsert.columns[valuesCnt]] });
      var valueNode = pInsert.values[parsedColumn];
      var fields = {
        "A" : tableNode,
        "B" : valueNode
      };
      var toBlock = createXMLBlock("to", [], fields);

      values[key] = toBlock;
      valuesCnt++;
    }

    insertBlock = createXMLBlock(
      "insert",
      [],
      values,
      [],
      { "set" : valuesCnt - 1 }
    );

    return insertBlock;
  };

  this.createUpdate = function(parsed) {
    var updateBlock = null;
    var whereBlocks = null;
    var values = [];
    var valuesCnt = 0;

    pUpdate = parsed;

    for (var parsedColumn in pUpdate.columns) {
        var key = "set" + valuesCnt;
        var tableBlock = this.createTableVar({ "table" : [pUpdate.table], "column" : [pUpdate.columns[valuesCnt]] });
        var valueBlock = pUpdate.values[parsedColumn];
        var toBlock = createXMLBlock("to", [], {
          "A" : tableBlock,
          "B" : valueBlock
        }, [], {
          "colour" : "#000000"
        });

        values[key] = toBlock;
        valuesCnt++
      }

    values["Clause"] = pUpdate.where;

    updateBlock = createXMLBlock(
      "update",
      [],
      values,
      [], {
        "set" : valuesCnt - 1,
        "colorhue" : "#000000"
    });

    return updateBlock;
  };

  this.addAlias = function(node, value) {
    var mutation = node.getElementsByTagName("mutation")[0];

    node.appendChild(
      createField("VAR", value)
    );

    if (mutation)
      mutation.setAttribute("alias", 1);
    else {
      node.appendChild(
        createMutation({ "alias" : 1 })
      );
    }
      
    return node;
  };

  this.createTo = function(column, value) {
    var fields = {
      "A" : column,
      "B" : value
    };

    return createXMLBlock(
      "to",
      [], 
      fields
    );
  };

  this.createArray = function(value) {
    var fields = {
      "ADD0" : value  
    };
    
    return createXMLBlock(
      "array",
      [],
      fields
    );
  };

  this.addArray = function(currentArray, value) {
    var values = currentArray.getElementsByTagName("value");
    var index = 0;

    for (var i = 0; i < values.length; i++) {
      var name = values[i].getAttribute("name");
      if (name)
        index = parseInt(name.substring(3, name.length), 10) + 1;
    }

    var newValue = document.createElement("value");
    newValue.setAttribute("name", "ADD" + index);
    newValue.appendChild(value);
    currentArray.appendChild(newValue);

    return currentArray;
  };

  this.addTable = function(currentTableNode, nextTableNode) {
    var next = document.createElement("next");
    var currentNext = currentTableNode.getElementsByTagName("next");

    next.appendChild(nextTableNode);

    if (currentNext.length === 0)
      currentTableNode.appendChild(next);
    else
      currentNext[currentNext.length - 1].getElementsByTagName("block")[0].appendChild(next);

    return currentTableNode;
  };

  /**
   * Creating Table Block by column and table.
   * If the column is null, the column will be
   * searched in the existing tables.
   *
   * @param column {String} - Parsed columnName
   * @param table {String} - Parsed tableName
   * @return tableBode {XML} - TableBlock as XML
   */
  this.createTable = function(column, table) {   
    if (!table && column !== '*')
      table = sqlHelp.getTableOfColumn(column);
    
    if (column === '*')
      allColumnsCnt++;

    if (allColumnsCnt > 1) {
      allColumnsCnt = 0;
      throw new AllColumnsException();
    }

    var fields = { 
      "tabele" : table,
      "Column" : column 
    };

    var mutations = fields;

    return createXMLBlock(
      "tables_and_columns",
      [],
      [], 
      fields,
      mutations
    );
  };

  this.createTableVar = function(value) {
    var table = null;
    var column = value.column;

    if (value.table)
      table = value.table;
    else
      table = sqlHelp.getTableOfColumn(value.column);

    var fields = {
      "tabele" : table,
      "Column" : column
    };
    
    var mutations = fields;

    return createXMLBlock(
        "tables_and_columns_var",
        [],
        [],
        fields,
        mutations
      );
  };

  this.createNumberFunction = function(func, expression_a, expression_b) {
    var values = { "object" : expression_a };

    if (expression_b)
      values["number"] = expression_b;

    return createXMLBlock(
      "numberfunction",
      [],
      values,
      { "number_function" : func },
      { "numberfunction" : func }
    );
  };

  this.createCharFunction = function(func, expression_a, expression_b, expression_c) {
    var values = { "option" : expression_a };

    if (expression_b)
      values["num"] = expression_b;

    if (expression_c)
      values["option2"] = expression_c;

    return createXMLBlock(
      "charfunction",
      [],
      values,
      { "char_function" : func },
      { "charfunction" : func }
    );
  }

  this.createDateFunction = function(func, date) {
    var fields = { "date_function" : func };

    return createXMLBlock(
      "datefunction",
      [],
      [],
      fields
    );
  };

  /**
   * Creating Math Block.
   *
   * @param operand_a {XML} - BlockXML of the first operand
   * @param operand_b {XML} - BlockXML of the second operand
   * @return mathBlock {XML} - MathBlock as XML
   */
  this.createMath = function(operand_a, operand_b, operator) {
    return createXMLBlock(
      "terms_simple_expressions",
      [],
      { "A" : operand_a, "B" : operand_b },
      { "OP" : operator },
      { "op" : operator,
      "colour" : "#5ba58c" }
    );
  };

  this.createAnd = function(factor_a, factor_b) {
    var values = { "A" : factor_a, "B" : factor_b };

    return andBlock = createXMLBlock(
        "logical_conjunction",
        [],
        values,
        { "operator" : "AND"}
      );
  };

  this.createOr = function(factor_a, factor_b) {
    var values = { "A" : factor_a, "B" : factor_b };

    return createXMLBlock(
      "logical_conjunction",
      [],
      values,
      { "operator" : "OR"}
    );
  };

  this.createCompareOperator =
    function(expression_a, expression_b, comp) {
      var fields = {};

      if (expression_a) {
        if (expression_a.type === "tables_and_columns_var")
          expression_a.type = "tables_and_columns";

        fields.A = expression_a;
      }

      if (expression_b) {
        if (expression_b.type === "tables_and_columns_var")
          expression_b.type = "tables_and_columns";

        fields.B = expression_b;
      }

      return createXMLBlock(
        "compare_operator",
        [],
        fields,
        { "OP" : comp },
        { "op" : comp,
        "colour" : "#5ba58c" }
      );
  };

  this.createString = function(value) {
    return createXMLBlock(
      'string',
      [],
      [],
      {"String" : value}
    );
  };

  this.createNumber = function(value) {
    return createXMLBlock(
      "num",
      [],
      [],
      { "NUM" : value }
    );
  };

  this.createDate = function(value) {
    return createXMLBlock(
      "date",
      [],
      [],
      { "Date_" : value }
    );
  };

  this.negate = function(value) {
    return createXMLBlock(
      "conditions",
      [],
      { "A" : value }
    );
  };

  this.createBool = function(value) {
    return createXMLBlock(
      "bool",
      [],
      [],
      {"BOOL" : (value === true) ? 1 : 0}
    );
  };

  this.createNumberFunction =
    function(func, expression_a, expression_b) {
      var values = {};

      if (expression_a)
        values["object"] = expression_a;

      if (expression_b)
        values["number"] = expression_b;

      return createXMLBlock(
              "numberfunction",
              [],
              values,
              [],
              { "number_function" : func.toLowerCase(),
                "colorHue" : "#000000" }
            );
    };

  this.createGroupFunction = function (func, expressions, alias) {
    var mutations = { 
      "group_function" : func.toLowerCase(), 
      "colour" : "#000000" 
    };   
    var values = { "group" : expressions };
    var fields = { "group_function" : func.toLowerCase() };

    var block =  createXMLBlock(
      "groupfunction",
      [],
      values,
      fields,
      mutations
    );
    
    if (alias)
      return this.addAlias(block, alias);
    
    return block;
  };

  this.createGroupFunctionFactor =
    function(func, expressions) {
      return createXMLBlock(
        "groupfunction_factor",
        [],
        { "group" : expressions },
        [],
        { "group_function" : func.toLowerCase(),
          "colour" : "#000000" }
      );
  };

  this.createDistinct = function() {
    return createXMLBlock(
      "distinct"
    );
  };

/******************************************************************************
 * PRIVATE FUNCTIONS                                                          *
 *                                                                            *
 * HELPING TO CREATE XML NODES                                                *
 ******************************************************************************/

  /**
   * Creating a Statement Tag to represent a blockly Statement.
   *
   * @param name {String} - Name of the statement.
   * @return statementNode {XML} - Created Statement Node.
   */
  var createStatement = function(name) {
    var statementNode = document.createElement("statement");
    statementNode.setAttribute("name", name);

    return statementNode;
  }.bind(this);

  /**
   * Creating a Field Tag to represent a blockly Field.
   *
   * @param name {String} - FieldName.
   * @param value {String} - Value of the Field.
   * @return fieldNode {XML} - Created Field Node.
   */
  var createField = function(name, value) {
    var fieldNode = document.createElement("field");
    fieldNode.setAttribute("name", name);
    fieldNode.textContent = value;

    return fieldNode;
  }.bind(this);

  /**
   * Creating a Mutation Tag to represent a blockly Mutation.
   *
   * @param attributes {Object} - Attributes that should be added to the mutation by key value.
   * @return mutationNode {XML} - Created Mutation Node.
   */
  var createMutation = function(attributes) {
    var mutationNode = document.createElement("mutation");

    for (var attributeKey in attributes) {
      var attribute = attributes[attributeKey];
      mutationNode.setAttribute(attributeKey, attribute);
    }

    return mutationNode;
  }.bind(this);

  /**
   * Creating a Value Tag to represent a blockly Value.
   *
   * @param name {String} - Name of the value.
   * @return valueNode {XML} - Created Value Node.
   */
  var createValue = function(name) {
    var valueNode = document.createElement("value");
    valueNode.setAttribute("name", name);
    return valueNode;
  }.bind(this);

  /**
   * Creating a Block Tag to represent a Blockly Block.
   *
   * @param type {String} - Name of the block that should be created.
   * @param statements {Object} - Creating statements by key/value structure.
   * @param values {Object} - Creating values by key/value structure.
   * @param fields {Object} - Creating fields by key/value structure.
   * @param mutations {Object} - Creating mutations by key/value structure.
   * @return blockNode {XML} - Created Block Node.
   */
  var createXMLBlock = function(type, statements, values, fields, mutations) {
    var blockNode = document.createElement("block");
    blockNode.setAttribute("type", type);

    /* Adding mutation */
    if (mutations) {
      var mutationNode = createMutation(mutations);
      blockNode.appendChild(mutationNode);
    }

    /* Adding statements */
    for (var statementKey in statements) {
      var statement = statements[statementKey];
      var statementNode = createStatement(statementKey);
      if (statement)
        statementNode.appendChild(statement);

      blockNode.appendChild(statementNode);
    }

    /* Adding values */
    for (var valueKey in values) {
      var value = values[valueKey];
      var valueNode = createValue([valueKey]);

      if (value)
        valueNode.appendChild(value);

      blockNode.appendChild(valueNode);
    }

    /* Adding fields */
    for (var fieldKey in fields) {
      var fieldNode = createField(fieldKey, fields[fieldKey]);
      blockNode.appendChild(fieldNode);
    }

    return blockNode;
  }.bind(this);

  var createXMLHeader = function() {
    xml = document.createElement("xml");
    xml.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  }.bind(this);

  var checkTables = function(tables, columnsXML) {
    var tableBlocks = columnsXML.getElementsByTagName("field");
    var mutations = columnsXML.getElementsByTagName("mutation");
    var tablesColumns = {};

    /* Getting columns of parsed tables */
    for (var tableKey in tables) {
      var table = tables[tableKey].tablename;
      tablesColumns[table] = getColumnsArrayFromStructure(table);
    }

    var mutationCnt = 0;

    for (var i = 0; i < tableBlocks.length; i += 2) {
      /* Check only table and column nodes by checking the type of the parent node */
      if (tableBlocks[i].parentNode.getAttribute("type") === "tables_and_columns") {
        var table = i;
        var column = i + 1;
        var tableName = null;
        var columnName = null;

        if (tableBlocks[table]) {
          tableName = tableBlocks[table].innerHTML;
        }

        if (tableBlocks[column])
          columnName = tableBlocks[column].innerHTML;

        if (Object.keys(tablesColumns).length === 1 && 
            tableName === "" && 
            columnName === "*") {
          tableBlocks[table].innerHTML = Object.keys(tablesColumns)[0];
        }

        for (var tableNameKey in tablesColumns) {
          var columns = tablesColumns[tableNameKey];

          //if (columnName === "*" && !hasTable)
          //  tableBlocks[table].innerHTML = tableNameKey;

          for (var x = 0; x < columns.length; x++) {
            if (columns[x] === columnName) {
              tableBlocks[table].innerHTML = tableNameKey;
            }
          }
        }         
      }
      
      /* Update table and column in mutation tags */
      mutations[mutationCnt].setAttribute("tabele", tableBlocks[table].innerHTML);
      mutations[mutationCnt].setAttribute("Column", tableBlocks[column].innerHTML);
      mutationCnt++;
    }

  }.bind(this);

} /* End of Class */

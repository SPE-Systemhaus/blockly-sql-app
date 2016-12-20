(function() {
	'use strict';
	SQLBlockly.SQLGen.select = function(block) {
	  var code = "SELECT";
	  var columns = SQLBlockly.SQLGen.statementToCode(block, 'select');
	  var columnsArray = columns.split(",");;
	  var tables = "";
	  var tablesArray = {};
	  var clause = SQLBlockly.SQLGen.valueToCode(block, "Clause", null);
	  var groupfunction = null;
	  var groupby = SQLBlockly.SQLGen.statementToCode(block, 'group_by');
	  var groupbyhaving = SQLBlockly.SQLGen.statementToCode(block, 'group_by_have');
	  var limit = SQLBlockly.SQLGen.valueToCode(block, "limit", null);
	  var orderby = SQLBlockly.SQLGen.statementToCode(block, 'order_by');

	  /* Checking for groupfunctions in columns */
		for (var colKey in columnsArray) {
			var column = columnsArray[colKey];

			for (var key in SQLBlocks.Msg.DROPDOWN.GROUPFUNCTIONS) {
				var g = SQLBlocks.Msg.DROPDOWN.GROUPFUNCTIONS[key][1];
				var regex = new RegExp(g + "\\(", "i");
				var n = column.search(regex);
				var tableName = null;
				
				if (n !== -1) {
					if (column.lastIndexOf(")") !== -1) {
						groupfunction = column.substring(n, column.indexOf(")") + 1).trim();
						tableName = groupfunction.substring(g.length + 1, column.indexOf(")") - 1).split(".")[0].trim();
					} else {
						groupfunction = column.substring(n, n + g.length + 1).trim();
						tableName = groupfunction.substring(g.length + 1, column.length - 1).split(".")[0].trim();
					}

					if (!(tableName in tablesArray) &&
						!(tableName.length === 0 || /^\s*$/.test(tableName)) /* TODO: Abfrage in Funktion auslagern! */
						) {
						tablesArray[tableName] = tableName;
						tables += tableName + ",";
					}

					column = column.replace(groupfunction, "");
					columnsArray[colKey] = column;
				}
			}
		}

	  /* Building columns */
	  for (var columnKey in columnsArray) {
			var col = columnsArray[columnKey];
			var idx = col.indexOf(".");
			var tableName = col.substring(0, idx).trim();

			if (!(tableName in tablesArray) &&
				!(tableName.length === 0 || /^\s*$/.test(tableName)) &&
				!(tableName.includes("SELECT"))
				) {
				tablesArray[tableName] = tableName;
				tables += tableName + ",";
			}
	  }

	  columns = columns.substring(0, columns.length - 1);
	  tables = tables.substring(0, tables.length - 1);

	  code += columns + "\nFROM " + tables;

	  if (SQLBlockly.SQLGen.isNotEmpty(clause)) {
			clause = clause.substring(1, clause.length - 1).trim();
			if (clause.charAt(clause.length - 1) === ",")
				clause = clause.substring(0, clause.length - 1);	

			code += "\nWHERE " + clause;
	  }

	  if (SQLBlockly.SQLGen.isNotEmpty(groupby)) {
			groupby = groupby.substring(0, groupby.length - 1);
			code += "\nGROUP BY " + groupby;
	  }

	  if (SQLBlockly.SQLGen.isNotEmpty(groupbyhaving)) {
			var having = SQLBlockly.SQLGen.valueToCode(block, "having", null);
			having = having.substring(1, having.length - 1);
			groupbyhaving = groupbyhaving.substring(0, groupbyhaving.length - 1);
			code += "\nGROUP BY " + groupbyhaving + "\nHAVING " + having;
	  }

	  if (SQLBlockly.SQLGen.isNotEmpty(limit)) {
			limit = limit.substring(1, limit.length - 1);
			code += "\nLIMIT " + limit;
	  }

	  if (SQLBlockly.SQLGen.isNotEmpty(orderby)) {
			var orderDirection = block.getField("sort").value_;
			orderby = orderby.substring(0, orderby.length - 1);
			code += "\nORDER BY " + orderby + " " + orderDirection;
	  }

	  return code;
	};

	SQLBlockly.SQLGen.insert = function(block) {
	  var code = "INSERT INTO ";
	  var idx = 0;
	  var table = "";
	  var column = "";
	  var value = "";

	  while (block.getInput("set" + idx)) {
			var to = SQLBlockly.SQLGen.valueToCode(block, "set" + idx, null);
			if (to) {
				to = to.substring(1, to.length - 1).trim();
				table = to.split(".")[0].trim();
				column += to.split("=")[0].split(".")[1].trim() + ", ";
				value += to.split("=")[1].trim() + ", ";
			}
			idx++;
	  }

	  column = column.substring(0, column.length - 2);
	  value = value.substring(0, value.length - 2);

	  code += table + "\n(" + column + ")\nVALUES\n(" + value + ")";

	  return code;
	};

	SQLBlockly.SQLGen.update = function(block) {
	  var code = "UPDATE ";
	  var idx = 0;
	  var table = "";
	  var set = "";
	  var clause = SQLBlockly.SQLGen.valueToCode(block, "Clause", null);

	  while (block.getInput("set" + idx)) {
			var to = SQLBlockly.SQLGen.valueToCode(block, "set" + idx, null);
			if (to) {
				to = to.substring(1, to.length - 1);
				table = to.split(".")[0];
				set += to + ", ";
			}

			idx++;
		}
		
		set = set.substring(0, set.length - 2);
		code += table + " SET " + set;

		if (clause !== "" && clause) {
			clause = clause.substring(1, clause.length - 1);
			code += "\nWHERE " + clause;
	  	}

	  return code;
	};

	SQLBlockly.SQLGen.sub_select = function(block) {
	  return "(" + SQLBlockly.SQLGen.select(block) + "), ";
	};

	SQLBlockly.SQLGen.sub_select_where = function(block) {
	  return ["(" + SQLBlockly.SQLGen.select(block) + "), ", 1];
	};

	SQLBlockly.SQLGen.distinct = function(block) {
	  var code = "DISTINCT ";
	  var statements = SQLBlockly.SQLGen.statementToCode(block, "distinct2");
	  statements = statements.substring(0, statements.length - 1);

	  code += statements;

	  return code;
	};
})();
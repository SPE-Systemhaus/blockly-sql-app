window.BlocklyPlugins = window.BlocklyPlugins || {};

(function() {
	'use strict';
	SQLBlockly.SQLGen.compare_operator = function(block) {
	  var code = "";
	  var a = SQLBlockly.SQLGen.valueToCode(block, "A", 1);
	  var b = SQLBlockly.SQLGen.valueToCode(block, "B", 1);
	  var compareOperator = block.getField("OP").text_;
	  a = a.substring(1, a.length - 1);
	  b = b.substring(1, b.length - 1);

	  code += a + " " + compareOperator + " " + b;

	  return [code, 1];
	};

	SQLBlockly.SQLGen.to = function(block) {
	  var code = "";
	  var column = SQLBlockly.SQLGen.valueToCode(block, "A", 1);
	  var value = SQLBlockly.SQLGen.valueToCode(block, "B", 1);
	  column = column.substring(1, column.length - 1);
	  value = value.substring(1, value.length - 1);

	  code += column + " = " + value;

	  return [code, 1];
	};

	SQLBlockly.SQLGen.logical_conjunction = function(block) {
	  var code = "";
	  var a = SQLBlockly.SQLGen.valueToCode(block, "A", 1);
	  var b = SQLBlockly.SQLGen.valueToCode(block, "B", 1);
	  var operator = block.getField("operator").getValue();
	  a = a.substring(0, a.length - 1);
	  b = b.substring(1, b.length);

	  code += a + " " + operator + " " + b;

	  return [code, 1];
	};

	SQLBlockly.SQLGen.conditions = function(block) {
	  var code = "NOT ";
	  var a = SQLBlockly.SQLGen.valueToCode(block, "A", 1);
	  a = a.substring(1, a.length - 1);
	  code += a;
	  return [code, 1];
	};

	SQLBlockly.SQLGen.terms_simple_expressions = function(block) {
	  var code = "";
	  var a = SQLBlockly.SQLGen.valueToCode(block, "A", 1);
	  var b = SQLBlockly.SQLGen.valueToCode(block, "B", 1);
	  var operator = block.getField("OP").text_;
	  a = a.substring(1, a.length - 1);
	  b = b.substring(1, b.length - 1);
	  code += "(" + a + " " + operator + " " + b + ")";
	  return [code, 1];
	};
})();
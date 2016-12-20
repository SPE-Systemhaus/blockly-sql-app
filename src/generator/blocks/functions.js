(function() {
	'use strict';
	SQLBlockly.SQLGen.groupfunction = function(block) {
	  var code = "";
		var groupfunc = block.getField("group_function").getValue().toUpperCase();
	  var table = SQLBlockly.SQLGen.statementToCode(block, "group");
	  var variable = block.getField("VAR").getValue();
	  table = table.substring(0, table.length - 1);

	  code += groupfunc + "(" + table + ")";

	  if (variable !== "" && variable !== "undefined" && variable)
		code += " AS " + variable;

	  return code + ",";
	};


	SQLBlockly.SQLGen.charfunction = function(block) {
	  var code = "";
	  var func = block.getField("char_function").getValue();
	  var option = SQLBlockly.SQLGen.valueToCode(block, "option", 1);
	  var num = SQLBlockly.SQLGen.valueToCode(block, "num", 1);
	  var option2 = SQLBlockly.SQLGen.valueToCode(block, "option2", 1);

	  option = option.substring(1, option.length - 1);
	  num = num.substring(1, num.length - 1);
	  option2 = option2.substring(1, option2.length - 1);

	  code += func + "(" + option;

	  if (num !== "" && num)
		code += ", " + num;

	  if (option2 !== "" && option2)
		code += ", " + option2;

	  code += ")";

	  return [code, SQLBlockly.SQLGen.ORDER_FUNCTION_CALL];
	};

	SQLBlockly.SQLGen.numberfunction = function(block) {
	  var code = "";
	  var func = block.getField("number_function").getValue();
	  var object = SQLBlockly.SQLGen.valueToCode(block, "object", 1);
	  var number = SQLBlockly.SQLGen.valueToCode(block, "number", 1);
	  object = object.substring(1, object.length - 1);
	  number = number.substring(1, number.length - 1);

	  code += func + "(" + object;

	  if (number !== "" && number)
			code += ", " + number;

	  code += ")";

	  return [code, SQLBlockly.SQLGen.ORDER_FUNCTION_CALL];
	};

	SQLBlockly.SQLGen.datefunction = function(block) {
	  var code = "";
		var func = block.getField("date_function").getValue().toUpperCase();
		var object = SQLBlockly.SQLGen.valueToCode(block, "object", 1);

		code += func;
		
		if (object !== "" && object)
			code += object;
		else 
			code += "()";

		return [code, SQLBlockly.SQLGen.ORDER_FUNCTION_CALL];
	};
})();
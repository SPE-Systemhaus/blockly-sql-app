window.BlocklyPlugins = window.BlocklyPlugins || {};

(function() {
	'use strict';
	SQLBlockly.SQLGen.tables_and_columns = function(block) {
	  var code = "";
	  code += block.getFieldValue('tabele') + "."
		+ block.getFieldValue('Column') + ",";
	  
		return code;
	};

	SQLBlockly.SQLGen.tables_and_columns_var = function(block) {
	  var code = "";
	  code += block.getFieldValue('tabele').trim() + "."
		+ block.getFieldValue('Column').trim();

	  return [code, SQLBlockly.SQLGen.ORDER_ADDITION];
	};
})();
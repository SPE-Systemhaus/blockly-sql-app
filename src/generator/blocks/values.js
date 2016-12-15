window.BlocklyPlugins = window.BlocklyPlugins || {};

(function() {
	'use strict';

	SQLBlockly.SQLGen.num = function(block) {
		return [block.getField('NUM').getValue(), 1];
	};

	SQLBlockly.SQLGen.string = function(block) {
		return ["'" + block.getField('String').getValue() + "'", 1];
	};

	SQLBlockly.SQLGen.date = function(block) {
		return ["'" + block.getField('Date_').getValue() + "'", 1];
	};

	SQLBlockly.SQLGen.fieldname_get = function(block) {
	  var code = "AS ";
	  var name = block.getField("VAR");
	  
	  if (name)
			code += name.getValue();
	  else
			code = "";

	  return code;
	};

	SQLBlockly.SQLGen.bool = function(block) {
	  return [block.getField('BOOL').getValue(), 1];
	};

	SQLBlockly.SQLGen.array = function(block) {
		var code = "(";

		for (var i = 0; i < this.itemCount_; i++) {
			var target = this.getInputTargetBlock("ADD" + i);

			if (target) {
				switch(target.type) {
					case "num":
							code += target.getField("NUM").getValue();
						break;
					case "string":
						code += "'" + target.getField("String").getValue() + "'";
						break;
					case "bool":
						code += target.getField("BOOL").getValue();
						break;
					case "date":
						code += "'" + target.getField("Date_").getValue() + "'";
						break;
				}
     	 		
				code += ", ";
			}
    	}

		if (i > 0 && code.charAt(code.length - 2) == ",")
			code = code.substring(0, code.length - 2);

		code += ")";

		return [code, 1];
	};

})();
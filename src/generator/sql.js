(function() {
	/**
	 * @fileoverview Functions for generating SQL from blocks.
	 * @author mk@spe-systemhaus.de (Michael Kolodziejczyk, SPE Systemhaus GmbH)
	 */
	'use strict';

	/**
	 * SQL code generator.
	 * @type {!Blockly.Generator}
	 */
	SQLBlockly.SQLGen = new Blockly.Generator('SQL');
	
	SQLBlockly.SQLGen.isNotEmpty = function(value) {
	  if (value !== "" && value)
		return value;

	  return null;
	};
	
	/**
	 * List of illegal variable names.
	 * This is not intended to be a security feature.  Blockly is 100% client-side,
	 * so bypassing this list is trivial.  This is intended to prevent users from
	 * accidentally clobbering a built-in object or function.
	 * @private
	 */
	SQLBlockly.SQLGen.addReservedWords(
		// SQL Keywords
		"SELECT", "INSERT", "UPDATE", "ALL", "DISTINCT", "AS", "INTO",
		"FROM", "VALUES", "WHERE", "SET", "GOUP BY", "ORDER BY", "HAVING",
		"LIMIT", "AVG", "COUNT", "MIN", "MAX", "STDDEV", "SUM", "VARIANCE",
		"ASC", "DESC", "AS"
	  );

	/**
	 * Order of operation ENUMs.
	 * http://docs.oracle.com/cd/A87860_01/doc/server.817/a85397/operator.htm
	 */
	SQLBlockly.SQLGen.ORDER_ATOMIC = 0;           // 0 "" ...
	SQLBlockly.SQLGen.ORDER_MEMBER = 1.1;         // . []
	SQLBlockly.SQLGen.ORDER_FUNCTION_CALL = 2;    // ()
	SQLBlockly.SQLGen.ORDER_INCREMENT = 3;        // ++
	SQLBlockly.SQLGen.ORDER_DECREMENT = 3;        // --
	SQLBlockly.SQLGen.ORDER_BITWISE_NOT = 4.1;    // ~
	SQLBlockly.SQLGen.ORDER_UNARY_PLUS = 4.2;     // +
	SQLBlockly.SQLGen.ORDER_UNARY_NEGATION = 4.3; // -
	SQLBlockly.SQLGen.ORDER_LOGICAL_NOT = 4.4;    // NOT
	SQLBlockly.SQLGen.ORDER_DIVISION = 5.1;       // /
	SQLBlockly.SQLGen.ORDER_MULTIPLICATION = 5.2; // *
	SQLBlockly.SQLGen.ORDER_MODULUS = 5.3;        // %
	SQLBlockly.SQLGen.ORDER_SUBTRACTION = 6.1;    // -
	SQLBlockly.SQLGen.ORDER_ADDITION = 6.2;       // +
	SQLBlockly.SQLGen.ORDER_BITWISE_SHIFT = 7;    // << >> >>>
	SQLBlockly.SQLGen.ORDER_RELATIONAL = 8;       // < <= > >=
	SQLBlockly.SQLGen.ORDER_IN = 8;               // in
	SQLBlockly.SQLGen.ORDER_EQUALITY = 9;         // == != === !==
	SQLBlockly.SQLGen.ORDER_BITWISE_AND = 10;     // &
	SQLBlockly.SQLGen.ORDER_BITWISE_XOR = 11;     // ^
	SQLBlockly.SQLGen.ORDER_BITWISE_OR = 12;      // |
	SQLBlockly.SQLGen.ORDER_LOGICAL_AND = 13;     // &&
	SQLBlockly.SQLGen.ORDER_LOGICAL_OR = 14;      // ||
	SQLBlockly.SQLGen.ORDER_ASSIGNMENT = 15;      // = += -= *= /= %= <<= >>= ...
	SQLBlockly.SQLGen.ORDER_COMMA = 16;           // ,
	SQLBlockly.SQLGen.ORDER_NONE = 99;            // (...)

	/**
	 * Initialise the database of variable names.
	 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
	 */
	SQLBlockly.SQLGen.init = function(workspace) {
	  if (!SQLBlockly.SQLGen.variableDB_) {
		SQLBlockly.SQLGen.variableDB_ =
			new Blockly.Names(SQLBlockly.SQLGen.RESERVED_WORDS_);
	  } else {
		SQLBlockly.SQLGen.variableDB_.reset();
	  }
	};

	/**
	 * Prepend the generated code with the variable definitions.
	 * @param {string} code Generated code.
	 * @return {string} Completed code.
	 */
	SQLBlockly.SQLGen.finish = function(code) {
	  // Clean up temporary data.
	  SQLBlockly.SQLGen.variableDB_.reset();
	  
	  return code.trim() + ";";
	};

	/**
	 * Naked values are top-level blocks with outputs that aren't plugged into
	 * anything.  A trailing semicolon is needed to make this legal.
	 * @param {string} line Line of generated code.
	 * @return {string} Legal line of code.
	 */
	SQLBlockly.SQLGen.scrubNakedValue = function(line) {
	  return line + '\n';
	};

	/**
	 * Encode a string as a properly escaped SQL string, complete with
	 * quotes.
	 * @param {string} string Text to encode.
	 * @return {string} SQL string.
	 * @private
	 */
	SQLBlockly.SQLGen.quote_ = function(string) {
	  // Can't use goog.string.quote since Google's style guide recommends
	  // JS string literals use single quotes.
	  string = string.replace(/\\/g, '\\\\')
					 .replace(/\n/g, '\\\n')
					 .replace(/'/g, '\\\'');
	  return '\'' + string + '\'';
	};

	/**
	 * Common tasks for generating SQL from blocks.
	 * Handles comments for the specified block and any connected value blocks.
	 * Calls any statements following this block.
	 * @param {!Blockly.Block} block The current block.
	 * @param {string} code The SQL code created for this block.
	 * @return {string} SQL code with comments and subsequent blocks added.
	 * @private
	 */
	SQLBlockly.SQLGen.scrub_ = function(block, code) {
	  var commentCode = '';
	  // Only collect comments for blocks that aren't inline.
	  if (!block.outputConnection || !block.outputConnection.targetConnection) {
			// Collect comment for this block.
			var comment = block.getCommentText();
			comment = Blockly.utils.wrap(comment, SQLBlockly.SQLGen.COMMENT_WRAP - 3);
			if (comment) {
				if (block.getProcedureDef) {
				// Use a comment block for function comments.
				commentCode += '/**\n' +
								SQLBlockly.SQLGen.prefixLines(comment + '\n', ' * ') +
								' */\n';
				} else {
				commentCode += SQLBlockly.SQLGen.prefixLines(comment + ' */\n', '/* ');
				}
			}
			// Collect comments for all value arguments.
			// Don't collect comments for nested statements.
			for (var i = 0; i < block.inputList.length; i++) {
				if (block.inputList[i].type == Blockly.INPUT_VALUE) {
					var childBlock = block.inputList[i].connection.targetBlock();
					if (childBlock) {
						var comment = SQLBlockly.SQLGen.allNestedComments(childBlock);
						if (comment) {
							commentCode += SQLBlockly.SQLGen.prefixLines(comment + ' */\n', '/* ');
						}
					}
				}
			}
	  }
	  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
	  var nextCode = SQLBlockly.SQLGen.blockToCode(nextBlock);
	  return commentCode + code + nextCode;
	};

	/**
	 * Gets a property and adjusts the value while taking into account indexing.
	 * @param {!Blockly.Block} block The block.
	 * @param {string} atId The property ID of the element to get.
	 * @param {number=} opt_delta Value to add.
	 * @param {boolean=} opt_negate Whether to negate the value.
	 * @param {number=} opt_order The highest order acting on this value.
	 * @return {string|number}
	 */
	SQLBlockly.SQLGen.getAdjusted = function(block, atId, opt_delta, opt_negate,
		opt_order) {
	  var delta = opt_delta || 0;
	  var order = opt_order || SQLBlockly.SQLGen.ORDER_NONE;
	  if (block.workspace.options.oneBasedIndex) {
		delta--;
	  }
	  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
	  if (delta > 0) {
			var at = SQLBlockly.SQLGen.valueToCode(block, atId,
				SQLBlockly.SQLGen.ORDER_ADDITION) || defaultAtIndex;
	  } else if (delta < 0) {
			var at = SQLBlockly.SQLGen.valueToCode(block, atId,
				SQLBlockly.SQLGen.ORDER_SUBTRACTION) || defaultAtIndex;
	  } else if (opt_negate) {
			var at = SQLBlockly.SQLGen.valueToCode(block, atId,
				SQLBlockly.SQLGen.ORDER_UNARY_NEGATION) || defaultAtIndex;
	  } else {
			var at = SQLBlockly.SQLGen.valueToCode(block, atId, order) ||
				defaultAtIndex;
	  }

	  if (Blockly.isNumber(at)) {
			// If the index is a naked number, adjust it right now.
			at = parseFloat(at) + delta;
			if (opt_negate) {
				at = -at;
			}
	  } else {
			// If the index is dynamic, adjust it in code.
			if (delta > 0) {
				at = at + ' + ' + delta;
				var innerOrder = SQLBlockly.SQLGen.ORDER_ADDITION;
			} else if (delta < 0) {
				at = at + ' - ' + -delta;
				var innerOrder = SQLBlockly.SQLGen.ORDER_SUBTRACTION;
			}
			if (opt_negate) {
				if (delta) {
					at = '-(' + at + ')';
				} else {
					at = '-' + at;
				}
				var innerOrder = SQLBlockly.SQLGen.ORDER_UNARY_NEGATION;
			}
			innerOrder = Math.floor(innerOrder);
			order = Math.floor(order);
			if (innerOrder && order >= innerOrder) {
				at = '(' + at + ')';
			}
	  }
	  return at;
	};
})();
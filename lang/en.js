SQLBlocks = {};
SQLBlocks.Msg = {};

/**
 * DROPDOWN ENTRIES
 * 
 * @type Array: time represents the time units
 * @type Array: datefunct-array for the date_function-block
 * @type Array: other-array for the other_function-block
 * @type Array: funct-array for the char_function-block
 * @type Array: OPERATORS-array for the compare_operator-block
 * @type Array: group-array for the group-function-block
 * @type Array: numbers-array for the number-function-block
 */
var time = [
    ["MICROSENCONDS", "MICROSECONDS"],
    ["SECOND", "SECOND"],
    ["MINUTE", "MINUTE"],
    ["HOUR", "HOUR"],
    ["DAY", "DAY"],
    ["WEEK", "WEEK"],
    ["MONTH", "MONTH"],
    ["QUARTER", "QUARTER"],
    ["YEAR", "YEAR"],
    ["SECOND_MICROSECOND", "SECOND_MICROSECOND"],
    ["MINUTE_MICROSECOND", "MINUTE_MICROSECOND"],
    ["MINUTE_SECOND", "MINUTE_SECOND"],
    ["HOUR_MICROSECOND", "HOUR_MICROSECOND"],
    ["HOUR_SECOND", "HOUR_SECOND"],
    ["HOUR_MINUTE", "HOUR_MINUTE"],
    ["DAY_MICROSECOND", "DAY_MICROSECOND"],
    ["DAY_SECOND", "DAY_SECOND"],
    ["DAY_MINUTE", "DAY_MINUTE"],
    ["DAY_HOUR", "DAY_HOUR"],
    ["YEAR_MONTH", "YEAR_MONTH"]
];

var datefunct = [
    //["SYSDATE", "sysdate"],
    //["DATE ADD", "add_months"], //using date_add()because add-month is an oracle function. It is equivalent to date_add() in mysql
    //["DATE SUB", "sub_months"],
    //["LAST DAY", "last_day"],
    ["NOW", "now"],
    //["MONTH", "month"],
    //["YEAR", "year"],
    ["EXTRACT", "extract"],
    ["CURDATE", "curdate"],
    ["DATE", "date"],
    //["TO CHAR", "date_format"] //Using date_format instead of to_char, because to_char is not a mysql function
];

var other = [
    ["IF", "decode"], //using if because decode is an oracle function. It is equivalent to if in mysql
    ["GREATEST", "greatest"],
    ["LEAST", "least"],
    ["IFNULL", "nvl"] //using ifNull because nvl is an oracle function. It is equivalent to ifNULL in mysql
];

var funct = [
    ['LOWER', 'lower'],
    ['LPAD', 'lpad'],
    ['LTRIM', 'ltrim'],
    ['REPLACE', 'replace'],
    ['RPAD', 'rpad'],
    ['RTRIM', 'rtrim'],
    ['SUBSTRING', 'substring'],
    ['UPPER', 'upper'],
    ['ASCII', 'ascii'],
    ['INSTR', 'instr'],
    ['LENGTH', 'length'],
    ["TO DATE", "str_to_date"]//Using str_to_date instead of to date, because to_date is not a mysql function];
];

var OPERATORS = [
    ['=', 'EQ'],
    ['\u2260', 'NEQ'],
    ['>', 'LT'],
    ['\u2265', 'LTE'],
    ['<', 'GT'],
    ['\u2264', 'GTE'],
    ['IS NULL', 'isnull'],
    ['IS NOT NULL', 'isnotnull'],
    ["IN", "in"],
    ['LIKE', 'like']
];

var group = [
    ["AVG", "avg"],
    ["COUNT", "count"],
    ["MIN", "min"],
    ["MAX", "max"],
    ["STDDEV", "stddev"],
    ["SUM", "sum"],
    ["VARIANCE", "variance"]
];

var numbers = [
    ["ABS", "abs"],
    ["CEIL", "ceil"],
    ["FLOOR", "floor"],
    ["MOD", "mod"],
    ["POWER", "power"],
    ["ROUND", "round"],
    ["SIGN", "sign"],
    ["SQRT", "sqrt"],
    ["TRUNCATE", "truncate"]
];

var sort = [
    ["ASCENDANT", "asc"],
    ["DESCENDANT", "desc"]
];

var logical_conjunction = [
  ["AND", "AND"],
  ["OR", "OR"]
];

var bool = [
  ["true", "1"],
  ["false", "0"]
];

/**
 * USER messages
 */
SQLBlocks.Msg.User = {};

SQLBlocks.Msg.User.CONFIRM_SAVE_WORKSPACE = "Do you really want to save the actual workspace?";
SQLBlocks.Msg.User.CONFIRM_LOAD_WORKSPACE = "Are you sure to load a new SQL statement into the workspace?";
SQLBlocks.Msg.User.TOOLTIP_SQL_BOX = "To convert your SQL statement into blocks, just type it in. Be sure to check you spelling and set all the blanks. Then klick OK.";

/**
 * BLOCKS
 */
SQLBlocks.Msg.Blocks = {};

SQLBlocks.Msg.Blocks.INSERT_VALUES = "INSERT VALUES";
SQLBlocks.Msg.Blocks.SET = "SET";
SQLBlocks.Msg.Blocks.WHERE = "WHERE"
SQLBlocks.Msg.Blocks.UPDATE = "UPDATE";
SQLBlocks.Msg.Blocks.SELECT = "SELECT";
SQLBlocks.Msg.Blocks.GROUP_BY = "GROUP BY";
SQLBlocks.Msg.Blocks.HAVING = "HAVING";
SQLBlocks.Msg.Blocks.ORDER_BY = "ORDER BY";
SQLBlocks.Msg.Blocks.LIMIT = "LIMIT";
SQLBlocks.Msg.Blocks.DISTINCT = "DISTINCT";
SQLBlocks.Msg.Blocks.SUBSELECT = "SUBSELECT";
SQLBlocks.Msg.Blocks.TO = "TO";
SQLBlocks.Msg.Blocks.NOT = "NOT";
SQLBlocks.Msg.Blocks.AS = "AS";
SQLBlocks.Msg.Blocks.INTERVAL = "INTERVAL";
SQLBlocks.Msg.Blocks.ADD = "ADD";
SQLBlocks.Msg.Blocks.AND = "AND";
SQLBlocks.Msg.Blocks.OR = "OR";
SQLBlocks.Msg.Blocks.INTO = "INTO";
SQLBlocks.Msg.Blocks.MORE = "New Input";
SQLBlocks.Msg.Blocks.VARIABLES_DEFAULT_NAME = " ";
SQLBlocks.Msg.Blocks.VARIABLES_GET_ITEM = SQLBlocks.Msg.Blocks.VARIABLES_DEFAULT_NAME;
SQLBlocks.Msg.Blocks.VARIABLES_SET_TITLE = "AS";

/**
 * TOOLTIPS
 */
SQLBlocks.Msg.Tooltips = {};

/* COMMANDS */
SQLBlocks.Msg.Tooltips.DISTINCT = "The DISTINCT keyword can be used to return only distinct (different) values.";

/* TABLES */

/* VALUES */
SQLBlocks.Msg.Tooltips.NUMBER = 'Number variable';
SQLBlocks.Msg.Tooltips.STRING = 'String variable';
SQLBlocks.Msg.Tooltips.DATE = 'Date variable';
SQLBlocks.Msg.Tooltips.GET = "Returns the value of this variable.";
SQLBlocks.Msg.Tooltips.BOOL = "Boolean variable";

/* FUNCTIONS */
SQLBlocks.Msg.Tooltips.CONVERSION_FUNCTION = {};
SQLBlocks.Msg.Tooltips.CONVERSION_FUNCTION.DATE_FORMAT = "Uses one date-value and a character set connection. Returns a string with the date containing non-ASCII charcters, specified by the character set.";
SQLBlocks.Msg.Tooltips.CONVERSION_FUNCTION.STR_TO_DATE = "Uses one string-value, containing date and/or time, and a character set connection. Returns a date with the String containing non-ASCII charcters, specified by the character set.";

SQLBlocks.Msg.Tooltips.DATE_FUNCTION = {};
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.ADD_MONTHS = "Performs date arithmethic.Uses a date-value, and a number choosen with the time-unit. Returns a date specified by the number and the unit";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.CURDATE="Returns the current date as a value.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.EXTRACT = "Extracts a date from a date-value or function.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.LAST_DAY = "Uses one date-value. Returns the corresponding value for the last day of the month. ";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.MONTHS_BETWEEN = "Uses a time unit and two time-values.Returns date-value 2 – date-value1.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.NOW = "Returns the current date and time as a value in 'YYYY-MM-DD HH:MM:SS'.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.MONTH = "Uses a date-value.Returns the month for date, in the range 1 to 12 for January to December.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.YEAR = "Uses a date-value. Returns the year for a date, in the range from 0000 to 9999.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.SYSDATE = "Returns the time at which it executes";

SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION = {};
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.ABS = "Uses one number-value. Returns the absolute value of the number_value.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.CEIL = "Uses one number-value. Returns the smallest integer value not less than the used value";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.FLOOR = "Uses one number-value. Returns the largest integer value not greater than the used value. ";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.MOD = "Uses two number-values.Modulo operation. Returns the remainder of value 1 divided by value 2.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.POWER = "Uses two number-values.Returns the value of value 1 raised to the power of value 2. ";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.ROUND = "Uses one number-value, which holds the number, and optionaly a second number value, which can be negative, to hold the decimal places.Is the second value not specified it's null by default. Returns the rounded value of the choosen number.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.SIGN = "Uses one number-value. Returns the sign of the number value.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.SQRT = "Uses one number-value. Returns the square root of a nonnegative number.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.TRUNCATE = "Uses one number-value, which holds the number, and a second number-value, which can be negative, to hold the decimal places. Returns the value 1, truncated to value 2 decimal places. ";

SQLBlocks.Msg.Tooltips.CHAR_FUNCTION = {};
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LOWER = 'Uses one string-value. \n' + 'Returns string in lower \n' + 'case letters.';
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LPAD = 'Uses two string and one number value \n' + "(syntax: string, number, string). \n" + "Return the string argument,\n" + "left-padded with the specified string and \n " + "the length of the number-value";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LTRIM = "Uses one string-value. \n" + " Returns the string with \n" + " leading space characters removed.";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.REPLACE = "Uses three string-values. \n" + " Returns first string with \n" + " all occurrences of the second \n string replaced by the third/nstring.";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.RPAD = "Uses two string and one number value \n" + " as length(syntax: string, number, string). \n" + " Return the string argument, \n" + " right-padded with the specified string and \n" + " the length of the number-value";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.RTRIM = "Uses one string-value. \n" + "Returns the string with \n" + "trailing space characters removed.";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.SOUNDEX = "Uses one string-value \n" + "Returns a soundex string from string.";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.SUBSTRING = "Uses one string and one number-value \n" + "as position. Syntax (string,number) \n" + "Return a substring from \n" + "string starting at position. \n";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.UPPER = "Uses one string-value. \n" + "Returns string in upper case letters.";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.ASCII = "Uses one string value \n" + "Returns the numeric value of the most strings.";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.INSTR = "Uses two string values.\n" + "The first as string,\n" + "the second as substring. \n" + "Returns the position of \n" + "the first occurrence of \n" + "substring in string.";
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LENGTH = "Uses one string-value.\n" + "Returns length of string.";

SQLBlocks.Msg.Tooltips.OTHER_FUNCTION = {};
SQLBlocks.Msg.Tooltips.OTHER_FUNCTION.DECODE = "Uses three expressions. the first compare a variable, a number, a column or astring, with an other variable. The second value, is the value which is returned when the first expression is true. The thrid value is returned when the first is false.";
SQLBlocks.Msg.Tooltips.OTHER_FUNCTION.GREATEST = "Compares as many values, but minimum two, as you like. They must be of the same type. For example it will only compare a string with a string and a number with a number.  Returns the largest (maximum-valued) argument.";
SQLBlocks.Msg.Tooltips.OTHER_FUNCTION.LEAST = "Compares as many values, but minimum two, as you like. They must be of the same type. For example it will only compare a string with a string and a number with a number.  Returns the least (minmum-valued) argument.";
SQLBlocks.Msg.Tooltips.OTHER_FUNCTION.NVL = "Uses two expressions, either string, a number, a column or an operation. If expression 1 is not NULL, IFNULL() returns expr1; otherwise it returns expression 2. IFNULL() returns a numeric or string value, depending on the context in which it is used. ";

SQLBlocks.Msg.Tooltips.SIMPLE_TERM = {};
SQLBlocks.Msg.Tooltips.SIMPLE_TERM.PLUS="Sums two expressions";
SQLBlocks.Msg.Tooltips.SIMPLE_TERM.MINUS="Subtracts two espressions";
SQLBlocks.Msg.Tooltips.SIMPLE_TERM.DIVIDE="Divides two espressions";
SQLBlocks.Msg.Tooltips.SIMPLE_TERM.MULTIPLICATE="Mulitplicates two espressions";

/**
 * MUTATORS
 */
SQLBlocks.Msg.Tooltips.Mutators = {};

SQLBlocks.Msg.Tooltips.Mutators.ADD = "Adding a new Input.";
SQLBlocks.Msg.Tooltips.Mutators.AND = "Adding a logical AND.";
SQLBlocks.Msg.Tooltips.Mutators.OR = "Adding a logical OR.";
SQLBlocks.Msg.Tooltips.Mutators.AS = "Adding AS.";
SQLBlocks.Msg.Tooltips.Mutators.GROUP_BY = "Adding GROUP BY.";
SQLBlocks.Msg.Tooltips.Mutators.GROUP_BY_HAVING = "Adding GROUP BY with HAVING.";
SQLBlocks.Msg.Tooltips.Mutators.ORDER_BY = "Adding ORDER BY.";
SQLBlocks.Msg.Tooltips.Mutators.LIMIT = "Adding a limit.";
SQLBlocks.Msg.Tooltips.Mutators.SET = "Adding a SET.";
SQLBlocks.Msg.Tooltips.Mutators.INTO = "Adding INTO.";

/**
 * CheckInput Messages
 */
SQLBlocks.Msg.Warnings = {};

SQLBlocks.Msg.Warnings.EMPTY_STRING = "Please change the default value to a text of your choice";
SQLBlocks.Msg.Warnings.TWO_VALUES_SAME_COLUMN = "Attention you are inserting two values in the same column. Please choose another column.";
SQLBlocks.Msg.Warnings.DIFFERENT_TABLES = "Attention you are using different tables. Please use the same table in the whole insert.";
SQLBlocks.Msg.Warnings.NOT_ENOUGH_TABLES = "Not enough Tables. Please use all tables used in select";
SQLBlocks.Msg.Warnings.WRONG_COLUMN = "Wrong column. Please use only tables and columns which are in the select.";
SQLBlocks.Msg.Warnings.WRONG_ALIAS = "Wrong alias. Please use only alias which are used in subselects.";
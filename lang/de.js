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
 * BLOCKS
 */
Blockly.Msg.INSERT_VALUES = "INSERT VALUES";
Blockly.Msg.SET = "SET";
Blockly.Msg.WHERE = "WHERE"
Blockly.Msg.UPDATE = "UPDATE";
Blockly.Msg.SELECT = "SELECT";
Blockly.Msg.GROUP_BY = "GROUP BY";
Blockly.Msg.HAVING = "HAVING";
Blockly.Msg.ORDER_BY = "ORDER BY";
Blockly.Msg.LIMIT = "LIMIT";
Blockly.Msg.DISTINCT = "DISTINCT";
Blockly.Msg.SUBSELECT = "SUBSELECT";
Blockly.Msg.TO = "TO";
Blockly.Msg.NOT = "NOT";
Blockly.Msg.AS = "AS";
Blockly.Msg.INTERVAL = "INTERVAL";
Blockly.Msg.ADD = "Füge hinzu";
Blockly.Msg.AND = "UND";
Blockly.Msg.OR = "ODER";
Blockly.Msg.INTO = "INTO";
Blockly.Msg.MORE = "Neue Eingabe";
Blockly.Msg.VARIABLES_DEFAULT_NAME = " ";
Blockly.Msg.VARIABLES_GET_ITEM = Blockly.Msg.VARIABLES_DEFAULT_NAME;

/**
 * TOOLTIPS
 */
Blockly.Msg.CONVERSION_FUNCTION_TOOLTIP_DATE_FORMAT = "Nutzt eine Datumsvariable oder-spalte und ein character set (z.B. UTF-8). Gibt das Datum als Text zurück.";
Blockly.Msg.CONVERSION_FUNCTION_TOOLTIP_STR_TO_DATE = "Nutzt eine Textvariable oder-spalte und ein Datumsformat(z.B.YYYY-MM-DD). Gibt den Text als Datum zurück.";

Blockly.Msg.DATE_FUNCTION_TOOLTIP_ADD_MONTHS = "Berechnet ein Datum. Hierzu wird eine Datumsvariable, mit dem entsprechendem Datum und eine Nummer, für den Intervall, sowie eine Zeiteinheit verwendet.";
Blockly.Msg.DATE_FUNCTION_TOOLTIP_CURDATE="Gibt das heutige Datum als Wert zurück";
Blockly.Msg.DATE_FUNCTION_TOOLTIP_EXTRACT = "Extrahiert ein Datum aus eine Datumsvariable, eine Datumsspalte oder einer Datumsfunktion, entsprechend einer Zeiteinheit.";
Blockly.Msg.DATE_FUNCTION_TOOLTIP_LAST_DAY = "Nutzt eine Datumsvariavle oder Datumsspalte.Gibt den letzten Tag des Monats zurück.";
Blockly.Msg.DATE_FUNCTION_TOOLTIP_MONTHS_BETWEEN = "Uses a time unit and two time-values.Returns date-value 2 – date-value1.";
Blockly.Msg.DATE_FUNCTION_TOOLTIP_NOW = "Gibt das heutige Datum und die entsprechende Zeit im Format 'YYYY-MM-DD HH:MM:SS' zurück.";
Blockly.Msg.DATE_FUNCTION_TOOLTIP_MONTH = "Nutzt eine Datumsvariable oder Datumsspalte.Gibt den Monat des datums als Zahl zwischen 1 und 12 für Januar bis Dezember zurück.";
Blockly.Msg.DATE_FUNCTION_TOOLTIP_YEAR = "Nutzt eine Datumsvariable oder Datumsspalte. Gibt das Jahr des Datums zwischen 0000 und 9999 zurück.";
Blockly.Msg.DATE_FUNCTION_TOOLTIP_SYSDATE = "Gibt die Systemzeit als Wert zurück";

Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_ABS = "Uses one number-value. Returns the absolute value of the number_value.";
Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_CEIL = "Uses one number-value. Returns the smallest integer value not less than the used value";
Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_FLOOR = "Uses one number-value. Returns the largest integer value not greater than the used value. ";
Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_MOD = "Uses two number-values.Modulo operation. Returns the remainder of value 1 divided by value 2.";
Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_POWER = "Uses two number-values.Returns the value of value 1 raised to the power of value 2. ";
Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_ROUND = "Uses one number-value, which holds the number, and optionaly a second number value, which can be negative, to hold the decimal places.Is the second value not specified it's null by default. Returns the rounded value of the choosen number.";
Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_SIGN = "Uses one number-value. Returns the sign of the number value.";
Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_SQRT = "Uses one number-value. Returns the square root of a nonnegative number.";
Blockly.Msg.NUMBER_FUNCTION_TOOLTIP_TRUNCATE = "Uses one number-value, which holds the number, and a second number-value, which can be negative, to hold the decimal places. Returns the value 1, truncated to value 2 decimal places. ";

Blockly.Msg.CHAR_FUNCTION_TOOLTIP_LOWER = 'Uses one string-value. \n' + 'Returns string in lower \n' + 'case letters.';
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_LPAD = 'Uses two string and one number value \n' + "(syntax: string, number, string). \n" + "Return the string argument,\n" + "left-padded with the specified string and \n " + "the length of the number-value";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_LTRIM = "Uses one string-value. \n" + " Returns the string with \n" + " leading space characters removed.";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_REPLACE = "Uses three string-values. \n" + " Returns first string with \n" + " all occurrences of the second \n string replaced by the third/nstring.";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_RPAD = "Uses two string and one number value \n" + " as length(syntax: string, number, string). \n" + " Return the string argument, \n" + " right-padded with the specified string and \n" + " the length of the number-value";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_RTRIM = "Uses one string-value. \n" + "Returns the string with \n" + "trailing space characters removed.";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_SOUNDEX = "Uses one string-value \n" + "Returns a soundex string from string.";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_SUBSTRING = "Uses one string and one number-value \n" + "as position. Syntax (string,number) \n" + "Return a substring from \n" + "string starting at position. \n";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_UPPER = "Uses one string-value. \n" + "Returns string in upper case letters.";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_ASCII = "Uses one string value \n" + "Returns the numeric value of the most strings.";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_INSTR = "Uses two string values.\n" + "The first as string,\n" + "the second as substring. \n" + "Returns the position of \n" + "the first occurrence of \n" + "substring in string.";
Blockly.Msg.CHAR_FUNCTION_TOOLTIP_LENGTH = "Uses one string-value.\n" + "Returns length of string.";

Blockly.Msg.OTHER_FUNCTION_TOOLTIP_DECODE = "Uses three expressions. the first compare a variable, a number, a column or astring, with an other variable. The second value, is the value which is returned when the first expression is true. The thrid value is returned when the first is false.";
Blockly.Msg.OTHER_FUNCTION_TOOLTIP_GREATEST = "Compares as many values, but minimum two, as you like. They must be of the same type. For example it will only compare a string with a string and a number with a number.  Returns the largest (maximum-valued) argument.";
Blockly.Msg.OTHER_FUNCTION_TOOLTIP_LEAST = "Compares as many values, but minimum two, as you like. They must be of the same type. For example it will only compare a string with a string and a number with a number.  Returns the least (minmum-valued) argument.";
Blockly.Msg.OTHER_FUNCTION_TOOLTIP_NVL = "Uses two expressions, either string, a number, a column or an operation. If expression 1 is not NULL, IFNULL() returns expr1; otherwise it returns expression 2. IFNULL() returns a numeric or string value, depending on the context in which it is used. ";

Blockly.Msg.VARIABLES_SET_TITLE = "ALS";

Blockly.Msg.SIMPLE_TERM_TOOLTIP_PLUS="Addiert zwei Ausdrücke";
Blockly.Msg.SIMPLE_TERM_TOOLTIP_MINUS="Subtrahiert zwei Ausdrücke";
Blockly.Msg.SIMPLE_TERM_TOOLTIP_DIVIDE="Dividiert zwei Ausdrücke";
Blockly.Msg.SIMPLE_TERM_TOOLTIP_MULTIPLICATE="Multipliziert zwei Ausdrücke";

Blockly.Msg.NUMBER_TOOLTIP = 'Nummernvariable';
Blockly.Msg.STRING_TOOLTIP = 'Zeichenvariable'
Blockly.Msg.STRING_WARNING = "Please change the default value to a text of your choice";
Blockly.Msg.DATE_VAR = 'Datumsvariable';

Blockly.Msg.VARIABLES_GET_TOOLTIP = "Gibt den Wert der Variable zurück.";

/**
 * MUTATORS
 */
Blockly.Msg.ADD_TOOLTIP = "Fügt ein neues Eingabefeld hinzu.";
Blockly.Msg.AND_TOOLTIP = "Fügt ein logisches Und hinzu.";
Blockly.Msg.AND_TOOLTIP = "Fügt ein logisches Oder hinzu.";
Blockly.Msg.AS_TOOLTIP = "Füge als hinzu.";
Blockly.Msg.GROUP_BY_TOOLTIP = "Füge ein GROUP BY hinzu.";
Blockly.Msg.GROUP_BY_HAVING_TOOLTIP = "Füge GROUP BY mit HAVING hinzu.";
Blockly.Msg.ORDER_BY_TOOLTIP = "Füge ORDER BY hinzu.";
Blockly.Msg.LIMIT_TOOLTIP = "Füge ein Limit hinzu.";
Blockly.Msg.SET_TOOLTIP = "Füge eine SET Eingabe.";
Blockly.Msg.INTO_TOOLTIP = "Füge INTO hinzu.";


/**
 * CheckInput Messages
 */
Blockly.Msg.CHECK_INSERT_TWO_VALUES_SAME_COLUMN = "Achtung Sie versuchen mehr als einen Wert in diesselbe Spalte einzufügen. Bitte wählen Sie eine andere Spalte aus.";
Blockly.Msg.CHECK_INSERT_DIFFERENT_TABLES = "Achtung Sie verwenden verschiedene Tabellen in einer INSERT Anweisung. Bitte verwenden Sie pro INSERT Anweisung ausschließlich eine Tabelle.";
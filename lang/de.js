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
SQLBlocks.Msg.DROPDOWN = {};
SQLBlocks.Msg.DROPDOWN.TIME = [
    ["Millisekunden", "MICROSECONDS"],
    ["Sekunde", "SECOND"],
    ["Minute", "MINUTE"],
    ["Stunde", "HOUR"],
    ["Tag", "DAY"],
    ["Woche", "WEEK"],
    ["Monat", "MONTH"],
    ["Quartal", "QUARTER"],
    ["Jahr", "YEAR"],
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

SQLBlocks.Msg.DROPDOWN.DATEFUNCTION = [
    //["SYSDATE", "sysdate"],
    //["DATE ADD", "add_months"], //using date_add()because add-month is an oracle function. It is equivalent to date_add() in mysql
    //["DATE SUB", "sub_months"],
    //["LAST DAY", "last_day"],
    ["Jetzt", "now"],
    //["MONTH", "month"],
    //["YEAR", "year"],
    ["Extrahiere", "extract"],
    ["Aktuelles Datum", "curdate"],
    ["Datum", "date"],
    //["TO CHAR", "date_format"] //Using date_format instead of to_char, because to_char is not a mysql function
];

SQLBlocks.Msg.DROPDOWN.OTHER = [
    ["Wenn", "decode"], //using if because decode is an oracle function. It is equivalent to if in mysql
    ["Größte(r)", "greatest"],
    ["Kleinste(r)", "least"],
    ["Wenn nicht vorhanden", "nvl"] //using ifNull because nvl is an oracle function. It is equivalent to ifNULL in mysql
];

SQLBlocks.Msg.DROPDOWN.CHARFUNCTION = [
    ['ZU KLEINBUCHSTABEN', 'lower'],
    ['LPAD', 'lpad'],
    ['LTRIM', 'ltrim'],
    ['ERSETZE', 'replace'],
    ['RPAD', 'rpad'],
    ['RTRIM', 'rtrim'],
    ['TEILSTRING', 'substring'],
    ['ZU GROßBUCHSTABEN', 'upper'],
    ['ASCII', 'ascii'],
    ['IST IN STRING', 'instr'],
    ['LÄNGE', 'length'],
    ["KONVENTIERE IN DATUM", "str_to_date"]//Using str_to_date instead of to date, because to_date is not a mysql function];
];

SQLBlocks.Msg.DROPDOWN.MATHOPERATORS = [
    ['+', 'PLUS'],
    ['-', 'MINUS'],
    ['/', 'DIVIDE'],
    ['*', 'MULTIPLICATE']
];

SQLBlocks.Msg.DROPDOWN.COMPAREOPERATORS = [
    ['=', 'EQ'],
    ['\u2260', 'NEQ'],
    ['>', 'LT'],
    ['\u2265', 'LTE'],
    ['<', 'GT'],
    ['\u2264', 'GTE'],
    ['IST NULL', 'isnull'],
    ['IST NICHT NULL', 'isnotnull'],
    ["IST IN", "in"],
    ['WIE', 'like']
];

SQLBlocks.Msg.DROPDOWN.GROUPFUNCTIONS = [
    ["AVG", "avg"],
    ["ZÄHLE DURCH", "count"],
    ["SUCHE DAS MINIMUM", "min"],
    ["SUCHE DAS MAXIMUM", "max"],
    ["STANDARDABWEICHUNG", "stddev"],
    ["SUMMME", "sum"],
    ["VARIANZ", "variance"]
];

SQLBlocks.Msg.DROPDOWN.NUMBERFUNCTIONS = [
    ["BETRAG", "abs"],
    ["RUNDE AUF", "ceil"],
    ["RUNDE AB", "floor"],
    ["MODULO", "mod"],
    ["POTENZIEREN", "power"],
    ["RUNDEN", "round"],
    ["SIGN", "sign"],
    ["ZIEHE QUADRATWURZEL", "sqrt"],
    ["KÜRZE", "truncate"]
];

SQLBlocks.Msg.DROPDOWN.SORTDIRECTIONS = [
    ["AUFSTEIGEND", "asc"],
    ["ABSTEIGEND", "desc"]
];

SQLBlocks.Msg.DROPDOWN.LOGICALCONJUNCTION = [
    ["UND", "AND"],
    ["ODER", "OR"]
];

SQLBlocks.Msg.DROPDOWN.BOOL = [
    ["WAHR", "1"],
    ["FALSCH", "0"]
];

/**
 * HTML 
 */
SQLBlocks.Msg.html = {};
SQLBlocks.Msg.html.innerHTML = {};
SQLBlocks.Msg.html.innerHTML.ADD_ODBC_BUTTON = "Hinzufügen";
SQLBlocks.Msg.html.innerHTML.DEL_ODBC_BUTTON = "Löschen";
SQLBlocks.Msg.html.innerHTML.UPDATE_ODBC_BUTTON = "Aktualisieren";
SQLBlocks.Msg.html.innerHTML.ODBC_HEADLINE = "ODBC - Datenquellen";
SQLBlocks.Msg.html.innerHTML.EDIT_SQL_BUTTON = "Bearbeite SQL Anweisung";
SQLBlocks.Msg.html.innerHTML.CODE_EDITOR_HEADLINE = "SQL Anweisung";
SQLBlocks.Msg.html.innerHTML.HELP_BOX_HEADLINE = "Hilfe";
SQLBlocks.Msg.html.innerHTML.ADD_ODBC_HEADLINE = "Füge Datenquellennamen hinzu";
SQLBlocks.Msg.html.innerHTML.UPDATE_ODBC_HEADLINE = "Aktualisiere Datenquelle";
SQLBlocks.Msg.html.innerHTML.DATA_SOURCE_NAME = "Datenquellenname (DSN):";
SQLBlocks.Msg.html.innerHTML.USER_NAME = "Benutzername:";
SQLBlocks.Msg.html.innerHTML.USER_PW = "Passwort:";
SQLBlocks.Msg.html.innerHTML.ERROR_MESSAGE_HEADLINE = "Fehlermeldung";
SQLBlocks.Msg.html.innerHTML.OK = "OK";

SQLBlocks.Msg.html.title = {};
SQLBlocks.Msg.html.title = "Schließen";

SQLBlocks.Msg.html.value = {};
SQLBlocks.Msg.html.value.UPDATE_ODBC_BUTTON = "Aktualisiere";
SQLBlocks.Msg.html.value.ADD_ODBC_BUTTON = "Add";

/**
 * USER messages
 */
SQLBlocks.Msg.User = {};
SQLBlocks.Msg.User.CONFIRM_SAVE_WORKSPACE = "Möchten Sie wirklich die aktuelle Arbeitsfläche speichern?";
SQLBlocks.Msg.User.CONFIRM_LOAD_WORKSPACE = "Möchten Sie wirklich eine neue SQL Anweisung in die Arbeitsfläche laden?";
SQLBlocks.Msg.User.TOOLTIP_SQL_BOX = "Um eine SQL Anweisung in Blöcke umzuwandeln, geben Sie diese in dieses Textfeld ein und klicken anschließend auf OK.";
SQLBlocks.Msg.User.WORKSPACE_UPDATED = "Die Arbeitsfläche wurde aktualisiert.";
SQLBlocks.Msg.User.DSN_DELETED = "Datenquelle gelöscht.";

/**
 * BLOCKS
 */
SQLBlocks.Msg.Blocks = {};
SQLBlocks.Msg.Blocks.INSERT_VALUES = "FÜGE WERTE HINZU";
SQLBlocks.Msg.Blocks.SET = "SETZE";
SQLBlocks.Msg.Blocks.WHERE = "WO"
SQLBlocks.Msg.Blocks.UPDATE = "AKTUALISIERE";
SQLBlocks.Msg.Blocks.SELECT = "WÄHLE";
SQLBlocks.Msg.Blocks.GROUP_BY = "GRUPPIERE NACH";
SQLBlocks.Msg.Blocks.HAVING = "HAT";
SQLBlocks.Msg.Blocks.ORDER_BY = "SORTNIERE NACH";
SQLBlocks.Msg.Blocks.LIMIT = "MAXIMAL";
SQLBlocks.Msg.Blocks.DISTINCT = "EINDEUTIG";
SQLBlocks.Msg.Blocks.SUBSELECT = "UNTERWAHL";
SQLBlocks.Msg.Blocks.TO = "ZU";
SQLBlocks.Msg.Blocks.NOT = "NICHT";
SQLBlocks.Msg.Blocks.AS = "ALS";
SQLBlocks.Msg.Blocks.INTERVAL = "INTERVAL";
SQLBlocks.Msg.Blocks.ADD = "FÜGE HINZU";
SQLBlocks.Msg.Blocks.AND = "UND";
SQLBlocks.Msg.Blocks.OR = "ODER";
SQLBlocks.Msg.Blocks.INTO = "IN";
SQLBlocks.Msg.Blocks.MORE = "NEUE EINGABE";
SQLBlocks.Msg.Blocks.VARIABLES_DEFAULT_NAME = " ";
SQLBlocks.Msg.Blocks.VARIABLES_GET_ITEM = SQLBlocks.Msg.Blocks.VARIABLES_DEFAULT_NAME;
SQLBlocks.Msg.Blocks.VARIABLES_SET_TITLE = "ALS";
SQLBlocks.Msg.Blocks.ARRAY = "LISTE";
SQLBlocks.Msg.Blocks.ARRAY_EMPTY = "LEERE LISTE";
SQLBlocks.Msg.Blocks.LIST = "LISTENEINTRÄGE";
SQLBlocks.Msg.Blocks.LIST_ENTRY = "EINTRAG";

/**
 * TOOLTIPS
 */
SQLBlocks.Msg.Tooltips = {};

/* COMMANDS Tooltips of commands by http://www.w3schools.com/sql/ */
SQLBlocks.Msg.Tooltips.DISTINCT = "Das Schlüsselwort DISTINCT wird dazu benutzt, um ausschließlich eindeutige Werte zurückbekommen (ausschließlich verschiedene Werte).";
SQLBlocks.Msg.Tooltips.SELECT = "Das Schlüsselwort SELECT wird dazu benutzt Daten aus einer Datenbank zu selektieren.";
SQLBlocks.Msg.Tooltips.INSERT = "Das Schlüsselwort INSERT wird dazu benutzt neue Daten einer Datenbank hinzuzufügen.";
SQLBlocks.Msg.Tooltips.UPDATE = "Das Schlüsselwort UPDATE wird dazu benutzt existierende Daten einer Datenbank zu aktualisieren.";
SQLBlocks.Msg.Tooltips.SUB_SELECT = SQLBlocks.Msg.Tooltips.SELECT;

/* FIELDS */
SQLBlocks.Msg.Tooltips.TABLES_AND_COLUMNS = "Wählen Sie die Tabelle und Spalte aus der Datenbank.";
SQLBlocks.Msg.Tooltips.TABLES_AND_COLUMNS_VAR = SQLBlocks.Msg.Tooltips.TABLES_AND_COLUMNS;

/* OPERATORS */
SQLBlocks.Msg.Tooltips.TO = "Setzt beim INSERT Befehl den Wert in die angegebene Spalte.";
SQLBlocks.Msg.Tooltips.COMPARE_OPERATOR = "Vergleich zwischen zwei Ausdrücken.";
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE = {};
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.EQ = "Ist wahr (true) wenn beide Werte identisch sind.";
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.NEQ = "Ist wahr (true) wenn beide Werte unterschiedlich sind.";
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.LT = "Ist wahr (true) wenn der erste Wert kleiner als der zweite Wert ist.";
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.LTE = "Ist wahr (true) wenn der erste Wert kleiner als oder gleich gross wie zweite Wert ist.";
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.GT = "Ist wahr (true) wenn der erste Wert grösser als der zweite Wert ist.";
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.GTE = "Ist wahr (true) wenn der erste Wert grösser als oder gleich gross wie zweite Wert ist.";
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.NULL = "Ist wahr (true) wenn der Ausdruck leer (null) ist.";
SQLBlocks.Msg.Tooltips.LOGIC_COMPARE.NOT_NULL = "Ist wahr (true) wenn der Ausdruck nicht leer (not null) ist.";
SQLBlocks.Msg.Tooltips.LOGICAL_CONJUNCTION = "Verknüpfe zwei Ausdrücke mit UND/ODER.";
SQLBlocks.Msg.Tooltips.SIMPLE_TERM = {};
SQLBlocks.Msg.Tooltips.SIMPLE_TERM.PLUS ="Addiert zwei Ausdrücke";
SQLBlocks.Msg.Tooltips.SIMPLE_TERM.MINUS ="Subtrahiert zwei Ausdrücke";
SQLBlocks.Msg.Tooltips.SIMPLE_TERM.DIVIDE ="Dividiert zwei Ausdrücke";
SQLBlocks.Msg.Tooltips.SIMPLE_TERM.MULTIPLICATE ="Multipliziert zwei Ausdrücke";
SQLBlocks.Msg.Tooltips.CONDITIONS = "Negiert die Eingabe.";

/* VALUES */
SQLBlocks.Msg.Tooltips.NUMBER = "Nummernvariable";
SQLBlocks.Msg.Tooltips.STRING = "Zeichenvariable";
SQLBlocks.Msg.Tooltips.DATE = "Datumsvariable";
SQLBlocks.Msg.Tooltips.GET = "Gibt den Wert der Variable zurück.";
SQLBlocks.Msg.Tooltips.BOOL = "Boolesche Variable";
SQLBlocks.Msg.Tooltips.ARRAY = "Liste von Werten.";

/* FUNCTIONS */
SQLBlocks.Msg.Tooltips.CONVERSION_FUNCTION = {};
SQLBlocks.Msg.Tooltips.CONVERSION_FUNCTION.DATE_FORMAT = "Nutzt eine Datumsvariable oder-spalte und ein character set (z.B. UTF-8). Gibt das Datum als Text zurück.";
SQLBlocks.Msg.Tooltips.CONVERSION_FUNCTION.STR_TO_DATE = "Nutzt eine Textvariable oder-spalte und ein Datumsformat(z.B.YYYY-MM-DD). Gibt den Text als Datum zurück.";

SQLBlocks.Msg.Tooltips.DATE_FUNCTION = {};
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.ADD_MONTHS = "Berechnet ein Datum. Hierzu wird eine Datumsvariable, mit dem entsprechendem Datum und eine Nummer, für den Intervall, sowie eine Zeiteinheit verwendet.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.CURDATE ="Gibt das heutige Datum als Wert zurück";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.EXTRACT = "Extrahiert ein Datum aus eine Datumsvariable, eine Datumsspalte oder einer Datumsfunktion, entsprechend einer Zeiteinheit.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.LAST_DAY = "Nutzt eine Datumsvariavle oder Datumsspalte.Gibt den letzten Tag des Monats zurück.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.MONTHS_BETWEEN = "Uses a time unit and two time-values.Returns date-value 2 – date-value1.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.NOW = "Gibt das heutige Datum und die entsprechende Zeit im Format 'YYYY-MM-DD HH:MM:SS' zurück.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.MONTH = "Nutzt eine Datumsvariable oder Datumsspalte.Gibt den Monat des datums als Zahl zwischen 1 und 12 für Januar bis Dezember zurück.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.YEAR = "Nutzt eine Datumsvariable oder Datumsspalte. Gibt das Jahr des Datums zwischen 0000 und 9999 zurück.";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.SYSDATE = "Gibt die Systemzeit als Wert zurück";
SQLBlocks.Msg.Tooltips.DATE_FUNCTION.DATE = "Returns the date of today.";

/* https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/ */
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION = {};
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.ABS = "Gibt den Betrag eines Zahlenwerts zurück.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.CEIL = "Die kleinste ganze Zahl größer oder gleich der übergebenen Zahl.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.FLOOR = "Eine größte ganze Zahl, die kleiner oder gleich der übergebenen Zahl ist.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.MOD = "Modulo ist eine mathematische Funktion, die den Rest aus einer Division zweier ganzer Zahlen benennt. ";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.POWER = "Gibt eine Zahl, die die Basis potenziert mit dem Exponenten repräsentiert, zurück";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.ROUND = "Die ROUND() Funktion gibt die nächstgelegenen Ganzzahl einer Zahl zurück (kaufmännisches Runden).";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.SIGN = "Die SIGN() Funktion gibt das Vorzeichen einer Zahl zurück, welches angibt, ob eine Zahl positiv, negativ oder 0 ist.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.SQRT = "Die SQRT() Funktion gibt die Quadratwurzel einer Zahl zurück.";
SQLBlocks.Msg.Tooltips.NUMBER_FUNCTION.TRUNCATE = "Die TRUNCATE() Funktion gibt den ganzzahligen Teil einer Zahl zurück, indem alle Nachkommastellen entfernt werden.";

SQLBlocks.Msg.Tooltips.CHAR_FUNCTION = {};
SQLBlocks.Msg.Tooltips.CHAR_FUNCTION.LOWER = "Die LCASE () Funktion wandelt den Wert eines Feldes in Kleinbuchstaben.";
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

SQLBlocks.Msg.Tooltips.GROUP_FUNCTION = {};
SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.COUNT = "Counts the matching rows of the selected column.";
SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.MIN = "Returns the minimum value of an column \n " + "Could be used with distinct"; 
SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.MAX = "Returns the maximum value of an column \n " + "Could be used with distinct";
SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.AVG = "Returns the average value of an column. \n " + "Could be used with distinct."; 
SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.STDDEV = "Returns the population standard deviation of an column.";
SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.SUM = "Returns the sum of an expression.";
SQLBlocks.Msg.Tooltips.GROUP_FUNCTION.VARIANCE = "Returns the population standard variance of column.";

/**
 * TOOLBOX
 */
SQLBlocks.Msg.Toolbox = {};

SQLBlocks.Msg.Toolbox.COMMANDS = "Anweisungen";
SQLBlocks.Msg.Toolbox.FIELDS = "Felder";
SQLBlocks.Msg.Toolbox.OPERATORS = "Operatoren";
SQLBlocks.Msg.Toolbox.VALUES = "Werte";
SQLBlocks.Msg.Toolbox.FUNCTIONS = "Funktionen";

/**
 *  MUTATORS 
 */
SQLBlocks.Msg.Tooltips.Mutators = {};

SQLBlocks.Msg.Tooltips.Mutators.ADD = "Fügt ein neues Eingabefeld hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.AND = "Fügt ein logisches Und hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.OR = "Fügt ein logisches Oder hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.AS = "Füge als hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.GROUP_BY = "Füge ein GROUP BY hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.GROUP_BY_HAVING = "Füge GROUP BY mit HAVING hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.ORDER_BY = "Füge ORDER BY hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.LIMIT = "Füge ein Limit hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.SET = "Füge eine SET Eingabe.";
SQLBlocks.Msg.Tooltips.Mutators.INTO = "Füge INTO hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.LIST = "Füge einen Listeneintrag hinzu.";
SQLBlocks.Msg.Tooltips.Mutators.LIST_ENTRY = "Listeneintrag.";

/**
 * WARNINGS
 */
SQLBlocks.Msg.Warnings = {};

SQLBlocks.Msg.Warnings.EMPTY_STRING = "Geben Sie einen Text ein.";
SQLBlocks.Msg.Warnings.TWO_VALUES_SAME_COLUMN = "Achtung Sie versuchen mehr als einen Wert in diesselbe Spalte einzufügen. Bitte wählen Sie eine andere Spalte aus.";
SQLBlocks.Msg.Warnings.DIFFERENT_TABLES = "Achtung Sie verwenden verschiedene Tabellen in einer INSERT/UPDATE Anweisung. Bitte verwenden Sie pro INSERT/UPDATE Anweisung ausschließlich eine Tabelle.";
SQLBlocks.Msg.Warnings.NOT_ENOUGH_TABLES = "Es werden nicht genügend Tabellen verwendet. Verwenden Sie alle, welche im SELECT selektiert werden.";
SQLBlocks.Msg.Warnings.WRONG_COLUMN = "Falsche Spalte. Verwenden Sie ausschließlich Tabellen und Spalten, welche Sie im SELECT verwenden";
SQLBlocks.Msg.Warnings.WRONG_ALIAS = "Falsche Variable. Verwenden Sie ausschließlich Variablen, welche Sie auch definiert haben.";
SQLBlocks.Msg.Warnings.TOO_MANY_COLUMNS = "Zu viele Spalten. Wählen Sie eine Spalte aus!";
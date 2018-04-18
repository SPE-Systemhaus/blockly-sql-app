%lex
%options flex

%{
  yy.sqlStatement = new SQLStatement();
  yy.sqlXML = new SQLXML();
  yy.sqlHelp = new SQLHelper();

  function cleanUp() {
    delete yy.sqlStatement;
    delete yy.sqlXML;

    yy.sqlStatement = new SQLStatement();
    yy.sqlXML = new SQLXML();
  }
%}
/* description: SQL Lex file */
%%

/* Special Characters */
\s+                   /* skip whitespace */
\n                    /* skip newline */
[/][*][^*]*[*]+([^*/][^*]*[*]+)*[/]   /* skip long commentar */
[-]{2}.*                              /* skip single line commentar */
<<EOF>>               { return 'EOF' }
"\""                  { return 'DOUBLEQUOTE' }
"%"                   { return 'PERCENT' }
"&"                   { return 'AMPERSAND' }
"'"                   { return 'QUOTE' }
"("                   { return 'LPAREN' }
")"                   { return 'RPAREN' }
","                   { return 'COMMA' }
"."                   { return 'PERIOD' }
":"                   { return 'COLON' }
";"                   { return 'SEMICOLON' }
"`"                   { return 'BACKTICKS' }

/* Logical Terms */
"NOT"                 { return 'NOT' }
"not"                 { return 'NOT' }
"OR"                  { return 'OR' }
"or"                  { return 'OR' }
"AND"                 { return 'AND' }
"and"                 { return 'AND' }

/* Compare Operators */
"="                   { return 'EQ' }
">"                   { return 'LT' }
"<"                   { return 'GT' }
"?"                   { return 'QUESTIONMARK' }
"!="                  { return 'NEQ' }
">="                  { return 'LTE' }
"<="                  { return 'GTE' }

/* Math */
"+"                   { return 'PLUS' }
"-"                   { return 'MINUS' }
"/"                   { return 'DIVIDE' }
"*"                   { return 'MULTIPLICATE' }

/* Compare Operators */
"EQ"                  { return 'EQ' }
"eq"                  { return 'EQ' }
"NEQ"                 { return 'NEQ' }
"neq"                 { return 'NEQ' }
"LT"                  { return 'LT' }
"lt"                  { return 'LT' }
"GT"                  { return 'GT' }
"gt"                  { return 'GT' }
"LTE"                 { return 'LTE' }
"lte"                 { return 'LTE' }
"GTE"                 { return 'GTE' }
"gte"                 { return 'GTE' }
"IN"                  { return 'IN' }
"in"                  { return 'IN' }
"LIKE"                { return 'LIKE' }
"like"                { return 'LIKE' }
"IS"                  { return 'IS' }
"is"                  { return 'IS' }
"EXISTS"              { return 'EXISTS' }
"exists"              { return 'EXISTS' }
"BETWEEN"             { return 'BETWEEN' }
"between"             { return 'BETWEEN' }
"NULL"                { return 'NULL' }
"null"                { return 'NULL' }

/* Date functions */
"SYSDATE"             { return 'SYSDATE' }
"sysdate"             { return 'SYSDATE' }
"DATE"                { return 'DATE' }
"date"                { return 'DATE' }
"ADD"                 { return 'ADD' }
"add"                 { return 'ADD' }
"SUB"                 { return 'SUB' }
"sub"                 { return 'SUB' }
"LAST"                { return 'LAST' }
"last"                { return 'LAST' }
"DAY"                 { return 'DAY' }
"day"                 { return 'day' }
"NOW"                 { return 'NOW' }
"now"                 { return 'NOW' }
"MONTH"               { return 'MONTH' }
"month"               { return 'MONTH' }
"YEAR"                { return 'YEAR' }
"year"                { return 'YEAR' }
"EXTRACT"             { return 'EXTRACT' }
"extract"             { return 'EXTRACT' }
"CURDATE"             { return 'CURDATE' }
"curdate"             { return 'CURDATE' }
"CURTIME"             { return 'CURTIME' }
"curtime"             { return 'CURTIME' }
"TO"                  { return 'TO' }
"to"                  { return 'TO' }
"CHAR"                { return 'CHAR' }
"char"                { return 'CHAR' }

/* Number functions */
"ABS"                 { return 'ABS' }
"abs"                 { return 'ABS' }
"CEIL"                { return 'CEIL' }
"ceil"                { return 'CEIL' }
"FLOOR"               { return 'FLOOR' }
"floor"               { return 'FLOOR' }
"MOD"                 { return 'MOD' }
"mod"                 { return 'MOD' }
"POWER"               { return 'POWER' }
"power"               { return 'POWER' }
"ROUND"               { return 'ROUND' }
"round"               { return 'ROUND' }
"SIGN"                { return 'SIGN' }
"sign"                { return 'SIGN' }
"SQRT"                { return 'SQRT' }
"sqrt"                { return 'SQRT' }
"TRUNC"               { return 'TRUNCATE' }
"trunc"               { return 'TRUNCATE' }

/* Char functions */
"LOWER"               { return 'LOWER' }
"lower"               { return 'LOWER' }
"LPAD"                { return 'LPAD' }
"lpad"                { return 'LPAD' }
"LTRIM"               { return 'LTRIM' }
"ltrim"               { return 'LTRIM' }
"REPLACE"             { return 'REPLACE' }
"replace"             { return 'REPLACE' }
"RPAD"                { return 'RPAD' }
"rpad"                { return 'RPAD' }
"RTRIM"               { return 'RTRIM' }
"rtrim"               { return 'RTRIM' }
"SUBSTRING"           { return 'SUBSTRING' }
"substring"           { return 'SUBSTRING' }
"UPPER"               { return 'UPPER' }
"upper"               { return 'UPPER' }
"ASCII"               { return 'ASCII' }
"ascii"               { return 'ASCII' }
"INSTR"               { return 'INSTR' }
"instr"               { return 'INSTR' }
"LENGTH"              { return 'LENGTH' }
"length"              { return 'LENGTH' }

/* SQL Keywords */
"SELECT"              { return 'SELECT' }
"select"              { return 'SELECT' }
"INSERT"              { return 'INSERT' }
"insert"              { return 'INSERT' }
"UPDATE"              { return 'UPDATE' }
"update"              { return 'UPDATE' }
"ALL"                 { return 'ALL' }
"all"                 { return 'ALL' }
"DISTINCT"            { return 'DISTINCT' }
"distinct"            { return 'DISTINCT' }
"AS"                  { return 'AS' }
"as"                  { return 'AS' }
"INTO"                { return 'INTO' }
"FROM"                { return 'FROM' }
"from"                { return 'FROM' }
"VALUES"              { return 'VALUES' }
"values"              { return 'VALUES' }
"WHERE"               { return 'WHERE' }
"where"               { return 'WHERE' }
"SET"                 { return 'SET' }
"set"                 { return 'SET' }
"GROUP BY"            { return 'GROUPBY' }
"group by"            { return 'GROUPBY' }
"ORDER BY"            { return 'ORDERBY' }
"order by"            { return 'ORDERBY' }
"HAVING"              { return 'HAVING' }
"having"              { return 'HAVING' }
"LIMIT"               { return 'LIMIT' }
"limit"               { return 'LIMIT' }
"AVG"                 { return 'AVG' }
"avg"                 { return 'AVG' }
"COUNT"               { return 'COUNT' }
"count"               { return 'COUNT' }
"MIN"                 { return 'MIN' }
"min"                 { return 'MIN' }
"MAX"                 { return 'MAX' }
"max"                 { return 'MAX' }
"STDDEV"              { return 'STDDEV' }
"stddev"              { return 'STDDEV' }
"SUM"                 { return 'SUM' }
"sum"                 { return 'SUM' }
"VARIANCE"            { return 'VARIANCE' }
"variance"            { return 'VARIANCE' }
"TRUE"                { return 'BOOL' }
"FALSE"               { return 'BOOL' }
"true"                { return 'BOOL' }
"false"               { return 'BOOL' }
"ASC"                 { return 'ASC' }
"asc"                 { return 'ASC' }
"DESC"                { return 'DESC' }
"desc"                { return 'DESC' }
"AS"                  { return 'AS' }
"as"                  { return 'AS' }

/******************************************************/
[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}  { return 'DATE' }
[0-9]{2}[:][0-9]{2}[:][0-9]{2}        { return 'TIME' }
(-)?[0-9]+("."[0-9]+)?\b  { return 'NUMBER' }
[a-zA-Z]{1}[a-zA-Z0-9_$#]* { return 'IDENTIFIER' }
[^ '\f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​ \u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​ \u202f\u205f​\u3000]* { return 'IDENTIFIER' }
/lex

/* operator associations and precedence */

%start SQL

%left OR
%left AND
%left EQ, NEQ, LT, GT, LTE, GTE, IS, NULL, LIKE, BETWEEN, IN
%left PLUS, MINUS
%left DIVIDE, MULTIPLICATE
%left NOT

%% /* SQL grammar */

SQL
    : SELECT_COMMAND
        { yy.sqlXML.printSQLOnWorkspace($1); cleanUp(); }
    | UPDATE_COMMAND
        { yy.sqlXML.printSQLOnWorkspace($1); cleanUp(); }
    | INSERT_COMMAND
        { yy.sqlXML.printSQLOnWorkspace($1); cleanUp(); }
    | SQL EOF
    | SQL SEMICOLON
    ;

SELECT_COMMAND
    : SELECT SELECTION DISPLAYED_COLUMNS FROM SELECTED_TABLES WHERE_CLAUSE GROUPBY_CLAUSE ORDERBY_CLAUSE LIMIT_CLAUSE
        {   
            $$ = yy.sqlXML.createSelect(
                yy.sqlStatement.setSelect($2, $3, $5, $6, null, $7, $8, $9)
            );
        }
    ;

UPDATE_COMMAND
    : UPDATE TABLE_NAME SETS WHERE_CLAUSE
        {
            $$ = yy.sqlXML.createUpdate(
                yy.sqlStatement.setUpdate($2, $3, $4)
            );
        }
    ;

INSERT_COMMAND
    : INSERT INTO TABLE_NAME LPAREN INSERT_COLUMN_LIST RPAREN VALUES LPAREN VALUE_LIST RPAREN
        {
            $$ = yy.sqlXML.createInsert(
                yy.sqlStatement.setInsert($3, $5, $9)
            );
        }
    | INSERT INTO TABLE_NAME VALUES LPAREN VALUE_LIST RPAREN
        {
            $$ = yy.sqlXML.createInsert(
                yy.sqlStatement.setInsert($3, '*', $6)
            );
        }
    | INSERT INTO TABLE_NAME SETS
        {
            $$ = yy.sqlXML.createInsert(
                yy.sqlStatement.setInsert($3, $4)
            );
        }
    ;

INSERT_COLUMN_LIST
    : INSERT_COLUMN
        { $$ = []; $$.push($1); }
    | INSERT_COLUMN_LIST COMMA INSERT_COLUMN
        { $$.push($3); }
    ;

INSERT_COLUMN
    : IDENTIFIER
    | IDENTIFIER PERIOD IDENTIFIER
        { $$ = $3; }
    ;

WHERE_CLAUSE
    : %empty
    | WHERE EXPR
        { $$ = $2; }
    ;

EXPRESSIONS
    : EXPR
        { $$ = []; $$.push($1); }
    | EXPRESSIONS COMMA EXPR
        { $1.push($3); $$ = $1; }
    ;

VARIABLE
    : IDENTIFIER
        { $$ = { "column" : $1 }; }
    | IDENTIFIER PERIOD IDENTIFIER
        { $$ = { "column" : $3, "table": $1 }; }
    ;

GROUPBY_CLAUSE
    : %empty
    | GROUPBY EXPRESSIONS
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { "expressions" : $2[0] };
        }
    | GROUPBY EXPRESSIONS HAVING EXPR EQ EXPR
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, $6, "=")
                 };
        }
    | GROUPBY EXPRESSIONS HAVING EXPR NEQ EXPR
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, $6, "!=")
                 };
        } 
    | GROUPBY EXPRESSIONS HAVING EXPR GT EXPR
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, $6, ">")
                 };
        }
    | GROUPBY EXPRESSIONS HAVING EXPR LT EXPR
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, $6, "<")
                 };
        }
    | GROUPBY EXPRESSIONS HAVING EXPR GTE EXPR
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, $6, ">=")
                 };
        }
    | GROUPBY EXPRESSIONS HAVING EXPR LTE EXPR
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, $6, "<=")
                 };
        }
    | GROUPBY EXPRESSIONS HAVING EXPR LIKE EXPR
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, $6, "like")
                 };
        }
    | GROUPBY EXPRESSIONS HAVING EXPR IS NULL
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, null, "isnull")
                 };
        }
    | GROUPBY EXPRESSIONS HAVING EXPR IS NOT NULL
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            $$ = { 
                    "expressions" : $2[0], 
                    "having" : yy.sqlXML.createCompareOperator($4, null, "isnotnull")
                 };
        }    
    ;

ORDERBY_CLAUSE
    : %empty
    | ORDERBY SORTED_DEF DIRECTION
        {
            if ($2[0].getAttribute("type") === "tables_and_columns_var")
                $2[0].setAttribute("type", "tables_and_columns");

            console.log($3);

            $$ = { "expressions" : $2[0], "direction" : $3 };
        }
    ;

LIMIT_CLAUSE
    : %empty
    | LIMIT NUMBER
        { $$ = yy.sqlXML.createNumber(parseInt($2)); }
    ;

SUBQUERY
    : LPAREN SELECT_COMMAND RPAREN
        {
            if ($2.getAttribute("type") === "select")
                $2.setAttribute("type", "sub_select_where");

            $$ = $2;
        }
    ;

DISPLAYED_COLUMNS
    : DISPLAYED_COLUMN
    | DISPLAYED_COLUMNS COMMA DISPLAYED_COLUMN
        { $$ = yy.sqlXML.addTable($1, $3); }
    ;

DISPLAYED_COLUMN
    : COLUMN_NAME AS_ALIAS
        { $$ = $1; }
    /* | IDENTIFIER PERIOD MULTIPLICATE
        { $$ = yy.sqlXML.createTable('*', $1); } */
    | GROUP_FUNCTION LPAREN SELECTION COLUMN_LIST RPAREN AS_ALIAS
        {
            if ($3) {
                if ($3.toLowerCase() === "distinct")
                    $4 = yy.sqlXML.createDistinct($4);
            }

            if ($4.getAttribute("type") === "tables_and_columns_var")
                $4.setAttribute("type", "tables_and_columns");

            $$ = yy.sqlXML.createGroupFunction($1, $4, $6);
        }
    | SUBQUERY AS_ALIAS
        {
            if ($1.getAttribute("type") === "sub_select_where")
                $1.setAttribute("type", "sub_select");
            
            if ($2)
                $1 = yy.sqlXML.addAlias($1, $2);
            
            $$ = $1;
        }
    ;

SELECTED_TABLES
    : SELECTED_TABLE
        { $$ = []; $$.push($1); }
    | SELECTED_TABLES COMMA SELECTED_TABLE
        { $1.push($3); $$ = $1; }
    ;

SELECTED_TABLE
    : TABLE_NAME AS_ALIAS
        { $$ = { "tablename" : $1, "alias" : ($2) ? $2 : null }; }
    ;

SETS
    : SET INSERT_COLUMN EQ VALUE
        {
            $$ = [];
            $$.push({
                "column" : $2,
                "value" : $4
            });
        }
    | SETS COMMA INSERT_COLUMN EQ VALUE
        {
            $$.push({
                "column" : $3,
                "value" : $5
            });
        }
    ;

COLUMN_LIST
    : COLUMN_NAME { $$ = $1; }
    | COLUMN_LIST COMMA COLUMN_NAME { $$ = yy.sqlXML.addTable($1, $3); }
    ;

VALUE_LIST
    : VALUE { $$ = []; $$.push($1); }
    | VALUE_LIST COMMA VALUE { $$.push($3); }
    ;

VALUE
    : %empty
    | QUOTED_STRING
    | IDENTIFIER
        { $$ = yy.sqlXML.createString($1); }
    | MINUS IDENTIFIER
        { $$ = yy.sqlXML.createString($1 + $2); }
    | PLUS IDENTIFIER
        { $$ = yy.sqlXML.createString($2); }
    | NUMBER
        { $$ = yy.sqlXML.createNumber($1); }
    | MINUS NUMBER
        {
            var num = ($1) ? $1 + $2 : $2;
            $$ = yy.sqlXML.createNumber(num);
        }
    | PLUS NUMBER
        { $$ = yy.sqlXML.createNumber($2); }
    | FUNCTION
    | SUBQUERY
    ;

EXPR
    : BOOL
        { $$ = yy.sqlXML.createBool(($1.toLowerCase() == "true") ? true : false); }
    | NUMBER
        { $$ = yy.sqlXML.createNumber(parseInt($1)); }
    | QUOTED_STRING
    | DATETIME
    | VARIABLE
        { $$ = yy.sqlXML.createTableVar($1); }
    | SUBQUERY
    | FUNCTION
    | GROUP_FUNCTION LPAREN SELECTION EXPR RPAREN
        {
            if ($4.getAttribute("type") === "tables_and_columns_var")
                $4.setAttribute("type", "tables_and_columns");

            if ($3) {
                if ($3.toLowerCase() === "distinct")
                    $4 = yy.sqlXML.createDistinct($4);
            }

            $$ = yy.sqlXML.createGroupFunction($1, $4);
        }
    | EXPR PLUS EXPR
        { $$ = yy.sqlXML.createMath($1, $3, '+'); }
    | EXPR MINUS EXPR
        { $$ = yy.sqlXML.createMath($1, $3, '-'); }
    | EXPR DIVIDE EXPR
        { $$ = yy.sqlXML.createMath($1, $3, '/'); }
    | EXPR MULTIPLICATE EXPR
        { $$ = yy.sqlXML.createMath($1, $3, '*'); }
    | EXPR EQ EXPR
        { $$ = yy.sqlXML.createCompareOperator($1, $3, "="); }
    | EXPR NEQ EXPR
        { $$ = yy.sqlXML.createCompareOperator($1, $3, "!="); }
    | EXPR GT EXPR
        { $$ = yy.sqlXML.createCompareOperator($1, $3, ">"); }
    | EXPR LT EXPR
        { $$ = yy.sqlXML.createCompareOperator($1, $3, "<"); }
    | EXPR GTE EXPR
        { $$ = yy.sqlXML.createCompareOperator($1, $3, ">="); }
    | EXPR LTE EXPR
        { $$ = yy.sqlXML.createCompareOperator($1, $3, "<="); }
    | EXPR LIKE EXPR
        { $$ = yy.sqlXML.createCompareOperator($1, $3, "like"); }
    | EXPR IN SUBQUERY
        { $$ = yy.sqlXML.createCompareOperator($1, $3, "in"); }
    | EXPR IN LPAREN ARRAY RPAREN
        { $$ = yy.sqlXML.createCompareOperator($1, $4, "in"); }
    | EXPR IS NULL
        { $$ = yy.sqlXML.createCompareOperator($1, null, "isnull"); }
    | EXPR IS NOT NULL
        { $$ = yy.sqlXML.createCompareOperator($1, null, "isnotnull"); }
    | EXPR AND EXPR
        { $$ = yy.sqlXML.createAnd($1, $3); }
    | EXPR OR EXPR
        { $$ = yy.sqlXML.createOr($1, $3); }
    | NOT EXPR
        { $$ = yy.sqlXML.negate($2); }
    | LPAREN EXPR RPAREN
        { $$ = $2; }
    ;

ARRAY
    : ARRAY_ENTRY
        { $$ = yy.sqlXML.createArray($1); }
    | ARRAY COMMA ARRAY_ENTRY
        { $$ = yy.sqlXML.addArray($1, $3); }
    ;

ARRAY_ENTRY
    : QUOTED_STRING
    | NUMBER
        { $$ = yy.sqlXML.createNumber($1); }
    | DATETIME
    | BOOL
        { $$ = yy.sqlXML.createBool(($1.toLowerCase() == "true") ? true : false); }
    ;

QUOTED_STRING
    : QUOTE QUOTE
        { $$ = yy.sqlXML.createString(""); }
    | QUOTE NUMBER QUOTE
        { $$ = yy.sqlXML.createString($2); }
    | QUOTE IDENTIFIER QUOTE
        { $$ = yy.sqlXML.createString($2); }
    | DOUBLEQUOTE NUMBER DOUBLEQUOTE
        { $$ = yy.sqlXML.createString($2); }
    | DOUBLEQUOTE IDENTIFIER DOUBLEQUOTE
        { $$ = yy.sqlXML.createString($2); } 
    ;

SCHEMA_NAME
    : IDENTIFIER PERIOD
    ;

DATETIME
    : QUOTE DATE QUOTE
        { $$ = yy.sqlXML.createDate($2); }
    | QUOTE DATE TIME QUOTE
        { $$ = yy.sqlXML.createDate($2 + " " + $3); }
    ;

AS_ALIAS
    : %empty
    | IDENTIFIER
    | AS IDENTIFIER
        { $$ = $2; }
    ;

TABLE_NAME
    : IDENTIFIER
    | BACKTICKS IDENTIFIER BACKTICKS
        { $$ = $2; }
    ;

COLUMN_NAME
    : MULTIPLICATE
        { $$ = yy.sqlXML.createTable("*"); }
    | IDENTIFIER
        { $$ = yy.sqlXML.createTable($1); }
    | BACKTICKS IDENTIFIER BACKTICKS
        { $$ = yy.sqlXML.createTable($2); }
    | IDENTIFIER PERIOD MULTIPLICATE
        { $$ = yy.sqlXML.createTable("*", $1); }
    | BACKTICKS IDENTIFIER BACKTICKS PERIOD MULTIPLICATE
        { $$ = yy.sqlXML.createTable("*", $2); }
    | IDENTIFIER PERIOD IDENTIFIER
        { $$ = yy.sqlXML.createTable($3, $1); }
    | BACKTICKS IDENTIFIER BACKTICKS PERIOD BACKTICKS IDENTIFIER BACKTICKS
        { $$ = yy.sqlXML.createTable($6, $2); }
    
    ;

SORTED_DEF
    : EXPRESSIONS
    ;

GROUP_FUNCTION
    : AVG
    | COUNT
    | MIN
    | MAX
    | STDDEV
    | SUM
    | VARIANCE
    ;

FUNCTION
    : NUMBER_FUNCTION
    | CHAR_FUNCTION
    | DATE_FUNCTION
    ;

DATE_FUNCTION
    : NOW LPAREN RPAREN
        { $$ = yy.sqlXML.createDateFunction($1); }
    | CURDATE LPAREN RPAREN
        { $$ = yy.sqlXML.createDateFunction($1); }
    | CURTIME LPAREN RPAREN
        { $$ = yy.sqlXML.createDateFunction($1); }
    | DATE LPAREN DATE RPAREN
        { $$ = yy.sqlXML.createDateFunction($1, $3); }
    ;

NUMBER_FUNCTION
    : NUMBER_FUNCTION_ONE_PARAM LPAREN EXPR RPAREN
        { $$ = yy.sqlXML.createNumberFunction($1, $3); }
    | NUMBER_FUNCTION_TWO_PARAM LPAREN EXPR COMMA EXPR RPAREN
        { $$ = yy.sqlXML.createNumberFunction($1, $3, $5); }
    ;

NUMBER_FUNCTION_ONE_PARAM
    : ABS
    | CEIL
    | FLOOR
    | SIGN
    | SQRT
    ;

NUMBER_FUNCTION_TWO_PARAM
    : MOD
    | POWER
    | ROUND
    | TRUNCATE
    ;

CHAR_FUNCTION
    : CHAR_FUNCTION_ONE_PARAM LPAREN EXPR RPAREN
        { $$ = yy.sqlXML.createCharFunction($1, $3); }
    | CHAR_FUNCTION_TWO_PARAM LPAREN EXPR COMMA EXPR RPAREN
        { $$ = yy.sqlXML.createCharFunction($1, $3, $5); }
    | CHAR_FUNCTION_THREE_PARAM LPAREN EXPR COMMA EXPR COMMA EXPR RPAREN
        { $$ = yy.sqlXML.createCharFunction($1, $3, $5, $7); }
    ;

CHAR_FUNCTION_ONE_PARAM
    : LOWER
    | LTRIM
    | RTRIM
    | UPPER
    | ASCII
    | LENGTH
    | TO DATE
        { $$ = $1 + $2; }
    ;

CHAR_FUNCTION_TWO_PARAM
    : INSTR
    | SUBSTRING
    ;

CHAR_FUNCTION_THREE_PARAM
    : LPAD
    | REPLACE
    | RPAD
    ;

SELECTION
    : %empty
    | DISTINCT
        { $$ = yy.sqlXML.createDistinct(); }
    | ALL
    ;

DIRECTION
    : %empty
    | ASC
    | DESC
    ;
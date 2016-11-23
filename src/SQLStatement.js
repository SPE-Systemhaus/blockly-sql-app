/*******************************************************************************
 * The SQLStatement class represents the parsed SQL Statement.
 ******************************************************************************/
function SQLStatement() {
  var select = null;
  var insert = null;
  var update = null;

  var __construct = function() {
    select = {
      "selection" : "ALL",  /* String */
      "columns" : [],       /* Array */
      "tables" : [],        /* Array */
      "where" : null,       /* Object */
      "subselect" : null,   /* Object */
      "statement" : null,   /* Object */
      "limit" : null        /* Integer */
    };

    insert = {
      "table" : null,       /* String */
      "columns" : [],       /* Array */
      "values" : []         /* Array */
    };

    update = {
      "table" : null,       /* String */
      "columns" : [],       /* Array */
      "values" : [],        /* Array */
      "where" : null        /* Object */
    };
  }()

  this.setSelect = function(
      parsedSelection,
      parsedColumns,
      parsedTables,
      parsedWhereStatement,
      parsedSubSelect,
      parsedGroupBy,
      parsedOrderBy,
      parsedLimit
    ) {
    select.selection = parsedSelection;
    select.columns = parsedColumns;
    select.tables = parsedTables;
    select.where = parsedWhereStatement;
    select.subselect = parsedSubSelect;
    select.groupby = parsedGroupBy;
    select.orderby = parsedOrderBy;
    select.limit = parsedLimit;

    return select;
  };

  this.getSelect = function() {
    return select;
  };

  this.setInsert = function(parsedTable, parsedColumns, parsedValues) {
    var columns = [];
    var values = [];

    if (!parsedValues) {
      for (var key in parsedColumns) {
        var val = parsedColumns[key];
        columns.push(val.column);
        values.push(val.value);
      }
    } else {
      columns = parsedColumns;
      values = parsedValues;
    }

    insert.table = parsedTable;
    insert.columns = columns;
    insert.values = values;

    return insert;
  };

  this.getInsert = function() {
    return insert;
  };

  this.setUpdate = function(parsedTable, parsedSets, parsedWhereStatement) {
    var parsedColumns = [];
    var parsedValues = [];

    for (var key in parsedSets) {
      var val = parsedSets[key];
      parsedColumns.push(val.column);
      parsedValues.push(val.value);
    }

    update.table = parsedTable;
    update.columns = parsedColumns;
    update.values = parsedValues;
    update.where = parsedWhereStatement;

    return update;
  };

  this.getUpdate = function() {
    return update;
  };
}

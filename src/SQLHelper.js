function SQLHelper() {

  var __construct = function() {
  }()

  this.separateTableFromColumn = function(column) {
    var separated = { "table" : null, "column" : null };

    if (column.indexOf(".") !== -1) {
      var separator = column.indexOf(".");
      var end = column.length;
      separated.table = column.substring(0, separator);
      separated.column = column.substring(separator + 1, end);
    } else
      separated.column = column;

    return separated;
  };

  this.checkColumn = function(checkColumn) {
    for (var columnKey in Column) {
      var column = Column[columnKey];
      var table = Column[columnKey][0];

      for (var i = 1; i < column.length; i++) {
        if (checkColumn === column[i])
          return true;
      }
    }

    return false;
  };

  this.getTableOfColumn = function(checkColumn) {
    for (var columnKey in Column) {
      var column = Column[columnKey];
      var table = Column[columnKey][0];

      for (var i = 1; i < column.length; i++) {
        if (checkColumn === column[i][1])
          return table;
      }
    }

    return null;
  };

  this.isParsedColumnInDatabase = function(parsedTable, parsedColumn) {
    for (var tableKey in Column) {
      var table = Column[tableKey][0];
      var columns = [];

      if (table === parsedTable) {
        for (var i=1; i < Column[tableKey].length; i++)
          columns.push(Column[tableKey][i]);

        for (var columnKey in columns) {
          var column = columns[columnKey][1];
          if (parsedColumn === column)
            return true;
        }
      }
    }

    console.warn("Column (" + parsedColumn
        + ") in Table (" + parsedTable + ")"
        + "was not found current DB!");

    return false;
  };

  this.getAllColumnsByTable = function(tableName) {
    var columns = [];

    for (var columnKey in Column) {
      var table = Column[columnKey][0];
      if (table === tableName)
        for (var i = 1; i < Column[columnKey].length; i++)
          columns.push(Column[columnKey][i][1]);
    }

    return columns;
  };

  this.getAllColumnsWithTypeByTable = function (tableName) {
    var columns = {};

    for (var columnKey in Column) {
      var table = Column[columnKey][0];
      if (table === tableName)
        for (var i = 1; i < Column[columnKey].length; i++)
          columns[Column[columnKey][i][1]] = Column[columnKey][i][2];
    }

    return columns;
  }

  this.saveVariables = function() {

  };

  this.getTypeColour = function(table, column) {
    var columns = sqlHelp.getAllColumnsWithTypeByTable(table);

    if (column === "*")
      return SQLBlockly.Colours.list;

    if (column in columns) {
      var type = columns[column];

      switch(type.toLowerCase().trim()) {
          case "int":
          case "integer":
          case "integer unsigned":
          case "tinyint":
          case "tinyint unsigned":
          case "smallint":
          case "bigint":
          case "double":
          case "float":
          case "decimal":
              return SQLBlockly.Colours.number;
          case "varchar":
          case "text":
          case "string":
              return SQLBlockly.Colours.string;
          case "date":
          case "datetime":
              return SQLBlockly.Colours.date;
          case "bool":
          case "boolean":
              return SQLBlockly.Colours.boolean;
          case "blob":
              return SQLBlockly.Colours.undefined;
          default:
              return SQLBlockly.Colours.undefined;
      }
    }
  };

}

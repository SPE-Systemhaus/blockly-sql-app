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
  
  this.saveVariables = function() {
    
  };
}

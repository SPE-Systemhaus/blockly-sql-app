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

  this.getTableOfColumn = function(checkColumn) {
    console.warn("This table is only the first occurence!");

    for (var table in dbStructure) {
      var columns = dbStructure[table];

      for (columnKey in columns) {
        if (checkColumn === columns[columnKey].name)
          return table;
      }
    }

    return null;
  };

  this.getTypeColour = function(table, column) {
    var columns = getColumnsArrayFromStructure(table);
    var columnIndex = -1;

    if (column === "*")
      return SQLBlockly.Colours.list;

    /* Check if column exists */
    columns.forEach(function(columnObject, index) {
      if (column === columnObject.name)
        columnIndex = index
    });

    if (columnIndex !== -1) {
      var type = columns[columnIndex].type.toLowerCase().trim();

      switch(type) {
          case "int":
          case "int unsigned":
          case "integer":
          case "integer unsigned":
          case "tinyint":
          case "tinyint unsigned":
          case "smallint":
          case "smallint unsigned":
          case "mediumint":
          case "mediumint unsigned":
          case "bigint":
          case "bigint unsigned":
          case "double":
          case "float":
          case "decimal":
              return SQLBlockly.Colours.number;
          case "char":
          case "varchar":
          case "text":
          case "string":
              return SQLBlockly.Colours.string;
          case "date":
          case "datetime":
              return SQLBlockly.Colours.date;
          case "bool":
          case "boolean":
          case "binary":
              return SQLBlockly.Colours.boolean;
          case "enum":
              return SQLBlockly.Colours.list;
          case "blob":
              return SQLBlockly.Colours.undefined;
          default:
              return SQLBlockly.Colours.undefined;
      }
    }

    console.warn("Type of column is not in list, yet!");
    return SQLBlockly.Colours.undefined;
  };

  this.getTypeByColour = function(color) {
    switch(color) {
      case SQLBlockly.Colours.string:
        return "string";
      case SQLBlockly.Colours.number:
        return "number";
      case SQLBlockly.Colours.date:
        return "date";
      case SQLBlockly.Colours.boolean:
        return "bool";
    }

    return "undefined";
  };

  this.getType = function(table, column) {
    var columns = getColumnsArrayFromStructure(table);
    var color = this.getTypeColour(table, column);

    switch(color) {
      case SQLBlockly.Colours.string:
        return "string";
      case SQLBlockly.Colours.number:
        return "number";
      case SQLBlockly.Colours.date:
        return "date";
      case SQLBlockly.Colours.boolean:
        return "bool";
      case SQLBlockly.Colours.list:
        return "tables_column_var";
    }

    return null;
  };

}

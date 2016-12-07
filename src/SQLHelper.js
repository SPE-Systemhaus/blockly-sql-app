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
              return SQLBlockly.Colours.boolean;
          case "blob":
              return SQLBlockly.Colours.undefined;
          default:
              return SQLBlockly.Colours.undefined;
      }
    }

    console.warn("Type of column is not in list, yet!");
    return SQLBlockly.Colours.undefined;
  };

}

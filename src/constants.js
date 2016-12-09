var SQLBlockly = {};

SQLBlockly.LANG = "en";
SQLBlockly.MEDIA_PATH = "../common/libs/blockly/media/";

/* COLOURS */
SQLBlockly.Colours = {};

SQLBlockly.Colours.list = "#74A55B";
SQLBlockly.Colours.string = "#A56D5B";
SQLBlockly.Colours.number = "#6C5DA4";
SQLBlockly.Colours.boolean = "#5BA58C";
SQLBlockly.Colours.date = "#A55B80";
SQLBlockly.Colours.undefined = "#000000";
SQLBlockly.Colours.mutators = "#63A65A";

/* Priority array */
var inputPriority = {
    "bla" : 1,
    "select" : 2,
    "Clause" : 3,
    "group_by" : 4,
    "having" : 5,
    "order_by" : 6,
    "sort" : 7,
    "limit" : 8,
    "VALUE" : 9     /* ALIAS */
};
function TableNotFoundException(message) {
    this.message = "Table not found in the current database!";

    if (message)
        this.message = message;

    this.name = "TableNotFoundException";
}

function AllColumnsException(message) {
    this.message = "You can select all columns with the * only once!";

    if (message)
        this.message = message;

    this.name = "AllColumnsException";
}
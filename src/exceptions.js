function TableNotFoundException(message) {
    this.message = "Table not found in the current database!";

    if (message)
        this.message = message;

    this.name = "TableNotFoundException";
}
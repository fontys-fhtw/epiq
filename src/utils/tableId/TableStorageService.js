class TableStorageService {
  static saveTable(tableId) {
    const dateAdded = new Date().toString();
    const tableData = { tableId, dateAdded };

    // Save the new table data, replacing any existing entry
    localStorage.setItem("savedTable", JSON.stringify(tableData));
  }

  static getTable() {
    const savedData = localStorage.getItem("savedTable");
    return savedData ? JSON.parse(savedData) : null;
  }

  static clearTable() {
    localStorage.removeItem("savedTable");
  }
}

export default TableStorageService;

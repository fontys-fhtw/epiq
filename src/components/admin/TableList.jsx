const TableList = ({ tables, selectedTables, onTableSelection }) => {
  return (
    <table className="size-full">
      <thead className="w-full">
        <tr className="w-full bg-dark text-left text-white">
          <th className="px-4 py-2">Table Name</th>
          <th className="px-4 py-2">Capacity</th>
          <th className="px-4 py-2">Location</th>
          <th className="px-4 py-2">Created At</th>
        </tr>
      </thead>
      <tbody className="w-full overflow-scroll">
        {tables.map((table) => (
          <tr
            key={table.tableId}
            className={`cursor-pointer transition-colors hover:bg-gold hover:text-black ${selectedTables.includes(table.tableId) ? "bg-brown text-white" : ""}`}
            onClick={() => onTableSelection(table.tableId)}
          >
            <td className="px-4 py-2">{table.name}</td>
            <td className="px-4 py-2">{table.maxPeopleAmount}</td>
            <td className="px-4 py-2">{table.location}</td>
            <td className="px-4 py-2">
              {new Date(table.created_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableList;

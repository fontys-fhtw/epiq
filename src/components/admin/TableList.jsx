/* eslint-disable no-nested-ternary */
import React from "react";

const TableList = ({ tables, selectedTables, onTableSelection }) => {
  return (
    <table className="mb-6 min-w-full rounded-lg bg-white shadow-md">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">Select</th>
          <th className="px-4 py-2">Table Name</th>
          <th className="px-4 py-2">Capacity</th>
          <th className="px-4 py-2">Location</th>
          <th className="px-4 py-2">Created At</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => (
          <tr key={table.tableId} className="hover:bg-gray-100">
            <td className="px-4 py-2">
              <label>
                <input
                  type="checkbox"
                  checked={selectedTables.includes(table.tableId)}
                  onChange={() => onTableSelection(table.tableId)}
                  aria-label={`Select table ${table.name}`}
                />
              </label>
            </td>
            <td className="px-4 py-2">{table.name}</td>
            <td className="px-4 py-2">{table.maxPeopleAmount}</td>
            <td className="px-4 py-2">{table.location}</td>
            <td className="px-4 py-2">{table.created_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableList;

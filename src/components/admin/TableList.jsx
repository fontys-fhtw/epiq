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
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Created At</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => (
          <tr key={table.id} className="hover:bg-gray-100">
            <td className="px-4 py-2">
              <input
                type="checkbox"
                checked={selectedTables.includes(table.id)}
                onChange={() => onTableSelection(table.id)}
              />
            </td>
            <td className="px-4 py-2">{table.name}</td>
            <td className="px-4 py-2">{table.capacity}</td>
            <td className="px-4 py-2">{table.location}</td>
            <td
              className={`px-4 py-2 ${table.status === "Available" ? "text-green-500" : table.status === "Reserved" ? "text-yellow-500" : "text-red-500"}`}
            >
              {table.status}
            </td>
            <td className="px-4 py-2">{table.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableList;

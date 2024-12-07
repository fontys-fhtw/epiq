import { QRCodeCanvas } from "qrcode.react";
import React, { useState } from "react";
import ActionButton from "../common/ActionButton";

const QRCodeDisplay = ({
  tables,
  selectedTables,
  onTableSelection,
  urlPrefix,
}) => {
  const itemsPerPage = 8; // 2 rows x 4 columns
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tables.length / itemsPerPage);

  // Calculate the tables to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const tablesToDisplay = tables.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full">
      {/* Grid Display of QR Codes */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tablesToDisplay.map((table) => {
          const url = `${urlPrefix}?tableId=${table.tableId}`;
          return (
            <div
              key={table.tableId}
              id={`qr-${table.tableId}`}
              className="relative flex flex-col items-center rounded-lg border bg-white p-4 shadow-md"
            >
              {/* Checkbox at the top-left */}
              <input
                type="checkbox"
                checked={selectedTables.includes(table.tableId)}
                onChange={() => onTableSelection(table.tableId)}
                aria-label={`Select table ${table.name}`}
                className="absolute top-2 left-2 h-5 w-5"
              />

              <h2 className="mb-2 text-lg font-semibold text-gray-700">
                {table.name}
              </h2>
              <QRCodeCanvas value={url} size={128} />
              <p className="mt-2 text-sm text-gray-600">
                Capacity: {table.maxPeopleAmount}, Location: {table.location}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center space-x-4">
        <ActionButton
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`rounded-lg px-4 py-2 font-semibold shadow-md transition-all ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-white"
          }`}
        >
          Previous
        </ActionButton>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <ActionButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`rounded-lg px-4 py-2 font-semibold shadow-md transition-all ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-white"
          }`}
        >
          Next
        </ActionButton>
      </div>
    </div>
  );
};

export default QRCodeDisplay;

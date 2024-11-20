"use client";

import QRCodeDisplay from "@src/components/admin/QRCodeDisplay";
import TableList from "@src/components/admin/TableList";
import getURL from "@src/utils/url";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";

export default function QRCodePage() {
  const [selectedTables, setSelectedTables] = useState([]);
  const qrRef = useRef({}); // Store refs to multiple QR codes

  // Mock list of tables with additional information
  const tables = [
    {
      id: 1,
      name: "Table 1",
      capacity: 4,
      location: "Main Hall",
      status: "Available",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Table 2",
      capacity: 2,
      location: "Patio",
      status: "Reserved",
      createdAt: "2024-01-02",
    },
    {
      id: 3,
      name: "Table 3",
      capacity: 6,
      location: "Main Hall",
      status: "Occupied",
      createdAt: "2024-01-03",
    },
    {
      id: 4,
      name: "Table 4",
      capacity: 4,
      location: "Patio",
      status: "Available",
      createdAt: "2024-01-04",
    },
    // Add more tables as needed
  ];

  const urlPrefix = `${getURL().customer}menu`;

  useEffect(() => {
    // Ensure qrRef is up-to-date
    qrRef.current = selectedTables.reduce((acc, tableId) => {
      acc[tableId] = document.getElementById(`qr-${tableId}`);
      return acc;
    }, {});
  }, [selectedTables]);

  const handleTableSelection = (tableId) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter((id) => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  const generateQRCodeDataUrls = async () => {
    const zip = new JSZip();

    await Promise.all(
      selectedTables.map(async (tableId) => {
        const canvas = qrRef.current[tableId]?.querySelector("canvas");
        if (canvas) {
          const dataUrl = canvas.toDataURL("image/png");
          const blob = await fetch(dataUrl).then((res) => res.blob());
          zip.file(`table-${tableId}-qr.png`, blob);
        }
      }),
    );

    return zip.generateAsync({ type: "blob" });
  };

  const handleDownloadAll = async () => {
    const zipBlob = await generateQRCodeDataUrls();
    saveAs(zipBlob, `qr-codes-${Date.now()}.zip`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-6">
      <h1 className="mb-6 text-2xl font-semibold">Restaurant Tables</h1>

      <TableList
        tables={tables}
        selectedTables={selectedTables}
        onTableSelection={handleTableSelection}
      />

      {selectedTables.length > 0 && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-600"
          >
            Download QR Codes for Selected Tables
          </button>
        </div>
      )}

      <QRCodeDisplay
        selectedTables={selectedTables}
        urlPrefix={urlPrefix}
        qrRef={qrRef}
      />
    </div>
  );
}

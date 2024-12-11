"use client";

import QRCodeModalPreview from "@src/components/admin/management/QRCodeModalPreview";
import QRCodeDisplay from "@src/components/admin/QRCodeDisplay";
import TableList from "@src/components/admin/TableList";
import { getTables } from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";

export default function QRCodePage() {
  const [selectedTables, setSelectedTables] = useState([]);
  const qrRef = useRef({}); // Store refs to multiple QR codes
  const [tables, setTables] = useState([]);
  const supabase = createSupabaseBrowserClient();
  const [errorMessage, setErrorMessage] = useState(null);

  // State to control the modal visibility
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Fetch tables on mount
  const fetchTables = async () => {
    const { data, error } = await getTables(supabase);
    if (!error) {
      setTables(data);
      console.log(data);
    } else {
      setErrorMessage(`Error fetching tables: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [supabase]);

  const urlPrefix = `${getBaseUrl().customer}menu`;

  useEffect(() => {
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
    if (selectedTables.length === 0) return;

    const zipBlob = await generateQRCodeDataUrls();
    saveAs(zipBlob, `qr-codes-${Date.now()}.zip`);
  };

  // Handle modal open
  const openPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  // Handle modal close
  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  if (errorMessage) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex max-h-screen flex-col items-center gap-6 bg-darkBg px-4 pb-12 pt-24 text-white">
      <div className="flex w-full max-w-7xl flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Restaurant Tables</h1>
          <p className="text-gray-300">
            Click on the row to select a table. You can preview and download QR
            codes for the selected tables.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          {/* Preview QR Codes Button */}
          <button
            type="button"
            onClick={openPreviewModal}
            className="w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-300 hover:bg-blue-600 disabled:opacity-50 sm:w-auto"
            disabled={selectedTables.length === 0}
          >
            Preview QR Codes
          </button>

          {/* Download QR Codes Button */}
          <button
            type="button"
            onClick={handleDownloadAll}
            className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-300 hover:bg-green-600 disabled:opacity-50 sm:w-auto"
            disabled={selectedTables.length === 0}
          >
            Download QR Codes
          </button>
        </div>
      </div>

      {/* Table List */}
      <div className="size-full max-w-7xl overflow-scroll rounded-lg bg-gray-300 text-black shadow-md shadow-dark">
        <TableList
          tables={tables}
          onTableSelection={handleTableSelection}
          selectedTables={selectedTables}
        />
      </div>

      {/* Preview QR Codes Modal */}
      <QRCodeModalPreview
        isOpen={isPreviewModalOpen}
        onClose={closePreviewModal}
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-white">
          Preview QR Codes
        </h2>
        {selectedTables.length === 0 ? (
          <p className="text-center text-gray-300">No tables selected.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {selectedTables.map((tableId) => (
              <div
                key={tableId}
                id={`qr-${tableId}`}
                className="flex flex-col items-center rounded-lg bg-gray-800 p-4"
              >
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Table {tableId}
                </h3>
                <QRCodeDisplay
                  selectedTables={[tableId]}
                  urlPrefix={urlPrefix}
                  qrRef={qrRef}
                />
                <button
                  onClick={async () => {
                    const canvas = document
                      .getElementById(`qr-${tableId}`)
                      ?.querySelector("canvas");
                    if (canvas) {
                      const dataUrl = canvas.toDataURL("image/png");
                      saveAs(dataUrl, `table-${tableId}-qr.png`);
                    }
                  }}
                  className="mt-2 rounded bg-purple-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-purple-600"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </QRCodeModalPreview>
    </div>
  );
}

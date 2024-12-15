"use client";

import QRCodeModalPreview from "@src/components/admin/QRCodeModalPreview";
import TableList from "@src/components/admin/TableList";
import { getTables } from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";

export default function QRCodePage() {
  const supabase = createSupabaseBrowserClient();
  const qrRef = useRef({}); // Store refs to multiple QR codes

  // State
  const [selectedTables, setSelectedTables] = useState([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const {
    data: tables,
    error,
    isLoading,
  } = useSupabaseQuery(getTables(supabase));

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

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex max-h-screen flex-col items-center gap-6 bg-darkBg px-4 pb-12 pt-24 text-white">
      {/* loading state */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <p>Loading...</p>
        </div>
      )}

      {/* Header */}
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
        selectedTables={selectedTables}
        urlPrefix={urlPrefix}
        qrRef={qrRef}
      />
    </div>
  );
}

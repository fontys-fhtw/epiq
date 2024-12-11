"use client";

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
    const zipBlob = await generateQRCodeDataUrls();
    saveAs(zipBlob, `qr-codes-${Date.now()}.zip`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-darkBg p-6 text-black">
      <h1 className="mb-6 text-2xl font-semibold text-white">
        Restaurant Tables
      </h1>

      {errorMessage && (
        <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          {errorMessage}
        </span>
      )}

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
            className="rounded-lg bg-gold px-6 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:bg-gold"
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

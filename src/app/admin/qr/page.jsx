"use client";

import QRCodeDisplay from "@src/components/admin/QRCodeDisplay";
import ActionButton from "@src/components/common/ActionButton";
import { getTables } from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";

export default function QRCodePage() {
  const [selectedTables, setSelectedTables] = useState([]);
  const [tables, setTables] = useState([]);
  const supabase = createSupabaseBrowserClient();
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch tables on mount
  const fetchTables = async () => {
    const { data, error } = await getTables(supabase);
    if (!error) {
      setTables(data);
    } else {
      setErrorMessage(`Error fetching tables: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [supabase]);

  const urlPrefix = `${getBaseUrl().customer}menu`;

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
        const canvas = document
          .getElementById(`qr-${tableId}`)
          .querySelector("canvas");
        if (canvas) {
          const dataUrl = canvas.toDataURL("image/png");
          const blob = await fetch(dataUrl).then((res) => res.blob());
          zip.file(`table-${tableId}-qr.png`, blob);
        }
      })
    );

    return zip.generateAsync({ type: "blob" });
  };

  const handleDownloadAll = async () => {
    const zipBlob = await generateQRCodeDataUrls();
    saveAs(zipBlob, `qr-codes-${Date.now()}.zip`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-6">
      <h1 className="mb-6 text-2xl font-semibold text-black">
        Restaurant Tables
      </h1>
      {errorMessage && (
        <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          {errorMessage}
        </span>
      )}
      <QRCodeDisplay
        tables={tables}
        selectedTables={selectedTables}
        onTableSelection={handleTableSelection}
        urlPrefix={urlPrefix}
      />
      {selectedTables.length > 0 && (
        <ActionButton
          type="button"
          onClick={handleDownloadAll}
          className="mt-6 rounded-lg px-6 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:bg-gold"
        >
          Download Selected QR Codes
        </ActionButton>
      )}
    </div>
  );
}

import { QRCodeCanvas } from "qrcode.react";
import React from "react";

const QRCodeDisplay = ({ selectedTables, urlPrefix, qrRef }) => {
  return (
    <div className="grid grid-flow-row gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {selectedTables.map((tableId) => {
        const url = `${urlPrefix}?tableId=${tableId}`;
        return (
          <div
            key={tableId}
            id={`qr-${tableId}`}
            ref={(el) => {
              // eslint-disable-next-line no-param-reassign
              qrRef.current[tableId] = el;
            }}
            className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold text-gray-700">
              QR Code for Table {tableId}
            </h2>
            <div className="rounded-lg bg-gray-100 p-4 shadow-md">
              <QRCodeCanvas value={url} size={128} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QRCodeDisplay;

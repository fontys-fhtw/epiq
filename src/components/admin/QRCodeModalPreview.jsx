"use client";

import { QRCodeCanvas } from "qrcode.react";
import { FaTimes } from "react-icons/fa";

const QRCodeModalPreview = ({
  isOpen,
  onClose,
  selectedTables,
  qrRef,
  urlPrefix,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 py-12
      transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      onClick={onClose}
    >
      <div
        className="relative size-full max-w-7xl overflow-auto rounded-lg bg-darkBg/90 shadow-lg shadow-darkBg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gold transition-colors hover:text-brown"
        >
          <FaTimes size={24} />
        </button>

        {/* Modal Content */}
        <div className="p-6">
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
                  className="flex flex-col items-center rounded-lg bg-dark p-4 shadow-md"
                >
                  <h2 className="mb-2 text-lg font-semibold text-white">
                    Table #{tableId}
                  </h2>
                  <div className="rounded-lg bg-gray-100 p-4 shadow-md">
                    <QRCodeCanvas value={url} size={128} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModalPreview;

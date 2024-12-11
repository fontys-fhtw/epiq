"use client";

import { FaTimes } from "react-icons/fa";

const QRCodeModalPreview = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative max-h-full w-11/12 max-w-3xl overflow-auto rounded-lg bg-darkBg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white transition-colors hover:text-gray-300"
        >
          <FaTimes size={24} />
        </button>

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default QRCodeModalPreview;

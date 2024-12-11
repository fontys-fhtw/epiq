"use client";

import { FaTimes } from "react-icons/fa";

const QRCodeModalPreview = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 py-12"
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
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default QRCodeModalPreview;

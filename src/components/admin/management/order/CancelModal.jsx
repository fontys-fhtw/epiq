"use client";

import React from "react";

const CancelModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-darkBg bg-opacity-75">
      <div className="rounded-lg bg-gray-800 p-6 text-center shadow-lg">
        <h2 className="text-xl font-bold text-red-500">Cancel Order</h2>
        <p className="mt-2 text-sm text-gray-300">
          Are you sure you want to cancel this order?
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600"
          >
            Yes, Cancel
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-500 px-4 py-2 font-bold text-white transition hover:bg-gray-600"
          >
            No, Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;

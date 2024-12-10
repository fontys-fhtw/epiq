import RestaurantMenu from "@src/components/customer/RestaurantMenu";
import React from "react";

const DemoMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Modal Wrapper */}
      <div
        className="relative h-[700px] w-[380px] rounded-[30px] border-2 border-gray-700 bg-black text-white shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Volume Buttons on the Left */}
        <div className="absolute -left-2 top-1/4 flex flex-col space-y-2">
          <div className="h-16 w-2 rounded-full bg-gray-800 shadow-md" />
          <div className="h-16 w-2 rounded-full bg-gray-800 shadow-md" />
        </div>

        {/* Power Button on the Right */}
        <div className="absolute -right-2 top-1/4">
          <div className="h-16 w-2 rounded-full bg-gray-800 shadow-md" />
        </div>

        {/* Modal Content */}
        <div className="relative flex h-full flex-col justify-between overflow-y-auto p-6">
          <RestaurantMenu isDemo />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-gray-500 text-white"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoMenu;

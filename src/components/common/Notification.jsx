import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import React, { Fragment } from "react";

const Notification = ({ show, message, type = "success", onClose }) => {
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform transition duration-[300ms]"
      enterFrom="opacity-0 translate-y-2"
      enterTo="opacity-100 translate-y-0"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-2"
    >
      <div
        className={`fixed bottom-4 right-4 rounded p-4 shadow-lg ${typeStyles[type]} flex items-center space-x-2`}
      >
        <span>{message}</span>
        <button onClick={onClose} className="font-bold text-white">
          &times;
        </button>
      </div>
    </Transition>
  );
};

Notification.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info", "warning"]),
  onClose: PropTypes.func.isRequired,
};

export default Notification;

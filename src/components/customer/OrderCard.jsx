import { ORDER_STATUS_ID_TO_STYLE } from "@src/constants";
import React from "react";

const OrderCard = ({ order }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-dark p-4 shadow-lg shadow-gray-800">
      {/* Header Section */}
      <div className="items-between mb-2 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Order #{order.orderid}
          </h2>
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${ORDER_STATUS_ID_TO_STYLE[order.statusid]}`}
          >
            {order.statusName || "N/A"}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-300">
            {formatDate(order.created_at)}
          </span>
        </div>
      </div>

      <p className="mb-2 text-gray-200">
        <strong>Total Amount:</strong> ${order.total_amount?.toFixed(2)}
      </p>

      {/* Items List */}
      <strong className="text-gray-200">Items:</strong>
      <div className="ml-4">
        <ul className="mt-1 list-inside list-disc text-gray-100">
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price.toFixed(2)}
              </li>
            ))
          ) : (
            <li>No items found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrderCard;

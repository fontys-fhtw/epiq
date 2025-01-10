// OrderCard.jsx
import { ORDER_STATUS_ID_TO_STYLE } from "@src/constants";
import Link from "next/link"; // Import Link
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

  // Calculate the number of items
  const numberOfItems = order.items ? order.items.length : 0;

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-dark p-4 shadow-lg shadow-gray-800">
      <div className="space-y-2">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          {/* Order Number */}
          <h2 className="text-xl font-semibold text-white">
            Order #{order.orderid}
          </h2>

          {/* Status Badge */}
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${ORDER_STATUS_ID_TO_STYLE[order.statusid]}`}
          >
            {order.statusName || "N/A"}
          </span>
        </div>

        {/* Date */}
        <div className="text-sm text-gray-300">
          {formatDate(order.created_at)}
        </div>

        {/* Items and Total Amount on One Line */}
        <div className="flex items-center text-sm text-gray-300">
          <span>
            {numberOfItems} {numberOfItems === 1 ? "item" : "items"}
          </span>
          <span className="mx-2">•</span>
          <span>${order.total_amount?.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 flex justify-start">
        <Link
          href={`/customer/order/${order.orderid}`}
          aria-label={`View summary for order #${order.orderid}`}
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          View Summary
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;

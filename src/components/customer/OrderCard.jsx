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

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-dark p-4 shadow-lg shadow-gray-800">
      {/* Header Section */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-white">
          Order #{order.orderid}
        </h2>
        <span className="text-sm text-gray-500">
          {formatDate(order.created_at)}
        </span>
      </div>

      {/* Status and Total Amount */}
      <p className="mb-2 text-gray-300">
        <strong>Status:</strong>{" "}
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(order.statusName)}`}
        >
          {order.statusName || "N/A"}
        </span>
      </p>
      <p className="mb-2 text-gray-300">
        <strong>Total Amount:</strong> ${order.total_amount?.toFixed(2)}
      </p>

      {/* Items List */}
      <strong className="text-gray-300">Items:</strong>
      <div className="ml-4">
        <ul className="mt-1 list-inside list-disc text-gray-200">
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

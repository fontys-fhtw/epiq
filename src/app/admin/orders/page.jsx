"use client";

import { getOrders } from "@src/queries/admin";
import { useEffect, useState } from "react";

const statusFlow = [
  { name: "Submitted", nextAction: "Prepare", nextStatusId: 2 },
  { name: "Preparing", nextAction: "Ready for Pickup", nextStatusId: 3 },
  { name: "Ready for Pickup", nextAction: "Complete", nextStatusId: 4 },
  { name: "Completed", nextAction: "", nextStatusId: null },
  { name: "Cancelled", nextAction: "", nextStatusId: null },
];

const getNextStatusInfo = (currentStatusName) => {
  return statusFlow.find((status) => status.name === currentStatusName) || {};
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpandedOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleUpdateOrderStatus = async (orderId, newStatusId) => {
    try {
      const response = await fetch("/api/admin/order-status-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: orderId,
          statusid: newStatusId,
        }),
      });
      if (response.ok) {
        fetchOrders();
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCancelClick = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelConfirmation(true);
  };

  const confirmCancel = async () => {
    if (cancelOrderId !== null) {
      await handleUpdateOrderStatus(cancelOrderId, 5);
    }
    setShowCancelConfirmation(false);
    setCancelOrderId(null);
  };

  const closeCancelConfirmation = () => {
    setShowCancelConfirmation(false);
    setCancelOrderId(null);
  };

  const resetStatus = async (orderId) => {
    await handleUpdateOrderStatus(orderId, 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 px-4 text-white">
      <header className="mb-8 pt-10 text-center">
        <h1 className="bg-gradient-to-r from-blue-400 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl md:text-6xl">
          Order Management
        </h1>
      </header>

      <main className="w-full max-w-4xl space-y-6 rounded-2xl bg-gray-900 p-4 shadow-lg sm:p-8">
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStatusName = order.order_status?.name || "No Status";
            const { nextAction, nextStatusId } =
              getNextStatusInfo(currentStatusName);
            const isExpanded = expandedOrderId === order.orderid;

            return (
              <div
                key={order.orderid}
                onClick={() => toggleExpandedOrder(order.orderid)}
                className={`relative cursor-pointer rounded-lg p-4 shadow-md transition-all ${
                  isExpanded ? "bg-gray-700" : "bg-gray-800"
                } hover:bg-gray-700 hover:shadow-lg`}
              >
                {/* Order Summary */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold sm:text-lg">
                      Order ID: {order.orderid}
                    </p>
                    <p className="text-sm sm:text-base">
                      Table ID: {order.tableid}
                    </p>
                    <p className="text-sm sm:text-base">
                      Status: {currentStatusName}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-400 sm:text-sm">
                    {isExpanded ? "Click to Collapse" : "Click to Expand"}
                  </div>
                </div>

                {/* Reset Button for Completed or Cancelled Orders */}
                {(currentStatusName === "Completed" ||
                  currentStatusName === "Cancelled") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetStatus(order.orderid);
                    }}
                    type="button"
                    className="absolute right-4 top-4 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white shadow-md transition-transform ease-in-out hover:bg-yellow-600"
                  >
                    Reset
                  </button>
                )}

                {/* Expanded Order View */}
                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Order Details
                    </h3>

                    {/* Notes (Conditional) */}
                    {order.notes && (
                      <div className="rounded-md bg-gray-800 p-4 shadow-md">
                        <p className="text-sm font-semibold text-teal-400">
                          Notes
                        </p>
                        <p className="text-sm text-gray-300">{order.notes}</p>
                      </div>
                    )}

                    {/* Dish List */}
                    <div className="border-t border-gray-700 pt-4">
                      <div className="grid grid-cols-3 gap-4 pb-2 text-sm font-semibold text-gray-300">
                        <p className="col-span-1">Dish</p>
                        <p className="col-span-1 text-center">Quantity</p>
                        <p className="col-span-1 text-right">Price</p>
                      </div>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.dish?.name || item.quantity} // Use dish name or quantity as a unique identifier if no unique ID is available
                            className="grid grid-cols-3 gap-4 rounded-md bg-gray-800 p-3 shadow-sm"
                          >
                            <p className="col-span-1 font-medium">
                              {item.dish?.name}
                            </p>
                            <p className="col-span-1 text-center text-gray-400">
                              {item.quantity}
                            </p>
                            <p className="col-span-1 text-right font-semibold text-white">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 space-y-2">
                      {nextAction && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateOrderStatus(
                              order.orderid,
                              nextStatusId,
                            );
                          }}
                          type="button"
                          className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 px-4 py-2 font-bold text-white shadow-md transition-transform ease-in-out hover:scale-105"
                        >
                          {nextAction}
                        </button>
                      )}
                      {currentStatusName !== "Completed" &&
                        currentStatusName !== "Cancelled" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelClick(order.orderid);
                            }}
                            type="button"
                            className="w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 font-bold text-white shadow-md transition-transform ease-in-out hover:scale-105"
                          >
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cancel Confirmation Popup */}
        {showCancelConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-lg bg-gray-800 px-6 py-4 text-center shadow-xl">
              <h2 className="text-xl font-bold text-blue-500">
                Confirm Cancellation
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                Are you sure you want to cancel this order?
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={confirmCancel}
                  type="button"
                  className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 font-bold text-white transition-transform ease-in-out hover:bg-red-700"
                >
                  Yes
                </button>
                <button
                  onClick={closeCancelConfirmation}
                  type="button"
                  className="rounded-lg bg-gray-500 px-4 py-2 font-bold text-white transition-transform ease-in-out hover:bg-gray-600"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

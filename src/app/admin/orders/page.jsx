"use client";

import { getOrders } from "@src/queries/admin";
import { useEffect, useState } from "react";

const statusFlow = [
  { id: 1, name: "Submitted", color: "bg-gray-500" },
  { id: 2, name: "Preparing", color: "bg-blue-500" },
  { id: 3, name: "Ready for Pickup", color: "bg-teal-500" },
  { id: 4, name: "Completed", color: "bg-green-500" },
  { id: 5, name: "Cancelled", color: "bg-red-500" },
];

const getStatusByName = (name) =>
  statusFlow.find((status) => status.name === name);

function renderColumn(
  status,
  orders,
  handleDragOver,
  handleDrop,
  handleDragStart,
  expandedOrders,
  toggleCardExpansion,
  colSpanClass = "col-span-1",
  isPreparing = false,
) {
  const filteredOrders = orders.filter(
    (order) => order.order_status?.name === status.name,
  );

  if (status.name === "Completed" || status.name === "Cancelled") {
    return null;
  }

  return (
    <div
      key={status.id}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(status.name)}
      className={`${colSpanClass} flex h-full flex-col overflow-hidden bg-gray-800`}
    >
      <h2
        className={`mb-2 text-center text-lg font-bold ${status.color} p-2 text-white`}
      >
        {status.name}
      </h2>
      <div className="flex-1 overflow-auto p-2">
        <div
          className={`${
            isPreparing ? "grid grid-cols-1 gap-4 md:grid-cols-2" : "space-y-4"
          }`}
        >
          {filteredOrders.map((order) => (
            <div
              key={order.orderid}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                handleDragStart(e, order);
              }}
              className="h-48 cursor-default rounded-lg border border-gray-600 bg-gray-700 p-3 shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">
                    Order ID: {order.orderid}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Table: {order.tableid || "N/A"}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div
                className="mt-2 max-h-32 space-y-2 overflow-y-auto"
                draggable={false}
                onDragStart={(e) => e.stopPropagation()}
              >
                {order.notes && (
                  <div className="rounded bg-gray-600 p-2 shadow-inner">
                    <h4 className="text-xs font-bold text-teal-400">Notes</h4>
                    <p className="text-xs text-gray-300">{order.notes}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-teal-400">
                    Order Items
                  </h4>
                  <ul className="space-y-1">
                    {order.order_items?.map((item) => (
                      <li
                        key={
                          item.dish?.id
                            ? `dish-${item.dish.id}`
                            : `order-${order.orderid}-${item.name}`
                        }
                        className="flex justify-between rounded bg-gray-600 p-1"
                      >
                        <span className="text-xs">
                          {item.dish?.name || "Unknown Dish"}
                        </span>
                        <span className="text-xs">x{item.quantity}</span>
                        <span className="text-xs">
                          ${item.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [draggedOrder, setDraggedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
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

  const toggleCardExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleDragStart = (e, order) => {
    e.stopPropagation();
    setDraggedOrder(order);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (statusName) => {
    const newStatus = getStatusByName(statusName);

    if (draggedOrder) {
      if (newStatus?.name === "Cancelled") {
        setCancelOrderId(draggedOrder.orderid);
        setShowCancelModal(true);
        setDraggedOrder(null);
        return;
      }

      try {
        await fetch("/api/admin/order-status-update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderid: draggedOrder.orderid,
            statusid: newStatus.id,
          }),
        });
        fetchOrders();
      } catch (error) {
        console.error("Error updating order status:", error);
      }

      setDraggedOrder(null);
    }
  };

  const confirmCancel = async () => {
    try {
      await fetch("/api/admin/order-status-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: cancelOrderId,
          statusid: 5,
        }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
    }
    setShowCancelModal(false);
    setCancelOrderId(null);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="grid h-full grid-cols-12 gap-0">
        {statusFlow
          .filter((status) => status.name === "Submitted")
          .map((status) =>
            renderColumn(
              status,
              orders,
              handleDragOver,
              handleDrop,
              handleDragStart,
              expandedOrders,
              toggleCardExpansion,
              "col-span-2 border-r border-gray-700",
            ),
          )}

        {statusFlow
          .filter((status) => status.name === "Preparing")
          .map((status) =>
            renderColumn(
              status,
              orders,
              handleDragOver,
              handleDrop,
              handleDragStart,
              expandedOrders,
              toggleCardExpansion,
              "col-span-5 border-r border-gray-700",
              true,
            ),
          )}

        {statusFlow
          .filter((status) => status.name === "Ready for Pickup")
          .map((status) =>
            renderColumn(
              status,
              orders,
              handleDragOver,
              handleDrop,
              handleDragStart,
              expandedOrders,
              toggleCardExpansion,
              "col-span-2 border-r border-gray-700",
            ),
          )}

        <div className="col-span-3 flex h-full flex-col overflow-hidden">
          {["Completed", "Cancelled"].map((statusName) => (
            <div
              key={statusName}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(statusName)}
              className="flex flex-1 flex-col overflow-hidden border-b border-gray-700 bg-gray-800"
            >
              <h2
                className={`mb-2 text-center text-lg font-bold ${
                  getStatusByName(statusName).color
                } p-2 text-white`}
              >
                {statusName}
              </h2>
              <div className="flex-1 overflow-auto p-2">
                {orders
                  .filter((order) => order.order_status?.name === statusName)
                  .map((order) => (
                    <div
                      key={order.orderid}
                      className={`mb-2 cursor-pointer rounded-lg border border-gray-600 bg-gray-700 p-3 shadow-md transition-all ${
                        expandedOrders[order.orderid] ? "h-48" : "h-24"
                      }`}
                      onClick={() => toggleCardExpansion(order.orderid)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold">
                            Order ID: {order.orderid}
                          </h3>
                          <p className="text-xs text-gray-400">
                            Table: {order.tableid || "N/A"}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {expandedOrders[order.orderid] && (
                        <div
                          className="mt-2 max-h-32 space-y-2 overflow-y-auto"
                          draggable={false}
                          onDragStart={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {order.notes && (
                            <div className="rounded bg-gray-600 p-2 shadow-inner">
                              <h4 className="text-xs font-bold text-teal-400">
                                Notes
                              </h4>
                              <p className="text-xs text-gray-300">
                                {order.notes}
                              </p>
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-teal-400">
                              Order Items
                            </h4>
                            <ul className="space-y-1">
                              {order.order_items?.map((item) => (
                                <li
                                  key={
                                    item.dish?.id
                                      ? `dish-${item.dish.id}`
                                      : `order-${order.orderid}-${item.name}`
                                  }
                                  className="flex justify-between rounded bg-gray-600 p-1"
                                >
                                  <span className="text-xs">
                                    {item.dish?.name || "Unknown Dish"}
                                  </span>
                                  <span className="text-xs">
                                    x{item.quantity}
                                  </span>
                                  <span className="text-xs">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-gray-800 p-6 text-center shadow-lg">
            <h2 className="text-xl font-bold text-red-500">Cancel Order</h2>
            <p className="mt-2 text-sm text-gray-300">
              Are you sure you want to cancel this order? This action will be
              reported to the customer.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                type="button"
                onClick={confirmCancel}
                className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600"
              >
                Yes, Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelOrderId(null);
                }}
                className="rounded-lg bg-gray-500 px-4 py-2 font-bold text-white transition hover:bg-gray-600"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

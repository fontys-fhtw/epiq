"use client";

import { getOrders } from "@src/queries/admin";
import { useCallback, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";

const ITEM_TYPE = "ORDER";
const statusFlow = [
  { id: 1, name: "Submitted", color: "bg-gray-500", short: "S" },
  { id: 2, name: "Preparing", color: "bg-blue-500", short: "P" },
  { id: 3, name: "Ready for Pickup", color: "bg-teal-500", short: "R" },
  { id: 4, name: "Completed", color: "bg-green-500", short: "C" },
  { id: 5, name: "Cancelled", color: "bg-red-500", short: "X" },
];

const getStatusByName = (name) =>
  statusFlow.find((status) => status.name === name);

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
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

  const updateOrderStatus = useCallback(
    async (orderId, newStatusName) => {
      const newStatus = getStatusByName(newStatusName);
      if (!newStatus) return;

      if (newStatus.name === "Cancelled") {
        setCancelOrderId(orderId);
        setShowCancelModal(true);
        return;
      }

      try {
        await fetch("/api/admin/order-status-update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderid: orderId, statusid: newStatus.id }),
        });
        fetchOrders();
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    },
    [fetchOrders],
  );

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

  function OrderCard({ order }) {
    const [{ isDragging }, dragRef] = useDrag(
      () => ({
        type: ITEM_TYPE,
        item: { orderId: order.orderid },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [order],
    );

    return (
      <div
        className={`relative max-h-48 overflow-auto rounded-lg border border-gray-600 bg-gray-700 p-2 shadow-md transition-all ${
          isDragging ? "opacity-90" : ""
        } mb-2 break-inside-avoid`}
        style={{
          userSelect: "none",
          transition: "transform 0.1s ease",
          transform: isDragging ? "scale(1.03)" : "scale(1)",
          boxShadow: isDragging ? "0 4px 10px rgba(0,0,0,0.4)" : "none",
          touchAction: "pan-y",
        }}
        onClick={(e) => {
          const clickedHandle = e.target.closest(".drag-handle");
          if (!clickedHandle) {
            toggleCardExpansion(order.orderid);
          }
        }}
      >
        <div className="relative h-5 w-full">
          {/* Time top-left */}
          <span className="absolute left-1 top-1 rounded bg-gray-700 px-1 text-xs text-gray-400">
            {new Date(order.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {/* Friendly table display with a clearer, bigger emoji */}
          <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded bg-gray-700 px-1 text-xs font-bold text-gray-300">
            <span
              style={{
                fontSize: "1.4em",
                lineHeight: "1em",
                verticalAlign: "middle",
              }}
            >
              🍱
            </span>
            {order.tableid || "N/A"}
          </span>
          {/* Drag handle placed at right-12 */}
          <span
            ref={dragRef}
            className="drag-handle absolute right-12 top-1 cursor-grab rounded bg-gray-700 px-1 text-xs text-gray-300 active:cursor-grabbing"
            style={{ userSelect: "none" }}
          >
            ≡
          </span>
          {/* Order ID top-right */}
          <span className="absolute right-1 top-1 rounded bg-gray-700 px-1 text-xs font-bold text-gray-300">
            #{order.orderid}
          </span>
        </div>

        <div
          className={`mt-2 max-h-32 space-y-1 overflow-y-auto ${
            expandedOrders[order.orderid] ? "" : ""
          }`}
          draggable={false}
          style={{ touchAction: "pan-y" }}
        >
          {order.notes && (
            <div className="rounded bg-gray-600 p-1 shadow-inner">
              <h4 className="text-xs font-bold text-teal-400">Notes</h4>
              <p className="text-xs text-gray-300">{order.notes}</p>
            </div>
          )}

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
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  function Column({
    status,
    orders,
    colSpanClass = "col-span-1",
    isPreparing = false,
  }) {
    if (status.name === "Completed" || status.name === "Cancelled") return null;

    const filteredOrders = orders.filter(
      (order) => order.order_status?.name === status.name,
    );

    const [{ isOver, canDrop }, dropRef] = useDrop(
      () => ({
        accept: ITEM_TYPE,
        drop: (item) => {
          const { orderId } = item;
          updateOrderStatus(orderId, status.name);
        },
        canDrop: () => true,
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [status, updateOrderStatus],
    );

    const dropHighlight = isOver
      ? canDrop
        ? "outline outline-2 outline-green-500"
        : "outline outline-2 outline-red-500"
      : "";

    const layoutClass = isPreparing ? "columns-2 gap-4" : "space-y-2";

    return (
      <div
        ref={dropRef}
        className={`${colSpanClass} flex h-full flex-col overflow-hidden bg-gray-800 ${dropHighlight} rounded-md`}
      >
        <h2
          className={`mb-2 text-center text-lg font-bold ${status.color} p-2 text-white`}
        >
          {status.name}
        </h2>
        <div
          className="flex-1 overflow-auto p-2"
          style={{ touchAction: "pan-y" }}
        >
          <div className={layoutClass}>
            {filteredOrders.map((order) => (
              <OrderCard key={order.orderid} order={order} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  function CompletedCancelledColumn({ statusName, orders }) {
    const filteredOrders = orders.filter(
      (order) => order.order_status?.name === statusName,
    );
    const columnStatus = getStatusByName(statusName);

    const [{ isOver, canDrop }, dropRef] = useDrop(
      () => ({
        accept: ITEM_TYPE,
        drop: (item) => {
          const { orderId } = item;
          updateOrderStatus(orderId, statusName);
        },
        canDrop: () => true,
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [statusName, updateOrderStatus],
    );

    const dropHighlight = isOver
      ? canDrop
        ? "outline outline-2 outline-green-500"
        : "outline outline-2 outline-red-500"
      : "";

    const lockedTitle = `${statusName} 🔒`;

    return (
      <div
        ref={dropRef}
        className={`flex flex-1 flex-col overflow-hidden border-b border-gray-700 bg-gray-800 ${dropHighlight} rounded-md`}
      >
        <h2
          className={`mb-2 text-center text-lg font-bold ${columnStatus.color} p-2 text-white`}
        >
          {lockedTitle}
        </h2>
        <div
          className="flex-1 space-y-2 overflow-auto p-2"
          style={{ touchAction: "pan-y" }}
        >
          {filteredOrders.map((order) => (
            <div
              key={order.orderid}
              onClick={() => toggleCardExpansion(order.orderid)}
              className={`relative cursor-pointer rounded-lg border border-gray-600 bg-gray-700 p-2 shadow-md transition-all ${
                expandedOrders[order.orderid]
                  ? "max-h-48 overflow-auto"
                  : "max-h-24 overflow-hidden"
              }`}
              style={{ userSelect: "none", touchAction: "pan-y" }}
            >
              <div className="relative h-5 w-full">
                <span className="absolute left-1 top-1 rounded bg-gray-700 px-1 text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {/* Friendly table display with new bigger emoji */}
                <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded bg-gray-700 px-1 text-xs font-bold text-gray-300">
                  <span
                    style={{
                      fontSize: "1.4em",
                      lineHeight: "1em",
                      verticalAlign: "middle",
                    }}
                  >
                    🍱
                  </span>
                  {order.tableid || "N/A"}
                </span>
                {/* Drag handle at right-12 */}
                <span
                  className="drag-handle absolute right-12 top-1 cursor-grab rounded bg-gray-700 px-1 text-xs text-gray-300 active:cursor-grabbing"
                  style={{ userSelect: "none" }}
                >
                  ≡
                </span>
                <span className="absolute right-1 top-1 rounded bg-gray-700 px-1 text-xs font-bold text-gray-300">
                  #{order.orderid}
                </span>
              </div>

              {expandedOrders[order.orderid] && (
                <div
                  className="mt-2 max-h-32 space-y-1 overflow-y-auto"
                  draggable={false}
                  onClick={(e) => e.stopPropagation()}
                  style={{ touchAction: "pan-y" }}
                >
                  {order.notes && (
                    <div className="rounded bg-gray-600 p-1 shadow-inner">
                      <h4 className="text-xs font-bold text-teal-400">Notes</h4>
                      <p className="text-xs text-gray-300">{order.notes}</p>
                    </div>
                  )}
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
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full select-none overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="flex select-none items-center justify-center space-x-1 border-b border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-200">
        {statusFlow.slice(0, 3).map((s, i) => (
          <div key={s.id} className="flex items-center space-x-1">
            <span
              className={`inline-block size-2 rounded-full ${s.color}`}
              title={s.name}
            />
            <span title={s.name}>{s.short}</span>
            {i < 2 && <span className="text-gray-500">→</span>}
          </div>
        ))}
        <span className="text-gray-500">→</span>
        <div className="flex items-center space-x-1">
          <span
            className={`inline-block size-2 rounded-full ${statusFlow[3].color}`}
            title="Completed"
          />
          <span title="Completed">{statusFlow[3].short}</span>
        </div>
        <span className="text-gray-500">/</span>
        <div className="flex items-center space-x-1">
          <span
            className={`inline-block size-2 rounded-full ${statusFlow[4].color}`}
            title="Cancelled"
          />
          <span title="Cancelled">{statusFlow[4].short}</span>
        </div>

        <span className="mx-2 text-gray-500">|</span>
        <span className="text-gray-300" title="Drag Handle Icon">
          ≡
        </span>
        <span
          className="text-gray-400"
          title="Drag orders to update their status"
        >
          Drag to move
        </span>
      </div>

      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <div className="grid h-[calc(100%-3rem)] grid-cols-12 gap-2 p-2">
          {statusFlow
            .filter((status) => status.name === "Submitted")
            .map((status) => (
              <Column
                key={status.id}
                status={status}
                orders={orders}
                colSpanClass="col-span-2 border-r border-gray-700"
              />
            ))}

          {statusFlow
            .filter((status) => status.name === "Preparing")
            .map((status) => (
              <Column
                key={status.id}
                status={status}
                orders={orders}
                colSpanClass="col-span-5 border-r border-gray-700"
                isPreparing
              />
            ))}

          {statusFlow
            .filter((status) => status.name === "Ready for Pickup")
            .map((status) => (
              <Column
                key={status.id}
                status={status}
                orders={orders}
                colSpanClass="col-span-2 border-r border-gray-700"
              />
            ))}

          <div className="col-span-3 flex h-full flex-col overflow-hidden">
            {["Completed", "Cancelled"].map((statusName) => (
              <CompletedCancelledColumn
                key={statusName}
                statusName={statusName}
                orders={orders}
              />
            ))}
          </div>
        </div>
      </DndProvider>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="rounded-lg bg-gray-800 p-6 text-center shadow-lg">
            <h2 className="text-xl font-bold text-red-500">Cancel Order</h2>
            <p className="mt-2 text-sm text-gray-300">
              Are you sure you want to cancel this order?
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

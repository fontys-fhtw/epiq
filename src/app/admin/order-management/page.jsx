"use client";

import CancelModal from "@src/components/admin/management/order/CancelModal";
import Column from "@src/components/admin/management/order/Column";
import CompletedCancelledColumn from "@src/components/admin/management/order/CompletedCancelledColumn";
import OrderManagementHeader from "@src/components/admin/management/order/OrderManagementHeader";
import { getStatusByName, STATUS_FLOW } from "@src/constants";
import { getOrders } from "@src/queries/admin";
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
        const response = await fetch("/api/admin/order-status-update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderid: orderId, statusid: newStatus.id }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        await fetchOrders();
      } catch (_error) {
        console.error("Error updating order status:", _error);
        alert("Failed to update order status. Please try again.");
      }
    },
    [fetchOrders],
  );

  const confirmCancel = useCallback(async () => {
    if (!cancelOrderId) return;

    try {
      const response = await fetch("/api/admin/order-status-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderid: cancelOrderId,
          statusid: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await fetchOrders();
    } catch (_error) {
      console.error("Error canceling order:", _error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setShowCancelModal(false);
      setCancelOrderId(null);
    }
  }, [cancelOrderId, fetchOrders]);

  const handleCancelModalClose = useCallback(() => {
    setShowCancelModal(false);
    setCancelOrderId(null);
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full select-none overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p>Loading...</p>
        </div>
      )}

      <OrderManagementHeader />

      {/* Drag and Drop Provider */}
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <div className="grid h-[calc(100%-3rem)] grid-cols-12 gap-2 p-2">
          {STATUS_FLOW.filter((status) => status.name === "Submitted").map(
            (status) => (
              <Column
                key={status.id}
                status={status}
                orders={orders}
                updateOrderStatus={updateOrderStatus}
                colSpanClass="col-span-2 border-r border-gray-700"
              />
            ),
          )}

          {STATUS_FLOW.filter((status) => status.name === "Preparing").map(
            (status) => (
              <Column
                key={status.id}
                status={status}
                orders={orders}
                updateOrderStatus={updateOrderStatus}
                colSpanClass="col-span-5 border-r border-gray-700"
                isPreparing
              />
            ),
          )}

          {STATUS_FLOW.filter(
            (status) => status.name === "Ready for Pickup",
          ).map((status) => (
            <Column
              key={status.id}
              status={status}
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              colSpanClass="col-span-2 border-r border-gray-700"
            />
          ))}

          <div className="col-span-3 flex h-full flex-col overflow-hidden">
            {["Completed", "Cancelled"].map((statusName) => (
              <CompletedCancelledColumn
                key={statusName}
                statusName={statusName}
                orders={orders}
                updateOrderStatus={updateOrderStatus}
              />
            ))}
          </div>
        </div>
      </DndProvider>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <CancelModal
          onConfirm={confirmCancel}
          onCancel={handleCancelModalClose}
        />
      )}
    </div>
  );
}

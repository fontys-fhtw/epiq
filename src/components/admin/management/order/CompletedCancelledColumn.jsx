"use client";

import { getStatusByName } from "@src/constants";
import { memo } from "react";
import { useDrop } from "react-dnd";

import OrderCard from "./OrderCard";

const ITEM_TYPE = "ORDER";

const CompletedCancelledColumn = memo(function CompletedCancelledColumn({
  statusName,
  orders,
  updateOrderStatus,
}) {
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
      <div className="flex-1 space-y-2 overflow-auto p-2">
        {filteredOrders.map((order) => (
          <OrderCard key={order.orderid} order={order} isExpandable />
        ))}
      </div>
    </div>
  );
});

export default CompletedCancelledColumn;

"use client";

import { memo } from "react";
import { useDrop } from "react-dnd";

import OrderCard from "./OrderCard";

const ITEM_TYPE = "ORDER";

const Column = memo(function Column({
  status,
  orders,
  updateOrderStatus,
  colSpanClass = "col-span-1",
  isPreparing = false,
}) {
  if (status.name === "Completed" || status.name === "Cancelled") return null;

  const filteredOrders = orders.filter(
    (order) => order.order_status?.name === status.name,
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
    [status.name, updateOrderStatus],
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
      <div className="flex-1 overflow-auto p-2">
        <div className={layoutClass}>
          {filteredOrders.map((order) => (
            <OrderCard key={order.orderid} order={order} isExpandable={false} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Column;

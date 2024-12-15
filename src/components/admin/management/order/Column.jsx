"use client";

import {
  ORDER_STATUS_ID_TO_COLOR,
  ORDER_STATUS_ID_TO_TEXT,
} from "@src/constants";
import { memo } from "react";
import { useDrop } from "react-dnd";

import OrderCard from "./OrderCard";

const ITEM_TYPE = "ORDER";

const Column = memo(function Column({
  statusId,
  orders,
  updateOrderStatus,
  colSpanClass = "col-span-1",
  layoutClass = "space-y-2",
}) {
  const filteredOrders = orders.filter(
    (order) => order.orderStatusId === statusId,
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      drop: (item) => {
        const { orderId } = item;
        updateOrderStatus(orderId, statusId);
      },
      canDrop: () => true,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [updateOrderStatus],
  );

  const dropHighlight = isOver
    ? canDrop
      ? "outline outline-2 outline-green-500"
      : "outline outline-2 outline-red-500"
    : "";

  return (
    <div
      ref={dropRef}
      className={`${colSpanClass} flex h-full flex-col overflow-hidden bg-gray-800 ${dropHighlight} rounded-md`}
    >
      <h2
        className={`mb-2 text-center text-lg font-bold ${ORDER_STATUS_ID_TO_COLOR[statusId]} p-2 text-white`}
      >
        {ORDER_STATUS_ID_TO_TEXT[statusId]}
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

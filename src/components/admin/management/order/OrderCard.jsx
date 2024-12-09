"use client";

import { memo, useState } from "react";
import { useDrag } from "react-dnd";

const ITEM_TYPE = "ORDER";

const OrderCard = memo(function OrderCard({ order, isExpandable }) {
  const [isExpanded, setIsExpanded] = useState(!isExpandable);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: { orderId: order.orderid },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [order.orderid],
  );

  const handleOnClick = () => {
    if (isExpandable) {
      setIsExpanded((prev) => !prev);
    }
  };

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
      onClick={handleOnClick}
    >
      <div className="relative h-5 w-full">
        {/* Time top-left */}
        <span className="absolute left-1 top-1 rounded bg-gray-700 px-1 text-xs text-gray-400">
          {new Date(order.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {/* Table Display */}
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
        {/* Drag Handle */}
        <span
          ref={dragRef}
          className="drag-handle absolute right-12 top-1 cursor-grab rounded bg-gray-700 px-1 text-xs text-gray-300 active:cursor-grabbing"
          style={{ userSelect: "none" }}
        >
          ≡
        </span>
        {/* Order ID */}
        <span className="absolute right-1 top-1 rounded bg-gray-700 px-1 text-xs font-bold text-gray-300">
          #{order.orderid}
        </span>
      </div>

      {isExpanded ? (
        <>
          {order.notes && (
            <div className="mt-2 rounded bg-gray-600 p-1 shadow-inner">
              <h4 className="text-xs font-bold text-teal-400">Notes</h4>
              <p className="text-xs text-gray-300">{order.notes}</p>
            </div>
          )}

          <ul className="mt-2 space-y-1">
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
        </>
      ) : null}
    </div>
  );
});

export default OrderCard;

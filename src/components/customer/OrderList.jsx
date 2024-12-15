import React from "react";

import OrderCard from "./OrderCard";

const OrderList = ({ orders }) => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4">
      {orders.map((order) => (
        <OrderCard key={order.orderid} order={order} />
      ))}
    </div>
  );
};

export default OrderList;

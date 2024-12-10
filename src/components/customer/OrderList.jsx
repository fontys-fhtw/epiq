import React from "react";

import OrderCard from "./OrderCard";

const OrderList = ({ orders }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.orderid} order={order} />
      ))}
    </div>
  );
};

export default OrderList;

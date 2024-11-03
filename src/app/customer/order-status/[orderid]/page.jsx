"use client";

import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ORDER_STATUS_MAP = {
  1: "Submitted",
  2: "In Progress",
  3: "Completed",
  4: "Cancelled",
};

const getStatusBadgeClass = (statusId) => {
  switch (statusId) {
    case 1:
      return "bg-yellow-100 text-yellow-800";
    case 2:
      return "bg-blue-100 text-blue-800";
    case 3:
      return "bg-green-100 text-green-800";
    case 4:
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
};

export default function OrderStatusPage() {
  const params = useParams();
  const { orderid } = params;
  const supabase = createSupabaseBrowserClient();

  const fetchOrder = async () => {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("orderid", orderid)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(
        `
        *,
        dish: dishid (
          name,
          price
        )
      `,
      )
      .eq("orderid", orderid);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    return { order, items };
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["order", orderid],
    queryFn: fetchOrder,
    enabled: !!orderid,
  });

  if (isLoading) return <div className="mt-8 text-center">Loading...</div>;
  if (error)
    return (
      <div className="mt-8 text-center text-red-500">
        Error loading order: {error.message}
      </div>
    );

  const { order, items } = data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Order Status</h1>
      <div className="rounded bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Order ID: {orderid}</p>
            <p className="text-gray-600">
              Date: {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(
                order.statusid,
              )}`}
            >
              {ORDER_STATUS_MAP[order.statusid]}
            </span>
          </div>
        </div>
        <h2 className="mb-4 text-2xl font-semibold">Order Items</h2>
        <table className="min-w-full border bg-white">
          <thead>
            <tr>
              <th className="border-b py-2">Item</th>
              <th className="border-b py-2">Price</th>
              <th className="border-b py-2">Quantity</th>
              <th className="border-b py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.orderitemid} className="text-center">
                <td className="border-b py-2">{item.dish.name}</td>
                <td className="border-b py-2">${item.dish.price.toFixed(2)}</td>
                <td className="border-b py-2">{item.quantity}</td>
                <td className="border-b py-2">
                  ${(item.dish.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-right">
          <p className="text-xl font-semibold">
            Total: $
            {items
              .reduce((sum, item) => sum + item.dish.price * item.quantity, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

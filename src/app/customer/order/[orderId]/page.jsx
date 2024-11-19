"use client";

import Card from "@src/components/common/Card";
import Heading from "@src/components/common/Heading";
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
  const { orderId } = useParams();
  const supabase = createSupabaseBrowserClient();

  const fetchOrder = async () => {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("orderid", orderId)
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
      .eq("orderid", orderId);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    return { order, items };
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: fetchOrder,
    enabled: !!orderId,
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
      <Heading level={1} className="mb-6 text-center text-3xl">
        Order Status
      </Heading>
      <Card className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-white shadow">
        <div className="mb-6 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div>
            <p className="text-lg font-semibold">Order ID: {orderId}</p>
            <p className="text-gray-400">
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
        <Heading level={2} className="mb-4 text-2xl">
          Order Items
        </Heading>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white">
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
                  <td className="border-b py-2">
                    ${item.dish.price.toFixed(2)}
                  </td>
                  <td className="border-b py-2">{item.quantity}</td>
                  <td className="border-b py-2">
                    ${(item.dish.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <p className="text-xl font-semibold">
            Total: $
            {items
              .reduce((sum, item) => sum + item.dish.price * item.quantity, 0)
              .toFixed(2)}
          </p>
        </div>
      </Card>
    </div>
  );
}

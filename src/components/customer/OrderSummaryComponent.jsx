"use client";

import { ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import { getOrderItems, getOrderStatus } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useParams } from "next/navigation";

import ActionButton from "../common/ActionButton";

const HEADERS = [
  { key: "name", label: "Name" },
  { key: "quantity", label: "№" },
  { key: "price", label: "Price" },
];

export default function OrderSummaryComponent() {
  const { orderId } = useParams();
  const supabase = createSupabaseBrowserClient();

  const { data: orderItems } = useSupabaseQuery(
    getOrderItems(supabase, orderId),
  );

  const { data: orderStatus } = useSupabaseQuery(
    getOrderStatus(supabase, orderId),
  );

  const isOrderPaid = orderStatus?.status > 1;

  const calculateGrandTotal = () => {
    return orderItems
      ?.reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleOnClickPayment = () => {
    alert("Payment successful!");
  };

  return (
    <div className="flex flex-col items-center gap-8 py-14">
      <div className="w-full max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Your Order Summary
          <span className="text-gray-200"> #{orderId}</span>
        </h1>
        <p className="text-base text-gray-300">
          {isOrderPaid
            ? "Track the status of your order below."
            : "Review your items and proceed to payment."}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex w-full max-w-4xl flex-col gap-4 rounded-lg bg-dark p-6 shadow-lg">
        {/* Order Items Table */}
        <div className="overflow-auto">
          <table className="w-full table-auto text-white">
            <thead>
              <tr className="border-b border-brown text-lg font-semibold">
                {HEADERS.map((header) => (
                  <th key={header.key} className="p-4 pb-2 text-left">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-base">
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-4">{item.dish.name}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4 text-gray-200">
                    ${item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pay Now Button */}
        {!isOrderPaid ? (
          <div className="flex w-full justify-center">
            <ActionButton
              onClick={handleOnClickPayment}
              className="w-full rounded-lg text-xl"
              disabled={isOrderPaid}
            >
              Pay $
              <span className="font-semibold">{calculateGrandTotal()}</span>
            </ActionButton>
          </div>
        ) : (
          <div className="rounded-lg bg-brown p-4">
            <ul className="list-none text-lg">
              <li className="border-b border-dark">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(orderStatus.created_at).toDateString()}
              </li>
              <li className="border-b border-dark pt-2">
                <span className="font-semibold">Status:</span>{" "}
                {ORDER_STATUS_ID_TO_TEXT[orderStatus.statusid]}
              </li>
              <li className="pt-2">
                <span className="font-semibold">Total:</span> $
                {calculateGrandTotal()}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

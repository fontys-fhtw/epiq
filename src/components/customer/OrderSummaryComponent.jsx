"use client";

import { ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import { getOrderItems, getOrderStatus, payOrder } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ActionButton from "../common/ActionButton";

const HEADERS = [
  { key: "name", label: "Name" },
  { key: "quantity", label: "№" },
  { key: "price", label: "Price" },
];

export default function OrderSummaryComponent() {
  const { orderId } = useParams();
  const supabase = createSupabaseBrowserClient();
  const [isOrderPaid, setIsOrderPaid] = useState(null);

  const {
    data: orderItems,
    error: orderItemsError,
    isLoading: isLoadingOrderItems,
  } = useSupabaseQuery(getOrderItems(supabase, orderId));

  const {
    data: orderStatus,
    error: orderStatusError,
    refetch: refetchOrderStatus,
    isLoading: isLoadingOrderStatus,
  } = useSupabaseQuery(getOrderStatus(supabase, orderId));

  const { mutate: mutatePayment, isLoading: isLoadingPayment } = useMutation({
    mutationFn: async () => {
      await payOrder(supabase, orderId);
    },
    onSuccess: async () => {
      await refetchOrderStatus();
      alert("Payment successful!");
    },
  });

  useEffect(() => {
    setIsOrderPaid(orderStatus?.statusid && orderStatus.statusid < 6);
  }, [orderStatus]);

  const calculateGrandTotal = () => {
    return orderItems
      ?.reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  if (orderItemsError || orderStatusError) {
    return (
      <p className="text-center text-red-500">
        An error occurred while fetching order details.
      </p>
    );
  }

  const isLoading =
    isLoadingOrderItems || isLoadingOrderStatus || isLoadingPayment;

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-darkBg bg-opacity-50">
          <p className="text-white">Loading...</p>
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Your Order Summary
          <span className="text-gray-200"> #{orderId}</span>
        </h1>
        {isOrderPaid !== null && (
          <p className="text-base text-gray-300">
            {isOrderPaid
              ? "Track the status of your order below."
              : "Review your items and proceed to payment."}
          </p>
        )}
      </div>

      {/* Main Content */}
      {isOrderPaid !== null && (
        <div className="flex w-full max-w-4xl flex-col gap-4 rounded-lg bg-dark p-6 shadow-lg shadow-dark">
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
                onClick={mutatePayment}
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
      )}
    </div>
  );
}

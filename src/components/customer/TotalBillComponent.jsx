"use client";

import { getOrderItems } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useRouter, useSearchParams } from "next/navigation";

import ActionButton from "../common/ActionButton";

const HEADERS = [
  { key: "name", label: "Name" },
  { key: "quantity", label: "№" },
  { key: "price", label: "Price" },
];

export default function TotalBillComponent() {
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const { data: orderItems } = useSupabaseQuery(
    getOrderItems(supabase, searchParams.get("orderId")),
  );

  const calculateGrandTotal = () => {
    return orderItems
      ?.reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleOnClickPayment = () => {
    alert("Payment successful!");
    router.push(`/customer/order/${searchParams.get("orderId")}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 py-14">
      {/* Header */}
      <div className="w-full max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Your Order Summary
        </h1>
        <p className="text-base text-gray-300">
          Review your items and proceed to payment.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex w-full max-w-4xl flex-col gap-8 rounded-lg bg-dark p-6 shadow-lg">
        {/* Order Items Table */}
        <div className="overflow-auto">
          <table className="w-full table-auto text-white">
            <thead>
              <tr className="border-b border-brown text-lg font-semibold">
                {HEADERS.map((header) => (
                  <th key={header.key} className="p-4 text-left">
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
                  <td className="p-4 text-gray-300">
                    ${item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pay Now Button */}
        <div className="flex w-full justify-center">
          <ActionButton
            onClick={handleOnClickPayment}
            className="w-full rounded-lg text-xl"
          >
            Pay $<span className="font-semibold">{calculateGrandTotal()}</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

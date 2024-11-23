"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { getOrderItems } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function BillPage() {
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    data: items,
    isLoading,
    error,
  } = useSupabaseQuery(getOrderItems(supabase, searchParams.get("orderId")));

  const calculateGrandTotal = () => {
    return (items || [])
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePayment = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      router.push(`/customer/order/${searchParams.get("orderId")}`);
    }, 3000);
  };

  return (
    <div className="mt-20 flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-gray-900 to-gray-800 px-4 text-white">
      <header className="my-12 text-center">
        <h1 className="bg-gradient-to-r from-blue-400 to-teal-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl">
          Your Order Summary
        </h1>
      </header>

      <main className="w-full max-w-4xl space-y-6 rounded-2xl bg-gray-900 p-8 shadow-lg">
        <div className="max-h-96 overflow-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="w-1/2 p-4 text-sm font-semibold sm:text-base md:px-6 md:text-lg">
                  Item
                </th>
                <th className="w-1/4 p-4 text-sm font-semibold sm:text-base md:px-6 md:text-lg">
                  Amount
                </th>
                <th className="w-1/4 p-4 text-sm font-semibold sm:text-base md:px-6 md:text-lg">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map((item, index) => (
                <tr
                  key={`${item.name}-${item.quantity}`}
                  className={`border-b border-gray-700 ${
                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                  } transition hover:bg-gray-600`}
                >
                  <td className="p-4 text-sm sm:text-base md:px-6 md:text-lg">
                    {item.dish.name}
                  </td>
                  <td className="p-4 text-sm sm:text-base md:px-6 md:text-lg">
                    {item.quantity}
                  </td>
                  <td className="p-4 text-sm sm:text-base md:px-6 md:text-lg">
                    ${item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 p-4 text-lg font-bold shadow-md">
          <span>Total Amount</span>
          <span className="text-2xl font-extrabold">
            ${calculateGrandTotal()}
          </span>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handlePayment}
            className="relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 px-10 py-5 text-lg font-bold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-teal-600"
          >
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-teal-600 opacity-20" />
            <span className="relative">Pay Now</span>
          </button>
        </div>
      </main>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="relative flex flex-col items-center rounded-lg bg-gray-800 p-8 shadow-xl">
            <CheckCircleIcon className="size-16 text-green-500" />
            <h2 className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-3xl font-bold text-transparent">
              Payment Successful!
            </h2>
            <p className="mt-2 text-lg text-gray-300">
              Thank you for your purchase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

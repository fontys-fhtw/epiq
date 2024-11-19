"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from "@src/components/common/Button";
import Heading from "@src/components/common/Heading";
import Modal from "@src/components/common/Modal";
import { getOrderItems } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import classNames from "classnames";
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
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-gray-900 to-gray-800 px-4 text-white">
      {/* Header */}
      <header className="my-12 text-center">
        <Heading
          level={1}
          className="bg-gradient-to-r from-blue-400 to-teal-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl"
        >
          Your Order Summary
        </Heading>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl space-y-6 rounded-2xl bg-gray-900 p-8 shadow-lg">
        {/* Order Items Table */}
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
              {items?.map((item, index) => (
                <tr
                  key={`${item.name}-${item.quantity}`}
                  className={classNames(
                    "border-b border-gray-700",
                    {
                      "bg-gray-800": index % 2 === 0,
                      "bg-gray-700": index % 2 !== 0,
                    },
                    "transition hover:bg-gray-600",
                  )}
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

        {/* Total Amount */}
        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 p-4 text-lg font-bold shadow-md">
          <span>Total Amount</span>
          <span className="text-2xl font-extrabold">
            ${calculateGrandTotal()}
          </span>
        </div>

        {/* Pay Now Button */}
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            onClick={() => {
              handlePayment();
              setShowConfirmation(true);
            }}
            variant="primary"
            className="relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 px-10 py-5 text-lg font-bold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-teal-600"
          >
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-teal-600 opacity-20" />
            <span className="relative">Pay Now</span>
          </Button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <Modal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          title="Payment Successful!"
        >
          <div className="flex flex-col items-center space-y-4">
            <CheckCircleIcon className="size-16 text-green-500" />
            <Heading level={2} className="text-3xl text-white">
              Payment Successful!
            </Heading>
            <p className="text-lg text-gray-300">
              Thank you for your purchase.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

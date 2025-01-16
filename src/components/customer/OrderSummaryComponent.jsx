"use client";

import { ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import {
  deductUserCredits,
  getCustomerSession,
  getOrderItems,
  getOrderStatus,
  getUserCredits,
  payOrder,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import ActionButton from "../common/ActionButton";
import Spinner from "../common/Spinner";

const HEADERS = [
  { key: "name", label: "Name" },
  { key: "quantity", label: "№" },
  { key: "price", label: "Price" },
];

export default function OrderSummaryComponent() {
  const { orderId } = useParams();
  const supabase = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  // State
  const [isOrderPaid, setIsOrderPaid] = useState(null);
  const [isCreditsApplied, setCreditsApplied] = useState(false);
  const [appliedCredits, setAppliedCredits] = useState(0);

  // Queries
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ["customer-session"],
    queryFn: () => getCustomerSession(supabase),
  });
  const userId = sessionData?.data?.session?.user?.id;

  const {
    data: userCreditsData,
    isLoading: isCreditsLoading,
    error: creditsError,
  } = useQuery({
    queryKey: ["user-credits", userId],
    queryFn: () => getUserCredits(supabase, userId),
    enabled: !!userId,
  });
  const availableCredits = userCreditsData?.data?.available_credit || 0;

  const {
    data: orderItems,
    isError: orderItemsError,
    isLoading: isLoadingOrderItems,
  } = useSupabaseQuery(getOrderItems(supabase, orderId));

  const {
    data: orderStatus,
    isError: orderStatusError,
    refetch: refetchOrderStatus,
    isLoading: isLoadingOrderStatus,
  } = useSupabaseQuery(getOrderStatus(supabase, orderId));

  const {
    mutate: mutatePayment,
    isLoading: isLoadingPayment,
    isError: paymentError,
  } = useMutation({
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

  const orderTotal = useMemo(() => {
    return (
      orderItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
      0
    );
  }, [orderItems]);

  const orderGrandTotal = useMemo(() => {
    const res = isCreditsApplied
      ? Math.max(0, orderTotal - appliedCredits)
      : orderTotal;
    return res.toFixed(2);
  }, [orderTotal, isCreditsApplied, appliedCredits]);

  const handleApplyCredits = useCallback(() => {
    if (isCreditsApplied) {
      // Reset credits
      setCreditsApplied(false);
      setAppliedCredits(0);
    } else {
      // Apply credits up to the total amount
      const creditsToApply = Math.min(orderTotal, availableCredits);
      setCreditsApplied(true);
      setAppliedCredits(creditsToApply);
    }
  }, [isCreditsApplied, orderTotal, availableCredits]);

  // Mutation for deducting credits
  const {
    mutate: mutateApplyCredits,
    isLoading: isLoadingApplyCredits,
    isError: isApplyCreditsError,
  } = useMutation({
    mutationFn: ({ amount }) => deductUserCredits(supabase, { userId, amount }),
    onSuccess: () => {
      // Invalidate and refetch user credits
      queryClient.invalidateQueries(["user-credits", userId]);
      alert("Credits applied!");
    },
    onError: (error) => {
      console.error("Error deducting credits:", error);
      alert("Failed to deduct credits. Please try again.");
    },
  });

  const handleOnClickPayment = useCallback(async () => {
    if (appliedCredits > 0) {
      mutateApplyCredits({ amount: appliedCredits });
      setCreditsApplied(false);
      setAppliedCredits(0);
    }

    mutatePayment();
  }, [appliedCredits, mutateApplyCredits, mutatePayment]);

  // Handle error states
  if (
    sessionError ||
    creditsError ||
    orderItemsError ||
    orderStatusError ||
    paymentError ||
    isApplyCreditsError
  ) {
    return (
      <div className="text-center text-red-500">
        An error occurred while fetching data. Please try again later.
      </div>
    );
  }

  const isLoading =
    isSessionLoading ||
    isCreditsLoading ||
    isLoadingOrderItems ||
    isLoadingOrderStatus ||
    isLoadingPayment ||
    isLoadingApplyCredits;

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-darkBg/50">
          <Spinner />
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
                    <td className="px-4 py-2">{item.dish.name}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2 text-gray-200">
                      ${item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Section */}
          {!isOrderPaid ? (
            <div className="flex flex-col gap-4">
              {/* Display Credits */}
              <div className="flex items-center justify-between text-white">
                {/* Credit Info */}
                <div className="flex flex-col">
                  <span className="text-sm">
                    Credits: ${availableCredits.toFixed(2)}
                  </span>
                  {appliedCredits > 0 && (
                    <div>
                      <span className="text-sm">
                        Applied: ${appliedCredits.toFixed(2)}
                      </span>
                      <br />
                      <span className="text-sm">
                        Credits Left: $
                        {(availableCredits - appliedCredits).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Apply/Remove Credits Button */}
                <ActionButton
                  onClick={handleApplyCredits}
                  disabled={isLoading || availableCredits === 0}
                  className="rounded-lg text-sm"
                >
                  {isCreditsApplied ? "Remove Credits" : "Apply Credits"}
                </ActionButton>
              </div>

              {/* Pay Now Button */}
              <div className="flex w-full justify-center">
                <ActionButton
                  onClick={handleOnClickPayment}
                  className="w-full rounded-lg text-xl"
                  disabled={isLoading || orderTotal === 0}
                >
                  Pay $<span className="font-semibold">{orderGrandTotal}</span>
                </ActionButton>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-brown p-4">
              <ul className="list-none text-lg">
                <li className="border-b border-dark">
                  <span className="font-semibold">Date:</span>{" "}
                  {orderStatus?.created_at
                    ? new Date(orderStatus.created_at).toDateString()
                    : "N/A"}
                </li>
                <li className="border-b border-dark pt-2">
                  <span className="font-semibold">Status:</span>{" "}
                  {ORDER_STATUS_ID_TO_TEXT[orderStatus?.statusid] || "Unknown"}
                </li>
                <li className="pt-2">
                  <span className="font-semibold">Total:</span> $
                  {orderGrandTotal}
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

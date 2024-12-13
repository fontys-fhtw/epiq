"use client";

import OrderList from "@src/components/customer/OrderList";
import { getCustomerSession, getOrderHistory } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery } from "@tanstack/react-query";

export default function OrdersListPage() {
  const supabase = createSupabaseBrowserClient();

  const {
    data: sessionData,
    error: sessionError,
    isLoading: isLoadingSession,
  } = useQuery({
    queryKey: ["user-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  const userId = sessionData?.data?.session?.user?.id;

  const {
    data: orders,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["order-history", userId],
    queryFn: () => getOrderHistory(supabase, userId),
    enabled: !!userId,
  });

  if (ordersError || sessionError) {
    return <div className="text-red-500">Error loading orders.</div>;
  }

  const isLoading = isLoadingSession || isLoadingOrders;

  return (
    <div className="flex h-full min-h-[calc(100vh-5rem)] flex-col items-center justify-start gap-8 py-8">
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black bg-opacity-50">
          <p className="text-white">Loading...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex w-full items-center justify-start">
        <h1 className="text-4xl font-bold text-gray-200">Your Orders</h1>
      </div>

      {orders?.length > 0 ? (
        <OrderList orders={orders} />
      ) : (
        <p className="text-white">No orders found.</p>
      )}
    </div>
  );
}

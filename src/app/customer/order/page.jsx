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
    return <div>Error loading orders.</div>;
  }

  const isLoading = isLoadingSession || isLoadingOrders;

  return (
    <div className="p-4">
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black bg-opacity-50">
          <p className="text-white">Loading...</p>
        </div>
      )}
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      {orders?.length > 0 ? (
        <OrderList orders={orders} />
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

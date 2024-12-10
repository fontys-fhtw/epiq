"use client";

import OrderList from "@src/components/customer/OrderList";
import { getOrderHistory } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const MyOrdersPage = () => {
  const supabase = createSupabaseBrowserClient();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUserId(data.user.id);
        console.log("Authenticated user ID:", data.user.id);
      }
    };

    fetchUser();
  }, [supabase]);

  const {
    data: orders,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["order-history", userId],
    queryFn: () => getOrderHistory(supabase, userId),
    enabled: !!userId,
  });

  if (!userId) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">My Orders</h1>
        <p>Loading user information...</p>
      </div>
    );
  }

  if (isLoadingOrders) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Orders</h1>
        <p>Error loading orders: {ordersError.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      {orders && orders.length > 0 ? (
        <OrderList orders={orders} />
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrdersPage;

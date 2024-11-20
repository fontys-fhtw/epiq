// This file is already a Server Component by default
import Admin from "@src/components/admin/Admin";
import { getOrders, getReservations } from "@src/queries/admin";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function AdminPage() {
  const queryClient = new QueryClient();

  // Prefetch orders
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // Prefetch reservations
  await queryClient.prefetchQuery({
    queryKey: ["reservations"],
    queryFn: getReservations,
  });

  return (
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <div className="w-full p-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* Client Admin component */}
        <Admin />
      </HydrationBoundary>
    </div>
  );
}

import OrderSummaryComponent from "@src/components/customer/OrderSummaryComponent";
import { getOrderItems, getOrderStatus } from "@src/queries/customer";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { prefetchQuery as prefetchSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function OrderSummaryPage({ params }) {
  const queryClient = new QueryClient();
  const supabase = createSupabaseServerClient();

  // Extract the orderId from searchParams
  const orderId = params?.orderId;

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  // Prefetch data using the extracted orderId
  const orderItemsQuery = prefetchSupabaseQuery(
    queryClient,
    getOrderItems(supabase, orderId),
  );

  const orderStatusQuery = prefetchSupabaseQuery(
    queryClient,
    getOrderStatus(supabase, orderId),
  );

  await Promise.all([orderItemsQuery, orderStatusQuery]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderSummaryComponent />
    </HydrationBoundary>
  );
}

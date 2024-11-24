import TotalBillComponent from "@src/components/customer/TotalBillComponent";
import { getOrderItems } from "@src/queries/customer";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { prefetchQuery as prefetchSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function TotalBillPage({ searchParams }) {
  const queryClient = new QueryClient();
  const supabase = createSupabaseServerClient();

  // Extract the orderId from searchParams
  const orderId = searchParams?.orderId;

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  // Prefetch data using the extracted orderId
  const totalBillQuery = prefetchSupabaseQuery(
    queryClient,
    getOrderItems(supabase, orderId),
  );

  await Promise.all([totalBillQuery]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TotalBillComponent />
    </HydrationBoundary>
  );
}

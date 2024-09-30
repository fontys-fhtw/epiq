import RestaurantMenu from "@src/components/customer/RestaurantMenu";
import Suggestions from "@src/components/customer/Suggestions";
import { getRestaurantMenu } from "@src/queries/customer";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function RestaurantMenuPage() {
  const queryClient = new QueryClient();
  const supabase = createSupabaseServerClient();

  // Data is prefetched on the server and will be available immediately on client
  await prefetchQuery(queryClient, getRestaurantMenu(supabase));

  return (
    <div className="p-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RestaurantMenu />
        <Suggestions />
      </HydrationBoundary>
    </div>
  );
}

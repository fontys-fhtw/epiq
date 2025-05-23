import RestaurantMenu from "@src/components/customer/RestaurantMenu";
import { getGPTSuggestions, getRestaurantMenu } from "@src/queries/customer";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { prefetchQuery as prefetchSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function RestaurantMenuPage() {
  const queryClient = new QueryClient();
  const supabase = createSupabaseServerClient();

  // Data is prefetched on the server and will be available immediately on client
  const suggestionsQuery = queryClient.prefetchQuery({
    queryKey: ["suggestions"],
    queryFn: getGPTSuggestions,
  });

  const menuQuery = prefetchSupabaseQuery(
    queryClient,
    getRestaurantMenu(supabase),
  );

  await Promise.all([suggestionsQuery, menuQuery]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RestaurantMenu />
    </HydrationBoundary>
  );
}

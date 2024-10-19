import RestaurantMenu from "@src/components/customer/RestaurantMenu";
import { getGPTSuggestions, getRestaurantMenu } from "@src/queries/customer";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { prefetchQuery as prefetchSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const mockRestaurantId = 1;

export default async function RestaurantMenuPage() {
  const queryClient = new QueryClient();
  const supabase = createSupabaseServerClient();

  // Data is prefetched on the server and will be available immediately on client
  const suggestionsQuery = queryClient.prefetchQuery({
    queryKey: ["suggestions", mockRestaurantId],
    queryFn: () => getGPTSuggestions(mockRestaurantId),
  });
  const menuQuery = prefetchSupabaseQuery(
    queryClient,
    getRestaurantMenu(supabase),
  );

  await Promise.all([suggestionsQuery, menuQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RestaurantMenu />
      </HydrationBoundary>
    </div>
  );
}

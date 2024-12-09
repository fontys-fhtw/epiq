import MenuManagement from "@src/components/admin/management/menu/MenuManagement";
import { getRestaurantMenu } from "@src/queries/admin";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { prefetchQuery as prefetchSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function MenuManagementPage() {
  const queryClient = new QueryClient();
  const supabase = createSupabaseServerClient();

  const menuQuery = prefetchSupabaseQuery(
    queryClient,
    getRestaurantMenu(supabase),
  );

  await Promise.all([menuQuery]);

  return (
    <div className="min-h-screen w-full bg-black px-4 py-8 text-white">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MenuManagement />
      </HydrationBoundary>
    </div>
  );
}

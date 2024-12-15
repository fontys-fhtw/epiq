import TableManagement from "@src/components/admin/management/table/TableManagement";
import { getRestaurantMenu } from "@src/queries/admin";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { prefetchQuery as prefetchSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function TableManagementPage() {
  const queryClient = new QueryClient();
  const supabase = createSupabaseServerClient();

  const menuQuery = prefetchSupabaseQuery(
    queryClient,
    getRestaurantMenu(supabase),
  );

  await Promise.all([menuQuery]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TableManagement />
    </HydrationBoundary>
  );
}

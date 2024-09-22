import Admin from "@components/Admin";
import { getOrders } from "@src/queries/admin";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

/**
 * Read the following paragraph to understand hydration and dehydration.
 * https://tanstack.com/query/v5/docs/framework/react/guides/ssr#:~:text=the%20clients%20perspective.-,On%20the%20server,-%2C%20we%20need%20to
 */

export default async function AdminPage() {
  const queryClient = new QueryClient();

  // Data is prefetched on the server and will be available immediately on client
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Client Admin component  */}
      <Admin />
    </HydrationBoundary>
  );
}

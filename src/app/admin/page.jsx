import Admin from "@src/components/admin/Admin";
import { getOrders } from "@src/queries/admin";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Link from "next/link";

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
    <div className="p-4">
      <Link
        href="/admin/qr"
        className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
      >
        QR Code Generation Page
      </Link>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* Client Admin component  */}
        <Admin />
      </HydrationBoundary>
    </div>
  );
}

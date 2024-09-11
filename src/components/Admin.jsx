"use client";

import { getOrders, getReservations } from "@src/queries/admin";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  // This useQuery could just as well happen in some deeper
  // child to <Orders>, data will be available immediately either way
  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix.
  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: getReservations,
  });

  return (
    <div>
      <h2>Orders</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <h2>Reservations</h2>
      {isLoading ? (
        "Loading..."
      ) : (
        <pre>{JSON.stringify(reservationsData, null, 2)}</pre>
      )}
    </div>
  );
}

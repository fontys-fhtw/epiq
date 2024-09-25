"use client";

import { getRestaurantMenu } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export default function RestaurantMenu() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: allDishes,
    isPending,
    isError,
  } = useQuery(getRestaurantMenu(supabase));

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading menu.</p>;

  return (
    <div>
      <br />
      <h2>Menu</h2>
      {allDishes?.length ? (
        <ul>
          {allDishes.map((dish) => (
            <li key={dish.id}>
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <p>
                <strong>Price: ${dish.price}</strong>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No dishes available.</p>
      )}
    </div>
  );
}

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
    error,
  } = useQuery(getRestaurantMenu(supabase));

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading menu: ${error}</p>;

  return (
    <div className="mx-auto my-6 max-w-lg rounded-lg bg-gray-100 p-4 shadow-md">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Our Menu
      </h2>

      {allDishes?.length ? (
        <ul className="space-y-6">
          {allDishes.map((dish) => (
            <li
              key={dish.id}
              className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-lg"
            >
              <h3 className="mb-1 text-xl font-semibold text-gray-900">
                {dish.name}
              </h3>
              <p className="mb-3 text-gray-700">{dish.description}</p>
              <p className="text-lg font-bold text-gray-900">
                Price: ${dish.price}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No dishes available.</p>
      )}
    </div>
  );
}

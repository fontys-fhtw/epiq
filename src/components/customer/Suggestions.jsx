"use client";

import { getRestaurantMenu } from "@src/queries/customer";
import { generateSuggestions } from "@src/utils/openai";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";

// This should be fetched from the database
const mockOrderHistory = [
  {
    orderId: 1,
    restaurant: "Pizzeria Bella",
    dish: "Margherita Pizza",
    date: "2024-09-01",
    price: 9.99,
  },
  {
    orderId: 2,
    restaurant: "La Pasta House",
    dish: "Spaghetti Carbonara",
    date: "2024-09-03",
    price: 12.5,
  },
  {
    orderId: 3,
    restaurant: "Healthy Bites",
    dish: "Caesar Salad",
    date: "2024-09-10",
    price: 7.0,
  },
  {
    orderId: 4,
    restaurant: "Pizzeria Bella",
    dish: "Pepperoni Pizza",
    date: "2024-09-15",
    price: 10.99,
  },
];

export default function Suggestions() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: allDishes,
    isPending,
    isError,
  } = useSupabaseQuery(getRestaurantMenu(supabase));

  const {
    data: gptSuggestions,
    refetch,
    isFetching,
  } = useTanstackQuery({
    queryKey: ["suggestions"],
    queryFn: () => generateSuggestions(allDishes, mockOrderHistory),
    enabled: false,
  });

  if (isPending) return <p>Loading menu...</p>;
  if (isError) return <p>Error loading menu.</p>;

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold">
        GPT Dish Suggestions
      </h1>
      <button
        type="button"
        onClick={refetch}
        className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
      >
        Fetch Suggestions
      </button>

      {isFetching ? (
        <p className="mt-4 text-center">Loading suggestions...</p>
      ) : (
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <h2 className="text-xl font-semibold">Suggestions:</h2>
          <p className="mt-2 text-gray-700">
            {gptSuggestions || "No suggestions yet."}
          </p>
        </div>
      )}
    </div>
  );
}

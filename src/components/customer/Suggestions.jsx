"use client";

import { getGPTSuggestions } from "@src/queries/customer";
import { useQuery } from "@tanstack/react-query";

const mockRestaurantId = 1;

export default function Suggestions() {
  const {
    data: gptSuggestions,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => getGPTSuggestions(mockRestaurantId),
    onError: (error) => console.error(error),
    enabled: false,
  });

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

"use client";

import { getSuggestions } from "@src/queries/customer";
import { useQuery } from "@tanstack/react-query";

export default function Suggestions() {
  const {
    data: suggestionsData,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["suggestions"],
    queryFn: getSuggestions,
    enabled: false,
  });

  return (
    <div>
      <h1>OpenAI Suggestions</h1>
      <button
        type="button"
        onClick={() => refetch()}
        className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
      >
        Fetch suggestions
      </button>

      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <p>{suggestionsData?.chatbotResponse}</p>
      )}
    </div>
  );
}

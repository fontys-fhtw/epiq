"use client";

import { authUser } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useMutation } from "@tanstack/react-query";

export default function SignInPage() {
  const supabase = createSupabaseBrowserClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => authUser(supabase),
  });

  if (isError) return <p>Error signing in: ${error}</p>;

  return (
    <div className="flex grow items-center justify-center bg-cover bg-center">
      <div className="container max-w-64">
        <button
          type="button"
          disabled={isPending}
          className="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={mutate}
        >
          {isPending ? "Signing in..." : "Sign In with Google"}
        </button>
      </div>
    </div>
  );
}

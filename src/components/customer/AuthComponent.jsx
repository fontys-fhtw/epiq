"use client";

import { authUser } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGoogle, FaSpinner, FaTruckLoading } from "react-icons/fa";

export default function AuthComponent() {
  const supabase = createSupabaseBrowserClient();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: () => authUser(supabase, searchParams.get("referrerId")),
    onError: (error) => {
      setErrorMessage(error.message || "An unexpected error occurred.");
    },
  });

  const handleSignIn = () => {
    mutate();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-black">
          Welcome Back!
        </h2>
        {errorMessage && (
          <div className="mb-4 text-center text-red-600">{errorMessage}</div>
        )}
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className={`flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
            isLoading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isLoading ? (
            <FaSpinner
              className="mr-2 size-5 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <FaGoogle className="mr-2 size-5" aria-hidden="true" />
          )}
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

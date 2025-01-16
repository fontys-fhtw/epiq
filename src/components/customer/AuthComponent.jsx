"use client";

import { authUser } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FaGoogle, FaTruckLoading } from "react-icons/fa";

import ActionButton from "../common/ActionButton";

export default function AuthComponent() {
  const supabase = createSupabaseBrowserClient();
  const searchParams = useSearchParams();
  const { mutate, error, isLoading } = useMutation({
    mutationFn: () =>
      authUser(
        supabase,
        searchParams.get("referrerId"),
        searchParams.get("redirectTo"),
      ),
  });

  const handleSignIn = () => {
    mutate();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-dark p-8 shadow-lg shadow-dark">
        <h2 className="mb-4 text-center text-2xl font-semibold text-white">
          Welcome Back!
        </h2>
        {error && (
          <div className="mb-4 text-center text-red-600">{error.message}</div>
        )}
        <ActionButton
          onClick={handleSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg py-2 text-lg"
        >
          {isLoading ? (
            <FaTruckLoading className="mr-2 size-5 animate-spin" />
          ) : (
            <FaGoogle className="mr-2 size-5" />
          )}

          {isLoading ? "Signing in..." : "Sign in with Google"}
        </ActionButton>
      </div>
    </div>
  );
}

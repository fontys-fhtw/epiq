"use client";

import { getCustomerSession, signOut } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getURL from "@src/utils/url";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const supabase = createSupabaseBrowserClient();

  const { data } = useQuery({
    queryKey: ["customer-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () => signOut(supabase),
    onSuccess: () => router.push(getURL().customer),
  });

  useEffect(() => {
    if (data) {
      setUser({
        email: data.data.session.user.email,
        name: data.data.session.user.user_metadata?.name,
        surname: data.data.session.user.user_metadata?.surname,
      });
    }
  }, [data]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-900 p-8 shadow-lg">
        <div className="mb-8">
          <h1 className="mb-4 border-b border-blue-500 pb-2 text-center text-3xl font-semibold text-blue-500">
            Your Profile
          </h1>
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Name:</h2>
              <p className="text-lg font-medium text-neutral-300">
                {user?.name || "Anonymous"}
              </p>
            </div>
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Surname:</h2>
              <p className="text-lg font-medium text-neutral-300">
                {user?.surname || "User"}
              </p>
            </div>
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Email:</h2>
              <p className="text-lg font-medium text-neutral-300">
                {user?.email || "example@example.com"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={mutate}
            className={`w-full rounded-lg bg-blue-500 py-3 font-bold text-white transition-shadow duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg active:bg-blue-700 
              ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Logging Out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

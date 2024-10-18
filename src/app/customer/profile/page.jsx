"use client";

import { getCustomerSession, signOut } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getURL from "@src/utils/url";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
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
    onSuccess: () => router.push(`${getURL().customer}/auth/`),
  });

  const splitFullName = (fullName) => {
    const [name, ...surnameParts] = fullName.split(" ");
    const surname = surnameParts.join(" ");
    return { name, surname };
  };

  useEffect(() => {
    if (data) {
      const { name, surname } = splitFullName(
        data.data.session.user.user_metadata?.full_name || "Anonymous User",
      );
      setUser({
        email: data.data.session.user.email,
        avatarUrl: data.data.session.user.user_metadata?.avatar_url,
        name,
        surname,
      });
    }
  }, [data]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-6">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src={user?.avatarUrl}
            alt={`${user?.name || "User"}'s avatar`}
            className="mb-4 size-24 rounded-full object-cover shadow-md"
            width={96}
            height={96}
          />
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-md font-semibold text-gray-300">Name:</h2>
            <p className="text-md font-medium text-white">
              {user?.name || "Anonymous"}
            </p>
          </div>
          <div className="flex justify-between">
            <h2 className="text-md font-semibold text-gray-300">Surname:</h2>
            <p className="text-md font-medium text-white">
              {user?.surname || "User"}
            </p>
          </div>
          <div className="flex justify-between">
            <h2 className="text-md font-semibold text-gray-300">Email:</h2>
            <p className="text-md font-medium text-white">
              {user?.email || "example@example.com"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={mutate}
            className={`w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-transform duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-800 ${
              isLoading ? "cursor-not-allowed opacity-50" : "shadow-md"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging Out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

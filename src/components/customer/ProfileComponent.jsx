"use client";

import {
  getCustomerSession,
  getUserCredits,
  signOut,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Button from "../common/Button";
import Card from "../common/Card";
import Heading from "../common/Heading";

export default function CustomerProfile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const supabase = createSupabaseBrowserClient();

  const { data: sessionData } = useQuery({
    queryKey: ["user-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  const { data: creditsData } = useSupabaseQuery(
    getUserCredits(supabase, user?.id),
  );

  const { mutate, isLoading } = useMutation({
    mutationFn: () => signOut(supabase),
    onSuccess: () => router.push(getBaseUrl().customer),
  });

  const splitFullName = (fullName) => {
    const [name, ...surnameParts] = fullName.split(" ");
    const surname = surnameParts.join(" ");
    return { name, surname };
  };

  useEffect(() => {
    if (sessionData) {
      const { name, surname } = splitFullName(
        sessionData.data.session.user.user_metadata?.full_name ||
          "Anonymous User",
      );
      setUser({
        email: sessionData.data.session.user.email,
        avatarUrl:
          sessionData.data.session.user.user_metadata?.avatar_url ||
          "/default-avatar.png",
        name,
        surname,
        id: sessionData.data.session.user.id,
      });
    }
  }, [sessionData]);

  // Check if Web Share API is supported
  const isWebShareSupported = () => {
    return navigator.share !== undefined;
  };

  // Handle share action
  const handleShare = async () => {
    if (isWebShareSupported()) {
      try {
        await navigator.share({
          title: "Get €10 Off Your First Order with EpiQ!\n",
          text: `\n${user?.name} ${user?.surname} just invited you to join EpiQ!\n💸 Get €10 off your first order, and they get €10 too!\n🍽 Personalize your restaurant visits and enjoy a seamless dining experience.`,
          url: `${getBaseUrl().customer}auth?referrerId=${user?.id}`,
        });

        console.info("Content shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for unsupported browsers
      alert("Sharing is not supported on your device.");
    }
  };

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      alert(`Error: ${authError}`);
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen flex-col items-center justify-around bg-gradient-to-b from-gray-900 to-black px-4 py-8">
        <Card className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
          <div className="mb-6 flex flex-col items-center">
            {user?.avatarUrl && (
              <Image
                src={user?.avatarUrl}
                alt={`${user?.name || "User"}'s avatar`}
                className="mb-4 rounded-full object-cover shadow-md"
                width={96}
                height={96}
              />
            )}
            <Heading level={1} className="text-2xl">
              Your Profile
            </Heading>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-md font-semibold text-gray-300">Name:</p>
              <p className="text-md font-medium text-white">
                {user?.name || "Anonymous"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-semibold text-gray-300">Surname:</p>
              <p className="text-md font-medium text-white">
                {user?.surname || "User"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-semibold text-gray-300">Email:</p>
              <p className="text-md font-medium text-white">
                {user?.email || "example@example.com"}
              </p>
            </div>

            {creditsData && (
              <div className="mt-6 flex flex-col items-center">
                <Heading level={2} className="mb-4 text-xl">
                  Referral Credits
                </Heading>
                <div className="flex w-full max-w-xs flex-col gap-6 md:flex-row md:justify-between">
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-semibold text-gray-300">Total</p>
                    <p className="text-lg font-medium text-white">
                      ${creditsData.total_earned.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-semibold text-gray-300">
                      Available
                    </p>
                    <p className="text-lg font-medium text-white">
                      ${creditsData.available_credit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="primary"
              onClick={mutate}
              disabled={isLoading}
              className={`w-full py-3 transition-transform duration-300 ease-in-out ${
                isLoading ? "cursor-not-allowed opacity-50" : "shadow-md"
              }`}
            >
              {isLoading ? "Logging Out..." : "Log Out"}
            </Button>
          </div>
        </Card>

        {/* Share Button */}
        <div>
          <Button
            type="button"
            variant="success"
            onClick={handleShare}
            className="mx-14 mt-4 flex items-center justify-center rounded-lg bg-green-500 px-4 py-3 font-semibold text-white transition-transform duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 active:bg-green-700"
          >
            📤 Get €10 with a Friend
          </Button>
        </div>
      </div>
    </Suspense>
  );
}

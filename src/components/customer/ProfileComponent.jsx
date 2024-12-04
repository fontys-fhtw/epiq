"use client";

import { getCustomerSession, getUserCredits } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ActionButton from "../common/ActionButton";

export default function CustomerProfile() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);

  const supabase = createSupabaseBrowserClient();

  const { data: sessionData } = useQuery({
    queryKey: ["user-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  const { data: creditsData } = useSupabaseQuery(
    getUserCredits(supabase, user?.id),
  );

  const splitFullName = (fullName) => {
    const [name, ...surnameParts] = fullName.split(" ");
    const surname = surnameParts.join(" ");
    return { name, surname };
  };

  useEffect(() => {
    if (sessionData) {
      const { name, surname } = splitFullName(
        sessionData.data.session.user.user_metadata?.full_name,
      );
      setUser({
        email: sessionData.data.session.user.email,
        avatarUrl: sessionData.data.session.user.user_metadata?.avatar_url,
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
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-around text-white">
      <div className="flex w-full flex-col gap-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold">Your Profile</h1>
        </div>

        <div className="flex w-full flex-col items-center gap-8 rounded-lg bg-dark py-8 shadow-lg shadow-dark">
          <div className="flex flex-col items-center">
            {user?.avatarUrl && (
              <Image
                src={user?.avatarUrl}
                alt={`${user?.name}'s avatar`}
                className="size-24 rounded-full object-cover shadow-md"
                width={96}
                height={96}
              />
            )}
          </div>

          <div className="w-full space-y-4 px-8">
            <div className="flex justify-between">
              <h2 className="text-md font-semibold">Name:</h2>
              <p className="text-md">{user?.name}</p>
            </div>
            <div className="flex justify-between">
              <h2 className="text-md font-semibold">Surname:</h2>
              <p className="text-md">{user?.surname}</p>
            </div>
            <div className="flex justify-between">
              <h2 className="text-md font-semibold">Email:</h2>
              <p className="text-md">{user?.email}</p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center border-t border-brown pt-8">
            <h2 className="mb-4 text-xl font-bold">Referral Credits</h2>
            <div className="flex max-w-xs justify-between gap-24">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">Total</h3>
                <div className="text-lg">
                  ${creditsData?.total_earned?.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">Available</h3>
                <div className="text-lg">
                  ${creditsData?.available_credit?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <ActionButton onClick={handleShare} className="rounded-lg text-lg">
          📤 Get €10 with a Friend
        </ActionButton>
      </div>
    </div>
  );
}

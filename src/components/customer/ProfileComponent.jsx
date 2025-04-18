"use client";

import {
  getCustomerSession,
  getUserCredits,
  getUserSettings,
  updateUserSettings,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

import ActionButton from "../common/ActionButton";
import Spinner from "../common/Spinner";

export default function CustomerProfile() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  const supabase = createSupabaseBrowserClient();

  const { data: sessionData } = useQuery({
    queryKey: ["user-session"],
    queryFn: () => getCustomerSession(supabase),
  });
  const userId = sessionData?.data?.session?.user?.id;

  const { data: creditsData, isLoading: isLoadingCredits } = useSupabaseQuery(
    getUserCredits(supabase, userId),
  );

  const { data: userSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () => getUserSettings(supabase, userId),
    enabled: !!userId,
  });

  const { mutate: mutateSettings, isLoading: isLoadingSettingsMutation } =
    useMutation({
      mutationFn: (_updatedSettings) => {
        updateUserSettings(supabase, _updatedSettings);
      },
      onSuccess: () => {
        // Invalidate the user settings query to refetch the updated data.
        // Important for the useOrderStatusNotification hook to get the updated settings.
        queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      },
    });

  const splitFullName = (fullName) => {
    const [name, ...surnameParts] = fullName.split(" ");
    const surname = surnameParts.join(" ");
    return { name, surname };
  };

  useEffect(() => {
    if (sessionData) {
      const { name, surname } = splitFullName(
        sessionData.data.session.user.user_metadata?.full_name || "",
      );
      setUser({
        email: sessionData.data.session.user.email,
        avatarUrl: sessionData.data.session.user.user_metadata?.avatar_url,
        name,
        surname,
      });
    }
  }, [sessionData]);

  // Check if Web Share API is supported
  const isWebShareSupported = () => {
    return (
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  };

  // Handle share action
  const handleShare = async () => {
    if (isWebShareSupported()) {
      try {
        await navigator.share({
          title: "Get €10 Off Your First Order with EpiQ!\n",
          text: `\n${user?.name} ${user?.surname} just invited you to join EpiQ!\n💸 Get €10 off your first order, and they get €10 too!\n🍽 Personalize your restaurant visits and enjoy a seamless dining experience.`,
          url: `${getBaseUrl().customer}auth?referrerId=${userId}`,
        });
        console.info("Content shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported on your device.");
    }
  };

  const handleNotificationToggle = async (e) => {
    const newValue = e.target.checked;

    // Update settings object
    const updatedSettings = {
      ...userSettings,
      settings: {
        ...userSettings.settings,
        notifications: {
          ...userSettings.notifications,
          enabled: newValue,
        },
      },
    };

    // Update settings in DB
    mutateSettings(updatedSettings);
  };

  const isNotificationsEnabled =
    userSettings?.settings?.notifications?.enabled ?? false;

  const isLoading =
    isLoadingCredits || isLoadingSettings || isLoadingSettingsMutation;

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-around text-white">
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black bg-opacity-50">
          <Spinner />
        </div>
      )}

      <div className="flex w-full flex-col gap-6">
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

            <div>
              <label className="mt-5 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  value=""
                  className="peer sr-only"
                  checked={isNotificationsEnabled}
                  onChange={handleNotificationToggle}
                />
                <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gold peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
                <span className="ms-3">Enable notifications</span>
              </label>
            </div>
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

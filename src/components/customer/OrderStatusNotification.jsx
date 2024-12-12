"use client";

import { ORDER_STATUS_ID, ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

export default function OrderStatusNotification() {
  const supabase = createSupabaseBrowserClient();
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // A function to re-read settings from localStorage
  const updateNotificationsEnabledFromLocalStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    const storedSettings = localStorage.getItem("userSettings");
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setNotificationsEnabled(!!parsedSettings?.notifications?.enabled);
    } else {
      setNotificationsEnabled(false);
    }
  }, []);

  useEffect(() => {
    // Initialize on component mount
    updateNotificationsEnabledFromLocalStorage();

    // Listen for updates when settings change
    const handleUserSettingsUpdate = () => {
      updateNotificationsEnabledFromLocalStorage();
    };

    window.addEventListener("userSettingsUpdated", handleUserSettingsUpdate);

    return () => {
      window.removeEventListener(
        "userSettingsUpdated",
        handleUserSettingsUpdate
      );
    };
  }, [updateNotificationsEnabledFromLocalStorage]);

  const handleNotification = (payload) => {
    if (!notificationsEnabled) return;

    const { statusid, notes } = payload.new;

    if (!Object.values(ORDER_STATUS_ID).includes(statusid)) {
      console.warn("Invalid status ID received:", statusid);
      toast.error(
        <div>Unable to retrieve the current status of your order!</div>,
        { theme: "" }
      );
      return;
    }

    const statusText =
      statusid === ORDER_STATUS_ID.IN_PROGRESS
        ? `Your order is ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}!`
        : `Your order was ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}!`;

    const supportsNative = "Notification" in window;
    const permissionGranted =
      supportsNative && Notification.permission === "granted";
    const isVisible = document.visibilityState === "visible";

    if (supportsNative && permissionGranted) {
      if (isVisible) {
        // Page visible -> Toastify
        toast(
          <div>
            <h1>{statusText}</h1>
            <hr />
            {notes}
          </div>,
          { theme: "" }
        );
      } else {
        // Page not visible -> Native notification
        new Notification(statusText, { body: notes });
      }
    } else {
      // Fallback to Toastify
      toast(
        <div>
          <h1>{statusText}</h1>
          <hr />
          {notes}
        </div>,
        { theme: "" }
      );
    }
  };

  useEffect(() => {
    if (!notificationsEnabled) return;
    // Subscribe to the orders table changes
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.new && payload.eventType !== "DELETE") {
            handleNotification(payload);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to order notifications");
        } else if (status === "ERROR") {
          console.error("Error subscribing to order notifications");
          setErrorMessage("Failed to subscribe to order notifications.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, notificationsEnabled]);
}

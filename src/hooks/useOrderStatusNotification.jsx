"use client";

import { ORDER_STATUS_ID, ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import { getCustomerSession, getUserSettings } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

// Notification Styles
// Defines the base styles and specific styling for notifications
const styles = {
  base: "rounded p-3",
  header: "mb-1 font-semibold text-lg",
  hr: "my-1 border-opacity-50",
};

// Background and Text Colors
// Centralized color definitions for different notification types
const bgColors = {
  error: "bg-red-500",
  info: "bg-blue-500",
  default: "bg-gold",
};

const textColors = {
  black: "text-black",
  white: "text-white",
};

// Utility function to render toast content
// This function generates a consistent structure for toast notifications
const renderToast = (type, title, message = null, borderColor = "") => (
  <div
    className={`${styles.base} ${bgColors[type]} ${textColors[type === "default" ? "black" : "white"]}`}
  >
    <h1 className={styles.header}>{title}</h1>
    <hr className={`${styles.hr} ${borderColor}`} />
    {message && <p>{message}</p>}
  </div>
);

// Function to request notification permission
// Handles the asynchronous request to enable browser notifications
const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return "unsupported"; // Notifications not supported
  if (Notification.permission === "granted") return "granted"; // Permission already granted
  if (Notification.permission === "denied") return "denied"; // Permission already denied
  const permissionStatusResult = await Notification.requestPermission(); // Request permission from the user
  return permissionStatusResult;
};

const useOrderStatusNotification = () => {
  const supabase = createSupabaseBrowserClient();

  const { data: sessionData } = useQuery({
    queryKey: ["user-session"],
    queryFn: () => getCustomerSession(supabase),
  });
  const userId = sessionData?.data?.session?.user?.id;

  const { data: userSettings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () => getUserSettings(supabase, userId),
    enabled: !!userId,
  });

  const isNotificationsEnabled =
    userSettings?.settings?.notifications?.enabled ?? false;

  // Function to display native notifications
  // Displays system-level notifications using the browser's Notification API
  const showNativeNotification = (title) => {
    try {
      new Notification(title);
    } catch (error) {
      console.error("Failed to show native notification:", error);
    }
  };

  // Function to display toast notifications
  // Shows user-friendly notifications within the app using react-toastify
  const showToast = (type, title, message = null, borderColor = "") => {
    toast(renderToast(type, title, message, borderColor), {
      theme: "",
    });
  };

  // Handler for incoming notifications
  // Processes the payload from Supabase and displays appropriate notifications
  const handleNotification = useCallback((payload) => {
    const { statusid } = payload.new;

    // Validate statusid to ensure it matches a known status
    if (!Object.values(ORDER_STATUS_ID).includes(statusid)) {
      console.warn("Invalid status ID received:", statusid);
      showToast(
        "error",
        "Error",
        "Unable to retrieve the current status of your order!",
        "border-red-700",
      );
      return;
    }

    // Construct the notification text based on the order status
    const statusText = `${statusid === ORDER_STATUS_ID.IN_PROGRESS ? "Your order is" : "Your order was"} ${ORDER_STATUS_ID_TO_TEXT[
      statusid
    ].toLowerCase()}!`;

    const supportsNative = "Notification" in window; // Check if the browser supports notifications
    const isVisible = document.visibilityState === "visible"; // Check if the page is currently visible

    if (supportsNative) {
      if (Notification.permission === "granted") {
        // Show a toast if the page is visible; otherwise, show a native notification
        isVisible
          ? showToast("default", statusText, null, "border-brown")
          : showNativeNotification(statusText);
      } else if (Notification.permission === "default") {
        // Request permission and handle the response
        requestNotificationPermission().then((permission) => {
          if (permission === "granted") {
            showNativeNotification(statusText);
          } else {
            // Show a fallback toast if notifications are disabled
            showToast(
              "info",
              "Notifications Disabled",
              "Enable notifications in your browser settings to receive updates.",
              "border-blue-700",
            );
            showToast("default", statusText, null, "border-brown");
          }
        });
      } else {
        // Notifications explicitly disabled; show a fallback toast
        showToast(
          "info",
          "Notifications Disabled",
          "Enable notifications in your browser settings to receive updates.",
          "border-blue-700",
        );
        showToast("default", statusText, null, "border-brown");
      }
    } else {
      // Native notifications not supported; fallback to toast
      showToast("default", statusText, null, "border-brown");
    }
  }, []);

  useEffect(() => {
    // Exit early if notifications are disabled
    if (!isNotificationsEnabled) return;

    // Request notification permission on mount if needed
    if ("Notification" in window && Notification.permission === "default") {
      requestNotificationPermission();
    }

    // Subscribe to changes in the orders table on Supabase
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          if (payload.new) handleNotification(payload); // Process the notification payload
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to order notifications");
        } else if (status === "ERROR") {
          console.error("Error subscribing to order notifications");
        }
      });

    // Cleanup function to remove the Supabase channel on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, isNotificationsEnabled, handleNotification]);
};

export { useOrderStatusNotification };
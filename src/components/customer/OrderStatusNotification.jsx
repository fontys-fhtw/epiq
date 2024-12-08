"use client";

import { ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function OrderStatusNotification() {
  const supabase = createSupabaseBrowserClient();

  const handleNotification = (payload) => {
    const notificationsEnabled = true;
    if (!notificationsEnabled) return;

    const { statusid, notes } = payload.new;

    // Determine how to display the notification
    const supportsNative = "Notification" in window;
    const permissionGranted =
      supportsNative && Notification.permission === "granted";
    const isVisible = document.visibilityState === "visible";

    const statusText =
      statusid === 2
        ? `Your order is ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}`
        : `Your order was ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}`;

    if (supportsNative && permissionGranted) {
      if (isVisible) {
        toast(`${statusText} \n ${notes}`, { type: "info" });
      } else {
        /* eslint-disable no-new */
        new Notification(statusText, { body: notes });
      }
    } else {
      // Not supported or not granted, fallback to toastify
      toast(`${statusText} \n ${notes}`, { type: "info" });
    }
  };

  useEffect(() => {
    // Subscribe to notifications table changes
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        handleNotification,
      )
      .subscribe();

    // Cleanup on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
}

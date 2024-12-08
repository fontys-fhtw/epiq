"use client";

import { ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useEffect } from "react";

export default function OrderStatusNotification() {
  const supabase = createSupabaseBrowserClient();

  const showNotification = (statusid, notes) => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return; // no support

    const statusText =
      statusid === 2
        ? `Your order is ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}`
        : `Your order was ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}`;

    // If permission granted, show the notification
    if (Notification.permission === "granted") {
      /* eslint-disable no-new */
      new Notification(statusText, {
        body: notes,
      });
    } else if (Notification.permission !== "denied") {
      // Request permission if not denied
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          /* eslint-disable no-new */
          new Notification(statusText, {
            body: notes,
          });
        }
      });
    }
  };

  useEffect(() => {
    // Request notification permission on mount
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    // Subscribe to notifications table changes
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const { statusid, notes } = payload.new;
          showNotification(statusid, notes);
        },
      )
      .subscribe();

    // Cleanup on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
}

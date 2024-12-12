"use client";

import { ORDER_STATUS_ID, ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function OrderStatusNotification() {
  const supabase = createSupabaseBrowserClient();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleNotification = (payload) => {
    console.log("notification");
    const notificationsEnabled = true;
    if (!notificationsEnabled) return;

    const { statusid, notes } = payload.new;

    if (!Object.values(ORDER_STATUS_ID).includes(statusid)) {
      console.warn("Invalid status ID received:", statusid);
      toast.error(
        <div>Unable to retrieve the current status of your order!</div>,
        {
          theme: "",
        },
      );
      return;
    }

    // Determine how to display the notification
    const supportsNative = "Notification" in window;
    const permissionGranted =
      supportsNative && Notification.permission === "granted";
    const isVisible = document.visibilityState === "visible";

    const statusText =
      statusid === ORDER_STATUS_ID.IN_PROGRESS
        ? `Your order is ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}!`
        : `Your order was ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}!`;

    if (supportsNative && permissionGranted) {
      if (isVisible) {
        toast(
          <div>
            <h1>{statusText}</h1> <hr />
            {notes}
          </div>,
          {
            theme: "",
          },
        );
      } else {
        /* eslint-disable no-new */
        new Notification(statusText, { body: notes });
      }
    } else {
      // Not supported or not granted, fallback to toastify
      toast(
        <div>
          <h1>{statusText}</h1> <hr />
          {notes}
        </div>,
        {
          theme: "",
        },
      );
    }
  };

  useEffect(() => {
    // Subscribe to notifications table changes
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.new && payload.eventType !== "DELETE")
            handleNotification(payload);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to order notifications");
        } else if (status === "ERROR") {
          console.error("Error subscribing to order notifications");
          setErrorMessage("Failed to subscribe to order notifications.");
        }
      });

    // Cleanup on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
}

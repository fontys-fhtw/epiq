"use client";

import { ORDER_STATUS_ID, ORDER_STATUS_ID_TO_TEXT } from "@src/constants";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const useOrderStatusNotification = () => {
  const supabase = createSupabaseBrowserClient();

  const [errorMessage, setErrorMessage] = useState(null);

  // Base styles for notifications
  const baseStyle = "rounded p-3";
  const headerStyle = "mb-1 font-semibold text-lg";
  const hrStyle = "my-1 border-opacity-50";

  // Define background colors based on notification type
  const bgColors = {
    error: "bg-red-500",
    info: "bg-blue-500",
    default: "bg-gold",
  };

  const textColors = {
    black: "text-black",
    white: "text-white",
  };

  const handleNotification = useCallback((payload) => {
    console.log("notification");

    const { statusid } = payload.new;

    // Validate statusid
    if (!Object.values(ORDER_STATUS_ID).includes(statusid)) {
      console.warn("Invalid status ID received:", statusid);
      toast(
        <div className={`${baseStyle} ${bgColors.error} ${textColors.white}`}>
          <h1 className={headerStyle}>Error</h1>
          <hr className={`${hrStyle} border-red-700`} />
          <p>Unable to retrieve the current status of your order!</p>
        </div>,
        {
          theme: "",
        },
      );
      return;
    }

    const supportsNative = "Notification" in window;
    const permissionGranted =
      supportsNative && Notification.permission === "granted";
    const isVisible = document.visibilityState === "visible";

    const statusText =
      statusid === ORDER_STATUS_ID.IN_PROGRESS
        ? `Your order is ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}!`
        : `Your order was ${ORDER_STATUS_ID_TO_TEXT[statusid].toLowerCase()}!`;

    if (supportsNative) {
      if (permissionGranted) {
        if (isVisible) {
          toast(
            <div
              className={`${baseStyle} ${bgColors.default} ${textColors.black}`}
            >
              <h1 className={headerStyle}>{statusText}</h1>
              <hr className={`${hrStyle} border-brown`} />
            </div>,
            {
              theme: "",
            },
          );
        } else {
          /* eslint-disable no-new */
          new Notification(statusText);
        }
      } else if (Notification.permission === "default") {
        // Request permission
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(statusText);
          } else {
            // Inform the user that notifications are disabled
            toast(
              <div
                className={`${baseStyle} ${bgColors.info} ${textColors.white}`}
              >
                <h1 className={headerStyle}>Notifications Disabled</h1>
                <hr className={`${hrStyle} border-blue-700`} />
                <p>
                  Enable notifications in your browser settings to receive
                  updates.
                </p>
              </div>,
              {
                theme: "",
              },
            );
            // Fallback to toast
            toast(
              <div
                className={`${baseStyle} ${bgColors.default} ${textColors.black}`}
              >
                <h1 className={headerStyle}>{statusText}</h1>
                <hr className={`${hrStyle} border-brown`} />
              </div>,
              {
                theme: "",
              },
            );
          }
        });
      } else {
        // Permission denied, inform the user
        toast(
          <div className={`${baseStyle} ${bgColors.info} ${textColors.white}`}>
            <h1 className={headerStyle}>Notifications Disabled</h1>
            <hr className={`${hrStyle} border-blue-700`} />
            <p>
              Enable notifications in your browser settings to receive updates.
            </p>
          </div>,
          {
            theme: "",
          },
        );
        // Fallback to toast
        toast(
          <div
            className={`${baseStyle} ${bgColors.default} ${textColors.black}`}
          >
            <h1 className={headerStyle}>{statusText}</h1>
            <hr className={`${hrStyle} border-brown`} />
          </div>,
          {
            theme: "",
          },
        );
      }
    } else {
      // Fallback to toast if native notifications not supported
      toast(
        <div className={`${baseStyle} ${bgColors.default} ${textColors.black}`}>
          <h1 className={headerStyle}>{statusText}</h1>
          <hr className={`${hrStyle} border-brown`} />
        </div>,
        {
          theme: "",
        },
      );
    }
  }, []);

  useEffect(() => {
    // Request notification permission on component mount if not already granted or denied
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Subscribe to notifications table changes
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          console.log(payload);
          if (payload.new) handleNotification(payload);
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
  }, [supabase, handleNotification]);

  return { errorMessage };
};

export { useOrderStatusNotification };

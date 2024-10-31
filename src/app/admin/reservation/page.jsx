"use client";

import { getReservations, updateReservationStatus } from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function ManagementPage() {
  const queryClient = useQueryClient();
  const supabase = createSupabaseBrowserClient();

  // Format date and time for display
  const formatDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString("en-GB");
    const time = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  // Fetch reservations using `useSupabaseQuery`
  const {
    data: reservations,
    error: reservationsError,
    isLoading: isReservationsLoading,
  } = useSupabaseQuery(getReservations(supabase));
  useEffect(() => {
    if (reservations) {
      console.log(reservations);
    }
  }, [reservations]);

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      console.log("Updating reservation status:", reservationId, newStatus);
      await updateReservationStatus(supabase, reservationId, newStatus);
      // Optionally, you can refetch reservations here or update the state directly
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  if (isReservationsLoading) {
    return <p className="text-center text-gray-400">Loading reservations...</p>;
  }

  if (reservationsError) {
    return (
      <p className="text-center text-red-500">
        Error fetching reservations: {reservationsError.message}
      </p>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-6">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          All Reservations
        </h1>
        {Array.isArray(reservations) && reservations.length === 0 ? (
          <p className="text-center text-gray-400">No reservations found.</p>
        ) : (
          Array.isArray(reservations) && (
            <ul className="space-y-4">
              {reservations.map((reservation) => {
                const { date, time } = formatDateTime(reservation.dateTime);
                const currentStatus = reservation.status.statusName;

                return (
                  <li
                    key={reservation.reservationId}
                    className="rounded-lg border border-gray-800 bg-gray-800 p-4"
                  >
                    <p className="text-md text-gray-300">Date: {date}</p>
                    <p className="text-md text-gray-300">Time: {time}</p>
                    <p className="text-md text-gray-300">
                      People: {reservation.numberPeople}
                    </p>
                    <p className="text-md text-gray-300">
                      Status: {currentStatus}
                    </p>
                    <button
                      type="button"
                      className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                      onClick={() =>
                        handleStatusUpdate(reservation.reservationId, "4")
                      }
                    >
                      Confirm Reservation Presence
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </div>
    </div>
  );
}

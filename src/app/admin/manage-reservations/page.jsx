"use client";

// eslint-disable-next-line import/named
import { getReservations, updateReservationStatus } from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useEffect } from "react";

export default function ManagementPage() {
  const supabase = createSupabaseBrowserClient();

  const formatDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString("en-GB");
    const time = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const {
    data: reservations,
    error: reservationsError,
    isLoading: isReservationsLoading,
  } = useSupabaseQuery(getReservations(supabase));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reservationsToday = reservations?.filter((reservation) => {
    const reservationDate = new Date(reservation.dateTime);
    reservationDate.setHours(0, 0, 0, 0);
    return (
      reservationDate.getTime() === today.getTime() &&
      reservation.statusId === 1
    );
  });

  useEffect(() => {
    if (reservationsToday) {
      console.log("Reservations for today:", reservationsToday);
    }
  }, [reservationsToday]);

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      console.log("Updating reservation status:", reservationId, newStatus);
      await updateReservationStatus(supabase, reservationId, newStatus);
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
          Today´s Reservations
        </h1>
        {Array.isArray(reservationsToday) && reservationsToday.length === 0 ? (
          <p className="text-center text-gray-400">
            No reservations found for today.
          </p>
        ) : (
          <ul className="space-y-4">
            {reservationsToday.map((reservation) => {
              const { date, time } = formatDateTime(reservation.dateTime);

              return (
                <li
                  key={reservation.reservationId}
                  className="rounded-lg border border-gray-800 bg-gray-800 p-4"
                >
                  <p className="text-md text-gray-300">Date: {date}</p>
                  <p className="text-md text-gray-300">Time: {time}</p>
                  <p className="text-md text-gray-300">
                    People: {reservation.numberOfPeople}
                  </p>
                  <p className="text-md text-gray-300">
                    Name: {reservation.userName}
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
        )}
      </div>
    </div>
  );
}

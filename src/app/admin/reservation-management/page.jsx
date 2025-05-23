"use client";

import Spinner from "@src/components/common/Spinner";
import {
  getReservationsToday,
  updateReservationStatus,
} from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useState } from "react";

export default function ReservationManagementPage() {
  const supabase = createSupabaseBrowserClient();
  const [filter, setFilter] = useState("all");

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
  } = useSupabaseQuery(getReservationsToday(supabase));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredReservations =
    reservations?.filter((reservation) => {
      const hours = new Date(reservation.dateTime).getHours();
      if (filter === "afternoon") return hours >= 12 && hours < 18;
      if (filter === "evening") return hours >= 18 && hours < 24;
      return true;
    }) || [];

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await updateReservationStatus(supabase, reservationId, newStatus);
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  if (isReservationsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={60} color="#FBBF24" />
      </div>
    );
  }

  if (reservationsError) {
    return (
      <p className="text-center text-red-500">
        Error fetching reservations: {reservationsError.message}
      </p>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-darkBg px-4 pb-12 pt-24">
      <header className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">
          Today&apos;s Reservations
        </h1>
        <p className="text-gray-400">
          Date: {today.toLocaleDateString("en-GB")}
        </p>
        <p className="text-gray-400">
          Total Pending Reservations: {reservations?.length || 0}
        </p>
      </header>

      <div className="w-full max-w-7xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="mb-4 flex justify-around">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold ${
              filter === "all"
                ? "bg-dark text-white"
                : "bg-neutral-800 text-gray-400"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold ${
              filter === "afternoon"
                ? "bg-dark text-white"
                : "bg-neutral-800 text-gray-400"
            }`}
            onClick={() => setFilter("afternoon")}
          >
            Afternoon
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold ${
              filter === "evening"
                ? "bg-dark text-white"
                : "bg-neutral-800 text-gray-400"
            }`}
            onClick={() => setFilter("evening")}
          >
            Evening
          </button>
        </div>

        {Array.isArray(filteredReservations) &&
        filteredReservations.length === 0 ? (
          <p className="text-center text-gray-400">
            No reservations found for this period.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredReservations.map((reservation) => {
              const { date, time } = formatDateTime(reservation.dateTime);

              return (
                <li
                  key={reservation.reservationId}
                  className="rounded-lg border border-gray-800 bg-dark p-4"
                >
                  <p className="text-base text-gray-300">Date: {date}</p>
                  <p className="text-base text-gray-300">Time: {time}</p>
                  <p className="text-base text-gray-300">
                    People: {reservation.numberOfPeople}
                  </p>
                  <p className="text-base text-gray-300">
                    Name: {reservation.userName}
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded bg-gold px-4 py-2 font-semibold text-white hover:bg-gold"
                    onClick={() =>
                      handleStatusUpdate(reservation.reservationId, "4")
                    }
                  >
                    Confirm Presence
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

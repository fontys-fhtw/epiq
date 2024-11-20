"use client";

import {
  deleteReservation,
  getCustomerSession,
  getReservation,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function ReservationsListPage() {
  const supabase = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const formatDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString("en-GB");
    const time = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const getBackgroundColor = (reservationDate) => {
    const today = new Date();
    const reservationDateObj = new Date(reservationDate);

    today.setHours(0, 0, 0, 0);
    reservationDateObj.setHours(0, 0, 0, 0);

    if (reservationDateObj < today) {
      return "bg-red-400";
    }
    if (reservationDateObj.getTime() === today.getTime()) {
      return "bg-yellow-600";
    }
    return "bg-green-600";
  };

  const {
    data: sessionData,
    error: sessionError,
    isLoading: isSessionLoading,
  } = useQuery({
    queryKey: ["customer-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  const {
    data: reservations,
    error: reservationsError,
    isLoading: isReservationsLoading,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const userId = sessionData?.data?.session?.user?.id;
      if (!userId) return [];
      const reservationData = await getReservation(supabase, userId);
      if (Array.isArray(reservationData.data)) {
        const filteredReservations = reservationData.data.filter(
          (reservation) => {
            const reservationDateObj = new Date(reservation.dateTime);
            const today = new Date();
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(today.getDate() - 7);
            return reservationDateObj >= oneWeekAgo;
          },
        );
        return filteredReservations.sort(
          (a, b) => new Date(a.dateTime) - new Date(b.dateTime),
        );
      }
      return [];
    },
    enabled: !!sessionData,
  });

  const deleteReservationMutation = useMutation({
    mutationFn: async (reservationId) => {
      await deleteReservation(supabase, reservationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  const handleDeleteReservation = (reservationId) => {
    deleteReservationMutation.mutate(reservationId);
  };

  if (isSessionLoading || isReservationsLoading) {
    return <p className="text-center text-gray-400">Loading session...</p>;
  }

  if (sessionError) {
    return (
      <p className="text-center text-red-500">
        Error fetching session: {sessionError.message}
      </p>
    );
  }

  if (reservationsError) {
    return (
      <p className="text-center text-red-500">
        Error fetching reservations: {reservationsError.message}
      </p>
    );
  }

  if (!sessionData?.data?.session?.user?.id) {
    return (
      <p className="text-center text-gray-400">
        User not found. Please log in.
      </p>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-6">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Your Reservations
        </h1>
        <div className="mt-6 text-gray-300">
          <h2 className="text-md font-semibold">Legend:</h2>
          <div className="flex items-center">
            <div className="mr-2 size-3 rounded-full bg-red-400" />
            <span>Past Reservations</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 size-3 rounded-full bg-yellow-600" />
            <span>Today´s Reservations</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 size-3 rounded-full bg-green-600" />
            <span>Upcoming Reservations</span>
          </div>
        </div>
        <div className="mt-6">
          {reservations.length === 0 ? (
            <p className="text-center text-gray-400">No reservations found.</p>
          ) : (
            <ul className="space-y-4">
              {reservations.map((reservation) => {
                const { date, time } = formatDateTime(reservation.dateTime);
                const backgroundColor = getBackgroundColor(
                  reservation.dateTime,
                );
                const reservationDateObj = new Date(reservation.dateTime);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const showDeleteButton = reservationDateObj >= today;

                return (
                  <li
                    key={reservation.reservationId}
                    className={`rounded-lg border border-gray-800 p-4 ${backgroundColor}`}
                  >
                    <p className="text-md text-gray-300">Date: {date}</p>
                    <p className="text-md text-gray-300">Time: {time}</p>
                    <p className="text-md text-gray-300">
                      People: {reservation.numberOfPeople}
                    </p>
                    {showDeleteButton && (
                      <button
                        type="button"
                        className={`mt-4 rounded border-2 border-white px-4 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 ${backgroundColor}`}
                        onClick={() =>
                          handleDeleteReservation(reservation.reservationId)
                        }
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

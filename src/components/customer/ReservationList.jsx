"use client";

import {
  deleteReservation,
  getCustomerSession,
  getReservation,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import ActionButton from "../common/ActionButton";
import Spinner from "../common/Spinner";

const COLOR_LEGEND = {
  PAST: "bg-red-400",
  TODAY: "bg-yellow-600",
  UPCOMING: "bg-green-600",
};

export default function ReservationListComponent() {
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
      return COLOR_LEGEND.PAST;
    }
    if (reservationDateObj.getTime() === today.getTime()) {
      return COLOR_LEGEND.TODAY;
    }
    return COLOR_LEGEND.UPCOMING;
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
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <Spinner size={80} color="#FFD700" />
      </div>
    );
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
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-start gap-14 pt-8">
      {/* Header */}
      <div className="flex w-full flex-col gap-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-200">
            Your Reservations
          </h1>
          <p className="text-base text-gray-400">
            Manage your upcoming and past reservations.
          </p>
        </div>

        <div>
          <Link href="/customer/reservation/new">
            <ActionButton className="w-2/3">Make a Reservation</ActionButton>
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-8">
        {/* Legend */}
        <div className="flex w-full flex-col rounded-lg bg-dark p-6 shadow-lg shadow-dark">
          <div className="flex items-center">
            <span
              className={`mr-2 inline-block size-4 rounded-full ${COLOR_LEGEND.PAST}`}
            />
            <span className="text-gray-300">Past</span>
          </div>
          <div className="flex items-center">
            <span
              className={`mr-2 inline-block size-4 rounded-full ${COLOR_LEGEND.TODAY}`}
            />
            <span className="text-gray-300">Today</span>
          </div>
          <div className="flex items-center">
            <span
              className={`mr-2 inline-block size-4 rounded-full ${COLOR_LEGEND.UPCOMING}`}
            />
            <span className="text-gray-300">Upcoming</span>
          </div>
        </div>

        {/* Reservations List */}
        <div className="w-full max-w-4xl rounded-lg bg-dark p-6 shadow-lg shadow-dark">
          {reservations.length === 0 ? (
            <p className="text-center text-gray-400">No reservations found.</p>
          ) : (
            <ul className="space-y-6">
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
                    className={`flex flex-col items-start justify-between rounded-lg border border-gray-800 p-4 sm:flex-row sm:items-center ${backgroundColor} transition-colors duration-200 hover:bg-gold`}
                  >
                    <div>
                      <p className="text-base font-semibold text-white">
                        Date: {date}
                      </p>
                      <p className="text-base text-gray-300">Time: {time}</p>
                      <p className="text-base text-gray-300">
                        People: {reservation.numberOfPeople}
                      </p>
                    </div>
                    {showDeleteButton && (
                      <button
                        type="button"
                        className="mt-4 rounded border-2 border-gold px-4 py-2 font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-dark sm:mt-0"
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

"use client";

import {
  addReservation,
  getAvailableTable,
  getCustomerSession,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationFormPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    numberOfPeople: 1,
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const { data } = useQuery({
    queryKey: ["customer-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  const generateTimeOptions = () => {
    const times = [];
    // eslint-disable-next-line no-plusplus
    for (let h = 12; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h < 10 ? `0${h}` : h;
        const minute = m < 10 ? `0${m}` : m;
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    try {
      const table = await getAvailableTable(
        supabase,
        `${formData.date}T${formData.time}:00`,
        formData.numberOfPeople,
      );

      if (table) {
        const entityReservation = {
          dateTime: `${formData.date}T${formData.time}:00`,
          numberOfPeople: formData.numberOfPeople,
          userId: data.data.session.user.id,
          tableId: table.tableId,
          userName: data.data.session.user.user_metadata.full_name,
          statusId: 1,
        };

        await addReservation(supabase, entityReservation);
        router.push("/reservation/reservations");
      } else {
        alert("No available table found.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(
        "An error occurred while processing your reservation. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-6">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Table Reservation
        </h1>
        <form onSubmit={handleReservationSubmit} className="space-y-4">
          <div>
            <label className="text-md mb-2 block font-semibold text-gray-300">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              min={getTodayDate()}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="w-full rounded-lg border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-md mb-2 block font-semibold text-gray-300">
              Time
            </label>
            <select
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
              className="w-full rounded-lg border-gray-700 bg-gray-800 p-2 text-white"
            >
              <option value="" disabled>
                Select time
              </option>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-md mb-2 block font-semibold text-gray-300">
              Number of People
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.numberOfPeople}
              onChange={(e) =>
                setFormData({ ...formData, numberOfPeople: e.target.value })
              }
              required
              className="w-full rounded-lg border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-md transition-transform duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-800"
          >
            Reserve Table
          </button>
        </form>
      </div>
    </div>
  );
}

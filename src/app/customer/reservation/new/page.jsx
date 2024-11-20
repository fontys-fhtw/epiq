"use client";

import {
  addReservation,
  getAvailableTable,
  getCustomerSession,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { useQuery } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationFormPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

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

  const handleReservationSubmit = async (values) => {
    try {
      const table = await getAvailableTable(
        supabase,
        `${values.date}T${values.time}:00`,
        values.numberOfPeople,
      );

      if (table) {
        const entityReservation = {
          dateTime: `${values.date}T${values.time}:00`,
          numberOfPeople: values.numberOfPeople,
          userId: data.data.session.user.id,
          tableId: table.tableId,
          userName: data.data.session.user.user_metadata.full_name,
          statusId: 1,
        };

        await addReservation(supabase, entityReservation);
        router.push(`${getBaseUrl().customer}reservation/list`);
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

        <Formik
          initialValues={{
            date: "",
            time: "",
            numberOfPeople: 1,
          }}
          onSubmit={handleReservationSubmit}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form className="space-y-4">
              <div>
                <label className="text-md mb-2 block font-semibold text-gray-300">
                  Date
                </label>
                <Field
                  type="date"
                  name="date"
                  value={values.date}
                  min={getTodayDate()}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="w-full rounded-lg border-gray-700 bg-gray-800 p-2 text-white"
                />
              </div>

              <div>
                <label className="text-md mb-2 block font-semibold text-gray-300">
                  Time
                </label>
                <Field
                  as="select"
                  name="time"
                  value={values.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                </Field>
              </div>

              <div>
                <label className="text-md mb-2 block font-semibold text-gray-300">
                  Number of People
                </label>
                <Field
                  type="number"
                  name="numberOfPeople"
                  min="1"
                  max="20"
                  value={values.numberOfPeople}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

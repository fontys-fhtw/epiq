"use client";

import ActionButton from "@src/components/common/ActionButton";
import {
  addReservation,
  getAvailableTable,
  getCustomerSession,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { FaRocket, FaSpinner } from "react-icons/fa";
import * as Yup from "yup";

// Validation Schema
const reservationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required"),
  time: Yup.string().required("Time is required"),
  numberOfPeople: Yup.number()
    .required("Number of people is required")
    .min(1, "At least one person is required")
    .max(20, "Maximum of 20 people allowed"),
});

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
    <div className="flex flex-col items-center gap-8 pt-12">
      {/* Header */}
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-200">Table Reservation</h1>
        <p className="text-base text-gray-400">
          Reserve a table at your preferred time and date.
        </p>
      </div>

      {/* Reservation Form Card */}
      <div className="w-full max-w-md rounded-lg bg-dark p-8 shadow-lg">
        <Formik
          initialValues={{
            date: "",
            time: "",
            numberOfPeople: 1,
          }}
          validationSchema={reservationSchema}
          onSubmit={handleReservationSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="space-y-6">
              {/* Date Field */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block font-semibold text-gray-300"
                >
                  Date
                </label>
                <Field
                  type="date"
                  id="date"
                  name="date"
                  min={getTodayDate()}
                  className="w-full rounded-lg border border-brown bg-gray-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Time Field */}
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block font-semibold text-gray-300"
                >
                  Time
                </label>
                <Field
                  as="select"
                  id="time"
                  name="time"
                  className="w-full rounded-lg border border-brown bg-gray-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
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
                <ErrorMessage
                  name="time"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Number of People Field */}
              <div>
                <label
                  htmlFor="numberOfPeople"
                  className="mb-2 block font-semibold text-gray-300"
                >
                  Number of People
                </label>
                <Field
                  type="number"
                  id="numberOfPeople"
                  name="numberOfPeople"
                  min="1"
                  max="20"
                  className="w-full rounded-lg border border-brown bg-gray-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <ErrorMessage
                  name="numberOfPeople"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Submit Button */}
              <ActionButton
                type="submit"
                className={`flex w-full items-center justify-center rounded-lg text-xl ${
                  isSubmitting || !isValid
                    ? "cursor-not-allowed bg-brown opacity-50"
                    : "bg-gold hover:bg-yellow-500"
                }`}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? (
                  <FaSpinner
                    className="mr-2 size-5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <FaRocket className="mr-2 size-5" aria-hidden="true" />
                )}
                {isSubmitting ? "Reserving..." : "Reserve Table"}
              </ActionButton>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

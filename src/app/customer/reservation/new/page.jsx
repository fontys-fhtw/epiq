"use client";

import ActionButton from "@src/components/common/ActionButton";
import Spinner from "@src/components/common/Spinner";
import {
  addReservation,
  getAvailableTable,
  getCustomerSession,
} from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FaRocket, FaSpinner } from "react-icons/fa";
import * as Yup from "yup";

const initialReservationPayload = {
  date: "",
  time: "",
  numberOfPeople: 1,
};

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
  const [reservationPayload, setReservationPayload] = useState(
    initialReservationPayload,
  );

  const isFormFilled = Boolean(
    reservationPayload.date &&
      reservationPayload.time &&
      reservationPayload.numberOfPeople,
  );

  const {
    data: sessionData,
    isLoading: isLoadingSession,
    error: errorSession,
  } = useQuery({
    queryKey: ["customer-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  const {
    data: availableTableData,
    isLoading: isLoadingAvailableTable,
    error: errorAvailableTable,
  } = useQuery({
    queryKey: ["available-table", reservationPayload],
    queryFn: () =>
      getAvailableTable(
        supabase,
        `${reservationPayload.date}T${reservationPayload.time}:00`,
        reservationPayload.numberOfPeople,
      ),
    enabled: isFormFilled,
  });

  const {
    mutate: mutateAddReservation,
    error: errorAddReservation,
    isLoading: isLoadingAddReservation,
  } = useMutation({
    mutationFn: () => {
      addReservation(supabase, {
        dateTime: `${reservationPayload.date}T${reservationPayload.time}:00`,
        numberOfPeople: reservationPayload.numberOfPeople,
        userId: sessionData.data.session.user.id,
        tableId: availableTableData.tableId,
        userName: sessionData.data.session.user.user_metadata.full_name,
        statusId: 1,
      });
    },
    onSuccess: () => {
      router.push(`${getBaseUrl().customer}reservation`);
      setReservationPayload(initialReservationPayload);
    },
  });

  const getTodayDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  const generateTimeOptions = useCallback(() => {
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
  }, []);

  const isLoading = isLoadingSession || isLoadingAddReservation;

  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      {/* Header */}
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-200">Table Reservation</h1>
        <p className="text-base text-gray-400">
          Reserve a table at your preferred time and date.
        </p>
      </div>

      {/* display error */}
      {errorSession && (
        <div className="text-red-500">Error loading session data.</div>
      )}

      {/* display error */}
      {errorAvailableTable && (
        <div className="text-red-500">Error loading available table data.</div>
      )}

      {/* display error */}
      {errorAddReservation && (
        <div className="text-red-500">Error adding reservation.</div>
      )}

      {/* no available table, choose another time or date */}
      {isFormFilled &&
        !availableTableData?.tableId &&
        !isLoadingAvailableTable && (
          <div className="text-red-500">
            No available table for the selected date and time. Please choose
            another date or time.
          </div>
        )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black bg-opacity-50">
          <Spinner />
        </div>
      )}

      {/* Reservation Form Card */}
      <div className="w-full max-w-md rounded-lg bg-dark p-8 shadow-lg shadow-dark">
        <Formik
          initialValues={initialReservationPayload}
          validationSchema={reservationSchema}
          onSubmit={() => mutateAddReservation()}
        >
          {({ isSubmitting, isValid, setFieldValue }) => (
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
                  onChange={(e) => {
                    setReservationPayload({
                      ...reservationPayload,
                      date: e.target.value,
                    });
                    setFieldValue("date", e.target.value);
                  }}
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
                  onChange={(e) => {
                    setReservationPayload({
                      ...reservationPayload,
                      time: e.target.value,
                    });
                    setFieldValue("time", e.target.value);
                  }}
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
                  onBlur={(e) => {
                    setReservationPayload({
                      ...reservationPayload,
                      numberOfPeople: parseInt(e.target.value, 10),
                    });
                    setFieldValue(
                      "numberOfPeople",
                      parseInt(e.target.value, 10),
                    );
                  }}
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
                disabled={
                  isSubmitting ||
                  !isValid ||
                  !availableTableData?.tableId ||
                  isLoadingAvailableTable
                }
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

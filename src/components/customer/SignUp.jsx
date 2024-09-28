"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signUp } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getURL from "@src/utils/url";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

// Yup validation schema
const schema = Yup.object().shape({
  first_name: Yup.string()
    .required("First Name is Required.")
    .min(1, "First Name is Too Short."),
  last_name: Yup.string()
    .required("Last Name is Required.")
    .min(1, "Last Name is Too Short."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is Required."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .matches(/(?=.*[0-9])/, "Password must contain a number."),
});

const SignUp = () => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values) => signUp(supabase, values),
    onSuccess: () => router.push(getURL().customer),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (isError) return <p>Error signing up: {error.message}</p>;

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/background.webp')",
      }}
    >
      <h2 className="mb-6 text-center text-2xl font-bold">Register</h2>

      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        }}
        validationSchema={schema}
        onSubmit={mutate}
      >
        {({ errors }) => (
          <Form>
            {errors.server && (
              <div className="mb-2 text-sm text-red-500">{errors.server}</div>
            )}

            {/* First Name Field */}
            <div className="mb-4">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <Field
                name="first_name"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <ErrorMessage
                name="first_name"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Last Name Field */}
            <div className="mb-4">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <Field
                name="last_name"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <ErrorMessage
                name="last_name"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Field
                name="email"
                type="email"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>
            {/* Password Field with Eye Icon Inside the Input */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
                {/* Eye icon to toggle visibility */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="size-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="size-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;

"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signIn } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getURL from "@src/utils/url";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

const SignIn = () => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [showPassword, setShowPassword] = useState(false); // Toggle for showing password

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (credentials) => signIn(supabase, credentials),
    onSuccess: () => router.push(getURL().customer),
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const signInWithOAuth = (provider) => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `http://localhost:3000/`,
      },
    });
  };

  if (isError) return <p>Error signing in: ${error}</p>;

  return (
    <div className="flex grow items-center justify-center bg-cover bg-center">
      <div className="container max-w-64">
        <div className="grid grid-cols-1 gap-3">
          <h2 className="text-center text-2xl font-bold">Sign In</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={mutate}
          >
            {({ errors }) => (
              <Form>
                {errors.server && (
                  <div className="mb-2 text-sm text-red-500">
                    {errors.server}
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:border-indigo-500 focus:ring-indigo-500"
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
                      type={showPassword ? "text" : "password"}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10 text-black focus:border-indigo-500 focus:ring-indigo-500"
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
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>
          <hr />
          <button
            type="button"
            disabled={isPending}
            className="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => signInWithOAuth("google")}
          >
            {isPending ? "Signing in..." : "Sign In with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

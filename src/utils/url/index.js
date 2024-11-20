import { ENV_VARS } from "@src/constants";

/**
 * Function to generate the base URL for the application, accounting for
 * different environments (development, Vercel, or production).
 *
 * The function checks for the environment variable `SITE_URL` for the
 * production site URL. If not found, it falls back to the `VERCEL_URL`,
 * which is automatically set when deployed on Vercel. In local development,
 * it defaults to `http://localhost:3000/`.
 *
 * The function ensures that:
 *  - The URL starts with `http://` or `https://`.
 *  - The URL ends with a trailing `/` to avoid issues when appending paths.
 *
 * It returns an object containing:
 *  - `base`: The base URL of the site.
 *  - `api`: The base URL for API routes.
 *  - `customer`: The base URL for customer-facing routes.
 *  - `admin`: The base URL for admin-facing routes.
 *
 * @returns {Object} An object containing base, api, customer, and admin URLs.
 */
const getBaseUrl = () => {
  let url =
    ENV_VARS.SITE_URL ?? // Set this to your site URL in the production environment.
    ENV_VARS.VERCEL_URL ?? // Automatically set by Vercel deployment.
    "http://localhost:3000/"; // Default URL for local development.

  // Ensure the URL starts with `http` or `https`.
  url = url.startsWith("http") ? url : `https://${url}`;

  // Ensure the URL ends with a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;

  // Return the base, api, customer, and admin URLs.
  return {
    base: url, // Base URL.
    api: `${url}api/`, // API base URL.
    customer: `${url}customer/`, // Customer-facing base URL.
    admin: `${url}admin/`, // Admin-facing base URL.
  };
};

export default getBaseUrl;

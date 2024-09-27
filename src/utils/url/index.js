import { ENV_VARS } from "@src/constants";

const getURL = () => {
  let url =
    ENV_VARS.SITE_URL ?? // Set this to your site URL in production env.
    ENV_VARS.VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";

  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;

  return {
    base: url,
    api: `${url}api/`,
    customer: `${url}customer/`,
    admin: `${url}admin/`,
  };
};

export default getURL;

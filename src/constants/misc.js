const ENV_VARS = Object.freeze({
  NODE_ENV: process.env.NODE_ENV,

  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,

  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  SOME_OTHER_VAR: process.env.SOME_OTHER_VAR,

  OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const DEFAULT_VALUES = Object.freeze({
  REFERRAL: "null",
});

const CUSTOMER_NAV_ITEMS = [
  { name: "Home", path: "/customer", iconKey: "home" },
  { name: "Menu", path: "/customer/menu", iconKey: "menu" },
  { name: "Profile", path: "/customer/auth", iconKey: "profile" },
];

export { CUSTOMER_NAV_ITEMS, DEFAULT_VALUES, ENV_VARS };

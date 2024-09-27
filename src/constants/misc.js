const ENV_VARS = Object.freeze({
  NODE_ENV: process.env.NODE_ENV,

  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,

  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  SOME_OTHER_VAR: process.env.SOME_OTHER_VAR,
});

export { ENV_VARS };

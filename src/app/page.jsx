import Link from "next/link";
import Hero from "@components/hero";
import ConnectSupabaseSteps from "@components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@utils/supabase/check-env-vars";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold">Home Page</h1>
      <div className="space-x-4">
        <Link
          href="/customer"
          className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Customer Page
        </Link>
        <Link
          href="/admin"
          className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          Admin Page
        </Link>
        <Link
          href="/admin"
          className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          Test
        </Link>
      </div>
    </div>
  );
}

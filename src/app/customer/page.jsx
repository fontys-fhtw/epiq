import Suggestions from "@src/components/customer/Suggestions";
import Link from "next/link";

export default function CustomerPage() {
  return (
    <div className="p-4">
      <Link
        className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        href="/customer/restaurant-menu"
      >
        Menu page
      </Link>
      <Suggestions />
      <div className="mt-4">
        <h1 className="mb-2 text-xl font-bold">Authentication Pages</h1>
        <Link
          className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          href="/customer/auth/sign-in"
        >
          Sign In Page
        </Link>
        <Link
          className="rounded bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
          href="/customer/auth/sign-up"
        >
          Sign Up Page
        </Link>
      </div>
    </div>
  );
}

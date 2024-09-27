import Link from "next/link";

export default function CustomerPage() {
  return (
    <div className="p-4">
      <Link
        className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        href="/customer/auth/signIn"
      >
        Sign In page
      </Link>
      <Link
        className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        href="/customer/restaurant-menu"
      >
        Menu page
      </Link>
    </div>
  );
}

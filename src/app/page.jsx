import Link from "next/link";

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
      </div>
    </div>
  );
}

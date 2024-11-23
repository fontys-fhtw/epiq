import Link from "next/link";

export default async function AdminPage() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/qr"
          className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          QR Code Generation Page
        </Link>
        <Link
          href="/admin/reservation-management"
          className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          Reservation Management Page
        </Link>
      </div>
    </div>
  );
}

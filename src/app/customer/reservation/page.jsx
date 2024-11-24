import getBaseUrl from "@src/utils/url";
import Link from "next/link";

export default function ReservationPage() {
  return (
    <div className="flex flex-col gap-5 p-4">
      <Link
        className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        href={`${getBaseUrl().customer}reservation/new`}
      >
        Reserve a new table
      </Link>
      <Link
        className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        href={`${getBaseUrl().customer}reservation/list`}
      >
        View my bookings
      </Link>
    </div>
  );
}

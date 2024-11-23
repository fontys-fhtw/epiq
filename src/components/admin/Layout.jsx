"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_PREFIX = "/admin";

const NAV_ITEMS = [
  { name: "Home", path: "" },
  {
    name: "Menu",
    path: "/menu-management",
  },
  {
    name: "Tables",
    path: "/table-management",
  },
  {
    name: "Reservations",
    path: "/reservation-management",
  },
  {
    name: "Orders",
    path: "/order-management",
  },
  {
    name: "QR Codes",
    path: "/qr",
  },
];

export default function AdminLayout({ children }) {
  const currentPathname = usePathname();

  const isActive = (pathname) =>
    currentPathname === `${ADMIN_PREFIX}${pathname}`;

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href={`${ADMIN_PREFIX}/`}>
              <Image
                src="/logo.png"
                alt="EpiQ Admin Logo"
                width={40}
                height={40}
              />
            </Link>
            <div className="ml-10 flex space-x-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={`${ADMIN_PREFIX}${item.path}`}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(item.path)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}

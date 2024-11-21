"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_PREFIX = "/admin";

const NAV_ITEMS = [
  { name: "Home", path: "", icon: "/images/navbar/home.png" },
  {
    name: "Menu Management",
    path: "/menu-management",
    icon: "/images/navbar/menu.png",
  },
  {
    name: "Table Management",
    path: "/table-management",
    icon: "/images/navbar/table.png",
  },
  {
    name: "QR Code Generation",
    path: "/qr",
    icon: "/images/navbar/qr-code.png",
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
                  <Image
                    src={item.icon}
                    alt={`${item.name} Icon`}
                    width={24}
                    height={24}
                  />
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

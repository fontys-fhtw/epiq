"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_PREFIX = "/admin";

const PATHNAME = Object.freeze({
  HOME: "",
  MENU_MANAGEMENT: "/menu-management",
  QR_GENERATION: "/qr",
  TABLE_MANAGEMENT: "/table-management",
});

const NAV_ITEMS = [
  {
    name: "Home",
    path: PATHNAME.HOME,
    icon: "/images/navbar/home.png",
  },
  {
    name: "Menu Management",
    path: PATHNAME.MENU_MANAGEMENT,
    icon: "/images/navbar/menu.png",
  },
  {
    name: "Table Management",
    path: PATHNAME.TABLE_MANAGEMENT,
    icon: "/images/navbar/table.png",
  },
  {
    name: "QR Code Generation",
    path: PATHNAME.QR_GENERATION,
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="shrink-0">
              <Link href={`${ADMIN_PREFIX}${PATHNAME.HOME}`}>
                <Image
                  src="/logo.png"
                  alt="EpiQ Admin Logo"
                  width={40}
                  height={40}
                />
              </Link>
            </div>

            {/* Navigation Menu */}
            <div>
              <div className="ml-10 flex items-baseline space-x-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={`${ADMIN_PREFIX}${item.path}`}
                    className={`flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                      isActive(item.path)
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    aria-current={isActive(item.path) ? "page" : undefined}
                    title={item.name}
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
        </div>
      </nav>
      {children}
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_PREFIX = "/admin";

const PATHNAME = Object.freeze({
  HOME: "",
  MENU_MANAGEMENT: "/menu-management",
  QR_GENERATION: "/qr",
  TABLE_MANAGEMENT: "/table-management", // Added table management path
  // Add other admin routes as needed
});

// Define navigation items to avoid repetition
const NAV_ITEMS = [
  { name: "Home", path: PATHNAME.HOME },
  { name: "Menu Management", path: PATHNAME.MENU_MANAGEMENT },
  { name: "Table Management", path: PATHNAME.TABLE_MANAGEMENT }, // Added Table Management
  { name: "QR Code Generation", path: PATHNAME.QR_GENERATION },
  // Add other nav items as needed
];

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentPathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (pathname) =>
    currentPathname === `${ADMIN_PREFIX}${pathname}`;

  // Hide mobile menu when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPathname]);

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="shrink-0">
              <Link href={`${ADMIN_PREFIX}${PATHNAME.HOME}`}>
                <Image
                  src="/logo.png" // Replace with your logo path
                  alt="EpiQ Admin Logo"
                  width={40}
                  height={40}
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={`${ADMIN_PREFIX}${item.path}`}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      isActive(item.path)
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  // Menu Icon
                  <svg
                    className="size-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  // Close Icon
                  <svg
                    className="size-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={`${ADMIN_PREFIX}${item.path}`}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive(item.path)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      {children}
    </>
  );
}

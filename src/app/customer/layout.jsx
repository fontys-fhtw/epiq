"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const CUSTOMER_PREFIX = "/customer";

const PATHNAME = Object.freeze({
  LANDING_PAGE: "/",
  AUTH: "/auth",
  PROFILE: "/profile",
  RESERVATION: "/reservation",
});

export default function CustomerLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentPathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (pathname) => currentPathname === pathname;

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="shrink-0">
              <Link href={`${CUSTOMER_PREFIX}${PATHNAME.LANDING_PAGE}`}>
                <Image
                  src="/logo.png" // Replace with your logo path
                  alt="EpiQ Logo"
                  width={40}
                  height={40}
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href={`${CUSTOMER_PREFIX}${PATHNAME.LANDING_PAGE}`}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(`${CUSTOMER_PREFIX}${PATHNAME.LANDING_PAGE}`)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href={`${CUSTOMER_PREFIX}${PATHNAME.AUTH}`}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(`${CUSTOMER_PREFIX}${PATHNAME.AUTH}`)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href={`${CUSTOMER_PREFIX}${PATHNAME.PROFILE}`}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(`${CUSTOMER_PREFIX}${PATHNAME.PROFILE}`)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href={`${CUSTOMER_PREFIX}${PATHNAME.RESERVATION}`}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(`${CUSTOMER_PREFIX}${PATHNAME.RESERVATION}`)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Table Reservation
                </Link>
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
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  // Menu Icon
                  <svg
                    className="block size-6"
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
                    className="block size-6"
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
              <Link
                href={`${CUSTOMER_PREFIX}`}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(`${CUSTOMER_PREFIX}`)
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href={`${CUSTOMER_PREFIX}${PATHNAME.AUTH}`}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(`${CUSTOMER_PREFIX}${PATHNAME.AUTH}`)
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Log In
              </Link>
              <Link
                href={`${CUSTOMER_PREFIX}${PATHNAME.PROFILE}`}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(`${CUSTOMER_PREFIX}${PATHNAME.PROFILE}`)
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Profile
              </Link>
              <Link
                href={`${CUSTOMER_PREFIX}${PATHNAME.RESERVATION}`}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(`${CUSTOMER_PREFIX}${PATHNAME.RESERVATION}`)
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Table Reservation
              </Link>
            </div>
          </div>
        )}
      </nav>
      {children}
    </>
  );
}

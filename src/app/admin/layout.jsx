"use client";

import EpiQLogo from "@src/components/common/EpiQLogo";
import { ADMIN_NAV_ITEMS } from "@src/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_HEADER_PATHS = ["/admin/order-management"];

export default function AdminPageLayout({ children }) {
  const currentPathname = usePathname();

  return (
    <>
      {!HIDDEN_HEADER_PATHS.includes(currentPathname) && <Header />}
      {children}
    </>
  );
}

function Header() {
  const currentPathname = usePathname();

  const isActive = (itemPathname) => currentPathname === itemPathname;

  return (
    <nav className="bg-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <Link href="/admin">
              <EpiQLogo width={100} height={50} />
            </Link>
          </div>
          <div className="ml-10 hidden space-x-4 md:flex">
            {ADMIN_NAV_ITEMS.map((item) => (
              <Link
                target={item.newTab ? "_blank" : "_self"}
                key={item.name}
                href={item.path}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Open menu"
              aria-expanded="false"
            >
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
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {ADMIN_NAV_ITEMS.map((item) => (
            <Link
              target={item.newTab ? "_blank" : "_self"}
              key={item.name}
              href={item.path}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(item.path)
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

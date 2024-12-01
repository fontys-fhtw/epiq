"use client";

import { ADMIN_NAV_ITEMS } from "@src/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_HEADER_PATHS = ["/admin/order-management"];

export default function AdminPageLayout({ children }) {
  console.log(usePathname());
  return (
    <>
      {!HIDDEN_HEADER_PATHS.includes(usePathname()) && <Header />}
      {children}
    </>
  );
}

function Header() {
  const currentPathname = usePathname();

  const isActive = (itemPathname) => currentPathname === itemPathname;

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/admin">
            <Image
              src="/logo.png"
              alt="EpiQ Admin Logo"
              width={40}
              height={40}
            />
          </Link>
          <div className="ml-10 flex space-x-4">
            {ADMIN_NAV_ITEMS.map((item) => (
              <Link
                target={item.newTab ? "_blank" : "_self"}
                key={item.name}
                href={item.path}
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
  );
}

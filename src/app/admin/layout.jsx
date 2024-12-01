"use client";

import EpiQLogo from "@src/components/common/EpiQLogo";
import { ADMIN_NAV_ITEMS } from "@src/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminPageLayout({ children }) {
  return (
    <>
      <Header />
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
          <div>
            <Link href="/admin">
              <EpiQLogo width={100} height={50} />
            </Link>
          </div>
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

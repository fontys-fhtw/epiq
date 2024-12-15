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
      <div className="min-h-screen bg-darkBg">{children}</div>
    </>
  );
}

function Header() {
  const currentPathname = usePathname();

  const isActive = (itemPathname) => currentPathname === itemPathname;

  return (
    <nav className="fixed z-50 w-screen bg-dark">
      <div className="mx-auto max-w-7xl">
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
        </div>
      </div>
    </nav>
  );
}

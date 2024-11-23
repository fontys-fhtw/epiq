"use client";

import BurgerMenu from "@src/components/customer/BurgerMenu";
import Image from "next/image";
import Link from "next/link";

export default function CustomerPageLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

function Header() {
  return (
    <nav className="z-20 bg-gray-800">
      <div className="z-20 flex h-20 w-full items-center justify-between px-6">
        <div>
          <Link href="/customer">
            <Image src="/logo.png" alt="EpiQ Logo" width={40} height={40} />
          </Link>
        </div>
        <div>
          <BurgerMenu />
        </div>
      </div>
    </nav>
  );
}

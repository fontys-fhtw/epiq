"use client";

import IconButton from "@src/components/common/IconButton";
import NavigationLink from "@src/components/common/NavigationLink";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const CUSTOMER_PREFIX = "/customer";

const PATHNAME = Object.freeze({
  HOME: "",
  AUTH: "/auth",
  PROFILE: "/profile",
  MENU: "/menu",
});

// Define navigation items to avoid repetition
const NAV_ITEMS = [
  { name: "Home", path: PATHNAME.HOME },
  { name: "Log In", path: PATHNAME.AUTH },
  { name: "Profile", path: PATHNAME.PROFILE },
  { name: "Menu", path: PATHNAME.MENU },
];

export default function CustomerLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentPathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (pathname) => currentPathname === pathname;

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
              <Link href={`${CUSTOMER_PREFIX}${PATHNAME.HOME}`}>
                <Image
                  src="/logo.png" // Replace with your logo path
                  alt="EpiQ Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {NAV_ITEMS.map((item) => (
                  <NavigationLink
                    key={item.name}
                    href={`${CUSTOMER_PREFIX}${item.path}`}
                    isActive={isActive(`${CUSTOMER_PREFIX}${item.path}`)}
                  >
                    {item.name}
                  </NavigationLink>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <IconButton
                onClick={toggleMenu}
                variant="secondary"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </IconButton>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {NAV_ITEMS.map((item) => (
                <NavigationLink
                  key={item.name}
                  href={`${CUSTOMER_PREFIX}${item.path}`}
                  isActive={isActive(`${CUSTOMER_PREFIX}${item.path}`)}
                  className="block"
                >
                  {item.name}
                </NavigationLink>
              ))}
            </div>
          </div>
        )}
      </nav>
      {children}
    </>
  );
}

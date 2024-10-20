"use client";

import { getCustomerSession, signOut } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // To track the menu element

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const supabase = createSupabaseBrowserClient();

  const { data } = useQuery({
    queryKey: ["customer-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  const { mutate } = useMutation({
    mutationFn: () => {
      signOut(supabase);
      setUser(null);
      setIsLoggedIn(false);
    },
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    if (data && data.data.session) {
      setUser({
        avatarUrl:
          data.data.session.user.user_metadata?.avatar_url ||
          "/default-avatar.png",
      });
      setIsLoggedIn(true);
    }
  }, [data]);

  return (
    <header className="relative flex h-14 w-screen items-center bg-black md:h-20">
      <nav className="z-20 flex w-full items-center justify-between px-6 md:justify-center md:px-0">
        <div className="container mx-auto flex items-center justify-between">
          {/* App title centered */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-white">EpiQ</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                {/* Profile picture with click event */}
                <div
                  className="flex cursor-pointer items-center space-x-2"
                  onClick={toggleMenu}
                >
                  {user?.avatarUrl && (
                    <Image
                      src={user?.avatarUrl}
                      alt={`${user?.name || "User"}'s avatar`}
                      className="size-8 rounded-full border-2 border-white hover:border-blue-500"
                      width={40} // Use smaller width for mobile
                      height={40} // Use smaller height for mobile
                    />
                  )}
                  {/* Display user name beside the image (on larger screens) */}
                  {user?.name && (
                    <span className="hidden text-sm font-medium text-white md:inline-block">
                      {user.name}
                    </span>
                  )}
                </div>

                {/* Fullscreen Mobile Menu */}
                {isMenuOpen && (
                  <div className="fixed inset-0 z-50 flex flex-col space-y-4 bg-black p-6 text-center md:hidden">
                    {/* Close button for mobile menu */}
                    <button
                      type="button"
                      aria-label="Open"
                      onClick={toggleMenu}
                      className="self-end text-white"
                    >
                      <svg
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <Link
                      href="/customer/profile"
                      className="block w-full py-2 text-xl text-white"
                      passHref
                    >
                      Profile
                    </Link>
                    <hr className="mx-2" />
                    <button
                      type="button"
                      onClick={mutate}
                      className="block w-full py-2 text-xl text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}

                {/* Regular Dropdown Menu for larger screens */}
                {isMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 hidden w-48 rounded-md border-2 border-neutral-800 bg-black py-2 shadow-lg md:block">
                    <Link
                      href="/customer/profile"
                      className="block px-4 py-2 text-white hover:bg-neutral-700"
                      passHref
                    >
                      Profile
                    </Link>
                    <hr className="mx-2" />
                    <button
                      type="button"
                      onClick={mutate}
                      className="block w-full px-4 py-2 text-left text-white hover:bg-neutral-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/customer/login"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                passHref
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

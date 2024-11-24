"use client";

import {
  DocumentTextIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { CUSTOMER_NAV_ITEMS } from "@src/constants";
import { getCustomerSession, signOut } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import getBaseUrl from "@src/utils/url";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import ActionButton from "../common/ActionButton";

const BurgerMenu = () => {
  const currentPathname = usePathname();
  const router = useRouter();

  const supabase = createSupabaseBrowserClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSetOpen = () => setIsOpen((value) => !value);

  const isActive = (itemPathname) => currentPathname === itemPathname;

  const { mutate: mutateSignOut, isLoading: isLoadingSignOut } = useMutation({
    mutationFn: () => signOut(supabase),
    onSuccess: () => {
      router.push(getBaseUrl().customer);
      setIsOpen(false);
      setIsLoggedIn(false);
    },
  });

  const { data: sessionData } = useQuery({
    queryKey: ["user-session"],
    queryFn: () => getCustomerSession(supabase),
  });

  useEffect(() => {
    if (sessionData) {
      setIsLoggedIn(true);
    }
  }, [sessionData]);

  const icons = {
    home: HomeIcon,
    login: UserIcon,
    profile: UserIcon,
    menu: DocumentTextIcon,
  };

  return (
    <>
      <div
        className={`absolute right-0 top-0 flex origin-top-right items-center justify-center overflow-hidden bg-dark transition-all duration-500 ${
          isOpen
            ? "h-screen w-screen translate-x-0 translate-y-0"
            : "size-0 -translate-y-full translate-x-full opacity-0"
        }`}
      >
        <nav>
          <ul className="flex flex-col gap-4">
            {CUSTOMER_NAV_ITEMS.map(({ name, path, newTab, iconKey }) => {
              const IconComponent = icons[iconKey];
              return (
                <li key={`${name}#${path}#${newTab}}`} className="size-fit">
                  <Link
                    onClick={handleSetOpen}
                    href={path}
                    target={newTab ? "_blank" : "_self"}
                    className={`flex items-center justify-between gap-2 text-center text-4xl ${
                      isActive(path) ? "text-gold" : "text-white"
                    }
                    `}
                  >
                    <IconComponent className="size-8" />
                    <div>
                      <span>{name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {isLoggedIn && (
          <div className="absolute bottom-8 flex w-full items-center justify-center">
            <ActionButton
              onClick={mutateSignOut}
              disabled={isLoadingSignOut}
              className={`${isLoadingSignOut ? "cursor-not-allowed" : ""} w-1/3 text-xl font-semibold`}
            >
              Log Out
            </ActionButton>
          </div>
        )}
      </div>

      <div onClick={handleSetOpen} className="flex items-center justify-center">
        <input
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
          type="checkbox"
          role="button"
          aria-label="Display the menu"
          style={{ "--c": isOpen ? "white" : "gold" }}
          className="menu"
        />
      </div>
    </>
  );
};

export default BurgerMenu;

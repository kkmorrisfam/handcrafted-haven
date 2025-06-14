"use client";

import { BookImage, House, Menu, Package, ShoppingCart, X } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCartCount } from "@/app/lib/useCartCount";

const links = [
  { name: "Home", href: "/", icon: House },
  { name: "Catalog", href: "/catalog", icon: BookImage },
  { name: "Artisans", href: "/sellers", icon: Package },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
];

export default function Nav() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        // 768px is Tailwind's md breakpoint
        setIsOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="flex items-center gap-2">
      <div className="flex justify-flex items-center">
        <button
          className="md:hidden flex flex-col space-y-1 cursor-pointer text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Hamburger Menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
        {!isOpen && (
          <ul className="hidden md:flex md:gap-1 ">
            {links.map((link) => {
              const LinkIcon = link.icon;
              const isCart = link.name === "Cart";

              return (
                <li key={link.name} 
                className={clsx(
                    "relative text-white p-3 rounded-md transition-all ease-in-out duration-300",
                    {
                      "bg-[var(--secondary)]": pathname === link.href,
                      "hover:bg-[var(--secondary)]": pathname !== link.href,
                    }
                  )}><Link
                  
                  href={link.href}
                  title={link.name}
                  
                >
                  <LinkIcon className="w-5 h-5" />
                  {isCart && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link></li>
              );
            })}
          </ul>
        )}
        {isOpen && (
          <ul className="flex flex-col justify-center h-full w-90 gap-1 fixed left-0 top-0 bg-[var(--primary-transparent)] md:hidden z-10 transition-all animate-open-right">
            {links.map((link) => {
              const LinkIcon = link.icon;
              const isCart = link.name === "Cart";
              return (
                <li
                  key={link.name}
                  className={clsx(
                    "relative text-[var(--secondary)] p-3 transition-all ease-in-out duration-300 flex justify-center items-center gap-2",
                    {
                      "bg-[var(--secondary)] text-white":
                        pathname === link.href,
                      "hover:bg-[var(--secondary)] hover:text-white":
                        pathname !== link.href,
                    }
                  )}
                >
                  <Link
                    href={link.href}
                    title={link.name}
                    onClick={() => setIsOpen(false)}
                    className="grid grid-cols-[30px_70px] items-center text-center"
                  >
                    <LinkIcon className="w-5 h-5 block" />
                    {link.name}
                    {isCart && cartCount > 0 && (
                      <span className="absolute top-3.5 right-30 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}{" "}
      </div>
    </nav>
  );
}

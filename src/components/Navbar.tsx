"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const Navbar = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="fixed w-full h-auto z-1 "
      >
        <div
          className={`${
            !isDashboard
              ? "flex justify-between items-center"
              : "fixed right-0 top-0 -mr-40 md:"
          }`}
        >
          <div className="w-64 ml-4 md:ml-32 lg:ml-48 xl:ml-64 mt-4 ">
            <Link href="/" className="cursor-pointer">
              {isDashboard ? (
                ""
              ) : (
                <div className="flex flex-row items-center">
                  <Image
                    alt="logo Vimayla"
                    width={75}
                    height={75}
                    src="/vimayla_logo.png"
                  />
                  <div className="relative w-[150px] h-[50px] -ml-2">
                    <Image
                      alt="name 'Vimayla'"
                      src="/vimayla.svg"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </Link>
          </div>
          <div className="w-64 ml-4 md:ml-32 lg:ml-48 xl:ml-64 mt-4 ">
            <ModeToggle />
          </div>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="fixed w-full h-auto z-1 "
    >
      <div className="flex justify-between items-center">
        <div className="w-64 ml-4 md:ml-32 lg:ml-48 xl:ml-64 mt-4 ">
          <Link href="/" className="cursor-pointer">
            <div className="flex flex-row items-center">
              <Image
                alt="logo Vimayla"
                width={75}
                height={75}
                src="/vimayla_logo.png"
              />
              <div className="relative w-[150px] h-[50px] -ml-2">
                <Image
                  alt="name 'Vimayla'"
                  src="/vimayla.svg"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </Link>
        </div>
        <div className="w-64 ml-4 md:ml-32 lg:ml-48 xl:ml-64 mt-4 ">
          <ModeToggle />
        </div>
      </div>
    </motion.div>
  );
};

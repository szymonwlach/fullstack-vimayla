"use client";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
export const Hero = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Learn{" "}
          <span className="bg-gradient-to-r from-[#5EE7DF] to-[#B490CA] bg-clip-text text-transparent">
            Anything
          </span>
          , Instantly. Powered by{" "}
          <span className="bg-gradient-to-r from-[#5EE7DF] to-[#B490CA] bg-clip-text text-transparent">
            AI
          </span>
          .
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          The pain fades. The learning stays.
        </div>

        <button
          onClick={handleClick}
          className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 cursor-pointer"
        >
          Start Now
        </button>
      </motion.div>
    </AuroraBackground>
  );
};

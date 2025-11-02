"use client";
import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: 0.3,
        duration: 2.5,
        ease: "easeInOut",
      }}
      className="flex flex-col text-center items-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-12 md:mt-20 text-center p-5 mt-24">
        <span className="bg-gradient-to-r from-[#5EE7DF] to-[#B490CA] bg-clip-text text-transparent">
          Welcome back!
        </span>{" "}
        Sign in to continue your AI-powered learning journey.
      </h1>

      <div className="">
        <SignIn forceRedirectUrl="/dashboard" signUpUrl="/sign-up" />
      </div>
    </motion.div>
  );
}

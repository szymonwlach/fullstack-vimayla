"use client";
import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
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
      className="flex flex-col text-center items-center min-h-screen justify-center mt-60 overflow-hidden"
    >
      <h1 className="text-4xl md:text-5xl font-bold m-6">
        Start your{" "}
        <span className="bg-gradient-to-r from-[#5EE7DF] to-[#B490CA] bg-clip-text text-transparent">
          AI-powered
        </span>{" "}
        learning journey today.
      </h1>

      <div className=" mt-5 md:mt-10">
        <SignUp forceRedirectUrl="/dashboard" signInUrl="/sign-in" />
      </div>
    </motion.div>
  );
}

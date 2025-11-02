"use client";

import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
export function TypewriterEffect() {
  const words = [
    { text: "Start" },
    {
      text: "your",
    },
    {
      text: "first",
      className:
        "bg-gradient-to-r from-[#5EE7DF] to-[#B490CA] bg-clip-text text-transparent",
    },
    { text: "learning" },
    {
      text: "path",
      className:
        "bg-gradient-to-r from-[#5EE7DF] to-[#B490CA] bg-clip-text text-transparent",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[15rem] ">
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        {/* <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          Signup
        </button> */}
      </div>
    </div>
  );
}

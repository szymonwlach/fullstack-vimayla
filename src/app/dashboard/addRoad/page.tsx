import { ProfileForm } from "@/components/Form";
import { TypewriterEffect } from "@/components/TypeWritter";
import React from "react";

const page = () => {
  return (
    <div className="w-auto h-screen">
      <div className="text-center">
        <h1 className="dark:text-slate-200 text-4xl text-gray-800 font-semibold "></h1>
        <TypewriterEffect />
      </div>
      <div className="w-[50%] mx-auto">
        <ProfileForm />
      </div>
    </div>
  );
};

export default page;

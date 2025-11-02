"use client";
import React from "react";
import { motion } from "framer-motion";
import { LearningPaths } from "@/components/LearningPaths";
// import LearningPath from "@/components/LearningPath";
export default function Dashboard() {
  return (
    <motion.div
      className="text-left block"
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      {/* <LearningPath /> */}
      <LearningPaths />
    </motion.div>
  );
}

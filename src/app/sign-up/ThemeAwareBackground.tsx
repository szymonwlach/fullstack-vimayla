"use client";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeAwareBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 dark:bg-slate-900"
      >
        {children}
      </div>
    );
  }

  const backgroundFill = resolvedTheme === "dark" ? "#0f172a" : "#f0f9ff";

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={
        {
          "--wavy-bg-color": backgroundFill,
          backgroundColor: backgroundFill,
        } as React.CSSProperties
      }
    >
      <WavyBackground
        key={resolvedTheme}
        backgroundFill={backgroundFill}
        className="max-w-4xl mx-auto pb-40 md:pb-60"
      >
        {children}
      </WavyBackground>
    </div>
  );
}

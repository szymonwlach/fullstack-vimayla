import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import ThemeAwareBackground from "../ThemeAwareBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
    >
      <ThemeAwareBackground>{children}</ThemeAwareBackground>
    </div>
  );
}

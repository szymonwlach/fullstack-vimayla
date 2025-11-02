"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { ClientOnlyBgWrapper } from "@/components/ClientOnlyBgWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-screen flex`}
        >
          <ClientOnlyBgWrapper>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1 overflow-y-auto">
                {/* <Navbar /> */}
                <SidebarTrigger />
                {children}
              </main>
            </SidebarProvider>
          </ClientOnlyBgWrapper>
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "../components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Content Generator",
  description: "Generate and view content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary text-fg-primary min-h-screen`}
      >
        <ClerkProvider>
          <Providers>
            <Navbar />
            <main className="min-h-screen py-8 px-6 max-w-7xl mx-auto">
              {children}
            </main>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}

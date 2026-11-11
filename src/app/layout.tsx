import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Geist_Mono } from "next/font/google";
import PublicFontStylesheet from "../components/PublicFontStylesheet";
import SiteNavigation from "../components/SiteNavigation";
import "./globals.css";


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Corner",
  description: "Explore typography and interactive quizzes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full bg-black antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <SiteNavigation />
        <PublicFontStylesheet />
        {children}
      </body>
    </html>
  );
}

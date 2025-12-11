// app/auth/layout.tsx
import React from "react";
import { Anton, Inter } from "next/font/google";

const anton = Anton({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${anton.variable} ${inter.variable} antialiased`}>
      {children}
    </div>
  );
}

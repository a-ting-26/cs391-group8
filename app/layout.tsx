import MapboxStyles from "./mapbox-styles";
// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
// (optional) fonts:
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "BU Food Finder",
  description: "Find free food on campus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <MapboxStyles />
        {children} 
      </body>
    </html>
  );
}

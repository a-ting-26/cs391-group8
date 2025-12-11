import MapboxStyles from "./mapbox-styles";
// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
// (optional) fonts:
import { Geist, Geist_Mono, Anton, Inter } from "next/font/google";
const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const anton = Anton({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BU Food Finder",
  description: "Find free food on campus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${inter.variable} antialiased min-h-screen`}>
        <MapboxStyles />
        {children} 
      </body>
    </html>
  );
}

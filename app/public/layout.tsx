import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "../globals.css"; // use relative path (since this layout is inside /public)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BU Food Finder | Discover Free Food on Campus",
  description:
    "Your campus guide to free food, less waste, and more connection.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} 
      antialiased bg-[#A7E0A3] text-emerald-900 min-h-screen flex flex-col`}
    >
      {/* Optional Navbar/Header for public pages */}
      {/* <Navbar /> */}

      <main className="flex-1">{children}</main>

      {/* Optional footer */}
      {/* <footer className="py-4 text-center text-sm text-emerald-800">
        © {new Date().getFullYear()} BU Food Finder
      </footer> */}
    </div>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "../globals.css";

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
    title: "FAQs | BU Food Finder",
    description:
        "Frequently asked questions about BU Food Finder - your campus guide to free food.",
};

export default function FRQLayout({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} 
       antialiased bg-[#A5F3FC] text-emerald-900 min-h-screen flex flex-col`}
        >
            <main className="flex-1">{children}</main>
        </div>
    );
}
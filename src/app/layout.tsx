import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RuneBind - Professional PDF Tools",
  description:
    "Fast, secure, and privacy-focused PDF tools for merging, splitting, compressing, and converting PDFs. No registration required.",
  keywords:
    "PDF tools, merge PDF, split PDF, compress PDF, convert PDF, PDF editor",
  authors: [{ name: "RuneBind" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main className="">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

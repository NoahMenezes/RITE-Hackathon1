import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "FocusFlow - Supercharge Your Productivity",
  description:
    "The ultimate productivity suite for modern creators and builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased dark", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-transparent relative overflow-x-hidden font-sans">
        <div className="fixed inset-0 bg-black/10 -z-40 pointer-events-none" />
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}

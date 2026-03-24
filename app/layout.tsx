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
      <body className="min-h-screen flex flex-col bg-background font-sans">
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}

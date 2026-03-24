import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FocusFlow - Supercharge Your Productivity",
  description: "The ultimate productivity suite for modern creators and builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-transparent relative overflow-x-hidden">
        <video
          className="fixed top-0 left-0 w-full h-full object-cover -z-50 pointer-events-none brightness-[1.0] contrast-100"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="fixed inset-0 bg-black/10 -z-40 pointer-events-none" />
        {children}
      </body>
    </html>
  );
}

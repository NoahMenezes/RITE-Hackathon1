import React from "react";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <Navbar />
      <div className="flex-1 pt-32 w-full">
        {children}
      </div>
    </div>
  );
}

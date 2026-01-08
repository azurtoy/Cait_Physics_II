import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Physics II - Halliday 12th Edition",
  description: "Self-study website for Physics based on Halliday, Resnick & Walker's Fundamentals of Physics, 12th Edition",
};

export default function StudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64">
        {children}
      </main>
    </div>
  );
}

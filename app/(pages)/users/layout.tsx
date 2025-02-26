import type { Metadata } from "next";
import { DashboardNav } from "@/app/Components/DashboardNav";
import { UserNav } from "@/app/Components/ui/user-nav";
import { ThemeToggle } from "@/app/Components/ThemeToggle";
import { ThemeProvider } from "@/app/Components/ThemeProvider";

export const metadata: Metadata = {
  title: "Fika Safe",
  description: "A comprehensive system for tracking, reporting, and managing missing marks at Masinde Muliro University of Science and Technology (MMUST). Facilitates efficient communication and resolution for academic records.",
//   icons: {
//     icon: [
//       {
//         url: '/images/icon.jpg',
//         href: '/images/icon.jpg',
//       }
//     ],
//   },
};

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div> 
      <div className="max-h-screen flex-col">
          <header className="border-b">
            <div className="h-16  px-4">
                <UserNav />
            </div>
          </header>
          <div className="flex">
            <DashboardNav />
            <main className="md:p-8 py-2 px-1">{children}</main>
          </div>
      </div>
    </div>
    </>
  );
}

import type { Metadata } from "next";
import { UserNav } from "@/app/Components/ui/user-nav";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/utils/authOptions";
import { DashboardNav } from "@/app/Components/DashboardNav";

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
export default async function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if(!session){
    redirect('/')
  }
  const userRole = session?.userRole;
  if(userRole === 'ADMIN'){
    redirect('/admin')
  } else if(userRole === 'CARRIER' || userRole === 'POLICE' || userRole === 'AMBULANCE'){
    redirect('/responder')
  }
  return (
    <>
    <div> 
      <div className="max-h-screen flex-col">
          <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-16 px-4">
                <UserNav />
            </div>
          </header>
          <div className="flex-1 flex overflow-hidden">
            <DashboardNav />
            <main className="flex-1 overflow-x-clip overflow-y-auto">{children}</main>
          </div>
      </div>
    </div>
    </>
  );
}

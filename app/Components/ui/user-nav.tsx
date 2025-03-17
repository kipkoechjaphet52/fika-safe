"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/Components/ui/avatar";
import { Button } from "@/app/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/Components/ui/dropdown-menu";
import { LogOut, ShieldPlus, User } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Settings from "../users/Settings";
import { signOut } from "next-auth/react";
import { fetchProfile } from "@/app/lib/action";
import { UserRole } from "@prisma/client";

const routes = {
  USER: [
    {
      title: "Dashboard",
      href: "/users",
    },
    {
      title: "Live Maps",
      href: "/users/maps",
    },
    {
      title: "Incidents",
      href: "/users/incidents",
    },
    {
      title: "Help",
      href: "/users/help",
    },
    {
      title: "Settings",
      href: "#settings",
    },
  ],
  ADMIN: [
    {
      title: "Dashboard",
      href: "/admin",
    },
    {
      title: "Users",
      href: "/admin/users",
    },
    {
      title: "Incidents",
      href: "/admin/incidents",
    },
    {
      title: "Logs",
      href: "/admin/logs",
    },
    {
      title: "Settings",
      href: "#settings",
    },
  ],
}

interface UserProfile{
  id: string;
  firstName: string;
  secondName: string;
  phoneNumber: string;
  email: string;
  password: string;
  profilePic: string | null;
  createdAt: Date;
  userRole: UserRole;
}
export function UserNav() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const avatar = `${profile?.firstName.substring(0, 1).toUpperCase()} ${profile?.secondName.substring(0, 1).toUpperCase()}`;
  const name = `${profile?.firstName} ${profile?.secondName}`;
  const userEmail = profile?.email;

  useEffect(() => {
    const handleProfile = async () => {
      try{
        const user = await fetchProfile();
        setProfile(user);
      }catch(error){
        console.error("Error fetching profile: ", error);
      }
    }
    handleProfile();
  },[]);

  const pathname = usePathname();

  const userRole = pathname.includes("/admin")
    ? ["ADMIN", "EMERGENCY_RESPONDER", "POLICE"].includes("ADMIN")
    : "USER";

  const currentRoutes = routes[userRole as keyof typeof routes];

  const handleLogout = () => {
    signOut({callbackUrl: '/'})
  };
  return (
    <div className="ml-auto flex items-center justify-between ">
      <div className="flex items-center gap-2 px-2 pt-4">
        <ShieldPlus className="h-6 w-6" />
        <span className="font-semibold">Fika Safe</span>
      </div>
        <nav className="items-center space-x-6 text-sm font-medium hidden md:block">
          <div className="flex flex-row">
            {currentRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href === "#settings" ? "#" : route.href}
                onClick={(e) => {
                  if (route.href === "#settings") {
                    e.preventDefault(); // Prevent page reload
                    setIsSettingsOpen(true); // Open settings dialog
                  }
                }}
                className={clsx(
                  "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-primary after:transition-all after:duration-500",
                  pathname === route.href
                    ? " text-primary after:w-full"
                    : "hover:bg-muted"
                )}
              >
                {route.title}
              </Link>
            ))}
          </div>
        </nav>
      <div className="flex space-x-4 space-y-3 items-center">
        <div className="mt-3">
          <ThemeToggle />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="User avatar" />
                <AvatarFallback>{avatar}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
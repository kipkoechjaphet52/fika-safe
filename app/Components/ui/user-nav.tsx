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
import { Bell, LogOut, Menu, ShieldPlus, User } from "lucide-react";
import { ThemeToggle } from '@/app/Components/ThemeToggle'
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Settings from "../users/Settings";
import { signOut } from "next-auth/react";
import { fetchAlerts, fetchProfile, fetchStaffProfile } from "@/app/lib/action";
import { AlertStatus, UserRole } from "@prisma/client";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import useLocationTracker from "@/app/hooks/useLocationTracker";
import { io } from "socket.io-client";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  HelpCircleIcon,
  SettingsIcon,
  XIcon,
  MenuIcon,
  MapIcon,
  MapPin,
} from "lucide-react";

const socket = io("http://localhost:49160", { transports: ["websocket"] });

interface UserProfile {
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

interface Alert {
  id: string;
  createdAt: Date;
  userId: string;
  message: string;
  status: AlertStatus;
}
interface NearbyUsersAlert {
  alerts: Alert[]; // Filtered alerts for the specific user
  message: string; // Alert message for the user
  alertId: string; // ID of the specific alert
}

const routes = {
  ADMIN: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Incidents",
      icon: MapPin,
      href: "/admin/incidents",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
    },
  ],
  RESPONDER: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/responder",
    },
    {
      title: "Maps",
      icon: MapIcon,
      href: "/responder/maps",
    },
    {
      title: "Incidents",
      icon: MapPin,
      href: "/responder/incidents",
    },
    {
      title: "Help",
      icon: HelpCircleIcon,
      href: "/responder/help",
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      href: "#settings",
    },
  ],
  USER: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/users",
    },
    {
      title: "Live Maps",
      icon: MapIcon,
      href: "/users/maps",
    },
    {
      title: "Incidents",
      icon: MapPin,
      href: "/users/incidents",
    },
    {
      title: "Help",
      icon: HelpCircleIcon,
      href: "/users/help",
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      href: "#settings",
    },
  ],
};

export function UserNav() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const avatar = profile?.profilePic || "";
  const avatarFallback = `${profile?.firstName?.[0]?.toUpperCase() ?? ""}${profile?.secondName?.[0]?.toUpperCase() ?? ""}`;
  const name = `${profile?.firstName ?? ""} ${profile?.secondName ?? ""}`;
  const userEmail = profile?.email;
  const userId = profile?.id;

  useLocationTracker();

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const user = await fetchProfile();
        const staff = await fetchStaffProfile();
        setProfile(staff || user);
      } catch (error) {
        console.error("Error fetching profile: ", error);
      }
    };
    handleProfile();
  }, []);

  useEffect(() => {
    const handleAlerts = async () => {
      try {
        const alerts = await fetchAlerts();
        setAlerts(alerts || []);
      } catch (error) {
        console.error("Error fetching alerts: ", error);
      }
    };
    handleAlerts();
  }, []);

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);
    console.log("🟢 Joined room:", userId);

    socket.on("newAlert", (data) => {
      console.log("🔴 New Alert Received:", data);

      const newAlerts = Array.isArray(data.alerts) ? data.alerts : [data.alerts];
      setAlerts((prev) => [...prev, ...newAlerts]);
    });

    return () => {
      socket.off("newAlert");
    };
  }, [userId]);

  const pathname = usePathname();

  const userRole =
    pathname.includes("/admin")
      ? "ADMIN"
      : pathname.includes("/responder")
        ? "RESPONDER"
        : "USER";

  const currentRoutes = routes[userRole as keyof typeof routes];

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="ml-auto flex items-center justify-between ">
      <div className="flex items-center gap-2 px-2 pt-4">
        <ShieldPlus className="h-6 w-6" />
        <span className="font-semibold">Fika Safe</span>
      </div>

      <div className="flex space-x-4 space-y-3 items-center">
        {userRole !== "ADMIN" && (
          <div className="mt-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className="border-2 border-gray-300">
                  {alerts.some(alert => alert.status === "UNREAD") ? (
                    <BellAlertIcon className="h-[1.2rem] w-[1.2rem] animate-shake" />
                  ) : (
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 overflow-y-scroll h-[40vh]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {Array.isArray(alerts) && alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                      <DropdownMenuItem key={index}>
                        <span>{alert.message}</span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem>
                      <span>No new notifications</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div className="mt-3 hidden md:block">
          <ThemeToggle />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Mobile screen */}
      <div className="mt-3 md:hidden">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col h-full">
              <nav className="flex flex-col h-full items-center justify-center w-full gap-3">
                {currentRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href === "#settings" ? "#" : route.href}
                    onClick={(e) => {
                      if (route.href === "#settings") {
                        e.preventDefault();
                        setIsSettingsOpen(true);
                      }
                    }}
                    className={clsx(
                      "relative flex items-center gap-3 px-3 py-2",
                      pathname === route.href
                        ? " text-primary after:w-full"
                        : "hover:bg-muted"
                    )}
                  >
                    {route.title}
                  </Link>
                ))}
                <ThemeToggle />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
"use client";

import { cn } from "@/app/lib/utils";
import {
  BookOpen,
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routes = {
  ADMIN: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { title: "Incidents", icon: MapPin, href: "/admin/incidents" },
    { title: "Users", icon: Users, href: "/admin/users" },
    { title: "Programs", icon: GraduationCap, href: "/admin/programs" },
    { title: "Courses", icon: BookOpen, href: "/admin/courses" },
  ],
  USER: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/users" },
    { title: "Live Maps", icon: MapIcon, href: "/users/maps" },
    { title: "Incidents", icon: MapPin, href: "/users/incidents" },
    { title: "Help", icon: HelpCircleIcon, href: "/users/help" },
    { title: "Settings", icon: SettingsIcon, href: "/users/settings" },
  ],
};

export function DashboardNav() {
  const pathname = usePathname();
  const userRole = pathname.includes("/admin") ? "ADMIN" : "USER";
  const currentRoutes = routes[userRole as keyof typeof routes];

  const [isOpen, setIsOpen] = useState(false);
  const toggleNav = () => setIsOpen((prev) => !prev);
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="hidden md:block w-64 bg-gray-900 text-white min-h-screen p-4 shadow-lg">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">Fika Safe</h2>
          <div className="space-y-2">
            {currentRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
                  pathname === route.href
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-800"
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Mobile Toggle Button */}
          <button className="md:hidden text-gray-700" onClick={toggleNav}>
            {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Report Incident Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900">Report an Incident</h2>
          <p className="text-sm text-gray-600 mb-4">Submit a new incident report</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Incident Title" />
            <input className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Street Name" />
            <select className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
              <option>Select type of incident</option>
            </select>
            <select className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
              <option>Select a level of severity</option>
            </select>
          </div>

          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Submit Report
          </button>
        </div>

        {/* Incident History */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900">Incidents History</h2>
          <p className="text-sm text-gray-600 mb-4">Your reported incidents and their status</p>

          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Incident Type</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Reported On</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border text-center text-gray-600" colSpan={5}>No reports found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Issue Indicator */}
      <button className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition">
        2 Issues
      </button>
    </div>
  );
}

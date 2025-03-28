"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Add User
  const addUser = async () => {
    const newUser = {
      firstName: "New",
      secondName: "User",
      email: `new${Date.now()}@example.com`,
      phone: "123-456-7890",
      role: "USER",
    };

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Failed to add user");

      const addedUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, addedUser]);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Delete User
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="mb-4" onClick={addUser}>
            Add User
          </Button>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Phone No.</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.phone}</td>
                    <td className="border p-2">{user.role}</td>
                    <td className="border p-2">{user.status}</td>
                    <td className="border p-2">
                      <Button variant="destructive" onClick={() => deleteUser(user.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
=======
import { Card, CardContent, CardHeader, CardTitle } from '@/app/Components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Users, AlertTriangle, Shield } from "lucide-react";

// Sample Data
const data = [
  { name: "Jan", incidents: 30 },
  { name: "Feb", incidents: 45 },
  { name: "Mar", incidents: 25 },
  { name: "Apr", incidents: 50 },
];

export default function AdminPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Incidents</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">150</span>
            <AlertTriangle className="text-red-500 w-10 h-10" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">500</span>
            <Users className="text-blue-500 w-10 h-10" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Emergency Responders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">75</span>
            <Shield className="text-green-500 w-10 h-10" />
          </CardContent>
        </Card>
      </div>

      {/* Incidents Overview Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Incidents Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
>>>>>>> main
        </CardContent>
      </Card>
    </div>
  );
}

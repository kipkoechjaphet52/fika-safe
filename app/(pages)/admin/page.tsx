"use client";

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
        </CardContent>
      </Card>
    </div>
  );
}

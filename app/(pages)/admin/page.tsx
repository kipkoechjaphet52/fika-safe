"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { Button } from "@/app/Components/ui/button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  // Fetch Users from API
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Add User Function
  const addUser = async () => {
    const newUser = { id: Date.now().toString(), name: "New User", email: "new@example.com", role: "User" };

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      setUsers((prevUsers) => [...prevUsers, newUser]); // Update UI
    }
  };

  // Delete User Function
  const deleteUser = async (id: string) => {
    const response = await fetch(`/api/users?userId=${id}`, { method: "DELETE" });

    if (response.ok) {
      setUsers(users.filter((user) => user.id !== id)); // Update UI
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="mb-4" onClick={addUser}>Add User</Button>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">
                    <Button variant="destructive" onClick={() => deleteUser(user.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

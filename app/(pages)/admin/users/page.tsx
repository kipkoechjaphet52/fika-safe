"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { Button } from "@/app/Components/ui/button";

interface User {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  phone: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    secondName: "",
    phoneNumber: "",
    email: "",
    password: "",
    profilePic: "", // Optional
    userRole: "",   // Default to an empty string, the dropdown will handle role selection
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle adding a user
  const handleAddUser = async () => {
    try {
      // Validation for empty fields (excluding profilePic)
      if (!newUser.firstName || !newUser.secondName || !newUser.phoneNumber || !newUser.email || !newUser.password || !newUser.userRole) {
        alert("All fields except Profile Pic are required.");
        return;
      }

      // Add the newUser object to the API
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error creating user:", errorData.message || "Unknown error");
        alert("Failed to add user");
        return;
      }

      // Clear form after successful submission
      setNewUser({
        firstName: "",
        secondName: "",
        phoneNumber: "",
        email: "",
        password: "",
        profilePic: "",  // Optional
        userRole: "",    // Reset the role
      });

      // Fetch updated users list
      fetchUsers();
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add User Form */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Second Name"
              value={newUser.secondName}
              onChange={(e) => setNewUser({ ...newUser, secondName: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Profile Pic URL (Optional)"
              value={newUser.profilePic}
              onChange={(e) => setNewUser({ ...newUser, profilePic: e.target.value })}
              className="border p-2 mr-2"
            />

            {/* User Role Dropdown */}
            <select
              value={newUser.userRole}
              onChange={(e) => setNewUser({ ...newUser, userRole: e.target.value })}
              className="border p-2 mr-2"
            >
              <option value="" disabled>Select a Role</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="POLICE">Police</option>
              <option value="AMBULANCE">Ambulance</option>
              <option value="CARRIER">Carrier</option>
            </select>

            <Button onClick={handleAddUser}>Add User</Button>
          </div>

          {/* User List */}
          <table className="w-full border">
            <thead>
              <tr className="border-b">
                <th className="p-2">First Name</th>
                <th className="p-2">Second Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.firstName}</td>
                  <td className="p-2">{user.secondName}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <Button className="bg-red-500" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </Button>
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

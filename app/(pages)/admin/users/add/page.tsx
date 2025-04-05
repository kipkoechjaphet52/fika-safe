"use client";

import { useRouter } from "next/navigation";
import UserForm from "@/app/Components/forms/UserForm";

export default function AddUserPage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      // Convert FormData to JSON
      const userData = Object.fromEntries(formData.entries());
      
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User created successfully!");
        router.push("/admin/users");
        router.refresh(); // Refresh the page to show new data
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to create user"}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New User</h1>
      <UserForm/>
    </div>
  );
}
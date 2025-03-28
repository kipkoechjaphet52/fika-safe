"use client";

import { useRouter } from "next/navigation";
import UserForm from "@/app/Components/forms/UserForm";


export default function AddUserPage() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User created successfully!");
        router.push("/admin/users"); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
}
 

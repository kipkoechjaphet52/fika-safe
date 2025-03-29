"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input"; // ✅ Ensure the correct case
import { Button } from "@/components/ui/button"; // ✅ Ensure the correct case

// ✅ Define the expected type for onSubmit
interface UserFormProps {
  onSubmit: (formData: { firstName: string; secondName: string }) => void;
}

export default function UserForm({ onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData); // ✅ Ensure onSubmit is correctly used
      }}
      className="space-y-4"
    >
      <Input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <Input
        name="secondName"
        value={formData.secondName}
        onChange={handleChange}
        placeholder="Second Name"
        required
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

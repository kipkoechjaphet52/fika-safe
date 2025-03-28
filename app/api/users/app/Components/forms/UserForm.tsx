"use client";

import { useState } from "react";
import Input from "@/Components/ui/input"; 
import Button from "@/Components/ui/button"; 

export default function UserForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    phoneNumber: "",
    email: "",
    password: "",
    profilePic: "",
    userRole: "USER",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-lg">
      <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
      <Input label="Second Name" name="secondName" value={formData.secondName} onChange={handleChange} required />
      <Input label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required />
      <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
      <Input label="Profile Picture URL" name="profilePic" value={formData.profilePic} onChange={handleChange} />

      <div className="flex gap-2">
        <label className="font-medium">User Role:</label>
        <select name="userRole" value={formData.userRole} onChange={handleChange} className="border p-2 rounded">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="POLICE">Police</option>
          <option value="EMERGENCY_RESPONDER">Emergency Responder</option>
        </select>
      </div>

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}
 

import React, { useState } from "react";
import { Input } from "@/app/Components/ui/input";
import { Button } from "@/app/Components/ui/button";

export default function UserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    phoneNumber: "",
    email: "",
    password: "",
    profilePic: "",
    userRole: "USER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Add New User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <Input 
              type="text" 
              name="firstName" 
              placeholder="Enter first name"
              value={formData.firstName} 
              onChange={handleChange} 
              className="w-full"
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Second Name</label>
            <Input 
              type="text" 
              name="secondName" 
              placeholder="Enter second name"
              value={formData.secondName} 
              onChange={handleChange} 
              className="w-full"
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <Input 
              type="tel" 
              name="phoneNumber" 
              placeholder="Enter phone number"
              value={formData.phoneNumber} 
              onChange={handleChange} 
              className="w-full"
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <Input 
              type="email" 
              name="email" 
              placeholder="Enter email address"
              value={formData.email} 
              onChange={handleChange} 
              className="w-full"
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <Input 
              type="password" 
              name="password" 
              placeholder="Enter password"
              value={formData.password} 
              onChange={handleChange} 
              className="w-full"
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Profile Picture URL</label>
            <Input 
              type="text" 
              name="profilePic" 
              placeholder="Enter profile picture URL (optional)"
              value={formData.profilePic} 
              onChange={handleChange} 
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">User Role</label>
            <select 
              name="userRole" 
              value={formData.userRole} 
              onChange={(e) => setFormData({ ...formData, userRole: e.target.value })} 
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:ring focus:ring-blue-300"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="POLICE">Police</option>
              <option value="EMERGENCY_RESPONDER">Emergency Responder</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { Input } from '@/app/Components/ui/input';
import { Button } from '@/app/Components/ui/button';
import { useEffect, useState } from 'react';
import { fetchStaffProfile } from '@/app/lib/action';
import { UserRole } from '@prisma/client';
import toast from 'react-hot-toast';

interface Profile {
    id: string;
    createdAt: Date;
    firstName: string;
    secondName: string;
    phoneNumber: string;
    email: string;
    password: string;
    profilePic: string | null;
    userRole: UserRole;
}
export default function ContactPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
      const handleProfile = async () => {
          try{
              const profile = await fetchStaffProfile();
              setProfile(profile);
          }catch(error){
              console.error("Error fetching profile: ", error);
          }
      }
      handleProfile();
    },[])

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevents form from reloading the page
      
      try{
        setDisabled(true);
        toast.loading('Sending message')
        const response = await fetch('/api/send-help-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subject, message }),
        })

        toast.dismiss();
        if (response.ok || response.status === 200 || response.status === 201) {
          toast.success('Message submitted successfully');
          setDisabled(false);
        } else if (response.status === 400) {
          toast.error('Please fill all the fields');
          setDisabled(false);
        } else{
          toast.error('Error submitting report');
          setDisabled(false);
        }
      }catch(error){
        toast.dismiss();
        toast.error('Could not submit message');
        console.error("Error submitting message: ", error);
        setDisabled(false);
      }
    }
  return (
    <div className='w-full h-full'>
      <div className="max-w-3xl mx-auto py-4 px-6 md:py-5 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Contact Our Team
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Our team is available 24/7 to help.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 border-2 shadow-md rounded-lg p-6 md:p-8">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <Input id="firstName" type="text" placeholder={profile?.firstName || "First name"} disabled={true} required />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <Input id="lastName" type="text" placeholder={profile?.secondName || "Second name"} disabled={true} required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium ">
              Email
            </label>
            <Input id="email" type="email" placeholder={profile?.email || "your@company.com"} disabled={true} required/>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium ">
              Subject
            </label>
            <Input id="subject" type="text" placeholder="Enter a subject" required value={subject} disabled={disabled} onChange={(e) => (setSubject(e.target.value))}/>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium ">
              Message
            </label>
            <textarea
              id="message"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              rows={4}
              placeholder="Leave us a message..."
              required
              disabled={disabled}
              value={message}
              onChange={(e) => (setMessage(e.target.value))}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type='submit' disabled={disabled} className="w-full md:w-auto px-6 py-3 bg-blue-600  font-semibold rounded-md hover:bg-blue-700 transition-colors">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

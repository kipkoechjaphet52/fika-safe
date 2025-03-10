'use client';

import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';


export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 md:py-16 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
        Contact Our Team
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Our team is available 24/7 to help.
      </p>

      <form className="space-y-6 bg-white shadow-md rounded-lg p-6 md:p-8">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <Input id="firstName" type="text" placeholder="First name" required />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <Input id="lastName" type="text" placeholder="Last name" required />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input id="email" type="email" placeholder="your@company.com" required />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            rows={4}
            placeholder="Leave us a message..."
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
            Send Message
          </Button>
        </div>
      </form>
    </div>
  );
}

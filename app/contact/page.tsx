import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">Feel free to reach out to us with any questions or concerns.</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <Input type="text" placeholder="Your Name" className="w-full" />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <Input type="email" placeholder="Your Email" className="w-full" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea 
              placeholder="Your message..."
              className="w-full border rounded-lg p-2 h-32 focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}

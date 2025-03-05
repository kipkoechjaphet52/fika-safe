"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, ShieldPlusIcon, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-4 ">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <ShieldPlusIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary text-normal md:text-3xl">Fika Safe</span>
            </Link>
          </div>
          <div className="grid grid-cols-2">
            <div>
                <h3 className="font-semibold mb-4">QUICK LINKS</h3>
                <ul className="space-y-2">
                <li>
                    <Link href="/explore">Explore</Link>
                </li>
                <li>
                    <Link href="/about">About Us</Link>
                </li>
                <li>
                    <Link href="/services">Our Services</Link>
                </li>
                <li>
                    <Link href="/contact">Contact Us</Link>
                </li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold mb-4">SUPPORT</h3>
                <ul className="space-y-2">
                <li>
                    <Link href="/support">Support</Link>
                </li>
                <li>
                    <Link href="/privacy-policy">Privacy</Link>
                </li>
                <li>
                    <Link href="/terms">Terms</Link>
                </li>
                </ul>
            </div>
          </div>
          <div>
            
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 border-t border-gray-200">
            <div className="pt-4 text-sm">
            <p>
                &copy; 
                <span className="text-primary"> Fika Safe </span>
                {new Date().getFullYear()}{" "}
                {/* All rights reserved. */}
            </p>
            </div>
            <div className="pt-4 flex space-x-10 justify-between ml-4 mr-64 saturate-0">
                <Link target='_blank' href='https://twitter.com/fika-safe?lang=en'><Twitter className="w-6 h-6 text-foreground"/></Link>
                <Link target='_blank' href='https://web.facebook.com/fika.safe/'><Facebook className="w-6 h-6"/></Link>
                <Link target='_blank' href='https://ke.linkedin.com/in/fika-safe'><Linkedin className="w-6 h-6"/></Link>
                <Link target='_blank' href='https://www.instagram.com/fika-safe/'><Instagram className="w-6 h-6"/></Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
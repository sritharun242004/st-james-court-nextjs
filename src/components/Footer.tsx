import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Resort Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/logo.jpeg"
                  alt="St James Court Beach Resort Logo"
                  className="h-20 w-20 object-contain rounded-lg"
                />
              <div>
                <h1 className="font-bold text-xl">St James Court</h1>
                <p className="text-sm text-slate-300">Beach Resort</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              Where tranquility meets the sea. Experience luxury beachfront hospitality
              in the heart of Pondicherry's French Quarter.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/st_james_court_beach_resort?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-slate-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/rooms" className="text-slate-300 hover:text-white transition-colors">Rooms & Suites</Link></li>
              <li><Link href="/explore" className="text-slate-300 hover:text-white transition-colors">Explore</Link></li>
              <li><Link href="/events" className="text-slate-300 hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 text-blue-400" />
                <div>
                  <p className="text-slate-300">State Highway 49, opp. Pondicherry Engg. College,</p>
                  <p className="text-slate-300">Chinna Kalapet, Puducherry 605014, India</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-400" />
                <p className="text-slate-300">+91 94432 52776</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <p className="text-slate-300">info@stjamescourtresort.com</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <p className="text-slate-300">24/7 Reception</p>
              </div>
            </div>
          </div>


        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 St James Court Beach Resort. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/faq" className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/faq" className="text-slate-400 hover:text-white text-sm transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none select-none translate-y-[15%]">
        <span className="text-[clamp(5rem,22vw,16rem)] font-playfair font-bold text-white/[0.06] whitespace-nowrap leading-none tracking-tight">
          St James Court
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Resort Info */}
          <div className="col-span-2 lg:col-span-1">
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
              The only resort in Pondicherry right on the beach. A unit of NTS Group,
              established in 1998 with over 25 years of hospitality excellence.
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
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/rooms" className="text-slate-300 hover:text-white transition-colors">Rooms & Suites</Link></li>
              <li><Link href="/dining" className="text-slate-300 hover:text-white transition-colors">Dining</Link></li>
              <li><Link href="/conference" className="text-slate-300 hover:text-white transition-colors">Conference Hall</Link></li>
              <li><Link href="/gallery" className="text-slate-300 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/explore" className="text-slate-300 hover:text-white transition-colors">Explore</Link></li>
              <li><Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Policies</h3>
            <ul className="space-y-2">
              <li><Link href="/cancellation-policy" className="text-slate-300 hover:text-white transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/terms" className="text-slate-300 hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 text-blue-400 shrink-0" />
                <div>
                  <p className="text-slate-300 text-sm font-medium">Resort</p>
                  <p className="text-slate-300 text-sm">State Highway 49, opp. Pondicherry Engg. College,</p>
                  <p className="text-slate-300 text-sm">Chinna Kalapet, Puducherry 605014</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 text-blue-400 shrink-0" />
                <div>
                  <p className="text-slate-300 text-sm font-medium">Corporate Office</p>
                  <p className="text-slate-300 text-sm">NTS Group, 211 Chetty St,</p>
                  <p className="text-slate-300 text-sm">Pondicherry - 605001</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                <div>
                  <p className="text-slate-300 text-sm">0413 2655 174 (Landline)</p>
                  <p className="text-slate-300 text-sm">+91 96556 69023</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                <p className="text-slate-300 text-sm">info@stjamescourtbeachresort.com</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-400 shrink-0" />
                <p className="text-slate-300 text-sm">24/7 Reception</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8">
          <div className="pt-8 pb-2 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} St James Court Beach Resort. All rights reserved. A unit of NTS Group.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
              <Link href="/cancellation-policy" className="text-slate-400 hover:text-white text-sm transition-colors">
                Cancellation Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

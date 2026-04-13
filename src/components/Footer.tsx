'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Clock, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-950 to-blue-950/95 text-white relative overflow-hidden">
      {/* Top Gold Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-resort-gold/40 to-transparent" />

      {/* Background Watermark */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none select-none translate-y-[15%]">
        <span className="text-[clamp(5rem,22vw,16rem)] font-playfair font-bold text-white/[0.03] whitespace-nowrap leading-none tracking-tight">
          St James Court
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {/* Resort Info */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-5">
              <div className="relative">
                <img
                  src="/logo.jpeg"
                  alt="St James Court Beach Resort Logo"
                  className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain rounded-xl"
                />
                <div className="absolute -inset-0.5 rounded-xl border border-resort-gold/20 pointer-events-none" />
              </div>
              <div>
                <h1 className="font-playfair font-bold text-base sm:text-xl text-white">St James Court</h1>
                <p className="text-sm text-resort-gold-light tracking-wider">Beach Resort</p>
              </div>
            </div>
            <p className="text-blue-200/70 text-xs sm:text-sm lg:text-base mb-5 leading-relaxed">
              The only resort in Pondicherry right on the beach. A unit of NTS Group,
              established in 1998 with over 25 years of hospitality excellence.
            </p>
            <div className="flex space-x-3">
              {[
                { href: "#", icon: <Facebook className="h-4 w-4" /> },
                { href: "https://www.instagram.com/st_james_court_beach_resort?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", icon: <Instagram className="h-4 w-4" /> },
                { href: "#", icon: <Linkedin className="h-4 w-4" /> },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-200/70 hover:text-resort-gold hover:bg-white/10 hover:border-resort-gold/30 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-sm sm:text-lg mb-3 sm:mb-5 text-resort-gold-light">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm lg:text-base">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/rooms', label: 'Rooms & Suites' },
                { href: '/dining', label: 'Dining' },
                { href: '/conference', label: 'Conference Hall' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/explore', label: 'Explore' },
                { href: '/contact', label: 'Contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-blue-200/60 hover:text-resort-gold-light transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="col-span-1">
            <h3 className="font-semibold text-sm sm:text-lg mb-3 sm:mb-5 text-resort-gold-light">Policies</h3>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm lg:text-base">
              <li><Link href="/cancellation-policy" className="text-blue-200/60 hover:text-resort-gold-light transition-colors duration-300">Cancellation Policy</Link></li>
              <li><Link href="/terms" className="text-blue-200/60 hover:text-resort-gold-light transition-colors duration-300">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-blue-200/60 hover:text-resort-gold-light transition-colors duration-300">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-sm sm:text-lg mb-3 sm:mb-5 text-resort-gold-light">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-resort-gold/60 shrink-0" />
                <div>
                  <p className="text-blue-100/80 text-xs sm:text-sm font-medium">Resort</p>
                  <p className="text-blue-200/60 text-xs sm:text-sm">State Highway 49, opp. Pondicherry Engg. College,</p>
                  <p className="text-blue-200/60 text-xs sm:text-sm">Chinna Kalapet, Puducherry 605014</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-resort-gold/60 shrink-0" />
                <div>
                  <p className="text-blue-100/80 text-xs sm:text-sm font-medium">Corporate Office</p>
                  <p className="text-blue-200/60 text-xs sm:text-sm">NTS Group, 211 Chetty St,</p>
                  <p className="text-blue-200/60 text-xs sm:text-sm">Pondicherry - 605001</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-resort-gold/60 shrink-0" />
                <div>
                  <p className="text-blue-200/60 text-xs sm:text-sm">0413 2655 174 (Landline)</p>
                  <p className="text-blue-200/60 text-xs sm:text-sm">+91 96556 69023</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-resort-gold/60 shrink-0" />
                <p className="text-blue-200/60 text-xs sm:text-sm">info@stjamescourtbeachresort.com</p>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-resort-gold/60 shrink-0" />
                <p className="text-blue-200/60 text-xs sm:text-sm">24/7 Reception</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8">
          <div className="pt-6 pb-2 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Anchor className="h-3 w-3 text-resort-gold/40" />
              <p className="text-blue-200/40 text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} St James Court Beach Resort. All rights reserved. A unit of NTS Group.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/cancellation-policy" className="text-blue-200/40 hover:text-resort-gold-light text-xs sm:text-sm transition-colors duration-300">
                Cancellation Policy
              </Link>
              <Link href="/terms" className="text-blue-200/40 hover:text-resort-gold-light text-xs sm:text-sm transition-colors duration-300">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-blue-200/40 hover:text-resort-gold-light text-xs sm:text-sm transition-colors duration-300">
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

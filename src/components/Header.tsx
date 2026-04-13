'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, MapPin, User, LogOut, CalendarCheck, Anchor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Rooms', href: '/rooms' },
    { name: 'Dining', href: '/dining' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Explore', href: '/explore' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Bar - Elegant Resort Strip */}
      <motion.div
        className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white py-1.5 sm:py-2 text-[10px] sm:text-sm fixed w-full top-0 z-50"
        initial={mounted ? { y: -50, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-3 sm:space-x-5"
            initial={mounted ? { x: -20, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hidden sm:flex items-center space-x-1.5 text-blue-200/90">
              <MapPin className="h-3.5 w-3.5" />
              <span>Pondicherry, India</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-blue-700" />
            <a href="tel:+919443252776" className="flex items-center space-x-1.5 text-blue-200/90 hover:text-resort-gold transition-colors duration-300">
              <Phone className="h-3.5 w-3.5" />
              <span>+91 94432 52776</span>
            </a>
          </motion.div>
          <motion.div
            className="flex items-center space-x-2"
            initial={mounted ? { x: 20, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Anchor className="h-3 w-3 text-resort-gold hidden md:block" />
            <span className="text-resort-gold-light font-light tracking-wider hidden md:block">
              Experience Luxury by the Sea
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Floating Header */}
      <motion.header
        className={`fixed w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'top-7 sm:top-10 px-2 sm:px-4'
            : 'top-7 sm:top-10 px-2 sm:px-4'
        }`}
        initial={mounted ? { y: -100 } : false}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.nav
          className={`max-w-6xl mx-auto transition-all duration-500 ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-2xl shadow-resort rounded-2xl border border-sand-200/50 py-2 sm:py-3 px-3 sm:px-6'
              : 'bg-blue-950/20 backdrop-blur-md rounded-2xl border border-white/15 py-2.5 sm:py-4 px-3 sm:px-6'
          }`}
          layout
        >
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link href="/" className="flex items-center space-x-2.5">
                <div className="relative">
                  <img
                    src="/logo.jpeg"
                    alt="St James Court Beach Resort Logo"
                    className="h-8 w-8 sm:h-14 sm:w-14 lg:h-16 lg:w-16 object-contain rounded-xl shadow-glass -ml-1 sm:-ml-2"
                  />
                  <div className="absolute -inset-0.5 rounded-xl border border-resort-gold/30 pointer-events-none" />
                </div>
                <div>
                  <h1 className={`font-playfair font-bold text-sm sm:text-lg lg:text-xl transition-colors duration-300 ml-1 ${
                    isScrolled ? 'text-blue-900' : 'text-white'
                  }`}>
                    St James Court
                  </h1>
                  <p className={`text-[9px] sm:text-xs font-jost tracking-wider uppercase transition-colors duration-300 ml-1 ${
                    isScrolled ? 'text-resort-gold' : 'text-resort-gold-light'
                  }`}>
                    Beach Resort
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-0.5">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={mounted ? { y: -20, opacity: 0 } : false}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg font-jost font-medium transition-all duration-300 group cursor-pointer ${
                      pathname === item.href
                        ? isScrolled ? 'text-blue-600' : 'text-resort-gold-light'
                        : isScrolled
                        ? 'text-slate-700 hover:text-blue-600'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.name}
                    {pathname === item.href ? (
                      <motion.div
                        className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                          isScrolled ? 'bg-resort-gold' : 'bg-resort-gold-light'
                        }`}
                        layoutId="activeNavIndicator"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : (
                      <motion.div
                        className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full origin-left ${
                          isScrolled ? 'bg-resort-gold/60' : 'bg-resort-gold-light/60'
                        }`}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={mounted ? { scale: 0, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/booking"
                  className="ml-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-jost font-semibold shadow-lg hover:shadow-ocean hover:from-blue-700 hover:to-blue-800 transition-all duration-300 cursor-pointer"
                >
                  Book Now
                </Link>
              </motion.div>

              {user ? (
                <div className="ml-3 user-menu-container">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isScrolled
                        ? 'bg-sand-100 hover:bg-sand-200 border border-sand-200'
                        : 'bg-white/15 hover:bg-white/25 border border-white/20'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <User className={`h-4 w-4 ${isScrolled ? 'text-blue-900' : 'text-white'}`} />
                    <span className={`font-medium text-sm ${isScrolled ? 'text-blue-900' : 'text-white'}`}>
                      {user.full_name.split(' ')[0]}
                    </span>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={mounted ? { scale: 0, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="ml-3"
                >
                  <Link
                    href="/login"
                    className={`px-5 py-2.5 rounded-full font-jost font-semibold transition-all duration-300 cursor-pointer ${
                      isScrolled
                        ? 'bg-sand-100 text-blue-900 hover:bg-sand-200 border border-sand-200'
                        : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                    }`}
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors duration-300 cursor-pointer ${
                isScrolled ? 'text-blue-900 hover:bg-sand-100' : 'text-white hover:bg-white/10'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>

        {/* User Menu Dropdown - Desktop */}
        <AnimatePresence>
          {showUserMenu && user && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-resort border border-sand-200/50 py-2 z-[9999]"
              style={{
                top: isScrolled ? '4.5rem' : '5rem',
                right: '2rem'
              }}
            >
              <div className="px-4 py-2 border-b border-sand-100">
                <p className="text-sm font-semibold text-blue-900">{user.full_name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-sand-50 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
              <Link
                href="/my-bookings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-sand-50 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <CalendarCheck className="h-4 w-4" />
                My Bookings
              </Link>
              {user.is_admin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-sand-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
              <div className="border-t border-sand-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    router.push('/');
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-coral-600 hover:bg-coral-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl border border-sand-200/50 shadow-resort overflow-hidden"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-1 sm:space-y-1.5">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-2.5 px-4 sm:py-3 sm:px-4 rounded-xl font-jost text-sm sm:text-base font-medium transition-all duration-300 cursor-pointer ${
                        pathname === item.href
                          ? 'text-blue-600 bg-blue-50/80 border-l-2 border-resort-gold'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-sand-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: navigation.length * 0.06 }}
                  className="pt-3 space-y-2"
                >
                  <div className="gold-line mb-3" />
                  <Link
                    href="/booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base rounded-xl text-center font-jost font-semibold shadow-lg hover:shadow-ocean transition-all duration-300 cursor-pointer"
                  >
                    Book Your Stay
                  </Link>

                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 w-full bg-sand-50 text-blue-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-jost text-sm sm:text-base font-semibold hover:bg-sand-100 transition-colors border border-sand-200/50 cursor-pointer"
                      >
                        <User className="h-5 w-5" />
                        My Profile
                      </Link>
                      <Link
                        href="/my-bookings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 w-full bg-sand-50 text-blue-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-jost text-sm sm:text-base font-semibold hover:bg-sand-100 transition-colors border border-sand-200/50 cursor-pointer"
                      >
                        <CalendarCheck className="h-5 w-5" />
                        My Bookings
                      </Link>
                      {user.is_admin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 w-full bg-blue-50 text-blue-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-jost text-sm sm:text-base font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <User className="h-5 w-5" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                          router.push('/');
                        }}
                        className="flex items-center gap-2 w-full bg-coral-50 text-coral-600 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-jost text-sm sm:text-base font-semibold hover:bg-coral-100 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full bg-sand-50 text-blue-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-center font-jost text-sm sm:text-base font-semibold hover:bg-sand-100 transition-colors border border-sand-200/50 cursor-pointer"
                    >
                      Login / Sign Up
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, MapPin, User, LogOut, CalendarCheck } from 'lucide-react';
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

  // Close mobile menu when route changes
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
      {/* Top Bar */}
      <motion.div
        className="bg-slate-900 text-white py-1 sm:py-2 text-[10px] sm:text-sm fixed w-full top-0 z-50"
        initial={mounted ? { y: -50, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2 sm:space-x-4"
            initial={mounted ? { x: -20, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hidden sm:flex items-center space-x-1">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Pondicherry, India</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>+91 94432 52776</span>
            </div>
          </motion.div>
          <motion.div
            className="hidden md:block"
            initial={mounted ? { x: 20, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span>Experience Luxury by the Sea</span>
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
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.nav
          className={`max-w-6xl mx-auto transition-all duration-500 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 py-2 sm:py-3 px-3 sm:px-6'
              : 'bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 py-2.5 sm:py-4 px-3 sm:px-6'
          }`}
          layout
        >
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/logo.jpeg"
                  alt="St James Court Beach Resort Logo"
                  className="h-8 w-8 sm:h-14 sm:w-14 lg:h-16 lg:w-16 object-contain rounded-lg shadow-lg -ml-1 sm:-ml-2"
                />
                <div>
                  <h1 className={`font-playfair font-bold text-sm sm:text-lg lg:text-xl ${isScrolled ? 'text-slate-900' : 'text-white'} transition-colors duration-300 ml-1`}>
                    St James Court
                  </h1>
                  <p className={`text-[9px] sm:text-xs font-jost ${isScrolled ? 'text-slate-600' : 'text-white/90'} transition-colors duration-300 ml-1`}>
                    Beach Resort
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={mounted ? { y: -20, opacity: 0 } : false}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg font-jost font-medium transition-all duration-300 group ${
                      pathname === item.href
                        ? isScrolled ? 'text-blue-600' : 'text-blue-200'
                        : isScrolled
                        ? 'text-slate-700 hover:text-blue-600'
                        : 'text-white hover:text-blue-200'
                    }`}
                  >
                    {item.name}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isScrolled ? 'bg-gradient-to-r from-blue-600 to-teal-500' : 'bg-gradient-to-r from-blue-200 to-teal-200'
                      }`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={mounted ? { scale: 0, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/booking"
                  className="ml-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2.5 rounded-full font-jost font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:from-blue-700 hover:to-teal-600"
                >
                  Book Now
                </Link>
              </motion.div>

              {user ? (
                <div className="ml-4 user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isScrolled ? 'bg-slate-100 hover:bg-slate-200' : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <User className={`h-5 w-5 ${isScrolled ? 'text-slate-900' : 'text-white'}`} />
                    <span className={`font-medium ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                      {user.full_name.split(' ')[0]}
                    </span>
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={mounted ? { scale: 0, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="ml-4"
                >
                  <Link
                    href="/login"
                    className={`px-6 py-2.5 rounded-full font-jost font-semibold transition-all duration-300 ${
                      isScrolled
                        ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        : 'bg-white/20 text-white hover:bg-white/30'
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
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
              whileTap={{ scale: 0.95 }}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 lg:right-auto lg:left-auto w-48 bg-white rounded-lg shadow-2xl border border-slate-200 py-2 z-[9999]"
              style={{
                top: isScrolled ? '4.5rem' : '5rem',
                right: '2rem'
              }}
            >
              <Link
                href="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
              <Link
                href="/my-bookings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <CalendarCheck className="h-4 w-4" />
                My Bookings
              </Link>
              {user.is_admin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                  router.push('/');
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-1 sm:space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-2.5 px-3 sm:py-3 sm:px-4 rounded-lg font-jost text-sm sm:text-base font-medium transition-all duration-300 ${
                        pathname === item.href
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: navigation.length * 0.1 }}
                  className="pt-4 space-y-2"
                >
                  <Link
                    href="/booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 sm:px-6 sm:py-4 text-sm sm:text-base rounded-xl text-center font-jost font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Book Your Stay
                  </Link>

                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 w-full bg-slate-100 text-slate-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-jost text-sm sm:text-base font-semibold hover:bg-slate-200 transition-colors"
                      >
                        <User className="h-5 w-5" />
                        My Profile
                      </Link>
                      <Link
                        href="/my-bookings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 w-full bg-slate-100 text-slate-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-jost text-sm sm:text-base font-semibold hover:bg-slate-200 transition-colors"
                      >
                        <CalendarCheck className="h-5 w-5" />
                        My Bookings
                      </Link>
                      {user.is_admin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 w-full bg-blue-50 text-blue-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-jost text-sm sm:text-base font-semibold hover:bg-blue-100 transition-colors"
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
                        className="flex items-center gap-2 w-full bg-red-50 text-red-600 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-jost text-sm sm:text-base font-semibold hover:bg-red-100 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full bg-slate-100 text-slate-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-center font-jost text-sm sm:text-base font-semibold hover:bg-slate-200 transition-colors"
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
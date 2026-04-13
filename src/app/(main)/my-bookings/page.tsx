'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BedDouble, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import WaveDivider from '@/components/ui/wave-divider';
import GoldSeparator from '@/components/ui/gold-separator';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

interface BookingItem {
  id: number;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  extraBeds: number;
  specialRequests: string | null;
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: string;
  categoryCode: string;
  categoryName: string;
  createdAt: string;
}

const getPaymentStyle = (status: string) => {
  switch (status) {
    case 'PAID':      return 'bg-green-100 text-green-800';
    case 'PENDING':   return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    case 'REFUNDED':  return 'bg-blue-100 text-blue-800';
    default:          return 'bg-slate-100 text-slate-800';
  }
};

type StayStatus = 'upcoming' | 'in-progress' | 'completed';

const getStayStatus = (checkIn: string, checkOut: string, today: string): StayStatus => {
  if (checkOut < today) return 'completed';
  if (checkIn <= today && checkOut >= today) return 'in-progress';
  return 'upcoming';
};

const stayStatusBadge: Record<StayStatus, { label: string; className: string }> = {
  'upcoming':    { label: 'Upcoming',    className: 'bg-blue-100 text-blue-700' },
  'in-progress': { label: 'Staying Now', className: 'bg-teal-100 text-teal-700' },
  'completed':   { label: 'Completed',   className: 'bg-slate-100 text-slate-600' },
};

const stayBarColor: Record<StayStatus, string> = {
  'upcoming':    'bg-gradient-to-r from-blue-600 to-blue-700',
  'in-progress': 'bg-gradient-to-r from-teal-500 to-green-400',
  'completed':   'bg-slate-200',
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getNights = (checkIn: string, checkOut: string) => {
  const a = new Date(checkIn + 'T00:00:00');
  const b = new Date(checkOut + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
};

const MyBookingsContent = () => {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'in-progress' | 'past'>('all');

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    fetch('/api/user/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { if (data.bookings) setBookings(data.bookings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [getToken]);

  const today = new Date().toISOString().split('T')[0];

  const filtered = bookings.filter(b => {
    const s = getStayStatus(b.checkIn, b.checkOut, today);
    if (filter === 'upcoming')    return s === 'upcoming';
    if (filter === 'in-progress') return s === 'in-progress';
    if (filter === 'past')        return s === 'completed';
    return true;
  });

  const upcomingCount    = bookings.filter(b => getStayStatus(b.checkIn, b.checkOut, today) === 'upcoming').length;
  const inProgressCount  = bookings.filter(b => getStayStatus(b.checkIn, b.checkOut, today) === 'in-progress').length;
  const pastCount        = bookings.filter(b => getStayStatus(b.checkIn, b.checkOut, today) === 'completed').length;

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-10 sm:pt-52 sm:pb-16 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-cream"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.h1 variants={fadeInUp} custom={0} className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold mb-2 sm:mb-4">My Reservations</motion.h1>
          <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-xl max-w-2xl mx-auto opacity-90">View and manage your bookings at St James Court Beach Resort</motion.p>
        </motion.div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-12 bg-resort-cream">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'all'         as const, label: 'All',         count: bookings.length },
            { key: 'upcoming'    as const, label: 'Upcoming',    count: upcomingCount   },
            { key: 'in-progress' as const, label: 'Staying Now', count: inProgressCount },
            { key: 'past'        as const, label: 'Completed',   count: pastCount       },
          ].map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05, y: -2 }}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-full font-medium transition-all text-sm cursor-pointer ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-ocean'
                  : 'glass-card text-slate-600 hover:bg-white/80 border border-sand-200'
              }`}
            >
              {tab.label} ({tab.count})
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 sm:py-20 glass-card rounded-2xl shadow-resort"
          >
            <BedDouble className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {filter === 'all' ? 'No reservations yet' : `No ${filter} reservations`}
            </h3>
            <p className="text-slate-400 mb-6">
              {filter === 'all' ? 'Book your perfect beachfront getaway today!' : 'Check another filter or make a new reservation.'}
            </p>
            <motion.div whileHover={{ scale: 1.05, y: -2 }}>
              <Link
                href="/booking"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all cursor-pointer"
              >
                Book Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {filtered.map((booking, index) => {
              const nights = getNights(booking.checkIn, booking.checkOut);
              const stayStatus = getStayStatus(booking.checkIn, booking.checkOut, today);
              const { label: stayLabel, className: stayClass } = stayStatusBadge[stayStatus];

              return (
                <motion.div
                  key={booking.id}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ y: -4 }}
                  className="glass-card rounded-2xl shadow-resort overflow-hidden hover:shadow-glass-lg transition-shadow"
                >
                  <div className={`h-1.5 ${stayBarColor[stayStatus]}`} />
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-xl font-bold text-blue-900">{booking.categoryName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${stayClass}`}>{stayLabel}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStyle(booking.paymentStatus)}`}>{booking.paymentStatus}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>
                              {nights} night{nights > 1 ? 's' : ''} | {booking.rooms} room{booking.rooms > 1 ? 's' : ''}
                              {booking.extraBeds > 0 && ` + ${booking.extraBeds} extra bed${booking.extraBeds > 1 ? 's' : ''}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span>{booking.adults} adult{booking.adults > 1 ? 's' : ''}{booking.children > 0 ? `, ${booking.children} child${booking.children > 1 ? 'ren' : ''}` : ''}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">₹{booking.finalAmount.toLocaleString()}</div>
                        {booking.discountAmount > 0 && (
                          <div className="text-sm text-green-600 font-medium">Saved ₹{booking.discountAmount.toLocaleString()}</div>
                        )}
                        <div className="text-xs text-slate-400 mt-1">Booking #{booking.id}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const MyBookings = () => (
  <ProtectedRoute>
    <MyBookingsContent />
  </ProtectedRoute>
);

export default MyBookings;

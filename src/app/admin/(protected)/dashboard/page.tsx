'use client';

import React from 'react';
import Link from 'next/link';
import { Users, BedDouble, Tag, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

interface DashboardData {
  userCount: number;
  categoryCount: number;
  activeDiscountCount: number;
  recentBookingsCount: number;
  occupancyRate: number;
  categories: { id: number; code: string; name: string; capacity: number; todayAvailable: number; todayPrice: number }[];
  recentBookings: { id: number; check_in: string; check_out: string; rooms: number; final_amount: string; payment_status: string; created_at: string; full_name: string; phone: string; category_name: string }[];
}

const Dashboard = () => {
  const { getToken } = useAuth();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = getToken();
        const res = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-coral-50 border border-coral-200 rounded-2xl p-6 flex items-center gap-3">
        <AlertCircle className="h-6 w-6 text-coral-500 flex-shrink-0" />
        <div>
          <p className="font-semibold text-coral-800">Error loading dashboard</p>
          <p className="text-sm text-coral-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { icon: Users, label: 'Total Users', value: data.userCount.toLocaleString(), change: 'Active accounts', color: 'blue' },
    { icon: BedDouble, label: 'Room Categories', value: String(data.categoryCount), change: `${data.occupancyRate}% occupancy today`, color: 'green' },
    { icon: Tag, label: 'Active Discounts', value: String(data.activeDiscountCount), change: 'Upcoming dates', color: 'gold' },
    { icon: TrendingUp, label: 'Bookings (30d)', value: data.recentBookingsCount.toLocaleString(), change: `${data.occupancyRate}% occupancy`, color: 'ocean' },
  ];

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-blue-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            green: 'bg-green-50 text-green-600 border-green-100',
            gold: 'bg-sand-50 text-resort-gold border-sand-200',
            ocean: 'bg-ocean-50 text-ocean-600 border-ocean-100'
          };
          return (
            <motion.div
              key={index}
              variants={fadeInUp}
              custom={index}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="glass-card rounded-2xl p-5 sm:p-6 cursor-pointer"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors[stat.color]} border mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.change}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="glass-card rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { href: '/admin/users', title: 'Manage Users', desc: 'Add, edit, or remove user accounts' },
              { href: '/admin/rooms', title: 'Manage Rooms', desc: 'Update room inventory and availability' },
              { href: '/admin/discounts', title: 'Manage Discounts', desc: 'Create and manage promotional offers' },
            ].map((action, i) => (
              <motion.div key={i} whileHover={{ x: 6, transition: { duration: 0.2 } }}>
                <Link
                  href={action.href}
                  className="block p-4 border border-sand-200/50 rounded-xl hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                >
                  <h4 className="font-semibold text-blue-900 mb-1 group-hover:text-blue-600 transition-colors">{action.title}</h4>
                  <p className="text-sm text-slate-600">{action.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass-card rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Recent Bookings</h3>
          {data.recentBookings.length === 0 ? (
            <p className="text-slate-500 text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {data.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-start gap-3 pb-4 border-b border-sand-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 bg-resort-gold rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {booking.full_name} — {booking.category_name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {booking.rooms} room{booking.rooms > 1 ? 's' : ''} | {booking.check_in} to {booking.check_out} | ₹{parseFloat(booking.final_amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{formatTime(booking.created_at)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    booking.payment_status === 'PAID' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-sand-50 text-sand-700 border border-sand-200'
                  }`}>
                    {booking.payment_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        className="bg-gradient-to-r from-blue-700 via-blue-600 to-ocean-600 rounded-2xl shadow-resort p-5 sm:p-8 text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <h3 className="text-2xl font-playfair font-bold mb-2">Room Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {data.categories.map((cat) => (
            <motion.div
              key={cat.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors duration-300 cursor-pointer"
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="text-2xl sm:text-3xl font-bold mb-1">{cat.todayAvailable}</div>
              <div className="text-blue-100">{cat.name}</div>
              <div className="text-sm text-blue-200 mt-2">
                {cat.todayPrice > 0 ? `₹${cat.todayPrice.toLocaleString()}/night` : 'No inventory today'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

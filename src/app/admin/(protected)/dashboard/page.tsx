'use client';

import React from 'react';
import Link from 'next/link';
import { Users, BedDouble, Tag, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-800">Error loading dashboard</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { icon: Users, label: 'Total Users', value: data.userCount.toLocaleString(), change: 'Active accounts', color: 'blue' },
    { icon: BedDouble, label: 'Room Categories', value: String(data.categoryCount), change: `${data.occupancyRate}% occupancy today`, color: 'green' },
    { icon: Tag, label: 'Active Discounts', value: String(data.activeDiscountCount), change: 'Upcoming dates', color: 'orange' },
    { icon: TrendingUp, label: 'Bookings (30d)', value: data.recentBookingsCount.toLocaleString(), change: `${data.occupancyRate}% occupancy`, color: 'teal' },
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
      <div>
        <h1 className="text-3xl font-playfair font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors: Record<string, string> = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            orange: 'bg-orange-100 text-orange-600',
            teal: 'bg-teal-100 text-teal-600'
          };
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colors[stat.color]} mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="block p-4 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 mb-1">Manage Users</h4>
              <p className="text-sm text-slate-600">Add, edit, or remove user accounts</p>
            </Link>
            <Link
              href="/admin/rooms"
              className="block p-4 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 mb-1">Manage Rooms</h4>
              <p className="text-sm text-slate-600">Update room inventory and availability</p>
            </Link>
            <Link
              href="/admin/discounts"
              className="block p-4 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <h4 className="font-semibold text-slate-900 mb-1">Manage Discounts</h4>
              <p className="text-sm text-slate-600">Create and manage promotional offers</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Bookings</h3>
          {data.recentBookings.length === 0 ? (
            <p className="text-slate-500 text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {data.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {booking.full_name} — {booking.category_name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {booking.rooms} room{booking.rooms > 1 ? 's' : ''} | {booking.check_in} to {booking.check_out} | ₹{parseFloat(booking.final_amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{formatTime(booking.created_at)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.payment_status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.payment_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-playfair font-bold mb-2">Room Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {data.categories.map((cat) => (
            <div key={cat.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{cat.todayAvailable}</div>
              <div className="text-blue-100">{cat.name}</div>
              <div className="text-sm text-blue-200 mt-2">
                {cat.todayPrice > 0 ? `₹${cat.todayPrice.toLocaleString()}/night` : 'No inventory today'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

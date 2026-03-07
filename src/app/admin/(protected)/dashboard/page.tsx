'use client';

import React from 'react';
import Link from 'next/link';
import { Users, BedDouble, Tag, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', change: '+12%', color: 'blue' },
    { icon: BedDouble, label: 'Total Rooms', value: '45', change: '3 blocked', color: 'green' },
    { icon: Tag, label: 'Active Discounts', value: '8', change: '2 expiring soon', color: 'orange' },
    { icon: TrendingUp, label: 'Occupancy Rate', value: '87%', change: '+5%', color: 'teal' }
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'john@example.com', time: '2 minutes ago' },
    { action: 'Room 305 blocked', user: 'admin', time: '15 minutes ago' },
    { action: 'Discount created for rooms', user: 'admin', time: '1 hour ago' },
    { action: 'User profile updated', user: 'sarah@example.com', time: '2 hours ago' }
  ];

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
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                  <p className="text-xs text-slate-600">{activity.user}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-playfair font-bold mb-2">Room Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">15</div>
            <div className="text-blue-100">Deluxe Rooms</div>
            <div className="text-sm text-blue-200 mt-2">₹4,500/night</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">18</div>
            <div className="text-blue-100">Super Deluxe</div>
            <div className="text-sm text-blue-200 mt-2">₹5,500/night</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">12</div>
            <div className="text-blue-100">Executive Suite</div>
            <div className="text-sm text-blue-200 mt-2">₹6,500/night</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

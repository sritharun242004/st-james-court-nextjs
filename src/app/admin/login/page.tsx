'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const router = useRouter();
  const { adminLogin } = useAuth();
  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid admin credentials');
        return;
      }

      adminLogin(data.admin.username, data.token);
      router.push('/admin/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-resort-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ocean-500/5 rounded-full blur-3xl" />

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-resort-lg p-6 sm:p-8 border border-white/20">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 shadow-ocean">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-blue-900 mb-2">Admin Portal</h2>
            <p className="text-slate-600">St James Court Beach Resort</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-coral-50 border border-coral-200 rounded-xl text-coral-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-900/80 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900/80 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-ocean transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Signing in...' : 'Sign In to Admin Portal'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-sand-200/50 text-center">
            <Link
              href="/login"
              className="text-sm text-slate-500 hover:text-blue-900 transition-colors"
            >
              &larr; Back to User Login
            </Link>
          </div>

          <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100/50">
            <p className="text-xs text-slate-500 text-center">
              Default credentials: admin / admin123 (seed first via POST /api/admin/seed)
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

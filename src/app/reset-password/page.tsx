'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) setError('Invalid or missing reset token. Please request a new reset link.');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-green-50 rounded-full p-4 border border-green-200/50">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-playfair font-bold text-blue-900 mb-3">Password Updated!</h2>
        <p className="text-slate-600 text-sm mb-2">Your password has been successfully reset.</p>
        <p className="text-slate-500 text-xs">Redirecting you to login in 3 seconds…</p>
        <Link href="/login" className="mt-6 inline-block text-resort-gold font-semibold hover:text-sand-700 text-sm transition-colors">
          Go to Sign In
        </Link>
      </motion.div>
    );
  }

  if (!token) {
    return (
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-coral-50 rounded-full p-4 border border-coral-200/50">
            <AlertCircle className="h-10 w-10 text-coral-500" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-playfair font-bold text-blue-900 mb-3">Invalid Link</h2>
        <p className="text-slate-600 text-sm mb-6">This reset link is invalid or has already been used.</p>
        <Link href="/forgot-password" className="text-resort-gold font-semibold hover:text-sand-700 text-sm transition-colors">
          Request a new reset link
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-ocean-50 rounded-full p-3 border border-ocean-200/50">
            <Lock className="h-8 w-8 text-ocean-600" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-blue-900 mb-2">Set New Password</h2>
        <p className="text-slate-600 text-sm">Choose a strong password for your account.</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-coral-50 border border-coral-200 rounded-xl text-coral-600 text-sm flex items-start gap-2"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-blue-900/80 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-10 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900/80 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full pl-10 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200"
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
          {loading ? 'Updating...' : 'Update Password'}
        </motion.button>
      </form>
    </>
  );
};

const ResetPassword = () => (
  <div className="min-h-screen bg-resort-cream flex items-center justify-center py-12 px-4 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sand-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

    <motion.div
      className="max-w-md w-full relative z-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="glass-card rounded-2xl shadow-resort p-6 sm:p-8">
        <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </motion.div>
  </div>
);

export default ResetPassword;

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

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
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3">Password Updated!</h2>
        <p className="text-slate-600 text-sm mb-2">Your password has been successfully reset.</p>
        <p className="text-slate-500 text-xs">Redirecting you to login in 3 seconds…</p>
        <Link href="/login" className="mt-6 inline-block text-blue-600 font-semibold hover:text-blue-700 text-sm">
          Go to Sign In
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3">Invalid Link</h2>
        <p className="text-slate-600 text-sm mb-6">This reset link is invalid or has already been used.</p>
        <Link href="/forgot-password" className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 rounded-full p-3">
            <Lock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-slate-900 mb-2">Set New Password</h2>
        <p className="text-slate-600 text-sm">Choose a strong password for your account.</p>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </>
  );
};

const ResetPassword = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4">
    <div className="max-w-md w-full">
      <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">
        <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  </div>
);

export default ResetPassword;

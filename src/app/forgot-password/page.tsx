'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">

          {sent ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3">Check your inbox</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                If an account with <strong>{email}</strong> exists, we&apos;ve sent a password reset link. It expires in <strong>1 hour</strong>.
              </p>
              <p className="text-slate-500 text-xs mb-6">
                Didn&apos;t receive it? Check your spam folder or try again.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-slate-900 mb-2">Forgot Password?</h2>
                <p className="text-slate-600 text-sm">
                  Enter your email and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

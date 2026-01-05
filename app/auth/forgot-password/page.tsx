'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await sendPasswordResetEmail(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">
            Reset Password
          </h1>
          <p className="text-neutral-600 text-base">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="card animate-slide-up">
          {success ? (
            <div className="text-center py-6">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-green-600 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Check your email</h2>
              <p className="text-neutral-600 text-sm mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-neutral-500 text-xs mb-6">
                💡 Don't see the email? Check your spam folder or try again.
              </p>
              <Link
                href="/auth/login"
                className="inline-block text-brand-600 hover:text-brand-700 font-medium text-sm"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-neutral-600 hover:text-neutral-900 text-sm font-medium"
                >
                  ← Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

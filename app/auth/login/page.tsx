'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { user, error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (user) {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #8B7355 0%, #A0826D 25%, #8B7355 50%, #6B5D52 75%, #8B7355 100%)',
         }}>
      {/* Antique book cover texture overlay */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0l50 50M50 0L0 50M50 50l50 50M100 50L50 100' stroke='%23000' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
             backgroundSize: '50px 50px'
           }}>
      </div>

      {/* Large Boho decorative elements - Top Left */}
      <div className="absolute top-8 left-8 opacity-50">
        <svg width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Large leaf branch */}
          <path d="M 30 120 Q 50 80 70 120 Q 65 100 70 60" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 50 105 Q 40 75 60 60" stroke="#000" strokeWidth="4" fill="none"/>
          <path d="M 60 95 Q 70 70 85 75" stroke="#000" strokeWidth="4" fill="none"/>
          <path d="M 45 85 Q 35 65 50 50" stroke="#000" strokeWidth="4" fill="none"/>
          {/* Large decorative circles */}
          <circle cx="100" cy="70" r="20" stroke="#000" strokeWidth="4" fill="none"/>
          <circle cx="140" cy="60" r="15" stroke="#000" strokeWidth="4" fill="none"/>
          <circle cx="120" cy="100" r="12" stroke="#000" strokeWidth="3" fill="none"/>
          {/* Rainbow arch */}
          <path d="M 30 180 Q 90 120 150 180" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 40 185 Q 90 135 140 185" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Large Boho decorative elements - Top Right */}
      <div className="absolute top-8 right-8 opacity-50">
        <svg width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Large moon and stars */}
          <circle cx="125" cy="80" r="35" stroke="#000" strokeWidth="5" fill="none"/>
          <circle cx="145" cy="80" r="35" fill="#8B7355"/>
          <polygon points="190,40 195,55 210,55 198,65 203,80 190,71 177,80 182,65 170,55 185,55" fill="#000" strokeWidth="2"/>
          <polygon points="60,130 65,145 80,145 68,155 73,170 60,161 47,170 52,155 40,145 55,145" fill="#000" strokeWidth="2"/>
          <polygon points="210,120 213,130 223,130 216,136 219,146 210,140 201,146 204,136 197,130 207,130" fill="#000"/>
          {/* Decorative dots */}
          <circle cx="180" cy="150" r="8" fill="#000"/>
          <circle cx="70" cy="70" r="6" fill="#000"/>
          <circle cx="220" cy="90" r="5" fill="#000"/>
        </svg>
      </div>

      {/* Large Boho decorative elements - Bottom Left */}
      <div className="absolute bottom-8 left-8 opacity-50">
        <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Large botanical leaves cluster */}
          <path d="M 60 140 Q 70 110 80 140 Q 84 125 80 100" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 100 150 Q 110 120 120 150 Q 124 135 120 110" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 140 140 Q 150 110 160 140 Q 164 125 160 100" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 180 150 Q 190 120 200 150 Q 204 135 200 110" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 220 140 Q 230 110 240 140 Q 244 125 240 100" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* Connecting vine */}
          <path d="M 60 160 Q 140 170 240 165" stroke="#000" strokeWidth="4" fill="none"/>
          <circle cx="60" cy="160" r="8" fill="#000"/>
          <circle cx="140" cy="170" r="8" fill="#000"/>
          <circle cx="240" cy="165" r="8" fill="#000"/>
        </svg>
      </div>

      {/* Large Boho decorative elements - Bottom Right */}
      <div className="absolute bottom-8 right-8 opacity-50">
        <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Large abstract boho pattern */}
          <circle cx="80" cy="140" r="25" stroke="#000" strokeWidth="5" fill="none"/>
          <circle cx="140" cy="140" r="25" stroke="#000" strokeWidth="5" fill="none"/>
          <circle cx="200" cy="140" r="25" stroke="#000" strokeWidth="5" fill="none"/>
          <path d="M 80 165 L 80 200 M 140 165 L 140 210 M 200 165 L 200 200" stroke="#000" strokeWidth="4"/>
          <circle cx="80" cy="205" r="10" fill="#000"/>
          <circle cx="140" cy="215" r="10" fill="#000"/>
          <circle cx="200" cy="205" r="10" fill="#000"/>
          {/* Geometric pattern */}
          <path d="M 50 80 L 80 50 L 110 80 L 80 110 Z" stroke="#000" strokeWidth="4" fill="none"/>
          <path d="M 170 80 L 200 50 L 230 80 L 200 110 Z" stroke="#000" strokeWidth="4" fill="none"/>
        </svg>
      </div>

      {/* Center decorative elements - larger scattered around */}
      <div className="absolute top-1/3 left-1/4 opacity-40">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 30 60 L 60 30 L 90 60 L 60 90 Z" stroke="#000" strokeWidth="4" fill="none"/>
          <circle cx="60" cy="60" r="18" stroke="#000" strokeWidth="3"/>
        </svg>
      </div>

      <div className="absolute top-2/3 right-1/4 opacity-40">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 20 60 Q 60 20 100 60 Q 60 100 20 60" stroke="#000" strokeWidth="4" fill="none"/>
          <circle cx="60" cy="60" r="12" fill="#000"/>
        </svg>
      </div>

      {/* Decorative corner ornaments */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-amber-700/30 rounded-tl-lg"></div>
      <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-amber-700/30 rounded-tr-lg"></div>
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-amber-700/30 rounded-bl-lg"></div>
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-amber-700/30 rounded-br-lg"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold mb-3 tracking-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#F5E6D3',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.05em'
              }}>
            Welcome Back
          </h1>
          <p className="text-amber-200 text-lg italic"
             style={{
               fontFamily: "'Playfair Display', serif",
               textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
             }}>
            Continue your journaling journey
          </p>
        </div>

        <div className="animate-slide-up relative"
             style={{
               background: 'rgba(245, 230, 211, 0.95)',
               borderRadius: '1rem',
               padding: '2.5rem',
               boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
               border: '3px solid #8B7355',
               position: 'relative'
             }}>
          
          {/* Book spine effect */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-800/50 via-amber-900/30 to-amber-800/50"></div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">
                      {error.includes('confirm your email') ? 'Email Confirmation Required' : 'Sign In Error'}
                    </p>
                    <p className="text-sm text-amber-700 mt-1">{error}</p>
                    {error.includes('confirm your email') && (
                      <p className="text-xs text-amber-600 mt-2">
                        💡 Tip: Check your spam folder if you don't see the email.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}


            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2"
                     style={{ color: '#6B5D52', fontFamily: "'Merriweather', serif" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderColor: '#A0826D',
                  color: '#3E2723',
                  fontFamily: "'Merriweather', serif"
                }}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2"
                     style={{ color: '#6B5D52', fontFamily: "'Merriweather', serif" }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderColor: '#A0826D',
                  color: '#3E2723',
                  fontFamily: "'Merriweather', serif"
                }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <div className="mt-2 text-right">
                <Link href="/auth/forgot-password" 
                      className="text-sm font-medium hover:underline"
                      style={{ color: '#8B7355', fontFamily: "'Merriweather', serif" }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #B85C38 0%, #D97757 100%)',
                color: '#FFF',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 12px rgba(139, 115, 85, 0.4)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#6B5D52', fontFamily: "'Merriweather', serif" }}>
              Don't have an account?{' '}
              <Link href="/auth/register" 
                    className="font-medium hover:underline"
                    style={{ color: '#B85C38' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

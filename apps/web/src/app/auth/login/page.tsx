'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { fetchApi } from '@/lib/api';
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const [email, setEmail] = useState('user@marketpulse.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetchApi<any>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setUser(res.user, res.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role: 'USER' | 'ADMIN') => {
    if (role === 'USER') {
      setUser({ id: 'user_regular', email: 'user@marketpulse.com', name: 'Alex Rivera', role: 'USER' }, 'mock_token');
    } else {
      setUser({ id: 'user_admin', email: 'admin@marketpulse.com', name: 'Sarah Connor (Admin)', role: 'ADMIN' }, 'mock_token');
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-mono">
      <div className="w-full max-w-md p-8 bg-surface border border-border rounded-2xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center font-extrabold text-black text-lg mx-auto">
            M
          </div>
          <h1 className="text-2xl font-black text-foreground">MARKET<span className="text-primary">PULSE</span></h1>
          <p className="text-xs text-muted">Sign in to your financial intelligence workspace</p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/40 rounded text-xs text-danger">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-muted block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-elevated text-foreground px-3 py-2.5 rounded border border-border focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="text-muted block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-elevated text-foreground px-3 py-2.5 rounded border border-border focus:outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold text-xs rounded hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Demo Login Buttons */}
        <div className="pt-4 border-t border-border space-y-2 text-xs">
          <span className="text-[11px] text-muted block text-center">INSTANT 1-CLICK DEMO LOGIN</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => demoLogin('USER')}
              className="p-2.5 bg-surface-elevated hover:bg-primary/20 border border-border rounded text-foreground font-semibold flex items-center justify-center space-x-1.5"
            >
              <UserCheck className="w-4 h-4 text-primary" />
              <span>Demo User</span>
            </button>
            <button
              onClick={() => demoLogin('ADMIN')}
              className="p-2.5 bg-surface-elevated hover:bg-primary/20 border border-border rounded text-foreground font-semibold flex items-center justify-center space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

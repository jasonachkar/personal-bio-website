'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Lock, Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          honeypot, // Include honeypot field
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setAttempts(prev => prev + 1);

        if (response.status === 429) {
          setError(data.error || 'Too many attempts. Please try again later.');
        } else {
          setError(data.error || 'Login failed. Please check your password.');
        }

        // Clear password on failed attempt
        setPassword('');
      }
    } catch (err) {
      setAttempts(prev => prev + 1);
      setError('Network error. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-radial-fade" aria-hidden="true" />

      <Card className="relative z-10 w-full max-w-md border-border bg-background-card p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-text-primary">Secure Admin Access</h1>
          <p className="text-sm text-text-secondary">
            Protected by enterprise-grade security
          </p>
        </div>

        {attempts >= 3 && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-400" />
            <div className="text-sm text-yellow-400">
              <p className="font-semibold">Multiple failed attempts detected</p>
              <p className="mt-1 text-xs">
                Your IP is being monitored. Excessive attempts will result in temporary lockout.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - hidden from users, visible to bots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background-elevated px-4 py-3 pr-12 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your password"
                required
                autoFocus
                autoComplete="current-password"
                disabled={loading}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Authenticating...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3 border-t border-border pt-6">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Shield className="h-3 w-3 text-primary" />
            <span>Protected by rate limiting, IP tracking, and audit logging</span>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-text-secondary transition-colors hover:text-primary"
            >
              ← Back to website
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  border: '1.5px solid var(--border)',
  borderRadius: '10px',
  color: 'var(--text)',
  fontFamily: "'Sarabun', sans-serif",
  fontSize: '0.95rem',
  padding: '0.75rem 1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      router.push('/account');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={{
      background: 'var(--deep-navy)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 800,
              fontSize: '1.6rem',
              background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ThaiPost<span style={{ color: 'var(--thai-red)', WebkitTextFillColor: 'var(--thai-red)' }}>Ad</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 800,
              fontSize: '1.75rem',
              color: 'var(--text)',
              marginBottom: '0.4rem',
            }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Sign in to manage your listings
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="email" style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                color: 'var(--text)',
              }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="password" style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                color: 'var(--text)',
              }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(168,25,46,0.1)',
                border: '1px solid rgba(168,25,46,0.35)',
                borderRadius: '10px',
                padding: '0.9rem 1rem',
                color: '#f47a8a',
                fontSize: '0.875rem',
              }}>
                <strong>✕ Error</strong>
                <p style={{ marginTop: '0.2rem' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="thai-btn"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '0.95rem',
                borderRadius: '10px',
                marginTop: '0.25rem',
              }}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" style={{
                color: 'var(--gold)',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                Create one now
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

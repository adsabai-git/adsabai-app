'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
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
  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [error,      setError]      = useState('');
  const { login, isLoading } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    const result = await login(identifier, password);
    if (result.ok) {
      router.push('/account');
    } else {
      setError(result.error || t('err_login_failed'));
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
          <Link href="/">
            <img src="/AdSabai_Logo_Vector.svg" alt="AdSabai" height="38" style={{ display: 'block', margin: '0 auto' }} />
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
              {t('login_welcome')}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {t('login_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="identifier" style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                color: 'var(--text)',
              }}>
                {t('login_identifier')}
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="email"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={t('login_ph_id')}
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
                {t('login_password')}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('login_ph_pw')}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '-0.4rem' }}>
              <Link href="/auth/forgot-password" style={{ fontSize: '0.83rem', color: 'var(--gold)', textDecoration: 'none', fontFamily: "'Kanit', sans-serif", fontWeight: 600 }}>
                {t('login_forgot') || 'Forgot password?'}
              </Link>
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
              {isLoading ? t('login_loading') : t('login_btn')}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {t('login_no_account')}{' '}
              <Link href="/auth/register" style={{
                color: 'var(--gold)',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                {t('login_create')}
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

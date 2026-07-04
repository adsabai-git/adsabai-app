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

const onFocus = (e: { currentTarget: HTMLInputElement }) => {
  e.currentTarget.style.borderColor = 'var(--gold)';
};
const onBlur = (e: { currentTarget: HTMLInputElement }) => {
  e.currentTarget.style.borderColor = 'var(--border)';
};

export default function Register() {
  const [name,            setName]            = useState('');
  const [identifier,      setIdentifier]      = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,           setError]           = useState('');
  const { register, isLoading } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('err_passwords_no_match'));
      return;
    }
    if (password.length < 6) {
      setError(t('err_pw_too_short'));
      return;
    }

    const result = await register(identifier, password, name);
    if (result.ok) {
      router.push('/account');
    } else {
      setError(result.error || t('err_register_failed'));
    }
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Kanit', sans-serif",
    fontWeight: 600,
    fontSize: '0.8rem',
    letterSpacing: '0.05em',
    color: 'var(--text)',
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
              {t('register_welcome')}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {t('register_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="name" style={labelStyle}>{t('register_name')}</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('register_ph_name')}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="identifier" style={labelStyle}>{t('register_identifier')}</label>
              <input
                id="identifier"
                type="text"
                autoComplete="email"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={t('register_ph_id')}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="password" style={labelStyle}>{t('register_password')}</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('register_ph_pw')}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="confirmPassword" style={labelStyle}>{t('register_confirm')}</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder={t('register_ph_confirm')}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
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
              {isLoading ? t('register_loading') : t('register_btn')}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {t('register_has_account')}{' '}
              <Link href="/auth/login" style={{
                color: 'var(--gold)',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                {t('register_signin')}
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

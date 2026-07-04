'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '../../contexts/LangContext';

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

export default function ForgotPassword() {
  const { t } = useLang();
  const [identifier, setIdentifier] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'phone_only' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('fp_err_generic'));
        setStatus('error');
        return;
      }
      if (data.error) {
        setError(data.error);
        setStatus('error');
        return;
      }
      if (data.phone_only) {
        setStatus('phone_only');
      } else {
        setStatus('sent');
      }
    } catch {
      setError(t('fp_err_generic'));
      setStatus('error');
    }
  }

  return (
    <div style={{ background: 'var(--deep-navy)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/">
            <img src="/AdSabai_Logo_Vector.svg" alt="AdSabai" height="38" style={{ display: 'block', margin: '0 auto' }} />
          </Link>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

          {/* Success: email sent */}
          {status === 'sent' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
              <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
                {t('fp_sent_title')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                {t('fp_sent_body')}
              </p>
              <Link href="/auth/login" style={{ color: 'var(--gold)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                ← {t('fp_back_login')}
              </Link>
            </div>
          ) : status === 'phone_only' ? (
            /* Phone-only account — can't send email */
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
                {t('fp_phone_title')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {t('fp_phone_body')}
              </p>
              <a href="mailto:support@adsabai.com" style={{ display: 'inline-block', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)', color: 'var(--gold)', fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '0.88rem', padding: '0.6rem 1.4rem', borderRadius: '10px', textDecoration: 'none', marginBottom: '1.25rem' }}>
                support@adsabai.com
              </a>
              <div>
                <Link href="/auth/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
                  ← {t('fp_back_login')}
                </Link>
              </div>
            </div>
          ) : (
            /* Main form */
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
                  {t('fp_title')}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {t('fp_subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="identifier" style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--text)' }}>
                    {t('fp_label')}
                  </label>
                  <input
                    id="identifier"
                    type="email"
                    autoComplete="email"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={t('fp_placeholder')}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>

                {(status === 'error') && (
                  <div style={{ background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)', borderRadius: '10px', padding: '0.9rem 1rem', color: '#f47a8a', fontSize: '0.875rem' }}>
                    ✕ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="thai-btn"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '10px', marginTop: '0.25rem' }}
                >
                  {status === 'loading' ? t('fp_sending') : t('fp_btn')}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <Link href="/auth/login" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
                    ← {t('fp_back_login')}
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

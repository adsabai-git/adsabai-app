'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

function ResetPasswordForm() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const uid   = searchParams.get('uid') ?? '';

  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !uid) setStatus('error');
  }, [token, uid]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError(t('err_passwords_no_match'));
      return;
    }
    if (password.length < 6) {
      setError(t('err_pw_too_short'));
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, uid, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('rp_err_generic'));
        setStatus('error');
        return;
      }
      setStatus('done');
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch {
      setError(t('rp_err_generic'));
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

          {status === 'done' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
                {t('rp_done_title')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {t('rp_done_body')}
              </p>
            </div>
          ) : (!token || !uid) ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
                {t('rp_invalid_title')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {t('rp_invalid_body')}
              </p>
              <Link href="/auth/forgot-password" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}>
                {t('rp_request_new')}
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
                  {t('rp_title')}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {t('rp_subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="password" style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--text)' }}>
                    {t('rp_new_pw')}
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t('register_ph_pw')}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="confirm" style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--text)' }}>
                    {t('register_confirm')}
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder={t('register_ph_confirm')}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>

                {(error || status === 'error') && (
                  <div style={{ background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)', borderRadius: '10px', padding: '0.9rem 1rem', color: '#f47a8a', fontSize: '0.875rem' }}>
                    ✕ {error || t('rp_err_generic')}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="thai-btn"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '10px', marginTop: '0.25rem' }}
                >
                  {status === 'loading' ? t('rp_saving') : t('rp_btn')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

function SectionDivider() {
  return <div style={{ height: '1px', background: 'var(--border)', margin: '2.5rem 0' }} />;
}

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

function FormField({ label, htmlFor, children }: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label htmlFor={htmlFor} style={{
        fontFamily: "'Kanit', sans-serif",
        fontWeight: 600,
        fontSize: '0.8rem',
        letterSpacing: '0.05em',
        color: 'var(--text)',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function PlanCard({ plan, hoverBorder, accentColor, badge, badgeBg, badgeColor }: {
  plan: { href: string; tag: string; title: string; description: string; features: string[]; cta: string };
  hoverBorder: string;
  accentColor: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={plan.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--card-bg)',
        border: `1px solid ${hovered ? hoverBorder : 'var(--border)'}`,
        borderRadius: '18px',
        padding: '1.75rem',
        textDecoration: 'none',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '40px', height: '40px', borderRadius: '50%',
          background: badgeBg, color: badgeColor,
          fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1rem', flexShrink: 0,
        }}>
          {badge}
        </span>
        <span style={{
          fontFamily: "'Kanit', sans-serif", fontSize: '0.65rem', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)',
        }}>
          {plan.tag}
        </span>
      </div>

      <h3 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.6rem' }}>
        {plan.title}
      </h3>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.25rem', flex: 1 }}>
        {plan.description}
      </p>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text)' }}>
            <span style={{ color: accentColor, fontSize: '1rem', lineHeight: 1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <div style={{
        width: '100%', padding: '0.65rem', textAlign: 'center',
        border: `1px solid ${hovered ? hoverBorder : 'var(--border)'}`,
        borderRadius: '50px', fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.85rem',
        color: hovered ? accentColor : 'var(--text-muted)',
        background: 'var(--surface)', transition: 'border-color 0.2s, color 0.2s',
      }}>
        {plan.cta}
      </div>
    </Link>
  );
}

function RecoveryEmailSection({ t, currentEmail }: { t: (k: string) => string; currentEmail: string | null }) {
  const [email, setEmail] = useState(currentEmail ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');
  const hasEmail = !!currentEmail;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving'); setErrMsg('');
    try {
      const token = localStorage.getItem('token') ?? '';
      const res = await fetch('/api/auth/add-recovery-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || 'Failed to save.'); setStatus('error'); return; }
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem('user', JSON.stringify({ ...u, email: data.user.email }));
      }
      setStatus('done');
    } catch {
      setErrMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') return (
    <div style={{ maxWidth: '500px', margin: '0 auto 0' }}>
      <SectionDivider />
      <div style={{ background: 'rgba(46,204,138,0.08)', border: '1px solid rgba(46,204,138,0.3)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
        <p style={{ color: 'var(--accent-green)', fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '0.95rem' }}>
          {t('acc_recovery_success')}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto 0' }}>
      <SectionDivider />
      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '16px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.9rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🔐</span>
          <div>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--gold)', marginBottom: '0.3rem' }}>
              {hasEmail ? t('acc_recovery_update_title') : t('acc_recovery_title')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {hasEmail ? t('acc_recovery_update_sub') : t('acc_recovery_sub')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('acc_recovery_ph')}
            disabled={status === 'saving'}
            style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          />
          <button
            type="submit"
            disabled={status === 'saving'}
            style={{
              padding: '0.75rem 1.25rem', borderRadius: '10px',
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)',
              color: 'var(--gold)', fontFamily: "'Kanit',sans-serif", fontWeight: 700,
              fontSize: '0.88rem', cursor: status === 'saving' ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', transition: 'background 0.2s',
              opacity: status === 'saving' ? 0.6 : 1,
            }}
            onMouseOver={e => { if (status !== 'saving') e.currentTarget.style.background = 'rgba(201,168,76,0.25)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; }}
          >
            {status === 'saving' ? t('acc_recovery_saving') : hasEmail ? t('acc_recovery_update_btn') : t('acc_recovery_btn')}
          </button>
        </form>

        {(status === 'error') && errMsg && (
          <p style={{ color: '#f47a8a', fontSize: '0.82rem', marginTop: '0.6rem' }}>✕ {errMsg}</p>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, updateProfile, logout } = useAuth();
  const { t } = useLang();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const plans = [
    {
      href: '/ads/basic',
      tag: t('plan_basic_tag'),
      title: t('plan_basic_title'),
      badge: 'B',
      badgeBg: '#2ECC8A',
      badgeColor: '#0f1623',
      accentColor: '#2ECC8A',
      hoverBorder: '#2ECC8A',
      description: t('plan_basic_desc'),
      features: [t('plan_basic_f1'), t('plan_basic_f2'), t('plan_basic_f3'), t('plan_basic_f4')],
      cta: t('plan_basic_cta'),
    },
    {
      href: '/ads/standard',
      tag: t('plan_standard_tag'),
      title: t('plan_standard_title'),
      badge: 'S',
      badgeBg: 'var(--accent-green)',
      badgeColor: 'var(--deep-navy)',
      accentColor: 'var(--accent-green)',
      hoverBorder: 'var(--accent-green)',
      description: t('plan_standard_desc'),
      features: [t('plan_standard_f1'), t('plan_standard_f2'), t('plan_standard_f3')],
      cta: t('plan_standard_cta'),
    },
    {
      href: '/ads/premium',
      tag: t('plan_premium_tag'),
      title: t('plan_premium_title'),
      badge: 'P',
      badgeBg: 'var(--thai-teal)',
      badgeColor: '#fff',
      accentColor: '#4DD9D9',
      hoverBorder: '#4DD9D9',
      description: t('plan_premium_desc'),
      features: [t('plan_premium_f1'), t('plan_premium_f2'), t('plan_premium_f3')],
      cta: t('plan_premium_cta'),
    },
  ];

  useEffect(() => {
    if (user) {
      setName(user.name);
      setIdentifier(user.phone || user.email || '');
    }
  }, [user]);

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (password && password !== confirmPassword) {
      setError(t('acc_err_pw_match'));
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfile(name, identifier, password || undefined);
      if (!success) {
        setError(t('acc_err_update'));
      } else {
        setMessage(t('acc_success'));
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setError(t('acc_err_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || t('acc_delete_failed'));
        setIsDeleting(false);
        return;
      }
      logout();
      localStorage.removeItem('adSabaiUser');
      window.location.href = '/assets/thailand-ads-platform.html';
    } catch {
      setDeleteError(t('acc_delete_net_err'));
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ background: 'var(--deep-navy)', minHeight: '100vh', padding: '2.5rem 1.25rem 5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* ── Page Header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
            <div>
              <p style={{ fontFamily: "'Kanit', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.6rem' }}>
                {t('acc_my_account')}
              </p>
              <h1 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.6rem)', color: 'var(--text)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                {t('acc_title')}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', lineHeight: 1.6 }}>
                {t('acc_subtitle')}
              </p>
            </div>

            <Link
              href="/ads/manage"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--text)', fontFamily: "'Kanit', sans-serif",
                fontWeight: 600, fontSize: '0.85rem',
                padding: '0.6rem 1.3rem', borderRadius: '50px',
                textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s',
                whiteSpace: 'nowrap', marginTop: '0.25rem',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
            >
              {t('acc_manage_btn')}
            </Link>
          </div>

          <SectionDivider />

          {/* ── Section label ── */}
          <p style={{ fontFamily: "'Kanit', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {t('acc_plan_section')}
          </p>

          {/* ── Plan Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.href}
                plan={plan}
                hoverBorder={plan.hoverBorder}
                accentColor={plan.accentColor}
                badge={plan.badge}
                badgeBg={plan.badgeBg}
                badgeColor={plan.badgeColor}
              />
            ))}
          </div>

          <SectionDivider />

          {/* ── Account Settings Form ── */}
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <p style={{ fontFamily: "'Kanit', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem', textAlign: 'center' }}>
              {t('acc_settings')}
            </p>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1.6rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
                  {t('acc_profile_title')}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {t('acc_profile_sub')}
                </p>
              </div>

              {message && (
                <div style={{ background: 'rgba(46,204,138,0.08)', border: '1px solid rgba(46,204,138,0.3)', borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '1.5rem', color: 'var(--accent-green)', fontSize: '0.875rem' }}>
                  <strong>✓ </strong>{message}
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)', borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '1.5rem', color: '#f47a8a', fontSize: '0.875rem' }}>
                  <strong>✕ </strong>{error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <FormField label={t('acc_name_label')} htmlFor="acc-name">
                  <input
                    id="acc-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('acc_name_ph')}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </FormField>

                <FormField label={t('acc_id_label')} htmlFor="acc-identifier">
                  <input
                    id="acc-identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t('acc_id_ph')}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </FormField>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <p style={{ fontFamily: "'Kanit', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {t('acc_change_pw')}
                  </p>

                  <FormField label={t('acc_new_pw')} htmlFor="acc-pw">
                    <input
                      id="acc-pw"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                    />
                    <p style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {t('acc_pw_hint')}
                    </p>
                  </FormField>

                  <FormField label={t('acc_confirm_pw')} htmlFor="acc-cpw">
                    <input
                      id="acc-cpw"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                    />
                  </FormField>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="thai-btn"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '10px', marginTop: '0.5rem' }}
                >
                  {isSubmitting ? t('acc_saving') : t('acc_save')}
                </button>
              </form>
            </div>
          </div>

          {/* ── Recovery Email (phone-registered accounts) ── */}
          {user?.phone && (
            <RecoveryEmailSection t={t} currentEmail={user?.email ?? null} />
          )}

          {/* ── Danger Zone ── */}
          <div style={{ maxWidth: '500px', margin: '2.5rem auto 0' }}>
            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '2.5rem' }} />

            <p style={{ fontFamily: "'Kanit', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#f47a8a', marginBottom: '1.25rem', textAlign: 'center' }}>
              {t('acc_danger_zone')}
            </p>

            <div style={{ background: 'rgba(168,25,46,0.06)', border: '1px solid rgba(168,25,46,0.3)', borderRadius: '16px', padding: '1.75rem' }}>
              <h3 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f47a8a', marginBottom: '0.5rem' }}>
                {t('acc_delete_title')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {t('acc_delete_desc')}
              </p>

              {deleteError && (
                <div style={{ background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f47a8a', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  {deleteError}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.65rem 1.4rem', borderRadius: '10px',
                  background: 'rgba(168,25,46,0.12)', border: '1px solid rgba(168,25,46,0.4)',
                  color: '#f47a8a', fontFamily: "'Kanit', sans-serif",
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(168,25,46,0.22)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(168,25,46,0.12)'; }}
              >
                {t('acc_delete_btn')}
              </button>
            </div>
          </div>

          {/* ── Delete Confirmation Dialog ── */}
          {showDeleteConfirm && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div style={{ background: 'var(--navy)', border: '1px solid rgba(168,25,46,0.4)', borderRadius: '18px', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
                  <h3 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#f47a8a', marginBottom: '0.6rem' }}>
                    {t('acc_delete_confirm_title')}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {t('acc_delete_confirm_msg')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                    disabled={isDeleting}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    {t('acc_delete_cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', background: 'rgba(168,25,46,0.85)', border: 'none', color: '#fff', fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: isDeleting ? 'not-allowed' : 'pointer', opacity: isDeleting ? 0.6 : 1 }}
                  >
                    {isDeleting ? t('acc_deleting') : t('acc_delete_confirm_btn')}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}

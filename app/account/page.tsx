'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

const plans = [
  {
    href: '/ads/basic',
    tag: 'Basic Plan · FREE (Beta)',
    title: 'Basic Ad',
    badge: 'B',
    badgeBg: '#2ECC8A',
    badgeColor: '#0f1623',
    accentColor: '#2ECC8A',
    hoverBorder: '#2ECC8A',
    description: 'Free during our beta launch! Includes 1 photo and runs for 14 days.',
    features: ['1 photo upload', '14-day listing', 'Standard placement', 'Free during beta'],
    cta: 'Post Free Basic Ad →',
  },
  {
    href: '/ads/standard',
    tag: 'Standard Plan · ฿149',
    title: 'Standard Ad',
    badge: 'S',
    badgeBg: 'var(--accent-green)',
    badgeColor: 'var(--deep-navy)',
    accentColor: 'var(--accent-green)',
    hoverBorder: 'var(--accent-green)',
    description: 'More visibility with up to 3 photos, contact info, and location for 21 days.',
    features: ['Up to 3 photos', '21-day listing', 'Location & phone'],
    cta: 'Create Standard Ad — ฿149',
  },
  {
    href: '/ads/premium',
    tag: 'Premium Plan · ฿200',
    title: 'Premium Ad',
    badge: 'P',
    badgeBg: 'var(--thai-teal)',
    badgeColor: '#fff',
    accentColor: '#4DD9D9',
    hoverBorder: '#4DD9D9',
    description: 'Maximum exposure with up to 5 photos, featured placement for 30 days.',
    features: ['Up to 5 photos', '30-day listing', 'Featured placement'],
    cta: 'Create Premium Ad — ฿200',
  },
];

function SectionDivider() {
  return (
    <div style={{
      height: '1px',
      background: 'var(--border)',
      margin: '2.5rem 0',
    }} />
  );
}

export default function AccountPage() {
  const { user, updateProfile, logout } = useAuth();
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

  useEffect(() => {
    if (user) {
      setName(user.name);
      setIdentifier(user.email || user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfile(name, identifier, password || undefined);
      if (!success) {
        setError('Unable to update account details.');
      } else {
        setMessage('Account details updated successfully.');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
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
        setDeleteError(data.error || 'Failed to delete account.');
        setIsDeleting(false);
        return;
      }
      logout();
      localStorage.removeItem('adSabaiUser');
      window.location.href = '/assets/thailand-ads-platform.html';
    } catch {
      setDeleteError('Network error. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{
        background: 'var(--deep-navy)',
        minHeight: '100vh',
        padding: '2.5rem 1.25rem 5rem',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* ── Page Header ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '0.5rem',
          }}>
            <div>
              <p style={{
                fontFamily: "'Kanit', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '0.6rem',
              }}>
                My Account
              </p>
              <h1 style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
                color: 'var(--text)',
                lineHeight: 1.15,
                marginBottom: '0.5rem',
              }}>
                Manage Your Profile
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', lineHeight: 1.6 }}>
                Create new listings, update account details, and manage your presence on AdSabai.
              </p>
            </div>

            <Link
              href="/ads/manage"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '0.6rem 1.3rem',
                borderRadius: '50px',
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
                marginTop: '0.25rem',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.color = 'var(--gold)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              Manage Ads →
            </Link>
          </div>

          <SectionDivider />

          {/* ── Section label ── */}
          <p style={{
            fontFamily: "'Kanit', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
          }}>
            Choose Your Ad Package
          </p>

          {/* ── Plan Cards ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.25rem',
          }}>
            {plans.map((plan) => (
              <PlanCard key={plan.href} plan={plan} />
            ))}
          </div>

          <SectionDivider />

          {/* ── Account Settings Form ── */}
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <p style={{
              fontFamily: "'Kanit', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}>
              Account Settings
            </p>

            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{
                  fontFamily: "'Kanit', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.6rem',
                  color: 'var(--text)',
                  marginBottom: '0.4rem',
                }}>
                  Profile Information
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Update your name, contact, and password below.
                </p>
              </div>

              {message && (
                <div style={{
                  background: 'rgba(46,204,138,0.08)',
                  border: '1px solid rgba(46,204,138,0.3)',
                  borderRadius: '10px',
                  padding: '0.9rem 1rem',
                  marginBottom: '1.5rem',
                  color: 'var(--accent-green)',
                  fontSize: '0.875rem',
                }}>
                  <strong>✓ Success</strong>
                  <p style={{ marginTop: '0.2rem' }}>{message}</p>
                </div>
              )}

              {error && (
                <div style={{
                  background: 'rgba(168,25,46,0.1)',
                  border: '1px solid rgba(168,25,46,0.35)',
                  borderRadius: '10px',
                  padding: '0.9rem 1rem',
                  marginBottom: '1.5rem',
                  color: '#f47a8a',
                  fontSize: '0.875rem',
                }}>
                  <strong>✕ Error</strong>
                  <p style={{ marginTop: '0.2rem' }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <FormField label="Account Name" htmlFor="acc-name">
                  <input
                    id="acc-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </FormField>

                <FormField label="Email or Mobile Number" htmlFor="acc-identifier">
                  <input
                    id="acc-identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="your@email.com or +66 000 000 000"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </FormField>

                {/* Password divider */}
                <div style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                }}>
                  <p style={{
                    fontFamily: "'Kanit', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}>
                    Change Password
                  </p>

                  <FormField label="New Password" htmlFor="acc-pw">
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
                      Leave blank to keep current password
                    </p>
                  </FormField>

                  <FormField label="Confirm Password" htmlFor="acc-cpw">
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
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    fontSize: '0.95rem',
                    borderRadius: '10px',
                    marginTop: '0.5rem',
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Danger Zone ── */}
          <div style={{ maxWidth: '500px', margin: '2.5rem auto 0' }}>
            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '2.5rem' }} />

            <p style={{
              fontFamily: "'Kanit', sans-serif", fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#f47a8a', marginBottom: '1.25rem', textAlign: 'center',
            }}>
              Danger Zone
            </p>

            <div style={{
              background: 'rgba(168,25,46,0.06)',
              border: '1px solid rgba(168,25,46,0.3)',
              borderRadius: '16px',
              padding: '1.75rem',
            }}>
              <h3 style={{
                fontFamily: "'Kanit', sans-serif", fontWeight: 700,
                fontSize: '1rem', color: '#f47a8a', marginBottom: '0.5rem',
              }}>
                Delete Account
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Permanently delete your account and all associated ads. This action cannot be undone.
              </p>

              {deleteError && (
                <div style={{
                  background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)',
                  borderRadius: '8px', padding: '0.75rem 1rem',
                  color: '#f47a8a', fontSize: '0.82rem', marginBottom: '1rem',
                }}>
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
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(168,25,46,0.22)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(168,25,46,0.12)'; }}
              >
                🗑 Delete My Account
              </button>
            </div>
          </div>

          {/* ── Delete Confirmation Dialog ── */}
          {showDeleteConfirm && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}>
              <div style={{
                background: 'var(--navy)', border: '1px solid rgba(168,25,46,0.4)',
                borderRadius: '18px', padding: '2rem', maxWidth: '400px', width: '100%',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
                  <h3 style={{
                    fontFamily: "'Kanit', sans-serif", fontWeight: 800,
                    fontSize: '1.25rem', color: '#f47a8a', marginBottom: '0.6rem',
                  }}>
                    Delete Account?
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    This will permanently delete your account and <strong style={{ color: 'var(--text)' }}>all your posted ads</strong>. There is no way to recover this data.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                    disabled={isDeleting}
                    style={{
                      flex: 1, padding: '0.75rem', borderRadius: '10px',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      color: 'var(--text)', fontFamily: "'Kanit', sans-serif",
                      fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    style={{
                      flex: 1, padding: '0.75rem', borderRadius: '10px',
                      background: 'rgba(168,25,46,0.85)', border: 'none',
                      color: '#fff', fontFamily: "'Kanit', sans-serif",
                      fontWeight: 700, fontSize: '0.9rem',
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      opacity: isDeleting ? 0.6 : 1,
                    }}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
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

/* ── Sub-components ─────────────────────────────────────────────── */

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

function PlanCard({ plan }: { plan: typeof plans[number] }) {
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
        border: `1px solid ${hovered ? plan.hoverBorder : 'var(--border)'}`,
        borderRadius: '18px',
        padding: '1.75rem',
        textDecoration: 'none',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }}
    >
      {/* Badge + tag row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: plan.badgeBg,
          color: plan.badgeColor,
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 800,
          fontSize: '1rem',
          flexShrink: 0,
        }}>
          {plan.badge}
        </span>
        <span style={{
          fontFamily: "'Kanit', sans-serif",
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          {plan.tag}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Kanit', sans-serif",
        fontWeight: 700,
        fontSize: '1.25rem',
        color: 'var(--text)',
        marginBottom: '0.6rem',
      }}>
        {plan.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        lineHeight: 1.65,
        marginBottom: '1.25rem',
        flex: 1,
      }}>
        {plan.description}
      </p>

      {/* Feature list */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text)' }}>
            <span style={{ color: plan.accentColor, fontSize: '1rem', lineHeight: 1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div style={{
        width: '100%',
        padding: '0.65rem',
        textAlign: 'center',
        border: `1px solid ${hovered ? plan.hoverBorder : 'var(--border)'}`,
        borderRadius: '50px',
        fontFamily: "'Kanit', sans-serif",
        fontWeight: 600,
        fontSize: '0.85rem',
        color: hovered ? plan.accentColor : 'var(--text-muted)',
        background: 'var(--surface)',
        transition: 'border-color 0.2s, color 0.2s',
      }}>
        {plan.cta}
      </div>
    </Link>
  );
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

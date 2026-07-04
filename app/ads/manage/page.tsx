'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { daysRemaining, isExpired, AD_PACKAGES } from '../../../lib/ad-packages';
import PaymentModal from '../../components/PaymentModal';
import PublishToast from '../../components/PublishToast';

interface Ad {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string | null;
  price: string | null;
  packageType: string;
  phone: string | null;
  website: string | null;
  imageUrls: string[];
  createdAt: string;
  user: { id: number; name: string; email: string };
}

const packageMeta: Record<string, { color: string; bg: string }> = {
  basic:    { color: 'var(--gold)',         bg: 'rgba(201,168,76,0.12)' },
  standard: { color: 'var(--accent-green)', bg: 'rgba(46,204,138,0.1)' },
  premium:  { color: '#4DD9D9',             bg: 'rgba(0,107,107,0.15)' },
};

const BETA_FREE_BASIC = false;

function ConfirmDialog({ title, message, cancelLabel, confirmLabel, onConfirm, onCancel }: {
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>⚠</span>
          <h3 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>
            {title}
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.6rem 1.4rem', borderRadius: '10px', fontSize: '0.875rem',
              fontFamily: "'Kanit', sans-serif", fontWeight: 600,
              background: 'var(--surface)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.6rem 1.4rem', borderRadius: '10px', fontSize: '0.875rem',
              fontFamily: "'Kanit', sans-serif", fontWeight: 700,
              background: 'rgba(168,25,46,0.15)', border: '1px solid rgba(168,25,46,0.4)',
              color: '#f47a8a', cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(168,25,46,0.28)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(168,25,46,0.15)'; }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function RenewModal({ ad, onClose, onRenewed, t }: { ad: Ad; onClose: () => void; onRenewed: () => void; t: (k: string) => string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showPay,  setShowPay]  = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  const RENEW_PACKAGES = [
    { type: 'basic',    price: BETA_FREE_BASIC ? 0 : AD_PACKAGES.basic.price,    days: AD_PACKAGES.basic.durationDays,    label: t('pkg_basic'),    desc: t('renew_basic_desc'),    badge: BETA_FREE_BASIC ? 'FREE' : '฿79',  color: '#9BA8B8', bg: 'rgba(155,168,184,0.1)' },
    { type: 'standard', price: AD_PACKAGES.standard.price, days: AD_PACKAGES.standard.durationDays, label: t('pkg_standard'), desc: t('renew_standard_desc'), badge: '฿149', color: 'var(--accent-green)', bg: 'rgba(46,204,138,0.1)' },
    { type: 'premium',  price: AD_PACKAGES.premium.price,  days: AD_PACKAGES.premium.durationDays,  label: t('pkg_premium'),  desc: t('renew_premium_desc'),  badge: '฿200', color: '#C9A84C', bg: 'rgba(201,168,76,0.1)' },
  ] as const;

  async function doRenew(pkgType: string, chargeId?: string) {
    setRenewing(true); setError('');
    try {
      const token = localStorage.getItem('token') ?? '';
      const res = await fetch(`/api/ads/${ad.id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packageType: pkgType, chargeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('renew_failed'));
      setSuccess(true);
      setTimeout(() => { onRenewed(); onClose(); }, 1800);
    } catch (e) {
      setError((e as Error).message);
      setRenewing(false);
    }
  }

  function selectAndProceed(pkg: typeof RENEW_PACKAGES[number]) {
    setSelected(pkg.type); setError('');
    if (pkg.price === 0) { doRenew(pkg.type); }
    else                 { setShowPay(true); }
  }

  if (showPay) {
    const pkg = RENEW_PACKAGES.find(p => p.type === selected)!;
    return (
      <PaymentModal
        amount={pkg.price}
        packageLabel={pkg.label}
        isSubmittingAd={renewing}
        onSuccess={(chargeId) => { setShowPay(false); doRenew(pkg.type, chargeId); }}
        onCancel={() => { setShowPay(false); setSelected(null); }}
      />
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '2rem', maxWidth: '520px', width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: "'Kanit',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{t('renew_label')}</p>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', margin: 0, lineHeight: 1.3 }}>
              {ad.title.length > 48 ? ad.title.slice(0, 48) + '…' : ad.title}
            </h3>
          </div>
          <button onClick={onClose} disabled={renewing}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.3rem', cursor: renewing ? 'not-allowed' : 'pointer', lineHeight: 1, padding: '0.2rem 0.4rem', opacity: renewing ? 0.35 : 1 }}>✕</button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
            <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-green)' }}>{t('renew_success')}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('renew_success_sub')}</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {t('renew_intro')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {RENEW_PACKAGES.map(pkg => (
                <button
                  key={pkg.type}
                  disabled={renewing}
                  onClick={() => selectAndProceed(pkg)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                    padding: '0.9rem 1.1rem', borderRadius: '12px', cursor: renewing ? 'not-allowed' : 'pointer',
                    background: selected === pkg.type ? pkg.bg : 'var(--surface)',
                    border: `1.5px solid ${selected === pkg.type ? pkg.color : 'var(--border)'}`,
                    transition: 'all 0.15s', textAlign: 'left', width: '100%',
                    opacity: renewing ? 0.6 : 1,
                  }}
                  onMouseOver={e => { if (!renewing) { e.currentTarget.style.borderColor = pkg.color; e.currentTarget.style.background = pkg.bg; } }}
                  onMouseOut={e => { if (selected !== pkg.type) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; } }}
                >
                  <div>
                    <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: pkg.color }}>{pkg.label}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{pkg.desc}</span>
                  </div>
                  <span style={{
                    fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: '0.95rem',
                    color: pkg.price === 0 ? 'var(--accent-green)' : pkg.color,
                    background: pkg.bg, padding: '0.2rem 0.65rem', borderRadius: '8px', whiteSpace: 'nowrap',
                  }}>{pkg.badge}</span>
                </button>
              ))}
            </div>

            {renewing && (
              <p style={{ textAlign: 'center', color: 'var(--gold)', fontFamily: "'Kanit',sans-serif", fontSize: '0.88rem' }}>
                {t('renewing')}
              </p>
            )}
            {error && (
              <div style={{ background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#f47a8a', fontSize: '0.82rem' }}>
                ✕ {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const PAGE_SIZE = 12;

function buildPageRange(current: number, total: number): (number | '…')[] {
  const range: (number | '…')[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 2) range.push(i);
    else if (range[range.length - 1] !== '…') range.push('…');
  }
  return range;
}

function pgBtn(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '38px', height: '38px', padding: '0 0.6rem',
    borderRadius: '8px', border: active ? 'none' : '1px solid var(--border)',
    background: active ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--surface)',
    color: active ? 'var(--deep-navy)' : 'var(--text)',
    fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.88rem',
    cursor: 'pointer', transition: 'all 0.15s',
  };
}

export default function ManageAdsPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [renewAd, setRenewAd]           = useState<Ad | null>(null);
  const [showRenewToast, setShowRenewToast] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(ads.length / PAGE_SIZE));
    if (page > totalPages) setPage(totalPages);
  }, [ads.length, page]);

  useEffect(() => {
    if (!user) return;

    const loadAds = async () => {
      try {
        const response = await fetch('/api/ads');
        if (!response.ok) throw new Error('Unable to fetch ads');
        const data: Ad[] = await response.json();
        setAds(data.filter((ad) => ad.user.id.toString() === user.id.toString()));
      } catch (err) {
        console.error('Failed to load ads:', err);
        setError(t('err_fetch_ads'));
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const confirmDelete = (id: number) => setConfirmId(id);

  const handleRenewed = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/ads');
      if (!response.ok) return;
      const data: Ad[] = await response.json();
      setAds(data.filter((ad) => ad.user.id.toString() === user.id.toString()));
    } catch { /* silently ignore — modal will close anyway */ }
    setShowRenewToast(true);
  };

  const handleDelete = async () => {
    if (confirmId === null) return;
    const id = confirmId;
    setConfirmId(null);
    setError(null);
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error(t('err_unauthorized'));

      const response = await fetch(`/api/ads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || t('err_delete_ad'));
      }

      setAds((prev) => prev.filter((ad) => ad.id !== id));
    } catch (err) {
      setError((err as Error).message || t('err_delete_generic'));
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(ads.length / PAGE_SIZE));
  const pageAds    = ads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startNum   = (page - 1) * PAGE_SIZE + 1;
  const endNum     = Math.min(page * PAGE_SIZE, ads.length);

  return (
    <ProtectedRoute>
      {confirmId !== null && (
        <ConfirmDialog
          title={t('confirm_delete_title')}
          message={t('confirm_delete_msg')}
          cancelLabel={t('confirm_cancel')}
          confirmLabel={t('confirm_yes_delete')}
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
      {renewAd !== null && (
        <RenewModal
          ad={renewAd}
          onClose={() => setRenewAd(null)}
          onRenewed={handleRenewed}
          t={t}
        />
      )}
      {showRenewToast && (
        <PublishToast onClose={() => setShowRenewToast(false)} />
      )}

      <div style={{ background: 'var(--deep-navy)', minHeight: '100vh', padding: '2.5rem 1.25rem 5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

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
                fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '0.6rem',
              }}>
                {t('manage_my_ads')}
              </p>
              <h1 style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
                color: 'var(--text)', lineHeight: 1.15, marginBottom: '0.5rem',
              }}>
                {t('manage_title')}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {t('manage_subtitle')}
              </p>
            </div>

            <Link
              href="/account"
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
              {t('manage_back')}
            </Link>
          </div>

          {/* ── Divider ── */}
          <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

          {/* ── Error banner ── */}
          {error && (
            <div style={{
              background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)',
              borderRadius: '10px', padding: '0.9rem 1rem',
              color: '#f47a8a', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
              ✕ {error}
            </div>
          )}

          {/* ── Responsive grid styles ── */}
          <style>{`
            .manage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
            @media (max-width: 900px) { .manage-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 560px) { .manage-grid { grid-template-columns: 1fr; } }
            .manage-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.3) !important; }
          `}</style>

          {/* ── States ── */}
          {loading ? (
            <div style={emptyCardStyle}>
              <div style={spinnerStyle} />
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>{t('manage_loading')}</p>
            </div>
          ) : ads.length === 0 ? (
            <div style={{ ...emptyCardStyle, gap: '0.75rem' }}>
              <p style={{ fontSize: '2.5rem' }}>📋</p>
              <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                {t('manage_no_ads')}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {t('manage_no_ads_sub')}
              </p>
              <Link
                href="/account"
                className="thai-btn"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem', borderRadius: '50px', textDecoration: 'none', marginTop: '0.5rem' }}
              >
                {t('manage_post_btn')}
              </Link>
            </div>
          ) : (
            <>
              {/* ── Count label ── */}
              <p style={{
                fontFamily: "'Kanit', sans-serif", fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}>
                {ads.length > PAGE_SIZE
                  ? `${t('manage_showing')} ${startNum}–${endNum} ${t('manage_of')} ${ads.length} ${t('manage_listings')}`
                  : `${ads.length} ${ads.length !== 1 ? t('manage_listings') : t('manage_listing')}`}
              </p>

              <div className="manage-grid">
                {pageAds.map((ad) => {
                  const pkg     = packageMeta[ad.packageType] ?? packageMeta.basic;
                  const cover   = ad.imageUrls[0];
                  const expired = isExpired(ad.createdAt, ad.packageType);
                  const desc    = ad.description.replace(/\n/g, ' ');
                  return (
                    <div
                      key={ad.id}
                      className="manage-card"
                      style={{
                        background: 'var(--card-bg)',
                        border: `1px solid ${ad.packageType === 'premium' ? 'rgba(201,168,76,0.35)' : 'var(--border)'}`,
                        borderRadius: '14px', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        opacity: expired ? 0.65 : 1,
                      }}
                    >
                      {/* Cover image */}
                      <div style={{
                        height: '160px', flexShrink: 0, overflow: 'hidden',
                        background: 'var(--surface)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3rem', position: 'relative',
                      }}>
                        {cover
                          ? <img src={cover} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span>📌</span>}
                        {expired && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: '0.8rem', color: '#f47a8a', background: 'rgba(168,25,46,0.85)', padding: '0.3rem 0.8rem', borderRadius: '8px', letterSpacing: '0.1em' }}>{t('manage_expired')}</span>
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div style={{ padding: '1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                            color: pkg.color, background: pkg.bg,
                            padding: '2px 8px', borderRadius: '20px', border: `1px solid ${pkg.color}40`,
                            fontFamily: "'Kanit', sans-serif",
                          }}>{t(`pkg_${ad.packageType}`)}</span>
                          {!expired && (
                            <span style={{ fontSize: '0.68rem', fontFamily: "'Kanit',sans-serif", fontWeight: 700, color: 'var(--accent-green)' }}>
                              {daysRemaining(ad.createdAt, ad.packageType)}{t('manage_days_left')}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Kanit',sans-serif" }}>
                          {ad.category}{ad.location ? ` · 📍 ${ad.location}` : ''}
                        </div>

                        <h3 style={{
                          fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.97rem',
                          lineHeight: 1.3, color: 'var(--text)',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{ad.title}</h3>

                        <p style={{
                          fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{desc}</p>

                        {ad.price && (
                          <div style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--gold)' }}>
                            {ad.price}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div style={{ borderTop: '1px solid var(--border)', padding: '0.75rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => setRenewAd(ad)}
                          style={{
                            width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                            padding: '0.5rem 0', borderRadius: '8px',
                            background: 'rgba(46,204,138,0.12)', border: '1px solid rgba(46,204,138,0.35)',
                            color: 'var(--accent-green)', fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '0.82rem',
                            cursor: 'pointer', transition: 'background 0.2s',
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(46,204,138,0.22)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(46,204,138,0.12)'; }}
                        >
                          {t('manage_renew')}
                        </button>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link
                            href={`/ads/edit/${ad.id}`}
                            style={{
                              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                              padding: '0.4rem 0', borderRadius: '8px',
                              background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
                              color: 'var(--gold)', fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.78rem',
                              textDecoration: 'none', transition: 'background 0.2s',
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.22)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; }}
                          >
                            {t('manage_edit')}
                          </Link>
                          <button
                            type="button"
                            disabled={deletingId === ad.id}
                            onClick={() => confirmDelete(ad.id)}
                            style={{
                              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                              padding: '0.4rem 0', borderRadius: '8px',
                              background: 'rgba(168,25,46,0.12)', border: '1px solid rgba(168,25,46,0.3)',
                              color: '#f47a8a', fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '0.78rem',
                              cursor: deletingId === ad.id ? 'not-allowed' : 'pointer',
                              opacity: deletingId === ad.id ? 0.5 : 1, transition: 'background 0.2s',
                            }}
                            onMouseOver={(e) => { if (deletingId !== ad.id) e.currentTarget.style.background = 'rgba(168,25,46,0.22)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(168,25,46,0.12)'; }}
                          >
                            {deletingId === ad.id ? t('manage_deleting') : t('manage_delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
                  {page > 1 && (
                    <button onClick={() => setPage(page - 1)} style={pgBtn(false)}>{t('manage_prev')}</button>
                  )}
                  {buildPageRange(page, totalPages).map((p, i) =>
                    p === '…'
                      ? <span key={`e${i}`} style={{ color: 'var(--text-muted)', lineHeight: '38px', padding: '0 0.2rem' }}>…</span>
                      : <button key={p} onClick={() => setPage(p as number)} style={pgBtn(p === page)}>{p}</button>
                  )}
                  {page < totalPages && (
                    <button onClick={() => setPage(page + 1)} style={{ ...pgBtn(false), padding: '0 1rem' }}>{t('manage_next')}</button>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}

const emptyCardStyle: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '18px',
  padding: '3.5rem 2rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const spinnerStyle: React.CSSProperties = {
  width: '36px', height: '36px',
  border: '3px solid var(--border)',
  borderTopColor: 'var(--gold)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

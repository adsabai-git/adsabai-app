'use client';

import { useEffect, useState } from 'react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  adId: number | null;
  read: boolean;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function iconFor(type: string) {
  if (type === 'payment_success') return { emoji: '✅', color: '#2ECC8A' };
  if (type === 'payment_failed')  return { emoji: '❌', color: '#E85D8A' };
  return { emoji: 'ℹ️', color: '#5B9BD5' };
}

const PER_PAGE = 11;

function buildRange(current: number, total: number): (number | '…')[] {
  const range: (number | '…')[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 2) {
      range.push(i);
    } else if (range[range.length - 1] !== '…') {
      range.push('…');
    }
  }
  return range;
}

function pageBtnStyle(active: boolean): React.CSSProperties {
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

export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setError('Please log in to view your notifications.'); setLoading(false); return; }

    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setNotifs(data); setLoading(false); })
      .catch(() => { setError('Failed to load notifications.'); setLoading(false); });
  }, []);

  async function markAllRead() {
    const token = localStorage.getItem('token');
    if (!token) return;
    await fetch('/api/notifications', { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function deleteNotif(id: number) {
    const token = localStorage.getItem('token');
    if (!token) return;
    setNotifs(prev => prev.filter(n => n.id !== id)); // optimistic
    await fetch(`/api/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const unread      = notifs.filter(n => !n.read).length;
  const totalPages  = Math.max(1, Math.ceil(notifs.length / PER_PAGE));
  const pageNotifs  = notifs.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function goToPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{
      background: 'var(--deep-navy)', minHeight: '100vh',
      color: 'var(--text)', fontFamily: "'Sarabun', sans-serif", paddingBottom: '4rem',
    }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--deep-navy) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 1.5rem 3rem', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.5rem',
          background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem',
        }}>
          Ad<span style={{ color: 'var(--thai-red)', WebkitTextFillColor: 'var(--thai-red)' }}>Sabai</span>
        </div>
        <h1 style={{
          fontFamily: "'Kanit', sans-serif", fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem',
        }}>
          🔔 Notifications
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Payment confirmations and ad status updates
        </p>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1.25rem 0' }}>

        {/* Top bar */}
        {!loading && !error && notifs.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {unread > 0 ? `${unread} unread` : 'All caught up'}
            </span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: '8px',
                color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.35rem 0.85rem',
                cursor: 'pointer', fontFamily: "'Sarabun', sans-serif",
              }}>
                Mark all as read
              </button>
            )}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
        )}

        {error && (
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)',
          }}>
            {error}
            {error.includes('log in') && (
              <div style={{ marginTop: '1rem' }}>
                <a href="/assets/thailand-ads-platform.html" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
                  Go to homepage to log in →
                </a>
              </div>
            )}
          </div>
        )}

        {!loading && !error && notifs.length === 0 && (
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <p>No notifications yet. They'll appear here after you post an ad.</p>
          </div>
        )}

        {/* Notification list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pageNotifs.map(n => {
            const { emoji, color } = iconFor(n.type);
            return (
              <div key={n.id} style={{
                background: 'var(--card-bg)',
                border: `1px solid ${n.read ? 'var(--border)' : color + '55'}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                opacity: n.read ? 0.75 : 1,
                transition: 'opacity .2s',
              }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '0.1rem' }}>{emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem',
                  }}>
                    <strong style={{ fontFamily: "'Kanit', sans-serif", fontSize: '0.95rem' }}>
                      {n.title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  {n.adId && (
                    <a href={`/ads/${n.adId}`} style={{
                      fontSize: '0.78rem', color: 'var(--gold)', textDecoration: 'none',
                      display: 'inline-block', marginTop: '0.5rem', fontWeight: 600,
                    }}>
                      View ad →
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  <button
                    onClick={() => deleteNotif(n.id)}
                    title="Delete notification"
                    aria-label="Delete notification"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1,
                      padding: '0.15rem 0.3rem', borderRadius: '4px',
                      transition: 'color 0.15s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = '#f47a8a'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >✕</button>
                  {!n.read && (
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: color, flexShrink: 0,
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
            {page > 1 && (
              <button onClick={() => goToPage(page - 1)} style={pageBtnStyle(false)}>‹ Prev</button>
            )}
            {buildRange(page, totalPages).map((p, i) =>
              p === '…'
                ? <span key={`e${i}`} style={{ color: 'var(--text-muted)', lineHeight: '38px', padding: '0 0.2rem' }}>…</span>
                : <button key={p} onClick={() => goToPage(p as number)} style={pageBtnStyle(p === page)}>{p}</button>
            )}
            {page < totalPages && (
              <button onClick={() => goToPage(page + 1)} style={{ ...pageBtnStyle(false), padding: '0 1rem' }}>Next ›</button>
            )}
          </div>
        )}

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/assets/thailand-ads-platform.html" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none' }}>
            ← Back to Home
          </a>
        </div>

      </div>
    </div>
  );
}

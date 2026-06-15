'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navigation from './components/Navigation';

interface Ad {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string | null;
  price: string | null;
  packageType: string;
  phone: string | null;
  imageUrls: string[];
  views: number;
  createdAt: string;
  user: { name: string };
}

const ADS_PER_PAGE = 12;

const PKG: Record<string, { label: string; color: string; bg: string }> = {
  premium:  { label: 'Premium',  color: '#4DD9D9',             bg: 'rgba(0,107,107,0.18)' },
  standard: { label: 'Standard', color: 'var(--accent-green)', bg: 'rgba(46,204,138,0.10)' },
  basic:    { label: 'Basic',    color: 'var(--gold)',         bg: 'rgba(201,168,76,0.12)' },
};

const CATEGORIES = [
  'All','Real Estate','Vehicles','Jobs','Electronics','Services',
  'Fashion','Food & Beverage','Health & Beauty','Sports','Education',
  'Travel','Pets','Home & Garden','Business','Other',
];

export default function Home() {
  const [ads,        setAds]        = useState<Ad[]>([]);
  const [filtered,   setFiltered]   = useState<Ad[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('All');
  const [page,       setPage]       = useState(1);

  useEffect(() => {
    fetch('/api/ads')
      .then(r => r.json())
      .then((data: Ad[]) => { setAds(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...ads];
    if (category !== 'All') result = result.filter(a => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.location || '').toLowerCase().includes(q)
      );
    }
    setFiltered(result);
    setPage(1);
  }, [ads, category, search]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const totalPages = Math.ceil(filtered.length / ADS_PER_PAGE);
  const pageAds    = filtered.slice((page - 1) * ADS_PER_PAGE, page * ADS_PER_PAGE);

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--deep-navy) 60%, rgba(201,168,76,0.05) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '3rem 1.25rem 2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontFamily: "'Kanit', sans-serif", color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            THAILAND&apos;S PREMIUM CLASSIFIED ADS
          </p>
          <h1 style={{
            fontFamily: "'Kanit', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15,
            color: 'var(--text)', marginBottom: '1rem',
          }}>
            Buy & Sell Anything<br />
            <span style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Across Thailand
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
            Post your ad in minutes. Reach buyers and sellers nationwide.
          </p>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ads — cars, jobs, property…"
              style={{
                width: '100%', padding: '0.9rem 3.5rem 0.9rem 1.2rem',
                background: 'var(--card-bg)', border: '1.5px solid var(--border)',
                borderRadius: '50px', color: 'var(--text)',
                fontFamily: "'Sarabun', sans-serif", fontSize: '0.95rem', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ position: 'absolute', right: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', fontSize: '1.1rem', pointerEvents: 'none' }}>
              &#9906;
            </span>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section style={{ background: 'var(--navy)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1.25rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '0.5rem', minWidth: 'max-content', maxWidth: '1200px', margin: '0 auto' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '0.35rem 0.9rem', borderRadius: '50px', border: '1px solid',
                borderColor: category === cat ? 'var(--gold)' : 'var(--border)',
                background: category === cat ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: category === cat ? 'var(--gold)' : 'var(--text-muted)',
                fontFamily: "'Sarabun', sans-serif", fontSize: '0.8rem',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Ads grid */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.25rem' }}>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {loading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          <Link href="/ads/basic" className="thai-btn" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none' }}>
            + Post Free Ad
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', height: '220px', opacity: 0.5 }} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && pageAds.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</p>
            <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.4rem' }}>No ads found</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {search || category !== 'All' ? 'Try a different search or category' : 'Be the first to post an ad!'}
            </p>
            <Link href="/ads/basic" className="thai-btn" style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', textDecoration: 'none' }}>
              Post the First Ad
            </Link>
          </div>
        )}

        {/* Ad cards */}
        {!loading && pageAds.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {pageAds.map(ad => (
              <Link key={ad.id} href={`/ads/${ad.id}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  background: 'var(--card-bg)', border: '1px solid var(--border)',
                  borderRadius: '16px', overflow: 'hidden',
                  transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer', height: '100%',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(201,168,76,0.15)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Image */}
                  {ad.imageUrls?.length > 0 ? (
                    <div style={{ width: '100%', height: '160px', overflow: 'hidden', background: 'var(--surface)' }}>
                      <img src={ad.imageUrls[0]} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '100px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '2rem', opacity: 0.3 }}>📷</span>
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ padding: '1rem' }}>
                    {/* Package + Category */}
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600,
                        fontFamily: "'Kanit', sans-serif",
                        color: PKG[ad.packageType]?.color || 'var(--gold)',
                        background: PKG[ad.packageType]?.bg || 'rgba(201,168,76,0.12)',
                      }}>
                        {PKG[ad.packageType]?.label || ad.packageType}
                      </span>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: '50px', fontSize: '0.7rem', background: 'var(--surface)', color: 'var(--text-muted)' }}>
                        {ad.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "'Kanit', sans-serif", fontWeight: 700,
                      fontSize: '0.95rem', color: 'var(--text)',
                      marginBottom: '0.35rem',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {ad.title}
                    </h3>

                    {/* Price */}
                    {ad.price && (
                      <p style={{ color: 'var(--gold)', fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>
                        {ad.price}
                      </p>
                    )}

                    {/* Location + views */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {ad.location ? `📍 ${ad.location}` : ''}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        👁 {ad.views ?? 0}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'var(--card-bg)', color: 'var(--text-muted)',
                cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1,
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} style={{
                padding: '0.5rem 0.9rem', borderRadius: '8px',
                border: '1px solid', borderColor: page === n ? 'var(--gold)' : 'var(--border)',
                background: page === n ? 'rgba(201,168,76,0.15)' : 'var(--card-bg)',
                color: page === n ? 'var(--gold)' : 'var(--text-muted)', cursor: 'pointer',
                fontFamily: "'Kanit', sans-serif", fontWeight: page === n ? 700 : 400,
              }}>
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'var(--card-bg)', color: 'var(--text-muted)',
                cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.25rem', marginTop: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem' }}>
            AdSabai
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[['About', '/about'], ['Terms', '/terms'], ['Privacy', '/privacy'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={href} href={href} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} AdSabai. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

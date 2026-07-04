import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabase';

const CATEGORIES = {
  'car-rental':    { name: 'Car Rental',    emoji: '🚗', color: '#C9A84C', desc: 'Rent cars, motorbikes, vans and more across Thailand' },
  'tour-planning': { name: 'Tour Planning', emoji: '🗺️', color: '#2ECC8A', desc: 'Day trips, island tours, guided experiences and travel packages' },
  'accommodation': { name: 'Accommodation', emoji: '🏨', color: '#5B9BD5', desc: 'Hotels, guesthouses, villas and room rentals nationwide' },
  'massage-spa':   { name: 'Massage & Spa', emoji: '💆', color: '#E85D8A', desc: 'Thai massage, luxury spas and wellness treatments' },
  'jobs':          { name: 'Jobs',          emoji: '💼', color: '#F0A500', desc: 'Full-time, part-time and freelance jobs across all sectors' },
  'personal-ads':  { name: 'Personal Ads',  emoji: '💌', color: '#A84C9A', desc: 'Language exchange, social events and personal connections' },
  'leisure':       { name: 'Leisure',       emoji: '🌴', color: '#4CAF8A', desc: 'Muay Thai, cooking classes, activities and entertainment' },
  'other-services': { name: 'Other Services', emoji: '⚡', color: '#E05C4B', desc: 'Other services and listings across Thailand' },
} as const;

const PER_PAGE = 12;

type Ad = {
  id: number;
  title: string;
  description: string;
  location: string | null;
  price: string | null;
  packageType: string;
  phone: string | null;
  website: string | null;
  imageUrls: string;
  views: number;
  ratingAvg: number;
  ratingCount: number;
};

function stars(avg: number) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += i <= Math.round(avg) ? '★' : '☆';
  return s;
}

function AdCard({ ad }: { ad: Ad }) {
  const imgs: string[] = (() => {
    try { return JSON.parse(ad.imageUrls || '[]'); } catch { return []; }
  })();
  const cover = imgs[0];
  const isPremium = ad.packageType === 'premium';
  const isStandard = ad.packageType === 'standard';
  const badgeColor = isPremium ? '#C9A84C' : isStandard ? '#2ECC8A' : '#9BA8B8';
  const badgeBg   = isPremium ? 'rgba(201,168,76,0.15)' : isStandard ? 'rgba(46,204,138,0.15)' : 'rgba(155,168,184,0.12)';
  const badgeLabel = isPremium ? 'FEATURED' : isStandard ? 'STANDARD' : 'BASIC';
  const desc = ad.description.replace(/\n/g, ' ');
  const descPreview = desc.length > 140 ? desc.slice(0, 140).trim() + '…' : desc;

  return (
    <Link href={`/ads/${ad.id}`} className="ad-card" style={{
      background: 'var(--card-bg)',
      border: `1px solid ${isPremium ? 'rgba(201,168,76,0.35)' : 'var(--border)'}`,
      borderRadius: '14px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.15s, box-shadow 0.15s',
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer',
    }}>
      {cover && (
        <div style={{ height: '180px', overflow: 'hidden', flexShrink: 0 }}>
          <img src={cover} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ padding: '1.1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
        {/* Badge + location */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
            color: badgeColor, background: badgeBg,
            padding: '2px 8px', borderRadius: '20px', border: `1px solid ${badgeColor}40`,
            fontFamily: "'Kanit', sans-serif",
          }}>{badgeLabel}</span>
          {ad.location && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              📍 {ad.location}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: '1rem',
          lineHeight: 1.35, color: 'var(--text)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{ad.title}</h3>

        {/* Rating + views */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {ad.ratingCount > 0 && (
            <span style={{ color: '#C9A84C' }}>
              {stars(ad.ratingAvg)} <span style={{ color: 'var(--text-muted)' }}>{ad.ratingAvg.toFixed(1)} · {ad.ratingCount} rated</span>
            </span>
          )}
          <span>👁 {ad.views} views</span>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, flex: 1 }}>{descPreview}</p>

        {/* Price */}
        {ad.price && (
          <div style={{
            fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1rem',
            color: '#C9A84C', marginTop: '0.25rem',
          }}>{ad.price}</div>
        )}

        {/* "View details" hint */}
        <div style={{
          marginTop: '0.5rem', textAlign: 'center', fontSize: '0.8rem',
          color: 'var(--gold)', fontFamily: "'Kanit', sans-serif", fontWeight: 600,
        }}>
          View details →
        </div>
      </div>
    </Link>
  );
}

function Pagination({ current, total, slug }: { current: number; total: number; slug: string }) {
  const pages: (number | '…')[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('…');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('…');
    pages.push(total);
  }

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '38px', height: '38px', borderRadius: '8px', fontWeight: 600,
    fontSize: '0.9rem', textDecoration: 'none', fontFamily: "'Kanit', sans-serif",
    transition: 'all 0.15s',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '2rem' }}>
      {current > 1 && (
        <Link href={`/category/${slug}?page=${current - 1}`} style={{ ...btnBase, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>‹</Link>
      )}
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} style={{ ...btnBase, color: 'var(--text-muted)', cursor: 'default' }}>…</span>
        ) : (
          <Link key={p} href={`/category/${slug}?page=${p}`} style={{
            ...btnBase,
            background: p === current ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--surface)',
            color: p === current ? 'var(--deep-navy)' : 'var(--text)',
            border: p === current ? 'none' : '1px solid var(--border)',
          }}>{p}</Link>
        )
      )}
      {current < total && (
        <Link href={`/category/${slug}?page=${current + 1}`} style={{ ...btnBase, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>›</Link>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES[slug as keyof typeof CATEGORIES];
  if (!cat) return {};
  return {
    title: `${cat.emoji} ${cat.name} Ads in Thailand – AdSabai`,
    description: cat.desc,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;

  const cat = CATEGORIES[slug as keyof typeof CATEGORIES];
  if (!cat) notFound();

  const page = Math.max(1, parseInt(pageStr || '1') || 1);
  const now = new Date().toISOString();

  const { count } = await supabaseAdmin
    .from('Ad')
    .select('*', { count: 'exact', head: true })
    .eq('category', cat.name)
    .eq('status', 'active')
    .gt('expiresAt', now);

  const totalAds = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalAds / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * PER_PAGE;

  const { data: rawAds } = await supabaseAdmin
    .from('Ad')
    .select('id, title, description, location, price, packageType, phone, website, imageUrls, views, ratingAvg, ratingCount')
    .eq('category', cat.name)
    .eq('status', 'active')
    .gt('expiresAt', now)
    .order('createdAt', { ascending: false })
    .range(offset, offset + PER_PAGE - 1);

  const ads: Ad[] = [
    ...((rawAds || []).filter(a => a.packageType === 'premium') as Ad[]),
    ...((rawAds || []).filter(a => a.packageType === 'standard') as Ad[]),
    ...((rawAds || []).filter(a => a.packageType === 'basic') as Ad[]),
  ];

  const startNum = offset + 1;
  const endNum = Math.min(offset + PER_PAGE, totalAds);

  return (
    <>
      <style>{`
        .cat-ads-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) { .cat-ads-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .cat-ads-grid { grid-template-columns: 1fr; } }
        .ad-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }
      `}</style>

      <main style={{ minHeight: '100vh', background: 'var(--deep-navy)', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <Link href="/assets/thailand-ads-platform.html" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span style={{ color: 'var(--text)' }}>{cat.emoji} {cat.name}</span>
          </div>

          {/* Category header */}
          <div style={{
            background: 'var(--card-bg)',
            border: `1px solid var(--border)`,
            borderLeft: `4px solid ${cat.color}`,
            borderRadius: '14px',
            padding: '1.5rem 1.75rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <h1 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                {cat.emoji} {cat.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cat.desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Kanit', sans-serif", fontSize: '2rem', fontWeight: 800, color: cat.color }}>{totalAds}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>active listing{totalAds !== 1 ? 's' : ''}</div>
            </div>
          </div>

          {/* Showing X–Y of Z */}
          {totalAds > 0 && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Showing {startNum}–{endNum} of {totalAds} listings
            </div>
          )}

          {/* Ads grid */}
          {ads.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '14px',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{cat.emoji}</div>
              <div style={{ fontFamily: "'Kanit', sans-serif", fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)' }}>No ads yet</div>
              <div>Be the first to post in {cat.name}!</div>
              <Link href="/ads/basic" style={{
                display: 'inline-block', marginTop: '1.5rem',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                color: 'var(--deep-navy)', fontFamily: "'Kanit', sans-serif", fontWeight: 700,
                padding: '0.65rem 1.5rem', borderRadius: '10px', textDecoration: 'none',
              }}>Post an Ad →</Link>
            </div>
          ) : (
            <div className="cat-ads-grid">
              {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && <Pagination current={currentPage} total={totalPages} slug={slug} />}

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/assets/thailand-ads-platform.html" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none' }}>
              ← Back to all listings
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

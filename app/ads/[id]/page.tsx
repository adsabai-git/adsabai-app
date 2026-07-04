import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabase';
import { isExpired } from '../../../lib/ad-packages';
import ShareButtons from '../../components/ShareButtons';
import ImageGallery from '../../components/ImageGallery';

export const dynamic = 'force-dynamic';

function stars(avg: number) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += i <= Math.round(avg) ? '★' : '☆';
  return s;
}

function categorySlug(name: string) {
  const map: Record<string, string> = {
    'Car Rental': 'car-rental', 'Tour Planning': 'tour-planning',
    'Accommodation': 'accommodation', 'Massage & Spa': 'massage-spa',
    'Jobs': 'jobs', 'Personal Ads': 'personal-ads', 'Leisure': 'leisure',
  };
  return map[name] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: ad } = await supabaseAdmin.from('Ad').select('title, description, imageUrls').eq('id', Number(id)).single();
  if (!ad) return {};
  const a = ad as any;
  const pageUrl = `https://adsabai.com/ads/${id}`;

  return {
    title: `${a.title} – AdSabai`,
    description: (a.description as string).slice(0, 160),
    openGraph: {
      title: `${a.title} – AdSabai`,
      description: (a.description as string).slice(0, 160),
      url: pageUrl,
      siteName: 'AdSabai',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${a.title} – AdSabai`,
      description: (a.description as string).slice(0, 160),
    },
  };
}

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adId = Number(id);
  if (!adId) notFound();

  const { data: raw } = await supabaseAdmin
    .from('Ad')
    .select('id, title, description, category, location, price, phone, website, imageUrls, packageType, status, createdAt, views, ratingAvg, ratingCount')
    .eq('id', adId)
    .single();

  if (!raw || (raw as any).status !== 'active' || isExpired((raw as any).createdAt, (raw as any).packageType)) notFound();

  const ad = raw as any;
  const imgs: string[] = (() => { try { return JSON.parse(ad.imageUrls || '[]'); } catch { return []; } })();
  const isPremium = ad.packageType === 'premium';
  const isStandard = ad.packageType === 'standard';
  const badgeColor = isPremium ? '#C9A84C' : isStandard ? '#2ECC8A' : '#9BA8B8';
  const badgeBg    = isPremium ? 'rgba(201,168,76,0.15)' : isStandard ? 'rgba(46,204,138,0.15)' : 'rgba(155,168,184,0.12)';
  const badgeLabel = isPremium ? '⭐ FEATURED' : isStandard ? 'STANDARD' : 'BASIC';
  const catSlug = categorySlug(ad.category);

  return (
    <>
      <style>{`
        .ad-img-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
        @media (max-width: 600px) { .ad-img-gallery { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <main style={{ minHeight: '100vh', background: '#ffffff', paddingBottom: '4rem', color: '#1a1e2e', fontFamily: "'Sarabun', sans-serif" }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: '0.83rem', color: '#6b7280', display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/assets/thailand-ads-platform.html" style={{ color: '#9a7530', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            {catSlug ? (
              <>
                <Link href={`/category/${catSlug}`} style={{ color: '#9a7530', textDecoration: 'none' }}>{ad.category}</Link>
                <span>›</span>
              </>
            ) : <span>{ad.category}</span>}
            <span style={{ color: '#1a1e2e' }}>{ad.title.length > 40 ? ad.title.slice(0, 40) + '…' : ad.title}</span>
          </div>

          {/* Card */}
          <div style={{
            background: '#ffffff', border: `1px solid ${isPremium ? 'rgba(201,168,76,0.4)' : '#e2e6ed'}`,
            borderRadius: '18px', overflow: 'hidden',
            boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
          }}>

            {/* Cover image + gallery — handles lightbox */}
            <ImageGallery images={imgs} title={ad.title} />

            <div style={{ padding: '1.75rem 2rem' }}>

              {/* Badge + views */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: badgeColor, background: badgeBg, padding: '3px 10px', borderRadius: '20px', border: `1px solid ${badgeColor}40`, fontFamily: "'Kanit', sans-serif" }}>
                  {badgeLabel}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>👁 {ad.views ?? 0} views</span>
              </div>

              {/* Category */}
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9a7530', marginBottom: '0.5rem', fontFamily: "'Kanit', sans-serif" }}>
                {ad.category}{ad.location ? ` · 📍 ${ad.location}` : ''}
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,2rem)', lineHeight: 1.2, marginBottom: '0.75rem', color: '#1a1e2e' }}>
                {ad.title}
              </h1>

              {/* Rating */}
              {ad.ratingCount > 0 && (
                <div style={{ fontSize: '0.88rem', color: '#C9A84C', marginBottom: '1rem' }}>
                  {stars(ad.ratingAvg)}{' '}
                  <span style={{ color: '#6b7280' }}>{ad.ratingAvg.toFixed(1)} · {ad.ratingCount} {ad.ratingCount === 1 ? 'rating' : 'ratings'}</span>
                </div>
              )}

              {/* Price + location row */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {ad.price && (
                  <div style={{ background: '#f4f6f9', borderRadius: '10px', padding: '0.85rem 1.25rem', flex: 1, minWidth: '120px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Price</div>
                    <div style={{ fontFamily: "'Kanit', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#9a7530' }}>{ad.price}</div>
                  </div>
                )}
                {ad.location && (
                  <div style={{ background: '#f4f6f9', borderRadius: '10px', padding: '0.85rem 1.25rem', flex: 1, minWidth: '120px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Location</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>📍 {ad.location}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.65rem', fontFamily: "'Kanit', sans-serif" }}>About this listing</div>
                <p style={{ fontSize: '0.93rem', lineHeight: 1.75, color: '#374151', whiteSpace: 'pre-wrap' }}>{ad.description}</p>
              </div>

              {/* Contact */}
              <div style={{ background: '#f4f6f9', border: '1px solid #e2e6ed', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.75rem', fontFamily: "'Kanit', sans-serif" }}>Contact</div>
                {ad.phone && (
                  <a href={`tel:${ad.phone.replace(/[^0-9+]/g, '')}`} style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    background: 'linear-gradient(135deg, #c9a84c, #a8802e)',
                    color: '#0f1623', fontFamily: "'Kanit', sans-serif", fontWeight: 700,
                    padding: '0.8rem 1.25rem', borderRadius: '10px', textDecoration: 'none',
                    fontSize: '1rem', justifyContent: 'center',
                  }}>
                    📞 {ad.phone}
                  </a>
                )}
                {ad.website && (
                  <a href={ad.website.startsWith('http') ? ad.website : `https://${ad.website}`} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center',
                    border: '1px solid #e2e6ed', color: '#374151', padding: '0.8rem 1.25rem',
                    borderRadius: '10px', textDecoration: 'none', fontSize: '0.92rem',
                    marginTop: ad.phone ? '0.65rem' : 0,
                  }}>
                    🌐 Visit Website
                  </a>
                )}
                {!ad.phone && !ad.website && (
                  <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>No contact info provided.</p>
                )}
              </div>

              {/* Share */}
              <div style={{ borderTop: '1px solid #e2e6ed', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                <ShareButtons adId={ad.id} title={ad.title} />
              </div>

            </div>
          </div>

          {/* Back links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {catSlug && (
              <Link href={`/category/${catSlug}`} style={{ color: '#6b7280', fontSize: '0.88rem', textDecoration: 'none' }}>
                ← Back to {ad.category}
              </Link>
            )}
            <Link href="/assets/thailand-ads-platform.html" style={{ color: '#6b7280', fontSize: '0.88rem', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}

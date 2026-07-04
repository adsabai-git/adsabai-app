import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '../../../lib/supabase';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: ad } = await supabaseAdmin
    .from('Ad')
    .select('title, price, category, imageUrls')
    .eq('id', Number(id))
    .single();

  let coverImage: string | null = null;
  let title = 'AdSabai – Thailand Classified Ads';
  let category = '';
  let price = '';

  if (ad) {
    const a = ad as any;
    title = a.title ?? title;
    category = a.category ?? '';
    price = a.price ?? '';
    let imageArr: string[] = [];
    try {
      if (Array.isArray(a.imageUrls)) imageArr = a.imageUrls;
      else if (typeof a.imageUrls === 'string') imageArr = JSON.parse(a.imageUrls);
    } catch {}
    coverImage = imageArr[0] ?? null;
  }

  // Truncate title for display (avoid overflow)
  const displayTitle = title.length > 65 ? title.slice(0, 65) + '…' : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          background: '#0f1623',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ad photo as full-bleed background — always cropped to landscape */}
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            alt=""
          />
        )}

        {/* Dark gradient from bottom so text is always readable */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: coverImage
              ? 'linear-gradient(to top, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.55) 45%, rgba(10,14,26,0.1) 100%)'
              : 'linear-gradient(135deg, #0f1623 0%, #162032 100%)',
            display: 'flex',
          }}
        />

        {/* Top-left: AdSabai logo */}
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              background: 'rgba(201,168,76,0.15)',
              border: '1.5px solid rgba(201,168,76,0.5)',
              borderRadius: 10,
              padding: '6px 18px',
              display: 'flex',
            }}
          >
            <span style={{ color: '#C9A84C', fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>
              AdSabai
            </span>
          </div>
          {category ? (
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 18, marginLeft: 6 }}>
              {category}
            </span>
          ) : null}
        </div>

        {/* Bottom: title + price */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 48px 44px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <span
            style={{
              color: '#ffffff',
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.15,
              textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            }}
          >
            {displayTitle}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {price ? (
              <span
                style={{
                  color: '#C9A84C',
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                {price}
              </span>
            ) : null}
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 20, marginLeft: 'auto' }}>
              adsabai.com
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

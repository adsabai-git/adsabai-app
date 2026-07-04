'use client';

import { useState, useEffect, useCallback } from 'react';

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => setLightboxIndex(i => (i !== null ? (i - 1 + images.length) % images.length : null)), [images.length]);
  const next = useCallback(() => setLightboxIndex(i => (i !== null ? (i + 1) % images.length : null)), [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, close, prev, next]);

  if (images.length === 0) return null;

  const cover = images[0];
  const rest = images.slice(1);

  return (
    <>
      {/* ── Cover image ── */}
      <div
        style={{ height: '320px', overflow: 'hidden', cursor: 'zoom-in', position: 'relative' }}
        onClick={() => setLightboxIndex(0)}
        title="Click to view full size"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', bottom: 10, right: 12,
          background: 'rgba(0,0,0,0.55)', borderRadius: 6,
          padding: '3px 8px', color: '#fff', fontSize: '0.72rem', fontWeight: 600,
          backdropFilter: 'blur(4px)', pointerEvents: 'none',
        }}>
          🔍 View
        </div>
      </div>

      {/* ── Extra photos grid ── */}
      {rest.length > 0 && (
        <div style={{ padding: '1.75rem 2rem 0' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.65rem', fontFamily: "'Kanit', sans-serif" }}>Photos</div>
          <div className="ad-img-gallery">
            {images.map((src, i) => (
              <div
                key={i}
                onClick={() => setLightboxIndex(i)}
                style={{ position: 'relative', cursor: 'zoom-in', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e6ed' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Photo ${i + 1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0)', transition: 'background 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                  onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.25)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'; }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close */}
          <button
            onClick={close}
            style={{
              position: 'absolute', top: 16, right: 20,
              background: 'rgba(255,255,255,0.12)', border: 'none',
              color: '#fff', fontSize: '1.4rem', width: 44, height: 44,
              borderRadius: '50%', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600,
              background: 'rgba(0,0,0,0.4)', padding: '4px 14px', borderRadius: 20,
            }}>
              {lightboxIndex + 1} / {images.length}
            </div>
          )}

          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt={`${title} – photo ${lightboxIndex + 1}`}
              style={{ maxWidth: '100%', maxHeight: '88vh', objectFit: 'contain', borderRadius: 10, boxShadow: '0 8px 64px rgba(0,0,0,0.6)' }}
            />
          </div>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.12)', border: 'none',
                  color: '#fff', fontSize: '1.5rem', width: 48, height: 48,
                  borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.12)', border: 'none',
                  color: '#fff', fontSize: '1.5rem', width: 48, height: 48,
                  borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 8, padding: '6px 10px',
                background: 'rgba(0,0,0,0.5)', borderRadius: 12, backdropFilter: 'blur(6px)',
              }}
            >
              {images.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    width: 48, height: 36, borderRadius: 6, overflow: 'hidden',
                    border: i === lightboxIndex ? '2px solid #C9A84C' : '2px solid transparent',
                    cursor: 'pointer', flexShrink: 0, opacity: i === lightboxIndex ? 1 : 0.55,
                    transition: 'opacity 0.15s, border-color 0.15s',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

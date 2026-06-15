'use client';

import { useState } from 'react';

interface Props {
  adId: number;
  title: string;
}

export default function ShareButtons({ adId, title }: Props) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return typeof window !== 'undefined'
      ? `${window.location.origin}/ads/${adId}`
      : `/ads/${adId}`;
  }

  function share(platform: 'whatsapp' | 'line' | 'facebook') {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title + ' – AdSabai');
    const targets: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      line:     `https://social-plugins.line.me/lineit/share?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    window.open(targets[platform], '_blank', 'noopener,noreferrer');
  }

  function copyLink() {
    const url = getUrl();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      prompt('Copy this link:', url);
    }
  }

  const iconBtn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '36px', height: '36px', borderRadius: '10px',
    border: '1.5px solid', cursor: 'pointer',
    transition: 'opacity .15s, transform .1s',
    background: 'none', fontSize: '1rem', flexShrink: 0,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: '0.25rem' }}>
        Share
      </span>

      {/* WhatsApp */}
      <button onClick={() => share('whatsapp')} title="Share on WhatsApp" aria-label="Share on WhatsApp"
        style={{ ...iconBtn, color: '#25D366', borderColor: 'rgba(37,211,102,0.35)', background: 'rgba(37,211,102,0.08)' }}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
          <path d="M12 2.04c-5.49 0-9.96 4.47-9.96 9.96 0 1.75.46 3.4 1.25 4.84L2 22l5.3-1.41c1.37.75 2.92 1.14 4.56 1.14 5.49 0 9.96-4.47 9.96-9.96S17.49 2.04 12 2.04Zm5.43 13.1c-.23.65-1.34 1.24-1.83 1.31-.47.07-1.05.1-2.31-.44-2.28-.86-3.77-3.18-3.89-3.31-.12-.13-1.05-1.22-1.05-2.33 0-1.11.61-1.65.83-1.88.22-.23.48-.29.64-.29.16 0 .32 0 .46.01.14.01.33-.05.51.37.18.43.62 1.49.68 1.61.07.12.11.28.01.45-.1.17-.16.28-.31.44-.16.16-.33.35-.47.48-.14.13-.29.27-.1.53.19.26.84 1.38 1.81 2.24 1.25 1.12 2.29 1.47 2.67 1.64.38.17.6.14.82-.08.22-.22.92-1.07 1.16-1.44.24-.37.49-.31.82-.19.33.12 2.08.98 2.43 1.16.35.18.58.27.66.42.08.15.08.87-.15 1.52Z"/>
        </svg>
      </button>

      {/* LINE */}
      <button onClick={() => share('line')} title="Share on LINE" aria-label="Share on LINE"
        style={{ ...iconBtn, color: '#00C300', borderColor: 'rgba(0,195,0,0.35)', background: 'rgba(0,195,0,0.08)' }}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
      </button>

      {/* Facebook */}
      <button onClick={() => share('facebook')} title="Share on Facebook" aria-label="Share on Facebook"
        style={{ ...iconBtn, color: '#1877F2', borderColor: 'rgba(24,119,242,0.35)', background: 'rgba(24,119,242,0.08)' }}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
          <path d="M13.5 3H16V0h-3.5C9.57 0 7 2.49 7 5.6v2.9H4v4h3V24h4.2v-11.5h3.3l.5-4h-3.8V6.5c0-1.1.3-1.8 1.88-1.8Z"/>
        </svg>
      </button>

      {/* Copy link */}
      <button onClick={copyLink} title={copied ? 'Copied!' : 'Copy link'} aria-label="Copy link"
        style={{ ...iconBtn, color: copied ? '#2ECC8A' : '#6b7280', borderColor: copied ? 'rgba(46,204,138,0.4)' : '#e2e6ed', background: copied ? 'rgba(46,204,138,0.08)' : 'rgba(0,0,0,0.03)', padding: '0 0.5rem', width: 'auto', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600 }}>
        {copied ? '✓ Copied' : '📋 Copy link'}
      </button>
    </div>
  );
}

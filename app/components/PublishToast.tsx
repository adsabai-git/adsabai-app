'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  onClose: () => void;
}

export default function PublishToast({ onClose }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  // Slide in after mount, auto-dismiss after 8 s
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 20);
    const hide = setTimeout(() => handleClose(), 8000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300); // wait for slide-out animation then call parent
  }

  function goToNotifications() {
    setVisible(false); // animate out only — do NOT call onClose (would navigate to home)
    setTimeout(() => router.push('/notifications'), 300);
  }

  return (
    <>
      <style>{`
        @keyframes ptSlideIn  { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes ptSlideOut { from { transform: translateX(0);    opacity: 1; } to { transform: translateX(110%); opacity: 0; } }
      `}</style>
      <div
        role="alert"
        aria-live="polite"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99999,
          width: 'min(340px, calc(100vw - 2rem))',
          background: '#0f1e14',
          border: '1.5px solid rgba(46,204,138,0.5)',
          borderLeft: '4px solid #2ECC8A',
          borderRadius: '14px',
          padding: '1rem 1.1rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
          animation: `${visible ? 'ptSlideIn' : 'ptSlideOut'} 0.28s cubic-bezier(.22,.68,0,1.2) forwards`,
          display: 'flex', gap: '0.8rem', alignItems: 'flex-start',
        }}
      >
        {/* Icon */}
        <span style={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0, marginTop: '0.05rem' }}>🎉</span>

        {/* Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '0.97rem',
            color: '#2ECC8A', margin: '0 0 0.2rem',
          }}>
            Ad Published Successfully!
          </p>
          <p style={{ fontSize: '0.82rem', color: '#a8c4ae', margin: '0 0 0.65rem', lineHeight: 1.5 }}>
            Your listing is now live and visible to everyone.
          </p>
          <button
            onClick={goToNotifications}
            style={{
              background: 'rgba(46,204,138,0.15)', border: '1px solid rgba(46,204,138,0.4)',
              borderRadius: '8px', color: '#2ECC8A',
              fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '0.8rem',
              padding: '0.35rem 0.85rem', cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(46,204,138,0.28)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(46,204,138,0.15)'; }}
          >
            🔔 View Notifications →
          </button>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#5a7a60', fontSize: '1rem', lineHeight: 1,
            padding: '0.1rem 0.2rem', flexShrink: 0, transition: 'color 0.15s',
          }}
          onMouseOver={e => { e.currentTarget.style.color = '#2ECC8A'; }}
          onMouseOut={e => { e.currentTarget.style.color = '#5a7a60'; }}
        >✕</button>
      </div>
    </>
  );
}

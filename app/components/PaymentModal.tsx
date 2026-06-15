'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  amount: number;
  packageLabel: string;
  isSubmittingAd: boolean;
  onSuccess: (chargeId: string) => void;
  onCancel: () => void;
}

/* ── hardcoded dark palette so modal looks consistent in light & dark mode ── */
const C = {
  bg:        '#0f1623',
  card:      '#1a2236',
  border:    '#2a3550',
  gold:      '#c9a84c',
  goldLight: 'rgba(201,168,76,0.12)',
  text:      '#e8e8ea',
  muted:     '#7a8aaa',
  surface:   '#242f44',
  error:     '#f47a8a',
  errorBg:   'rgba(168,25,46,0.12)',
  errorBdr:  'rgba(168,25,46,0.35)',
};

const inp: React.CSSProperties = {
  width: '100%', background: C.surface,
  border: `1.5px solid ${C.border}`, borderRadius: '10px',
  color: C.text, fontFamily: "'Sarabun', sans-serif",
  fontSize: '0.93rem', padding: '0.72rem 1rem',
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: "'Kanit',sans-serif", fontWeight: 600,
  fontSize: '0.75rem', letterSpacing: '0.06em', color: C.text,
  marginBottom: '0.4rem', textTransform: 'uppercase',
};
const onFocusInp = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = C.gold);
const onBlurInp = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = C.border);

function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).match(/.{1,4}/g)?.join(' ') ?? '';
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
}

export default function PaymentModal({ amount, packageLabel, isSubmittingAd, onSuccess, onCancel }: Props) {
  const [tab,        setTab]        = useState<'promptpay' | 'card'>('promptpay');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [qrUrl,      setQrUrl]      = useState('');
  const [polling,    setPolling]    = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvv,        setCvv]        = useState('');
  const [cardName,   setCardName]   = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!document.getElementById('omise-js')) {
      const s = document.createElement('script');
      s.id = 'omise-js';
      s.src = 'https://cdn.omise.co/omise.js';
      document.head.appendChild(s);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';

  function switchTab(t: 'promptpay' | 'card') {
    if (pollRef.current) { clearInterval(pollRef.current); setPolling(false); }
    setTab(t); setError(''); setQrUrl('');
  }

  async function handleGenerateQR() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ type: 'promptpay', amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create payment');
      setQrUrl(data.qrCodeUrl);
      setPolling(true);
      pollRef.current = setInterval(async () => {
        try {
          const sr = await fetch(`/api/payment/status?chargeId=${data.chargeId}`);
          const sd = await sr.json();
          if (sd.paid || sd.status === 'successful') {
            clearInterval(pollRef.current!);
            setPolling(false);
            onSuccess(data.chargeId);
          }
        } catch { /* ignore transient poll errors */ }
      }, 3000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCardPay(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const OmiseLib = (window as any).Omise;
      if (!OmiseLib) throw new Error('Payment library not ready — please try again.');
      OmiseLib.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY ?? '');
      const [rawMonth, rawYear] = expiry.split('/');
      const omiseToken = await new Promise<{ id: string }>((resolve, reject) => {
        OmiseLib.createToken('card', {
          name: cardName,
          number: cardNumber.replace(/\s/g, ''),
          expiration_month: rawMonth?.trim(),
          expiration_year: (rawYear?.trim().length === 2 ? '20' : '') + rawYear?.trim(),
          security_code: cvv,
        }, (code: number, resp: any) => {
          if (code === 200) resolve(resp);
          else reject(new Error(resp?.message ?? 'Invalid card details'));
        });
      });
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ type: 'card', token: omiseToken.id, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Card charge failed');
      if (!data.paid && data.status !== 'successful') throw new Error('Card payment was not completed.');
      onSuccess(data.chargeId);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  const canClose = !polling && !isSubmittingAd && !loading;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: '520px',
        background: C.bg, border: `1px solid ${C.border}`,
        borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        margin: 'auto',
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '1.5rem 1.75rem 1.1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '1.15rem', color: C.text, margin: 0 }}>
              Complete Payment
            </p>
            <p style={{ fontSize: '0.83rem', color: C.muted, margin: '0.2rem 0 0' }}>
              {packageLabel} Plan ·{' '}
              <span style={{ color: C.gold, fontWeight: 700 }}>฿{amount}</span>
            </p>
          </div>
          <button onClick={onCancel} disabled={!canClose}
            style={{ background: 'none', border: 'none', color: C.muted, fontSize: '1.4rem', cursor: canClose ? 'pointer' : 'not-allowed', lineHeight: 1, opacity: canClose ? 1 : 0.35, padding: '0.25rem 0.5rem' }}>
            ✕
          </button>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {(['promptpay', 'card'] as const).map(t => (
            <button key={t} onClick={() => switchTab(t)}
              style={{
                flex: 1, padding: '0.85rem', border: 'none', cursor: 'pointer',
                background: tab === t ? C.goldLight : 'transparent',
                color: tab === t ? C.gold : C.muted,
                fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '0.83rem',
                borderBottom: tab === t ? `2px solid ${C.gold}` : '2px solid transparent',
                transition: 'all 0.18s',
              }}>
              {t === 'promptpay' ? '📱 PromptPay QR' : '💳 Credit / Debit Card'}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '1.75rem' }}>

          {isSubmittingAd ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem', animation: 'pmSpin 1s linear infinite', display: 'inline-block' }}>⟳</div>
              <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, color: C.gold, fontSize: '1rem' }}>
                Publishing your ad…
              </p>
              <p style={{ color: C.muted, fontSize: '0.82rem', marginTop: '0.35rem' }}>Please don't close this window.</p>
            </div>

          ) : tab === 'promptpay' ? (
            /* ── PromptPay ── */
            <div style={{ textAlign: 'center' }}>
              {!qrUrl ? (
                <>
                  <div style={{ background: C.surface, borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <p style={{ color: C.muted, fontSize: '0.84rem', lineHeight: 1.65, margin: 0 }}>
                      Scan the QR code with any Thai banking app —
                      <span style={{ color: C.text }}> KBank, SCB, BBL, KTB</span>, and more.
                    </p>
                  </div>
                  <button onClick={handleGenerateQR} disabled={loading}
                    style={{ width: '100%', padding: '0.9rem', background: `linear-gradient(135deg, ${C.gold}, #a8802e)`, color: '#0f1623', border: 'none', borderRadius: '12px', fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, letterSpacing: '0.02em' }}>
                    {loading ? 'Generating…' : '📲 Generate PromptPay QR'}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '1.1rem', display: 'inline-block', marginBottom: '1.1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
                    <img src={qrUrl} alt="PromptPay QR Code" width={220} height={220} style={{ display: 'block' }} />
                  </div>
                  <p style={{ color: C.gold, fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: '1rem', margin: '0 0 0.5rem' }}>
                    Scan &amp; pay ฿{amount}
                  </p>
                  <p style={{ color: C.muted, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', margin: 0 }}>
                    <span style={{ display: 'inline-block', animation: 'pmSpin 1.2s linear infinite' }}>⟳</span>
                    Waiting for payment confirmation…
                  </p>
                </>
              )}
              {error && <ErrBox>{error}</ErrBox>}
            </div>

          ) : (
            /* ── Card ── */
            <form onSubmit={handleCardPay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={lbl}>Card Number</label>
                <input type="text" inputMode="numeric" placeholder="4111 1111 1111 1111"
                  value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))}
                  required style={inp} onFocus={onFocusInp} onBlur={onBlurInp} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={lbl}>Expiry (MM/YY)</label>
                  <input type="text" inputMode="numeric" placeholder="MM/YY"
                    value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                    required style={inp} onFocus={onFocusInp} onBlur={onBlurInp} />
                </div>
                <div>
                  <label style={lbl}>CVV</label>
                  <input type="text" inputMode="numeric" placeholder="123" maxLength={4}
                    value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    required style={inp} onFocus={onFocusInp} onBlur={onBlurInp} />
                </div>
              </div>
              <div>
                <label style={lbl}>Cardholder Name</label>
                <input type="text" placeholder="Name on card"
                  value={cardName} onChange={e => setCardName(e.target.value)}
                  required style={inp} onFocus={onFocusInp} onBlur={onBlurInp} />
              </div>
              {error && <ErrBox>{error}</ErrBox>}
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '0.9rem', background: `linear-gradient(135deg, ${C.gold}, #a8802e)`, color: '#0f1623', border: 'none', borderRadius: '12px', fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.25rem' }}>
                {loading ? 'Processing…' : `Pay ฿${amount}`}
              </button>
            </form>
          )}

          <p style={{ fontSize: '0.7rem', color: C.muted, textAlign: 'center', marginTop: '1.25rem', marginBottom: 0 }}>
            🔒 Secured by <strong style={{ color: C.text }}>Omise</strong> · PCI DSS certified
          </p>
        </div>
      </div>

      <style>{`@keyframes pmSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(168,25,46,0.12)', border: '1px solid rgba(168,25,46,0.35)',
      borderRadius: '10px', padding: '0.75rem 1rem',
      color: '#f47a8a', fontSize: '0.82rem', marginTop: '0.75rem', textAlign: 'left',
    }}>
      ✕ {children}
    </div>
  );
}

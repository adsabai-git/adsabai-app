'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import PaymentModal from '../../components/PaymentModal';
import PublishToast from '../../components/PublishToast';

// ── Set to false when the beta promotion ends and you want to charge ฿79 again ──
const BETA_FREE = true;

const CATEGORIES = [
  'Car Rental', 'Tour Planning', 'Accommodation', 'Massage & Spa',
  'Jobs', 'Personal Ads', 'Leisure', 'Other Services',
];

const PROVINCES = [
  'Amnat Charoen', 'Ang Thong', 'Bangkok', 'Bueng Kan', 'Buri Ram',
  'Chachoengsao', 'Chai Nat', 'Chaiyaphum', 'Chanthaburi', 'Chiang Mai',
  'Chiang Rai', 'Chon Buri', 'Chumphon', 'Kalasin', 'Kamphaeng Phet',
  'Kanchanaburi', 'Khon Kaen', 'Krabi', 'Lampang', 'Lamphun',
  'Loei', 'Lop Buri', 'Mae Hong Son', 'Maha Sarakham', 'Mukdahan',
  'Nakhon Nayok', 'Nakhon Pathom', 'Nakhon Phanom', 'Nakhon Ratchasima',
  'Nakhon Sawan', 'Nakhon Si Thammarat', 'Nan', 'Narathiwat',
  'Nong Bua Lam Phu', 'Nong Khai', 'Nonthaburi', 'Pathum Thani',
  'Pattani', 'Phang Nga', 'Phatthalung', 'Phayao', 'Phetchabun',
  'Phetchaburi', 'Phichit', 'Phitsanulok', 'Phra Nakhon Si Ayutthaya',
  'Phrae', 'Phuket', 'Prachin Buri', 'Prachuap Khiri Khan', 'Ranong',
  'Ratchaburi', 'Rayong', 'Roi Et', 'Sa Kaeo', 'Sakon Nakhon',
  'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram', 'Saraburi',
  'Satun', 'Si Sa Ket', 'Sing Buri', 'Songkhla', 'Sukhothai',
  'Suphan Buri', 'Surat Thani', 'Surin', 'Tak', 'Trang', 'Trat',
  'Ubon Ratchathani', 'Udon Thani', 'Uthai Thani', 'Uttaradit',
  'Yala', 'Yasothon',
];

const PKG = { price: 79, durationDays: 14, maxPhotos: 1 };

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface)',
  border: '1.5px solid var(--border)', borderRadius: '10px',
  color: 'var(--text)', fontFamily: "'Sarabun', sans-serif",
  fontSize: '1rem', padding: '0.8rem 1rem',
  outline: 'none', transition: 'border-color 0.2s',
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = 'var(--gold)');
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = 'var(--border)');

export default function BasicAdForm() {
  const [title,          setTitle]          = useState('');
  const [description,    setDescription]    = useState('');
  const [price,          setPrice]          = useState('');
  const [category,       setCategory]       = useState('');
  const [location,       setLocation]       = useState('');
  const [image,          setImage]          = useState<File | null>(null);
  const [showPayment,    setShowPayment]    = useState(false);
  const [isSubmittingAd, setIsSubmittingAd] = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [success,        setSuccess]        = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] ?? null);
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim() || !category || !location) {
      setError('Please fill in all required fields.');
      return;
    }
    if (BETA_FREE) {
      // Skip payment entirely during beta
      submitAd('beta-free');
    } else {
      setShowPayment(true);
    }
  };

  const submitAd = async (chargeId: string) => {
    setIsSubmittingAd(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }

      let imageUrls: string[] = [];
      if (image) {
        const fd = new FormData();
        fd.append('image', image);
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson?.error || 'Image upload failed');
        imageUrls = [upJson.url];
      }

      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, price, category, location, packageType: 'basic', imageUrls, chargeId }),
      });
      if (!res.ok) throw new Error('Failed to post ad');
      setShowPayment(false);
      setSuccess(true);
      setTimeout(() => router.push('/'), 6000);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.');
      setShowPayment(false);
      setIsSubmittingAd(false);
    }
  };

  return (
    <>
      {showPayment && !BETA_FREE && (
        <PaymentModal
          amount={PKG.price}
          packageLabel="Basic"
          isSubmittingAd={isSubmittingAd}
          onSuccess={submitAd}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {success && <PublishToast onClose={() => router.push('/')} />}
      <ProtectedRoute>
        <div style={{ background: 'var(--deep-navy)', minHeight: '100vh', padding: '2.5rem 1.25rem 5rem' }}>
          <div style={{ maxWidth: '620px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
              <div>
                <p style={{ fontFamily: "'Kanit',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.6rem' }}>
                  Basic Plan {BETA_FREE && <span style={{ background: '#2ECC8A', color: '#0f1623', borderRadius: '4px', padding: '1px 6px', marginLeft: '0.4rem', fontSize: '0.6rem', letterSpacing: '0.15em' }}>BETA FREE</span>}
                </p>
                <h1 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.2rem)', color: 'var(--text)', lineHeight: 1.15, marginBottom: '0.4rem' }}>Post a Basic Ad</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>Quick text listing with one photo — active for 14 days.</p>
              </div>
              <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: "'Kanit',sans-serif", fontWeight: 600, fontSize: '0.85rem', padding: '0.6rem 1.3rem', borderRadius: '50px', textDecoration: 'none', transition: 'border-color 0.2s,color 0.2s', whiteSpace: 'nowrap', marginTop: '0.25rem' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>← Back</Link>
            </div>

            {/* Beta banner */}
            {BETA_FREE && (
              <div style={{
                background: 'rgba(46,204,138,0.08)', border: '1px solid rgba(46,204,138,0.3)',
                borderRadius: '12px', padding: '0.9rem 1.25rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem', margin: '1.5rem 0',
              }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🎉</span>
                <div>
                  <strong style={{ fontFamily: "'Kanit',sans-serif", color: '#2ECC8A', fontSize: '0.88rem' }}>Beta Promotion — Post for Free!</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', lineHeight: 1.5 }}>
                    Basic ads are free during our launch period. No payment required.
                  </p>
                </div>
              </div>
            )}

            <div style={{ height: '1px', background: 'var(--border)', margin: '1.5rem 0' }} />

            {/* Package summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { icon: BETA_FREE ? '🎉' : '฿', label: 'Price', value: BETA_FREE ? 'FREE' : `${PKG.price} Baht` },
                { icon: '📅', label: 'Duration', value: `${PKG.durationDays} days` },
                { icon: '🖼️', label: 'Photos', value: `${PKG.maxPhotos} photo` },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.9rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{item.icon}</p>
                  <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--gold)' }}>{item.value}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* Card */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✓</p>
                  <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-green)', marginBottom: '0.4rem' }}>Ad Posted!</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your basic ad is live for 14 days. Redirecting…</p>
                </div>
              ) : isSubmittingAd ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⟳</div>
                  <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, color: 'var(--gold)', fontSize: '1rem' }}>Publishing your ad…</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.35rem' }}>Please don't close this window.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {error && <ErrBox>{error}</ErrBox>}

                  <Field label="Ad Title *" htmlFor="b-title">
                    <input id="b-title" type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter your ad title" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </Field>

                  <Field label="Description *" htmlFor="b-desc">
                    <textarea id="b-desc" required rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product or service" style={{ ...inputStyle, resize: 'vertical' }} onFocus={onFocus as never} onBlur={onBlur as never} />
                  </Field>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Price (Optional)" htmlFor="b-price">
                      <input id="b-price" type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. ฿1,500/day" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Category *" htmlFor="b-cat">
                      <select id="b-cat" required value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="Location (Province) *" htmlFor="b-location">
                    <select id="b-location" required value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Select province</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>

                  <div style={{ height: '1px', background: 'var(--border)' }} />

                  <Field label={`Photo (${image ? '1' : '0'} / 1)`} htmlFor="b-img">
                    {!image ? (
                      <>
                        <label htmlFor="b-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', border: '1.5px dashed var(--border)', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', transition: 'border-color 0.2s,color 0.2s' }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                          + Upload 1 Photo
                        </label>
                        <input id="b-img" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.6rem 1rem' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📎 {image.name}</span>
                        <button type="button" onClick={() => setImage(null)} style={{ background: 'none', border: 'none', color: '#f47a8a', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginLeft: '1rem', flexShrink: 0 }}>Remove</button>
                      </div>
                    )}
                  </Field>

                  <button type="submit" className="thai-btn" style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '10px', marginTop: '0.25rem' }}>
                    {BETA_FREE ? 'Post Free Basic Ad →' : `Pay & Post Basic Ad — ฿${PKG.price}`}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label htmlFor={htmlFor} style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.05em', color: 'var(--text)' }}>{label}</label>
      {children}
    </div>
  );
}

function ErrBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)', borderRadius: '10px', padding: '0.9rem 1rem', color: '#f47a8a', fontSize: '0.875rem' }}>
      ✕ {children}
    </div>
  );
}

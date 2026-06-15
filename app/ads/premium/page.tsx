'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import PaymentModal from '../../components/PaymentModal';
import PublishToast from '../../components/PublishToast';

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

const PKG = { price: 200, durationDays: 30, maxPhotos: 5 };

const FEATURES = [
  'Upload up to 5 images',
  'Featured placement',
  'Full contact & website',
  'Location targeting',
  '30-day listing duration',
  'Top of listings',
];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface)',
  border: '1.5px solid var(--border)', borderRadius: '10px',
  color: 'var(--text)', fontFamily: "'Sarabun', sans-serif",
  fontSize: '1rem', padding: '0.8rem 1rem',
  outline: 'none', transition: 'border-color 0.2s',
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = '#4DD9D9');
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = 'var(--border)');

export default function PremiumAdForm() {
  const [title,          setTitle]          = useState('');
  const [description,    setDescription]    = useState('');
  const [price,          setPrice]          = useState('');
  const [category,       setCategory]       = useState('');
  const [location,       setLocation]       = useState('');
  const [phone,          setPhone]          = useState('');
  const [website,        setWebsite]        = useState('');
  const [images,         setImages]         = useState<File[]>([]);
  const [showPayment,    setShowPayment]    = useState(false);
  const [isSubmittingAd, setIsSubmittingAd] = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [success,        setSuccess]        = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    setImages(prev => [...prev, ...incoming].slice(0, PKG.maxPhotos));
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim() || !category || !location) {
      setError('Please fill in all required fields.');
      return;
    }
    setShowPayment(true);
  };

  const submitAd = async (chargeId: string) => {
    setIsSubmittingAd(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }

      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await Promise.all(
          images.map(async img => {
            const fd = new FormData();
            fd.append('image', img);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || 'Image upload failed');
            return json.url as string;
          })
        );
      }

      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, price, category, location, phone, website, imageUrls, packageType: 'premium', chargeId }),
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
      {showPayment && (
        <PaymentModal
          amount={PKG.price}
          packageLabel="Premium"
          isSubmittingAd={isSubmittingAd}
          onSuccess={submitAd}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {success && <PublishToast onClose={() => router.push('/')} />}
      <ProtectedRoute>
        <div style={{ background: 'var(--deep-navy)', minHeight: '100vh', padding: '2.5rem 1.25rem 5rem' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
              <div>
                <p style={{ fontFamily: "'Kanit',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#4DD9D9', marginBottom: '0.6rem' }}>Premium Plan</p>
                <h1 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.2rem)', color: 'var(--text)', lineHeight: 1.15, marginBottom: '0.4rem' }}>Post a Premium Ad</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>Featured listing with images, full contact info and maximum visibility.</p>
              </div>
              <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: "'Kanit',sans-serif", fontWeight: 600, fontSize: '0.85rem', padding: '0.6rem 1.3rem', borderRadius: '50px', textDecoration: 'none', transition: 'border-color 0.2s,color 0.2s', whiteSpace: 'nowrap', marginTop: '0.25rem' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#4DD9D9'; e.currentTarget.style.color = '#4DD9D9'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>← Back</Link>
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

            {/* Package summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { icon: '฿', label: 'Price', value: `${PKG.price} Baht` },
                { icon: '📅', label: 'Duration', value: `${PKG.durationDays} days` },
                { icon: '🖼️', label: 'Photos', value: `Up to ${PKG.maxPhotos}` },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--card-bg)', border: '1px solid rgba(77,217,217,0.2)', borderRadius: '12px', padding: '0.9rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{item.icon}</p>
                  <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#4DD9D9' }}>{item.value}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* Features strip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
              {FEATURES.map(f => (
                <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0,107,107,0.15)', border: '1px solid rgba(77,217,217,0.2)', borderRadius: '50px', padding: '0.3rem 0.85rem', fontSize: '0.78rem', color: '#4DD9D9', fontFamily: "'Kanit',sans-serif", fontWeight: 600 }}>
                  ✓ {f}
                </span>
              ))}
            </div>

            {/* Card */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✓</p>
                  <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#4DD9D9', marginBottom: '0.4rem' }}>Premium Ad Posted!</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your featured listing is now live. Redirecting…</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {error && <ErrBox>{error}</ErrBox>}

                  <SectionLabel>Ad Details</SectionLabel>

                  <Field label="Ad Title *" htmlFor="p-title">
                    <input id="p-title" type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter your ad title" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </Field>

                  <Field label="Description *" htmlFor="p-desc">
                    <textarea id="p-desc" required rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product or service in detail" style={{ ...inputStyle, resize: 'vertical' }} onFocus={onFocus as never} onBlur={onBlur as never} />
                  </Field>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Price (Optional)" htmlFor="p-price">
                      <input id="p-price" type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. ฿1,500/day" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Category *" htmlFor="p-cat">
                      <select id="p-cat" required value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border)' }} />

                  <SectionLabel>Location &amp; Contact</SectionLabel>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Location (Province) *" htmlFor="p-loc">
                      <select id="p-loc" required value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">Select province</option>
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Phone (Optional)" htmlFor="p-phone">
                      <input id="p-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+66 000 000 000" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                  </div>

                  <Field label="Website (Optional)" htmlFor="p-web">
                    <input id="p-web" type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yoursite.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </Field>

                  <div style={{ height: '1px', background: 'var(--border)' }} />

                  <SectionLabel>Images ({images.length} / {PKG.maxPhotos})</SectionLabel>

                  {images.length < PKG.maxPhotos && (
                    <>
                      <label htmlFor="p-imgs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', border: '1.5px dashed var(--border)', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', transition: 'border-color 0.2s,color 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#4DD9D9'; e.currentTarget.style.color = '#4DD9D9'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                        + Upload Images
                      </label>
                      <input id="p-imgs" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </>
                  )}

                  {images.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {images.map((img, i) => (
                        <div key={img.name + i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.6rem 1rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📎 {img.name}</span>
                          <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#f47a8a', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginLeft: '1rem', flexShrink: 0 }}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button type="submit" className="thai-btn" style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '10px', marginTop: '0.25rem', background: 'linear-gradient(135deg,#4DD9D9,var(--thai-teal))', boxShadow: '0 4px 20px rgba(0,107,107,0.35)' }}>
                    Pay &amp; Post Premium Ad — ฿{PKG.price}
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "'Kanit',sans-serif", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
      {children}
    </p>
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

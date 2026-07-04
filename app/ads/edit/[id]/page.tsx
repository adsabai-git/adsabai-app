'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';
import { getPackage } from '../../../../lib/ad-packages';

interface Ad {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string | null;
  price: string | null;
  packageType: string;
  phone: string | null;
  website: string | null;
  imageUrls: string[];
  user: { id: number; name: string; email: string };
}

const categories = [
  { value: 'Car Rental',     label: '🚗 Car Rental' },
  { value: 'Tour Planning',  label: '🗺️ Tour Planning' },
  { value: 'Accommodation',  label: '🏨 Accommodation' },
  { value: 'Massage & Spa',  label: '💆 Massage & Spa' },
  { value: 'Jobs',           label: '💼 Jobs' },
  { value: 'Personal Ads',   label: '💌 Personal Ads' },
  { value: 'Leisure',        label: '🌴 Leisure' },
  { value: 'Other Services', label: '⚡ Other Services' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  border: '1.5px solid var(--border)',
  borderRadius: '10px',
  color: 'var(--text)',
  fontFamily: "'Sarabun', sans-serif",
  fontSize: '0.93rem',
  padding: '0.72rem 1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = 'var(--gold)';
};
const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = 'var(--border)';
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: 'block',
      fontFamily: "'Kanit', sans-serif",
      fontWeight: 600, fontSize: '0.78rem',
      letterSpacing: '0.06em',
      color: 'var(--text)', marginBottom: '0.45rem',
    }}>
      {children}
    </label>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Kanit', sans-serif",
      fontSize: '0.68rem', fontWeight: 700,
      letterSpacing: '0.26em', textTransform: 'uppercase',
      color: 'var(--text-muted)', marginBottom: '1rem',
    }}>
      {children}
    </p>
  );
}

export default function EditAdPage() {
  const params  = useParams();
  const adId    = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';
  const router  = useRouter();
  const { user } = useAuth();

  const [title,          setTitle]          = useState('');
  const [description,    setDescription]    = useState('');
  const [price,          setPrice]          = useState('');
  const [category,       setCategory]       = useState('');
  const [location,       setLocation]       = useState('');
  const [phone,          setPhone]          = useState('');
  const [website,        setWebsite]        = useState('');
  const [packageType,    setPackageType]    = useState('basic');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages,      setNewImages]      = useState<File[]>([]);
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [success,        setSuccess]        = useState(false);

  useEffect(() => {
    if (!user || !adId) return;

    const loadAd = async () => {
      try {
        const res = await fetch(`/api/ads/${adId}`);
        if (!res.ok) throw new Error('Failed to load ad details');

        const data: Ad = await res.json();
        if (data.user.id.toString() !== user.id.toString()) {
          setError('You are not allowed to edit this ad.');
          return;
        }

        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setLocation(data.location || '');
        setPrice(data.price || '');
        setPhone(data.phone || '');
        setWebsite(data.website || '');
        setPackageType(data.packageType);
        setExistingImages(data.imageUrls || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load ad information.');
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [adId, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const maxPhotos = getPackage(packageType).maxPhotos;
    const slots = Math.max(0, maxPhotos - existingImages.length - newImages.length);
    const files = Array.from(e.target.files).slice(0, slots);
    if (files.length) setNewImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }

      let uploadedUrls: string[] = [];
      if (newImages.length > 0) {
        uploadedUrls = await Promise.all(
          newImages.map(async (img) => {
            const fd = new FormData();
            fd.append('image', img);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const json = await res.json();
            if (!res.ok) {
              console.error('Upload API error:', json);
              throw new Error(json?.error || 'Image upload failed');
            }
            return json.url as string;
          })
        );
      }

      const res = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, description, category, location,
          price, packageType, phone, website,
          imageUrls: [...existingImages, ...uploadedUrls],
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d?.error || 'Failed to update ad');
      }

      setSuccess(true);
      setTimeout(() => router.push('/ads/manage'), 1800);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Unable to update ad.');
      setIsSubmitting(false);
    }
  };

  /* ── Shell ───────────────────────────────────────────────────── */
  const renderBody = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{
            width: '36px', height: '36px', margin: '0 auto',
            border: '3px solid var(--border)', borderTopColor: 'var(--gold)',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>Loading ad details…</p>
        </div>
      );
    }

    if (error && !isSubmitting) {
      return (
        <div style={{
          background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)',
          borderRadius: '12px', padding: '1.25rem 1.5rem',
          color: '#f47a8a', fontSize: '0.9rem',
        }}>
          ✕ {error}
        </div>
      );
    }

    if (success) {
      return (
        <div style={{
          background: 'rgba(46,204,138,0.08)', border: '1px solid rgba(46,204,138,0.3)',
          borderRadius: '12px', padding: '2rem',
          color: 'var(--accent-green)', textAlign: 'center', fontSize: '0.95rem',
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</p>
          <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}>
            Ad updated successfully!
          </p>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.85rem' }}>
            Redirecting to Manage Ads…
          </p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* ── Core details ── */}
        <section>
          <SectionHeading>Ad Details</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <FieldLabel htmlFor="ed-title">Ad Title *</FieldLabel>
              <input id="ed-title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle} onFocus={focusGold} onBlur={blurBorder}
                placeholder="Enter your ad title"
              />
            </div>

            <div>
              <FieldLabel htmlFor="ed-desc">Description *</FieldLabel>
              <textarea id="ed-desc" required rows={5} value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={focusGold as never} onBlur={blurBorder as never}
                placeholder="Describe your product or service"
              />
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* ── Category & Package ── */}
        <section>
          <SectionHeading>Category &amp; Package</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem' }}>
            <div>
              <FieldLabel htmlFor="ed-cat">Category *</FieldLabel>
              <select id="ed-cat" required value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle} onFocus={focusGold} onBlur={blurBorder}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="ed-pkg">Package Type</FieldLabel>
              <div id="ed-pkg" style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'default', userSelect: 'none' }}>
                <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, textTransform: 'capitalize' }}>{packageType}</span>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* ── Contact & Location ── */}
        <section>
          <SectionHeading>Location &amp; Contact</SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem' }}>
            <div>
              <FieldLabel htmlFor="ed-loc">Location</FieldLabel>
              <input id="ed-loc" type="text" value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle} onFocus={focusGold} onBlur={blurBorder}
                placeholder="City, Country"
              />
            </div>

            <div>
              <FieldLabel htmlFor="ed-price">Price</FieldLabel>
              <input id="ed-price" type="text" value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={inputStyle} onFocus={focusGold} onBlur={blurBorder}
                placeholder="e.g. ฿1,500/day or Free or Negotiable"
              />
            </div>

            <div>
              <FieldLabel htmlFor="ed-phone">Phone Number</FieldLabel>
              <input id="ed-phone" type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle} onFocus={focusGold} onBlur={blurBorder}
                placeholder="+66 000 000 000"
              />
            </div>

            <div>
              <FieldLabel htmlFor="ed-web">Website</FieldLabel>
              <input id="ed-web" type="url" value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={inputStyle} onFocus={focusGold} onBlur={blurBorder}
                placeholder="https://yoursite.com"
              />
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* ── Images ── */}
        <section>
          <SectionHeading>Images ({existingImages.length + newImages.length} / {getPackage(packageType).maxPhotos})</SectionHeading>

          {existingImages.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Current images — click Remove to delete</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.7rem' }}>
                {existingImages.map((url, i) => (
                  <div key={url + i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={url} alt={`Image ${i + 1}`} style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }} />
                    <button
                      type="button"
                      onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
                      style={{
                        position: 'absolute', top: '5px', right: '5px',
                        background: 'rgba(168,25,46,0.85)', border: 'none',
                        color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                        padding: '2px 7px', borderRadius: '6px', cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {existingImages.length + newImages.length < getPackage(packageType).maxPhotos && (
            <div>
              <label
                htmlFor="ed-imgs"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '0.8rem 1.2rem',
                  border: '1.5px dashed var(--border)', borderRadius: '10px',
                  color: 'var(--text-muted)', fontSize: '0.85rem',
                  cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                + Upload Images
              </label>
              <input id="ed-imgs" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>
          )}

          {newImages.length > 0 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {newImages.map((img, i) => (
                <div key={img.name + i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '0.6rem 1rem',
                }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    📎 {img.name}
                  </span>
                  <button type="button" onClick={() => setNewImages((prev) => prev.filter((_, idx) => idx !== i))}
                    style={{ background: 'none', border: 'none', color: '#f47a8a', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginLeft: '1rem', flexShrink: 0 }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Inline error (submit-time) ── */}
        {error && (
          <div style={{
            background: 'rgba(168,25,46,0.1)', border: '1px solid rgba(168,25,46,0.35)',
            borderRadius: '10px', padding: '0.9rem 1rem',
            color: '#f47a8a', fontSize: '0.875rem',
          }}>
            ✕ {error}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="thai-btn"
            style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', borderRadius: '10px', opacity: isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/ads/manage')}
            style={{
              padding: '0.75rem 2rem', fontSize: '0.9rem',
              fontFamily: "'Kanit', sans-serif", fontWeight: 600,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-muted)',
              cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            Cancel
          </button>
        </div>

      </form>
    );
  };

  return (
    <ProtectedRoute>
      <div style={{ background: 'var(--deep-navy)', minHeight: '100vh', padding: '2.5rem 1.25rem 5rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>

          {/* ── Page Header ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem',
            marginBottom: '0.5rem',
          }}>
            <div>
              <p style={{
                fontFamily: "'Kanit', sans-serif",
                fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '0.6rem',
              }}>
                Edit Ad
              </p>
              <h1 style={{
                fontFamily: "'Kanit', sans-serif", fontWeight: 800,
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                color: 'var(--text)', lineHeight: 1.15, marginBottom: '0.5rem',
              }}>
                Update Your Listing
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Modify any field below, changes are saved instantly when you submit.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/ads/manage')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--text)', fontFamily: "'Kanit', sans-serif",
                fontWeight: 600, fontSize: '0.85rem',
                padding: '0.6rem 1.3rem', borderRadius: '50px',
                cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
                whiteSpace: 'nowrap', marginTop: '0.25rem',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
            >
              ← Manage Ads
            </button>
          </div>

          {/* ── Divider ── */}
          <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

          {/* ── Card ── */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2.25rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            {renderBody()}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}

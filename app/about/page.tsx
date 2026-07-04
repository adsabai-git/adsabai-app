export const metadata = {
  title: 'About Us – AdSabai',
  description: 'Learn about AdSabai, Thailand\'s premier classified ads platform for tourism and local services.',
};

export default function AboutPage() {
  const stats = [
    { value: '48', label: 'Provinces Covered' },
    { value: '7',  label: 'Categories' },
  ];

  const values = [
    { emoji: '🤝', title: 'Trust',        desc: 'Every ad is reviewed to keep the platform safe and reliable for both buyers and sellers.' },
    { emoji: '🌏', title: 'Local First',  desc: 'We focus on real Thai businesses and individuals, not faceless corporations.' },
    { emoji: '⚡', title: 'Simplicity',   desc: 'Post an ad in minutes. No complicated forms, no technical know-how needed.' },
    { emoji: '💰', title: 'Affordable',   desc: 'Fair pricing designed for small businesses, freelancers, and everyday people.' },
    { emoji: '🔒', title: 'Privacy',      desc: 'Your personal data is never sold. We collect only what we need.' },
    { emoji: '📱', title: 'Mobile Ready', desc: 'AdSabai works beautifully on every screen, from desktop to the smallest phone.' },
  ];

  return (
    <div style={{
      background: 'var(--deep-navy)',
      minHeight: '100vh',
      color: 'var(--text)',
      fontFamily: "'Sarabun', sans-serif",
      paddingBottom: '4rem',
    }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--deep-navy) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 1.5rem 3rem',
        textAlign: 'center',
      }}>
        <img src="/AdSabai_Logo_Vector.svg" alt="AdSabai" height="36" style={{ display: 'block', margin: '0 auto 0.5rem' }} />
        <h1 style={{
          fontFamily: "'Kanit', sans-serif", fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem',
        }}>
          About <span style={{ color: 'var(--gold)' }}>Us</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '560px',
          margin: '0 auto', lineHeight: 1.7,
        }}>
          AdSabai is Thailand's home for local classified ads, connecting people across every province with the services, jobs, and opportunities they need.
        </p>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.25rem 0' }}>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginBottom: '3rem',
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.5rem', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'Kanit', sans-serif", fontWeight: 800,
                fontSize: '2rem', color: 'var(--gold)', marginBottom: '0.25rem',
              }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderLeft: '4px solid var(--gold)', borderRadius: '14px',
          padding: '2rem 2.25rem', marginBottom: '2rem',
        }}>
          <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--gold)' }}>
            Our Story
          </h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '1rem' }}>
            AdSabai was founded with a simple idea: every Thai business, no matter how small, deserves an easy and affordable way to reach customers online. We saw that small guesthouses, massage therapists, tour guides, and local employers were being left behind by expensive advertising platforms built for big corporations.
          </p>
          <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '1rem' }}>
            So we built AdSabai, a platform designed specifically for Thailand's tourism and service economy. Whether you run a motorbike rental shop in Phuket, offer Muay Thai classes in Chiang Mai, or are looking for your next job in Bangkok, AdSabai gives you a place to be found.
          </p>
          <p style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
            <em>"Sabai"</em> (สบาย) means comfortable, easy, relaxed, and that's exactly how posting and browsing ads should feel. We keep things simple so you can focus on what matters: your business.
          </p>
        </div>

        {/* Mission */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderLeft: '4px solid var(--accent-green)', borderRadius: '14px',
          padding: '2rem 2.25rem', marginBottom: '2rem',
        }}>
          <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--accent-green)' }}>
            Our Mission
          </h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
            To create the most trusted and accessible classified ads platform in Thailand, empowering local businesses and individuals to connect, grow, and thrive without barriers.
          </p>
        </div>

        {/* Values */}
        <h2 style={{
          fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '1.4rem',
          marginBottom: '1.25rem', marginTop: '2.5rem',
        }}>
          What We Stand For
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem', marginBottom: '3rem',
        }}>
          {values.map(v => (
            <div key={v.title} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.25rem 1.5rem',
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{v.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, marginBottom: '0.3rem' }}>{v.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/assets/thailand-ads-platform.html" style={{
            color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none',
          }}>
            ← Back to Home
          </a>
        </div>

      </div>
    </div>
  );
}

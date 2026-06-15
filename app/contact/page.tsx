export const metadata = {
  title: 'Contact Us – AdSabai',
  description: 'Get in touch with the AdSabai team.',
};

export default function ContactPage() {
  const infoCards = [
    { emoji: '✉️', label: 'Email',    value: 'hello@adsabai.com', href: 'mailto:hello@adsabai.com' },
    { emoji: '💬', label: 'Line',     value: '@adsabai',          href: 'https://line.me/ti/p/@adsabai' },
    { emoji: '📍', label: 'Location', value: 'Bangkok, Thailand', href: null },
  ];

  return (
    <div style={{
      background: 'var(--deep-navy)', minHeight: '100vh',
      color: 'var(--text)', fontFamily: "'Sarabun', sans-serif", paddingBottom: '4rem',
    }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--deep-navy) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 1.5rem 3rem', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Kanit', sans-serif", fontWeight: 800, fontSize: '1.5rem',
          background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem',
        }}>
          Ad<span style={{ color: 'var(--thai-red)', WebkitTextFillColor: 'var(--thai-red)' }}>Sabai</span>
        </div>
        <h1 style={{
          fontFamily: "'Kanit', sans-serif", fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.75rem',
        }}>
          Contact <span style={{ color: 'var(--gold)' }}>Us</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          Have a question, feedback, or partnership inquiry? We'd love to hear from you.
        </p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem 1.25rem 0' }}>

        {/* Info cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem', marginBottom: '2.5rem',
        }}>
          {infoCards.map(c => (
            <div key={c.label} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.4rem 1.5rem',
              display: 'flex', gap: '1rem', alignItems: 'center',
            }}>
              <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{c.emoji}</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Kanit', sans-serif", fontWeight: 600, marginBottom: '0.25rem' }}>
                  {c.label}
                </div>
                {c.href ? (
                  <a href={c.href} style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                    {c.value}
                  </a>
                ) : (
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '2rem 2.25rem', textAlign: 'center',
          color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🇹🇭</div>
          <p>
            Our team is based in Bangkok, Thailand. We aim to respond to all inquiries within <strong style={{ color: 'var(--text)' }}>1–2 business days</strong>.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            For the fastest response, reach us via <a href="mailto:hello@adsabai.com" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>hello@adsabai.com</a> or Line <strong style={{ color: 'var(--text)' }}>@adsabai</strong>.
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/assets/thailand-ads-platform.html" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none' }}>
            ← Back to Home
          </a>
        </div>

      </div>
    </div>
  );
}

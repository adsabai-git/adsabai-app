export const metadata = {
  title: 'Privacy Policy – AdSabai',
  description: 'How AdSabai collects, uses, and protects your personal data.',
};

export default function PrivacyPolicy() {
  return (
    <div style={{
      background: 'var(--deep-navy)',
      minHeight: '100vh',
      padding: '80px 1.25rem 3rem',
      color: 'var(--text)',
      fontFamily: "'Sarabun', sans-serif",
    }}>
      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 3.5rem)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>

        {/* Brand */}
        <div style={{ marginBottom: '0.4rem' }}>
          <span style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 800,
            fontSize: '1.4rem',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Ad<span style={{ color: 'var(--thai-red)', WebkitTextFillColor: 'var(--thai-red)' }}>Sabai</span>
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Easy Ads. Real Results.
        </div>

        <h1 style={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          color: 'var(--text)',
          marginBottom: '0.35rem',
        }}>
          Privacy Policy
        </h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Last updated: June 2026
        </div>

        <p style={pStyle}>
          AdSabai ("we", "our", or "us") operates an online classified advertising platform accessible via our website and mobile application. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our services.
        </p>
        <p style={pStyle}>
          By using AdSabai, you agree to the collection and use of information in accordance with this policy.
        </p>

        <Section title="1. Information We Collect">
          <p style={pStyle}>We collect the following types of information when you register or use AdSabai:</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Account information:</strong> Full name, email address, phone number, and password</li>
            <li style={liStyle}><strong>Profile information:</strong> Business name, contact details, and profile photo (optional)</li>
            <li style={liStyle}><strong>Ad listing content:</strong> Text, images, categories, and pricing you submit for your listings</li>
            <li style={liStyle}><strong>Payment information:</strong> Billing details processed securely through our payment provider (Omise/OPN Payments). We do not store your card details directly.</li>
            <li style={liStyle}><strong>Usage data:</strong> Pages visited, time spent, clicks, and interactions with the platform</li>
            <li style={liStyle}><strong>Device and technical data:</strong> IP address, browser type, operating system, and device identifiers</li>
            <li style={liStyle}><strong>Communications:</strong> Messages you send to our support team</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p style={pStyle}>We use your personal information to:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Create and manage your AdSabai account</li>
            <li style={liStyle}>Publish and display your ad listings on the platform</li>
            <li style={liStyle}>Process payments for paid listing services</li>
            <li style={liStyle}>Send transactional emails (account confirmation, payment receipts, listing notifications)</li>
            <li style={liStyle}>Respond to your support enquiries</li>
            <li style={liStyle}>Improve our platform features and user experience</li>
            <li style={liStyle}>Detect and prevent fraudulent or prohibited activity</li>
            <li style={liStyle}>Comply with applicable laws and regulations in Thailand</li>
          </ul>
        </Section>

        <Section title="3. Sharing of Your Information">
          <p style={pStyle}>We do not sell or rent your personal data to third parties. We may share your information with:</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Payment processors:</strong> Omise (OPN Payments Co., Ltd.) for secure payment processing</li>
            <li style={liStyle}><strong>Cloud and hosting providers:</strong> For platform infrastructure and data storage</li>
            <li style={liStyle}><strong>Analytics services:</strong> Aggregated, anonymised usage data for platform improvement</li>
            <li style={liStyle}><strong>Law enforcement or regulators:</strong> Where required by Thai law or court order</li>
          </ul>
          <p style={pStyle}>All third-party service providers are required to handle your data securely and only for the purposes we specify.</p>
        </Section>

        <Section title="4. Cookies and Tracking">
          <p style={pStyle}>AdSabai uses cookies and similar tracking technologies to enhance your browsing experience, maintain your session, and analyse platform performance. You may disable cookies in your browser settings, though some features of the platform may not function correctly as a result.</p>
        </Section>

        <Section title="5. Data Retention">
          <p style={pStyle}>We retain your personal data for as long as your account is active or as needed to provide our services. If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law (e.g. financial transaction records).</p>
        </Section>

        <Section title="6. Data Security">
          <p style={pStyle}>We implement industry-standard security measures including SSL/TLS encryption, secure servers, and access controls to protect your personal information. Payment data is handled exclusively through PCI DSS-certified payment processors. While we take all reasonable steps to protect your data, no method of transmission over the internet is 100% secure.</p>
        </Section>

        <Section title="7. Your Rights">
          <p style={pStyle}>Under applicable Thai data protection law (PDPA), you have the right to:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Access and receive a copy of your personal data</li>
            <li style={liStyle}>Request correction of inaccurate data</li>
            <li style={liStyle}>Request deletion of your personal data</li>
            <li style={liStyle}>Object to or restrict the processing of your data</li>
            <li style={liStyle}>Withdraw consent at any time (where processing is based on consent)</li>
          </ul>
          <p style={pStyle}>To exercise any of these rights, please contact us at the details below.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p style={pStyle}>AdSabai is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p style={pStyle}>We may update this Privacy Policy from time to time. We will notify registered users of significant changes by email or via a notice on our platform. Continued use of AdSabai after changes take effect constitutes acceptance of the updated policy.</p>
        </Section>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />

        {/* Contact box */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.5rem 1.75rem',
        }}>
          <div style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            color: 'var(--gold)',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            letterSpacing: '0.04em',
          }}>
            CONTACT US
          </div>
          <p style={{ ...pStyle, marginBottom: '0.35rem' }}>
            If you have any questions about this Privacy Policy or how we handle your personal data, please contact us:
          </p>
          <p style={{ ...pStyle, marginBottom: 0, lineHeight: 2 }}>
            <strong>AdSabai</strong><br />
            Email: privacy@adsabai.com<br />
            Website: www.adsabai.com<br />
            Thailand
          </p>
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{
        fontFamily: "'Kanit', sans-serif",
        fontWeight: 700,
        fontSize: '1rem',
        color: 'var(--text)',
        paddingLeft: '0.85rem',
        borderLeft: '4px solid var(--gold)',
        marginBottom: '0.75rem',
        lineHeight: 1.4,
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

const pStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
  lineHeight: 1.8,
  marginBottom: '0.75rem',
};

const ulStyle: React.CSSProperties = {
  marginLeft: '1.25rem',
  marginBottom: '0.75rem',
};

const liStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
  lineHeight: 1.8,
  marginBottom: '0.3rem',
};

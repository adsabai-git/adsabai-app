export const metadata = {
  title: 'Business Policy – AdSabai',
  description: 'AdSabai platform usage rules, pricing, refund policy, and prohibited content guidelines.',
};

export default function BusinessPolicy() {
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
          Business Policy
        </h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Last updated: June 2026
        </div>

        <p style={pStyle}>
          This Business Policy governs the use of the AdSabai platform by all users: individual sellers, small businesses, and large enterprises. By registering and using AdSabai, you agree to comply with this policy in full.
        </p>

        <Section title="1. About AdSabai">
          <p style={pStyle}>
            AdSabai is an online classified advertising platform that allows users to post, browse, and respond to ads across a wide range of categories including goods, services, real estate, vehicles, jobs, and more. AdSabai is operated by an individual merchant based in Thailand.
          </p>
        </Section>

        <Section title="2. Services Offered">
          <p style={pStyle}>AdSabai offers the following services to registered users:</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Basic ad listings:</strong> Quick text listing with one photo, active for 14 days (฿79)</li>
            <li style={liStyle}><strong>Standard ad listings:</strong> Enhanced listing with up to 3 photos, active for 21 days (฿149)</li>
            <li style={liStyle}><strong>Premium ad listings:</strong> Featured placement with up to 5 photos and full contact info, active for 30 days (฿200)</li>
          </ul>
          <p style={pStyle}>All paid services are processed securely through <strong>Omise (OPN Payments)</strong>, a licensed payment gateway in Thailand.</p>
        </Section>

        <Section title="3. Pricing">
          <p style={pStyle}>Current pricing for AdSabai paid services:</p>

          {/* Price table */}
          <div style={{ overflowX: 'auto', margin: '0.75rem 0 1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  {['Package', 'Price (THB)', 'Duration', 'Photos'].map(h => (
                    <th key={h} style={{ background: 'var(--gold)', color: '#0f1623', padding: '0.65rem 1rem', textAlign: 'left', fontFamily: "'Kanit', sans-serif", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Basic',    '฿79',  '14 days', '1 photo'],
                  ['Standard', '฿149', '21 days', 'Up to 3 photos'],
                  ['Premium',  '฿200', '30 days', 'Up to 5 photos'],
                ].map(([pkg, price, dur, photos], i) => (
                  <tr key={pkg} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'transparent' }}>
                    <td style={tdStyle}>{pkg}</td>
                    <td style={{ ...tdStyle, color: 'var(--gold)', fontWeight: 700 }}>{price}</td>
                    <td style={tdStyle}>{dur}</td>
                    <td style={tdStyle}>{photos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={pStyle}>All prices are inclusive of applicable VAT. Prices are subject to change with prior notice to registered users.</p>
        </Section>

        <Section title="4. Payment Methods">
          <p style={pStyle}>AdSabai accepts the following payment methods via Omise:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Credit and debit cards (Visa, Mastercard)</li>
            <li style={liStyle}>PromptPay (QR code)</li>
            <li style={liStyle}>Thai internet banking</li>
            <li style={liStyle}>TrueMoney Wallet</li>
          </ul>
          <div style={infoBox}>
            <p style={{ ...pStyle, marginBottom: 0, color: 'var(--text)' }}>
              💳 Payments are processed securely by <strong>Omise (OPN Payments Co., Ltd.)</strong>, a PCI DSS-certified payment gateway. AdSabai does not store any card or payment credentials on our servers.
            </p>
          </div>
        </Section>

        <Section title="5. Refund & Cancellation Policy">
          <p style={pStyle}>Please read our refund policy carefully before purchasing any paid service on AdSabai:</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Paid listing fees are non-refundable</strong> once the listing has been published and made live on the platform</li>
            <li style={liStyle}>If a listing is rejected by AdSabai due to a policy violation, no refund will be issued. The user is responsible for ensuring their content complies with our Prohibited Content policy (Section 7) before submitting</li>
            <li style={liStyle}>If a technical error on AdSabai's side prevents a paid listing from being published, a full refund or listing credit will be issued within <strong>7 business days</strong></li>
            <li style={liStyle}>Refund requests must be submitted to <strong>support@adsabai.com</strong> within <strong>48 hours</strong> of payment, with your order reference number</li>
            <li style={liStyle}>Approved refunds will be returned to the original payment method within <strong>7–14 business days</strong> depending on your bank or card issuer</li>
          </ul>
          <div style={warnBox}>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              ⚠️ To request a refund, email <strong>support@adsabai.com</strong> with your full name, registered email address, order reference number, and reason for the request within 48 hours of payment.
            </p>
          </div>
        </Section>

        <Section title="6. User Responsibilities">
          <p style={pStyle}>All users of AdSabai agree to:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Provide accurate, truthful, and up-to-date information in their listings</li>
            <li style={liStyle}>Not post duplicate, misleading, or spam listings</li>
            <li style={liStyle}>Not use the platform to conduct fraudulent transactions</li>
            <li style={liStyle}>Respond to enquiries about their listings in good faith</li>
            <li style={liStyle}>Comply with all applicable Thai laws and regulations related to the goods or services advertised</li>
            <li style={liStyle}>Not share account credentials with third parties</li>
          </ul>
        </Section>

        <Section title="7. Prohibited Content">
          <p style={pStyle}>The following content is strictly prohibited on AdSabai and will result in immediate listing removal and possible account suspension:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Illegal goods or services under Thai law</li>
            <li style={liStyle}>Counterfeit, pirated, or replica products</li>
            <li style={liStyle}>Weapons, explosives, or controlled substances</li>
            <li style={liStyle}>Adult or sexually explicit content</li>
            <li style={liStyle}>Content that promotes discrimination, hate speech, or violence</li>
            <li style={liStyle}>Financial scams, pyramid schemes, or get-rich-quick schemes</li>
            <li style={liStyle}>Listings that infringe on third-party intellectual property rights</li>
            <li style={liStyle}>Personal data of third parties posted without consent</li>
          </ul>
        </Section>

        <Section title="8. Account Suspension & Termination">
          <p style={pStyle}>AdSabai reserves the right to suspend or permanently terminate any account that:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Violates this Business Policy or our Terms of Service</li>
            <li style={liStyle}>Posts prohibited content</li>
            <li style={liStyle}>Engages in fraudulent payment activity</li>
            <li style={liStyle}>Receives multiple verified complaints from other users</li>
          </ul>
          <p style={pStyle}>Suspended users will be notified by email. Appeals may be submitted to support@adsabai.com within 14 days of suspension.</p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p style={pStyle}>AdSabai is a platform connecting buyers and sellers. We do not verify the accuracy of all listings, and we are not a party to any transaction between users. AdSabai is not liable for any loss, damage, or dispute arising from transactions conducted between users on the platform. Users transact at their own risk.</p>
        </Section>

        <Section title="10. Governing Law">
          <p style={pStyle}>This Business Policy is governed by the laws of the Kingdom of Thailand. Any disputes arising from the use of AdSabai shall be subject to the jurisdiction of the Thai courts.</p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p style={pStyle}>AdSabai reserves the right to update this Business Policy at any time. Users will be notified of material changes via email or a prominent notice on the platform. Continued use of AdSabai after changes are posted constitutes acceptance of the revised policy.</p>
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
            For any questions regarding this Business Policy, payments, or refunds:
          </p>
          <p style={{ ...pStyle, marginBottom: 0, lineHeight: 2 }}>
            <strong>AdSabai</strong><br />
            Email: support@adsabai.com<br />
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

const tdStyle: React.CSSProperties = {
  padding: '0.6rem 1rem',
  color: 'var(--text-muted)',
  fontSize: '0.875rem',
  borderBottom: '1px solid var(--border)',
};

const infoBox: React.CSSProperties = {
  background: 'rgba(201,168,76,0.07)',
  border: '1px solid rgba(201,168,76,0.25)',
  borderRadius: '10px',
  padding: '1rem 1.25rem',
  margin: '0.75rem 0',
};

const warnBox: React.CSSProperties = {
  background: 'rgba(255,160,60,0.07)',
  border: '1px solid rgba(255,160,60,0.25)',
  borderRadius: '10px',
  padding: '1rem 1.25rem',
  margin: '0.75rem 0',
};

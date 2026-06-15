export const metadata = {
  title: 'Terms of Service – AdSabai',
  description: 'AdSabai Terms of Service — rules, responsibilities, payments, and legal terms for using the platform.',
};

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Last updated: June 2026 &nbsp;·&nbsp; Effective date: June 2026
        </div>

        {/* Intro notice */}
        <div style={infoBox}>
          <p style={{ ...pStyle, marginBottom: 0, color: 'var(--text)' }}>
            📋 Please read these Terms of Service carefully before using AdSabai. By accessing or using our platform, you confirm that you have read, understood, and agree to be bound by these terms. If you do not agree, please do not use AdSabai.
          </p>
        </div>

        {/* Table of Contents */}
        <style>{`.toc-link:hover { text-decoration: underline; }`}</style>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          margin: '1.75rem 0',
        }}>
          <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
            Table of Contents
          </p>
          <ol style={{ marginLeft: '1.25rem', columnCount: 2, columnGap: '2rem' }}>
            {[
              'About AdSabai',
              'Eligibility & Account Registration',
              'User Accounts & Security',
              'Listing Rules & Content Standards',
              'Prohibited Content & Activities',
              'Payments & Fees',
              'Refunds & Cancellations',
              'Intellectual Property',
              'User-Generated Content',
              'Privacy & Data Protection',
              'Disclaimer of Warranties',
              'Limitation of Liability',
              'Indemnification',
              'Termination & Suspension',
              'Dispute Resolution',
              'Governing Law',
              'Changes to These Terms',
              'Contact Us',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '0.35rem', lineHeight: 1.5 }}>
                <a href={`#s${i + 1}`} className="toc-link" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                  {item}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <Section id="s1" title="1. About AdSabai">
          <p style={pStyle}>AdSabai ("we", "us", "our", or "the Platform") is an online classified advertising platform that connects individuals and businesses to post, browse, and respond to advertisements across a variety of categories including goods, services, real estate, vehicles, jobs, and more.</p>
          <p style={pStyle}>AdSabai is operated by an individual merchant based in Thailand. The platform is accessible via our website at <strong>www.adsabai.com</strong> and any associated mobile applications.</p>
          <p style={pStyle}>AdSabai acts solely as an intermediary platform. We do not participate in, facilitate, or guarantee any transaction between buyers and sellers on the platform.</p>
        </Section>

        <Section id="s2" title="2. Eligibility & Account Registration">
          <p style={pStyle}>By registering on AdSabai, you confirm that:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>You are at least <strong>18 years of age</strong></li>
            <li style={liStyle}>You have the legal capacity to enter into a binding agreement</li>
            <li style={liStyle}>You are not prohibited from using online classified services under the laws of Thailand or your country of residence</li>
            <li style={liStyle}>All information you provide during registration is accurate, truthful, and up to date</li>
          </ul>
          <p style={pStyle}>AdSabai reserves the right to refuse registration or suspend accounts at its discretion, including where false or misleading registration information is provided.</p>
        </Section>

        <Section id="s3" title="3. User Accounts & Security">
          <p style={pStyle}>You are responsible for maintaining the confidentiality of your account login credentials. You agree to:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Not share your username or password with any third party</li>
            <li style={liStyle}>Notify AdSabai immediately at <strong>support@adsabai.com</strong> if you suspect unauthorised access to your account</li>
            <li style={liStyle}>Accept full responsibility for all activities that occur under your account</li>
          </ul>
          <p style={pStyle}>AdSabai will not be liable for any loss or damage arising from your failure to maintain account security.</p>
          <p style={pStyle}>You may only maintain one active account per person or business entity. Multiple accounts used to circumvent suspensions or restrictions are prohibited.</p>
        </Section>

        <Section id="s4" title="4. Listing Rules & Content Standards">
          <p style={pStyle}>When posting an ad listing on AdSabai, you agree to the following rules:</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Accuracy:</strong> All listing content must be truthful, accurate, and not misleading. Prices, descriptions, and images must genuinely represent the item or service being offered.</li>
            <li style={liStyle}><strong>No duplicates:</strong> You may not post duplicate listings for the same item or service. Duplicate listings will be removed without notice.</li>
            <li style={liStyle}><strong>One listing per item:</strong> Each unique item or service offering should have only one active listing at a time.</li>
            <li style={liStyle}><strong>Language:</strong> Listings may be posted in Thai or English. AdSabai is a bilingual platform.</li>
            <li style={liStyle}><strong>Images:</strong> All images uploaded must be original, relevant to the listing, and free of watermarks from competing platforms.</li>
            <li style={liStyle}><strong>Contact information:</strong> You may include your phone number, email address, or LINE ID in your listing. You are responsible for the accuracy and safety of any contact details you share publicly.</li>
            <li style={liStyle}><strong>Availability:</strong> You are responsible for removing or marking as sold any listing that is no longer available.</li>
          </ul>
          <p style={pStyle}>AdSabai reserves the right to edit, hide, or remove any listing that does not comply with these standards, without prior notice or refund.</p>
        </Section>

        <Section id="s5" title="5. Prohibited Content & Activities">
          <p style={pStyle}><strong>Prohibited items and services:</strong></p>
          <ul style={ulStyle}>
            <li style={liStyle}>Illegal goods or services under Thai law or applicable international law</li>
            <li style={liStyle}>Counterfeit, pirated, replica, or stolen goods</li>
            <li style={liStyle}>Weapons, firearms, explosives, or ammunition</li>
            <li style={liStyle}>Controlled substances, narcotics, or prescription drugs without authorisation</li>
            <li style={liStyle}>Protected wildlife, endangered species, or animal products prohibited by CITES</li>
            <li style={liStyle}>Adult, sexually explicit, or pornographic content</li>
            <li style={liStyle}>Human trafficking or any form of exploitation</li>
            <li style={liStyle}>Financial services, investment schemes, pyramid schemes, or get-rich-quick offers</li>
            <li style={liStyle}>Gambling services or lottery tickets</li>
          </ul>
          <p style={pStyle}><strong>Prohibited activities:</strong></p>
          <ul style={ulStyle}>
            <li style={liStyle}>Posting false, deceptive, or fraudulent listings</li>
            <li style={liStyle}>Harassing, threatening, or abusing other users via the platform</li>
            <li style={liStyle}>Scraping, crawling, or data-mining AdSabai's content without written permission</li>
            <li style={liStyle}>Using automated bots or scripts to post listings or interact with users</li>
            <li style={liStyle}>Attempting to circumvent AdSabai's security measures or access systems without authorisation</li>
            <li style={liStyle}>Collecting or harvesting personal data of other users</li>
            <li style={liStyle}>Posting content that infringes on any third party's intellectual property rights</li>
            <li style={liStyle}>Impersonating any person, business, or government entity</li>
          </ul>
          <div style={warnBox}>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              ⚠️ Violations of this section may result in immediate account suspension, permanent ban, removal of all listings, and where applicable, referral to Thai law enforcement authorities.
            </p>
          </div>
        </Section>

        <Section id="s6" title="6. Payments & Fees">
          <p style={pStyle}>All paid services are clearly labelled on the platform and must be purchased before being activated. All payments are processed securely through <strong>Omise (OPN Payments Co., Ltd.)</strong>, a licensed and PCI DSS-certified payment gateway operating in Thailand. AdSabai does not store your card details or payment credentials.</p>
          <p style={pStyle}>By purchasing a paid service, you agree that:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>You authorise AdSabai to charge your selected payment method for the amount displayed at the time of purchase</li>
            <li style={liStyle}>All prices are displayed in Thai Baht (฿) and are inclusive of applicable VAT</li>
            <li style={liStyle}>Charges will appear on your bank or card statement under the name associated with our payment processor</li>
          </ul>
          <p style={pStyle}>AdSabai reserves the right to change its pricing at any time. Existing paid listings will not be affected mid-term by price changes.</p>
        </Section>

        <Section id="s7" title="7. Refunds & Cancellations">
          <p style={pStyle}>AdSabai operates the following refund policy for paid services:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Paid listing fees are <strong>non-refundable</strong> once the listing has been published and made live on the platform</li>
            <li style={liStyle}>If a listing is rejected due to a policy violation, no refund will be issued</li>
            <li style={liStyle}>If a technical error on AdSabai's part prevents a paid listing from being published, a full refund or listing credit will be processed within <strong>7 business days</strong></li>
            <li style={liStyle}>Refund requests must be submitted to <strong>support@adsabai.com</strong> within <strong>48 hours</strong> of payment, including your full name, registered email, order reference number, and reason for the request</li>
            <li style={liStyle}>Approved refunds will be returned to the original payment method within <strong>7–14 business days</strong>, subject to your bank or card issuer's processing times</li>
          </ul>
          <div style={infoBox}>
            <p style={{ ...pStyle, marginBottom: 0, color: 'var(--text)' }}>
              ℹ️ To request a refund, email <strong>support@adsabai.com</strong> with your order reference number within 48 hours of payment.
            </p>
          </div>
        </Section>

        <Section id="s8" title="8. Intellectual Property">
          <p style={pStyle}>All content on the AdSabai platform that is not user-generated — including but not limited to the AdSabai name, logo, design, software, code, graphics, and text — is the exclusive intellectual property of AdSabai and is protected under applicable Thai and international intellectual property laws.</p>
          <p style={pStyle}>You may not:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Copy, reproduce, distribute, or create derivative works of AdSabai's proprietary content without prior written consent</li>
            <li style={liStyle}>Use the AdSabai name, logo, or branding in any way that implies endorsement or affiliation without written permission</li>
            <li style={liStyle}>Reverse-engineer, decompile, or disassemble any part of the platform's software</li>
          </ul>
        </Section>

        <Section id="s9" title="9. User-Generated Content">
          <p style={pStyle}>By posting any listing, image, text, or other content on AdSabai ("User Content"), you:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Confirm that you own or have the necessary rights to post such content</li>
            <li style={liStyle}>Grant AdSabai a non-exclusive, royalty-free, worldwide licence to display, reproduce, and distribute your User Content solely for the purpose of operating the platform</li>
            <li style={liStyle}>Confirm that your User Content does not violate any third party's intellectual property, privacy, or other rights</li>
            <li style={liStyle}>Agree that AdSabai may remove any User Content at its discretion without notice</li>
          </ul>
          <p style={pStyle}>AdSabai does not claim ownership of your User Content. You retain all ownership rights to the content you post.</p>
        </Section>

        <Section id="s10" title="10. Privacy & Data Protection">
          <p style={pStyle}>Your use of AdSabai is also governed by our <strong>Privacy Policy</strong>, which is incorporated into these Terms by reference. By using AdSabai, you consent to the collection and use of your personal data as described in our <a href="/privacy" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Privacy Policy</a>.</p>
          <p style={pStyle}>AdSabai complies with Thailand's Personal Data Protection Act (PDPA) B.E. 2562 (2019).</p>
        </Section>

        <Section id="s11" title="11. Disclaimer of Warranties">
          <p style={pStyle}>AdSabai is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis without warranties of any kind, express or implied. To the fullest extent permitted by Thai law, AdSabai disclaims all warranties including but not limited to:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>The accuracy, completeness, or reliability of any listing or user-generated content</li>
            <li style={liStyle}>The fitness of the platform for any particular purpose</li>
            <li style={liStyle}>Uninterrupted, error-free, or secure operation of the platform</li>
            <li style={liStyle}>The identity, credibility, or legitimacy of any user or seller on the platform</li>
          </ul>
          <p style={pStyle}>AdSabai does not verify the accuracy of listings posted by users. You are responsible for conducting your own due diligence before entering into any transaction.</p>
        </Section>

        <Section id="s12" title="12. Limitation of Liability">
          <p style={pStyle}>To the maximum extent permitted by applicable law, AdSabai and its operators, employees, and agents shall not be liable for any:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Direct, indirect, incidental, special, or consequential damages arising from your use of the platform</li>
            <li style={liStyle}>Loss of profits, revenue, data, or goodwill</li>
            <li style={liStyle}>Fraudulent transactions, disputes, or losses arising between users</li>
            <li style={liStyle}>Interruption or unavailability of the platform</li>
            <li style={liStyle}>Unauthorised access to your account or data resulting from your failure to maintain account security</li>
          </ul>
          <p style={pStyle}>Where liability cannot be fully excluded by law, AdSabai's total liability to you shall not exceed the amount you paid to AdSabai in the 30 days preceding the event giving rise to the claim.</p>
        </Section>

        <Section id="s13" title="13. Indemnification">
          <p style={pStyle}>You agree to indemnify, defend, and hold harmless AdSabai and its operators, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Your use of the AdSabai platform</li>
            <li style={liStyle}>Your violation of these Terms of Service</li>
            <li style={liStyle}>Content you post on the platform</li>
            <li style={liStyle}>Your violation of any third party's rights, including intellectual property or privacy rights</li>
            <li style={liStyle}>Any transaction you enter into with another user of the platform</li>
          </ul>
        </Section>

        <Section id="s14" title="14. Termination & Suspension">
          <p style={pStyle}>AdSabai reserves the right to suspend or permanently terminate your account at any time, with or without notice, if you:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Violate any provision of these Terms of Service</li>
            <li style={liStyle}>Post prohibited content or engage in prohibited activities</li>
            <li style={liStyle}>Engage in fraudulent, abusive, or harmful behaviour toward other users</li>
            <li style={liStyle}>Provide false registration information</li>
            <li style={liStyle}>Fail to pay any amounts due to AdSabai</li>
          </ul>
          <p style={pStyle}>Upon termination, your right to access and use the platform ceases immediately. Any active paid listings at the time of termination due to a policy violation will not be refunded.</p>
          <p style={pStyle}>You may also terminate your account at any time by contacting us at support@adsabai.com. Account deletion requests will be processed within 30 days.</p>
        </Section>

        <Section id="s15" title="15. Dispute Resolution">
          <p style={pStyle}>AdSabai is a platform connecting buyers and sellers. We are not a party to any transaction between users and do not mediate disputes between users. If you have a dispute with another user, you are encouraged to resolve it directly.</p>
          <p style={pStyle}>For disputes with AdSabai directly, please contact us first at <strong>support@adsabai.com</strong>. We will make reasonable efforts to resolve complaints within <strong>14 business days</strong>.</p>
          <p style={pStyle}>If a dispute cannot be resolved through direct communication, it shall be submitted to the jurisdiction of the competent courts of Thailand.</p>
        </Section>

        <Section id="s16" title="16. Governing Law">
          <p style={pStyle}>These Terms of Service are governed by and construed in accordance with the laws of the <strong>Kingdom of Thailand</strong>, including the Civil and Commercial Code, the Computer Crimes Act B.E. 2550, the Electronic Transactions Act B.E. 2544, and the Personal Data Protection Act B.E. 2562.</p>
          <p style={pStyle}>Any legal proceedings arising from or in connection with these Terms shall be brought exclusively before the competent courts of Thailand.</p>
        </Section>

        <Section id="s17" title="17. Changes to These Terms">
          <p style={pStyle}>AdSabai reserves the right to update or modify these Terms of Service at any time. We will notify registered users of material changes by:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Sending a notification email to your registered email address, and/or</li>
            <li style={liStyle}>Displaying a prominent notice on the AdSabai platform</li>
          </ul>
          <p style={pStyle}>Your continued use of AdSabai after the effective date of any changes constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using AdSabai and may request account deletion as described in Section 14.</p>
        </Section>

        <Section id="s18" title="18. Contact Us">
          <p style={pStyle}>If you have any questions, concerns, or complaints about these Terms of Service, please contact us:</p>
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
            <strong>AdSabai — Support Team</strong>
          </p>
          <p style={{ ...pStyle, marginBottom: 0, lineHeight: 2.1 }}>
            📧 Email: <strong>support@adsabai.com</strong><br />
            🌐 Website: <strong>www.adsabai.com</strong><br />
            📍 Location: Bangkok, Thailand<br />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>We aim to respond to all enquiries within 2 business days.</span>
          </p>
        </div>

      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ marginTop: '2.25rem', scrollMarginTop: '1.5rem' }}>
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

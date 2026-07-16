'use client'
import { useSettings } from '@/context/SettingsContext';
import styles from './page.module.css';

const sections = [
  {
    num: '1.',
    title: 'Vehicle Information Disclaimer',
    text: 'Vehicle descriptions, photos, mileage, features, colors, options and equipment are provided for convenience and may occasionally contain errors or omissions.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    num: '2.',
    title: 'Pricing Disclaimer',
    text: 'Vehicle prices are subject to change without prior notice. Taxes, title, registration fees, documentation fees, financing costs, transportation fees and optional products are not included unless otherwise stated.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    num: '3.',
    title: 'Rebuilt Title Disclaimer',
    text: 'Some vehicles sold by Connect Auto Sales may have rebuilt titles. Customers are encouraged to review previous damage information, vehicle history and inspection information before purchasing.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    num: '4.',
    title: 'Financing Disclaimer',
    text: 'Financing approvals, interest rates, down payments and loan terms are determined by lenders and customer qualifications.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="10" width="18" height="11" rx="2"/>
        <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
        <line x1="12" y1="15" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    num: '5.',
    title: 'Warranty Disclaimer',
    text: 'Warranty availability, coverage, terms and eligibility vary by vehicle and warranty provider.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    num: '6.',
    title: 'Website Information Disclaimer',
    text: 'Website content, inventory availability and pricing information may be updated without prior notice.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    num: '7.',
    title: 'Limitation Of Liability',
    text: 'Connect Auto Sales is not responsible for temporary website interruptions, technical errors, third-party outages or delays beyond our control.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
];

export default function TermsPage() {
  const s = useSettings()
  const phone   = s.phone   || '3134133400'
  const address = `${s.address || '4413 S Beech Daly St'}, ${s.city || 'Dearborn Heights'}, ${s.state || 'MI'} ${s.zip || '48125'}`
  const email   = s.email   || 'info@connectautosales.com'
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className={styles.heroTitle}>TERMS &amp; CONDITIONS</h1>
          <div className={styles.heroLine} />
        </div>
      </section>

      {/* ── Content ── */}
      <section className={styles.content}>
        <div className="container">

          {/* Last Updated */}
          <div className={styles.lastUpdated}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span><strong>Last Updated:</strong> May 20, 2025</span>
          </div>

          {/* Sections */}
          <div className={styles.sectionsList}>
            {sections.map((s, i) => (
              <div key={i} className={styles.policyRow}>
                <div className={styles.policyIcon}>{s.icon}</div>
                <div>
                  <h2 className={styles.policyTitle}>
                    {s.num} {s.title}
                  </h2>
                  <p className={styles.policyText}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Box */}
          <div className={styles.contactBox}>
            <div className={styles.contactLeft}>
              <div className={styles.contactIconWrap}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
                </svg>
              </div>
              <div>
                <p className={styles.contactTitle}>Contact Information</p>
                <p className={styles.contactBrand}>Connect Auto Sales</p>
                <p className={styles.contactAddr}>{address}</p>
              </div>
            </div>
            <div className={styles.contactDivider} />
            <div className={styles.contactRight}>
              <div className={styles.contactItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
                <span>{phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}</span>
              </div>
              <div className={styles.contactItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <a href="http://www.ConnectAutoSales.com" className={styles.contactLink}>www.ConnectAutoSales.com</a>
              </div>
            </div>
          </div>

          {/* Update Notice */}
          <div className={styles.noticeBox}>
            <div className={styles.noticeIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className={styles.noticeText}>
              These Terms &amp; Conditions may be updated periodically without prior notice.<br />
              Please review this page regularly for updates.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}

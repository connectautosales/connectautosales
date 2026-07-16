'use client'
import { useSettings } from '@/context/SettingsContext';
import styles from './page.module.css';

const sections = [
  {
    num: '1.',
    title: 'Information We Collect',
    bullets: ['Name', 'Phone Number', 'Email Address', 'Vehicle Interests', 'Financing Information', 'Documents Submitted Through The Website'],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    num: '2.',
    title: 'How We Use Your Information',
    bullets: ['Respond To Inquiries', 'Process Financing Requests', 'Schedule Salvage Inspections', 'Provide Warranty Information', 'Communicate About Vehicles And Services'],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    num: '3.',
    title: 'Financing Application Information',
    text: 'Information submitted through financing applications is used solely for processing financing requests and communicating with lenders.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="4"/>
        <path d="M12 14v2M8 20h8"/>
        <path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6"/>
      </svg>
    ),
  },
  {
    num: '4.',
    title: 'Document Uploads',
    text: 'Documents uploaded through the website are used only for the requested services, such as salvage inspections and related paperwork.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <polyline points="12 18 12 12"/>
        <polyline points="9 15 12 12 15 15"/>
      </svg>
    ),
  },
  {
    num: '5.',
    title: 'Cookies & Tracking',
    bullets: ['Google Analytics', 'Meta Pixel', 'Website Performance Tools'],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#e50202"/>
        <path d="M15 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#e50202"/>
        <path d="M9 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#e50202"/>
        <path d="M14.5 15.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#e50202"/>
      </svg>
    ),
  },
  {
    num: '6.',
    title: 'Third-Party Services',
    bullets: ['Google', 'Meta', 'Cars Protection Plus', 'Preferred Warranty (PWI)', 'Financing Providers'],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    num: '7.',
    title: 'Data Protection',
    text: 'We implement reasonable measures to protect customer information submitted through our website.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <circle cx="12" cy="11" r="2"/>
        <path d="M12 13v3"/>
      </svg>
    ),
  },
];

export default function PrivacyPage() {
  const s = useSettings()
  const phone   = s.phone   || '3134133400'
  const address = `${s.address || '4413 S Beech Daly St'}, ${s.city || 'Dearborn Heights'}, ${s.state || 'MI'} ${s.zip || '48125'}`
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className={styles.heroTitle}>PRIVACY POLICY</h1>
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
            <span>Last Updated: May 20, 2025</span>
          </div>

          {/* Sections */}
          <div className={styles.sectionsList}>
            {sections.map((s, i) => (
              <div key={i} className={styles.policyRow}>
                <div className={styles.policyLeft}>
                  <div className={styles.policyIcon}>{s.icon}</div>
                  <h2 className={styles.policyTitle}>
                    <span className={styles.policyNum}>{s.num}</span> {s.title}
                  </h2>
                </div>
                <div className={styles.policyRight}>
                  {s.bullets && (
                    <ul className={styles.bulletList}>
                      {s.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  )}
                  {s.text && <p className={styles.policyText}>{s.text}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Box */}
          <div className={styles.contactBox}>
            <div className={styles.contactLeft}>
              <div className={styles.contactIconWrap}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
                  <path d="M12 2a10 10 0 0 1 10 10" opacity=".3"/>
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
        </div>
      </section>
    </main>
  );
}

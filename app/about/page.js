import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const whyItems = [
  {
    title: 'LICENSED MICHIGAN DEALER',
    desc: 'We are a fully licensed and bonded dealership in the State of Michigan.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    title: 'TRANSPARENT & HONEST',
    desc: 'No hidden fees, no surprises. Just honest information and fair prices.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    title: 'QUALITY YOU CAN TRUST',
    desc: 'We stand behind our vehicles and services so you can buy with confidence.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    title: 'FOCUSED ON YOU',
    desc: "Your satisfaction is our top priority. We're here to help before, during, and after the sale.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const offerItems = [
  {
    label: 'USED VEHICLE\nSALES',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#020300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5"/>
        <circle cx="15.5" cy="17.5" r="2.5"/>
        <circle cx="5.5" cy="17.5" r="2.5"/>
        <path d="M3 9h11M9 3v6"/>
      </svg>
    ),
  },
  {
    label: 'FINANCING\nASSISTANCE',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#020300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="7" x2="12" y2="8"/>
        <path d="M15 9.5A3 3 0 0 0 9 11c0 1.5 1 2 3 2.5s3 1 3 2.5a3 3 0 0 1-6 0"/>
        <line x1="12" y1="16" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    label: 'WARRANTY\nOPTIONS',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#020300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    label: 'AUCTION\nSERVICES',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#020300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2l6 6-10 10-6-6 10-10z"/>
        <path d="M2 22l4-4"/>
        <path d="M20 2l2 2"/>
      </svg>
    ),
  },
  {
    label: 'MICHIGAN SALVAGE\nINSPECTIONS',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#020300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <h1 className={styles.heroTitle}>
            ABOUT <span>CONNECT</span><br />AUTO SALES
          </h1>
          <div className={styles.heroLine} />
        </div>
      </section>

      {/* ── Story + Why ── */}
      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            {/* Left: Our Story */}
            <div className={styles.storyCol}>
              <h2 className={styles.colHeading}>OUR STORY</h2>
              <div className={styles.headingLine} />
              <p className={styles.storyLead}>
                Connect Auto Sales is a family-owned used car dealership proudly serving Dearborn Heights, Michigan, and the surrounding Metro Detroit communities.
              </p>
              <p className={styles.storyBody}>
                Our mission is simple: provide quality vehicles, transparent information, and services that make vehicle ownership easier.
              </p>
              <p className={styles.storyBody}>
                Our goal is to provide a simple, transparent, and stress-free vehicle buying experience. We carefully select quality pre-owned vehicles and offer additional services that make vehicle ownership easier for our customers.
              </p>
              <p className={styles.storyBody}>
                Whether you&apos;re shopping for your next vehicle, exploring financing options, looking for warranty protection, purchasing a vehicle through dealer auctions, or completing a Michigan salvage inspection, our team is here to guide you through every step of the process.
              </p>
              <p className={styles.storyBody}>
                At Connect Auto Sales, we believe in honest communication, straightforward pricing, and building long-term relationships with our customers.
              </p>
            </div>

            {/* Right: Why Choose + Follow Us */}
            <div className={styles.whyCol}>
              <h2 className={styles.colHeading}>WHY CUSTOMERS CHOOSE US</h2>
              <div className={styles.headingLine} />
              <div className={styles.whyList}>
                {whyItems.map((item) => (
                  <div key={item.title} className={styles.whyItem}>
                    <div className={styles.whyIcon}>{item.icon}</div>
                    <div>
                      <p className={styles.whyTitle}>{item.title}</p>
                      <p className={styles.whyDesc}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Follow Us */}
              <h2 className={styles.colHeading} style={{ marginTop: 36 }}>FOLLOW US</h2>
              <div className={styles.headingLine} />
              <div className={styles.socialRow}>
                <a href="https://facebook.com/connectautosales" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} style={{ background: '#1877F2' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://instagram.com/connectautosales" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} style={{ background: 'radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285AEB 90%)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/></svg>
                </a>
                <a href="https://tiktok.com/@connectautosales" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} style={{ background: '#010101' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
                </a>
                <a href="https://youtube.com/@connectautosales" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} style={{ background: '#FF0000' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className={styles.offerSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>WHAT WE OFFER</h2>
          <div className={styles.headingLine} style={{ margin: '10px 0 32px' }} />
          <div className={styles.offerGrid}>
            {offerItems.map((item) => (
              <div key={item.label} className={styles.offerCard}>
                <div className={styles.offerIcon}>{item.icon}</div>
                <span className={styles.offerLabel}>{item.label.replace('\n', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visit Us ── */}
      <section className={styles.visitSection}>
        <div className="container">
          <div className={styles.visitGrid}>
            {/* Image */}
            <div className={styles.visitImg}>
              <Image src="/images/banner-1.png" alt="Connect Auto Sales dealership" fill style={{ objectFit: 'cover' }} unoptimized />
            </div>

            {/* Contact Info */}
            <div className={styles.visitInfo}>
              <h2 className={styles.visitTitle}>VISIT CONNECT AUTO SALES</h2>
              <div className={styles.headingLine} style={{ margin: '10px 0 24px' }} />
              <ul className={styles.visitList}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#e10001"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <span>4413 S Beech Daly St,<br />Dearborn Heights, MI 48125</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
                  <span>(313) 413-3400</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Mon – Fri: 10:00 AM – 6:00 PM<br />Sat: 10:00 AM – 4:00 PM<br />Sun: Closed</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4285F4"/><path d="M12 6.5c1.38 0 2.63.56 3.54 1.46l2.65-2.65A8.46 8.46 0 0 0 12 3.5c-3.36 0-6.27 1.96-7.72 4.82l3.08 2.39C8.06 8.34 9.9 6.5 12 6.5z" fill="#EA4335"/><path d="M20.5 12c0-.63-.06-1.25-.17-1.84H12v3.5h4.77a4.07 4.07 0 0 1-1.77 2.67l2.78 2.16C19.36 17.07 20.5 14.69 20.5 12z" fill="#4285F4"/><path d="M7.36 14.71A8.5 8.5 0 0 1 3.5 12c0-.97.17-1.9.47-2.78L.89 6.83A11.48 11.48 0 0 0 0 12c0 2.1.56 4.06 1.55 5.75l3.08-2.39-.27-.65z" fill="#FBBC05"/><path d="M12 20.5c2.43 0 4.47-.8 5.96-2.17l-2.78-2.16c-.82.55-1.87.88-3.18.88-2.1 0-3.94-1.84-4.64-3.34l-3.08 2.39C5.73 18.54 8.64 20.5 12 20.5z" fill="#34A853"/></svg>
                  <span>4.9 ⭐⭐⭐⭐⭐ Google Rating</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className={styles.visitCta}>
              <p className={styles.visitCtaText}>Stop by our dealership or reach out today. Our friendly team is ready to help you find the right vehicle or service for your needs.</p>
              <div className={styles.ctaBtns}>
                <a href="tel:3134133400" className={styles.btnCall}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
                  CALL US
                </a>
                <a href="sms:3134133400" className={styles.btnText}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  TEXT US
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

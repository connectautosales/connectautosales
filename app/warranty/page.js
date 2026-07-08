'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const faqs = [
  {
    q: 'Which warranty companies do you offer?',
    a: 'We currently offer warranty options through Cars Protection Plus and PWI Preferred Warranty.',
  },
  {
    q: 'Is warranty available on every vehicle?',
    a: 'Warranty availability depends on the vehicle, mileage, age and eligibility requirements.',
  },
  {
    q: 'Can I add warranty to my financing?',
    a: 'In many cases, yes. Warranty coverage can often be included in your financing package.',
  },
  {
    q: 'Are rebuilt title vehicles eligible?',
    a: 'Yes. We do offer warranty options for rebuilt title vehicles. Eligibility may vary depending on the vehicle and the warranty provider.',
  },
  {
    q: 'How long are warranty plans available?',
    a: 'Warranty plans are available in multiple terms depending on the provider, vehicle and selected coverage. Available terms may include 3 months, 6 months, 1 year, 2 years, 3 years and other available options.',
  },
  {
    q: 'What components are commonly covered?',
    a: 'Coverage may include engine, transmission, electrical components, air conditioning and other selected components depending on the selected plan.',
  },
  {
    q: 'Can I use warranty repairs nationwide?',
    a: 'Many plans provide access to nationwide repair networks. Coverage details vary by provider.',
  },
  {
    q: 'How do I choose the right warranty plan?',
    a: 'Our team will help you compare available options based on your vehicle, mileage and driving needs.',
  },
];

const badges = [
  { label: 'Extended Protection', img: '/images/Extended Protection.PNG' },
  { label: 'Mechanical Coverage', img: '/images/Mechanical Coverage.PNG' },
  { label: 'Flexible Options',    img: '/images/Flexible Options.png' },
  { label: 'Nationwide Coverage', img: '/images/Nationwide Coverage.png' },
];

const coverageItems = [
  { label: 'Engine',                img: '/images/engine.png' },
  { label: 'Transmission',          img: '/images/transimision.png' },
  { label: 'Electrical Components', img: '/images/electrical.png' },
  { label: 'Air Conditioning',      img: '/images/air-condition.png' },
  { label: 'Drive Components',      img: '/images/drive.png' },
  { label: 'Additional Components', img: '/images/additional.png' },
];

const whyItems = [
  { label: 'Extra Protection',       img: '/images/Extended Protection.PNG' },
  { label: 'Lower Repair Costs',     img: '/images/Flexible Options.png' },
  { label: 'Peace Of Mind',          img: '/images/Peace-Of-Mind.png' },
  { label: 'Nationwide Repair Network', img: '/images/Nationwide Coverage.png' },
];

export default function WarrantyPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>
            DRIVE WITH <span>CONFIDENCE</span>
          </h1>
          <p className={styles.heroSub}>Simple process. Extra peace of mind.</p>
        </div>
      </section>

      {/* ── Badges ── */}
      <section className={styles.badges}>
        <div className="container">
          <div className={styles.badgesGrid}>
            {badges.map((b) => (
              <div key={b.label} className={styles.badge}>
                <div className={styles.badgeIcon}>
                  <Image src={b.img} alt={b.label} width={48} height={48} unoptimized style={{ objectFit: 'contain' }} />
                </div>
                <span className={styles.badgeLabel}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className={styles.partners}>
        <div className="container">
          <h2 className={styles.sectionTitle}>OUR WARRANTY PARTNERS</h2>
          <div className={styles.titleLine} />
          <p className={styles.sectionSub}>Choose from trusted warranty providers available through Connect Auto Sales.</p>

          <div className={styles.partnersGrid}>
            <div className={styles.partnerCard}>
              <div className={styles.partnerLogoWrap}>
                <Image src="/images/Cars Protection Plus.png" alt="Cars Protection Plus" width={140} height={140} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <div className={styles.partnerInfo}>
                <h3 className={styles.partnerName} style={{ color: '#1a3a6b' }}>Cars Protection Plus</h3>
                <ul className={styles.partnerFeatures}>
                  <li>Multiple coverage options</li>
                  <li>Nationwide protection</li>
                  <li>Flexible plans</li>
                </ul>
              </div>
            </div>

            <div className={styles.partnerCard}>
              <div className={styles.partnerLogoWrap}>
                <Image src="/images/PWI Preferred Warranty.png" alt="PWI Preferred Warranty" width={140} height={140} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <div className={styles.partnerInfo}>
                <h3 className={styles.partnerName} style={{ color: '#c8a800' }}>PWI Preferred Warranty</h3>
                <ul className={styles.partnerFeatures}>
                  <li>Extensive protection plans</li>
                  <li>Additional coverage options</li>
                  <li>Flexible terms</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.partnerNote}>
            <p>Warranty plans available from 3 months to multiple years depending on the provider and selected coverage.</p>
            <p className={styles.partnerNoteMeta}>
              <strong>Available through Connect Auto Sales</strong>
              <span className={styles.noteSep}>|</span>
              Coverage varies by vehicle year, mileage and eligibility.
            </p>
          </div>
        </div>
      </section>

      {/* ── Coverage Overview ── */}
      <section className={styles.coverage}>
        <div className="container">
          <h2 className={styles.sectionTitle}>COVERAGE OVERVIEW</h2>
          <div className={styles.titleLine} />
          <div className={styles.coverageGrid}>
            {coverageItems.map((item) => (
              <div key={item.label} className={styles.coverageItem}>
                <div className={styles.coverageIconWrap}>
                  <Image src={item.img} alt={item.label} width={48} height={48} unoptimized style={{ objectFit: 'contain' }} />
                </div>
                <span className={styles.coverageLabel}>{item.label}</span>
              </div>
            ))}
          </div>
          <p className={styles.coverageNote}>
            Coverage, eligibility and terms vary by vehicle, mileage and selected warranty plan.
          </p>
        </div>
      </section>

      {/* ── Bottom: Why + FAQ ── */}
      <section className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomGrid}>
            <div>
              <h2 className={styles.sectionTitleLeft}>WHY CHOOSE WARRANTY COVERAGE?</h2>
              <div className={styles.titleLineLeft} />
              <div className={styles.whyGrid}>
                {whyItems.map((item) => (
                  <div key={item.label} className={styles.whyItem}>
                    <div className={styles.whyIconWrap}>
                      <Image src={item.img} alt={item.label} width={48} height={48} unoptimized style={{ objectFit: 'contain' }} />
                    </div>
                    <span className={styles.whyLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className={styles.sectionTitleLeft}>FREQUENTLY ASKED QUESTIONS</h2>
              <div className={styles.titleLineLeft} />
              <div className={styles.faqList}>
                {faqs.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <button
                      className={styles.faqQ}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{faq.q}</span>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}
                      >
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className={styles.faqA}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
              <p className={styles.disclaimer}>
                * Warranty availability, coverage, eligibility and terms vary by vehicle, mileage and selected warranty plan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

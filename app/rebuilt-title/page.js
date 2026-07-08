'use client';
import { useState } from 'react';
import styles from './page.module.css';

const faqs = [
  {
    q: 'What does rebuilt title mean?',
    a: 'A rebuilt title means the vehicle was previously branded as salvage, repaired, inspected, and approved to be driven again.',
  },
  {
    q: 'Is a rebuilt title vehicle legal to drive?',
    a: 'Yes. Once a vehicle passes the required inspection process and receives a rebuilt title, it is legal to register and drive on public roads.',
  },
  {
    q: 'Can I finance a rebuilt title vehicle?',
    a: 'Yes. Financing may be available depending on the vehicle, lender requirements, and customer qualifications.',
  },
  {
    q: 'Can I get warranty coverage on a rebuilt title vehicle?',
    a: 'Yes. Warranty options are available on eligible rebuilt title vehicles. Coverage and terms vary by vehicle and provider.',
  },
  {
    q: 'Do you show previous damage photos?',
    a: 'Yes. We provide previous damage photos whenever they are available so customers can better understand the vehicle history.',
  },
  {
    q: 'Can rebuilt title vehicles be insured?',
    a: 'Yes. Many insurance companies insure rebuilt title vehicles. Coverage options may vary by insurance provider.',
  },
];

const steps = [
  {
    num: '1',
    label: 'SALVAGE TITLE',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 3h15l3 5-3 5H1z"/><line x1="1" y1="8" x2="1" y2="8"/>
        <circle cx="5" cy="18" r="2"/><circle cx="14" cy="18" r="2"/>
        <path d="M5 16V8h9l2.5 4.5L16 16"/>
      </svg>
    ),
  },
  {
    num: '2',
    label: 'VEHICLE REPAIRED',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    num: '3',
    label: 'MAJOR PARTS DOCUMENTED',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    num: '4',
    label: 'VEHICLE INSPECTED',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <polyline points="9 11 11 13 15 9"/>
      </svg>
    ),
  },
  {
    num: '5',
    label: 'REBUILT TITLE',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <polyline points="9 12 11 14 15 10"/>
        <circle cx="17" cy="18" r="4" fill="#22c55e" stroke="none"/>
        <polyline points="15 18 16.5 19.5 19 17" stroke="#fff" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const knowItems = [
  {
    label: 'Previous\nDamage History',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Repair\nDocumentation',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    dark: false,
  },
  {
    label: 'Passed\nInspection',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        <polyline points="10 14 12 16 16 12" stroke="#22c55e"/>
      </svg>
    ),
  },
  {
    label: 'Often Lower\nPriced',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        <path d="M9 19h-.5" stroke="#e10001"/><line x1="6" y1="19" x2="6.01" y2="19" stroke="#e10001" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: 'State\nInspected',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="22" x2="21" y2="22"/>
        <rect x="2" y="2" width="20" height="14" rx="2"/>
        <path d="M8 6h8M8 10h5"/>
      </svg>
    ),
  },
  {
    label: 'Transparent\nInformation',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        <polyline points="18 12 20 14 23 11" stroke="#22c55e"/>
      </svg>
    ),
  },
];

const myths = [
  {
    myth: 'A rebuilt title does NOT mean the vehicle is unsafe.',
    desc: 'Each vehicle is inspected to ensure it meets safety standards.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    myth: 'A rebuilt title does NOT mean the vehicle is uninsurable.',
    desc: 'Most insurance companies will insure rebuilt title vehicles.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    myth: 'A rebuilt title alone does not determine vehicle quality.',
    desc: 'Quality depends on the repairs, not the title brand.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
];

const whyItems = [
  {
    label: 'Licensed\nMichigan Dealer',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <circle cx="12" cy="11" r="2" fill="#e10001"/>
      </svg>
    ),
  },
  {
    label: 'Transparent\nVehicle History',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Thoroughly\nInspected',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    label: 'Warranty Options\nAvailable',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
];

export default function RebuiltTitlePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const leftFaqs = faqs.slice(0, 3);
  const rightFaqs = faqs.slice(3, 6);

  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <h1 className={styles.heroTitle}>REBUILT TITLE<br />INFORMATION</h1>
          <div className={styles.heroLine} />
        </div>
      </section>

      {/* ── What Is A Rebuilt Title ── */}
      <section className={styles.whatSection}>
        <div className="container">
          <div className={styles.whatCard}>
            <div className={styles.whatIconWrap}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div>
              <h2 className={styles.whatTitle}>WHAT IS A REBUILT TITLE?</h2>
              <p className={styles.whatText}>A rebuilt title vehicle was previously branded as salvage, repaired, inspected, and approved to be driven again.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Salvage vs Rebuilt ── */}
      <section className={styles.compareSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>SALVAGE VS REBUILT</h2>
          <div className={styles.titleLine} />
          <div className={styles.compareGrid}>
            {/* Salvage */}
            <div className={styles.salvageCard}>
              <div className={styles.salvageHeader}>
                <div className={styles.xCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <span className={styles.salvageLabel}>SALVAGE TITLE</span>
              </div>
              <ul className={styles.compareList}>
                {['Not road legal','Cannot be registered','Cannot be driven','Needs repairs','Needs inspection'].map(item => (
                  <li key={item} className={styles.compareListItemBad}>
                    <div className={styles.xCircleSm}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* VS center */}
            <div className={styles.vsCenter}>
              <div className={styles.vsCarImg} />
              <div className={styles.vsBadge}>VS</div>
            </div>

            {/* Rebuilt */}
            <div className={styles.rebuiltCard}>
              <div className={styles.rebuiltHeader}>
                <div className={styles.checkCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className={styles.rebuiltLabel}>REBUILT TITLE</span>
              </div>
              <ul className={styles.compareList}>
                {['Road legal','Can be registered','Can be insured','Passed inspection','Ready to drive'].map(item => (
                  <li key={item} className={styles.compareListItemGood}>
                    <div className={styles.checkCircleSm}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How A Salvage Vehicle Becomes Rebuilt ── */}
      <section className={styles.stepsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>HOW A SALVAGE VEHICLE BECOMES REBUILT</h2>
          <div className={styles.titleLine} />
          <div className={styles.stepsRow}>
            {steps.map((step, i) => (
              <div key={i} className={styles.stepWrap}>
                <div className={styles.stepCard}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <div className={styles.stepIconWrap}>{step.icon}</div>
                </div>
                <p className={styles.stepLabel}>{step.label}</p>
                {i < steps.length - 1 && (
                  <div className={styles.stepArrow}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Should Know ── */}
      <section className={styles.knowSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>WHAT YOU SHOULD KNOW</h2>
          <div className={styles.titleLine} />
          <div className={styles.knowGrid}>
            {knowItems.map((item, i) => (
              <div key={i} className={styles.knowCard}>
                <div className={i === 0 ? styles.knowIconRed : styles.knowIconGray}>{item.icon}</div>
                <p className={styles.knowLabel}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Common Myths ── */}
      <section className={styles.mythsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>COMMON MYTHS ABOUT REBUILT TITLES</h2>
          <div className={styles.titleLine} />
          <div className={styles.mythsGrid}>
            {myths.map((m, i) => (
              <div key={i} className={styles.mythCard}>
                <div className={styles.mythIconWrap}>{m.icon}</div>
                <div className={styles.mythContent}>
                  <p className={styles.mythText}><strong>{m.myth}</strong></p>
                  <p className={styles.mythDesc}>{m.desc}</p>
                </div>
                <div className={styles.mythShieldWrap}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Buy Rebuilt From Connect ── */}
      <section className={styles.whySection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>WHY BUY REBUILT FROM CONNECT AUTO SALES?</h2>
          <div className={styles.titleLineRed} />
          <div className={styles.whyGrid}>
            {whyItems.map((item, i) => (
              <div key={i} className={styles.whyCard}>
                <div className={styles.whyIconWrap}>{item.icon}</div>
                <p className={styles.whyLabel}>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className={styles.warningBox}>
            <div className={styles.warningIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <p className={styles.warningText}>Not every vehicle in our inventory is a rebuilt title vehicle. We sell both clean title and rebuilt title vehicles.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</h2>
          <div className={styles.titleLineRed} />
          <div className={styles.faqGrid}>
            {/* Left column */}
            <div className={styles.faqCol}>
              {leftFaqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button
                    className={styles.faqQ}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openFaq === i && <p className={styles.faqA}>{faq.a}</p>}
                </div>
              ))}
            </div>
            {/* Right column */}
            <div className={styles.faqCol}>
              {rightFaqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button
                    className={styles.faqQ}
                    onClick={() => setOpenFaq(openFaq === (i + 3) ? null : (i + 3))}
                  >
                    <span>{faq.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openFaq === (i + 3) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openFaq === (i + 3) && <p className={styles.faqA}>{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Bar ── */}
      <section className={styles.ctaBar}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaIconWrap}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p className={styles.ctaText}>Still have questions about rebuilt title vehicles?</p>
            </div>
            <div className={styles.ctaActions}>
              <a href="tel:3134133400" className={styles.ctaCall}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
                Call &nbsp;(313) 413-3400
              </a>
              <div className={styles.ctaDivider} />
              <a href="sms:3134133400" className={styles.ctaTextBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Text Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

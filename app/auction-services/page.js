'use client';
import { useState } from 'react';
import styles from './page.module.css';

const steps = [
  {
    num: '1',
    label: 'BROWSE AUCTION\nVEHICLES',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <path d="M7 9h1l1-2h4l1 2h1" strokeWidth="1.4"/>
        <path d="M6 11h12" strokeWidth="1.4"/>
        <circle cx="8.5" cy="13" r="1" fill="#4b5563"/><circle cx="13.5" cy="13" r="1" fill="#4b5563"/>
      </svg>
    ),
  },
  {
    num: '2',
    label: 'CHOOSE YOUR\nVEHICLE',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5a2 2 0 0 1-2 2h-2"/>
        <circle cx="9" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
        <path d="M9 11h6M3 9h3"/>
      </svg>
    ),
  },
  {
    num: '3',
    label: 'SEND US THE\nINFORMATION',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    num: '4',
    label: 'WE HANDLE THE\nPURCHASE PROCESS',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="2"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
];

const knowItems = [
  {
    label: 'SERVICE FEE\nREQUIRED',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    label: 'VEHICLE COST\nSEPARATE',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    label: 'AUCTION FEES\nMAY APPLY',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14l-7.5 7.5a2.121 2.121 0 0 1-3-3L11 11"/>
        <path d="M4 4l4 4M14 4l4 4M4 14l4-4"/>
        <line x1="14" y1="4" x2="20" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'TRANSPORTATION\nMAY APPLY',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        <path d="M16 3h5" stroke="#e10001" strokeWidth="2"/>
      </svg>
    ),
  },
];

const auctions = [
  {
    name: 'IAAI',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 60 }}>
        <span style={{ fontSize: 42, fontWeight: 900, color: '#e10001', letterSpacing: '-2px', fontFamily: 'Arial Black, sans-serif' }}>AA</span>
      </div>
    ),
  },
  {
    name: 'COPART',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 60 }}>
        <div style={{ background: '#003087', borderRadius: 30, padding: '8px 20px' }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>COPART</span>
        </div>
      </div>
    ),
  },
  {
    name: 'MANHEIM',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 60 }}>
        <span style={{ fontSize: 38, fontWeight: 900, color: '#c8a400', fontFamily: 'Georgia, serif' }}>M</span>
      </div>
    ),
  },
];

const faqs = [
  { q: 'Can I choose the vehicle myself?', a: 'Yes. You find the vehicle at an auction site (IAAI, Copart, Manheim), send us the link and lot number, and we handle the rest.' },
  { q: 'Do you bid on the vehicle for me?', a: 'Yes. Once you send us the auction details, our team coordinates the bidding and purchase process on your behalf.' },
  { q: 'Do I pay a service fee?', a: 'Yes. A service fee is required in addition to the vehicle cost and any applicable auction or transportation fees.' },
  { q: 'Can you help with transportation?', a: 'Yes. We can assist with arranging transportation for the vehicle. Transportation costs may apply and vary by location.' },
  { q: 'Can I finance an auction vehicle?', a: 'Financing may be available depending on the vehicle and lender qualifications. Contact us for more details.' },
  { q: 'How long does the process take?', a: 'Timelines vary depending on the auction, vehicle availability, and transportation. Our team will keep you updated throughout the process.' },
];

export default function AuctionServicesPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    auctionLink: '', lotNumber: '', notes: '',
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('Your auction purchase request has been submitted. We will contact you shortly!');
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <p className={styles.heroEyebrow}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>
            BUY DIRECT FROM<br />
            <span>DEALER AUCTIONS</span>
          </h1>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.stepsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>HOW IT WORKS</h2>
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

      {/* ── What Customers Need To Know ── */}
      <section className={styles.knowSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>WHAT CUSTOMERS NEED TO KNOW</h2>
          <div className={styles.titleLine} />
          <div className={styles.knowGrid}>
            {knowItems.map((item, i) => (
              <div key={i} className={styles.knowCard}>
                <div className={styles.knowIconWrap}>{item.icon}</div>
                <p className={styles.knowLabel}>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className={styles.noticeBar}>
            <div className={styles.noticeIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#020300" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className={styles.noticeDivider} />
            <div>
              <span className={styles.noticeLabel}>IMPORTANT INFORMATION</span>
              <span className={styles.noticeSep}>|</span>
              <span className={styles.noticeText}>Vehicle prices, auction fees, transportation, taxes and service fees vary by vehicle.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Browse Auctions + Form ── */}
      <section className={styles.mainSection}>
        <div className="container">
          <div className={styles.mainGrid}>
            {/* Left: Browse Auctions */}
            <div className={styles.auctionsCol}>
              <h2 className={styles.colTitle}>BROWSE AVAILABLE AUCTIONS</h2>
              <div className={styles.colLine} />
              <div className={styles.auctionGrid}>
                {auctions.map((a, i) => (
                  <div key={i} className={styles.auctionCard}>
                    {a.logo}
                    <p className={styles.auctionName}>{a.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className={styles.formCol}>
              <h2 className={styles.colTitle}>START MY AUCTION PURCHASE</h2>
              <div className={styles.colLine} />
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>First Name</label>
                    <input className={styles.input} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Last Name</label>
                    <input className={styles.input} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Auction Link (URL)</label>
                    <input className={styles.input} name="auctionLink" value={form.auctionLink} onChange={handleChange} placeholder="Auction Link (URL)" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Lot Number</label>
                    <input className={styles.input} name="lotNumber" value={form.lotNumber} onChange={handleChange} placeholder="Lot Number" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Additional Notes</label>
                  <textarea className={styles.textarea} name="notes" value={form.notes} onChange={handleChange} placeholder="Additional Notes" rows={4} />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h4l3 5v3h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  START MY AUCTION PURCHASE
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</h2>
          <div className={styles.titleLineRed} />
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQ}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openFaq === i && <p className={styles.faqA}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

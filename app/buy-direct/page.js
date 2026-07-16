'use client'
import Link from 'next/link'
import styles from './page.module.css'

const steps = [
  {
    num: '01',
    title: 'Do Your Research',
    desc: 'Browse available vehicles on the major auction platforms before placing a bid.',
    details: [
      { label: 'Copart Auction', site: 'www.Copart.com', locLink: 'https://www.copart.com/locations/', locLabel: 'Copart USA Locations' },
      { label: 'IAAI Auction', site: 'www.IAAI.com', locLink: 'https://www.iaai.com/locations', locLabel: 'IAAI USA Locations' },
    ],
  },
  {
    num: '02',
    title: 'Set Your Maximum Bid Amount',
    desc: 'Decide your max bid amount. Once submitted, bids cannot be retracted. Auction fees are extra and not included in the bid.',
  },
  {
    num: '03',
    title: 'Submit a Security Deposit',
    desc: 'Pay $1,000 USD or 20% of your max bid (whichever is higher) before we place your bid. This deposit confirms your commitment if the bid wins.',
  },
  {
    num: '04',
    title: 'We Place Your Bid',
    desc: 'Our team submits your bid at the auction on your behalf. We handle all communication with the auction house directly.',
  },
  {
    num: '05',
    title: 'Winning the Bid',
    desc: 'If your bid is the highest, payment is due within one business day. Late payments incur auction fees, and delayed pickup incurs storage fees.',
  },
  {
    num: '06',
    title: 'Transfer of Ownership',
    desc: 'The dealership manages the title transfer under your name. You will receive your Michigan title by mail within approximately 2 weeks.',
  },
  {
    num: '07',
    title: 'Total Cost and Fees',
    desc: 'Total Cost = Auction Cost + Our Fees + Transfer of Ownership Fees. We provide a full breakdown before any bid is placed.',
  },
]

export default function BuyDirectPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>BUY <span>DIRECT</span></h1>
          <p className={styles.heroSub}>Purchase directly from Copart &amp; IAAI auctions — we handle everything on your behalf.</p>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.introSection}>
        <div className="container">
          <div className={styles.introCard}>
            <div className={styles.introText}>
              <h2 className={styles.introTitle}>How It Works</h2>
              <div className={styles.introLine} />
              <p className={styles.introPara}>Connect Auto Sales gives you direct access to major auto auctions like Copart and IAAI. We bid on your behalf, manage the paperwork, and handle the title transfer — all you have to do is choose the vehicle you want.</p>
              <p className={styles.introPara}>Browse available lots online, set your maximum bid, and let us do the rest. Our team has years of experience navigating auction purchases and will guide you every step of the way.</p>
            </div>
            <div className={styles.introStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>2</span>
                <span className={styles.statLabel}>Major Auction Partners</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>~2wk</span>
                <span className={styles.statLabel}>Title Delivery Time</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>1 Day</span>
                <span className={styles.statLabel}>Payment Window</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Partners */}
      <section className={styles.auctionsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Auction Partners</h2>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.auctionGrid}>
            {/* Copart */}
            <div className={styles.auctionCard}>
              <div className={styles.auctionLogo} style={{ background: '#e50202' }}>
                <span className={styles.auctionLogoText}>COPART</span>
              </div>
              <div className={styles.auctionInfo}>
                <h3 className={styles.auctionName}>Copart Auction</h3>
                <a href="https://www.copart.com" target="_blank" rel="noreferrer" className={styles.auctionLink}>www.Copart.com</a>
                <a href="https://www.copart.com/locations/" target="_blank" rel="noreferrer" className={styles.auctionLocLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Copart USA Locations
                </a>
              </div>
            </div>
            {/* IAAI */}
            <div className={styles.auctionCard}>
              <div className={styles.auctionLogo} style={{ background: '#1a3a6b' }}>
                <span className={styles.auctionLogoText}>IAAI</span>
              </div>
              <div className={styles.auctionInfo}>
                <h3 className={styles.auctionName}>IAAI Auction</h3>
                <a href="https://www.iaai.com" target="_blank" rel="noreferrer" className={styles.auctionLink}>www.IAAI.com</a>
                <a href="https://www.iaai.com/locations" target="_blank" rel="noreferrer" className={styles.auctionLocLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  IAAI USA Locations
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className={styles.stepsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Step-by-Step Process</h2>
            <div className={styles.sectionLine} />
            <p className={styles.sectionSub}>Everything you need to know before placing a bid</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((s, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
                {s.details && (
                  <div className={styles.stepDetails}>
                    {s.details.map((d, j) => (
                      <div key={j} className={styles.stepDetailItem}>
                        <p className={styles.stepDetailLabel}>{d.label}</p>
                        <a href={`https://${d.site}`} target="_blank" rel="noreferrer" className={styles.stepDetailSite}>{d.site}</a>
                        <a href={d.locLink} target="_blank" rel="noreferrer" className={styles.stepDetailLoc}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {d.locLabel}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning box */}
      <section className={styles.warningSection}>
        <div className="container">
          <div className={styles.warningBox}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>
              <strong>Important:</strong> Once a bid is submitted it cannot be retracted. Auction fees are not included in the bid amount. Payment is due within one business day of winning. Late payments and delayed pickups may result in additional auction and storage fees.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className={styles.ctaBar}>
        <div className="container">
          <div className={styles.ctaBarInner}>
            <div>
              <h2 className={styles.ctaBarTitle}>Ready to Get Started?</h2>
              <p className={styles.ctaBarSub}>Contact us to discuss available auction vehicles and place your bid.</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link href="/contact" className={styles.ctaBtnPrimary}>CONTACT US</Link>
              <Link href="/financing" className={styles.ctaBtnSecondary}>APPLY FOR FINANCING</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

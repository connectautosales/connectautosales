'use client'
import Link from 'next/link'
import styles from './page.module.css'

const steps = [
  { num: '01', title: 'Browse Online', desc: 'Explore our full inventory from the comfort of your home. Filter by make, model, price, and title type.' },
  { num: '02', title: 'Choose Your Car', desc: "Found the one? Contact us directly or apply for financing online — no pressure, no runaround." },
  { num: '03', title: 'Get Approved', desc: 'Fast financing approval — often same day. We work with all credit types including first-time buyers.' },
  { num: '04', title: 'Drive Away', desc: 'Come pick it up from our Dearborn Heights lot or arrange transportation to your door.' },
]

const benefits = [
  { title: 'No Hidden Fees', desc: 'The price you see is the price you pay. No dealer markups, no surprise charges at the end.' },
  { title: 'No Pressure', desc: "Take your time. We're here to help, not push. Buy on your schedule, not ours." },
  { title: 'Fair Trade-Ins', desc: 'Get top dollar for your current vehicle. We offer competitive trade-in values with no hassle.' },
  { title: 'Online Process', desc: "Browse, apply, and communicate entirely online. Visit us only when you're ready to pick up." },
  { title: 'All Credit Types', desc: 'First-time buyer, bad credit, or no credit — we work with lenders to find a solution for you.' },
  { title: 'Local & Trusted', desc: 'Serving Dearborn Heights and Metro Detroit for years. Hundreds of happy customers.' },
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
          <p className={styles.heroSub}>No middlemen. No markups. Just honest pricing straight from the source.</p>
        </div>
      </section>

      {/* Intro Card */}
      <section className={styles.introSection}>
        <div className="container">
          <div className={styles.introCard}>
            <div className={styles.introText}>
              <h2 className={styles.introTitle}>The Smarter Way to Buy a Car</h2>
              <div className={styles.introLine} />
              <p className={styles.introPara}>Skip the middleman and buy directly from Connect Auto Sales. No dealer markups, no pressure sales tactics — just honest pricing and great vehicles. Our inventory includes both clean title and rebuilt title vehicles, all inspected and priced below market.</p>
              <p className={styles.introPara}>Whether you have perfect credit or are rebuilding, we have financing options available. Walk in, browse online, or call us — the process is simple from start to finish.</p>
            </div>
            <div className={styles.introStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>12+</span>
                <span className={styles.statLabel}>Vehicles In Stock</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>Price Transparency</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>Same</span>
                <span className={styles.statLabel}>Day Approval</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Buy Direct From Us</h2>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.benefitsGrid}>
            {benefits.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.stepsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.sectionLine} />
            <p className={styles.sectionSub}>4 simple steps to your next vehicle</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((s, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className={styles.ctaBar}>
        <div className="container">
          <div className={styles.ctaBarInner}>
            <div>
              <h2 className={styles.ctaBarTitle}>Ready to Buy Direct?</h2>
              <p className={styles.ctaBarSub}>Browse our inventory and get started today — no pressure, no hassle.</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link href="/inventory" className={styles.ctaBtnPrimary}>BROWSE INVENTORY</Link>
              <Link href="/financing" className={styles.ctaBtnSecondary}>APPLY FOR FINANCING</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

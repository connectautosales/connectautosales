'use client'
import Link from 'next/link'
import styles from './page.module.css'

const steps = [
  { num: '01', title: 'Contact Us', desc: 'Reach out about the vehicle you want to purchase. Let us know your delivery location.' },
  { num: '02', title: 'Get a Quote', desc: "We'll provide a transportation quote based on your location — fast and transparent." },
  { num: '03', title: 'Complete Purchase', desc: 'Finalize your purchase and financing (if needed) from wherever you are.' },
  { num: '04', title: 'Vehicle Picked Up', desc: 'Our trusted transport partner picks up your vehicle from our Dearborn Heights lot.' },
  { num: '05', title: 'Track Your Car', desc: 'Receive real-time updates as your vehicle makes its way to you.' },
  { num: '06', title: 'Door Delivery', desc: 'Your vehicle arrives at your door — inspected, ready to drive, and all yours.' },
]

const features = [
  { title: 'Door-to-Door Delivery', desc: 'Your vehicle delivered right to your driveway anywhere in the US.' },
  { title: 'Insured Transport', desc: 'Full insurance coverage throughout the entire transport process.' },
  { title: 'Real-Time Tracking', desc: 'Know exactly where your vehicle is at every stage of delivery.' },
  { title: 'Nationwide Coverage', desc: 'We ship to all 50 states — no matter how far you are.' },
  { title: 'Trusted Partners', desc: 'We only work with vetted, professional transport carriers.' },
  { title: 'Affordable Rates', desc: 'Competitive transport pricing with no hidden fees or surprise charges.' },
]

export default function TransportationPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>VEHICLE <span>TRANSPORTATION</span></h1>
          <p className={styles.heroSub}>We ship nationwide — buy the car you want no matter where you are in the US.</p>
        </div>
      </section>

      {/* Intro Card */}
      <section className={styles.introSection}>
        <div className="container">
          <div className={styles.introCard}>
            <div className={styles.introText}>
              <h2 className={styles.introTitle}>We Ship Nationwide</h2>
              <div className={styles.introLine} />
              <p className={styles.introPara}>Can't make it to Dearborn Heights? No problem. Connect Auto Sales offers nationwide vehicle transportation so you can buy the car you want, no matter where you are in the US.</p>
              <p className={styles.introPara}>Our trusted transport partners handle your vehicle with care, ensuring it arrives safely and on time. All shipments are fully insured from pickup to delivery.</p>
            </div>
            <div className={styles.introStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>50</span>
                <span className={styles.statLabel}>States Covered</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>Insured Transport</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>Live</span>
                <span className={styles.statLabel}>Tracking Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What's Included</h2>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.stepsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How Transportation Works</h2>
            <div className={styles.sectionLine} />
            <p className={styles.sectionSub}>Simple 6-step process from purchase to delivery</p>
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
              <h2 className={styles.ctaBarTitle}>Ready to Ship Your Vehicle?</h2>
              <p className={styles.ctaBarSub}>Contact us with your location and the vehicle you want — we'll handle the rest.</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link href="/contact" className={styles.ctaBtnPrimary}>GET A TRANSPORT QUOTE</Link>
              <Link href="/inventory" className={styles.ctaBtnSecondary}>BROWSE INVENTORY</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

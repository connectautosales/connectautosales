'use client'
import Link from 'next/link'
import styles from './page.module.css'

const services = [
  { text: 'Bought a vehicle from any Auction in USA (IAAI / Copart / Manheim / ADESA) and want to get it to your shop or dealership?' },
  { text: 'Moving and want to ship your vehicle from Point A to Point B or from State to State?' },
  { text: 'Looking for Open / Enclosed / Door to Door Service?' },
  { text: 'Want to get a free quote without any hidden fees?' },
  { text: 'Running / No Running vehicle — NO Problem!' },
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
          <p className={styles.heroSub}>Nationwide vehicle shipping — open, enclosed, or door-to-door service available.</p>
        </div>
      </section>

      {/* Main Card */}
      <section className={styles.mainSection}>
        <div className="container">
          <div className={styles.mainCard}>

            <div className={styles.left}>
              <h2 className={styles.cardTitle}>Vehicle Transportation Service</h2>
              <div className={styles.cardLine} />
              <p className={styles.cardIntro}>We provide reliable, affordable vehicle transportation across the United States. Whether you purchased a vehicle at auction or need to ship your personal car, we have a solution for you.</p>

              <ul className={styles.serviceList}>
                {services.map((s, i) => (
                  <li key={i} className={styles.serviceItem}>
                    <div className={styles.serviceCheck}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.right}>
              <div className={styles.ctaCard}>
                <div className={styles.ctaCardIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" rx="1"/>
                    <path d="M16 8h4l3 3v5h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <h3 className={styles.ctaCardTitle}>Contact Us Today for a<br/><span>Free Quote!</span></h3>
                <p className={styles.ctaCardSub}>No hidden fees. Fast response. All vehicle types welcome.</p>

                <div className={styles.contactOptions}>
                  <a href="tel:3134133400" className={styles.contactOption}>
                    <div className={styles.contactOptionIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.55 5.55l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <p className={styles.contactOptionLabel}>Call Us</p>
                      <p className={styles.contactOptionValue}>+1 (313) 413-3400</p>
                    </div>
                  </a>
                  <a href="mailto:ConnectAutoSales@hotmail.com" className={styles.contactOption}>
                    <div className={styles.contactOptionIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div>
                      <p className={styles.contactOptionLabel}>Email Us</p>
                      <p className={styles.contactOptionValue}>ConnectAutoSales@hotmail.com</p>
                    </div>
                  </a>
                </div>

                <Link href="/contact" className={styles.ctaBtn}>GET A FREE QUOTE</Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Auction badges */}
      <section className={styles.auctionsSection}>
        <div className="container">
          <p className={styles.auctionLabel}>WE TRANSPORT FROM ALL MAJOR AUCTIONS</p>
          <div className={styles.auctionBadges}>
            {['IAAI', 'COPART', 'MANHEIM', 'ADESA'].map(name => (
              <div key={name} className={styles.auctionBadge}>
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

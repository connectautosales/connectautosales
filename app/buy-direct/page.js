import Link from 'next/link'
import styles from '../inner-page.module.css'

export const metadata = { title: 'Buy Direct - Connect Auto Sales' }

const steps = [
  { num: '01', title: 'Browse Online', desc: 'Explore our full inventory from the comfort of your home.' },
  { num: '02', title: 'Choose Your Car', desc: 'Found the one? Contact us or apply for financing online.' },
  { num: '03', title: 'Get Approved', desc: 'Fast financing approval â€” often same day.' },
  { num: '04', title: 'Drive Away', desc: 'Come pick it up or have it delivered to your door.' },
]

export default function BuyDirectPage() {
  return (
    <>
      <div className={styles.pageHero}>
        <div className="container">
          <h1 className={styles.pageHeroTitle}>Buy Direct</h1>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link><span>â€º</span><span>Buy Direct</span>
          </div>
        </div>
      </div>

      <section className={styles.contentPage}>
        <div className="container">
          <div className={styles.contentGrid}>
            <div className={styles.contentText}>
              <h2>The Smarter Way to Buy a Car</h2>
              <p>
                Skip the middleman and buy directly from Connect Auto Sales. No dealer markups, no pressure sales tactics â€” just honest pricing and great vehicles.
              </p>
              <p>
                Our Buy Direct program lets you purchase with confidence knowing you&apos;re getting the best possible price straight from the source.
              </p>
              <div className={styles.featList}>
                {[
                  { title: 'No Hidden Fees', desc: 'The price you see is the price you pay. Period.' },
                  { title: 'No Pressure', desc: 'Take your time. We\'re here to help, not push.' },
                  { title: 'Fair Trade-Ins', desc: 'Get top dollar for your current vehicle.' },
                  { title: 'Online Process', desc: 'Complete the whole process without leaving your couch.' },
                ].map(f => (
                  <div key={f.title} className={styles.featItem}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.ctaBox} style={{ alignSelf: 'start' }}>
              <h3>Ready to Buy Direct?</h3>
              <p>Browse our inventory online and contact us to get started. We make the process easy and transparent.</p>
              <Link href="/inventory" className={styles.ctaBoxBtn}>Browse Inventory</Link>
              <br /><br />
              <Link href="/financing" className={styles.ctaBoxBtn} style={{ background: 'transparent', border: '2px solid white', color: 'white' }}>Apply for Financing</Link>
            </div>
          </div>

          <div style={{ marginTop: '80px' }}>
            <div className="section-header">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">4 simple steps to your next car</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {steps.map(step => (
                <div key={step.num} style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <div style={{ fontSize: '48px', fontWeight: '900', color: '#e8e8e8', lineHeight: 1, marginBottom: '16px' }}>{step.num}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#24272c', marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

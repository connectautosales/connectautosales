import Link from 'next/link'
import styles from '../inner-page.module.css'

export const metadata = { title: 'Transportation - Connect Auto Sales' }

export default function TransportationPage() {
  return (
    <>
      <div className={styles.pageHero}>
        <div className="container">
          <h1 className={styles.pageHeroTitle}>Vehicle Transportation</h1>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link><span>â€º</span><span>Transportation</span>
          </div>
        </div>
      </div>

      <section className={styles.contentPage}>
        <div className="container">
          <div className={styles.contentGrid}>
            <div className={styles.contentText}>
              <h2>We Ship Nationwide</h2>
              <p>
                Can&apos;t make it to Dearborn Heights? No problem. Connect Auto Sales offers nationwide vehicle transportation so you can buy the car you want no matter where you are in the US.
              </p>
              <p>
                Our trusted transport partners handle your vehicle with care, ensuring it arrives safely and on time.
              </p>
              <div className={styles.featList}>
                {[
                  { title: 'Door-to-Door Delivery', desc: 'Your vehicle delivered right to your driveway.' },
                  { title: 'Insured Transport', desc: 'Full insurance coverage during transport.' },
                  { title: 'Real-Time Tracking', desc: 'Know exactly where your vehicle is at all times.' },
                  { title: 'Nationwide Coverage', desc: 'We ship to all 50 states.' },
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
              <h3>Get a Transport Quote</h3>
              <p>Contact us with your location and the vehicle you&apos;re interested in, and we&apos;ll provide a transportation quote.</p>
              <Link href="/contact" className={styles.ctaBoxBtn}>Request a Quote</Link>
              <br /><br />
              <Link href="/inventory" className={styles.ctaBoxBtn} style={{ background: 'transparent', border: '2px solid white', color: 'white' }}>Browse Inventory</Link>
            </div>
          </div>

          <div style={{ marginTop: '60px', background: '#f8f9fa', borderRadius: '12px', padding: '40px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#24272c', marginBottom: '16px' }}>How Transportation Works</h3>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Contact us about the vehicle you want to purchase.',
                'We provide a transportation quote based on your location.',
                'Complete your purchase and financing (if needed).',
                'Vehicle is picked up by our trusted transport partner.',
                'Real-time updates as your car makes its way to you.',
                'Vehicle arrives at your door â€” ready to drive!',
              ].map((step, i) => (
                <li key={i} style={{ fontSize: '15px', color: '#444', lineHeight: '1.6' }}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}

import Link from 'next/link'
import styles from './HomeIntro.module.css'

export default function HomeIntro() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <h2 className={styles.title}>USED CARS FOR SALE IN DEARBORN HEIGHTS, MI</h2>
            <div className={styles.line} />

            <p className={styles.body}>
              Connect Auto Sales is a family-owned dealership on S Beech Daly Street in
              Dearborn Heights, serving buyers across Dearborn, Detroit and the wider Metro
              Detroit area. We stock used cars, trucks, SUVs and minivans, most of them priced
              from around $4,000 to $17,000.
            </p>

            <p className={styles.body}>
              Every vehicle on our lot is inspected before it goes up for sale, and we show you
              the history up front. We carry both clean title and rebuilt title vehicles. The
              rebuilt ones are Michigan state certified, and we are happy to walk you through
              what that means and what it does not.
            </p>

            <h3 className={styles.sub}>Financing for every credit situation</h3>
            <p className={styles.body}>
              Bad credit, no credit, first-time buyer, or rebuilding after a rough patch, we
              have worked with all of it. Most buyers go through our outside lender network,
              and we offer{' '}
              <Link href="/buy-here-pay-here" className={styles.link}>in-house financing</Link>{' '}
              on select vehicles for qualified buyers. One phone call tells you where you
              stand, so you are not guessing before you drive out.
            </p>

            <h3 className={styles.sub}>More than just selling cars</h3>
            <p className={styles.body}>
              We also run{' '}
              <Link href="/salvage-inspections" className={styles.link}>Michigan salvage inspections</Link>,
              buy vehicles on your behalf at{' '}
              <Link href="/auction-services" className={styles.link}>IAAI, Copart and Manheim auctions</Link>,
              arrange{' '}
              <Link href="/transportation" className={styles.link}>nationwide transport</Link>, and offer{' '}
              <Link href="/warranty" className={styles.link}>extended warranty coverage</Link>{' '}
              through Cars Protection Plus and PWI.
            </p>
          </div>

          <aside className={styles.side}>
            <h3 className={styles.sideTitle}>Shop by what you need</h3>
            <div className={styles.chips}>
              <Link href="/body-type/suv" className={styles.chip}>SUVs</Link>
              <Link href="/body-type/sedan" className={styles.chip}>Sedans</Link>
              <Link href="/body-type/truck" className={styles.chip}>Trucks</Link>
              <Link href="/body-type/van" className={styles.chip}>Vans &amp; Minivans</Link>
              <Link href="/body-type/hatchback" className={styles.chip}>Hatchbacks</Link>
            </div>

            <div className={styles.divider} />

            <h3 className={styles.sideTitle}>Visit us</h3>
            <p className={styles.sideText}>
              4413 S Beech Daly St<br />
              Dearborn Heights, MI 48125
            </p>
            <p className={styles.sideText}>
              Mon&ndash;Fri: 10AM&ndash;6PM<br />
              Sat: 10AM&ndash;4PM<br />
              Sun: Closed
            </p>
            <a href="tel:3134133400" className={styles.callBtn}>CALL (313) 413-3400</a>
          </aside>
        </div>
      </div>
    </section>
  )
}

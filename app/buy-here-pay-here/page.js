import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'Buy Here Pay Here in Dearborn Heights, MI',
  description:
    'In-house financing available on select vehicles for qualified buyers at Connect Auto Sales in Dearborn Heights. We also work with outside lenders for all credit situations. Call (313) 413-3400.',
  alternates: { canonical: '/buy-here-pay-here' },
  openGraph: {
    url: '/buy-here-pay-here',
    title: 'Buy Here Pay Here in Dearborn Heights, MI | Connect Auto Sales',
    description:
      'In-house financing on select vehicles for qualified buyers, plus an outside lender network for all credit situations.',
  },
}

const steps = [
  {
    title: 'Tell us your situation',
    body: 'Call us or start an application online. We will ask about your income, how much you have to put down, and what you are looking for in a vehicle.',
  },
  {
    title: 'We find the right path',
    body: 'Most buyers go through our outside lender network, which often means better terms. For some buyers and some vehicles, in-house financing is the better fit. We will tell you honestly which one applies to you.',
  },
  {
    title: 'Pick your vehicle',
    body: 'Once we know your budget, we will show you what you can actually get approved on, instead of vehicles that waste your time.',
  },
  {
    title: 'Drive it home',
    body: 'Paperwork is handled in-house. Warranty options are available on most vehicles, including rebuilt titles.',
  },
]

const faqs = [
  {
    q: 'What is buy here pay here?',
    a: 'With buy here pay here, the dealership finances the vehicle directly instead of sending you to a bank or credit union. At Connect Auto Sales, in-house financing is available on select vehicles for qualified buyers, subject to down payment and approval.',
  },
  {
    q: 'Do you work with bad credit?',
    a: 'Yes. We work with buyers across all credit situations, including bad credit, no credit and first-time buyers. Many of them are approved through our outside lender network rather than in-house financing.',
  },
  {
    q: 'What do I need to bring?',
    a: 'A valid driver license, proof of income, proof of residence and proof of insurance. Call us first and we will confirm exactly what applies to your situation.',
  },
  {
    q: 'Can I get financing on a rebuilt title vehicle?',
    a: 'In many cases, yes. Rebuilt title vehicles in our inventory are Michigan state certified. Financing and warranty availability varies by vehicle and lender.',
  },
  {
    q: 'How do I find out what I qualify for?',
    a: 'Call (313) 413-3400 or submit a financing application. We will go through your options with you before you come in.',
  },
]

export default function BuyHerePayHerePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>BUY HERE PAY HERE IN DEARBORN HEIGHTS</h1>
          <p className={styles.heroSub}>
            In-house financing available on select vehicles for qualified buyers, subject to
            down payment and approval. Call us to see what you qualify for.
          </p>
          <div className={styles.heroActions}>
            <a href="tel:3134133400" className={styles.primaryBtn}>CALL (313) 413-3400</a>
            <Link href="/financing" className={styles.secondaryBtn}>START AN APPLICATION</Link>
          </div>
        </div>
      </section>

      <section className={styles.intro}>
        <div className="container">
          <div className={styles.introGrid}>
            <div>
              <h2 className={styles.sectionTitle}>HOW FINANCING WORKS HERE</h2>
              <div className={styles.titleLine} />
              <p className={styles.body}>
                Most buyers who walk through our door get financed through our outside lender
                network. That is usually the better deal, and it is where we start. For some
                buyers and some vehicles, in-house financing makes more sense, and we offer
                that on select vehicles for qualified buyers.
              </p>
              <p className={styles.body}>
                We are not going to pretend everyone qualifies for everything. Tell us your
                income and what you can put down, and we will tell you straight which vehicles
                are realistic for you. That saves you a trip and saves us both time.
              </p>
              <p className={styles.body}>
                We serve Dearborn Heights, Dearborn, Detroit and the surrounding Metro Detroit
                area, and we work with buyers who have bad credit, no credit history, or are
                buying their first vehicle.
              </p>
            </div>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>What to have ready</h3>
              <ul className={styles.checkList}>
                <li>Valid driver license</li>
                <li>Proof of income</li>
                <li>Proof of residence</li>
                <li>Proof of insurance</li>
                <li>Whatever you plan to put down</li>
              </ul>
              <p className={styles.sideNote}>
                Not sure if you have everything? Call first and we will tell you what applies to
                your situation before you drive out.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.steps}>
        <div className="container">
          <h2 className={styles.sectionTitle}>THE PROCESS</h2>
          <div className={styles.titleLine} />
          <div className={styles.stepGrid}>
            {steps.map((s, i) => (
              <div key={s.title} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>COMMON QUESTIONS</h2>
          <div className={styles.titleLine} />
          <div className={styles.faqList}>
            {faqs.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{f.q}</h3>
                <p className={styles.faqA}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>Find out what you qualify for</h2>
              <p className={styles.ctaText}>
                One phone call tells you more than an hour of guessing. We will go through your
                options before you come in.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a href="tel:3134133400" className={styles.primaryBtn}>CALL (313) 413-3400</a>
              <Link href="/inventory" className={styles.secondaryBtn}>BROWSE INVENTORY</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

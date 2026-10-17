import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { OG_IMAGE } from '@/lib/seo'
import SalvageClient from './SalvageClient'
import styles from './page.module.css'

const SITE = 'https://www.connectautosales.com'
const DEFAULT_FEES = { inspFeeA: 100, inspFeeB: 100, inspFeePaper: 50, inspFeeNote: '' }

// Read on the server so the fees, the FAQ answers and the structured data are
// all in the HTML Google crawls, not filled in after the page loads.
async function getFees() {
  try {
    const rows = await prisma.$queryRaw`SELECT inspFeeA, inspFeeB, inspFeePaper, inspFeeNote FROM sitesettings LIMIT 1`
    const r = rows[0] || {}
    return {
      inspFeeA: parseFloat(r.inspFeeA) || DEFAULT_FEES.inspFeeA,
      inspFeeB: parseFloat(r.inspFeeB) || DEFAULT_FEES.inspFeeB,
      inspFeePaper: parseFloat(r.inspFeePaper) || DEFAULT_FEES.inspFeePaper,
      inspFeeNote: r.inspFeeNote || '',
    }
  } catch {
    return DEFAULT_FEES
  }
}

const money = (n) => `$${n % 1 === 0 ? n : n.toFixed(2)}`
const totalOf = (f) => f.inspFeeA + f.inspFeeB + f.inspFeePaper

function buildFaqs(fees) {
  return [
    { q: 'Do I need an appointment?', a: 'Yes. An appointment is required. Please submit your documents through the website first. Connect Auto Sales will review your paperwork and contact you with an available inspection date and time.' },
    { q: 'What documents do I need?', a: 'You will need a salvage title, a valid ID, receipts for any replaced major parts, and the vehicle itself when you come for the inspection appointment.' },
    { q: 'What major parts require receipts?', a: 'Receipts are required for any major parts replaced during the repair process, including: Engine, Transmission or Transaxle, Frame, Passenger Vehicle Body or Truck Cab, Pickup Cargo Box, Hood, Front and Rear Bumpers, Front Fenders (Left and Right), Rear Quarter Panels (Left and Right), Doors (Left and Right), Deck Lid / Tailgate / Hatchback, and Trunk Floor Pan. Please upload receipts only for the parts that were actually replaced on your vehicle. Keep all other receipts in case the inspector requests additional documentation.' },
    { q: 'Can I bring my vehicle immediately after uploading documents?', a: 'No. Please wait until Connect Auto Sales contacts you with an approved inspection date and time before bringing your vehicle.' },
    { q: 'How much does a salvage inspection cost?', a: `${money(totalOf(fees))} in total for a standard passenger vehicle: ${money(fees.inspFeeA)} for the mechanic inspection, ${money(fees.inspFeeB)} for the salvage vehicle inspection and ${money(fees.inspFeePaper)} for paperwork processing. Motorcycle and trailer fees may vary.` },
    { q: 'How long does the inspection take?', a: 'Most inspections take approximately 15 to 30 minutes once all paperwork has been reviewed and the appointment has been scheduled.' },
    { q: 'Can you inspect out-of-state salvage vehicles?', a: 'Yes. We can perform salvage vehicle inspections for out-of-state vehicles. Please submit your paperwork and our team will review the documentation and guide you through the process.' },
    { q: 'What happens after the inspection?', a: 'Once the inspection is completed, we will provide the necessary paperwork required to continue the rebuilt title process with the State of Michigan.' },
  ]
}

export async function generateMetadata() {
  const fees = await getFees()
  const description = `State-certified Michigan salvage vehicle inspections in Dearborn Heights. ${money(totalOf(fees))} covers the mechanic inspection, salvage inspection and paperwork for your rebuilt title.`
  return {
    title: 'Michigan Salvage Vehicle Inspection in Dearborn Heights',
    description,
    alternates: { canonical: '/salvage-inspections' },
    openGraph: {
      images: [OG_IMAGE],
      url: '/salvage-inspections',
      title: 'Michigan Salvage Vehicle Inspection | Connect Auto Sales',
      description,
    },
  }
}

export default async function SalvageInspectionsPage() {
  const fees = await getFees()
  const faqs = buildFaqs(fees)
  const total = totalOf(fees)

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Michigan Salvage Vehicle Inspection',
      serviceType: 'Salvage vehicle inspection',
      url: `${SITE}/salvage-inspections`,
      provider: { '@id': `${SITE}/#dealer` },
      areaServed: { '@type': 'State', name: 'Michigan' },
      offers: {
        '@type': 'Offer',
        price: total,
        priceCurrency: 'USD',
        description: 'Mechanic inspection, salvage vehicle inspection and paperwork processing for a standard passenger vehicle',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SalvageClient initialFees={fees} faqs={faqs}>
        <section className={styles.aboutSection}>
          <div className="container">
            <div className={styles.aboutInner}>
              <h2 className={styles.aboutTitle}>Michigan Salvage Vehicle Inspections in Dearborn Heights</h2>
              <div className={styles.colLine} />
              <p>
                If your vehicle has a Michigan salvage title, it has to pass a salvage vehicle
                inspection before the state will issue a rebuilt title and you can register and
                drive it again. Connect Auto Sales handles that inspection at our location on
                S Beech Daly Street in Dearborn Heights, for drivers from Dearborn, Detroit,
                Taylor, Westland, Inkster and across Metro Detroit.
              </p>

              <h3 className={styles.aboutSub}>What the inspection checks</h3>
              <p>
                The inspector verifies the vehicle identification number and checks that every
                replaced major part is backed by a receipt, which shows the vehicle was not rebuilt
                with stolen parts. That is why we ask for your salvage title, your ID and receipts
                for any replaced major parts before we schedule you, so the inspection itself
                usually takes only 15 to 30 minutes.
              </p>

              <h3 className={styles.aboutSub}>Both inspections and the paperwork in one visit</h3>
              <p>
                Our {money(total)} fee for a standard passenger vehicle covers the mechanic
                inspection, the salvage vehicle inspection and the paperwork processing. When the
                inspection is complete, you leave with the paperwork you need to apply for your
                rebuilt title with the Michigan Secretary of State. We also inspect out-of-state
                salvage vehicles.
              </p>

              <h3 className={styles.aboutSub}>How to get started</h3>
              <p>
                Upload your salvage title, ID and parts receipts with the form above. We review
                them and call you with an inspection date and time. Please do not bring the
                vehicle until we confirm your appointment. Questions? Call us at{' '}
                <a href="tel:3134133400">(313) 413-3400</a>.
              </p>

              <p className={styles.aboutLinks}>
                Buying a rebuilt vehicle instead? Read{' '}
                <Link href="/rebuilt-title">what a rebuilt title means in Michigan</Link> or{' '}
                <Link href="/inventory">browse our inventory</Link>.
              </p>
            </div>
          </div>
        </section>
      </SalvageClient>
    </>
  )
}

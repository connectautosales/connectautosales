'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cars } from '@/data/cars'
import styles from './page.module.css'

export default function VehicleDetailPage({ params }) {
  const [car, setCar] = useState(null)
  const [copied, setCopied] = useState(false)
  const [downPayment, setDownPayment] = useState(3000)
  const [term, setTerm] = useState(60)
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    const id = parseInt(params.id)
    const found = cars.find(c => c.id === id)
    setCar(found || null)
  }, [params.id])

  if (!car) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 18, color: '#6b7280' }}>Vehicle not found.</p>
        <Link href="/inventory" style={{ color: '#e10001', fontWeight: 700 }}>← Back to Inventory</Link>
      </div>
    )
  }

  const photos = [car.image]
  const totalPhotos = photos.length

  const loanAmount = car.price - downPayment
  const monthlyRate = 0.0699 / 12
  const payment = loanAmount > 0
    ? Math.round(loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1))
    : 0

  const isRebuilt = car.titleType === 'rebuilt'

  const similar = cars.filter(c => c.id !== car.id && (c.type === car.type || c.make === car.make)).slice(0, 4)

  const handleCopyVin = () => {
    navigator.clipboard.writeText(car.vin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const prevPhoto = () => setPhotoIndex(i => (i - 1 + totalPhotos) % totalPhotos)
  const nextPhoto = () => setPhotoIndex(i => (i + 1) % totalPhotos)

  const featuresLeft = car.features.slice(0, Math.ceil(car.features.length / 2))
  const featuresRight = car.features.slice(Math.ceil(car.features.length / 2))

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbBar}>
        <div className="container">
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.sep}>›</span>
            <Link href="/inventory">Inventory</Link>
            <span className={styles.sep}>›</span>
            <span>{car.year} {car.make} {car.model}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainSection}>
        <div className="container">
          <div className={styles.layout}>

            {/* LEFT COLUMN */}
            <div className={styles.left}>

              {/* Title & Badge */}
              <div className={styles.titleRow}>
                <h1 className={styles.vehicleTitle}>{car.year} {car.make} {car.model}</h1>
                {isRebuilt ? (
                  <span className={styles.badgeRebuilt}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                    Rebuilt Title
                  </span>
                ) : (
                  <span className={styles.badgeClean}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Clean Title
                  </span>
                )}
              </div>

              {/* Specs Chips */}
              <div className={styles.specs}>
                <span className={styles.chip}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {car.mileage.toLocaleString()} Miles
                </span>
                <span className={styles.chipDot}>•</span>
                <span className={styles.chip}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  {car.drivetrain}
                </span>
                <span className={styles.chipDot}>•</span>
                <span className={styles.chip}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  {car.transmission}
                </span>
                <span className={styles.chipDot}>•</span>
                <span className={styles.chip}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V8l9-6 9 6v14"/><path d="M3 22h18"/><path d="M12 22V12"/></svg>
                  {car.fuel}
                </span>
              </div>

              {/* VIN Bar */}
              <div className={styles.vinBar}>
                <span className={styles.vinLabel}>VIN:</span>
                <span className={styles.vinNum}>{car.vin}</span>
                <button className={styles.copyBtn} onClick={handleCopyVin} title="Copy VIN">
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  )}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Photo Gallery */}
              <div className={styles.gallery}>
                <div className={styles.mainPhoto}>
                  <Image
                    src={car.image}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  <button className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`} onClick={prevPhoto}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button className={`${styles.galleryArrow} ${styles.galleryArrowRight}`} onClick={nextPhoto}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                  <div className={styles.photoCounter}>{photoIndex + 1} of {totalPhotos}</div>
                </div>

                {/* Photo label */}
                <div className={styles.photoLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  Photos Available
                </div>

                {/* Thumbnails */}
                <div className={styles.thumbStrip}>
                  {[...Array(Math.min(5, totalPhotos))].map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.thumb} ${photoIndex === i ? styles.thumbActive : ''}`}
                      onClick={() => setPhotoIndex(i)}
                    >
                      <Image src={car.image} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                    </button>
                  ))}
                </div>
              </div>

              {/* Badges Row */}
              <div className={styles.badgesRow}>
                <div className={styles.badge}>
                  {isRebuilt ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e10001"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                  <span>{isRebuilt ? 'Rebuilt Title' : 'Clean Title'}</span>
                </div>
                <div className={styles.badge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Inspected</span>
                </div>
                <div className={styles.badge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <span>Financing Available</span>
                </div>
                <div className={styles.badge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Warranty Available</span>
                </div>
              </div>

              {/* Description */}
              <div className={styles.descSection}>
                <h2 className={styles.sectionTitle}>Vehicle Description</h2>
                <div className={styles.sectionLine} />
                <p className={styles.description}>{car.description}</p>
              </div>

              {/* Features */}
              <div className={styles.featuresSection}>
                <h2 className={styles.sectionTitle}>Features &amp; Options</h2>
                <div className={styles.sectionLine} />
                <div className={styles.featuresGrid}>
                  <ul className={styles.featuresList}>
                    {featuresLeft.map((f, i) => (
                      <li key={i} className={styles.featureItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ul className={styles.featuresList}>
                    {featuresRight.map((f, i) => (
                      <li key={i} className={styles.featureItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className={styles.ctaRow}>
                <a href="tel:3134133400" className={styles.ctaCall}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.55 5.55l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  CALL (313) 413-3400
                </a>
                <a href="sms:3134133400" className={styles.ctaText}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  TEXT US
                </a>
                <Link href="/contact" className={styles.ctaSchedule}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  SCHEDULE A TEST DRIVE
                </Link>
              </div>

              {/* Similar Vehicles */}
              {similar.length > 0 && (
                <div className={styles.similarSection}>
                  <div className={styles.similarHeader}>
                    <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Similar Vehicles</h2>
                    <Link href="/inventory" className={styles.seeAll}>
                      View All
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  </div>
                  <div className={styles.sectionLine} />
                  <div className={styles.similarGrid}>
                    {similar.map(s => (
                      <Link key={s.id} href={`/inventory/${s.id}`} className={styles.similarCard}>
                        <div className={styles.similarImg}>
                          <Image src={s.image} alt={`${s.year} ${s.make} ${s.model}`} fill style={{ objectFit: 'cover' }} unoptimized />
                          <span className={s.titleType === 'rebuilt' ? styles.simBadgeRebuilt : styles.simBadgeClean}>
                            {s.titleType === 'rebuilt' ? 'Rebuilt' : 'Clean'}
                          </span>
                        </div>
                        <div className={styles.similarInfo}>
                          <p className={styles.similarName}>{s.year} {s.make} {s.model}</p>
                          <p className={styles.similarMeta}>{s.mileage.toLocaleString()} mi · {s.transmission}</p>
                          <p className={styles.similarPrice}>${s.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>

                {/* Great Price */}
                <div className={styles.priceBadgeRow}>
                  <span className={styles.greatPriceBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Great Price
                  </span>
                  <span className={styles.belowMarket}>Below market average</span>
                  <button className={styles.infoBtn} title="About this price">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </button>
                </div>

                <div className={styles.priceDivider} />

                {/* Cash Price */}
                <div className={styles.priceBlock}>
                  <p className={styles.priceTypeLabel}>Cash Price</p>
                  <p className={styles.cashPrice}>${car.price.toLocaleString()}*</p>
                  <p className={styles.priceNote}>* while pricing is in full</p>
                  <p className={styles.priceDisclaimer}>Taxes, title and registration fees are additional.</p>
                </div>

                <div className={styles.priceDivider} />

                {/* Financing Price */}
                <div className={styles.priceBlock}>
                  <p className={styles.priceTypeLabel}>Financing Price</p>
                  <p className={styles.financePrice}>${car.financingPrice.toLocaleString()}*</p>
                  <p className={styles.priceNote}>* Subject to credit approval</p>
                </div>

                <div className={styles.priceDivider} />

                {/* Payment Estimator */}
                <div className={styles.estimatorBlock}>
                  <p className={styles.estimatorTitle}>Estimate Your Payment</p>
                  <Link href="/financing" className={styles.customizeLink}>
                    Customize your payment ›
                  </Link>

                  <div className={styles.estimatorRow}>
                    <div className={styles.estimatorField}>
                      <label className={styles.estimatorLabel}>Down Payment</label>
                      <div className={styles.inputWithPrefix}>
                        <span className={styles.prefix}>$</span>
                        <input
                          type="number"
                          className={styles.estimatorInput}
                          value={downPayment}
                          min={0}
                          max={car.price}
                          onChange={e => setDownPayment(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className={styles.estimatorField}>
                      <label className={styles.estimatorLabel}>Term</label>
                      <select
                        className={styles.estimatorSelect}
                        value={term}
                        onChange={e => setTerm(Number(e.target.value))}
                      >
                        <option value={24}>24 Months</option>
                        <option value={36}>36 Months</option>
                        <option value={48}>48 Months</option>
                        <option value={60}>60 Months</option>
                        <option value={72}>72 Months</option>
                        <option value={84}>84 Months</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.monthlyRow}>
                    <span className={styles.monthlyLabel}>Estimated Payment</span>
                    <span className={styles.monthlyValue}>${payment.toLocaleString()} /mo*</span>
                  </div>
                  <p className={styles.priceNote} style={{ marginTop: 4, marginBottom: 0 }}>* Subject to credit approval</p>
                </div>

                <Link href="/financing" className={styles.applyBtn}>
                  APPLY FOR FINANCING ›
                </Link>

                {/* Previous Damage Photos (Rebuilt only) */}
                {isRebuilt && car.damagePhotos && (
                  <>
                    <div className={styles.priceDivider} />
                    <div className={styles.damageSection}>
                      <div className={styles.damageHeader}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <h3 className={styles.damageTitle}>Previous Damage Photos</h3>
                      </div>
                      <p className={styles.damageNote}>Photos show the vehicle before repairs.</p>
                      <div className={styles.damageGrid}>
                        {car.damagePhotos.slice(0, 4).map((photo, i) => (
                          <div key={i} className={styles.damagePhoto}>
                            <Image src={photo} alt={`Damage photo ${i + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                          </div>
                        ))}
                      </div>
                      <p className={styles.damageCaption}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Rebuilt Title – Vehicle repaired and passed inspection.
                      </p>
                    </div>
                  </>
                )}

                {/* Contact Quick */}
                <div className={styles.contactQuick}>
                  <a href="tel:3134133400" className={styles.quickCall}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.55 5.55l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    (313) 413-3400
                  </a>
                  <a href="sms:3134133400" className={styles.quickText}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Text Us
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

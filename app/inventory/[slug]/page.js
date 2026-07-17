'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSettings } from '@/context/SettingsContext'
import styles from './page.module.css'
import TestDriveModal from '@/app/components/TestDriveModal'

function parseImages(val) {
  if (!val) return []
  try {
    const arr = JSON.parse(val)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

export default function VehicleDetailPage({ params }) {
  const s = useSettings()
  const phone = s.phone || '3134133400'
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [downPayment, setDownPayment] = useState(3000)
  const [term, setTerm] = useState(60)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [testDriveOpen, setTestDriveOpen] = useState(false)
  const thumbStripRef = useRef(null)

  useEffect(() => {
    Promise.resolve(params).then(p => {
      fetch(`/api/cars/${p.slug}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { setCar(data); setLoading(false) })
        .catch(() => setLoading(false))
    })
  }, [params])

  useEffect(() => {
    if (!thumbStripRef.current) return
    const strip = thumbStripRef.current
    const activeThumb = strip.children[photoIndex]
    if (!activeThumb) return
    const thumbLeft = activeThumb.offsetLeft
    const thumbRight = thumbLeft + activeThumb.offsetWidth
    const stripLeft = strip.scrollLeft
    const stripRight = stripLeft + strip.clientWidth
    if (thumbLeft < stripLeft) {
      strip.scrollTo({ left: thumbLeft - 8, behavior: 'smooth' })
    } else if (thumbRight > stripRight) {
      strip.scrollTo({ left: thumbRight - strip.clientWidth + 8, behavior: 'smooth' })
    }
  }, [photoIndex])

  if (loading) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 18, color: '#6b7280' }}>Loading...</p>
      </div>
    )
  }

  if (!car) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 18, color: '#6b7280' }}>Vehicle not found.</p>
        <Link href="/inventory" style={{ color: '#e50202', fontWeight: 700 }}>← Back to Inventory</Link>
      </div>
    )
  }

  const photos = parseImages(car.images)
  if (photos.length === 0 && car.image) photos.push(car.image)
  const totalPhotos = photos.length || 1

  const damagePhotos = parseImages(car.damageImages)

  const apr = parseFloat(s.defaultApr) || 6.99
  const loanAmount = (car.price || 0) - downPayment
  const monthlyRate = (apr / 100) / 12
  const payment = loanAmount > 0
    ? Math.round(loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1))
    : 0

  const isRebuilt = car.titleType === 'rebuilt'

  const handleCopyVin = () => {
    if (!car.vin) return
    navigator.clipboard.writeText(car.vin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const prevPhoto = () => setPhotoIndex(i => (i - 1 + totalPhotos) % totalPhotos)
  const nextPhoto = () => setPhotoIndex(i => (i + 1) % totalPhotos)

  const currentPhoto = photos[photoIndex]

  return (
    <>
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
                <h1 className={styles.vehicleTitle}>{car.year} {car.make} {car.model} {car.trim || ''}</h1>
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
                  {(car.mileage || 0).toLocaleString()} Miles
                </span>
                {car.drivetrain && <><span className={styles.chipDot}>•</span><span className={styles.chip}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>{car.drivetrain}</span></>}
                {car.transmission && <><span className={styles.chipDot}>•</span><span className={styles.chip}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>{car.transmission}</span></>}
                {car.fuelType && <><span className={styles.chipDot}>•</span><span className={styles.chip}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V8l9-6 9 6v14"/><path d="M3 22h18"/><path d="M12 22V12"/></svg>{car.fuelType}</span></>}
              </div>

              {/* VIN Bar */}
              {car.vin && (
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
              )}

              {/* Photo Gallery */}
              <div className={styles.gallery}>
                <div className={styles.mainPhoto}>
                  {currentPhoto ? (
                    <Image
                      src={currentPhoto}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                    </div>
                  )}
                  {totalPhotos > 1 && (
                    <>
                      <button className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`} onClick={prevPhoto}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <button className={`${styles.galleryArrow} ${styles.galleryArrowRight}`} onClick={nextPhoto}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </>
                  )}
                  <div className={styles.photoCounter}>{photoIndex + 1} of {totalPhotos}</div>
                </div>

                <div className={styles.photoLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  {totalPhotos} Photo{totalPhotos !== 1 ? 's' : ''} Available
                </div>

                {/* Thumbnails */}
                {totalPhotos > 1 && (
                  <div className={styles.thumbWrapper}>
                    <button className={styles.thumbNav} onClick={() => setPhotoIndex(i => (i - 1 + totalPhotos) % totalPhotos)}>&#8249;</button>
                    <div className={styles.thumbStrip} ref={thumbStripRef}>
                      {photos.map((src, i) => (
                        <button
                          key={i}
                          className={`${styles.thumb} ${photoIndex === i ? styles.thumbActive : ''}`}
                          onClick={() => setPhotoIndex(i)}
                        >
                          <Image src={src} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                        </button>
                      ))}
                    </div>
                    <button className={styles.thumbNav} onClick={() => setPhotoIndex(i => (i + 1) % totalPhotos)}>&#8250;</button>
                  </div>
                )}
              </div>

              {/* Badges Row */}
              <div className={styles.badgesRow}>
                <div className={styles.badge}>
                  {isRebuilt ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e50202"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                  <span>{isRebuilt ? 'Rebuilt Title' : 'Clean Title'}</span>
                </div>
                <div className={styles.badge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Inspected</span>
                </div>
                <div className={styles.badge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <span>Financing Available</span>
                </div>
                <div className={styles.badge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Warranty Available</span>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div className={styles.descSection}>
                  <h2 className={styles.sectionTitle}>Vehicle Description</h2>
                  <div className={styles.sectionLine} />
                  <p className={styles.description}>{car.description}</p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className={styles.ctaRow}>
                <a href={`tel:${phone}`} className={styles.ctaCall}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.55 5.55l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  CALL (313) 413-3400
                </a>
                <a href={`sms:${phone}`} className={styles.ctaText}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  TEXT US
                </a>
                <button onClick={() => setTestDriveOpen(true)} className={styles.ctaSchedule}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  SCHEDULE A TEST DRIVE
                </button>
              </div>

              {/* Damage Photos (Rebuilt) */}
              {isRebuilt && damagePhotos.length > 0 && (
                <div className={styles.descSection}>
                  <h2 className={styles.sectionTitle}>Previous Damage Photos</h2>
                  <div className={styles.sectionLine} />
                  <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Photos show the vehicle before repairs.</p>
                  <div className={styles.damageGrid}>
                    {damagePhotos.map((photo, i) => (
                      <div key={i} className={styles.damagePhoto}>
                        <Image src={photo} alt={`Damage photo ${i + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>

                <div className={styles.priceBadgeRow}>
                  <span className={styles.greatPriceBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Great Price
                  </span>
                  <span className={styles.belowMarket}>Below market average</span>
                </div>

                <div className={styles.priceDivider} />

                <div className={styles.priceBlock}>
                  <p className={styles.priceTypeLabel}>Asking Price</p>
                  <p className={styles.cashPrice}>
                    {car.price ? `$${car.price.toLocaleString()}*` : 'Call for Price'}
                  </p>
                  {car.price > 0 && <p className={styles.priceNote}>* while pricing is in full</p>}
                  <p className={styles.priceDisclaimer}>Taxes, title and registration fees are additional.</p>
                </div>

                {car.price > 0 && (
                  <>
                    <div className={styles.priceDivider} />
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
                      <p className={styles.priceNote} style={{ marginTop: 4, marginBottom: 0 }}>* Based on {apr}% APR. Subject to credit approval.</p>
                    </div>

                    <Link href="/financing" className={styles.applyBtn}>
                      APPLY FOR FINANCING ›
                    </Link>
                  </>
                )}

                {/* Contact Quick */}
                <div className={styles.contactQuick}>
                  <a href={`tel:${phone}`} className={styles.quickCall}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.55 5.55l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    (313) 413-3400
                  </a>
                  <a href={`sms:${phone}`} className={styles.quickText}>
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

    <TestDriveModal
      isOpen={testDriveOpen}
      onClose={() => setTestDriveOpen(false)}
      vehicle={car ? `${car.year} ${car.make} ${car.model}${car.trim ? ' ' + car.trim : ''}` : ''}
    />
    </>
  )
}

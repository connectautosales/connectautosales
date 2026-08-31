'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useSettings } from '@/context/SettingsContext'
import { useState, useEffect } from 'react'
import styles from './Footer.module.css'

const quickLinks = [
  { label: 'Home',                href: '/' },
  { label: 'Inventory',           href: '/inventory' },
  { label: 'Financing',           href: '/financing' },
  { label: 'Warranty',            href: '/warranty' },
  { label: 'Auction Services',    href: '/auction-services' },
  { label: 'Salvage Inspections', href: '/salvage-inspections' },
  { label: 'Buy Direct',          href: '/buy-direct' },
  { label: 'Transportation',      href: '/transportation' },
  { label: 'Contact',             href: '/contact' },
]

export default function Footer() {
  const s = useSettings()
  const phoneHref    = `tel:${s.phone?.replace(/\D/g, '')}`
  const phoneDisplay = s.phone ? s.phone.replace(/\D/g, '').replace(/^1?(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3') : ''
  const mapHref      = s.mapLink || `https://maps.google.com/?q=${encodeURIComponent(`${s.address} ${s.city} ${s.state} ${s.zip}`)}`
  const year         = new Date().getFullYear()

  const [googleRating, setGoogleRating] = useState(null)
  const [googleCount, setGoogleCount]   = useState(null)
  useEffect(() => {
    fetch('/api/reviews', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d.rating) setGoogleRating(d.rating)
        if (d.count)  setGoogleCount(d.count)
      })
      .catch(() => {})
  }, [])

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>

          {/* Col 1 — Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logoWrap}>
              <Image
                src={s.logoUrl || '/images/logo.png'}
                alt={s.businessName}
                width={150}
                height={54}
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', width: 'auto', height: '54px' }}
                unoptimized
              />
            </Link>
            <p className={styles.brandDesc}>
              {s.tagline || 'Quality pre-owned vehicles with financing and warranty options available.'}
            </p>
          </div>

          {/* Col 2 — Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {quickLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.link}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact Info */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact Info</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={styles.contactIcon}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <a href={mapHref} target="_blank" rel="noreferrer" className={styles.contactLink}>
                  {s.address},<br/>{s.city}, {s.state} {s.zip}
                </a>
              </li>
              <li className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={styles.contactIcon}>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <a href={phoneHref} className={styles.contactLink} onClick={() => { if (typeof fbq !== 'undefined') fbq('track', 'Contact') }}>{phoneDisplay}</a>
              </li>
              {s.email && (
                <li className={styles.contactItem}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={styles.contactIcon}>
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href={`mailto:${s.email}`} className={styles.contactLink} onClick={() => { if (typeof fbq !== 'undefined') fbq('track', 'Contact') }}>{s.email}</a>
                </li>
              )}
              <li className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={styles.contactIcon}>
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                </svg>
                <span>Mon–Fri: {s.hoursMF}<br/>Sat: {s.hoursSat}<br/>Sun: {s.hoursSun}</span>
              </li>
            </ul>
          </div>

          {/* Col 4 — Follow Us */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Follow Us</h4>
            <div className={styles.socialRow}>
              {s.facebook && (
                <a href={s.facebook} target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#1877F2'}} aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
              )}
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285AEB 90%)'}} aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              )}
              {s.tiktok && (
                <a href={s.tiktok} target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#010101',border:'1px solid rgba(255,255,255,0.15)'}} aria-label="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
                </a>
              )}
              {s.youtube && (
                <a href={s.youtube} target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#FF0000'}} aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>
                </a>
              )}
            </div>
          </div>

        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© {year} {s.businessName}. All Rights Reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/about" className={styles.bottomLink}>About Us</Link>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

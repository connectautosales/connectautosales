'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSettings } from '@/context/SettingsContext'
import styles from './Header.module.css'

const navItems = [
  { label: 'Home',                href: '/' },
  { label: 'Inventory',           href: '/inventory' },
  { label: 'Financing',           href: '/financing' },
  { label: 'Warranty',            href: '/warranty' },
  { label: 'Auction Services',    href: '/auction-services' },
  { label: 'Salvage Inspections', href: '/salvage-inspections' },
  { label: 'Contact',             href: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const s = useSettings()

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const phoneHref = `tel:${s.phone?.replace(/\D/g, '')}`
  const smsHref   = `sms:${s.phone?.replace(/\D/g, '')}`
  const phoneDisplay = s.phone
    ? s.phone.replace(/\D/g, '').replace(/^1?(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
    : ''
  const mapHref = s.mapLink || `https://maps.google.com/?q=${encodeURIComponent(`${s.address} ${s.city} ${s.state} ${s.zip}`)}`

  return (
    <header className={styles.header}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.topBarLeft}>
            <a href={mapHref} target="_blank" rel="noreferrer" className={styles.topBarItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {s.address}, {s.city}, {s.state} {s.zip}
            </a>

            <a href={phoneHref} className={styles.topBarItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {phoneDisplay}
            </a>

            <span className={styles.topBarItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              Mon–Fri: {s.hoursMF}&nbsp;|&nbsp;Sat: {s.hoursSat}&nbsp;|&nbsp;Sun: {s.hoursSun}
            </span>
          </div>

          <div className={styles.topBarRight}>
            {s.facebook && (
              <a href={s.facebook} target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#1877F2'}} aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            )}
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285AEB 90%)'}} aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            )}
            {s.tiktok && (
              <a href={s.tiktok} target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#010101',border:'1px solid rgba(255,255,255,0.15)'}} aria-label="TikTok">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
              </a>
            )}
            {s.youtube && (
              <a href={s.youtube} target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#FF0000'}} aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <nav className={styles.mainNav}>
        <div className={`container ${styles.mainNavInner}`}>
          <Link href="/" className={styles.logo}>
            <Image
              src={s.logoUrl || '/images/logo.png'}
              alt={s.businessName}
              width={150}
              height={56}
              className={styles.logoImg}
              priority
              unoptimized
            />
          </Link>

          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className={styles.navCtas}>
            <a href={phoneHref} className={styles.btnCall}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              Call Us
            </a>
            <a href={smsHref} className={styles.btnText}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>
              Text Us
            </a>
          </div>

          <button className={styles.mobileMenuBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className={styles.mobileMenu}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.mobileActive : ''}`}
                onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className={styles.mobileCtas}>
              <a href={phoneHref} className={styles.mobileBtnCall} onClick={() => setMenuOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Call Us
              </a>
              <a href={smsHref} className={styles.mobileBtnText} onClick={() => setMenuOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>
                Text Us
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

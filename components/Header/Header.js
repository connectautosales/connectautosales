'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
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

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className={styles.header}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.topBarLeft}>
            {/* Address */}
            <a
              href="https://maps.google.com/?q=4413+S+Beech+Daly+St+Dearborn+Heights+MI+48125"
              target="_blank"
              rel="noreferrer"
              className={styles.topBarItem}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              4413 S Beech Daly St, Dearborn Heights, MI 48125
            </a>

            {/* Phone */}
            <a href="tel:3134133400" className={styles.topBarItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              (313) 413-3400
            </a>

            {/* Hours */}
            <span className={styles.topBarItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              Mon–Fri: 10AM–6PM &nbsp;|&nbsp; Sat: 10AM–4PM &nbsp;|&nbsp; Sun: Closed
            </span>
          </div>

          <div className={styles.topBarRight}>
            <a href="https://facebook.com/connectautosales" target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a href="https://instagram.com/connectautosales" target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@connectautosales" target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="TikTok">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <nav className={styles.mainNav}>
        <div className={`container ${styles.mainNavInner}`}>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image
              src="https://connectautosales.com/wp-content/uploads/2025/01/cas-logo.jpeg"
              alt="Connect Auto Sales"
              width={150}
              height={56}
              className={styles.logoImg}
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
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

          {/* CTA Buttons */}
          <div className={styles.navCtas}>
            <a href="tel:3134133400" className={styles.btnCall}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Call Us
            </a>
            <a href="sms:3134133400" className={styles.btnText}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
              </svg>
              Text Us
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="7" x2="21" y2="7"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="17" x2="21" y2="17"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.mobileActive : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className={styles.mobileCtas}>
              <a href="tel:3134133400" className={styles.mobileBtnCall} onClick={() => setMenuOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call Us
              </a>
              <a href="sms:3134133400" className={styles.mobileBtnText} onClick={() => setMenuOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
                </svg>
                Text Us
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

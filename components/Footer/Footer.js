import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

const quickLinks = [
  { label: 'Home',      href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Financing', href: '/financing' },
  { label: 'Warranty',  href: '/warranty' },
]

const serviceLinks = [
  { label: 'Auction Services',    href: '/auction-services',    red: true },
  { label: 'Salvage Inspections', href: '/salvage-inspections', red: false },
  { label: 'Buy Direct',          href: '/buy-direct',          red: false },
  { label: 'Transportation',      href: '/transportation',      red: false },
  { label: 'Contact',             href: '/contact',             red: false },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>

          {/* Col 1 — Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logoWrap}>
              <Image
                src="https://connectautosales.com/wp-content/uploads/2025/01/foo_logo-1.png"
                alt="Connect Auto Sales"
                width={150}
                height={54}
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', width: 'auto', height: '54px' }}
                unoptimized
              />
            </Link>
            <p className={styles.brandDesc}>
              Quality pre-owned vehicles with financing and warranty options available.
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
              {serviceLinks.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`${styles.link} ${l.red ? styles.linkRed : ''}`}
                  >
                    {l.label}
                  </Link>
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
                <a
                  href="https://maps.google.com/?q=4413+S+Beech+Daly+St+Dearborn+Heights+MI+48125"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.contactLink}
                >
                  4413 S Beech Daly St,<br/>Dearborn Heights, MI 48125
                </a>
              </li>
              <li className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={styles.contactIcon}>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <a href="tel:3134133400" className={styles.contactLink}>(313) 413-3400</a>
              </li>
              <li className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={styles.contactIcon}>
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                </svg>
                <span>Mon–Fri: 10:00 AM – 6:00 PM<br/>Sat: 10:00 AM – 4:00 PM<br/>Sun: Closed</span>
              </li>
              <li className={styles.contactItem}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={styles.contactIcon}>
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a href="mailto:sales@connectautosales.com" className={styles.contactLink}>
                  sales@connectautosales.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 — Follow Us */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Follow Us</h4>
            <div className={styles.socialRow}>
              {/* Facebook */}
              <a href="https://facebook.com/connectautosales" target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#1877F2'}} aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/connectautosales" target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285AEB 90%)'}} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com/@connectautosales" target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#010101',border:'1px solid rgba(255,255,255,0.15)'}} aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@connectautosales" target="_blank" rel="noreferrer" className={styles.socialIcon} style={{background:'#FF0000'}} aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© 2026 Connect Auto Sales. All Rights Reserved.</p>
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

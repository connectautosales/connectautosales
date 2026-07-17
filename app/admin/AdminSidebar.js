'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useSettings } from '@/context/SettingsContext'
import styles from './AdminSidebar.module.css'

const nav = [
  { href: '/admin',              label: 'Dashboard',         icon: 'fa-solid fa-gauge-high' },
  { href: '/admin/inventory',    label: 'Inventory',         icon: 'fa-solid fa-car' },
  { href: '/admin/financing',    label: 'Financing Apps',    icon: 'fa-solid fa-file-invoice-dollar' },
  { href: '/admin/auction',      label: 'Auction Requests',  icon: 'fa-solid fa-gavel' },
  { href: '/admin/inspections',  label: 'Salvage Inspections', icon: 'fa-solid fa-magnifying-glass' },
  { href: '/admin/test-drives',  label: 'Test Drives',       icon: 'fa-solid fa-car-side' },
  { href: '/admin/contacts',     label: 'Contact Messages',  icon: 'fa-solid fa-envelope' },
  { href: '/admin/transport',    label: 'Transport Quotes',  icon: 'fa-solid fa-truck' },
  { href: '/admin/visitors',     label: 'Visitors',          icon: 'fa-solid fa-chart-bar' },
  { href: '/admin/settings',     label: 'Website Settings',  icon: 'fa-solid fa-gear' },
]

export default function AdminSidebar() {
  const pathname  = usePathname()
  const { logoUrl } = useSettings()

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoWrap}>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Connect Auto Sales"
            width={160}
            height={60}
            style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: 56, maxWidth: 180, filter: 'brightness(0) invert(1)' }}
            unoptimized
          />
        ) : (
          <div className={styles.brandText}>
            <span className={styles.brandName}>CONNECT AUTO</span>
            <span className={styles.brandSub}>SALES <span className={styles.brandDot}>●</span> ADMIN</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className={styles.navSection}>
        <p className={styles.navLabel}>MAIN MENU</p>
        <nav className={styles.nav}>
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
            >
              <span className={styles.iconWrap}>
                <i className={item.icon} />
              </span>
              <span>{item.label}</span>
              {isActive(item.href) && <span className={styles.activeDot} />}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.divider} />
        <a href="/" target="_blank" className={styles.viewSiteBtn}>
          <i className="fa-solid fa-arrow-up-right-from-square" />
          <span>View Website</span>
        </a>
        <button
          className={styles.signOut}
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <i className="fa-solid fa-right-from-bracket" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from './page.module.css'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const [cars, financing, auction, inspections, contacts, transport] = await Promise.all([
    prisma.car.count(),
    prisma.financingApplication.count(),
    prisma.auctionRequest.count(),
    prisma.salvageInspection.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.transportRequest.count(),
  ])

  const [newFinancing, newAuction, newInspections, soldCars, activeCars] = await Promise.all([
    prisma.financingApplication.count({ where: { status: 'new' } }),
    prisma.auctionRequest.count({ where: { status: 'new' } }),
    prisma.salvageInspection.count({ where: { status: 'new' } }),
    prisma.car.count({ where: { status: 'sold' } }),
    prisma.car.count({ where: { status: 'active' } }),
  ])

  const recentFinancing = await prisma.financingApplication.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, firstName: true, lastName: true, status: true, createdAt: true },
  })

  const recentContacts = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, name: true, email: true, subject: true, isRead: true, createdAt: true },
  })

  const stats = [
    {
      label: 'Active Inventory',
      value: activeCars,
      sub: `${soldCars} vehicles sold`,
      icon: 'fa-solid fa-car',
      href: '/admin/inventory',
      color: '#e50202',
      bg: '#fff1f2',
    },
    {
      label: 'Financing Apps',
      value: financing,
      sub: `${newFinancing} new applications`,
      icon: 'fa-solid fa-file-invoice-dollar',
      href: '/admin/financing',
      color: '#e50202',
      bg: '#fff1f2',
    },
    {
      label: 'Auction Requests',
      value: auction,
      sub: `${newAuction} new requests`,
      icon: 'fa-solid fa-gavel',
      href: '/admin/auction',
      color: '#e50202',
      bg: '#fff1f2',
    },
    {
      label: 'Inspections',
      value: inspections,
      sub: `${newInspections} pending review`,
      icon: 'fa-solid fa-magnifying-glass',
      href: '/admin/inspections',
      color: '#e50202',
      bg: '#fff1f2',
    },
    {
      label: 'Unread Messages',
      value: contacts,
      sub: 'from contact form',
      icon: 'fa-solid fa-envelope',
      href: '/admin/contacts',
      color: '#e50202',
      bg: '#fff1f2',
    },
    {
      label: 'Transport Quotes',
      value: transport,
      sub: 'total requests',
      icon: 'fa-solid fa-truck',
      href: '/admin/transport',
      color: '#e50202',
      bg: '#fff1f2',
    },
  ]

  const statusColor = {
    new:       { bg: '#fff1f2', color: '#e50202',  label: 'New' },
    reviewed:  { bg: '#f1f5f9', color: '#475569',  label: 'Reviewed' },
    contacted: { bg: '#f1f5f9', color: '#0f172a',  label: 'Contacted' },
    approved:  { bg: '#f1f5f9', color: '#0f172a',  label: 'Approved' },
    rejected:  { bg: '#fff1f2', color: '#e50202',  label: 'Rejected' },
  }

  function fmtDate(d) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back, {session.user.name}</p>
        </div>
        <div className={styles.topBarRight}>
          <span className={styles.dateChip}>
            <i className="fa-regular fa-calendar" />
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <Link key={s.label} href={s.href} className={styles.statCard}>
            <div className={styles.statCardLeft}>
              <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>
                <i className={s.icon} />
              </div>
              <div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
            <div className={styles.statSub}>
              <span style={{ color: s.color }}>{s.sub}</span>
              <i className="fa-solid fa-arrow-right" style={{ color: s.color, fontSize: '0.7rem' }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={styles.recentGrid}>
        {/* Recent Financing */}
        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <div className={styles.tableCardTitle}>
              <i className="fa-solid fa-file-invoice-dollar" />
              Recent Financing Applications
            </div>
            <Link href="/admin/financing" className={styles.viewAll}>
              View all <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
          {recentFinancing.length === 0 ? (
            <div className={styles.empty}>
              <i className="fa-regular fa-folder-open" />
              <p>No applications yet</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentFinancing.map(r => {
                  const s = statusColor[r.status] || statusColor.new
                  return (
                    <tr key={r.id}>
                      <td>
                        <Link href={`/admin/financing/${r.id}`} className={styles.nameLink}>
                          {r.firstName} {r.lastName}
                        </Link>
                      </td>
                      <td className={styles.dateCell}>{fmtDate(r.createdAt)}</td>
                      <td>
                        <span className={styles.badge} style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Messages */}
        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <div className={styles.tableCardTitle}>
              <i className="fa-solid fa-envelope" />
              Recent Contact Messages
            </div>
            <Link href="/admin/contacts" className={styles.viewAll}>
              View all <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <div className={styles.empty}>
              <i className="fa-regular fa-folder-open" />
              <p>No messages yet</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Topic</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map(r => (
                  <tr key={r.id}>
                    <td>
                      <Link href={`/admin/contacts/${r.id}`} className={styles.nameLink}>
                        {r.name}
                        {!r.isRead && <span className={styles.unreadDot} />}
                      </Link>
                    </td>
                    <td className={styles.dateCell}>{r.subject || '—'}</td>
                    <td className={styles.dateCell}>{fmtDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <Link href="/admin/inventory/new" className={styles.quickBtn}>
          <i className="fa-solid fa-plus" />
          Add Vehicle
        </Link>
        <Link href="/admin/inventory" className={styles.quickBtnOutline}>
          <i className="fa-solid fa-car" />
          Manage Inventory
        </Link>
      </div>
    </div>
  )
}

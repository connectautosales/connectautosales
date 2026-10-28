import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import styles from './leads.module.css'

export const dynamic = 'force-dynamic'

// Every lead form on the website and the table it lands in. recordType is how
// the same lead is labelled in archivedrecord once an admin deletes it.
const SOURCES = [
  { key: 'financing',  table: 'financingapplication', label: 'Financing Applications', href: '/admin/financing' },
  { key: 'inspection', table: 'salvageinspection',    label: 'Salvage Inspections',    href: '/admin/inspections' },
  { key: 'testDrive',  table: 'testdriverequest',     label: 'Test Drives',            href: '/admin/test-drives' },
  { key: 'contact',    table: 'contactmessage',       label: 'Contact Messages',       href: '/admin/contacts' },
  { key: 'auction',    table: 'auctionrequest',       label: 'Auction Requests',       href: '/admin/auction' },
  { key: 'transport',  table: 'transportrequest',     label: 'Transport Quotes',       href: '/admin/transport' },
]

const pad = (n) => String(n).padStart(2, '0')
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const monthKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`

// counts[sourceKey][YYYY-MM-DD] = number of leads that day, live and deleted
async function loadCounts(since) {
  const counts = Object.fromEntries(SOURCES.map((s) => [s.key, {}]))
  const sinceSql = dayKey(since)

  await Promise.all(SOURCES.map(async (s) => {
    try {
      const rows = await prisma.$queryRawUnsafe(
        `SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') AS d, COUNT(*) AS c
         FROM \`${s.table}\` WHERE createdAt >= ? GROUP BY d`,
        sinceSql
      )
      for (const r of rows) counts[s.key][r.d] = (counts[s.key][r.d] || 0) + Number(r.c)
    } catch {
      // a missing table just shows as zero
    }
  }))

  // Leads the admin deleted still happened; count them on the day they came in.
  try {
    const archived = await prisma.$queryRawUnsafe(
      `SELECT recordType, data FROM archivedrecord WHERE deletedAt >= ?`,
      sinceSql
    )
    for (const a of archived) {
      if (!counts[a.recordType]) continue
      let created
      try { created = JSON.parse(a.data)?.createdAt } catch { continue }
      if (!created) continue
      const d = new Date(created)
      if (isNaN(d) || d < since) continue
      const k = dayKey(d)
      counts[a.recordType][k] = (counts[a.recordType][k] || 0) + 1
    }
  } catch {
    // no archive table yet
  }
  return counts
}

function sumRange(counts, key, from, to) {
  let n = 0
  for (const [d, c] of Object.entries(counts[key])) if (d >= from && d <= to) n += c
  return n
}

function Delta({ now, before }) {
  if (!before && !now) return <span className={styles.flat}>no change</span>
  if (!before) return <span className={styles.up}>new</span>
  const diff = now - before
  const pct = Math.round((diff / before) * 100)
  if (diff === 0) return <span className={styles.flat}>same as last month</span>
  return (
    <span className={diff > 0 ? styles.up : styles.down}>
      {diff > 0 ? '+' : ''}{diff} ({diff > 0 ? '+' : ''}{pct}%) vs last month
    </span>
  )
}

export default async function LeadsReportPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  // "Today" is the dealership's date in Michigan, not the server's UTC date.
  const [ty, tm, td] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date()).split('-').map(Number)
  const today = new Date(ty, tm - 1, td)
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1)
  const counts = await loadCounts(sixMonthsAgo)

  // Month to date against the same days of last month, so a half-finished
  // month isn't compared with a full one.
  const dom = today.getDate()
  const thisFrom = dayKey(new Date(today.getFullYear(), today.getMonth(), 1))
  const thisTo = dayKey(today)
  const lastMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  const lastFrom = dayKey(new Date(today.getFullYear(), today.getMonth() - 1, 1))
  const lastTo = dayKey(new Date(today.getFullYear(), today.getMonth() - 1, Math.min(dom, lastMonthDays)))

  const perSource = SOURCES.map((s) => ({
    ...s,
    now: sumRange(counts, s.key, thisFrom, thisTo),
    before: sumRange(counts, s.key, lastFrom, lastTo),
  }))
  const totalNow = perSource.reduce((a, s) => a + s.now, 0)
  const totalBefore = perSource.reduce((a, s) => a + s.before, 0)

  // Last 30 days
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    const k = dayKey(d)
    const bySource = SOURCES.map((s) => counts[s.key][k] || 0)
    days.push({ k, d, total: bySource.reduce((a, b) => a + b, 0), bySource })
  }
  const maxDay = Math.max(1, ...days.map((d) => d.total))
  const total30 = days.reduce((a, d) => a + d.total, 0)

  // Last 6 months
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const mk = monthKey(d)
    const row = SOURCES.map((s) =>
      Object.entries(counts[s.key]).reduce((a, [day, c]) => (day.startsWith(mk) ? a + c : a), 0)
    )
    months.push({
      label: d.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      partial: i === 0,
      row,
      total: row.reduce((a, b) => a + b, 0),
    })
  }

  const monthName = today.toLocaleString('en-US', { month: 'long' })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Leads Report</h1>
          <p className={styles.sub}>
            Every form submitted on the website, including leads you later deleted.
            Phone calls and text messages are counted in Google Analytics, not here.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.totalCard}>
          <p className={styles.totalLabel}>{monthName} so far (1&ndash;{dom})</p>
          <p className={styles.totalNumber}>{totalNow}</p>
          <p className={styles.totalSub}>website leads</p>
          <Delta now={totalNow} before={totalBefore} />
          <p className={styles.compareNote}>
            Compared with the same {dom} days of last month ({totalBefore} leads).
          </p>
        </section>

        <section className={styles.grid}>
          {perSource.map((s) => (
            <Link key={s.key} href={s.href} className={styles.card}>
              <p className={styles.cardLabel}>{s.label}</p>
              <p className={styles.cardNumber}>{s.now}</p>
              <Delta now={s.now} before={s.before} />
            </Link>
          ))}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Last 30 days</h2>
            <span className={styles.panelMeta}>{total30} leads</span>
          </div>
          <div className={styles.chart} role="img" aria-label={`Daily leads over the last 30 days, ${total30} in total`}>
            {days.map((d) => (
              <div
                key={d.k}
                className={styles.barCol}
                title={`${d.d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${d.total} lead${d.total === 1 ? '' : 's'}${d.total ? ' (' + SOURCES.map((s, i) => d.bySource[i] ? `${d.bySource[i]} ${s.label.toLowerCase()}` : null).filter(Boolean).join(', ') + ')' : ''}`}
              >
                <span className={styles.barValue}>{d.total || ''}</span>
                <div className={styles.bar} style={{ height: `${(d.total / maxDay) * 100}%` }} />
                <span className={styles.barDay}>{d.d.getDate()}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Last 6 months</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Month</th>
                  {SOURCES.map((s) => <th key={s.key}>{s.label}</th>)}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.label}>
                    <td>{m.label}{m.partial ? ' (so far)' : ''}</td>
                    {m.row.map((c, i) => <td key={SOURCES[i].key}>{c}</td>)}
                    <td className={styles.totalCell}>{m.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

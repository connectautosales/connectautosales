import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from './visitors.module.css'

export const dynamic = 'force-dynamic'

export default async function VisitorsPage() {
  const [todayRows, weekRows, uniqueRows, countriesRows, recentRows, totalRows] = await Promise.all([
    prisma.$queryRaw`SELECT COUNT(*) as count FROM visitorlog WHERE DATE(createdAt) = CURDATE()`,
    prisma.$queryRaw`SELECT COUNT(*) as count FROM visitorlog WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
    prisma.$queryRaw`SELECT COUNT(DISTINCT ip) as count FROM visitorlog WHERE DATE(createdAt) = CURDATE()`,
    prisma.$queryRaw`SELECT country, COUNT(*) as count FROM visitorlog WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND country != 'Unknown' GROUP BY country ORDER BY count DESC LIMIT 10`,
    prisma.$queryRaw`SELECT id, ip, country, city, page, device, browser, referrer, createdAt FROM visitorlog ORDER BY createdAt DESC LIMIT 50`,
    prisma.$queryRaw`SELECT COUNT(*) as count FROM visitorlog`,
  ])

  const today = Number(todayRows[0]?.count || 0)
  const thisWeek = Number(weekRows[0]?.count || 0)
  const uniqueToday = Number(uniqueRows[0]?.count || 0)
  const total = Number(totalRows[0]?.count || 0)
  const countries = countriesRows.map(r => ({ country: r.country, count: Number(r.count) }))
  const maxCountry = countries[0]?.count || 1

  function fmtDate(d) {
    return new Date(d).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Visitor Analytics</h1>
        <form method="GET">
          <button type="submit" className={styles.refreshBtn}>Refresh</button>
        </form>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{today}</div>
          <div className={styles.statLabel}>Today's Visitors</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{uniqueToday}</div>
          <div className={styles.statLabel}>Unique IPs Today</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{thisWeek}</div>
          <div className={styles.statLabel}>This Week</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{total}</div>
          <div className={styles.statLabel}>All Time</div>
        </div>
      </div>

      {/* Country breakdown */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Visitors by Country <span className={styles.sub}>(last 7 days)</span>
        </h2>
        {!countries.length ? (
          <p className={styles.empty}>No data yet.</p>
        ) : (
          <div className={styles.countries}>
            {countries.map(c => (
              <div key={c.country} className={styles.countryRow}>
                <div className={styles.countryName}>{c.country}</div>
                <div className={styles.barWrap}>
                  <div className={styles.bar} style={{ width: `${(c.count / maxCountry) * 100}%` }} />
                </div>
                <div className={styles.countryCount}>{c.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent visitors table */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Visitors</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>IP</th>
                <th>Country</th>
                <th>City</th>
                <th>Page</th>
                <th>Device</th>
                <th>Browser</th>
              </tr>
            </thead>
            <tbody>
              {!recentRows.length ? (
                <tr><td colSpan={7} className={styles.empty}>No visitors yet.</td></tr>
              ) : recentRows.map(v => (
                <tr key={String(v.id)}>
                  <td className={styles.nowrap}>{fmtDate(v.createdAt)}</td>
                  <td className={styles.mono}>{v.ip}</td>
                  <td>{v.country}</td>
                  <td>{v.city}</td>
                  <td className={styles.pagecell}>{v.page}</td>
                  <td>{v.device}</td>
                  <td>{v.browser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

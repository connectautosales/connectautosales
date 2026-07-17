import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const [todayRows, weekRows, uniqueRows, countriesRows, recentRows, totalRows] = await Promise.all([
    // Today count
    prisma.$queryRaw`SELECT COUNT(*) as count FROM visitorlog WHERE DATE(createdAt) = CURDATE()`,
    // This week count
    prisma.$queryRaw`SELECT COUNT(*) as count FROM visitorlog WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
    // Unique IPs today
    prisma.$queryRaw`SELECT COUNT(DISTINCT ip) as count FROM visitorlog WHERE DATE(createdAt) = CURDATE()`,
    // Country breakdown (last 7 days, top 10)
    prisma.$queryRaw`SELECT country, COUNT(*) as count FROM visitorlog WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND country != 'Unknown' GROUP BY country ORDER BY count DESC LIMIT 10`,
    // Recent visitors
    prisma.$queryRaw`SELECT id, ip, country, city, page, device, browser, referrer, createdAt FROM visitorlog ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`,
    // Total count for pagination
    prisma.$queryRaw`SELECT COUNT(*) as count FROM visitorlog`,
  ])

  return NextResponse.json({
    today: Number(todayRows[0]?.count || 0),
    thisWeek: Number(weekRows[0]?.count || 0),
    uniqueToday: Number(uniqueRows[0]?.count || 0),
    countries: countriesRows.map(r => ({ country: r.country, count: Number(r.count) })),
    recent: recentRows,
    total: Number(totalRows[0]?.count || 0),
    page,
    pages: Math.ceil(Number(totalRows[0]?.count || 0) / limit),
  })
}

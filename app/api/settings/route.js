import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const rows = await prisma.$queryRaw`SELECT * FROM SiteSettings LIMIT 1`
    if (rows.length === 0) {
      await prisma.$executeRaw`INSERT IGNORE INTO SiteSettings (id, updatedAt) VALUES (1, NOW())`
      const newRows = await prisma.$queryRaw`SELECT * FROM SiteSettings LIMIT 1`
      return NextResponse.json(newRows[0] ?? {})
    }
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

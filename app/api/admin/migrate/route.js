import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const results = []
  const alters = [
    `ALTER TABLE salvageinspection MODIFY COLUMN salvageTitle TEXT`,
    `ALTER TABLE salvageinspection MODIFY COLUMN validId TEXT`,
    `ALTER TABLE salvageinspection MODIFY COLUMN receipts TEXT`,
    `ALTER TABLE salvageinspection MODIFY COLUMN partsChanged TEXT`,
  ]

  for (const sql of alters) {
    try {
      await prisma.$executeRawUnsafe(sql)
      results.push({ sql, ok: true })
    } catch (e) {
      results.push({ sql, ok: false, error: e.message })
    }
  }

  return NextResponse.json({ results })
}

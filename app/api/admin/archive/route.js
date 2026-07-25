import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Super-admin only
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { action, id } = await req.json()

  if (action === 'restore') {
    const rows = await prisma.$queryRaw`SELECT * FROM archivedrecord WHERE id = ${parseInt(id)} LIMIT 1`
    const rec = rows[0]
    if (!rec) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    let data
    try { data = JSON.parse(rec.data) } catch {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    // Remove id from data so DB auto-assigns, keep originalId as id
    const originalId = data.id || rec.originalId
    const table = rec.originalTable

    // Build INSERT with all columns from original data
    const entries = Object.entries(data)
    const cols = entries.map(([k]) => `\`${k}\``).join(', ')
    const placeholders = entries.map(() => '?').join(', ')
    const vals = entries.map(([, v]) => v)

    try {
      await prisma.$executeRawUnsafe(
        `INSERT IGNORE INTO \`${table}\` (${cols}) VALUES (${placeholders})`,
        ...vals
      )
      await prisma.$executeRaw`DELETE FROM archivedrecord WHERE id = ${parseInt(id)}`
      return NextResponse.json({ ok: true })
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  if (action === 'permanent') {
    await prisma.$executeRaw`DELETE FROM archivedrecord WHERE id = ${parseInt(id)}`
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// GET: list archived records
export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const records = await prisma.$queryRaw`
    SELECT id, recordType, originalId, originalTable, deletedByEmail, deletedByRole, deletedAt
    FROM archivedrecord ORDER BY deletedAt DESC LIMIT 500
  `
  return NextResponse.json(records)
}

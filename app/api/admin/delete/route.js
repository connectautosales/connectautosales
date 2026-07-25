import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const ALLOWED_TABLES = [
  'contactmessage',
  'financingapplication',
  'auctionrequest',
  'transportrequest',
  'salvageinspection',
  'testdriverequest',
]

const TABLE_TYPE_MAP = {
  contactmessage:       'contact',
  financingapplication: 'financing',
  auctionrequest:       'auction',
  transportrequest:     'transport',
  salvageinspection:    'inspection',
  testdriverequest:     'testDrive',
}

async function archiveRecord({ table, id, session }) {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`, id
  )
  if (!rows[0]) return

  const data = JSON.stringify(rows[0], (_, v) =>
    typeof v === 'bigint' ? Number(v) : v
  )
  const recordType = TABLE_TYPE_MAP[table] || table

  await prisma.$executeRaw`
    INSERT INTO archivedrecord (recordType, originalId, originalTable, data, deletedByEmail, deletedByRole)
    VALUES (${recordType}, ${id}, ${table}, ${data}, ${session?.user?.email || null}, ${session?.user?.role || 'admin'})
  `
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { table, id, ids } = await req.json()
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  if (Array.isArray(ids) && ids.length > 0) {
    const numIds = ids.map(i => parseInt(i)).filter(i => !isNaN(i))
    for (const numId of numIds) {
      await archiveRecord({ table, id: numId, session }).catch(() => {})
    }
    await prisma.$executeRawUnsafe(
      `DELETE FROM \`${table}\` WHERE id IN (${numIds.join(',')})`,
    )
    return NextResponse.json({ ok: true, deleted: numIds.length })
  }

  const numId = parseInt(id)
  await archiveRecord({ table, id: numId, session }).catch(() => {})
  await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\` WHERE id = ?`, numId)
  return NextResponse.json({ ok: true })
}

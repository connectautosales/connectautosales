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

export async function DELETE(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { table, id, ids } = await req.json()
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  if (Array.isArray(ids) && ids.length > 0) {
    const numIds = ids.map(i => parseInt(i)).filter(i => !isNaN(i))
    await prisma.$executeRawUnsafe(
      `DELETE FROM \`${table}\` WHERE id IN (${numIds.join(',')})`,
    )
    return NextResponse.json({ ok: true, deleted: numIds.length })
  }

  await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\` WHERE id = ?`, parseInt(id))
  return NextResponse.json({ ok: true })
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const MODEL_MAP = {
  financing: 'financingApplication',
  auction: 'auctionRequest',
  inspection: 'salvageInspection',
  contact: 'contactMessage',
  transport: 'transportRequest',
  testDrive: null, // handled via raw query below
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, id, status, adminNotes, isRead } = await req.json()

  if (!(type in MODEL_MAP)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  if (type === 'testDrive') {
    await prisma.$executeRaw`
      UPDATE TestDriveRequest SET
        status = ${status ?? null},
        adminNotes = ${adminNotes ?? null}
      WHERE id = ${parseInt(id)}
    `
    const rows = await prisma.$queryRaw`SELECT * FROM TestDriveRequest WHERE id = ${parseInt(id)} LIMIT 1`
    return NextResponse.json(rows[0])
  }

  const model = MODEL_MAP[type]
  const updateData = {}
  if (status !== undefined) updateData.status = status
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes
  if (isRead !== undefined) updateData.isRead = isRead

  const result = await prisma[model].update({
    where: { id: parseInt(id) },
    data: updateData,
  })

  return NextResponse.json(result)
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { buildStatusEmail } from '@/lib/statusEmail'

const TABLE_MAP = {
  financing:  'financingapplication',
  auction:    'auctionrequest',
  inspection: 'salvageinspection',
  transport:  'transportrequest',
  testDrive:  'testdriverequest',
}

// Renders the status email exactly as it would be sent, without sending it.
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, id, status, customerMessage } = await req.json()
  if (!(type in TABLE_MAP)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  const rows = await prisma.$queryRawUnsafe(
    `SELECT * FROM \`${TABLE_MAP[type]}\` WHERE id = ? LIMIT 1`,
    parseInt(id)
  )
  const record = rows[0]
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!record.email) return NextResponse.json({ error: 'This customer has no email address on file.' }, { status: 422 })

  const mail = buildStatusEmail({ type, record, status, message: customerMessage })
  if (!mail) return NextResponse.json({ error: 'This status does not send a customer email.' }, { status: 422 })

  return NextResponse.json(mail)
}

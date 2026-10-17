import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { buildStatusEmail } from '@/lib/statusEmail'

const TABLE_MAP = {
  financing:  'financingapplication',
  auction:    'auctionrequest',
  inspection: 'salvageinspection',
  contact:    'contactmessage',
  transport:  'transportrequest',
  testDrive:  'testdriverequest',
}

// ContactMessage has no status column
const HAS_ISREAD = new Set(['contact'])

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, id, status, adminNotes, isRead, notify, customerMessage } = await req.json()

  if (!(type in TABLE_MAP)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const numId = parseInt(id)
  const table = TABLE_MAP[type]

  try {
    if (HAS_ISREAD.has(type)) {
      // ContactMessage: no status column, only adminNotes + isRead
      await prisma.$executeRawUnsafe(
        `UPDATE \`${table}\` SET adminNotes = ?, isRead = ? WHERE id = ?`,
        adminNotes ?? null,
        isRead ? 1 : 0,
        numId
      )
    } else {
      // All others: status + adminNotes
      await prisma.$executeRawUnsafe(
        `UPDATE \`${table}\` SET status = ?, adminNotes = ? WHERE id = ?`,
        status ?? null,
        adminNotes ?? null,
        numId
      )
    }
  } catch (e) {
    console.error('Status update error:', e.message)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  // Fetch updated record (for response + email data)
  const rows = await prisma.$queryRawUnsafe(
    `SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`,
    numId
  )
  const result = rows[0] || {}

  // The customer is emailed only when the admin ticked "Email the customer",
  // and the email carries only the message written for them, never the notes.
  let emailed = false
  if (notify && status && !HAS_ISREAD.has(type)) {
    const mail = buildStatusEmail({ type, record: result, status, message: customerMessage })
    if (mail) {
      try {
        await sendMail(mail)
        emailed = true
      } catch (e) {
        console.error('Status email error:', e.message)
      }
    }
  }

  return NextResponse.json({ ...result, emailed })
}

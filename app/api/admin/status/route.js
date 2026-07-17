import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { statusUpdateCustomer } from '@/lib/emailTemplates'

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

const STATUS_LABELS = {
  new:       'Received',
  reviewed:  'Under Review',
  contacted: 'We Have Contacted You',
  approved:  'Approved',
  rejected:  'Not Approved',
  scheduled: 'Scheduled',
  completed: 'Completed',
  closed:    'Closed',
}

const TYPE_LABELS = {
  financing:  'Financing Application',
  auction:    'Auction Request',
  inspection: 'Salvage Inspection Request',
  contact:    'Contact Message',
  transport:  'Transport Quote Request',
  testDrive:  'Test Drive Request',
}

const NOTIFY_STATUSES = new Set(['reviewed', 'contacted', 'approved', 'rejected', 'scheduled', 'completed'])

async function sendStatusEmail({ type, record, status, adminNotes }) {
  const email = record.email
  if (!email || !NOTIFY_STATUSES.has(status)) return

  const firstName = record.firstName || record.name || 'there'
  const typeLabel = TYPE_LABELS[type] || 'Request'
  const statusLabel = STATUS_LABELS[status] || status

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `${typeLabel} Update — ${statusLabel} | Connect Auto Sales`,
    html: statusUpdateCustomer({ firstName, type, status, adminNotes }),
  })

  console.log(`Status email sent to ${email} → ${type} #${record.id} [${status}]`)
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, id, status, adminNotes, isRead } = await req.json()

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

  // Send customer notification email (non-blocking)
  if (status && !HAS_ISREAD.has(type)) {
    sendStatusEmail({ type, record: result, status, adminNotes }).catch(e =>
      console.error('Status email error:', e.message)
    )
  }

  return NextResponse.json(result)
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { statusUpdateCustomer } from '@/lib/emailTemplates'

const TABLE_MAP = {
  financing:  'financingapplication',
  auction:    'auctionrequest',
  inspection: 'salvageinspection',
  contact:    'contactmessage',
  transport:  'transportrequest',
  testDrive:  'testdriverequest',
}

const HAS_ISREAD = new Set(['contact'])

const STATUS_LABELS = {
  new:                  'Received',
  reviewed:             'Under Review',
  contacted:            'We Have Contacted You',
  approved:             'Approved',
  rejected:             'Not Approved',
  scheduled:            'Scheduled',
  completed:            'Completed',
  closed:               'Closed',
  'documents-reviewed': 'Documents Reviewed',
  confirmed:            'Confirmed',
  cancelled:            'Cancelled',
}

const TYPE_LABELS = {
  financing:  'Financing Application',
  auction:    'Auction Request',
  inspection: 'Salvage Inspection Request',
  contact:    'Contact Message',
  transport:  'Transport Quote Request',
  testDrive:  'Test Drive Request',
}

const NOTIFY_STATUSES = new Set([
  'reviewed', 'contacted', 'approved', 'rejected',
  'scheduled', 'completed', 'documents-reviewed', 'confirmed', 'cancelled',
])

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, ids, status } = await req.json()

  if (!(type in TABLE_MAP) || !Array.isArray(ids) || ids.length === 0 || !status) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const table = TABLE_MAP[type]
  const numIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id))

  if (HAS_ISREAD.has(type)) {
    const isRead = status !== 'unread' ? 1 : 0
    for (const id of numIds) {
      await prisma.$executeRawUnsafe(
        `UPDATE \`${table}\` SET isRead = ? WHERE id = ?`,
        isRead, id
      )
    }
  } else {
    for (const id of numIds) {
      await prisma.$executeRawUnsafe(
        `UPDATE \`${table}\` SET status = ? WHERE id = ?`,
        status, id
      )
    }

    if (NOTIFY_STATUSES.has(status)) {
      const rows = await prisma.$queryRawUnsafe(
        `SELECT * FROM \`${table}\` WHERE id IN (${numIds.join(',')}) LIMIT ${numIds.length}`
      )
      for (const record of rows) {
        if (!record?.email) continue
        const firstName = record.firstName || record.name || 'there'
        const typeLabel = TYPE_LABELS[type] || 'Request'
        const statusLabel = STATUS_LABELS[status] || status
        await sendMail({
          to: record.email,
          subject: `${typeLabel} Update — ${statusLabel} | Connect Auto Sales`,
          html: statusUpdateCustomer({ firstName, type, status, adminNotes: null }),
        }).catch(e => console.error('Bulk email error:', e.message))
      }
    }
  }

  return NextResponse.json({ ok: true, updated: numIds.length })
}

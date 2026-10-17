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

const HAS_ISREAD = new Set(['contact'])

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, ids, status, notify } = await req.json()

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

    // Bulk changes email customers only when the admin ticked the box.
    let emailed = 0
    if (notify && numIds.length) {
      const rows = await prisma.$queryRawUnsafe(
        `SELECT * FROM \`${table}\` WHERE id IN (${numIds.join(',')}) LIMIT ${numIds.length}`
      )
      for (const record of rows) {
        const mail = buildStatusEmail({ type, record, status })
        if (!mail) continue
        try {
          await sendMail(mail)
          emailed++
        } catch (e) {
          console.error('Bulk email error:', e.message)
        }
      }
    }
    return NextResponse.json({ ok: true, updated: numIds.length, emailed })
  }

  return NextResponse.json({ ok: true, updated: numIds.length })
}

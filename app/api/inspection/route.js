import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { inspectionCustomer, inspectionAdmin } from '@/lib/emailTemplates'

export async function POST(req) {
  try {
    const data = await req.json()
    const { firstName = '', lastName = '', phone = '', email = '', partsChanged = '', salvageTitle = null, validId = null, receipts = null } = data

    await prisma.$executeRaw`
      INSERT INTO salvageinspection (firstName, lastName, phone, email, partsChanged, salvageTitle, validId, receipts, status, createdAt)
      VALUES (${firstName}, ${lastName}, ${phone}, ${email}, ${partsChanged}, ${salvageTitle}, ${validId}, ${receipts}, 'new', NOW())
    `
    const rows = await prisma.$queryRaw`SELECT * FROM salvageinspection ORDER BY id DESC LIMIT 1`
    const inspection = rows[0]

    await Promise.allSettled([
      email && sendMail({
        to: email,
        subject: 'Documents Received — Connect Auto Sales',
        html: inspectionCustomer({ firstName }),
      }),
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `New Inspection Request — ${firstName} ${lastName}`,
        html: inspectionAdmin({ firstName, lastName, phone, email }),
      }),
    ])

    return NextResponse.json({ ok: true, id: inspection?.id })
  } catch (e) {
    console.error('Inspection submit error:', e)
    return NextResponse.json({ error: 'Failed to submit documents.' }, { status: 500 })
  }
}

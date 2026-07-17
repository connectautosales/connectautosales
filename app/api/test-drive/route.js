import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { testDriveCustomer, testDriveAdmin } from '@/lib/emailTemplates'

export async function POST(req) {
  try {
    const d = await req.json()
    await prisma.$executeRaw`
      INSERT INTO TestDriveRequest (firstName, lastName, phone, email, vehicle, preferredDate, preferredTime, notes, status, createdAt)
      VALUES (${d.firstName || ''}, ${d.lastName || ''}, ${d.phone || ''}, ${d.email || ''}, ${d.vehicle || ''}, ${d.preferredDate || ''}, ${d.preferredTime || ''}, ${d.notes || ''}, 'new', NOW())
    `

    await Promise.allSettled([
      d.email && sendMail({
        to: d.email,
        subject: 'Test Drive Request Received — Connect Auto Sales',
        html: testDriveCustomer(d),
      }),
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `New Test Drive Request — ${d.firstName} ${d.lastName}`,
        html: testDriveAdmin(d),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Test drive submit error:', e)
    return NextResponse.json({ error: 'Failed to submit.' }, { status: 500 })
  }
}

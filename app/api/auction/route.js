import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { auctionCustomer, auctionAdmin } from '@/lib/emailTemplates'

export async function POST(req) {
  try {
    const data = await req.json()

    await prisma.$executeRaw`
      INSERT INTO auctionrequest (firstName, lastName, phone, email, auctionLink, lotNumber, notes, status, createdAt)
      VALUES (${data.firstName||''}, ${data.lastName||''}, ${data.phone||''}, ${data.email||''}, ${data.auctionLink||null}, ${data.lotNumber||null}, ${data.notes||null}, 'new', NOW())
    `
    const rows = await prisma.$queryRaw`SELECT * FROM auctionrequest ORDER BY id DESC LIMIT 1`
    const request = rows[0]

    await Promise.allSettled([
      data.email && sendMail({
        to: data.email,
        subject: 'Auction Request Received — Connect Auto Sales',
        html: auctionCustomer({ firstName: data.firstName }),
      }),
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `New Auction Request — ${data.firstName} ${data.lastName}`,
        html: auctionAdmin(data),
      }),
    ])

    return NextResponse.json({ ok: true, id: request?.id })
  } catch (e) {
    console.error('Auction submit error:', e)
    return NextResponse.json({ error: 'Failed to submit request.' }, { status: 500 })
  }
}

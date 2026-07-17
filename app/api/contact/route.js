import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { contactCustomer, contactAdmin } from '@/lib/emailTemplates'

export async function POST(req) {
  try {
    const body = await req.json()

    const data = {
      name:    body.name    || body.firstName || null,
      phone:   body.phone   || null,
      email:   body.email   || null,
      subject: body.subject || body.topic     || null,
      message: body.message || null,
    }

    await prisma.$executeRaw`
      INSERT INTO contactmessage (name, phone, email, subject, message, isRead, createdAt)
      VALUES (${data.name}, ${data.phone}, ${data.email}, ${data.subject}, ${data.message}, 0, NOW())
    `
    const rows = await prisma.$queryRaw`SELECT * FROM contactmessage ORDER BY id DESC LIMIT 1`
    const msg = rows[0]

    await Promise.allSettled([
      data.email && sendMail({
        to: data.email,
        subject: 'We Received Your Message — Connect Auto Sales',
        html: contactCustomer({ name: data.name }),
      }),
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `New Contact Message — ${data.name || 'Unknown'}`,
        html: contactAdmin(data),
      }),
    ])

    return NextResponse.json({ ok: true, id: msg.id })
  } catch (e) {
    console.error('Contact submit error:', e)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}

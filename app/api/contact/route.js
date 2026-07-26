import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { contactCustomer, contactAdmin } from '@/lib/emailTemplates'

export async function POST(req) {
  try {
    const body = await req.json()

    const data = {
      name:    (body.name    || body.firstName || '').toString().slice(0, 100) || null,
      phone:   (body.phone   || '').toString().slice(0, 20)  || null,
      email:   (body.email   || '').toString().slice(0, 200) || null,
      subject: (body.subject || body.topic || '').toString().slice(0, 200) || null,
      message: (body.message || '').toString().slice(0, 5000) || null,
    }

    if (!data.name || !data.message) {
      return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 })
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
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

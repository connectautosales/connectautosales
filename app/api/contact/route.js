import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { contactCustomer, contactAdmin } from '@/lib/emailTemplates'
import { verifyRecaptcha } from '@/lib/recaptcha'

export async function POST(req) {
  try {
    const body = await req.json()

    const captcha = await verifyRecaptcha(body.recaptchaToken)
    if (!captcha.success || captcha.score < 0.5) {
      return NextResponse.json({ error: 'Bot detected. Please try again.' }, { status: 403 })
    }

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

    const emailResults = await Promise.allSettled([
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

    const emailErrors = emailResults
      .filter(r => r.status === 'rejected')
      .map(r => r.reason?.message || String(r.reason))

    if (emailErrors.length) console.error('Contact email errors:', emailErrors)

    return NextResponse.json({ ok: true, id: msg.id, emailErrors })
  } catch (e) {
    console.error('Contact submit error:', e)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}

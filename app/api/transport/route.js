import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { transportCustomer, transportAdmin } from '@/lib/emailTemplates'

export async function POST(req) {
  try {
    const data = await req.json()
    const request = await prisma.transportRequest.create({ data })

    await Promise.allSettled([
      data.email && sendMail({
        to: data.email,
        subject: 'Transport Quote Request Received — Connect Auto Sales',
        html: transportCustomer({ name: data.name }),
      }),
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `New Transport Request — ${data.name || 'Unknown'}`,
        html: transportAdmin(data),
      }),
    ])

    return NextResponse.json({ ok: true, id: request.id })
  } catch (e) {
    console.error('Transport submit error:', e)
    return NextResponse.json({ error: 'Failed to submit quote request.' }, { status: 500 })
  }
}

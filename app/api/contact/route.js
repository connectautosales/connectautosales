import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()

    // Map public form fields → schema fields
    const data = {
      name:    body.name    || body.firstName || null,
      phone:   body.phone   || null,
      email:   body.email   || null,
      subject: body.subject || body.topic     || null,
      message: body.message || null,
    }

    const msg = await prisma.contactMessage.create({ data })
    return NextResponse.json({ ok: true, id: msg.id })
  } catch (e) {
    console.error('Contact submit error:', e)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}

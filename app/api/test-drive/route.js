import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const d = await req.json()
    await prisma.$executeRaw`
      INSERT INTO TestDriveRequest (firstName, lastName, phone, email, vehicle, preferredDate, preferredTime, notes, status, createdAt)
      VALUES (${d.firstName || ''}, ${d.lastName || ''}, ${d.phone || ''}, ${d.email || ''}, ${d.vehicle || ''}, ${d.preferredDate || ''}, ${d.preferredTime || ''}, ${d.notes || ''}, 'new', NOW())
    `
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Test drive submit error:', e)
    return NextResponse.json({ error: 'Failed to submit.' }, { status: 500 })
  }
}

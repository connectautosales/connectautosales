import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const data = await req.json()
    const request = await prisma.transportRequest.create({ data })
    return NextResponse.json({ ok: true, id: request.id })
  } catch (e) {
    console.error('Transport submit error:', e)
    return NextResponse.json({ error: 'Failed to submit quote request.' }, { status: 500 })
  }
}

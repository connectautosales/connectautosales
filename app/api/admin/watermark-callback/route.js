import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  return NextResponse.json({ ok: true, route: 'watermark-callback' })
}

export async function POST(req) {
  try {
    const { image, requestId } = await req.json()
    if (!requestId || !image) {
      return NextResponse.json({ error: 'Missing requestId or image' }, { status: 400 })
    }

    const base64 = image.startsWith('data:') ? image : `data:image/png;base64,${image}`

    await prisma.$executeRawUnsafe(
      `UPDATE watermark_jobs SET base64 = ? WHERE id = ?`,
      base64, requestId
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

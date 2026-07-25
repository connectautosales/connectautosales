import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const requestId = searchParams.get('requestId')
  if (!requestId) return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })

  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT base64 FROM watermark_jobs WHERE id = ? AND base64 IS NOT NULL`, requestId
    )
    if (rows[0]?.base64) {
      await prisma.$executeRawUnsafe(`DELETE FROM watermark_jobs WHERE id = ?`, requestId)
      return NextResponse.json({ done: true, base64: rows[0].base64 })
    }
    return NextResponse.json({ done: false })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

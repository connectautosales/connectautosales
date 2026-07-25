import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT watermark_prompt FROM sitesettings LIMIT 1`
    )
    return NextResponse.json({ prompt: rows[0]?.watermark_prompt || '' })
  } catch {
    // Column might not exist yet
    return NextResponse.json({ prompt: '' })
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prompt } = await req.json()

  try {
    // Add column if missing
    await prisma.$executeRawUnsafe(
      `ALTER TABLE sitesettings ADD COLUMN IF NOT EXISTS watermark_prompt TEXT`
    )
    await prisma.$executeRawUnsafe(
      `UPDATE sitesettings SET watermark_prompt = ? WHERE id = 1`,
      prompt
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT watermark_prompt, watermark_template_url FROM sitesettings LIMIT 1`
    )
    return NextResponse.json({
      prompt: rows[0]?.watermark_prompt || '',
      templateUrl: rows[0]?.watermark_template_url || '',
    })
  } catch {
    return NextResponse.json({ prompt: '', templateUrl: '' })
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prompt, templateUrl } = await req.json()

  try {
    // Add columns if missing (MySQL compatible)
    try { await prisma.$executeRawUnsafe(`ALTER TABLE sitesettings ADD COLUMN watermark_prompt TEXT`) } catch {}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE sitesettings ADD COLUMN watermark_template_url VARCHAR(500)`) } catch {}

    if (templateUrl !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE sitesettings SET watermark_prompt = ?, watermark_template_url = ? WHERE id = 1`,
        prompt ?? '', templateUrl
      )
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE sitesettings SET watermark_prompt = ? WHERE id = 1`,
        prompt
      )
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

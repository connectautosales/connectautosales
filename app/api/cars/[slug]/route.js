import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  try {
    const { slug } = await params
    const isNumeric = /^\d+$/.test(slug)
    const rows = isNumeric
      ? await prisma.$queryRaw`SELECT * FROM car WHERE id = ${parseInt(slug)} LIMIT 1`
      : await prisma.$queryRaw`SELECT * FROM car WHERE slug = ${slug} LIMIT 1`
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

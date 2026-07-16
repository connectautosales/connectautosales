import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  try {
    const { slug } = await params
    // Try slug first, fallback to numeric id
    const isNumeric = /^\d+$/.test(slug)
    const car = isNumeric
      ? await prisma.car.findUnique({ where: { id: parseInt(slug) } })
      : await prisma.car.findUnique({ where: { slug } })
    if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(car)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

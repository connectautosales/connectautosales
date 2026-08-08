import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cars = await prisma.$queryRaw`SELECT * FROM car WHERE status IN ('available', 'pending') ORDER BY createdAt DESC`
    return NextResponse.json(cars)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(cars)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

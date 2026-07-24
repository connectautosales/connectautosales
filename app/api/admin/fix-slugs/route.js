import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function makeSlug(year, make, model, trim, id) {
  const base = `${year} ${make} ${model} ${trim || ''}`.trim()
  const slug = base.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return `${slug}-${id}`
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cars = await prisma.$queryRaw`SELECT id, year, make, model, trim, slug FROM car`
  let fixed = 0
  for (const car of cars) {
    const id = Number(car.id)
    const slug = makeSlug(car.year, car.make, car.model, car.trim, id)
    if (car.slug !== slug) {
      await prisma.$executeRawUnsafe(`UPDATE car SET slug = ? WHERE id = ?`, slug, id)
      fixed++
    }
  }
  return NextResponse.json({ ok: true, fixed, total: cars.length })
}

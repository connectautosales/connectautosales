import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function makeSlug(year, make, model, trim, id) {
  const base = `${year} ${make} ${model} ${trim || ''}`.trim()
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug}-${id}`
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const car = await prisma.car.create({ data })
    // Generate slug after we have the id
    const slug = makeSlug(car.year, car.make, car.model, car.trim, car.id)
    const updated = await prisma.car.update({ where: { id: car.id }, data: { slug } })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

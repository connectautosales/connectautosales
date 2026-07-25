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
    const now = new Date()
    if (!data.createdAt) data.createdAt = now
    data.updatedAt = now
    const cols = Object.keys(data).map(k => `\`${k}\``).join(', ')
    const vals = Object.values(data)
    const placeholders = vals.map(() => '?').join(', ')
    await prisma.$executeRawUnsafe(`INSERT INTO car (${cols}) VALUES (${placeholders})`, ...vals)
    const [newCar] = await prisma.$queryRaw`SELECT * FROM car ORDER BY id DESC LIMIT 1`
    const slug = makeSlug(newCar.year, newCar.make, newCar.model, newCar.trim, newCar.id)
    await prisma.$executeRaw`UPDATE car SET slug = ${slug} WHERE id = ${newCar.id}`
    newCar.slug = slug
    return NextResponse.json(newCar)
  } catch (e) {
    if (e.message?.includes('Duplicate entry') && e.message?.includes('stock')) {
      return NextResponse.json({ error: 'Stock number already exists. Please use a different stock #.' }, { status: 409 })
    }
    if (e.message?.includes('Duplicate entry') && e.message?.includes('vin')) {
      return NextResponse.json({ error: 'VIN already exists in inventory.' }, { status: 409 })
    }
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

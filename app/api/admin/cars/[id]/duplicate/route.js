import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function makeSlug(year, make, model, trim, id) {
  const base = `${year} ${make} ${model} ${trim || ''}`.trim()
  const slug = base.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return `${slug}-${id}`
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const rows = await prisma.$queryRaw`SELECT * FROM car WHERE id = ${parseInt(id)} LIMIT 1`
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const src = rows[0]
  delete src.id
  // Convert BigInt fields to Number so they can be passed to executeRawUnsafe
  Object.keys(src).forEach(k => {
    if (typeof src[k] === 'bigint') src[k] = Number(src[k])
  })
  src.stock = src.stock ? `${src.stock}-COPY` : 'COPY'
  src.slug = null
  src.status = 'hidden'
  src.createdAt = new Date()

  const cols = Object.keys(src).map(k => `\`${k}\``).join(', ')
  const vals = Object.values(src)
  const placeholders = vals.map(() => '?').join(', ')
  await prisma.$executeRawUnsafe(`INSERT INTO car (${cols}) VALUES (${placeholders})`, ...vals)
  const [newCar] = await prisma.$queryRaw`SELECT * FROM car ORDER BY id DESC LIMIT 1`
  const newId = Number(newCar.id)
  const slug = makeSlug(newCar.year, newCar.make, newCar.model, newCar.trim, newId)
  await prisma.$executeRaw`UPDATE car SET slug = ${slug} WHERE id = ${newId}`
  return NextResponse.json({ id: newId })
}

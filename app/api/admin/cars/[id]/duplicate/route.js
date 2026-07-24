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
  const srcId = parseInt(id)

  const rows = await prisma.$queryRaw`SELECT * FROM car WHERE id = ${srcId} LIMIT 1`
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const src = rows[0]

  // Build a unique stock number (avoid unique constraint collision)
  const baseStock = (src.stock || `CAR-${srcId}`).replace(/-COPY\d*$/, '')
  let newStock = `${baseStock}-COPY`
  const existing = await prisma.$queryRaw`SELECT stock FROM car WHERE stock LIKE ${`${baseStock}-COPY%`}`
  if (existing.length > 0) newStock = `${baseStock}-COPY${existing.length + 1}`

  await prisma.$executeRawUnsafe(
    `INSERT INTO car
      (stock, year, make, model, trim, vin, price, financePrice, mileage,
       titleType, drivetrain, transmission, fuelType, color, description,
       type, features, images, damageImages, status, slug, isNewArrival, createdAt, updatedAt)
     SELECT
      ?, year, make, model, trim, NULL, price, financePrice, mileage,
      titleType, drivetrain, transmission, fuelType, color, description,
      type, features, images, damageImages, 'hidden', NULL, 0, NOW(), NOW()
     FROM car WHERE id = ?`,
    newStock, srcId
  )

  const [newCar] = await prisma.$queryRaw`SELECT id, year, make, model, trim FROM car ORDER BY id DESC LIMIT 1`
  const newId = Number(newCar.id)
  const slug = makeSlug(newCar.year, newCar.make, newCar.model, newCar.trim, newId)
  await prisma.$executeRawUnsafe(`UPDATE car SET slug = ? WHERE id = ?`, slug, newId)

  return NextResponse.json({ id: newId })
}

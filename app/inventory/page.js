import { prisma } from '@/lib/prisma'
import InventoryClient from './InventoryClient'

// Only the columns the listing cards actually read — the full row carries the
// description and damage-photo blobs, which roughly tripled the payload.
async function getCars() {
  try {
    const rows = await prisma.$queryRaw`
      SELECT id, stock, slug, year, make, model, trim, price, financePrice,
             mileage, titleType, type, images, status, isNewArrival, createdAt
      FROM car
      WHERE status IN ('available', 'pending', 'coming_soon')
      ORDER BY createdAt DESC
    `
    return JSON.parse(JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? Number(v) : v)))
  } catch {
    return []
  }
}

export default async function InventoryPage() {
  const cars = await getCars()
  return <InventoryClient cars={cars} />
}

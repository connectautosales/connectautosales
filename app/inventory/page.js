import { prisma } from '@/lib/prisma'
import InventoryClient from './InventoryClient'
import { OG_IMAGE } from '@/lib/seo'
import { getInventoryStats, formatPrice } from '@/lib/inventoryStats'

export async function generateMetadata() {
  const { count, minPrice } = await getInventoryStats()
  const title = count > 1 && minPrice
    ? { absolute: `${count} Used Cars for Sale in Dearborn Heights, MI from ${formatPrice(minPrice)}` }
    : 'Browse Our Used Car Inventory in Dearborn Heights, MI'
  const description = count
    ? `Browse ${count} used cars, trucks and SUVs for sale in Dearborn Heights, Michigan${minPrice ? `, starting at ${formatPrice(minPrice)}` : ''}. Clean and rebuilt titles, financing for all credit types, warranty options.`
    : 'Browse our full inventory of quality used cars, trucks and SUVs in Dearborn Heights, Michigan. Clean and rebuilt titles, financing available for all credit types, warranty options.'
  return {
    title,
    description,
    alternates: { canonical: '/inventory' },
    openGraph: {
      images: [OG_IMAGE],
      url: '/inventory',
      title: 'Used Cars for Sale in Dearborn Heights, MI | Connect Auto Sales',
      description,
    },
  }
}

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

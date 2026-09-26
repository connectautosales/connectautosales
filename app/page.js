import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'

const LIVE = ['available', 'pending', 'coming_soon']

// Fetched here rather than in the browser so the vehicle links exist in the
// server-rendered HTML and are crawlable.
async function getFeaturedCars() {
  const cols = `id, stock, slug, year, make, model, trim, price, financePrice,
                mileage, titleType, type, images, status, isNewArrival, featured, createdAt`
  const placeholders = LIVE.map(() => '?').join(',')
  try {
    let rows = await prisma.$queryRawUnsafe(
      `SELECT ${cols} FROM car WHERE status IN (${placeholders}) AND featured = 1
       ORDER BY createdAt DESC LIMIT 6`,
      ...LIVE
    )
    if (!rows.length) {
      rows = await prisma.$queryRawUnsafe(
        `SELECT ${cols} FROM car WHERE status IN (${placeholders})
         ORDER BY createdAt DESC LIMIT 6`,
        ...LIVE
      )
    }
    return JSON.parse(JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? Number(v) : v)))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featuredCars = await getFeaturedCars()
  return <HomeClient featuredCars={featuredCars} />
}

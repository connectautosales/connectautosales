import { prisma } from '@/lib/prisma'

const LIVE = ['available', 'pending', 'coming_soon']

// Motorcycles are listed alongside cars (and sometimes typed as a body style),
// so titles like "20 Used Cars ... from $3,999" must not count them.
export const MOTORCYCLE_MAKES = ['Harley-Davidson', 'Kawasaki', 'Yamaha', 'Ducati', 'Indian', 'Triumph', 'KTM']

// Live count and lowest price for a slice of the inventory, used in page
// titles ("13 Used SUVs ... from $7,999") so search results show real,
// current numbers. Sold and hidden cars are never counted.
export async function getInventoryStats({ types, maxPrice } = {}) {
  const where = [
    `status IN (${LIVE.map(() => '?').join(',')})`,
    `(make IS NULL OR make NOT IN (${MOTORCYCLE_MAKES.map(() => '?').join(',')}))`,
  ]
  const args = [...LIVE, ...MOTORCYCLE_MAKES]
  if (types?.length) {
    where.push(`type IN (${types.map(() => '?').join(',')})`)
    args.push(...types)
  }
  if (maxPrice) {
    where.push('price > 0 AND price < ?')
    args.push(maxPrice)
  }
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) AS count, MIN(NULLIF(price, 0)) AS minPrice FROM car WHERE ${where.join(' AND ')}`,
      ...args
    )
    const r = rows[0] || {}
    return { count: Number(r.count) || 0, minPrice: r.minPrice ? Number(r.minPrice) : null }
  } catch {
    return { count: 0, minPrice: null }
  }
}

export const formatPrice = (n) => `$${Number(n).toLocaleString('en-US')}`

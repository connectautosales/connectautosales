import { prisma } from '@/lib/prisma'

const LIVE = ['available', 'pending', 'coming_soon']

// Live count and lowest price for a slice of the inventory, used in page
// titles ("13 Used SUVs ... from $7,999") so search results show real,
// current numbers. Sold and hidden cars are never counted.
export async function getInventoryStats({ types, maxPrice } = {}) {
  const where = [`status IN (${LIVE.map(() => '?').join(',')})`]
  const args = [...LIVE]
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

import { prisma } from '@/lib/prisma'

const LIVE = ['available', 'pending', 'coming_soon']

import { MIN_INDEXED, makeSlug, tidy } from '@/lib/makeUtils'

export { MIN_INDEXED, makeSlug, tidy }

// Makes that keep a page (200, noindex) even when none are in stock, so a URL
// Google already knows doesn't flip to a 404 every time stock sells out.
export const COMMON_MAKES = [
  'acura', 'audi', 'bmw', 'buick', 'cadillac', 'chevrolet', 'chrysler', 'dodge', 'ford',
  'gmc', 'honda', 'hyundai', 'infiniti', 'jeep', 'kia', 'lexus', 'lincoln', 'mazda',
  'mercedes-benz', 'mitsubishi', 'nissan', 'ram', 'subaru', 'tesla', 'toyota', 'volkswagen', 'volvo',
]

// Display names for common makes, used when none are in stock to read from.
export const MAKE_NAMES = {
  bmw: 'BMW', gmc: 'GMC', 'mercedes-benz': 'Mercedes-Benz', ram: 'Ram', kia: 'Kia',
}

// Short, verifiable facts only. Leave a make out rather than guess.
export const MAKE_NOTES = {
  chevrolet: 'Chevrolet is built by General Motors, which is headquartered in Detroit.',
  gmc: 'GMC is the truck and SUV brand of General Motors, which is headquartered in Detroit.',
  buick: 'Buick is a General Motors brand, and GM is headquartered in Detroit.',
  cadillac: 'Cadillac is the luxury brand of General Motors, which is headquartered in Detroit.',
  ford: 'Ford is headquartered in Dearborn, a short drive from our lot.',
  lincoln: 'Lincoln is the luxury brand of Ford, which is headquartered in Dearborn.',
  dodge: 'Dodge is part of Stellantis, whose North American headquarters is in Auburn Hills, Michigan.',
  chrysler: 'Chrysler is part of Stellantis, whose North American headquarters is in Auburn Hills, Michigan.',
  jeep: 'Jeep is part of Stellantis, whose North American headquarters is in Auburn Hills, Michigan.',
  ram: 'Ram is part of Stellantis, whose North American headquarters is in Auburn Hills, Michigan.',
}

const clean = (rows) => JSON.parse(JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? Number(v) : v)))

// Live makes with their counts, e.g. [{ make: 'Chevrolet', slug: 'chevrolet', count: 3 }].
export async function getLiveMakes() {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT make, COUNT(*) AS count FROM car
       WHERE status IN (${LIVE.map(() => '?').join(',')}) AND make IS NOT NULL AND make <> ''
       GROUP BY make`,
      ...LIVE
    )
    const bySlug = {}
    for (const r of clean(rows)) {
      const slug = makeSlug(r.make)
      if (!slug) continue
      if (!bySlug[slug]) bySlug[slug] = { make: tidy(r.make), slug, count: 0 }
      bySlug[slug].count += Number(r.count) || 0
    }
    return Object.values(bySlug).sort((a, b) => b.count - a.count || a.make.localeCompare(b.make))
  } catch {
    return []
  }
}

// Live cars of one make, matched by slug so "GMC" and "Gmc" land together.
export async function getCarsByMake(slug) {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT id, stock, slug, year, make, model, trim, price, financePrice, mileage,
              titleType, type, images, status, isNewArrival, createdAt
       FROM car
       WHERE status IN (${LIVE.map(() => '?').join(',')})
       ORDER BY price ASC`,
      ...LIVE
    )
    return clean(rows).filter((c) => makeSlug(c.make) === slug)
  } catch {
    return []
  }
}

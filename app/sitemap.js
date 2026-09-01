import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://www.connectautosales.com'

const staticRoutes = [
  { url: '/',                   priority: 1.0,  changeFrequency: 'weekly' },
  { url: '/inventory',          priority: 0.9,  changeFrequency: 'daily'  },
  { url: '/financing',          priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/warranty',           priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/auction-services',   priority: 0.7,  changeFrequency: 'monthly' },
  { url: '/salvage-inspections',priority: 0.7,  changeFrequency: 'monthly' },
  { url: '/buy-direct',         priority: 0.7,  changeFrequency: 'monthly' },
  { url: '/transportation',     priority: 0.7,  changeFrequency: 'monthly' },
  { url: '/rebuilt-title',      priority: 0.6,  changeFrequency: 'monthly' },
  { url: '/contact',            priority: 0.6,  changeFrequency: 'monthly' },
  { url: '/about',              priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/privacy',            priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/terms',              priority: 0.3,  changeFrequency: 'yearly'  },
]

export default async function sitemap() {
  const now = new Date()

  const statics = staticRoutes.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  let dynamics = []
  try {
    const cars = await prisma.$queryRaw`
      SELECT slug, updatedAt FROM car
      WHERE status IN ('available', 'pending', 'coming_soon')
      ORDER BY createdAt DESC
    `
    dynamics = cars.map((car) => ({
      url: `${BASE_URL}/inventory/${car.slug}`,
      lastModified: car.updatedAt ?? now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {}

  return [...statics, ...dynamics]
}

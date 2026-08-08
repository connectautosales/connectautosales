import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import VehicleDetail from './VehicleDetail'

async function getCar(slug) {
  // Try by stock first (works for numeric and alphanumeric like "1755A")
  const byStock = await prisma.$queryRawUnsafe(`SELECT * FROM car WHERE stock = ? LIMIT 1`, slug)
  if (byStock[0]) return byStock[0]
  // Try by numeric ID
  if (/^\d+$/.test(slug)) {
    const byId = await prisma.$queryRawUnsafe(`SELECT * FROM car WHERE id = ? LIMIT 1`, parseInt(slug))
    return byId[0] || null
  }
  // Fall back to slug column
  const rows = await prisma.$queryRaw`SELECT * FROM car WHERE slug = ${slug} LIMIT 1`
  return rows[0] || null
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) return { title: 'Vehicle Not Found' }
  return {
    title: `${car.year} ${car.make} ${car.model}${car.trim ? ' ' + car.trim : ''} — Connect Auto Sales`,
  }
}

export default async function VehicleDetailPage({ params }) {
  const { slug } = await params

  const [car, settingsRows] = await Promise.all([
    getCar(slug),
    prisma.$queryRaw`SELECT * FROM sitesettings LIMIT 1`,
  ])

  if (!car) notFound()

  // If accessed via old named slug, redirect to stock number URL
  if (car.stock && slug !== String(car.stock) && !/^\d+$/.test(slug)) {
    redirect(`/inventory/${car.stock}`)
  }

  const settings = settingsRows[0] || null

  const serialized = JSON.parse(JSON.stringify(car, (_, v) =>
    typeof v === 'bigint' ? Number(v) : v
  ))

  return <VehicleDetail car={serialized} settings={settings} />
}

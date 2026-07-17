import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import VehicleDetail from './VehicleDetail'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const isNumeric = /^\d+$/.test(slug)
  const rows = isNumeric
    ? await prisma.$queryRaw`SELECT year, make, model, trim FROM car WHERE id = ${parseInt(slug)} LIMIT 1`
    : await prisma.$queryRaw`SELECT year, make, model, trim FROM car WHERE slug = ${slug} LIMIT 1`
  const car = rows[0]
  if (!car) return { title: 'Vehicle Not Found' }
  return {
    title: `${car.year} ${car.make} ${car.model}${car.trim ? ' ' + car.trim : ''} — Connect Auto Sales`,
  }
}

export default async function VehicleDetailPage({ params }) {
  const { slug } = await params
  const isNumeric = /^\d+$/.test(slug)

  const [carRows, settingsRows] = await Promise.all([
    isNumeric
      ? prisma.$queryRaw`SELECT * FROM car WHERE id = ${parseInt(slug)} LIMIT 1`
      : prisma.$queryRaw`SELECT * FROM car WHERE slug = ${slug} LIMIT 1`,
    prisma.$queryRaw`SELECT * FROM sitesettings LIMIT 1`,
  ])

  const car = carRows[0]
  if (!car) notFound()

  const settings = settingsRows[0] || null

  // Convert BigInt fields to numbers for JSON serialization
  const serialized = JSON.parse(JSON.stringify(car, (_, v) =>
    typeof v === 'bigint' ? Number(v) : v
  ))

  return <VehicleDetail car={serialized} settings={settings} />
}

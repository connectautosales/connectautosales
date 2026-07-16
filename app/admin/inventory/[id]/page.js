import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CarForm from '../CarForm'

export default async function EditCar({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const { id } = await params
  const car = await prisma.car.findUnique({ where: { id: parseInt(id) } })
  if (!car) notFound()

  return <CarForm car={car} />
}

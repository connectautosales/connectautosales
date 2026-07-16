import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CarForm from '../CarForm'

export default async function NewCar() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')
  return <CarForm />
}

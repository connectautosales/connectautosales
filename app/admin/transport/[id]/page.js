import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DetailView from '../../DetailView'

export default async function TransportDetail({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const { id } = await params
  const t = await prisma.transportRequest.findUnique({ where: { id: parseInt(id) } })
  if (!t) notFound()

  const fields = [
    { label: 'Name',    value: t.name },
    { label: 'Phone',   value: t.phone },
    { label: 'Email',   value: t.email },
    { label: 'From',    value: t.from },
    { label: 'To',      value: t.to },
    { label: 'Vehicle', value: t.vehicle },
    { label: 'Notes',   value: t.notes },
  ]

  return (
    <DetailView
      type="transport"
      item={t}
      fields={fields}
      title={`Transport Request — ${t.name || '#' + t.id}`}
      backHref="/admin/transport"
      statusOptions={[
        { value: 'new',       label: 'New' },
        { value: 'reviewed',  label: 'Reviewed' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'completed', label: 'Completed' },
      ]}
    />
  )
}

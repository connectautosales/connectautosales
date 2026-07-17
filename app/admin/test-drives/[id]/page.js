import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DetailView from '../../DetailView'

export default async function TestDriveDetail({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const { id } = await params
  const rows = await prisma.$queryRaw`SELECT * FROM testdriverequest WHERE id = ${parseInt(id)} LIMIT 1`
  const r = rows[0]
  if (!r) notFound()

  const fields = [
    { label: 'Full Name',       value: `${r.firstName || ''} ${r.lastName || ''}`.trim() || null },
    { label: 'Phone',           value: r.phone },
    { label: 'Email',           value: r.email },
    { label: 'Vehicle',         value: r.vehicle },
    { label: 'Preferred Date',  value: r.preferredDate },
    { label: 'Preferred Time',  value: r.preferredTime },
    { label: 'Notes',           value: r.notes },
  ]

  return (
    <DetailView
      type="testDrive"
      item={{ ...r, createdAt: new Date(r.createdAt) }}
      fields={fields}
      title={`Test Drive — ${r.firstName} ${r.lastName}`}
      backHref="/admin/test-drives"
      statusOptions={[
        { value: 'new',       label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ]}
    />
  )
}

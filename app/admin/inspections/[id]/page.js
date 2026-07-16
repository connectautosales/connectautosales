import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DetailView from '../../DetailView'

export default async function InspectionDetail({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const { id } = await params
  const i = await prisma.salvageInspection.findUnique({ where: { id: parseInt(id) } })
  if (!i) notFound()

  const fields = [
    { label: 'Name',         value: `${i.firstName || ''} ${i.lastName || ''}`.trim() || null },
    { label: 'Phone',        value: i.phone },
    { label: 'Email',        value: i.email },
    { label: 'Salvage Title', value: i.salvageTitle || null, type: 'file' },
    { label: 'Valid ID',     value: i.validId || null,      type: 'file' },
    { label: 'Receipts',     value: i.receipts || null,     type: 'file' },
    { label: 'Parts Changed', value: i.partsChanged },
  ]

  return (
    <DetailView
      type="inspection"
      item={i}
      fields={fields}
      title={`Salvage Inspection #${i.id}`}
      backHref="/admin/inspections"
      statusOptions={[
        { value: 'new',               label: 'New' },
        { value: 'documents-reviewed', label: 'Documents Reviewed' },
        { value: 'scheduled',         label: 'Scheduled' },
        { value: 'completed',         label: 'Completed' },
      ]}
    />
  )
}

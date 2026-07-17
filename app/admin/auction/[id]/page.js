import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DetailView from '../../DetailView'

export default async function AuctionDetail({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const { id } = await params
  const r = await prisma.$queryRaw`SELECT * FROM auctionrequest WHERE id = ${parseInt(id)} LIMIT 1`.then(r => r[0] || null)
  if (!r) notFound()

  const fields = [
    { label: 'Full Name', value: `${r.firstName} ${r.lastName}` },
    { label: 'Phone', value: r.phone },
    { label: 'Email', value: r.email },
    { label: 'Auction Link', value: r.auctionLink },
    { label: 'Lot Number', value: r.lotNumber },
    { label: 'Notes', value: r.notes },
  ]

  return (
    <DetailView
      type="auction"
      item={r}
      fields={fields}
      title={`Auction Request — ${r.firstName} ${r.lastName}`}
      backHref="/admin/auction"
      statusOptions={[
        { value: 'new',       label: 'New' },
        { value: 'reviewed',  label: 'Reviewed' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'completed', label: 'Completed' },
      ]}
    />
  )
}

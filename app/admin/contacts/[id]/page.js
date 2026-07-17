import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DetailView from '../../DetailView'

export default async function ContactDetail({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const { id } = await params
  const m = await prisma.$queryRaw`SELECT * FROM contactmessage WHERE id = ${parseInt(id)} LIMIT 1`.then(r => r[0] || null)
  if (!m) notFound()

  const fields = [
    { label: 'Name',    value: m.name },
    { label: 'Phone',   value: m.phone },
    { label: 'Email',   value: m.email },
    { label: 'Subject', value: m.subject },
    { label: 'Message', value: m.message },
  ]

  return (
    <DetailView
      type="contact"
      item={{ ...m, status: m.isRead ? 'read' : 'unread' }}
      fields={fields}
      title={`Message — ${m.name || 'Unknown'}`}
      backHref="/admin/contacts"
      statusOptions={[
        { value: 'unread', label: 'Unread' },
        { value: 'read',   label: 'Read / Replied' },
      ]}
    />
  )
}

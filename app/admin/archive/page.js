import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArchiveClient from './ArchiveClient'

export const dynamic = 'force-dynamic'

export default async function ArchivePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')
  if (session.user?.role !== 'super-admin') redirect('/admin')

  let records = []
  try {
    records = await prisma.$queryRaw`
      SELECT id, recordType, originalId, originalTable, data, deletedByEmail, deletedByRole, deletedAt
      FROM archivedrecord ORDER BY deletedAt DESC LIMIT 500
    `
  } catch {
    // archivedrecord table may not exist yet
  }

  const serializable = records.map(r => ({
    ...r,
    id: Number(r.id),
    originalId: Number(r.originalId),
    deletedAt: r.deletedAt?.toISOString?.() ?? String(r.deletedAt),
  }))

  return <ArchiveClient records={serializable} />
}

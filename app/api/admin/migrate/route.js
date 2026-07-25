import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// One-time migration endpoint — run once after deploy
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const results = []

  // Add role column to admin table
  try {
    await prisma.$executeRaw`ALTER TABLE admin ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'admin'`
    results.push('✅ Added role column to admin table')
  } catch (e) {
    if (e.message?.includes('Duplicate column')) {
      results.push('⏭️ role column already exists')
    } else {
      results.push(`❌ role column: ${e.message}`)
    }
  }

  // Create archivedrecord table
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS archivedrecord (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recordType VARCHAR(50) NOT NULL,
        originalId INT NOT NULL,
        originalTable VARCHAR(100) NOT NULL,
        data LONGTEXT NOT NULL,
        deletedByEmail VARCHAR(255),
        deletedByRole VARCHAR(20) DEFAULT 'admin',
        deletedAt DATETIME DEFAULT NOW(),
        INDEX idx_type (recordType),
        INDEX idx_deletedAt (deletedAt)
      )
    `
    results.push('✅ archivedrecord table ready')
  } catch (e) {
    results.push(`❌ archivedrecord table: ${e.message}`)
  }

  return NextResponse.json({ ok: true, results })
}

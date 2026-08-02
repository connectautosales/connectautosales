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

  // Add featured column to car table
  try {
    await prisma.$executeRaw`ALTER TABLE car ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0`
    results.push('Added featured column to car table')
  } catch (e) {
    if (e.message?.includes('Duplicate column')) {
      results.push('featured column already exists')
    } else {
      results.push(`featured column error: ${e.message}`)
    }
  }

  // Ensure all financing application columns exist
  const financingCols = [
    [`ALTER TABLE financingapplication ADD COLUMN homePhone VARCHAR(30) NULL`,          'homePhone'],
    [`ALTER TABLE financingapplication ADD COLUMN idType VARCHAR(50) NULL`,             'idType'],
    [`ALTER TABLE financingapplication ADD COLUMN idExpiration DATE NULL`,              'idExpiration'],
    [`ALTER TABLE financingapplication ADD COLUMN timeAtAddressYr VARCHAR(10) NULL`,   'timeAtAddressYr'],
    [`ALTER TABLE financingapplication ADD COLUMN timeAtAddressMo VARCHAR(10) NULL`,   'timeAtAddressMo'],
    [`ALTER TABLE financingapplication ADD COLUMN landlordName VARCHAR(100) NULL`,      'landlordName'],
    [`ALTER TABLE financingapplication ADD COLUMN landlordPhone VARCHAR(30) NULL`,      'landlordPhone'],
    [`ALTER TABLE financingapplication ADD COLUMN prevAddress VARCHAR(200) NULL`,       'prevAddress'],
    [`ALTER TABLE financingapplication ADD COLUMN prevCity VARCHAR(100) NULL`,          'prevCity'],
    [`ALTER TABLE financingapplication ADD COLUMN prevState VARCHAR(50) NULL`,          'prevState'],
    [`ALTER TABLE financingapplication ADD COLUMN prevZip VARCHAR(20) NULL`,            'prevZip'],
    [`ALTER TABLE financingapplication ADD COLUMN prevTimeAtAddressYr VARCHAR(10) NULL`, 'prevTimeAtAddressYr'],
    [`ALTER TABLE financingapplication ADD COLUMN prevTimeAtAddressMo VARCHAR(10) NULL`, 'prevTimeAtAddressMo'],
    [`ALTER TABLE financingapplication ADD COLUMN prevMonthlyRent VARCHAR(50) NULL`,     'prevMonthlyRent'],
    [`ALTER TABLE financingapplication ADD COLUMN incomeSource VARCHAR(100) NULL`,      'incomeSource'],
    [`ALTER TABLE financingapplication ADD COLUMN incomeAmount VARCHAR(50) NULL`,       'incomeAmount'],
    [`ALTER TABLE financingapplication ADD COLUMN incomeFrequency VARCHAR(50) NULL`,    'incomeFrequency'],
    [`ALTER TABLE financingapplication ADD COLUMN hoursPerWeek VARCHAR(20) NULL`,       'hoursPerWeek'],
    [`ALTER TABLE financingapplication ADD COLUMN occupation VARCHAR(100) NULL`,        'occupation'],
    [`ALTER TABLE financingapplication ADD COLUMN employerAddress VARCHAR(200) NULL`,    'employerAddress'],
    [`ALTER TABLE financingapplication ADD COLUMN employerCity VARCHAR(100) NULL`,      'employerCity'],
    [`ALTER TABLE financingapplication ADD COLUMN employerZip VARCHAR(20) NULL`,        'employerZip'],
    [`ALTER TABLE financingapplication ADD COLUMN employerState VARCHAR(50) NULL`,      'employerState'],
    [`ALTER TABLE financingapplication ADD COLUMN employerPhone VARCHAR(30) NULL`,      'employerPhone'],
    [`ALTER TABLE financingapplication ADD COLUMN supervisor VARCHAR(100) NULL`,        'supervisor'],
    [`ALTER TABLE financingapplication ADD COLUMN timeEmployedYr VARCHAR(10) NULL`,    'timeEmployedYr'],
    [`ALTER TABLE financingapplication ADD COLUMN timeEmployedMo VARCHAR(10) NULL`,    'timeEmployedMo'],
    [`ALTER TABLE financingapplication ADD COLUMN prevEmployer VARCHAR(100) NULL`,      'prevEmployer'],
    [`ALTER TABLE financingapplication ADD COLUMN addlIncome VARCHAR(10) NULL`,         'addlIncome'],
    [`ALTER TABLE financingapplication ADD COLUMN addlIncomeSource VARCHAR(100) NULL`,  'addlIncomeSource'],
    [`ALTER TABLE financingapplication ADD COLUMN addlIncomeAmount VARCHAR(50) NULL`,   'addlIncomeAmount'],
    [`ALTER TABLE financingapplication ADD COLUMN addlIncomeFreq VARCHAR(50) NULL`,     'addlIncomeFreq'],
    [`ALTER TABLE financingapplication ADD COLUMN vehicleMileage VARCHAR(50) NULL`,     'vehicleMileage'],
    [`ALTER TABLE financingapplication ADD COLUMN tradeInPaidOff VARCHAR(10) NULL`,     'tradeInPaidOff'],
    [`ALTER TABLE financingapplication ADD COLUMN tradeInPayoff VARCHAR(50) NULL`,      'tradeInPayoff'],
    [`ALTER TABLE financingapplication ADD COLUMN tradeInYear VARCHAR(10) NULL`,        'tradeInYear'],
    [`ALTER TABLE financingapplication ADD COLUMN tradeInMake VARCHAR(100) NULL`,       'tradeInMake'],
    [`ALTER TABLE financingapplication ADD COLUMN tradeInModel VARCHAR(100) NULL`,      'tradeInModel'],
    [`ALTER TABLE financingapplication ADD COLUMN tradeInMileage VARCHAR(50) NULL`,     'tradeInMileage'],
    [`ALTER TABLE financingapplication ADD COLUMN tradeInVin VARCHAR(50) NULL`,         'tradeInVin'],
    [`ALTER TABLE financingapplication ADD COLUMN additionalComments TEXT NULL`,        'additionalComments'],
    [`ALTER TABLE financingapplication ADD COLUMN referralSource VARCHAR(100) NULL`,    'referralSource'],
    [`ALTER TABLE financingapplication ADD COLUMN hasReference VARCHAR(10) NULL`,       'hasReference'],
    [`ALTER TABLE financingapplication ADD COLUMN refName VARCHAR(100) NULL`,           'refName'],
    [`ALTER TABLE financingapplication ADD COLUMN refPhone VARCHAR(30) NULL`,           'refPhone'],
    [`ALTER TABLE financingapplication ADD COLUMN refRelation VARCHAR(100) NULL`,       'refRelation'],
    [`ALTER TABLE financingapplication ADD COLUMN refAddress VARCHAR(200) NULL`,        'refAddress'],
  ]

  for (const [sql, col] of financingCols) {
    try {
      await prisma.$executeRawUnsafe(sql)
      results.push(`Added ${col} to financingapplication`)
    } catch (e) {
      if (e.message?.includes('Duplicate column')) {
        results.push(`${col} already exists`)
      } else {
        results.push(`Error adding ${col}: ${e.message}`)
      }
    }
  }

  return NextResponse.json({ ok: true, results })
}

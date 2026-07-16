import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await prisma.$queryRaw`SELECT * FROM SiteSettings LIMIT 1`
  if (rows.length === 0) {
    await prisma.$executeRaw`INSERT IGNORE INTO SiteSettings (id, updatedAt) VALUES (1, NOW())`
    const newRows = await prisma.$queryRaw`SELECT * FROM SiteSettings LIMIT 1`
    return NextResponse.json(newRows[0] ?? {})
  }
  return NextResponse.json(rows[0])
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const d = await req.json()

    await prisma.$executeRaw`
      INSERT INTO SiteSettings (
        id, businessName, tagline, phone, email,
        address, city, state, zip, mapLink,
        hoursMF, hoursSat, hoursSun,
        facebook, instagram, tiktok, youtube,
        aboutText, logoUrl, googlePlaceId, googleApiKey,
        inspFeeA, inspFeeB, inspFeePaper, inspFeeNote,
        defaultApr,
        updatedAt
      ) VALUES (
        1,
        ${d.businessName ?? null}, ${d.tagline ?? null}, ${d.phone ?? null}, ${d.email ?? null},
        ${d.address ?? null}, ${d.city ?? null}, ${d.state ?? null}, ${d.zip ?? null}, ${d.mapLink ?? null},
        ${d.hoursMF ?? null}, ${d.hoursSat ?? null}, ${d.hoursSun ?? null},
        ${d.facebook ?? null}, ${d.instagram ?? null}, ${d.tiktok ?? null}, ${d.youtube ?? null},
        ${d.aboutText ?? null}, ${d.logoUrl ?? null}, ${d.googlePlaceId ?? null}, ${d.googleApiKey ?? null},
        ${d.inspFeeA ?? 100}, ${d.inspFeeB ?? 100}, ${d.inspFeePaper ?? 50}, ${d.inspFeeNote ?? null},
        ${d.defaultApr ?? 6.99},
        NOW()
      )
      ON DUPLICATE KEY UPDATE
        businessName    = VALUES(businessName),
        tagline         = VALUES(tagline),
        phone           = VALUES(phone),
        email           = VALUES(email),
        address         = VALUES(address),
        city            = VALUES(city),
        state           = VALUES(state),
        zip             = VALUES(zip),
        mapLink         = VALUES(mapLink),
        hoursMF         = VALUES(hoursMF),
        hoursSat        = VALUES(hoursSat),
        hoursSun        = VALUES(hoursSun),
        facebook        = VALUES(facebook),
        instagram       = VALUES(instagram),
        tiktok          = VALUES(tiktok),
        youtube         = VALUES(youtube),
        aboutText       = VALUES(aboutText),
        logoUrl         = VALUES(logoUrl),
        googlePlaceId   = VALUES(googlePlaceId),
        googleApiKey    = VALUES(googleApiKey),
        inspFeeA        = VALUES(inspFeeA),
        inspFeeB        = VALUES(inspFeeB),
        inspFeePaper    = VALUES(inspFeePaper),
        inspFeeNote     = VALUES(inspFeeNote),
        defaultApr      = VALUES(defaultApr),
        updatedAt       = NOW()
    `

    const settings = await prisma.siteSettings.findFirst()
    return NextResponse.json(settings)
  } catch (e) {
    console.error('Settings save error:', e)
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

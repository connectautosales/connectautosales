import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Places API (New). The legacy place/details endpoint is closed to keys issued
// after March 2025, so try the current one first and fall back for older keys.
async function fetchFromGoogle(placeId, apiKey) {
  const attempts = []

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
      cache: 'no-store',
    })
    const data = await res.json()
    if (res.ok && typeof data.rating === 'number') {
      return {
        rating: data.rating,
        count: data.userRatingCount ?? null,
        reviews: (data.reviews || []).map((r) => ({
          authorName: r.authorAttribution?.displayName || 'Google user',
          authorPhoto: r.authorAttribution?.photoUri || null,
          rating: r.rating,
          text: r.originalText?.text || r.text?.text || '',
          time: r.publishTime ? Math.floor(new Date(r.publishTime).getTime() / 1000) : null,
        })),
      }
    }
    attempts.push(`v1:${res.status}:${data?.error?.status || data?.error?.message || 'no rating'}`)
  } catch (e) {
    attempts.push(`v1:threw:${e.message}`)
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&language=en&key=${apiKey}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    if (data.result && typeof data.result.rating === 'number') {
      return {
        rating: data.result.rating,
        count: data.result.user_ratings_total ?? null,
        reviews: (data.result.reviews || []).map((r) => ({
          authorName: r.author_name,
          authorPhoto: r.profile_photo_url,
          rating: r.rating,
          text: r.text,
          time: r.time,
        })),
      }
    }
    attempts.push(`legacy:${data?.status}:${data?.error_message || ''}`)
  } catch (e) {
    attempts.push(`legacy:threw:${e.message}`)
  }

  console.error('[reviews] Google lookup failed —', attempts.join(' | '))
  return null
}

export async function GET() {
  try {
    const settingsRows = await prisma.$queryRaw`SELECT * FROM sitesettings WHERE id = 1 LIMIT 1`
    const settings = settingsRows[0] || null

    if (!settings?.googlePlaceId || !settings?.googleApiKey) {
      console.error('[reviews] missing config —', {
        placeId: Boolean(settings?.googlePlaceId),
        apiKey: Boolean(settings?.googleApiKey),
      })
    }

    let live = null
    if (settings?.googlePlaceId && settings?.googleApiKey) {
      live = await fetchFromGoogle(settings.googlePlaceId, settings.googleApiKey)
    }

    if (live?.reviews?.length) {
      await prisma.$executeRaw`DELETE FROM review WHERE source = 'google'`
      for (const r of live.reviews) {
        await prisma.$executeRaw`
          INSERT INTO review (authorName, authorPhoto, rating, text, time, source)
          VALUES (${r.authorName}, ${r.authorPhoto}, ${r.rating}, ${r.text}, ${r.time}, 'google')
        `
      }
    }

    const reviews = await prisma.$queryRaw`SELECT * FROM review ORDER BY time DESC`

    // Only report a rating Google actually returned. Averaging the handful of
    // rows we cache locally would overstate both the score and the review count.
    return NextResponse.json({
      reviews,
      rating: live?.rating ?? null,
      count: live?.count ?? null,
    })
  } catch (e) {
    console.error('[reviews] route failed —', e.message)
    return NextResponse.json({ reviews: [], rating: null, count: null })
  }
}

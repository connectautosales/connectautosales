import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const settingsRows = await prisma.$queryRaw`SELECT * FROM sitesettings WHERE id = 1 LIMIT 1`
    const settings = settingsRows[0] || null

    let liveRating = null
    let liveCount  = null

    if (settings?.googlePlaceId && settings?.googleApiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${settings.googlePlaceId}&fields=rating,user_ratings_total,reviews&language=en&key=${settings.googleApiKey}`
        const res  = await fetch(url)
        const data = await res.json()

        if (data.result) {
          liveRating = data.result.rating
          liveCount  = data.result.user_ratings_total

          if (data.result.reviews?.length) {
            await prisma.$executeRaw`DELETE FROM review WHERE source = 'google'`
            for (const r of data.result.reviews) {
              await prisma.$executeRaw`
                INSERT INTO review (authorName, authorPhoto, rating, text, time, source)
                VALUES (${r.author_name}, ${r.profile_photo_url}, ${r.rating}, ${r.text}, ${r.time}, 'google')
              `
            }
          }
        }
      } catch (_) {}
    }

    const finalReviews = await prisma.$queryRaw`SELECT * FROM review ORDER BY time DESC`

    if (!liveRating && finalReviews.length) {
      const avg = finalReviews.reduce((s, r) => s + (r.rating || 5), 0) / finalReviews.length
      liveRating = Math.round(avg * 10) / 10
    }
    if (!liveCount && finalReviews.length) {
      liveCount = finalReviews.length
    }

    return NextResponse.json({ reviews: finalReviews, rating: liveRating, count: liveCount })
  } catch (e) {
    return NextResponse.json({ reviews: [], rating: null, count: null })
  }
}

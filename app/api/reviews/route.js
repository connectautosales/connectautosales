import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return cached reviews from DB
    const reviews = await prisma.review.findMany({
      orderBy: { time: 'desc' },
    })

    // Get settings for live rating from Google
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } })

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

          // Upsert fresh reviews into cache
          if (data.result.reviews?.length) {
            // Clear old google reviews and replace with fresh ones
            await prisma.review.deleteMany({ where: { source: 'google' } })
            await prisma.review.createMany({
              data: data.result.reviews.map(r => ({
                authorName:  r.author_name,
                authorPhoto: r.profile_photo_url,
                rating:      r.rating,
                text:        r.text,
                time:        r.time,
                source:      'google',
              }))
            })
          }
        }
      } catch (_) {}
    }

    const finalReviews = await prisma.review.findMany({ orderBy: { time: 'desc' } })

    // Fall back to calculating from DB if Google API didn't return live stats
    if (!liveRating && finalReviews.length) {
      const avg = finalReviews.reduce((s, r) => s + (r.rating || 5), 0) / finalReviews.length
      liveRating = Math.round(avg * 10) / 10
    }
    if (!liveCount && finalReviews.length) {
      liveCount = finalReviews.length
    }

    return NextResponse.json({
      reviews: finalReviews,
      rating:  liveRating,
      count:   liveCount,
    })
  } catch (e) {
    return NextResponse.json({ reviews: [], rating: null, count: null })
  }
}

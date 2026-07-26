import { NextResponse } from 'next/server'

// In-memory rate limit store (per serverless instance, resets on cold start)
// Limits bot spam — not a replacement for Redis-based rate limiting
const rateLimitMap = new Map()

const RATE_LIMITED_ROUTES = [
  '/api/contact',
  '/api/financing',
  '/api/auction',
  '/api/test-drive',
  '/api/transport',
  '/api/inspection',
]

const LIMIT = 5       // max requests
const WINDOW = 60000  // per 60 seconds

function isRateLimited(ip, path) {
  const key = `${ip}:${path}`
  const now = Date.now()
  const entry = rateLimitMap.get(key) || { count: 0, start: now }

  if (now - entry.start > WINDOW) {
    entry.count = 1
    entry.start = now
  } else {
    entry.count++
  }

  rateLimitMap.set(key, entry)
  return entry.count > LIMIT
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Rate limit public form submission endpoints
  if (RATE_LIMITED_ROUTES.some(r => pathname.startsWith(r)) && request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip, pathname)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      )
    }
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

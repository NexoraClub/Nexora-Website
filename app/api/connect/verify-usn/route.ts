import { NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import { createHmac } from 'node:crypto'
import { env } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import {
  CONNECT_SUPPORT_EMAIL,
  normalizeSignupUsn,
  rethrowNextControlFlow,
  requestErrorResponse,
} from '@/lib/connect/validation'

const lookupLimit = 10
const windowDurationMs = 15 * 60 * 1000

function getClientIp(req: Request): string {
  const ip =
    req.headers.get('x-real-ip')?.trim() ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    (process.env.NODE_ENV !== 'production' ? 'local-development' : '')
  if (!ip) throw new Error('Trusted client IP header is unavailable for USN lookup throttling.')
  return ip
}

function getIpHash(ip: string): string {
  const secret = env.CONNECT_LOOKUP_HMAC_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('CONNECT_LOOKUP_HMAC_SECRET must be configured with at least 32 characters.')
  }
  return createHmac('sha256', secret).update(ip).digest('hex')
}

export async function GET(req: Request) {
  try {
    const usn = normalizeSignupUsn(new URL(req.url).searchParams.get('usn'))
    const ipHash = getIpHash(getClientIp(req))
    const [limitState] = await prisma.$queryRaw<
      Array<{ attempts: number; window_started_at: Date }>
    >(Prisma.sql`
      INSERT INTO "connect_usn_lookup_rate_limits"
        ("ip_hash", "window_started_at", "attempts", "updated_at")
      VALUES (${ipHash}, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
      ON CONFLICT ("ip_hash") DO UPDATE
      SET
        "attempts" = CASE
          WHEN "connect_usn_lookup_rate_limits"."window_started_at"
            <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
          THEN 1
          ELSE "connect_usn_lookup_rate_limits"."attempts" + 1
        END,
        "window_started_at" = CASE
          WHEN "connect_usn_lookup_rate_limits"."window_started_at"
            <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
          THEN CURRENT_TIMESTAMP
          ELSE "connect_usn_lookup_rate_limits"."window_started_at"
        END,
        "updated_at" = CURRENT_TIMESTAMP
      RETURNING "attempts", "window_started_at"
    `)
    await prisma.$executeRaw(Prisma.sql`
      DELETE FROM "connect_usn_lookup_rate_limits"
      WHERE "updated_at" < CURRENT_TIMESTAMP - INTERVAL '24 hours'
    `)
    if (limitState.attempts > lookupLimit) {
      const windowEndsAt = limitState.window_started_at.getTime() + windowDurationMs
      const retryAfter = Math.max(1, Math.ceil((windowEndsAt - Date.now()) / 1000))
      return NextResponse.json(
        { error: 'Too many USN verification attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Cache-Control': 'no-store', 'Retry-After': String(retryAfter) },
        }
      )
    }

    const existingProfile = await prisma.memberProfile.findUnique({
      where: { usn },
      select: { authUserId: true },
    })
    if (existingProfile) {
      return NextResponse.json(
        {
          valid: false,
          error: `This USN is already linked to a Connect profile. Contact ${CONNECT_SUPPORT_EMAIL} if you think this is a mistake.`,
        },
        { status: 409, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const entry = await prisma.usnRosterEntry.findFirst({
      where: { usn, isActive: true },
      select: { fullName: true },
    })

    if (!entry) {
      return NextResponse.json(
        {
          valid: false,
          error: `Enter a valid USN or contact ${CONNECT_SUPPORT_EMAIL} if you think this is a mistake.`,
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json(
      { valid: true, fullName: entry.fullName },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    rethrowNextControlFlow(error)
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError
    console.error('Connect USN verification failed:', error)
    return NextResponse.json(
      { error: 'Unable to verify this USN right now.' },
      { status: 500 }
    )
  }
}

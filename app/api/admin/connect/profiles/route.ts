import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  getAuthenticatedConnectAdmin,
  isSameOriginRequest,
} from '@/lib/connect/auth'
import {
  ConnectRequestError,
  normalizePersonName,
  readJsonObject,
  requestErrorResponse,
  requiredString,
  uuidString,
} from '@/lib/connect/validation'

function parsePage(value: string | null, name: string, max: number) {
  if (value === null) return 1
  if (!/^\d+$/.test(value)) throw new ConnectRequestError(`${name} must be a positive integer.`)
  const number = Number(value)
  if (number < 1 || number > max) {
    throw new ConnectRequestError(`${name} must be between 1 and ${max}.`)
  }
  return number
}

function isModeratorRole(role: string) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

export async function GET(req: Request) {
  try {
    const admin = await getAuthenticatedConnectAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    if (!isModeratorRole(admin.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? 'PENDING'
    if (!['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'ALL'].includes(status)) {
      throw new ConnectRequestError('Invalid profile status filter.')
    }
    const page = parsePage(searchParams.get('page'), 'page', 1_000_000)
    const limit = parsePage(searchParams.get('limit'), 'limit', 100)
    const where = status === 'ALL' ? {} : { approvalStatus: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' }

    const [profiles, total] = await prisma.$transaction([
      prisma.memberProfile.findMany({
        where,
        select: {
          authUserId: true,
          slug: true,
          usn: true,
          fullName: true,
          graduationYear: true,
          memberType: true,
          bio: true,
          approvalStatus: true,
          reviewNote: true,
          reviewedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.memberProfile.count({ where }),
    ])

    const roster = await prisma.usnRosterEntry.findMany({
      where: { usn: { in: profiles.map((profile) => profile.usn) }, isActive: true },
      select: { usn: true, fullName: true },
    })
    const rosterNames = new Map(roster.map((entry) => [entry.usn, entry.fullName]))

    return NextResponse.json({
      profiles: profiles.map(({ usn, ...profile }) => {
        const rosterName = rosterNames.get(usn)
        return {
          ...profile,
          usn,
          rosterName: rosterName ?? null,
          rosterNameMatches:
            rosterName !== undefined &&
            normalizePersonName(rosterName) === normalizePersonName(profile.fullName),
        }
      }),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError
    console.error('Connect profile moderation list failed:', error)
    return NextResponse.json({ error: 'Failed to load member profiles.' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: 'Forbidden request origin.' }, { status: 403 })
    }

    const admin = await getAuthenticatedConnectAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    if (!isModeratorRole(admin.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    const body = await readJsonObject(req)
    const authUserId = uuidString(body.authUserId, 'authUserId')
    const status = body.status
    if (status !== 'APPROVED' && status !== 'REJECTED' && status !== 'SUSPENDED') {
      throw new ConnectRequestError('status must be APPROVED, REJECTED, or SUSPENDED.')
    }
    const reviewNote =
      body.reviewNote === undefined || body.reviewNote === null || body.reviewNote === ''
        ? null
        : requiredString(body.reviewNote, 'reviewNote', 2000)
    if (status !== 'APPROVED' && !reviewNote) {
      throw new ConnectRequestError('A reviewNote is required when rejecting or suspending a profile.')
    }

    const profile = await prisma.memberProfile.findUnique({
      where: { authUserId },
      select: { authUserId: true, usn: true, fullName: true, approvalStatus: true },
    })
    if (!profile) return NextResponse.json({ error: 'Member profile not found.' }, { status: 404 })

    if (status === 'APPROVED') {
      const rosterEntry = await prisma.usnRosterEntry.findFirst({
        where: { usn: profile.usn, isActive: true },
        select: { fullName: true },
      })
      if (
        !rosterEntry ||
        normalizePersonName(rosterEntry.fullName) !== normalizePersonName(profile.fullName)
      ) {
        return NextResponse.json(
          { error: 'The profile name does not match the official roster and cannot be approved.' },
          { status: 422 }
        )
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.memberProfile.update({
        where: { authUserId },
        data: {
          approvalStatus: status,
          reviewNote,
          reviewedById: admin.id,
          reviewedAt: new Date(),
        },
      })
      await tx.auditLog.create({
        data: {
          action: 'REVIEW',
          entity: 'Connect member profile',
          entityId: authUserId,
          details: `Profile review changed from ${profile.approvalStatus} to ${status}.`,
          adminId: admin.id,
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        },
      })
    })

    return NextResponse.json({ success: true, status })
  } catch (error) {
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError
    console.error('Connect profile moderation update failed:', error)
    return NextResponse.json({ error: 'Failed to update profile review status.' }, { status: 500 })
  }
}

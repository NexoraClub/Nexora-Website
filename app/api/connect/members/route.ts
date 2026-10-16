import { NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { publicMemberProfileSelect, toPublicMemberProfile } from '@/lib/connect/public-profile'
import {
  ConnectRequestError,
  requestErrorResponse,
  rethrowNextControlFlow,
} from '@/lib/connect/validation'

function parseBoundedInteger(value: string | null, name: string, min: number, max: number, fallback: number) {
  if (value === null) return fallback
  if (!/^\d+$/.test(value)) {
    throw new ConnectRequestError(`${name} must be a whole number.`)
  }
  const number = Number(value)
  if (number < min || number > max) {
    throw new ConnectRequestError(`${name} must be between ${min} and ${max}.`)
  }
  return number
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseBoundedInteger(searchParams.get('page'), 'page', 1, 1_000_000, 1)
    const limit = parseBoundedInteger(searchParams.get('limit'), 'limit', 1, 50, 20)
    const search = searchParams.get('q')?.trim() ?? ''
    if (search.length > 100) throw new ConnectRequestError('q cannot exceed 100 characters.')

    const memberType = searchParams.get('memberType')
    if (memberType && memberType !== 'STUDENT' && memberType !== 'ALUMNUS') {
      throw new ConnectRequestError('memberType must be STUDENT or ALUMNUS.')
    }
    const memberTypeFilter: 'STUDENT' | 'ALUMNUS' | undefined =
      memberType === 'STUDENT' || memberType === 'ALUMNUS' ? memberType : undefined

    const yearParam = searchParams.get('graduationYear')
    const graduationYear = yearParam === null
      ? undefined
      : parseBoundedInteger(yearParam, 'graduationYear', 1980, new Date().getFullYear() + 8, 0)
    const skill = searchParams.get('skill')?.trim()
    if (skill && (skill.length > 60 || skill.length < 1)) {
      throw new ConnectRequestError('skill must be between 1 and 60 characters.')
    }

    const where: Prisma.MemberProfileWhereInput = {
      approvalStatus: 'APPROVED' as const,
      visibility: 'PUBLIC' as const,
      ...(memberTypeFilter ? { memberType: memberTypeFilter } : {}),
      ...(graduationYear !== undefined ? { graduationYear } : {}),
      ...(skill ? { skills: { has: skill } } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' as const } },
              { currentRole: { contains: search, mode: 'insensitive' as const } },
              { company: { contains: search, mode: 'insensitive' as const } },
              { bio: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const [profiles, total] = await Promise.all([
      prisma.memberProfile.findMany({
        where,
        select: publicMemberProfileSelect,
        orderBy: [{ fullName: 'asc' }, { authUserId: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.memberProfile.count({ where }),
    ])

    return NextResponse.json(
      {
        profiles: profiles.map(toPublicMemberProfile),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { headers: { 'Cache-Control': 'private, no-store' } }
    )
  } catch (error) {
    rethrowNextControlFlow(error)
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError

    console.error('Connect directory fetch failed:', error)
    return NextResponse.json({ error: 'Failed to load the Connect directory.' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getAuthenticatedMember } from '@/lib/connect/auth'
import { prisma } from '@/lib/prisma'
import { rethrowNextControlFlow } from '@/lib/connect/validation'

export async function GET() {
  try {
    const user = await getAuthenticatedMember()
    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { headers: { 'Cache-Control': 'private, no-store' } }
      )
    }

    const profile = await prisma.memberProfile.findUnique({
      where: { authUserId: user.id },
      select: { slug: true, approvalStatus: true, visibility: true },
    })
    return NextResponse.json(
      {
        authenticated: true,
        emailVerified: Boolean(user.email_confirmed_at),
        user: { id: user.id, email: user.email ?? null },
        profile,
      },
      { headers: { 'Cache-Control': 'private, no-store' } }
    )
  } catch (error) {
    rethrowNextControlFlow(error)
    console.error('Connect session lookup failed:', error)
    return NextResponse.json({ error: 'Unable to verify the current session.' }, { status: 500 })
  }
}

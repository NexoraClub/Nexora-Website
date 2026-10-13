import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || ''

    const where: any = {
      status: 'PUBLISHED',
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' }
    }

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [{ achievementDate: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ achievements })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err
    }
    console.error('Public achievements fetch error:', err)
    return NextResponse.json({ achievements: [] }, { status: 500 })
  }
}

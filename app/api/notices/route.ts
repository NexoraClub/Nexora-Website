import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || ''
    const priority = searchParams.get('priority') || ''
    const search = searchParams.get('search')?.trim() || ''

    const where: any = {
      status: 'PUBLISHED',
    }

    if (category && category !== 'All Notices') {
      where.category = { equals: category, mode: 'insensitive' }
    }

    if (priority) {
      where.priority = priority
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const notices = await prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }],
    })

    const serialized = notices.map((n) => ({
      ...n,
      id: n.id.toString(),
      date: n.date.toISOString().slice(0, 10),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
      publishDate: n.publishDate ? n.publishDate.toISOString() : null,
      expiryDate: n.expiryDate ? n.expiryDate.toISOString() : null,
    }))

    return NextResponse.json({ notices: serialized })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err
    }
    console.error('Public notices fetch error:', err)
    return NextResponse.json({ notices: [] }, { status: 500 })
  }
}

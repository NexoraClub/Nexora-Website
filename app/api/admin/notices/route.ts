import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedAdmin, recordAuditLog } from '@/lib/admin-auth'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim() || ''
    const category = searchParams.get('category') || ''
    const priority = searchParams.get('priority') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category) where.category = category
    if (priority) where.priority = priority
    if (status) where.status = status

    const notices = await prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { date: 'desc' }],
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    })

    const serialized = notices.map((n) => ({
      ...n,
      id: n.id.toString(),
    }))

    return NextResponse.json({ notices: serialized })
  } catch (err: unknown) {
    console.error('Fetch notices error:', err)
    return NextResponse.json({ error: 'Failed to fetch notices.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      summary,
      content,
      category,
      priority,
      status,
      date,
      publishDate,
      expiryDate,
      image,
      attachmentUrl,
      attachmentType,
      attachmentName,
      isPinned,
      authorName,
      authorRole,
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Notice title is required.' }, { status: 400 })
    }

    let slug = body.slug ? generateSlug(body.slug) : generateSlug(title)
    const existing = await prisma.notice.findFirst({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        slug,
        summary: summary || null,
        content: content || null,
        category: category || 'General',
        priority: priority || 'NORMAL',
        status: status || 'PUBLISHED',
        date: date ? new Date(date) : new Date(),
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        image: image || null,
        attachmentUrl: attachmentUrl || null,
        attachmentType: attachmentType || null,
        attachmentName: attachmentName || null,
        isPinned: isPinned ?? false,
        authorName: authorName || 'Nexora Executive Board',
        authorRole: authorRole || 'ISE Department',
        createdById: admin.id,
      },
    })

    await recordAuditLog({
      action: 'CREATE',
      entity: 'Notice',
      entityId: notice.id.toString(),
      details: `Created notice "${notice.title}" (${notice.priority})`,
      adminId: admin.id,
    })

    return NextResponse.json({
      success: true,
      notice: {
        ...notice,
        id: notice.id.toString(),
      },
    })
  } catch (err: unknown) {
    console.error('Create notice error:', err)
    return NextResponse.json({ error: 'Failed to create notice.' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const body = await req.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Notice ID required.' }, { status: 400 })
    }

    const noticeId = BigInt(id)
    const updateData: any = {}
    if (data.title) updateData.title = data.title
    if (data.summary !== undefined) updateData.summary = data.summary
    if (data.content !== undefined) updateData.content = data.content
    if (data.category) updateData.category = data.category
    if (data.priority) updateData.priority = data.priority
    if (data.status) updateData.status = data.status
    if (data.date) updateData.date = new Date(data.date)
    if (data.publishDate !== undefined) updateData.publishDate = data.publishDate ? new Date(data.publishDate) : null
    if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null
    if (data.image !== undefined) updateData.image = data.image
    if (data.attachmentUrl !== undefined) updateData.attachmentUrl = data.attachmentUrl
    if (data.attachmentType !== undefined) updateData.attachmentType = data.attachmentType
    if (data.attachmentName !== undefined) updateData.attachmentName = data.attachmentName
    if (data.isPinned !== undefined) updateData.isPinned = data.isPinned
    if (data.authorName !== undefined) updateData.authorName = data.authorName
    if (data.authorRole !== undefined) updateData.authorRole = data.authorRole

    const notice = await prisma.notice.update({
      where: { id: noticeId },
      data: updateData,
    })

    await recordAuditLog({
      action: 'UPDATE',
      entity: 'Notice',
      entityId: id.toString(),
      details: `Updated notice "${notice.title}"`,
      adminId: admin.id,
    })

    return NextResponse.json({
      success: true,
      notice: {
        ...notice,
        id: notice.id.toString(),
      },
    })
  } catch (err: unknown) {
    console.error('Update notice error:', err)
    return NextResponse.json({ error: 'Failed to update notice.' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Notice ID required.' }, { status: 400 })
    }

    const noticeId = BigInt(id)
    const notice = await prisma.notice.delete({
      where: { id: noticeId },
    })

    await recordAuditLog({
      action: 'DELETE',
      entity: 'Notice',
      entityId: id,
      details: `Deleted notice "${notice.title}"`,
      adminId: admin.id,
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Delete notice error:', err)
    return NextResponse.json({ error: 'Failed to delete notice.' }, { status: 500 })
  }
}

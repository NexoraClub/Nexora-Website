import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken, type AdminUser } from '@/lib/admin-auth'
import type { User } from '@supabase/supabase-js'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    throw new Error('Supabase authentication is not configured.')
  }

  return { url, key }
}

export async function createConnectSupabaseServerClient() {
  const { url, key } = getSupabaseConfig()
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options)
        }
      },
    },
  })
}

export async function getAuthenticatedMember(): Promise<User | null> {
  const supabase = await createConnectSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    if (error.name === 'AuthSessionMissingError' || error.status === 401) {
      return null
    }

    throw new Error('Unable to verify the member session.', { cause: error })
  }

  return data.user
}

export async function getVerifiedMember(): Promise<User | null> {
  const user = await getAuthenticatedMember()
  if (!user?.email || !user.email_confirmed_at) return null
  return user
}

export async function getAuthenticatedConnectAdmin(req: Request): Promise<AdminUser | null> {
  const cookieHeader = req.headers.get('cookie') ?? ''
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/)
  const token = cookieMatch?.[1]
  if (!token) return null

  const tokenAdmin = verifyAdminToken(token)
  if (!tokenAdmin) return null

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const [session, admin] = await Promise.all([
    prisma.activeSession.findUnique({ where: { tokenHash } }),
    prisma.admin.findUnique({
      where: { id: tokenAdmin.id },
      select: { id: true, email: true, name: true, role: true },
    }),
  ])

  if (
    !session ||
    !admin ||
    session.expiresAt <= new Date() ||
    session.adminEmail !== admin.email
  ) {
    return null
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  }
}

export function isSameOriginRequest(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return false

  try {
    return new URL(origin).origin === new URL(req.url).origin
  } catch {
    return false
  }
}

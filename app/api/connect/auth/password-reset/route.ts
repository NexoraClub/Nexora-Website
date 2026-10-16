import { NextResponse } from 'next/server'
import { createConnectSupabaseServerClient, getConnectAppUrl, isSameOriginRequest } from '@/lib/connect/auth'
import { consumeConnectAuthAttempt } from '@/lib/connect/usn'
import {
  optionalEmail,
  readJsonObject,
  requestErrorResponse,
  rethrowNextControlFlow,
} from '@/lib/connect/validation'

export async function POST(req: Request) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: 'Forbidden request origin.' }, { status: 403 })
    }

    const body = await readJsonObject(req)
    const email = optionalEmail(body.email, 'email')
    if (!email) {
      return NextResponse.json(
        { success: true, message: 'If the account exists, password reset instructions will be emailed.' },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const rateLimit = await consumeConnectAuthAttempt(req, 'password-reset')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Cache-Control': 'no-store', 'Retry-After': String(rateLimit.retryAfter) },
        }
      )
    }

    const supabase = await createConnectSupabaseServerClient()
    const redirectTo = new URL('/api/connect/auth/callback', getConnectAppUrl(req))
    redirectTo.searchParams.set('next', '/')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo.toString(),
    })
    if (error) {
      console.error('Connect password reset request failed:', error.message)
      const status = error.status === 429 ? 429 : 502
      return NextResponse.json(
        { error: status === 429 ? 'Password reset is temporarily rate limited.' : 'Unable to send a password reset email right now.' },
        { status, headers: status === 429 ? { 'Retry-After': '60' } : undefined }
      )
    }

    return NextResponse.json(
      { success: true, message: 'If the account exists, password reset instructions will be emailed.' },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    rethrowNextControlFlow(error)
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError
    console.error('Connect password reset request failed:', error)
    return NextResponse.json({ error: 'Unable to send a password reset email right now.' }, { status: 500 })
  }
}

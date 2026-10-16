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
    const email = optionalEmail(body.email, 'email')?.toLowerCase()
    if (!email) {
      return NextResponse.json(
        { success: true, message: 'If the account needs confirmation, a new email will be sent.' },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const rateLimit = await consumeConnectAuthAttempt(req, 'signup-resend')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many confirmation requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Cache-Control': 'no-store', 'Retry-After': String(rateLimit.retryAfter) },
        }
      )
    }

    const callback = new URL('/api/connect/auth/callback', getConnectAppUrl(req))
    callback.searchParams.set('next', '/connect/start')
    const supabase = await createConnectSupabaseServerClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: callback.toString() },
    })
    if (error) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Confirmation email is temporarily rate limited. Please try again later.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
      console.error('Connect confirmation resend failed:', error.message)
      return NextResponse.json(
        {
          error: 'Supabase could not send the confirmation email. Its default mailer only sends to project team addresses; configure a custom SMTP provider in Supabase Auth settings to email other members.',
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'If the account needs confirmation, a new email will be sent.' },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    rethrowNextControlFlow(error)
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError
    console.error('Connect confirmation resend request failed:', error)
    return NextResponse.json({ error: 'Unable to resend the confirmation email right now.' }, { status: 500 })
  }
}

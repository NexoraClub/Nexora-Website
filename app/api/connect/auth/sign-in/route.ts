import { NextResponse } from 'next/server'
import { createConnectSupabaseServerClient, isSameOriginRequest } from '@/lib/connect/auth'
import { consumeConnectAuthAttempt } from '@/lib/connect/usn'
import {
  ConnectRequestError,
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
    if (!email || typeof body.password !== 'string' || body.password.length < 1 || body.password.length > 128) {
      throw new ConnectRequestError('Valid email and password are required.')
    }

    const rateLimit = await consumeConnectAuthAttempt(req, 'signin')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many sign-in attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Cache-Control': 'no-store', 'Retry-After': String(rateLimit.retryAfter) },
        }
      )
    }

    const supabase = await createConnectSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: body.password,
    })
    if (error && (error.status === 400 || error.status === 401)) {
      return NextResponse.json(
        { error: 'Invalid email or password, or the email has not been verified.' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    if (error) {
      console.error('Connect signin failed:', error.message)
      const status = error.status === 429 ? 429 : 502
      return NextResponse.json(
        { error: status === 429 ? 'Sign-in is temporarily rate limited.' : 'Unable to sign in right now.' },
        { status, headers: status === 429 ? { 'Retry-After': '60' } : undefined }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Invalid email or password, or the email has not been verified.' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: { id: data.user.id, email: data.user.email },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    rethrowNextControlFlow(error)
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError
    console.error('Connect signin failed:', error)
    return NextResponse.json({ error: 'Unable to sign in right now.' }, { status: 500 })
  }
}

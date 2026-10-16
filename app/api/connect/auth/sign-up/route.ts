import { NextResponse } from 'next/server'
import { createConnectSupabaseServerClient, getConnectAppUrl, isSameOriginRequest } from '@/lib/connect/auth'
import { consumeConnectAuthAttempt, verifySignupUsn } from '@/lib/connect/usn'
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
    if (!email) throw new ConnectRequestError('email is required.')
    if (typeof body.password !== 'string' || body.password.length < 12 || body.password.length > 128) {
      throw new ConnectRequestError('password must be between 12 and 128 characters.')
    }

    const rateLimit = await consumeConnectAuthAttempt(req, 'usn')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many signup verification attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Cache-Control': 'no-store', 'Retry-After': String(rateLimit.retryAfter) },
        }
      )
    }

    const verification = await verifySignupUsn(body.usn)
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error },
        { status: verification.status, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const supabase = await createConnectSupabaseServerClient()
    const callback = new URL('/api/connect/auth/callback', getConnectAppUrl(req))
    callback.searchParams.set('next', '/connect/start')
    const { error } = await supabase.auth.signUp({
      email,
      password: body.password,
      options: {
        data: { connect_usn: verification.usn },
        emailRedirectTo: callback.toString(),
      },
    })

    if (error) {
      if (error.code === 'user_already_exists' || error.code === 'email_exists') {
        return NextResponse.json(
          {
            success: true,
            officialName: verification.fullName,
            message: 'If signup can proceed, check your email to verify your account.',
          },
          { status: 202, headers: { 'Cache-Control': 'no-store' } }
        )
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Signup is temporarily rate limited. Please try again later.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
      console.error('Connect signup failed:', error.message)
      return NextResponse.json({ error: 'Unable to start signup right now.' }, { status: 502 })
    }

    return NextResponse.json(
      {
        success: true,
        officialName: verification.fullName,
        message: 'If signup can proceed, check your email to verify your account.',
      },
      { status: 202, headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    rethrowNextControlFlow(error)
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError
    console.error('Connect signup request failed:', error)
    return NextResponse.json({ error: 'Unable to start signup right now.' }, { status: 500 })
  }
}

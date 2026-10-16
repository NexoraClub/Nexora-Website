import { NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { createConnectSupabaseServerClient, getConnectAppUrl, isSameOriginRequest } from '@/lib/connect/auth'
import { CONNECT_MAX_PASSWORD_LENGTH, CONNECT_MIN_PASSWORD_LENGTH } from '@/lib/connect/constants'
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
    if (
      typeof body.password !== 'string' ||
      body.password.length < CONNECT_MIN_PASSWORD_LENGTH ||
      body.password.length > CONNECT_MAX_PASSWORD_LENGTH
    ) {
      throw new ConnectRequestError(
        `Password must be between ${CONNECT_MIN_PASSWORD_LENGTH} and ${CONNECT_MAX_PASSWORD_LENGTH} characters.`
      )
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

    let registration: { id: string }
    try {
      registration = await prisma.connectRegistration.create({
        data: { email, usn: verification.usn, fullName: verification.fullName },
        select: { id: true },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return NextResponse.json(
          { error: 'We could not start signup with those details. If you already have an account, sign in or resend your confirmation email.' },
          { status: 409, headers: { 'Cache-Control': 'no-store' } }
        )
      }
      throw error
    }

    let signupResult
    try {
      signupResult = await supabase.auth.signUp({
        email,
        password: body.password,
        options: {
          data: { connect_usn: verification.usn },
          emailRedirectTo: callback.toString(),
        },
      })
    } catch (error) {
      await prisma.connectRegistration.delete({ where: { id: registration.id } })
      throw error
    }
    const { data, error } = signupResult

    if (error) {
      if (error.code === 'user_already_exists' || error.code === 'email_exists') {
        await prisma.connectRegistration.delete({ where: { id: registration.id } })
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
        await prisma.connectRegistration.delete({ where: { id: registration.id } })
        return NextResponse.json(
          { error: 'Signup is temporarily rate limited. Please try again later.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
      await prisma.connectRegistration.delete({ where: { id: registration.id } })
      if (
        (error.status !== undefined && error.status >= 500) ||
        /email address not authorized|error sending confirmation email|failed to send.*email|smtp/i.test(error.message)
      ) {
        console.error('Connect signup confirmation email could not be sent:', error.message)
        return NextResponse.json(
          {
            error: 'Supabase could not send the confirmation email. Its default mailer only sends to project team addresses; configure a custom SMTP provider in Supabase Auth settings to email other members.',
          },
          { status: 502 }
        )
      }
      console.error('Connect signup failed:', error.message)
      return NextResponse.json({ error: 'Unable to start signup right now.' }, { status: 502 })
    }

    if (data.user?.identities?.length === 0) {
      await prisma.connectRegistration.delete({ where: { id: registration.id } })
      return NextResponse.json(
        {
          success: true,
          authenticated: false,
          officialName: verification.fullName,
          message: 'If signup can proceed, check your email. If you already have an account, sign in or request a new confirmation link.',
        },
        { status: 202, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    if (!data.user?.id) {
      await prisma.connectRegistration.delete({ where: { id: registration.id } })
      console.error('Connect signup returned no user record.')
      return NextResponse.json({ error: 'Unable to start signup right now.' }, { status: 502 })
    }

    await prisma.connectRegistration.update({
      where: { id: registration.id },
      data: {
        authUserId: data.user.id,
        emailConfirmedAt: data.user.email_confirmed_at ? new Date(data.user.email_confirmed_at) : null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        authenticated: Boolean(data.session),
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

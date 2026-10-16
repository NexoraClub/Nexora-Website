import { NextResponse } from 'next/server'
import { createConnectSupabaseServerClient, getConnectAppUrl } from '@/lib/connect/auth'

export async function GET(req: Request) {
  const requestUrl = new URL(req.url)
  let appUrl: URL
  try {
    appUrl = getConnectAppUrl(req)
  } catch (error) {
    console.error('Connect auth callback configuration error:', error)
    return NextResponse.json(
      { error: 'Connect authentication callback is not configured.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
  const code = requestUrl.searchParams.get('code')
  const requestedNext = requestUrl.searchParams.get('next')
  let next = '/'
  if (requestedNext?.startsWith('/') && !requestedNext.startsWith('//')) {
    try {
      const destination = new URL(requestedNext, appUrl.origin)
      if (destination.origin === appUrl.origin) {
        next = `${destination.pathname}${destination.search}${destination.hash}`
      }
    } catch {
      next = '/'
    }
  }

  if (!code) {
    const failure = new URL(next, appUrl.origin)
    failure.searchParams.set('authError', 'confirmation_failed')
    return NextResponse.redirect(failure)
  }

  try {
    const supabase = await createConnectSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    const destination = new URL(next, appUrl.origin)
    if (error) {
      destination.searchParams.set('authError', 'confirmation_failed')
    }
    return NextResponse.redirect(destination)
  } catch (error) {
    console.error('Connect auth callback failed:', error)
    const destination = new URL(next, appUrl.origin)
    destination.searchParams.set('authError', 'confirmation_failed')
    return NextResponse.redirect(destination)
  }
}

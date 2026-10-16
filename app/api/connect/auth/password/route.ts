import { NextResponse } from 'next/server'
import { createConnectSupabaseServerClient, getVerifiedMember, isSameOriginRequest } from '@/lib/connect/auth'
import {
  ConnectRequestError,
  readJsonObject,
  requestErrorResponse,
  rethrowNextControlFlow,
} from '@/lib/connect/validation'

export async function PATCH(req: Request) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: 'Forbidden request origin.' }, { status: 403 })
    }

    const user = await getVerifiedMember()
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    const body = await readJsonObject(req)
    if (typeof body.password !== 'string' || body.password.length < 12 || body.password.length > 128) {
      throw new ConnectRequestError('password must be between 12 and 128 characters.')
    }

    const supabase = await createConnectSupabaseServerClient()
    const { error } = await supabase.auth.updateUser({ password: body.password })
    if (error) {
      console.error('Connect password update failed:', error.message)
      return NextResponse.json({ error: 'Unable to update the password right now.' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    rethrowNextControlFlow(error)
    const requestError = requestErrorResponse(error)
    if (requestError) return requestError
    console.error('Connect password update failed:', error)
    return NextResponse.json({ error: 'Unable to update the password right now.' }, { status: 500 })
  }
}

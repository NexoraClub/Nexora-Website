'use client'

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Eye, EyeOff, MailCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { CONNECT_MAX_PASSWORD_LENGTH, CONNECT_MIN_PASSWORD_LENGTH } from '@/lib/connect/constants'
import { ConnectShell } from './ConnectShell'
import { Button, Feedback, Field, Panel, PageHeading } from './ConnectUI'

type AuthMode = 'sign-up' | 'sign-in' | 'forgot-password' | 'reset-password' | 'start'

async function postJson(path: string, body: Record<string, unknown>, method = 'POST') {
  const response = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

function AuthAside({ mode }: { mode: AuthMode }) {
  const text = mode === 'sign-up'
    ? { number: '01', heading: 'Your people,\\nyour next chapter.', detail: 'A welcoming place for the ISE community to share what they build and find people to build with.' }
    : mode === 'reset-password' || mode === 'forgot-password'
      ? { number: '02', heading: 'A fresh start\\nis one link away.', detail: 'We’ll get you back to your community, safely and without fuss.' }
      : { number: '03', heading: 'A familiar place\\nto find your people.', detail: 'Meet the students and alumni making interesting things happen across the ISE community.' }

  return (
    <aside className="connect-auth-aside">
      <div className="connect-auth-orbit" aria-hidden>
        <span className="connect-orbit orbit-one" />
        <span className="connect-orbit orbit-two" />
        <span className="connect-orbit-core"><Sparkles size={24} /></span>
      </div>
      <p className="connect-eyebrow">Nexora · Connect</p>
      <p className="mt-5 whitespace-pre-line font-clash text-[clamp(2.3rem,4vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.05em] text-white">{text.heading.replaceAll('\\n', '\n')}</p>
      <p className="mt-5 max-w-sm text-sm leading-6 text-[#9caeba]">{text.detail}</p>
      <div className="mt-12 flex items-center gap-3 border-t border-white/10 pt-5">
        <span className="font-mono text-[10px] tracking-[0.18em] text-[#77d9f3]">{text.number}</span>
        <span className="h-px w-9 bg-[#77d9f3]/50" />
        <span className="text-[11px] text-[#80919f]">A verified community. Built around you.</span>
      </div>
    </aside>
  )
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null)
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get('authError')
    if (authError !== 'confirmation_failed' && authError !== 'google_auth_failed') return

    const timer = window.setTimeout(() => {
      setFeedback({
        message: authError === 'google_auth_failed'
          ? 'Google sign-in could not be completed. Please try again or use another sign-in option.'
          : mode === 'reset-password'
            ? 'That link has expired or has already been used. Request a new password reset link and try again.'
            : 'We could not confirm your email. The link may have expired or already been used. Try signing in or request a new link.',
        kind: 'error',
      })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [mode])

  useEffect(() => {
    if (mode !== 'start') return
    let active = true
    void fetch('/api/connect/auth/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (!active) return
        if (!data.authenticated || !data.emailVerified) {
          router.replace('/connect/sign-in')
          return
        }
        router.replace('/connect/dashboard')
      })
      .catch(() => {
        if (active) setFeedback({ message: 'We could not check your session. Please try signing in.', kind: 'error' })
      })
    return () => { active = false }
  }, [mode, router])

  async function resendConfirmation() {
    setBusy(true)
    setFeedback(null)
    try {
      const data = await postJson('/api/connect/auth/resend-confirmation', {
        email: email.trim().toLowerCase(),
      })
      setFeedback({ message: data.message, kind: 'success' })
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Unable to resend the confirmation email right now.',
        kind: 'error',
      })
    } finally {
      setBusy(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setFeedback(null)
    try {
      if (mode === 'sign-in') {
        await postJson('/api/connect/auth/sign-in', { email, password })
        router.replace('/connect/dashboard')
        router.refresh()
        return
      }
      if (mode === 'forgot-password') {
        const data = await postJson('/api/connect/auth/password-reset', { email })
        setFeedback({ message: data.message, kind: 'success' })
        return
      }
      if (mode === 'reset-password') {
        await postJson('/api/connect/auth/password', { password }, 'PATCH')
        setFeedback({ message: 'Your password has been updated. You can continue to your Connect space.', kind: 'success' })
        window.setTimeout(() => router.replace('/connect/dashboard'), 900)
      }
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : 'Something went wrong. Please try again.', kind: 'error' })
    } finally {
      setBusy(false)
    }
  }

  if (mode === 'start') {
    return (
      <ConnectShell>
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8">
          <Panel className="mx-auto max-w-lg p-8 text-center">
            <span className="connect-empty-icon"><ShieldCheck size={22} /></span>
            <p className="connect-eyebrow mt-5">One moment</p>
            <h1 className="mt-2 font-clash text-3xl text-white">Opening your Connect space</h1>
            <p className="mt-3 text-sm text-[#aab6c2]">Just a moment while we get things ready…</p>
            {feedback && <Feedback message={feedback.message} kind={feedback.kind} />}
          </Panel>
        </div>
      </ConnectShell>
    )
  }

  const isSignup = mode === 'sign-up'
  const title = mode === 'sign-up' ? 'Join your community.' : mode === 'sign-in' ? 'Welcome back.' : mode === 'forgot-password' ? 'Let’s get you back in.' : 'Choose a new password.'
  const description = mode === 'sign-up'
    ? 'Create your account with Google, then confirm your place in the department’s student list.'
    : mode === 'sign-in'
      ? 'Pick up where you left off with the people and projects you care about.'
      : mode === 'forgot-password'
        ? 'Enter the email address on your account. If it exists, we’ll send a secure reset link.'
        : `Choose a password with at least ${CONNECT_MIN_PASSWORD_LENGTH} characters.`

  return (
    <ConnectShell>
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-12 lg:py-16">
        <div className="hidden lg:block"><AuthAside mode={mode} /></div>
        <div className="mx-auto w-full max-w-[540px] lg:mx-0 lg:ml-auto">
          <Link href="/connect" className="connect-back-link"><ArrowLeft size={14} /> Back to the community</Link>
          <PageHeading eyebrow={isSignup ? 'Make yourself at home' : 'Member access'} title={title} description={description} />
          <Panel className="p-5 sm:p-8">
            {(mode === 'sign-up' || mode === 'sign-in') && (
              <div className="space-y-4">
                <form action="/api/connect/auth/google" method="get">
                  <button
                    type="submit"
                    className="flex h-10 w-full items-center justify-center gap-3 rounded border border-[#747775] bg-white px-4 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#f8faff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4285f4]"
                  >
                    <svg aria-hidden="true" className="h-[18px] w-[18px] shrink-0" viewBox="0 0 48 48">
                      <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.9 6-15Z" />
                      <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 2-6.8 2-5.3 0-9.8-3.6-11.4-8.4H5.7v5.3A20 20 0 0 0 24 44Z" />
                      <path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.7a20 20 0 0 0 0 17.8l6.9-5.3Z" />
                      <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.7 15.1l6.9 5.3c1.6-4.9 6.1-8.5 11.4-8.5Z" />
                    </svg>
                    <span>{isSignup ? 'Sign up with Google' : 'Sign in with Google'}</span>
                  </button>
                </form>
                <p className="text-center text-[11px] leading-5 text-[#81919e]">
                  {isSignup
                    ? 'After Google verifies your email, we’ll ask for your student number and check it against department records.'
                    : 'Use the Google account linked to your Nexora Connect profile.'}
                </p>
                {mode === 'sign-in' && (
                  <div className="flex items-center gap-3 py-1 text-[10px] text-[#81919e]">
                    <span className="h-px flex-1 bg-white/10" />
                    <span>OR USE EMAIL AND PASSWORD</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                )}
                {feedback && <Feedback message={feedback.message} kind={feedback.kind} />}
              </div>
            )}

            {mode !== 'sign-up' && <form onSubmit={handleSubmit} className="space-y-5">

              {mode !== 'reset-password' && (
                <Field
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              )}
              {(mode === 'sign-in' || mode === 'reset-password') && (
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium text-[#d8e2e9]">{mode === 'reset-password' ? 'New password' : 'Password'}</span>
                  <span className="relative block">
                    <input
                      className="connect-input pr-12"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                      placeholder={mode === 'sign-in' ? 'Your password' : `At least ${CONNECT_MIN_PASSWORD_LENGTH} characters`}
                      required
                      minLength={mode === 'sign-in' ? 1 : CONNECT_MIN_PASSWORD_LENGTH}
                      maxLength={CONNECT_MAX_PASSWORD_LENGTH}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#82919e] hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </span>
                  {mode !== 'sign-in' && <span className="mt-1.5 block text-[11px] text-[#82919e]">Use at least {CONNECT_MIN_PASSWORD_LENGTH} characters.</span>}
                </label>
              )}

              {feedback && <Feedback message={feedback.message} kind={feedback.kind} />}

              <Button
                type="submit"
                className="w-full"
                loading={busy}
              >
                {mode === 'sign-in' ? <>Sign in <ArrowRight size={16} /></>
                    : mode === 'forgot-password' ? <><MailCheck size={16} /> Send reset link</>
                      : <>Update password <ArrowRight size={16} /></>}
              </Button>
            </form>}

            {mode === 'sign-in' && (
              <div className="mt-5 flex flex-col items-center gap-3 border-t border-white/[0.07] pt-5 text-xs">
                <div className="flex w-full items-center justify-between gap-3">
                  <Link href="/connect/forgot-password" className="text-[#a5b3be] transition hover:text-[#79d8f2]">Forgot password?</Link>
                  <p className="text-[#8797a4]">New here? <Link href="/connect/sign-up" className="text-[#83d9f0] hover:underline">Create an account</Link></p>
                </div>
                <button
                  type="button"
                  onClick={() => void resendConfirmation()}
                  disabled={busy || !email.trim()}
                  className="text-[#83d9f0] transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Need to confirm your email? Resend the confirmation link
                </button>
              </div>
            )}
            {mode === 'sign-up' && (
              <p className="mt-5 border-t border-white/[0.07] pt-5 text-center text-xs text-[#8797a4]">
                Already a member? <Link href="/connect/sign-in" className="text-[#83d9f0] hover:underline">Sign in</Link>
              </p>
            )}
            {mode === 'forgot-password' && (
              <p className="mt-5 border-t border-white/[0.07] pt-5 text-center text-xs text-[#8797a4]">
                Remembered your password? <Link href="/connect/sign-in" className="text-[#83d9f0] hover:underline">Back to sign in</Link>
              </p>
            )}
            {mode === 'reset-password' && (
              <div className="mt-5 flex items-start gap-2 border-t border-white/[0.07] pt-5 text-[11px] leading-5 text-[#8797a4]">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#83d9f0]" />
                Keep this page open from the reset link in your email. If the link expired, request a new one.
              </div>
            )}
          </Panel>
          <p className="mt-5 flex items-center justify-center gap-2 text-center text-[10px] text-[#72828f]">
            <ShieldCheck size={13} /> Your name is checked with the department before your profile is shared.
          </p>
        </div>
      </div>
    </ConnectShell>
  )
}

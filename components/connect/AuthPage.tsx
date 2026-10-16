'use client'

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, MailCheck, ShieldCheck, Sparkles } from 'lucide-react'
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
  const [usn, setUsn] = useState('')
  const [officialName, setOfficialName] = useState('')
  const [feedback, setFeedback] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null)
  const [busy, setBusy] = useState(false)
  const [checked, setChecked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (mode !== 'start') return
    let active = true
    void fetch('/api/connect/auth/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (!active) return
        router.replace(data.authenticated && data.emailVerified ? '/connect/dashboard' : '/connect/sign-in')
      })
      .catch(() => {
        if (active) setFeedback({ message: 'We could not check your session. Please try signing in.', kind: 'error' })
      })
    return () => { active = false }
  }, [mode, router])

  async function verifyUsn() {
    setBusy(true)
    setFeedback(null)
    setOfficialName('')
    setChecked(false)
    try {
      const response = await fetch(`/api/connect/verify-usn?usn=${encodeURIComponent(usn)}`, { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok || !data.valid) throw new Error(data.error || 'We could not verify this USN.')
      setOfficialName(data.fullName)
      setChecked(true)
      setFeedback({ message: 'You’re on the list. We’ll use your name as it appears in the department’s records.', kind: 'success' })
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : 'Unable to verify this USN right now.', kind: 'error' })
    } finally {
      setBusy(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setFeedback(null)
    try {
      if (mode === 'sign-up') {
        if (!checked || !officialName) throw new Error('Verify your USN before creating your account.')
        await postJson('/api/connect/auth/sign-up', { email, password, usn })
        setFeedback({
          message: 'Check your inbox for a confirmation link. Once confirmed, you can create your Connect profile.',
          kind: 'success',
        })
        return
      }
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
    ? 'Your name will be checked against the department’s student records before you join.'
    : mode === 'sign-in'
      ? 'Pick up where you left off with the people and projects you care about.'
      : mode === 'forgot-password'
        ? 'Enter the email address on your account. If it exists, we’ll send a secure reset link.'
        : 'Make it a strong one — at least 12 characters.'

  return (
    <ConnectShell>
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-12 lg:py-16">
        <div className="hidden lg:block"><AuthAside mode={mode} /></div>
        <div className="mx-auto w-full max-w-[540px] lg:mx-0 lg:ml-auto">
          <Link href="/connect" className="connect-back-link"><ArrowLeft size={14} /> Back to the community</Link>
          <PageHeading eyebrow={isSignup ? 'Make yourself at home' : 'Member access'} title={title} description={description} />
          <Panel className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <>
                  <div>
                    <Field
                      label="Official student USN"
                      placeholder="e.g. 4AL22IS001"
                      value={usn}
                      autoComplete="off"
                      required
                      onChange={(event) => {
                        setUsn(event.target.value.toUpperCase())
                        setChecked(false)
                        setOfficialName('')
                      }}
                      onBlur={() => setUsn((value) => value.trim().toUpperCase())}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={busy || usn.trim().length < 3}
                      loading={busy && !feedback}
                      onClick={verifyUsn}
                      className="mt-2 w-full"
                    >
                      {checked ? <><Check size={15} /> Name confirmed: {officialName}</> : 'Check my USN'}
                    </Button>
                    <p className="mt-2 text-[11px] leading-5 text-[#81919e]">
                      Can’t find your name or see a mistake? Email us at <a className="text-[#83d9f0] hover:underline" href="mailto:nexora.ise@ajiet.edu.in">nexora.ise@ajiet.edu.in</a>.
                    </p>
                  </div>
                  {checked && (
                    <div className="connect-name-confirm">
                      <span className="connect-name-icon"><Check size={15} /></span>
                      <span><small>Name on department records</small><strong>{officialName}</strong></span>
                    </div>
                  )}
                </>
              )}

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
              {(mode === 'sign-up' || mode === 'sign-in' || mode === 'reset-password') && (
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium text-[#d8e2e9]">{mode === 'reset-password' ? 'New password' : 'Password'}</span>
                  <span className="relative block">
                    <input
                      className="connect-input pr-12"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                      placeholder={mode === 'sign-in' ? 'Your password' : 'At least 12 characters'}
                      required
                      minLength={mode === 'sign-in' ? 1 : 12}
                      maxLength={128}
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
                  {mode !== 'sign-in' && <span className="mt-1.5 block text-[11px] text-[#82919e]">Use at least 12 characters.</span>}
                </label>
              )}

              {feedback && <Feedback message={feedback.message} kind={feedback.kind} />}

              <Button
                type="submit"
                className="w-full"
                loading={busy}
                disabled={isSignup && !checked}
              >
                {mode === 'sign-up' ? <>Create account <ArrowRight size={16} /></>
                  : mode === 'sign-in' ? <>Sign in <ArrowRight size={16} /></>
                    : mode === 'forgot-password' ? <><MailCheck size={16} /> Send reset link</>
                      : <>Update password <ArrowRight size={16} /></>}
              </Button>
            </form>

            {mode === 'sign-in' && (
              <div className="mt-5 flex flex-col items-center gap-3 border-t border-white/[0.07] pt-5 text-xs sm:flex-row sm:justify-between">
                <Link href="/connect/forgot-password" className="text-[#a5b3be] transition hover:text-[#79d8f2]">Forgot password?</Link>
                <p className="text-[#8797a4]">New here? <Link href="/connect/sign-up" className="text-[#83d9f0] hover:underline">Create an account</Link></p>
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

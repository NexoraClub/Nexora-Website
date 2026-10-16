'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpenText, Eye, FileText, Save, Send, ShieldCheck } from 'lucide-react'
import { ConnectShell } from './ConnectShell'
import { Button, Feedback, PageHeading, Panel, StatusPill } from './ConnectUI'

type KnowledgeData = {
  draftMarkdown: string | null
  publishedMarkdown: string | null
  draftUpdatedAt: string | null
  publishedAt: string | null
}

export default function KnowledgePage() {
  const [page, setPage] = useState<KnowledgeData | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [approval, setApproval] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null)

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const [sessionResponse, pageResponse] = await Promise.all([
          fetch('/api/connect/auth/session', { cache: 'no-store' }),
          fetch('/api/connect/me/knowledge', { cache: 'no-store' }),
        ])
        const session = await sessionResponse.json()
        const data = await pageResponse.json()
        if (!active) return
        if (!session.authenticated || !session.emailVerified) {
          setFeedback({ message: 'Sign in to write and share helpful notes with the community.', kind: 'info' })
          return
        }
        if (!pageResponse.ok) throw new Error(data.error || 'Unable to load your writing right now. Please try again.')
        setPage(data.page)
        setMarkdown(data.page?.draftMarkdown ?? data.page?.publishedMarkdown ?? '')
        setApproval(session.profile?.approvalStatus ?? null)
      } catch (error) {
        if (active) setFeedback({ message: error instanceof Error ? error.message : 'Unable to load your writing right now. Please try again.', kind: 'error' })
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  async function save(publish: boolean) {
    setBusy(true)
    setFeedback(null)
    try {
      const response = await fetch('/api/connect/me/knowledge', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ markdown, publish }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save your writing right now. Please try again.')
      setPage(data.page)
      setFeedback({
        message: publish ? 'Your writing is now shared with the community.' : 'Saved for later. Only you can see it.',
        kind: 'success',
      })
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : 'Unable to save your writing right now. Please try again.', kind: 'error' })
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <ConnectShell><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8"><div className="connect-skeleton h-64" /></div></ConnectShell>

  if (feedback?.kind === 'info') {
    return (
      <ConnectShell>
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8">
          <Panel className="mx-auto max-w-xl p-8 text-center">
            <span className="connect-empty-icon"><BookOpenText size={22} /></span>
            <p className="connect-eyebrow mt-5">Member writing</p>
            <h1 className="mt-2 font-clash text-3xl text-white">Sign in to your space.</h1>
            <p className="mt-3 text-sm leading-6 text-[#aab6c2]">Sign in to write and share helpful notes with the community.</p>
            <Link href="/connect/sign-in" className="connect-button connect-button-primary mt-6">Sign in</Link>
          </Panel>
        </div>
      </ConnectShell>
    )
  }

  return (
    <ConnectShell>
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        <Link href="/connect/dashboard" className="connect-back-link"><ArrowLeft size={14} /> Back to your profile</Link>
        <PageHeading
          eyebrow="Your writing"
          title={<>Share what you’ve <span className="connect-title-accent">learned.</span></>}
          description="Share notes, ideas, and lessons you’ve picked up along the way. Save your writing for later, or share it with the community once your profile is ready."
          actions={approval && <StatusPill status={approval} />}
        />

        {feedback && <Feedback message={feedback.message} kind={feedback.kind} />}
        {approval !== 'APPROVED' && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#f0c56b]/20 bg-[#f0c56b]/[0.06] p-4 text-xs leading-5 text-[#ddc891]">
            <ShieldCheck size={16} className="mt-0.5 shrink-0" />
            Your profile needs to be reviewed before you can share this page. You can still save your writing for later.
          </div>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2.5"><FileText size={16} className="text-[#7bd9f1]" /><span className="text-sm font-medium text-white">Your writing</span></div>
              <span className="font-mono text-[10px] text-[#81919e]">{markdown.length.toLocaleString()} / 50,000</span>
            </div>
            <textarea
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              maxLength={50_000}
              spellCheck
              aria-label="Write your notes or article"
              placeholder={'What I learned while building…\n\nShare a useful idea, a how-to, or a note for someone working through the same challenge.\n\nKeep it practical, and remember to credit your sources.'}
              className="connect-markdown-editor"
            />
            <div className="flex flex-col gap-3 border-t border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[10px] leading-5 text-[#81919e]">Write naturally—your notes will be shown just as you enter them.</p>
              <div className="flex gap-2">
                <Button variant="secondary" loading={busy} onClick={() => void save(false)}><Save size={15} /> Save for later</Button>
                <Button loading={busy} disabled={approval !== 'APPROVED'} onClick={() => void save(true)}><Send size={15} /> Share with everyone</Button>
              </div>
            </div>
          </Panel>

          <aside className="space-y-5">
            <Panel className="p-5 sm:p-6">
              <div className="flex items-center gap-2"><Eye size={15} className="text-[#7bd9f1]" /><h2 className="font-clash text-lg text-white">What others will see</h2></div>
              <p className="mt-2 text-[11px] text-[#81919e]">
                {page?.publishedAt ? `Last shared ${new Date(page.publishedAt).toLocaleDateString()}` : 'Nothing shared yet.'}
              </p>
              <div className="connect-markdown-preview mt-4">
                {page?.publishedMarkdown
                  ? <pre>{page.publishedMarkdown}</pre>
                  : <p className="text-[#81919e]">Your writing will appear here and on your public profile after you share it.</p>}
              </div>
            </Panel>
            <Panel className="p-5 sm:p-6">
              <p className="connect-eyebrow">A small note</p>
              <p className="mt-3 text-xs leading-5 text-[#aab6c2]">You can share your writing once your profile has been reviewed. Anything saved for later is visible only to you.</p>
            </Panel>
          </aside>
        </div>
      </div>
    </ConnectShell>
  )
}

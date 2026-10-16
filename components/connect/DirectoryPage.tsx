'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Search, SlidersHorizontal, UsersRound } from 'lucide-react'
import { ConnectShell } from './ConnectShell'
import { Button, PageHeading, Panel } from './ConnectUI'

type ProfileCard = {
  slug: string
  fullName: string
  graduationYear: number
  memberType: 'STUDENT' | 'ALUMNUS'
  bio: string | null
  avatarUrl: string | null
  skills: string[]
  currentRole: string | null
  company: string | null
  openToCollaborate: boolean
  mentoringAvailable: boolean
}

type DirectoryResponse = {
  profiles: ProfileCard[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export default function DirectoryPage() {
  const [query, setQuery] = useState('')
  const [memberType, setMemberType] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<DirectoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProfiles = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page: String(page), limit: '12' })
    if (query.trim()) params.set('q', query.trim())
    if (memberType) params.set('memberType', memberType)
    try {
      const response = await fetch(`/api/connect/members?${params}`, {
        cache: 'no-store',
        signal,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to load the member directory.')
      setResult(data)
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return
      setError(cause instanceof Error ? cause.message : 'Unable to load the member directory.')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [memberType, page, query])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => void loadProfiles(controller.signal), 220)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [loadProfiles])

  const profiles = result?.profiles ?? []

  return (
    <ConnectShell>
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        <PageHeading
          eyebrow="The people behind the work"
          title={<>Good work grows<br className="hidden sm:block" /> through <span className="connect-title-accent">good people.</span></>}
          description="Meet students and alumni from ISE, discover what they’re working on, and find people to build with."
          actions={
            <Link className="connect-button connect-button-primary shrink-0" href="/connect/sign-up">
              Join the network <ArrowUpRight size={16} />
            </Link>
          }
        />

        <Panel className="mb-8 p-3 sm:p-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#82919e]" />
              <input
                value={query}
                onChange={(event) => { setQuery(event.target.value); setPage(1) }}
                placeholder="Search people, roles or companies"
                aria-label="Search members"
                className="connect-input h-12 pl-11"
              />
            </label>
            <label className="relative block">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#82919e]" />
              <select
                value={memberType}
                onChange={(event) => { setMemberType(event.target.value); setPage(1) }}
                aria-label="Filter by community role"
                className="connect-input h-12 appearance-none pl-11"
              >
                <option value="">Everyone</option>
                <option value="STUDENT">Students</option>
                <option value="ALUMNUS">Alumni</option>
              </select>
            </label>
            <div className="flex items-center justify-center rounded-xl border border-white/[0.07] px-4 text-xs text-[#aab6c2] md:min-w-[150px]">
              <UsersRound size={15} className="mr-2 text-[#72d5f0]" />
              {loading ? 'Finding people…' : `${result?.pagination.total ?? 0} members`}
            </div>
          </div>
        </Panel>

        {error && <div className="connect-feedback connect-feedback-error mb-6" role="alert">{error}</div>}

        {!loading && !error && profiles.length === 0 && (
          <Panel className="overflow-hidden p-8 sm:p-12">
            <div className="mx-auto max-w-lg text-center">
              <span className="connect-empty-icon"><UsersRound size={24} /></span>
              <p className="connect-eyebrow mt-6">A little quiet here</p>
              <h2 className="mt-3 font-clash text-3xl font-medium tracking-tight text-white">
                The community is just getting started.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#aab6c2]">
                No one has shared a profile yet. If you&apos;re part of ISE at AJIET, you could be the first.
              </p>
              <Link href="/connect/sign-up" className="connect-button connect-button-primary mt-6">
                Create your profile <ArrowRight size={16} />
              </Link>
              <p className="mt-5 text-[11px] text-[#82919e]">We check each student’s details before their profile is shared.</p>
            </div>
          </Panel>
        )}

        {(loading || profiles.length > 0) && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading && profiles.length === 0
              ? Array.from({ length: 6 }, (_, index) => <div key={index} className="connect-skeleton h-[240px]" />)
              : profiles.map((profile, index) => (
                <Link
                  key={profile.slug}
                  href={`/connect/members/${encodeURIComponent(profile.slug)}`}
                  className="connect-member-card group"
                  style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="connect-avatar h-14 w-14">
                        {profile.avatarUrl
                          ? <Image src={profile.avatarUrl} alt="" width={56} height={56} unoptimized className="h-full w-full rounded-2xl object-cover" />
                          : initials(profile.fullName)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate font-clash text-xl font-medium tracking-tight text-white group-hover:text-[#83def5]">{profile.fullName}</h2>
                        <p className="mt-1 truncate text-xs text-[#97a8b5]">
                          {profile.currentRole || (profile.memberType === 'ALUMNUS' ? 'ISE alum' : 'ISE student')}
                          {profile.company ? ` · ${profile.company}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="connect-card-arrow"><ArrowUpRight size={16} /></span>
                  </div>
                  <p className="mt-5 line-clamp-2 min-h-10 text-[13px] leading-5 text-[#b2bec8]">
                    {profile.bio || 'A member of the ISE community at AJIET.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 4).map((skill) => <span key={skill} className="connect-chip">{skill}</span>)}
                    {profile.skills.length > 4 && <span className="connect-chip">+{profile.skills.length - 4}</span>}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[#82919e]">
                      <span>{profile.memberType === 'ALUMNUS' ? 'Alumni' : 'Student'}</span>
                      <span className="h-1 w-1 rounded-full bg-[#607382]" />
                      <span>Class of {profile.graduationYear}</span>
                    </div>
                    <div className="flex gap-2">
                      {profile.openToCollaborate && <span className="connect-card-indicator" title="Open to collaborate"><ArrowDownRight size={12} /></span>}
                      {profile.mentoringAvailable && <span className="connect-card-indicator" title="Available to mentor">M</span>}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}

        {(result?.pagination.totalPages ?? 0) > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-xs text-[#82919e]">Page {page} of {result?.pagination.totalPages}</p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}>Previous</Button>
              <Button variant="secondary" disabled={page >= (result?.pagination.totalPages ?? 1) || loading} onClick={() => setPage((current) => current + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </ConnectShell>
  )
}

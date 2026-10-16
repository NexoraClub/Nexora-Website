'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
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
  searchMatches?: Array<{ section: string; excerpt: string }>
}

type DirectoryResponse = {
  profiles: ProfileCard[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function ProfileAvatar({ name, src }: { name: string; src: string | null }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="connect-avatar connect-directory-avatar">
      <span aria-hidden="true">{initials(name)}</span>
      {src && !imageFailed && (
        <Image
          src={src}
          alt=""
          width={64}
          height={64}
          unoptimized
          className="connect-directory-avatar-image"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  )
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
        <p className="connect-directory-kicker">Nexora Connect <span>/</span> ISE at AJIET</p>
        <PageHeading
          eyebrow="The community"
          title={<>People, projects<br className="hidden sm:block" /> and ideas from <span className="connect-title-accent">ISE.</span></>}
          description="Explore what people are building, what they care about, and ways to connect."
          actions={
            <Link className="connect-button connect-button-primary shrink-0" href="/connect/sign-up">
              Create your profile
            </Link>
          }
        />

        <Panel className="connect-directory-search mb-8 p-3 sm:p-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <label className="relative block">
              <input
                value={query}
                onChange={(event) => { setQuery(event.target.value); setPage(1) }}
                placeholder="Search profiles, projects, skills, or knowledge pages"
                aria-label="Search all public profile content"
                className="connect-input h-12"
              />
            </label>
            <label className="relative block">
              <select
                value={memberType}
                onChange={(event) => { setMemberType(event.target.value); setPage(1) }}
                aria-label="Filter by community role"
                className="connect-input h-12"
              >
                <option value="">Everyone</option>
                <option value="STUDENT">Students</option>
                <option value="ALUMNUS">Alumni</option>
              </select>
            </label>
            <div className="flex items-center justify-center px-4 text-xs text-[#aab6c2] md:min-w-[150px]">
              {loading ? 'Searching…' : `${result?.pagination.total ?? 0} ${query.trim() ? 'matches' : 'members'}`}
            </div>
          </div>
          <p className="px-1 pt-3 text-[11px] leading-5 text-[#82919e]">
            Searches public profile details, skills, projects, experience, achievements, and published knowledge pages.
          </p>
        </Panel>

        {error && <div className="connect-feedback connect-feedback-error mb-6" role="alert">{error}</div>}

        {!loading && !error && profiles.length === 0 && (
          <Panel className="overflow-hidden p-8 sm:p-12">
            <div className="mx-auto max-w-lg text-center">
              <p className="connect-eyebrow">{query.trim() ? 'Search results' : 'Nothing to show just yet'}</p>
              <h2 className="mt-3 font-clash text-3xl font-medium tracking-tight text-white">
                {query.trim() ? 'No profiles match that search.' : 'The community is just getting started.'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#aab6c2]">
                {query.trim()
                  ? 'Try another name, skill, project, or phrase from a published knowledge page.'
                  : 'No one has shared a profile yet. If you&apos;re part of ISE at AJIET, you could be the first.'}
              </p>
              {query.trim()
                ? <button type="button" className="connect-button connect-button-secondary mt-6" onClick={() => setQuery('')}>Clear search</button>
                : <>
                    <Link href="/connect/sign-up" className="connect-button connect-button-primary mt-6">Create your profile</Link>
                    <p className="mt-5 text-[11px] text-[#82919e]">We check each student’s details before their profile is shared.</p>
                  </>}
            </div>
          </Panel>
        )}

        {(loading || profiles.length > 0) && (
          <div className="connect-directory-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading && profiles.length === 0
              ? Array.from({ length: 6 }, (_, index) => <div key={index} className="connect-skeleton h-[240px]" />)
              : profiles.map((profile, index) => (
                <Link
                  key={profile.slug}
                  href={`/connect/members/${encodeURIComponent(profile.slug)}`}
                  className="connect-member-card connect-directory-card group"
                  style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                >
                  <div className="connect-directory-card-heading">
                    <ProfileAvatar name={profile.fullName} src={profile.avatarUrl} />
                    <div className="connect-directory-person">
                      <p className="connect-directory-meta">
                        {profile.memberType === 'ALUMNUS' ? 'Alumni' : 'Student'}
                        <span aria-hidden="true">/</span>
                        Class of {profile.graduationYear}
                      </p>
                      <h2 className="font-clash text-xl font-semibold tracking-tight text-white group-hover:text-[#c7eff7]">
                        {profile.fullName}
                      </h2>
                      <p className="connect-directory-role">
                        {profile.currentRole || (profile.memberType === 'ALUMNUS' ? 'ISE graduate' : 'ISE student')}
                        {profile.company && <><span aria-hidden="true"> · </span>{profile.company}</>}
                      </p>
                    </div>
                  </div>
                  <p className="connect-directory-bio line-clamp-2">
                    {profile.bio || 'No introduction added.'}
                  </p>
                  {query.trim() && profile.searchMatches && profile.searchMatches.length > 0 && (
                    <div className="connect-search-matches">
                      {profile.searchMatches.map((match) => (
                        <p key={match.section} className="connect-search-match">
                          <span>{match.section}</span>
                          <span>{match.excerpt}</span>
                        </p>
                      ))}
                    </div>
                  )}
                  {profile.skills.length > 0 && (
                    <div className="connect-directory-skills">
                      <span className="connect-directory-label">Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills.slice(0, 3).map((skill) => <span key={skill} className="connect-chip">{skill}</span>)}
                        {profile.skills.length > 3 && <span className="connect-chip">+{profile.skills.length - 3}</span>}
                      </div>
                    </div>
                  )}
                  <div className="connect-directory-card-footer">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {profile.openToCollaborate && <span>Open to collaborate</span>}
                      {profile.mentoringAvailable && <span>Available to mentor</span>}
                      {!profile.openToCollaborate && !profile.mentoringAvailable && <span>ISE member</span>}
                    </div>
                    <span className="connect-directory-link">View profile</span>
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

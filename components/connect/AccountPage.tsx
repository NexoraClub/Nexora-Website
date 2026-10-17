'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, ChevronRight, Eye, FolderKanban, LockKeyhole, Plus, Save, Upload, UserRound, X } from 'lucide-react'
import { ConnectShell } from './ConnectShell'
import { KnowledgeEditor } from './KnowledgeEditor'
import { Button, Feedback, Field, PageHeading, Panel, StatusPill, TextField } from './ConnectUI'

type Project = {
  title: string
  description: string
  technologies: string
  repositoryUrl: string
  demoUrl: string
  seekingCollaborators: boolean
  preferredTeammateSkills: string
}

type SocialLink = { label: string; url: string }
type Profile = {
  authUserId: string
  slug: string
  fullName: string
  usn: string
  graduationYear: number
  memberType: 'STUDENT' | 'ALUMNUS'
  bio: string | null
  avatarUrl: string | null
  skills: string[]
  interests: string[]
  skillsInDevelopment: string[]
  helpAreas: string[]
  location: string | null
  phone: string | null
  phonePublic: boolean
  contactEmail: string | null
  contactEmailPublic: boolean
  visibility: 'PUBLIC' | 'PRIVATE'
  approvalStatus: string
  reviewNote: string | null
  currentRole: string | null
  company: string | null
  professionalJourney: string | null
  openToCollaborate: boolean
  mentoringAvailable: boolean
  referralAvailable: boolean
  socialLinks: SocialLink[]
  projects: Array<Omit<Project, 'technologies' | 'preferredTeammateSkills'> & { technologies: string[]; preferredTeammateSkills: string[] }>
}

type Draft = {
  usn: string
  graduationYear: string
  memberType: 'STUDENT' | 'ALUMNUS'
  bio: string
  avatarUrl: string
  location: string
  phone: string
  phonePublic: boolean
  contactEmail: string
  contactEmailPublic: boolean
  currentRole: string
  company: string
  professionalJourney: string
  skills: string
  interests: string
  skillsInDevelopment: string
  helpAreas: string
  openToCollaborate: boolean
  mentoringAvailable: boolean
  referralAvailable: boolean
  visibility: 'PUBLIC' | 'PRIVATE'
}

const emptyDraft: Draft = {
  usn: '',
  graduationYear: String(new Date().getFullYear()),
  memberType: 'STUDENT',
  bio: '',
  avatarUrl: '',
  location: '',
  phone: '',
  phonePublic: false,
  contactEmail: '',
  contactEmailPublic: false,
  currentRole: '',
  company: '',
  professionalJourney: '',
  skills: '',
  interests: '',
  skillsInDevelopment: '',
  helpAreas: '',
  openToCollaborate: false,
  mentoringAvailable: false,
  referralAvailable: false,
  visibility: 'PRIVATE',
}

function fromProfile(profile: Profile): Draft {
  return {
    usn: profile.usn,
    graduationYear: String(profile.graduationYear),
    memberType: profile.memberType,
    bio: profile.bio ?? '',
    avatarUrl: profile.avatarUrl ?? '',
    location: profile.location ?? '',
    phone: profile.phone ?? '',
    phonePublic: profile.phonePublic,
    contactEmail: profile.contactEmail ?? '',
    contactEmailPublic: profile.contactEmailPublic,
    currentRole: profile.currentRole ?? '',
    company: profile.company ?? '',
    professionalJourney: profile.professionalJourney ?? '',
    skills: profile.skills.join(', '),
    interests: profile.interests.join(', '),
    skillsInDevelopment: profile.skillsInDevelopment.join(', '),
    helpAreas: profile.helpAreas.join(', '),
    openToCollaborate: profile.openToCollaborate,
    mentoringAvailable: profile.mentoringAvailable,
    referralAvailable: profile.referralAvailable,
    visibility: profile.visibility,
  }
}

function parseList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

const emptyProject = (): Project => ({
  title: '',
  description: '',
  technologies: '',
  repositoryUrl: '',
  demoUrl: '',
  seekingCollaborators: false,
  preferredTeammateSkills: '',
})

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [usnVerified, setUsnVerified] = useState(false)
  const [officialName, setOfficialName] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [feedback, setFeedback] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null)
  const [busy, setBusy] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarFeedback, setAvatarFeedback] = useState<string | null>(null)
  const [avatarPreviewFailed, setAvatarPreviewFailed] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const sessionResponse = await fetch('/api/connect/auth/session', { cache: 'no-store' })
        const session = await sessionResponse.json()
        if (!active) return
        setAuthenticated(Boolean(session.authenticated))
        setEmailVerified(Boolean(session.emailVerified))
        if (!session.authenticated) return
        const response = await fetch('/api/connect/me', { cache: 'no-store' })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load your profile.')
        if (!active) return
        if (data.profile) {
          const loaded = data.profile as Profile
          setProfile(loaded)
          setDraft(fromProfile(loaded))
          setProjects(loaded.projects.map((project) => ({
            ...project,
            description: project.description ?? '',
            technologies: project.technologies.join(', '),
            repositoryUrl: project.repositoryUrl ?? '',
            demoUrl: project.demoUrl ?? '',
            preferredTeammateSkills: project.preferredTeammateSkills.join(', '),
          })))
          setSocialLinks(loaded.socialLinks)
        } else {
          setDraft((current) => ({
            ...current,
            usn: session.user?.connectUsn ?? '',
            contactEmail: session.user?.email ?? '',
          }))
        }
      } catch (error) {
        if (active) setFeedback({ message: error instanceof Error ? error.message : 'Unable to load your profile.', kind: 'error' })
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  async function verifyUsn() {
    setBusy(true)
    setFeedback(null)
    setUsnVerified(false)
    setOfficialName('')
    try {
      const response = await fetch(`/api/connect/verify-usn?usn=${encodeURIComponent(draft.usn)}`, {
        cache: 'no-store',
      })
      const data = await response.json()
      if (!response.ok || !data.valid) {
        throw new Error(data.error || 'We could not find this student number in the department list.')
      }
      setOfficialName(data.fullName)
      setUsnVerified(true)
      setFeedback({
        message: 'Student number confirmed. Your department-record name is shown below.',
        kind: 'success',
      })
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Unable to verify your student number right now.',
        kind: 'error',
      })
    } finally {
      setBusy(false)
    }
  }

  async function uploadAvatar(file: File | undefined) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarFeedback('Choose a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarFeedback('Choose an image smaller than 5 MB.')
      return
    }

    setAvatarUploading(true)
    setAvatarFeedback(null)
    try {
      const formData = new FormData()
      formData.set('file', file)
      const response = await fetch('/api/connect/avatar-upload', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'We could not upload that photo. Please try again.')
      setAvatarPreviewFailed(false)
      update('avatarUrl', data.url)
      setAvatarFeedback('Photo uploaded. Save your profile to apply it.')
    } catch (error) {
      setAvatarFeedback(error instanceof Error ? error.message : 'We could not upload that photo. Please try again.')
    } finally {
      setAvatarUploading(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profile && (!usnVerified || !officialName)) {
      setFeedback({ message: 'Verify your student number before creating your profile.', kind: 'error' })
      return
    }
    setBusy(true)
    setFeedback(null)
    const body: Record<string, unknown> = {
      ...draft,
      ...(!profile ? { fullName: officialName } : {}),
      graduationYear: Number(draft.graduationYear),
      skills: parseList(draft.skills),
      interests: parseList(draft.interests),
      skillsInDevelopment: parseList(draft.skillsInDevelopment),
      helpAreas: parseList(draft.helpAreas),
      avatarUrl: draft.avatarUrl || null,
      phone: draft.phone || null,
      contactEmail: draft.contactEmail || null,
      socialLinks: socialLinks.filter((item) => item.label.trim() && item.url.trim()),
      projects: projects.filter((project) => project.title.trim()).map((project) => ({
        ...project,
        technologies: parseList(project.technologies),
        preferredTeammateSkills: parseList(project.preferredTeammateSkills),
        description: project.description || null,
        repositoryUrl: project.repositoryUrl || null,
        demoUrl: project.demoUrl || null,
      })),
    }
    if (profile) {
      if (Number(draft.graduationYear) === profile.graduationYear) delete body.graduationYear
      if (draft.memberType === profile.memberType) delete body.memberType
    }
    try {
      let response = await fetch('/api/connect/me', {
        method: profile ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      })
      let data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save your profile.')
      if (!profile) {
        setProfile(data.profile as Profile)
        delete body.fullName
        response = await fetch('/api/connect/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(body),
        })
        data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Your profile was created, but some portfolio details could not be saved. Review and save again.')
        }
      }
      const saved = data.profile as Profile
      setProfile(saved)
      setDraft(fromProfile(saved))
      setProjects(saved.projects.map((project) => ({
        ...project,
        description: project.description ?? '',
        technologies: project.technologies.join(', '),
        repositoryUrl: project.repositoryUrl ?? '',
        demoUrl: project.demoUrl ?? '',
        preferredTeammateSkills: project.preferredTeammateSkills.join(', '),
      })))
      setSocialLinks(saved.socialLinks)
      window.sessionStorage.removeItem('connect-usn')
      setFeedback({
        message: profile
          ? saved.approvalStatus === 'PENDING' ? 'Saved. Changes to your identity need another review.' : 'Your profile changes are saved.'
          : 'Your profile is waiting for review. You can keep improving it in the meantime.',
        kind: 'success',
      })
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : 'Unable to save your profile.', kind: 'error' })
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    try {
      await fetch('/api/connect/auth/sign-out', { method: 'POST', credentials: 'same-origin' })
      router.replace('/connect')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <ConnectShell><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8"><div className="connect-skeleton h-64" /></div></ConnectShell>
  }

  if (!authenticated) {
    return (
      <ConnectShell>
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8">
          <Panel className="mx-auto max-w-xl p-8 text-center">
            <span className="connect-empty-icon"><LockKeyhole size={22} /></span>
            <p className="connect-eyebrow mt-5">Members only</p>
            <h1 className="mt-2 font-clash text-3xl text-white">Your space is waiting.</h1>
            <p className="mt-3 text-sm leading-6 text-[#aab6c2]">Sign in to set up your profile, share your work and manage your community activity.</p>
            <Link href="/connect/sign-in" className="connect-button connect-button-primary mt-6">Sign in <ArrowRight size={16} /></Link>
          </Panel>
        </div>
      </ConnectShell>
    )
  }

  if (!emailVerified) {
    return (
      <ConnectShell>
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8">
          <Panel className="mx-auto max-w-xl p-8 text-center">
            <span className="connect-empty-icon"><LockKeyhole size={22} /></span>
            <p className="connect-eyebrow mt-5">Almost there</p>
            <h1 className="mt-2 font-clash text-3xl text-white">Use a verified Google account.</h1>
            <p className="mt-3 text-sm leading-6 text-[#aab6c2]">This Google account does not have a verified email address. Sign out and continue with a verified Google account to set up your Connect profile.</p>
            <Button variant="secondary" className="mt-6" onClick={signOut}>Sign out</Button>
          </Panel>
        </div>
      </ConnectShell>
    )
  }

  return (
    <ConnectShell>
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        <PageHeading
          eyebrow={profile ? 'Your Connect space' : 'The first step'}
          title={profile
            ? <>Make it <span className="connect-title-accent">yours.</span></>
            : usnVerified
              ? <>Start with<br className="hidden sm:block" /> <span className="connect-title-accent">your story.</span></>
              : <>Confirm your<br className="hidden sm:block" /> <span className="connect-title-accent">student number.</span></>}
          description={profile
            ? 'Your profile is the beginning of your presence in the ISE community. Keep it current and make it yours.'
            : usnVerified
              ? 'Your official name is confirmed. Add a few details so your classmates can get to know you.'
              : 'Enter your official student number. We’ll check it against the department list before you continue.'}
          actions={
            <div className="flex flex-wrap gap-2">
              {profile && <Link href="/connect/dashboard#knowledge-page" className="connect-button connect-button-secondary"><FolderKanban size={15} /> Your personal page</Link>}
              {profile && <Link href="/connect/activity" className="connect-button connect-button-secondary">Activity</Link>}
              <Button variant="quiet" onClick={signOut} disabled={busy}>Sign out</Button>
            </div>
          }
        />

        {profile && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <StatusPill status={profile.approvalStatus} />
            <p className="min-w-0 flex-1 text-xs leading-5 text-[#aab6c2]">
              {profile.reviewNote || (profile.approvalStatus === 'APPROVED'
                ? 'Your profile has been reviewed.'
                : profile.approvalStatus === 'PENDING'
                  ? 'The Connect team is checking your details. Your profile will appear here once it’s ready to share.'
                  : 'If you have questions about your profile, get in touch with the Connect team.')}
            </p>
            {profile.approvalStatus === 'APPROVED' && (
              <Link href={`/connect/members/${encodeURIComponent(profile.slug)}`} className="connect-inline-link">View public profile <ChevronRight size={14} /></Link>
            )}
          </div>
        )}

        {!profile && !usnVerified ? (
          <Panel className="mx-auto max-w-xl p-5 sm:p-8">
            <div className="mb-5">
              <h2 className="font-clash text-2xl text-white">Find your name on the list</h2>
              <p className="mt-2 text-sm leading-6 text-[#9aaab6]">Enter your student number exactly as it appears in your department records. We’ll fetch your official name if it matches.</p>
            </div>
            <Field
              label="Official student number (USN)"
              value={draft.usn}
              onChange={(event) => {
                update('usn', event.target.value.toUpperCase())
                setUsnVerified(false)
                setOfficialName('')
                setFeedback(null)
              }}
              required
              autoComplete="off"
              placeholder="e.g. 4AL22IS001"
            />
            {feedback && <Feedback message={feedback.message} kind={feedback.kind} />}
            <Button
              type="button"
              variant="secondary"
              className="mt-4 w-full"
              loading={busy}
              disabled={draft.usn.trim().length < 3}
              onClick={() => void verifyUsn()}
            >
              Check my student number
            </Button>
            <p className="mt-4 text-center text-[11px] leading-5 text-[#81919e]">
              Can’t find your name or see a mistake? Email <a className="text-[#83d9f0] hover:underline" href="mailto:nexora.ise@ajiet.edu.in">nexora.ise@ajiet.edu.in</a>.
            </p>
          </Panel>
        ) : (
        <form onSubmit={handleSubmit} className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-5">
            <Panel className="p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="connect-section-icon"><UserRound size={16} /></span>
                <div><h2 className="font-clash text-xl text-white">The essentials</h2><p className="mt-1 text-xs text-[#82919e]">Your name is checked with the department.</p></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Student number (USN)" value={draft.usn} readOnly disabled />
                <Field label="Name on department records" value={profile?.fullName ?? officialName} readOnly disabled />
                <Field label="Graduation year" type="number" min="1980" max={new Date().getFullYear() + 8} value={draft.graduationYear} onChange={(event) => update('graduationYear', event.target.value)} required />
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium text-[#d8e2e9]">I am a</span>
                  <select className="connect-input" value={draft.memberType} onChange={(event) => update('memberType', event.target.value as Draft['memberType'])}>
                    <option value="STUDENT">Current student</option>
                    <option value="ALUMNUS">Alumnus / alumna</option>
                  </select>
                </label>
                <TextField label="A short introduction" className="sm:col-span-2" value={draft.bio} onChange={(event) => update('bio', event.target.value)} maxLength={600} placeholder="A couple of lines about what you care about…" />
                <div className="sm:col-span-2">
                  <span className="mb-2 block text-[12px] font-medium text-[#d8e2e9]">Profile photo</span>
                  <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.08] bg-black/10 p-3">
                    <div className="connect-avatar h-16 w-16 rounded-xl">
                      {draft.avatarUrl && !avatarPreviewFailed
                        ? <Image src={draft.avatarUrl} alt="Profile photo preview" width={64} height={64} unoptimized className="h-full w-full object-cover" onError={() => setAvatarPreviewFailed(true)} />
                        : <UserRound size={22} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#c1cdd5]">Upload a JPG, PNG, or WebP photo (up to 5 MB).</p>
                      <p className="mt-1 text-[10px] leading-5 text-[#81919e]">Stored securely in Nexora’s Cloudinary media folder. It appears on your public profile only when you choose to share your profile.</p>
                      {avatarFeedback && <p role="status" className={`mt-1 text-[11px] ${avatarFeedback.startsWith('Photo uploaded') ? 'text-[#82d8ef]' : 'text-[#f0a6a6]'}`}>{avatarFeedback}</p>}
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      aria-label="Choose a profile photo"
                      disabled={avatarUploading || busy}
                      onChange={(event) => void uploadAvatar(event.target.files?.[0])}
                    />
                    <Button type="button" variant="secondary" loading={avatarUploading} disabled={busy} onClick={() => avatarInputRef.current?.click()}>
                      <Upload size={15} /> {draft.avatarUrl ? 'Change photo' : 'Upload photo'}
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Field
                      label="Or use a photo link"
                      type="url"
                      value={draft.avatarUrl}
                      onChange={(event) => {
                        setAvatarPreviewFailed(false)
                        setAvatarFeedback(null)
                        update('avatarUrl', event.target.value)
                      }}
                      placeholder="https://example.com/your-photo.jpg"
                      hint="Paste a direct, publicly accessible image URL. Your photo link is saved with your profile."
                    />
                  </div>
                </div>
                <Field label="Location" value={draft.location} onChange={(event) => update('location', event.target.value)} placeholder="Mangaluru, India" />
              </div>
            </Panel>

            <Panel className="p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="connect-section-icon"><FolderKanban size={16} /></span>
                <div><h2 className="font-clash text-xl text-white">What you do</h2><p className="mt-1 text-xs text-[#82919e]">Share the skills, interests and work you’d like to be known for.</p></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Current role" value={draft.currentRole} onChange={(event) => update('currentRole', event.target.value)} placeholder="e.g. Frontend developer" />
                <Field label="Company or organization" value={draft.company} onChange={(event) => update('company', event.target.value)} placeholder="Optional" />
                <Field label="Skills" value={draft.skills} onChange={(event) => update('skills', event.target.value)} placeholder="React, Python, UI design" hint="Separate items with commas." />
                <Field label="Interests" value={draft.interests} onChange={(event) => update('interests', event.target.value)} placeholder="Open source, robotics…" hint="Separate items with commas." />
                <Field label="Skills you’re developing" value={draft.skillsInDevelopment} onChange={(event) => update('skillsInDevelopment', event.target.value)} placeholder="Cloud, data science…" hint="Separate items with commas." />
                <Field label="Ways you can help" value={draft.helpAreas} onChange={(event) => update('helpAreas', event.target.value)} placeholder="Code reviews, mentoring…" hint="Separate items with commas." />
                <TextField label="Your journey" className="sm:col-span-2" value={draft.professionalJourney} onChange={(event) => update('professionalJourney', event.target.value)} maxLength={20000} placeholder="A little more about your path so far…" />
              </div>
            </Panel>

            <Panel className="p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="connect-section-icon"><FolderKanban size={16} /></span>
                  <div><h2 className="font-clash text-xl text-white">Projects</h2><p className="mt-1 text-xs text-[#82919e]">Show what you’ve made — and what you’d like to make next.</p></div>
                </div>
                <Button type="button" variant="secondary" onClick={() => setProjects((current) => [...current, emptyProject()])}><Plus size={15} /> Add project</Button>
              </div>
              {projects.length === 0 && <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-xs text-[#81919e]">No projects yet. Add one when you’re ready.</p>}
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="connect-subpanel">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7edaf2]">Project {String(index + 1).padStart(2, '0')}</span>
                      <button type="button" onClick={() => setProjects((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="connect-remove-button" aria-label={`Remove project ${index + 1}`}><X size={15} /></button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Title" value={project.title} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} placeholder="Project name" />
                      <Field label="Tools and technologies" value={project.technologies} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, technologies: event.target.value } : item))} placeholder="React, Python, Figma" />
                      <TextField label="A short description" className="sm:col-span-2" value={project.description} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} placeholder="What does it do?" />
                      <Field label="Code or project link" type="url" value={project.repositoryUrl} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, repositoryUrl: event.target.value } : item))} placeholder="https://…" />
                      <Field label="Try it out (optional)" type="url" value={project.demoUrl} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, demoUrl: event.target.value } : item))} placeholder="https://…" />
                      <label className="connect-toggle-row sm:col-span-2">
                        <span><strong>Looking for collaborators</strong><small>Show that you’re open to teaming up on this project.</small></span>
                        <input type="checkbox" checked={project.seekingCollaborators} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, seekingCollaborators: event.target.checked } : item))} />
                      </label>
                      {project.seekingCollaborators && <Field label="Skills you’d like in a teammate" className="sm:col-span-2" value={project.preferredTeammateSkills} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, preferredTeammateSkills: event.target.value } : item))} placeholder="Backend, visual design…" />}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="connect-section-icon"><ArrowRight size={16} /></span>
                  <div><h2 className="font-clash text-xl text-white">Around the web</h2><p className="mt-1 text-xs text-[#82919e]">Add one or more links to places you work and create.</p></div>
                </div>
                <Button type="button" variant="secondary" onClick={() => setSocialLinks((current) => [...current, { label: '', url: '' }])}><Plus size={15} /> Add link</Button>
              </div>
              {socialLinks.length === 0 && <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-xs text-[#81919e]">Add a portfolio, GitHub, LinkedIn or personal site.</p>}
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <div key={index} className="grid gap-3 sm:grid-cols-[0.7fr_1.3fr_auto]">
                    <Field label={index === 0 ? 'Label' : `Label ${index + 1}`} value={link.label} onChange={(event) => setSocialLinks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} placeholder="GitHub" />
                    <Field label={index === 0 ? 'URL' : `URL ${index + 1}`} type="url" value={link.url} onChange={(event) => setSocialLinks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item))} placeholder="https://…" />
                    <button type="button" onClick={() => setSocialLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="connect-remove-button mt-7" aria-label={`Remove link ${index + 1}`}><X size={15} /></button>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-6">
            <Panel className="p-5 sm:p-6">
              <p className="connect-eyebrow">Your presence</p>
              <h2 className="mt-2 font-clash text-xl text-white">You choose what’s shared.</h2>
              <label className="mt-5 block">
                <span className="mb-2 block text-[12px] font-medium text-[#d8e2e9]">Profile visibility</span>
                <select className="connect-input" value={draft.visibility} onChange={(event) => update('visibility', event.target.value as Draft['visibility'])}>
                  <option value="PRIVATE">Private · only you can see it</option>
                  <option value="PUBLIC">Public · visible to everyone after review</option>
                </select>
              </label>
              <div className="mt-4 space-y-3">
                <Toggle title="Open to collaborate" checked={draft.openToCollaborate} onChange={(value) => update('openToCollaborate', value)} />
                <Toggle title="Available to mentor" checked={draft.mentoringAvailable} onChange={(value) => update('mentoringAvailable', value)} />
                <Toggle title="Open to referrals" checked={draft.referralAvailable} onChange={(value) => update('referralAvailable', value)} />
              </div>
            </Panel>
            <Panel className="p-5 sm:p-6">
              <p className="connect-eyebrow">Contact preferences</p>
              <div className="mt-4 space-y-4">
                <Field label="Contact email" type="email" value={draft.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} placeholder="you@example.com" />
                <Toggle title="Show my email publicly" checked={draft.contactEmailPublic} onChange={(value) => update('contactEmailPublic', value)} />
                <Field label="Phone (optional)" type="tel" value={draft.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+91…" />
                <Toggle title="Show my phone publicly" checked={draft.phonePublic} onChange={(value) => update('phonePublic', value)} />
              </div>
              <p className="mt-4 text-[10px] leading-5 text-[#81919e]">Contact details stay private unless you explicitly turn on public visibility.</p>
            </Panel>
            <Panel className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="connect-section-icon"><Eye size={15} /></span>
                <div>
                  <h3 className="font-medium text-white">Review before public</h3>
                  <p className="mt-2 text-xs leading-5 text-[#9aaab6]">The Connect team checks your details before your profile is shared.</p>
                  <p className="mt-3 flex items-center gap-1.5 text-[10px] text-[#82d8ef]"><Check size={13} /> USN is never shown on your public profile.</p>
                </div>
              </div>
            </Panel>
            <div>
              {feedback && <Feedback message={feedback.message} kind={feedback.kind} />}
              <Button type="submit" loading={busy} disabled={avatarUploading} className="mt-3 w-full"><Save size={16} /> {profile ? 'Save changes' : 'Create profile'}</Button>
              {profile && <p className="mt-2 text-center text-[10px] text-[#788995]">Only your profile is changed when you save.</p>}
            </div>
          </aside>
        </form>
        )}
        {profile && <KnowledgeEditor profileApprovalStatus={profile.approvalStatus} embedded />}
      </div>
    </ConnectShell>
  )
}

function Toggle({ title, checked, onChange }: { title: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="connect-toggle-row">
      <span><strong>{title}</strong></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  )
}

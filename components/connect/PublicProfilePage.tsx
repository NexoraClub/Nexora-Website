'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, CalendarDays, ExternalLink, Flag, Handshake, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { ConnectShell } from './ConnectShell'
import { ConnectMarkdown } from './ConnectMarkdown'
import { Panel } from './ConnectUI'

type PublicProfile = {
  slug: string
  fullName: string
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
  contactEmail: string | null
  currentRole: string | null
  company: string | null
  professionalJourney: string | null
  openToCollaborate: boolean
  mentoringAvailable: boolean
  referralAvailable: boolean
  socialLinks: Array<{ id: string; label: string; url: string }>
  projects: Array<{ id: string; title: string; description: string | null; technologies: string[]; repositoryUrl: string | null; demoUrl: string | null; seekingCollaborators: boolean; preferredTeammateSkills: string[] }>
  experiences: Array<{ id: string; type: string; role: string; organization: string | null; description: string | null; startedAt: string | null; endedAt: string | null; isCurrent: boolean }>
  achievements: Array<{ id: string; title: string; description: string | null; achievedAt: string | null; url: string | null }>
  knowledgePage: { publishedMarkdown: string | null; publishedAt: string | null } | null
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export default function PublicProfilePage() {
  const params = useParams<{ slug: string }>()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void fetch(`/api/connect/members/${encodeURIComponent(params.slug)}`, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'This member profile could not be found.')
        if (active) setProfile(data.profile)
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : 'This member profile could not be found.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [params.slug])

  if (loading) return <ConnectShell><div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8"><div className="connect-skeleton h-64" /></div></ConnectShell>

  if (error || !profile) {
    return (
      <ConnectShell>
        <div className="mx-auto max-w-[1000px] px-5 py-20 sm:px-8">
          <Panel className="mx-auto max-w-lg p-8 text-center">
            <span className="connect-empty-icon"><ShieldCheck size={22} /></span>
            <p className="connect-eyebrow mt-5">Not found</p>
            <h1 className="mt-2 font-clash text-3xl text-white">This profile isn’t available.</h1>
            <p className="mt-3 text-sm text-[#aab6c2]">{error || 'This profile may be private or not ready to share yet.'}</p>
            <Link href="/connect" className="connect-button connect-button-primary mt-6"><ArrowLeft size={15} /> Back to the community</Link>
          </Panel>
        </div>
      </ConnectShell>
    )
  }

  return (
    <ConnectShell>
      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <Link href="/connect" className="connect-back-link"><ArrowLeft size={14} /> Back to the community</Link>
        <section className="connect-profile-hero mt-5">
          <div className="connect-profile-orbit" aria-hidden />
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="connect-avatar connect-avatar-large">
                {profile.avatarUrl
                  ? <Image src={profile.avatarUrl} alt="" width={104} height={104} unoptimized className="h-full w-full rounded-[28px] object-cover" />
                  : initials(profile.fullName)}
              </div>
              <div>
                <p className="connect-eyebrow">{profile.memberType === 'ALUMNUS' ? 'ISE alumni' : 'ISE student'} · Class of {profile.graduationYear}</p>
                <h1 className="mt-2 font-clash text-[clamp(2.5rem,6vw,4.6rem)] font-medium leading-none tracking-[-0.055em] text-white">{profile.fullName}</h1>
                {(profile.currentRole || profile.company) && (
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#c1cdd5]">
                    {profile.currentRole && <span>{profile.currentRole}</span>}
                    {profile.currentRole && profile.company && <span className="text-[#6e818f]">at</span>}
                    {profile.company && <span>{profile.company}</span>}
                  </p>
                )}
                {profile.location && <p className="mt-2 flex items-center gap-1.5 text-xs text-[#93a4b1]"><MapPin size={13} /> {profile.location}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.contactEmail && <a href={`mailto:${profile.contactEmail}`} className="connect-button connect-button-primary"><span>Say hello</span><ArrowUpRight size={15} /></a>}
              <Link href={`/connect/activity?slug=${encodeURIComponent(profile.slug)}`} className="connect-button connect-button-secondary"><Flag size={14} /> Report</Link>
            </div>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap gap-2">
            {profile.openToCollaborate && <span className="connect-feature-pill"><Handshake size={13} /> Open to collaborate</span>}
            {profile.mentoringAvailable && <span className="connect-feature-pill"><Sparkles size={13} /> Available to mentor</span>}
            {profile.referralAvailable && <span className="connect-feature-pill"><BriefcaseBusiness size={13} /> Open to referrals</span>}
          </div>
        </section>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-5">
            {profile.bio && <Panel className="p-5 sm:p-7"><p className="connect-eyebrow">A little about me</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#c1cdd5]">{profile.bio}</p></Panel>}
            {profile.professionalJourney && <Panel className="p-5 sm:p-7"><p className="connect-eyebrow">The journey</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#c1cdd5]">{profile.professionalJourney}</p></Panel>}

            {profile.projects.length > 0 && (
              <Panel className="p-5 sm:p-7">
                <div className="mb-5 flex items-center gap-3"><span className="connect-section-icon"><BriefcaseBusiness size={16} /></span><div><p className="connect-eyebrow">Things I’ve made</p><h2 className="mt-1 font-clash text-2xl text-white">Selected projects</h2></div></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {profile.projects.map((project) => (
                    <article key={project.id} className="connect-subpanel">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-clash text-lg text-white">{project.title}</h3>
                        {project.seekingCollaborators && <span className="connect-card-indicator" title="Seeking collaborators"><Handshake size={13} /></span>}
                      </div>
                      {project.description && <p className="mt-2 text-xs leading-5 text-[#aab6c2]">{project.description}</p>}
                      <div className="mt-3 flex flex-wrap gap-1.5">{project.technologies.map((technology) => <span className="connect-chip" key={technology}>{technology}</span>)}</div>
                      {project.seekingCollaborators && project.preferredTeammateSkills.length > 0 && <p className="mt-3 text-[10px] text-[#83d9f0]">Looking for: {project.preferredTeammateSkills.join(', ')}</p>}
                      <div className="mt-4 flex gap-4">
                        {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="connect-inline-link">Repository <ExternalLink size={12} /></a>}
                        {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="connect-inline-link">Live demo <ExternalLink size={12} /></a>}
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            )}

            {profile.experiences.length > 0 && (
              <Panel className="p-5 sm:p-7">
                <div className="mb-5 flex items-center gap-3"><span className="connect-section-icon"><CalendarDays size={16} /></span><div><p className="connect-eyebrow">Along the way</p><h2 className="mt-1 font-clash text-2xl text-white">Experience</h2></div></div>
                <div className="space-y-5">
                  {profile.experiences.map((experience) => (
                    <article key={experience.id} className="connect-timeline-item">
                      <span className="connect-timeline-dot" />
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#83d9f0]">{experience.type.replaceAll('_', ' ')}</p>
                      <h3 className="mt-1 font-medium text-white">{experience.role}</h3>
                      {experience.organization && <p className="mt-1 text-xs text-[#aab6c2]">{experience.organization}</p>}
                      {experience.description && <p className="mt-2 text-xs leading-5 text-[#aab6c2]">{experience.description}</p>}
                      <p className="mt-2 text-[10px] text-[#82919e]">{experience.startedAt ? new Date(experience.startedAt).getFullYear() : '—'} — {experience.isCurrent ? 'Present' : experience.endedAt ? new Date(experience.endedAt).getFullYear() : '—'}</p>
                    </article>
                  ))}
                </div>
              </Panel>
            )}

            {profile.achievements.length > 0 && (
              <Panel className="p-5 sm:p-7">
                <p className="connect-eyebrow">Milestones</p><h2 className="mt-1 font-clash text-2xl text-white">Achievements</h2>
                <div className="mt-5 space-y-4">
                  {profile.achievements.map((achievement) => (
                    <article key={achievement.id} className="flex items-start justify-between gap-4 border-t border-white/[0.07] pt-4 first:border-0 first:pt-0">
                      <div><h3 className="text-sm font-medium text-white">{achievement.title}</h3>{achievement.description && <p className="mt-1 text-xs leading-5 text-[#aab6c2]">{achievement.description}</p>}</div>
                      {achievement.url && <a href={achievement.url} target="_blank" rel="noreferrer" aria-label={`View ${achievement.title}`} className="connect-card-arrow"><ExternalLink size={14} /></a>}
                    </article>
                  ))}
                </div>
              </Panel>
            )}
            {profile.knowledgePage?.publishedMarkdown && (
              <Panel className="p-5 sm:p-7">
                <p className="connect-eyebrow">Notes from the field</p><h2 className="mt-1 font-clash text-2xl text-white">Knowledge page</h2>
                {profile.knowledgePage.publishedAt && <p className="mt-2 text-[10px] text-[#82919e]">Published {new Date(profile.knowledgePage.publishedAt).toLocaleDateString()}</p>}
                <div className="connect-markdown-preview mt-4"><ConnectMarkdown markdown={profile.knowledgePage.publishedMarkdown} /></div>
              </Panel>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <Panel className="p-5 sm:p-6">
              <p className="connect-eyebrow">The toolkit</p>
              <div className="mt-4 space-y-4">
                <SkillGroup title="Skills" items={profile.skills} />
                <SkillGroup title="Curious about" items={profile.interests} />
                <SkillGroup title="Currently learning" items={profile.skillsInDevelopment} />
                <SkillGroup title="Happy to help with" items={profile.helpAreas} />
              </div>
            </Panel>
            {profile.socialLinks.length > 0 && (
              <Panel className="p-5 sm:p-6">
                <p className="connect-eyebrow">Find me elsewhere</p>
                <div className="mt-3 space-y-1">
                  {profile.socialLinks.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="connect-social-link">{link.label}<ArrowUpRight size={14} /></a>)}
                </div>
              </Panel>
            )}
            <div className="flex items-center gap-2 px-1 text-[10px] text-[#738490]"><ShieldCheck size={13} className="text-[#7ad7ef]" /> Student details confirmed by ISE</div>
          </aside>
        </div>
      </div>
    </ConnectShell>
  )
}

function SkillGroup({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-[#82919e]">{title}</p>
      <div className="flex flex-wrap gap-1.5">{items.map((item) => <span key={item} className="connect-chip">{item}</span>)}</div>
    </div>
  )
}

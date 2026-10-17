import type { Metadata } from 'next'
import { connection } from 'next/server'
import PublicProfilePage from '@/components/connect/PublicProfilePage'

export const metadata: Metadata = { title: 'Member | Nexora Connect' }

export default async function MemberProfilePage() {
  await connection()
  return <PublicProfilePage />
}

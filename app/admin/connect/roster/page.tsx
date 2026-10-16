import type { Metadata } from 'next'
import ConnectRosterView from '@/components/admin/ConnectRosterView'

export const metadata: Metadata = { title: 'Connect student list | Nexora Admin' }

export default function ConnectRosterPage() {
  return <ConnectRosterView />
}

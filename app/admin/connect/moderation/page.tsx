import type { Metadata } from 'next'
import ConnectModerationView from '@/components/admin/ConnectModerationView'

export const metadata: Metadata = { title: 'Connect moderation | Nexora Admin' }

export default function ConnectModerationPage() {
  return <ConnectModerationView />
}

import type { Metadata } from 'next'
import AuthPage from '@/components/connect/AuthPage'

export const metadata: Metadata = { title: 'Opening Nexora Connect' }

export default function ConnectStartPage() {
  return <AuthPage mode="start" />
}

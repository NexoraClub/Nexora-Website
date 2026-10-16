import type { Metadata } from 'next'
import AuthPage from '@/components/connect/AuthPage'

export const metadata: Metadata = { title: 'Join Nexora Connect' }

export default function SignUpPage() {
  return <AuthPage mode="sign-up" />
}

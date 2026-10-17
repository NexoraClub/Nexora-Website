import type { Metadata } from 'next'
import AuthPage from '@/components/connect/AuthPage'

export const metadata: Metadata = { title: 'Sign in | Nexora Connect' }

export default function SignInPage() {
  return <AuthPage mode="sign-in" />
}

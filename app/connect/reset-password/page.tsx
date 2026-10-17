import type { Metadata } from 'next'
import AuthPage from '@/components/connect/AuthPage'

export const metadata: Metadata = { title: 'Choose a new password | Nexora Connect' }

export default function ResetPasswordPage() {
  return <AuthPage mode="reset-password" />
}

import type { Metadata } from 'next'
import AuthPage from '@/components/connect/AuthPage'

export const metadata: Metadata = { title: 'Reset password | Nexora Connect' }

export default function ForgotPasswordPage() {
  return <AuthPage mode="forgot-password" />
}

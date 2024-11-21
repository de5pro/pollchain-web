import { AuthGuard } from '@/components/auth-guard'
import LoginPage from '@/components/login-page'

export default function Login() {
  return (
    <AuthGuard>
        <LoginPage />
    </AuthGuard>
  )
}
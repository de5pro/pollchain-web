import { AuthGuard } from '@/components/auth-guard'
import DashboardPage from '@/components/dashboard-page'

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  )
}
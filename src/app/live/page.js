import { AuthGuard } from '@/components/auth-guard'
import LivePollingPage from '@/components/live-polling'
import Navbar from '@/components/navbar'

export default function Live() {
  return (
    <AuthGuard>
        <Navbar />
        <LivePollingPage />
    </AuthGuard>
  )
}
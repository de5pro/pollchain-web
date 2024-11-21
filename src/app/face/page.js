import { AuthGuard } from '@/components/auth-guard'
import FaceVerificationPage from '@/components/face-verification-page'

export default function FaceVerification() {
  return (
    <AuthGuard>
      <FaceVerificationPage />
    </AuthGuard>
  )
}
import { AuthGuard } from "@/components/auth-guard";
import VotePage from "@/components/vote-page";

export default function Vote() {
  return (
    <>
    <AuthGuard>
      <VotePage />
    </AuthGuard>
    </>
  )
}
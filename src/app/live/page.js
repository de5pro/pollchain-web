import { AuthGuard } from '@/components/auth-guard'
import LivePollingPage from '@/components/live-polling'
import Navbar from "@/components/navbarv3";
import Footer from "@/components/footer";

export default function Live() {
  return (
    <>
      {/* <AuthGuard> */}
        <Navbar />
        <LivePollingPage />
        <Footer />
      {/* </AuthGuard> */}
    </>
  )
}
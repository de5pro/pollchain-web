import { AuthGuard } from '@/components/auth-guard'
import DetailsPage from '@/components/details-page'
import Navbar from '@/components/navbarv3'
import Footer from '@/components/footer'

export default function Details() {
  return (
    <>
    {/* <AuthGuard> */}
        <Navbar />
        <DetailsPage />
        <Footer />
    {/* </AuthGuard> */}
    </>
  )
}
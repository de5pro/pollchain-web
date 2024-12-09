'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/check-registration') {
        router.push('/check-registration');
      } else if (user && pathname === '/check-registration') {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);
  
  if (!user && pathname !== '/check-registration') {
    return null
  }

  return <>{children}</>
}
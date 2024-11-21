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
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);
  
  if (!user && pathname !== '/login') {
    return null
  }

  return <>{children}</>
}
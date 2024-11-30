'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

export default function LoginPage(props) {
  const [npm, setNpm] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!npm || !password) {
      setError('Please fill in all fields')
      return
    }

    const success = await login(npm, password)
    if (success && searchParams.get('origin') === 'vote') {
      router.push('/vote')
    } else if (success) {
      router.push('/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <Link href="/" className="mb-8">
        <h1 className="text-4xl font-bold text-black">votcha!</h1>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login to Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="npm">NPM (Student ID)</Label>
              <Input 
                id="npm" 
                type="text" 
                placeholder="Enter your NPM" 
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            {error && (
              <div className="text-red-500 flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-yellow-500 text-black hover:bg-yellow-600 transition-colors"
            >
              Log In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-yellow-600 hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
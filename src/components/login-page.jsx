'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function LoginPage() {
  const [npm, setNpm] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!npm || !password) {
      setError('Please fill in all fields')
      return
    }

    const user = await login(npm, password)
    if (!user) {
      setError('Invalid credentials')
      return
    } 

    setUserInfo(user)
    setShowDialog(true)
  }

  const handleDialogClose = () => {
    setShowDialog(false)
    router.push('/')
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

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Successful</AlertDialogTitle>
            <AlertDialogDescription>
              Here's your account information:
            </AlertDialogDescription>
          </AlertDialogHeader>
          {userInfo && (
            <div className="mt-4 space-y-2">
              <p><strong>NPM:</strong> {userInfo.npm}</p>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Voting Status:</strong> {userInfo.voting_status ? 'Voted' : 'Not Voted'}</p>
              <p><strong>Verification Status:</strong> {userInfo.is_verified ? 'Verified' : 'Not Verified'}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

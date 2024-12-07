'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ChevronRight } from 'lucide-react'
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
    router.push('/details')
  }

  return (
    <div className="min-h-screen bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35] flex flex-col justify-center items-center p-4">
      <Link href="/" className="mb-8">
        <h1 className="text-4xl font-light text-white">PollPal</h1>
      </Link>
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-[#001214]/50 border border-white/5 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-light text-center text-white">Check your registration status</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">NPM (Student ID)</Label>
              <Input 
                type="text" 
                placeholder="Enter your NPM" 
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                className="bg-[#002A35] border-[#00E5CC]/20 text-white focus:border-[#00E5CC] focus:ring-[#00E5CC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">PIN</Label>
              <Input 
                type="password" 
                placeholder="Enter your PIN"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#002A35] border-[#00E5CC]/20 text-white focus:border-[#00E5CC] focus:ring-[#00E5CC]"
              />
            </div>
            {error && (
              <div className="text-red-400 flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-[#00E5CC] text-[#001A1E] hover:bg-[#00c4af] transition-colors"
            >
              Log In
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#00E5CC] hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-[#002A35] border-[#00E5CC]/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Login Successful</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Here's your account information:
            </AlertDialogDescription>
          </AlertDialogHeader>
          {userInfo && (
            <div className="mt-4 space-y-2 text-gray-300">
              <p><strong className="text-[#00E5CC]">NPM:</strong> {userInfo.npm}</p>
              <p><strong className="text-[#00E5CC]">Name:</strong> {userInfo.name}</p>
              <p><strong className="text-[#00E5CC]">Voting Status:</strong> {userInfo.voting_status ? 'Voted' : 'Not Voted'}</p>
              <p><strong className="text-[#00E5CC]">Verification Status:</strong> {userInfo.is_verified ? 'Verified' : 'Not Verified'}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={handleDialogClose}
              className="bg-[#00E5CC] text-[#001A1E] hover:bg-[#00c4af] transition-colors"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
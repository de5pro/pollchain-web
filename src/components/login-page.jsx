'use client'

import * as React from "react"
import { useState, useRef} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ChevronRight, CircleOff } from 'lucide-react'
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
  const [npm, setNpm] = useState(Array(10).fill(""));
  const [pin, setPin] = useState(Array(6).fill(""));
  const npmInputRefs = useRef(npm.map(() => React.createRef()));
  const pinInputRefs = useRef(pin.map(() => React.createRef()));

  const [error, setError] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleNpmChange = (index, value) => {
    const newNpm = [...npm];
    const sanitizedValue = value.toUpperCase().replace(/[^0-9]/g, '').slice(0, 1);
    newNpm[index] = sanitizedValue;
    setNpm(newNpm);

    // Move focus to next input if current input is filled
    if (sanitizedValue && index < 9) {
      npmInputRefs.current[index + 1].current.focus();
    }
  };


  const handlePinChange = (index, value) => {
    const newPin = [...pin];
    const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 1);
    newPin[index] = sanitizedValue;
    setPin(newPin);

    // Move focus to next input if current input is filled
    if (sanitizedValue && index < 5) {
      pinInputRefs.current[index + 1].current.focus();
    }
  };

  const handleNpmKeyDown = (index, e) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && !npm[index] && index > 0) {
      npmInputRefs.current[index - 1].current.focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!npm || !pin) {
      setError('Please fill in all fields')
      return
    }

    const user = await login(npm.join(''), pin.join(''))
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
    <div className="min-h-screen bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35] flex flex-col justify-center items-center p-4 md:p-8">
      <Link href="/" className="mb-6 md:mb-8 flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors duration-500">
        <CircleOff className="h-6 w-6 md:h-8 md:w-8" />
        <h1 className="text-2xl md:text-4xl font-light">PollPal</h1>
      </Link>
      
      <Card className="w-full md:max-w-lg backdrop-blur-sm bg-[#001214]/50 border border-white/5 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-light text-center text-white">Check your registration status</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">NPM (Student ID)</Label>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
              {npm.map((digit, index) => (
                  <Input 
                    key={index} 
                    ref={npmInputRefs.current[index]}
                    value={digit}
                    onChange={(e) => handleNpmChange(index, e.target.value)}
                    onKeyDown={(e) => handleNpmKeyDown(index, e)}
                    maxLength={1}
                    className="w-7 md:w-10 text-center text-white bg-[#001A1E] border-[#00E5CC]/30 focus:border-[#00E5CC]" 
                  />
                ))}
                </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">PIN</Label>
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
              {pin.map((digit, index) => (
                  <Input 
                    key={index} 
                    ref={pinInputRefs.current[index]}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    maxLength={1}
                    className="w-8 md:w-10 text-center text-white bg-[#001A1E] border-[#00E5CC]/30 focus:border-[#00E5CC]" 
                  />
                ))}
                </div>
            </div>
            {error && (
              <div className="text-red-400 flex items-center space-x-2 text-sm md:text-base">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5" />
                <span>{error}</span>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-[#00E5CC] hover:bg-[#00E5CC]/80 text-[#001A1E] font-medium py-2 md:py-4 rounded-lg transition-colors duration-300"
            >
              Log In
              <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </form>
          <div className="mt-4 text-center text-xs md:text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#00E5CC] hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-[#002A35] border-[#00E5CC]/20 w-[90%] md:max-w-lg mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl md:text-2xl text-white">Login Successful</AlertDialogTitle>
            <AlertDialogDescription className="text-sm md:text-base text-gray-300">
              Here's your account information:
            </AlertDialogDescription>
          </AlertDialogHeader>
          {userInfo && (
            <div className="mt-4 space-y-2 text-sm md:text-base text-gray-300">
              <p><strong className="text-[#00E5CC]">NPM:</strong> {userInfo.npm}</p>
              <p><strong className="text-[#00E5CC]">Name:</strong> {userInfo.name}</p>
              <p><strong className="text-[#00E5CC]">Voting Status:</strong> {userInfo.voting_status ? 'Voted' : 'Not Voted'}</p>
              <p><strong className="text-[#00E5CC]">Verification Status:</strong> {userInfo.is_verified ? 'Verified' : 'Not Verified'}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={handleDialogClose}
              className="w-full md:w-auto bg-[#00E5CC] hover:bg-[#00E5CC]/80 text-[#001A1E] font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors duration-300"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
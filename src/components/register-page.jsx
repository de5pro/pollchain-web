'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Upload, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function RegisterPage() {
  const [npm, setNpm] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState('')
  const [privateKey, setPrivateKey] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [keySaved, setKeySaved] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!npm || !name || !pin || !image) {
      setError('Please fill in all fields and upload a photo')
      return
    }

    try {
      const result = await axios.postForm(API_BASE_URL + 'register', {
        npm: npm,
        name: name,
        password: pin,
        photo_ktm: image,
      })

      if (result.status === 200) {
        setPrivateKey(result.data.privateKey)
        setShowDialog(true)
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred during registration. Please try again.")
    }
  }

  const handleConfirm = () => {
    if (keySaved) {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35] flex flex-col justify-center items-center p-4">
      <Link href="/" className="mb-8">
        <h1 className="text-4xl font-light text-white">PollPal</h1>
      </Link>
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-[#001214]/50 border border-white/5 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-light text-center text-white">Create Your Account</CardTitle>
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
              <Label className="text-gray-300">Name</Label>
              <Input 
                type="text" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#002A35] border-[#00E5CC]/20 text-white focus:border-[#00E5CC] focus:ring-[#00E5CC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">PIN</Label>
              <Input 
                type="password" 
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="bg-[#002A35] border-[#00E5CC]/20 text-white focus:border-[#00E5CC] focus:ring-[#00E5CC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Photo</Label>
              <div className="relative aspect-video bg-[#002A35] rounded-lg overflow-hidden mb-2">
                {previewUrl ? (
                  <img src={previewUrl} alt="Uploaded" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No image uploaded
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <Button
                type="button"
                onClick={triggerFileInput}
                className="w-full bg-[#00E5CC] text-[#001A1E] hover:bg-[#00c4af] transition-colors"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
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
              Register
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Already registered?{' '}
            <Link href="/check-registration" className="text-[#00E5CC] hover:underline">
              Check here
            </Link>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-[#002A35] border-[#00E5CC]/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Registration Successful</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Your private key is:
              <div className="mt-2 p-4 bg-[#001A1E] rounded-lg break-all font-mono text-sm text-[#00E5CC]">
                {privateKey}
              </div>
              <div className="mt-4 text-red-400 font-semibold">
                Please save this private key. You won't be able to recover it later.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col items-stretch space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={keySaved}
                onCheckedChange={setKeySaved}
                className="border-[#00E5CC]"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium text-gray-300"
              >
                I have saved my private key
              </label>
            </div>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={!keySaved}
              className="bg-[#00E5CC] text-[#001A1E] hover:bg-[#00c4af] transition-colors disabled:opacity-50"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
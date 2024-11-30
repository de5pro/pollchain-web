'use client'

import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Camera } from 'lucide-react'

export default function FaceVerification() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [error, setError] = useState('')
  const webcamRef = useRef(null)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
    setError('')
  }, [webcamRef])

  const handleVerify = () => {
    if (!capturedImage) {
      setError('Please capture an image first')
      return
    }
    // Here you would typically send the image to your backend for verification
    console.log('Verifying face...')
    // For demo purposes, we'll just log the attempt
    // In a real app, you'd handle the API call and response here
  }

  return (
    (<div
      className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Face Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={capture}
              className="bg-yellow-500 text-black hover:bg-yellow-600 transition-colors">
              <Camera className="mr-2 h-4 w-4" /> Capture
            </Button>
            {capturedImage && (
              <Button
                onClick={() => setCapturedImage(null)}
                className="bg-gray-500 text-white hover:bg-gray-600 transition-colors">
                Retry
              </Button>
            )}
            <Button
              onClick={handleVerify}
              disabled={!capturedImage}
              className="bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Verify
            </Button>
          </div>
          {error && (
            <div className="text-red-500 flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>)
  );
}
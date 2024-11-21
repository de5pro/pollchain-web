'use client'

import { useState } from 'react'
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { Info, LogOut } from 'lucide-react'

// Mock data for candidates
const candidates = [
  { 
    id: 1, 
    name: "John Doe", 
    photo: "/placeholder.svg?height=100&width=100",
    faculty: "Computer Science",
    year: "3rd Year",
    manifesto: "I promise to improve the campus Wi-Fi and extend library hours."
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    photo: "/placeholder.svg?height=100&width=100",
    faculty: "Business Administration",
    year: "2nd Year",
    manifesto: "My goal is to increase student involvement in university decision-making processes."
  },
  { 
    id: 3, 
    name: "Alice Johnson", 
    photo: "/placeholder.svg?height=100&width=100",
    faculty: "Engineering",
    year: "4th Year",
    manifesto: "I will work towards creating more internship opportunities for all students."
  },
  { 
    id: 4, 
    name: "Bob Williams", 
    photo: "/placeholder.svg?height=100&width=100",
    faculty: "Arts and Humanities",
    year: "1st Year",
    manifesto: "I aim to promote diversity and inclusion in all campus activities."
  },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleInfoClick = (candidateId) => {
    const candidate = candidates.find(c => c.id === candidateId)
    setSelectedCandidate(candidate)
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-white text-black hover:bg-gray-100 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Welcome, {user?.name} (NPM: {user?.npm})</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="flex items-center p-4">
                  <img 
                    src={candidate.photo} 
                    alt={candidate.name} 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{candidate.name}</h3>
                  </div>
                  <Button
                    onClick={() => handleInfoClick(candidate.id)}
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedCandidate?.name}</DialogTitle>
              <DialogDescription>Candidate Information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <img 
                  src={selectedCandidate?.photo} 
                  alt={selectedCandidate?.name} 
                  className="w-32 h-32 rounded-full"
                />
              </div>
              <div>
                <h4 className="font-semibold">Faculty:</h4>
                <p>{selectedCandidate?.faculty}</p>
              </div>
              <div>
                <h4 className="font-semibold">Year:</h4>
                <p>{selectedCandidate?.year}</p>
              </div>
              <div>
                <h4 className="font-semibold">Manifesto:</h4>
                <p>{selectedCandidate?.manifesto}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
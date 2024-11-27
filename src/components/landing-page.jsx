'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Lock, Shield, Vote } from "lucide-react"

export function LandingPage() {
  const router = useRouter();

  return (
    (<div className="min-h-screen bg-white text-black">
      <header className="p-4 md:p-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">
            votcha!
          </h1>
          <div className="space-x-4">
            <Button variant="ghost" className="text-black hover:text-yellow-600">About</Button>
            <Button variant="ghost" className="text-black hover:text-yellow-600">How It Works</Button>
            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-black"
              onClick={() => router.push('/login')}>
              Login
            </Button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-black">
            Secure Online Voting
            <br />
            <span className="text-yellow-600">
              For Your University
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of campus democracy with our cutting-edge, tamper-proof voting system.
          </p>
          <Button
            className="bg-yellow-500 text-black text-lg px-8 py-6 rounded-full hover:bg-yellow-600 transition-colors"
            onClick={() => router.push('/login?origin=vote')}>
            Start Voting Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
        
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-100 border-gray-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Lock className="h-12 w-12 mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">Secure & Encrypted</h3>
              <p className="text-gray-600">Your vote is protected by advanced cryptographic techniques.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-100 border-gray-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Shield className="h-12 w-12 mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">Tamper-Proof</h3>
              <p className="text-gray-600">Blockchain technology ensures the integrity of every vote cast.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-100 border-gray-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Vote className="h-12 w-12 mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">Transparent</h3>
              <p className="text-gray-600">Real-time results with full auditability for maximum trust.</p>
            </CardContent>
          </Card>
        </section>
        
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-black">Ready to revolutionize campus voting?</h2>
          <Button
            className="bg-yellow-500 text-black text-lg px-8 py-6 rounded-full hover:bg-yellow-600 transition-colors">
            Join the votcha! Revolution
          </Button>
        </section>
      </main>
      <footer className="bg-gray-100 mt-16 py-8 text-center text-gray-600">
        <p>&copy; 2023 votcha!. All rights reserved.</p>
      </footer>
    </div>)
  );
}
'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Lock, Shield, Vote } from 'lucide-react'
import Navbar from "@/components/navbarv2"

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="px-44 dark:bg-gray-950">
      <div className="min-h-screen">
        <Navbar />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[10rem] opacity-80"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-green-300 rounded-full blur-[6rem] opacity-70"></div>
        <div className="absolute bottom-24 right-1/3 w-72 h-72 bg-yellow-400 rounded-full blur-[4rem] opacity-35"></div>
        <main className="container mx-auto px-4 py-12">
          <section className="text-center mb-16 pt-32">
            <h1 className="text-4xl md:text-6xl font-bold my-2 text-gray-900 dark:text-white drop-shadow-md">
              Secure Online Voting
            </h1>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-yellow-600 dark:text-yellow-400">
              For Your University
            </h2>
            <p className="text-lg text-gray-500 font-semibold dark:text-gray-300 drop-shadow-md backdrop-blur-sm mx-auto max-w-2xl rounded-lg pb-2">
              Experience the future of campus democracy with our cutting-edge, tamper-proof voting system.
            </p>
            <Button
              className="mt-8 bg-yellow-500 text-black text-lg px-8 py-6 rounded-full hover:bg-yellow-600 transition-colors"
              onClick={() => router.push('/verification')}
            >
              Start Voting Now
              <ChevronRight className="ml-2 h-5 w-4" />
            </Button>
          </section>
          
          <section className="my-20 grid grid-cols-1 md:grid-cols-3 gap-20">
            <Card className="h-80 backdrop-blur-lg bg-white/40 rounded-2xl border border-white/30 shadow-xl flex flex-col items-center dark:bg-gray-900 dark:backdrop-blur-xl dark:bg-opacity-60 dark:border-gray-800">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Lock className="h-16 w-16 mb-4 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Secure & Encrypted</h3>
                <p className="text-gray-600 dark:text-gray-300">Your vote is protected by advanced cryptographic techniques.</p>
              </CardContent>
            </Card>
            <Card className="h-80 backdrop-blur-lg bg-white/40 rounded-2xl border border-white/30 shadow-xl flex flex-col items-center dark:bg-gray-900 dark:backdrop-blur-xl dark:bg-opacity-60 dark:border-gray-800">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Shield className="h-16 w-16 mb-4 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Tamper-Proof</h3>
                <p className="text-gray-600 dark:text-gray-300">Blockchain technology ensures the integrity of every vote cast.</p>
              </CardContent>
            </Card>
            <Card className="h-80 backdrop-blur-lg bg-white/40 rounded-2xl border border-white/30 shadow-xl flex flex-col items-center dark:bg-gray-900 dark:backdrop-blur-xl dark:bg-opacity-60 dark:border-gray-800">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Vote className="h-16 w-16 mb-4 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Transparent</h3>
                <p className="text-gray-600 dark:text-gray-300">Real-time results with full auditability for maximum trust.</p>
              </CardContent>
            </Card>
          </section>
          
          <section className="text-center my-20">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Ready to revolutionize campus voting?</h2>
            <Button
              className="bg-yellow-500 text-black text-lg px-8 py-6 rounded-full hover:bg-yellow-600 transition-colors"
              onClick={() => router.push('/live')}
            >
              Join the votcha! Revolution
            </Button>
          </section>
        </main>
        <footer className="bg-gray-100 dark:bg-gray-800 mt-16 py-8 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2023 votcha!. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
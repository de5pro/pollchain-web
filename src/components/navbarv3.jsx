"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CircleOff } from 'lucide-react';
import { navItems } from "@/lib/data";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showAfterHide, setShowAfterHide] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Update visibility based on scroll direction
      if (scrollingDown && isVisible && currentScrollY > 50) {
        setIsVisible(false)
        setShowAfterHide(false)
        
        // Set timeout to show navbar after 2 seconds
        timeoutId = setTimeout(() => {
          setShowAfterHide(true)
        }, 2000)
      } else if (!scrollingDown && !isVisible) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [lastScrollY, isVisible])

  return (
    <AnimatePresence>
      {(isVisible || showAfterHide) && (
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
          initial={{ y: -100, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 rounded-full border border-white/10 shadow-lg">
              <div className="flex items-center justify-between px-10 py-3">
                <Link href="/" className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors duration-500">
                  <CircleOff className="h-6 w-6" />
                  <span className="text-xl font-light">PollPal</span>
                </Link>
                <nav>
                  <ul className="flex space-x-8">
                    {navItems.map((item) => (
                      <li key={item.name} className="flex items-center">
                        <Link
                          href={item.href}
                          className="text-white hover:text-cyan-400 transition-all duration-500 text-sm font-light transform hover:scale-105"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button className="bg-gradient-to-bl from-cyan-500 to-cyan-600 hover:from-cyan-700 hover:to-cyan-800 text-white px-4 py-2 rounded-full text-sm font-light transition-all duration-500 hover:scale-105" onClick={() => router.push('/check-registration')}>
                          Register to Vote
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

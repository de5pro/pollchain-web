"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { LogIn, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingNavbar() {
  const router = useRouter();
  const currentPath = usePathname();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const isActive = (path) => {
    console.log(path)
    currentPath === path;
  } 

  return (
    <div>
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 z-50">
        <motion.div
          className="backdrop-blur-md bg-gradient-to-br from-sky-400/70 to-cyan-200/70 shadow-lg p-2 rounded-lg border border-white/30 dark:from-sky-500/70 dark:to-cyan-300/70"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 120 }}
        >
          <ul className="flex items-center space-x-10 text-gray-900 dark:text-gray-50 font-medium px-8">
            <li className="flex">
              <Link
                href="/"
                className={`hover:text-gray-600 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors duration-300 ${
                  isActive("/") ? "bg-blue-500 text-white dark:bg-blue-700" : ""
                }`}
              >
                Home
              </Link>
            </li>
            {user !== null && (
              <li className="flex">
                <Link
                  href="/vote"
                  className={`hover:text-gray-600 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-300 ${
                    isActive("/vote") ? "bg-blue-500 text-white dark:bg-blue-700" : ""
                  }`}
                >
                  Vote
                </Link>
              </li>
            )}
            <li className="flex">
              <Link
                href="/live"
                className={`hover:text-gray-600 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors duration-300 ${
                  isActive("/live") ? "bg-blue-500 text-white dark:bg-blue-700" : ""
                } flex items-center gap-2`}
              >
                Live Results
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </Link>
            </li>
            <li className="flex relative">
              {user !== null ? (
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 hover:text-gray-600 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors duration-300"
                >
                  Account <ChevronDown size={16} />
                </button>
              ) : (
                <button
                  onClick={() => router.push('/login?origin=vote')}
                  className="flex items-center gap-1 hover:text-gray-600 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors duration-300"
                >
                  <LogIn size={16} /> Login
                </button>
              )}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} className="inline mr-2" /> Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </motion.div>
      </nav>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50"
      >
        {isDarkMode ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
      </Button>
    </div>
  );
}

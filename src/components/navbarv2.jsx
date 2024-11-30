"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CircleOff } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function FloatingNavbar() {
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 z-50">
        <motion.div
            className="backdrop-blur-md bg-gradient-to-br from-sky-400/70 to-cyan-200/70 shadow-lg p-2 rounded-lg border border-white/30 dark:from-sky-500/70 dark:to-cyan-300/70"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 120 }}
        >
            <ul className="flex space-x-10 text-gray-900 dark:text-gray-950 font-medium px-8">
                <li className="flex"><a href="#" className="hover:text-gray-600 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors duration-300">Home</a></li>
                <li className="flex"><a href="#" className="hover:text-gray-600 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors duration-300">About</a></li>
                <li className="flex"><Link href="/" className="flex gap-2 font-bold cursor-pointer tracking-wider text-gray-950 font-sans text-lg items-center hover:bg-white/20 px-2 rounded-lg transition-colors duration-300"><CircleOff />PollPal</Link></li>
                <li className="flex"><a href="#" className="hover:text-gray-600 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors duration-300">Services</a></li>
                <li className="flex"><a href="#" className="hover:text-gray-600 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors duration-300">Contact</a></li>
            </ul>
        </motion.div>
    </nav>
  );
}

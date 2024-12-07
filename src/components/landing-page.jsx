"use client";

import {
  BarChart2,
  ChevronRight,
  Lock,
  PieChart,
  Shield,
  TrendingUp,
  Vote,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const icons = [BarChart2, PieChart, TrendingUp];

export function LandingPage() {
  const [activeIcon, setActiveIcon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35]">
      <main className="container mx-auto px-4 pt-40">
        <section className="text-center">
          <h2 className="text-4xl md:text-6xl font-light mb-2 text-white">
            Secure E-Voting
          </h2>
          <span className="text-[#00E5CC] text-4xl md:text-6xl font-light">
            For Your{" "}
            <TypeAnimation
              sequence={["University", 2000, "Election", 2000, "Company", 2000]}
              wrapper="span"
              speed={200}
              repeat={Infinity}
            />
          </span>
          <p className="text-xl text-gray-300 mt-4 mb-12 text-center mx-auto">
            Experience the future of democracy with our cutting-edge, blockchain
            powered, tamper-proof voting system.
          </p>
          <Link
            className="inline-flex items-center bg-[#00E5CC] text-[#001A1E] text-lg px-6 py-4 rounded-full hover:bg-[#00c4af] transition-colors hover:cursor-pointer"
            href="/details"
          >
            Start Voting Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </section>

        {/* Services Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-12 xl:p-8 border border-white/5">
            <div className="grid md:grid-cols-3 gap-16">
              <ServiceCard
                icon={<Lock className="w-12 h-12" />}
                title="Secure & Encrypted"
                description="Your vote is protected by advanced cryptographic techniques."
              />
              <ServiceCard
                icon={<Shield className="w-12 h-12" />}
                title="Tamper-Proof"
                description="Blockchain technology ensures the integrity of every vote cast."
              />
              <ServiceCard
                icon={<Vote className="w-12 h-12" />}
                title="Transparent"
                description="Real-time results with full auditability for maximum trust."
              />
            </div>
          </div>
        </section>

        <section className="text-center py-24">
          <h2 className="mb-4 text-5xl font-bold text-white">
            Experience Real-Time Voting Analytics
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Monitor live voting progress and results with our advanced analytics
            dashboard
          </p>
          <motion.div
            className="mb-8 flex justify-center space-x-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {icons.map((Icon, index) => (
              <motion.div
                key={index}
                className={`rounded-full bg-[#00E5CC] p-4 ${
                  index === activeIcon ? "scale-125" : "scale-100 opacity-50"
                }`}
                animate={{
                  scale: index === activeIcon ? 1.25 : 1,
                  opacity: index === activeIcon ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="h-8 w-8 text-[#001A1E]" />
              </motion.div>
            ))}
          </motion.div>
          <Link
            className="inline-flex items-center bg-[#00E5CC] text-[#001A1E] text-lg px-8 py-4 rounded-full hover:bg-[#00c4af] transition-colors"
            href="/live"
          >
            View Live Dashboard
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </section>
      </main>
    </div>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="text-center group">
      <div className="text-[#00E5CC] mb-6 flex justify-center">{icon}</div>
      <h3 className="text-2xl font-light text-white mb-4 group-hover:text-[#00E5CC] transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

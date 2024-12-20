"use client"

import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  Shield,
  ArrowLeftRight,
  Network,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { candidates, polling } from "@/lib/data";

export default function DetailsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-light text-white">
            {polling.header}
            <br />
            <span className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-200 bg-clip-text text-transparent text-5xl">
              {polling.title}
            </span>
          </h1>
          <p className="text-lg tracking-wide text-gray-400 pt-2">
            {polling.description}
          </p>
        </div>

        {/* Candidates Section */}
        <section>
          <div className="grid md:grid-cols-3 gap-8">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                name={candidate.name}
                subtitle={candidate.subtitle}
                image={candidate.image}
                description={candidate.description}
              />
            ))}
          </div>
        </section>

        {/* Glassmorphism Card */}
        <div className="mt-16 backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-8 border border-white/5 hover:border-[#00E5CC]/30 transition-colors group">
          <h2 className="text-2xl font-light text-white mb-8 group-hover:text-[#00E5CC]">
            Voting Location Details
          </h2>
          <div className="grid gap-8">
            <DetailItem icon={<MapPin className="h-5 w-5" />} label="Location">
              Universitas Indonesia, Jl. Prof. DR. Ir R Roosseno, Kukusan, Beji,
              Depok City, West Java 16425
            </DetailItem>
            <DetailItem icon={<Calendar className="h-5 w-5" />} label="Date">
              December 11, 2024
            </DetailItem>
            <DetailItem icon={<Clock className="h-5 w-5" />} label="Time">
              8:00 AM - 17:00 PM
            </DetailItem>
            <DetailItem
              icon={<Users className="h-5 w-5" />}
              label="Eligible Voters"
            >
              Registered student of Department of Electrical Engineering FTUI
            </DetailItem>
            <DetailItem
              icon={<Info className="h-5 w-5" />}
              label="Requirements"
            >
              Valid university-issued ID, Valid private key
            </DetailItem>
          </div>
        </div>

        {/* Button to cast vote */}
        <section>
          <div className="mt-8">
            <div className="backdrop-blur-sm bg-[#001214]/60 rounded-2xl p-8 border border-white/5 hover:border-[#00E5CC]/30 transition-colors relative overflow-hidden group w-full">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-x-32 -translate-y-32 group-hover:bg-[#00E5CC]/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-x-32 translate-y-32 group-hover:bg-[#00E5CC]/10 transition-colors duration-500"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-left md:flex-1">
                  <h3 className="text-3xl font-light text-white mb-4 group-hover:text-[#00E5CC]">
                    Ready to make your choice?
                  </h3>
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#00E5CC]" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-[#00E5CC]" />
                      <span>Decentralized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="h-5 w-5 text-[#00E5CC]" />
                      <span>Immutable</span>
                    </div>
                  </div>
                </div>
                <div className="md:flex-shrink-0">
                  <button className="bg-gradient-to-bl from-cyan-400 via-cyan-600 to-cyan-800 text-white px-12 py-4 rounded-xl text-lg font-light transition-all duration-500 hover:from-cyan-500 hover:via-cyan-700 hover:to-cyan-900 hover:scale-105 group/btn relative" onClick={() => router.push('/verification')}>
                    <span className="relative z-10 flex items-center">
                      Cast Your Vote
                      <ChevronRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, children }) {
  return (
    <div className="flex items-start group/item cursor-default">
      <div className="flex-shrink-0 text-cyan-500 mr-3">{icon}</div>
      <div className="flex-1">
        <p className="text-gray-400 font-light mb-1">{label}</p>
        <p className="text-white group-hover/item:text-cyan-400 transition-colors">
          {children}
        </p>
      </div>
      <Info className="h-5 w-5 text-cyan-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
    </div>
  );
}

function CandidateCard({ name, subtitle, image, description }) {
  return (
    <div className="backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-6 border border-white/5 group hover:border-[#00E5CC]/30 transition-colors">
      <div className="mb-4 overflow-hidden rounded-xl w-full h-[16rem]">
        <img
          src={image}
          alt={`Portrait of ${name}`}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-2xl font-light text-white mb-2 group-hover:text-[#00E5CC] transition-colors">
        {name}
      </h3>
      <p className="text-[#00E5CC] mb-4">{subtitle}</p>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

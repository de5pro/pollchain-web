"use client";

import { useState, useEffect } from "react";
import BlockExplorer from "@/components/block-explorer";
import { getWalletBalance } from "@/actions/actions";
import { Copy, Check } from "lucide-react";
import { candidates } from "@/lib/data";

const truncateString = (input, maxLength, limit) => {
  if (input.length <= limit) return input; // Only truncate if length exceeds limit

  const ellipsis = "...";
  const prefixLength = Math.floor((maxLength - ellipsis.length) / 2); // Length for the start
  const suffixLength = maxLength - ellipsis.length - prefixLength; // Length for the end
  return `${input.slice(0, prefixLength)}${ellipsis}${input.slice(
    -suffixLength
  )}`;
};

export default function LivePollingPage() {
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const votesPromises = candidates.map((candidate) =>
          getWalletBalance(candidate.address)
        );

        const results = await Promise.all(votesPromises);
        const newVotes = results.map((result) => result.balance || 0);

        setVotes(newVotes);
        const newTotal = newVotes.reduce((acc, curr) => acc + curr, 0);
        setTotalVotes(newTotal);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();

    const interval = setInterval(fetchVotes, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35]">
      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-light text-white">
            Live Polling:
            <br />
            <span className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-200 bg-clip-text text-transparent text-5xl">
              Real-Time Polling Results
            </span>
          </h1>
          <p className="text-lg tracking-wide text-gray-400 pt-2">
            Track and engage with live polling results in real-time. Every vote
            counts.
          </p>
        </div>

        {/* Candidates Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {candidates.map((candidate, index) => (
            <CandidateCard
              key={index}
              name={candidate.name}
              address={candidate.address}
              votes={isLoading ? "..." : votes[index]}
              image={candidate.image}
              onCopy={() => handleCopy(candidate.address, index)}
              isCopied={copiedIndex === index}
            />
          ))}
        </div>

        {/* Vote Distribution Section */}
        <div className="backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-8 border border-white/5 group hover:border-[#00E5CC]/30 transition-colors">
          <h2 className="text-3xl font-semibold text-white mb-8 group-hover:text-[#00E5CC] transition-colors duration-300">
            Vote Distribution
          </h2>
          <div className="space-y-6">
            {candidates.map((candidate, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-32 text-right">
                  <span className="text-gray-300 font-medium text-md">
                    {candidate.name}
                  </span>
                </div>
                <div className="flex-grow h-8 bg-[#001214]/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-[#00E5CC] transition-all duration-500 relative"
                    style={{
                      width: `${((votes[index] || 0) / totalVotes) * 100}%`,
                    }}
                  >
                    <span className="absolute right-0 top-1/2 transform translate-x-14 -translate-y-1/2 text-[#00E5CC] text-md font-semibold">
                      {`${(((votes[index] || 0) / totalVotes) * 100).toFixed(
                        1
                      )}%`}
                    </span>
                  </div>
                </div>
                <div className="w-24 flex items-center gap-2">
                  <span className="text-white font-sans font-semibold text-lg">
                    {votes[index] || 0}
                  </span>
                  <span className="text-[#00E5CC] font-semibold text-md mt-[0.15rem]">
                    Votes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Block Explorer Section */}
        <BlockExplorer />
    </div>
  );
}

function CandidateCard({ name, address, votes, image, onCopy, isCopied }) {
  return (
    <div className="backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-6 border border-white/5 group hover:border-[#00E5CC]/30 transition-colors">
      <div className="mb-4 overflow-hidden rounded-xl w-full h-[16rem]">
        <img
          src={image}
          alt={`Portrait of ${name}`}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-2xl font-light text-white group-hover:text-[#00E5CC] transition-colors text-center">
        {name}
      </h3>
      <div className="flex items-center justify-center gap-2">
        <p className="text-gray-400 text-sm">
          {truncateString(address, 35, 35)}
        </p>
        <button
          onClick={onCopy}
          className="hover:bg-[#001214]/50 rounded-full p-1 transition-colors"
          title="Copy address"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-[#00E5CC]" />
          ) : (
            <Copy className="h-4 w-4 text-gray-400 hover:text-[#00E5CC]" />
          )}
        </button>
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white font-sans group-hover:text-[#00E5CC] transition-colors">
          {votes || 0}
        </h1>
        <h2 className="text-[#00E5CC] font-semibold text-lg">Votes</h2>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import BlockExplorer from "@/components/block-explorer";
import { getWalletBalance } from "@/actions/actions";
import { Copy, Check } from "lucide-react";
import { candidates, polling } from "@/lib/data";

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
    <div className="min-h-screen px-4 md:px-0 pt-20 sm:pt-24 pb-12 sm:pb-16 bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35]">
      {/* Title Section */}
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-4">
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-light text-white">
            Live Polling: {polling.title}
            <br />
            <span className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-200 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl mt-2">
              Real-Time Polling Results
            </span>
          </h1>
          <p className="text-xs px-8 md:px-0 sm:text-lg tracking-wide text-gray-400 pt-2">
            Track and engage with live polling results in real-time. Every vote
            counts.
          </p>
        </div>

        {/* Candidates Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8 mb-6 sm:mb-12 lg:mb-16">
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
        <div className="backdrop-blur-sm bg-[#001214]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/5 group hover:border-[#00E5CC]/30 transition-colors">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6 sm:mb-8 group-hover:text-[#00E5CC] transition-colors duration-300">
            Vote Distribution
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
              >
                <div className="sm:w-32 text-left sm:text-right">
                  <span className="text-gray-300 font-medium text-sm sm:text-base">
                    {candidate.name}
                  </span>
                </div>
                <div className="flex-grow h-6 sm:h-8 bg-[#001214]/50 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-[#00E5CC] transition-all duration-500"
                    style={{
                      width:
                        totalVotes === 0
                          ? "0%"
                          : `${((votes[index] || 0) / totalVotes) * 100}%`,
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-4">
                    <span className="text-[#00E5CC] text-sm sm:text-base font-semibold ml-2">
                      {totalVotes === 0
                        ? "0%"
                        : `${(((votes[index] || 0) / totalVotes) * 100).toFixed(
                            1
                          )}%`}
                    </span>
                  </div>
                </div>
                <div className="w-full sm:w-24 flex items-center gap-1 sm:gap-2 justify-end sm:justify-end">
                  <span className="text-white font-sans font-semibold text-base sm:text-lg">
                    {votes[index] || 0}
                  </span>
                  <span className="text-[#00E5CC] font-semibold text-sm sm:text-base mt-[0.15rem]">
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
    <div className="backdrop-blur-sm bg-[#001214]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 group hover:border-[#00E5CC]/30 transition-colors">
      <div className="mb-3 sm:mb-4 overflow-hidden rounded-lg sm:rounded-xl w-full h-[12rem] sm:h-[14rem] md:h-[16rem]">
        <img
          src={image}
          alt={`Portrait of ${name}`}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-xl sm:text-2xl font-light text-white group-hover:text-[#00E5CC] transition-colors text-center">
        {name}
      </h3>
      <div className="flex items-center justify-center gap-2 mt-1">
        <p className="text-gray-400 text-xs sm:text-sm">
          {truncateString(address, 25, 25)}
        </p>
        <button
          onClick={onCopy}
          className="hover:bg-[#001214]/50 rounded-full p-1.5 transition-colors"
          title="Copy address"
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00E5CC]" />
          ) : (
            <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 hover:text-[#00E5CC]" />
          )}
        </button>
      </div>
      <div className="text-center mt-2 sm:mt-3">
        <h1 className="text-4xl sm:text-5xl font-bold text-white font-sans group-hover:text-[#00E5CC] transition-colors">
          {votes || 0}
        </h1>
        <h2 className="text-[#00E5CC] font-semibold text-base sm:text-lg">
          Votes
        </h2>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import BlockExplorer from "@/components/block-explorer";
import Navbar from "@/components/navbarv2";
import { getWalletBalance } from "@/actions/actions";
import { Copy, Check } from "lucide-react";

const truncateString = (input, maxLength, limit) => {
  if (input.length <= limit) return input; // Only truncate if length exceeds limit

  const ellipsis = "...";
  const prefixLength = Math.floor((maxLength - ellipsis.length) / 2); // Length for the start
  const suffixLength = maxLength - ellipsis.length - prefixLength; // Length for the end
  return `${input.slice(0, prefixLength)}${ellipsis}${input.slice(
    -suffixLength
  )}`;
};

const candidates = [
  {
    name: "Candidate 1",
    address: "04414b1ffabcbdd4b74ebd68f4f5ecfa15600426f3a2fe95247afa0636e1d7251f50ed1afd4e975c8305cb86a6187e26ec4f45348baac39a0d6bf6c066b9d2152c",
    votes: 0,
  },
  {
    name: "Candidate 2",
    address: "04a21b31dcc89d13e4fb78cb5f8e2505a49ae8eed9d4b6b9495ab9dec05686e249f537e2850f9bdd58b8bd04e9e30663267d614eba120a97b159448e58cdeeba05",
    votes: 0,
  },
  {
    name: "Candidate 3",
    address: "049a94e4bde78b026dfdc764c317949a866bd2731ae0be9f15b3f8ba382ced8ef5cb3ffddc51c10c951342265e105102fd1b3d55e99066e7bacdf591726d49d4aa",
    votes: 0,
  },
];

export default function LivePollingPage() {
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const votesPromises = candidates.map(candidate =>
          getWalletBalance(candidate.address)
        );

        const results = await Promise.all(votesPromises);
        const newVotes = results.map(result => result.balance || 0);

        setVotes(newVotes);
        const newTotal = newVotes.reduce((acc, curr) => acc + curr, 0);
        setTotalVotes(newTotal);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();

    const interval = setInterval(fetchVotes, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="px-44 dark:bg-gray-950">
        <div className="h-screen">
          <Navbar />
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[10rem] opacity-80"></div>
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-green-300 rounded-full blur-[6rem] opacity-70"></div>
          <div className="absolute bottom-24 right-1/3 w-72 h-72 bg-yellow-400 rounded-full blur-[4rem] opacity-35"></div>
          <div className="pt-32">
            <h1 className="text-center text-4xl font-bold my-2 text-gray-900 dark:text-white drop-shadow-md">
              Live Polling
            </h1>
            <h2 className="text-center text-lg text-gray-500 font-semibold dark:text-gray-300 drop-shadow-md backdrop-blur-sm mx-auto max-w-2xl rounded-lg pb-2">
              Real-Time Polling Dashboard: Cast, Track, and Engage in Live
              Elections
            </h2>
          </div>
          <div className="my-10 grid grid-cols-3 gap-20">
            {candidates.map((candidate, index) => (
              <div
                className=" h-80 backdrop-blur-lg bg-white/40 rounded-2xl border border-white/30 shadow-xl flex flex-col items-center dark:bg-gray-900 dark:backdrop-blur-xl dark:bg-opacity-60 dark:border-gray-800"
                key={index}
              >
                <div className="rounded-full h-28 w-28 mt-4">
                  <img
                    src="https://freenaturestock.com/wp-content/uploads/freenaturestock-2228-768x1152.jpg"
                    alt="user_profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <h1 className="text-black font font-semibold text-xl mt-4 mb-1 dark:text-gray-200">
                  {candidate.name}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-sm text-gray-500 text-center break-words">
                    {truncateString(candidate.address, 30, 30)}
                  </h2>
                  <button
                    onClick={() => handleCopy(candidate.address, index)}
                    className="hover:bg-gray-100 rounded-full transition-colors"
                    title="Copy address"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
                <div>
                  <h1 className="text-black text-center font-bold mt-4 text-5xl dark:text-gray-300">
                    {votes[index] || 0}
                  </h1>
                  <h2 className="text-center text-xl dark:text-gray-400">
                    Votes
                  </h2>
                </div>
              </div>
            ))}
          </div>
          <div className="py-6 px-14 col-span-3 gap-1 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-xl flex flex-col items-center dark:bg-gray-900 dark:backdrop-blur-xl dark:bg-opacity-60 dark:border-gray-800">
            {candidates.map((candidate, index) => (
              <div className="grid grid-cols-7" key={index}>
                <div className="flex col-span-1">
                  <span className="text-md font-semibold dark:text-gray-300">
                    {candidate.name}
                  </span>
                </div>
                <div className="mx-2 bg-gray-200 rounded-full col-span-5 dark:bg-gray-400">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full"
                    style={{
                      width: `${((votes[index] || 0) / totalVotes) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-end col-span-1">
                  <span className="text-md font-semibold dark:text-gray-300">{`${(
                    ((votes[index] || 0) / totalVotes) *
                    100
                  ).toFixed(2)}% (${votes[index] || 0} Votes)`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-screen bg-gray pt-32" id="block-explorer">
          <BlockExplorer />
        </div>
      </div>
    </>
  );
}

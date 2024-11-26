"use client";

import { useRouter } from "next/navigation";
import BlockExplorer from "@/components/block-explorer";

const candidates = [
  {
    name: "Candidate 1",
    address: "0xajkKJAibuaOAIBbhjAKnsij",
    votes: 10,
  },
  {
    name: "Candidate 2",
    address: "0xajkKJAibuaOAIBbhjAKnsij",
    votes: 20,
  },
  {
    name: "Candidate 3",
    address: "0xajkKJAibuaOAIBbhjAKnsij",
    votes: 30,
  },
];

export default function LivePollingPage() {
  const router = useRouter();
  const totalVotes = candidates.reduce((acc, candidate) => acc + candidate.votes, 0);

  return (
    <>
      <div className="px-44 dark:bg-gray-900">
        <div className="pt-2">
          <h1 className="text-center text-4xl font-bold my-2">Live Polling</h1>
          <h2 className="text-center text-gray-600 font-semibold dark:text-gray-400">
            Real-Time Polling Dashboard: Cast, Track, and Engage in Live
            Elections
          </h2>
        </div>
        <div className="my-8 grid grid-cols-3 gap-20">
          {candidates.map((candidate, index) => (
            <div
              className=" h-80 rounded-xl border bg-card text-card-foreground shadow flex flex-col items-center dark:bg-gray-800"
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
              <h2 className="text-sm text-gray-500">{candidate.address}</h2>
              <div>
                <h1 className="text-black text-center font-bold mt-4 text-5xl dark:text-gray-300">
                  {candidate.votes}
                </h1>
                <h2 className="text-center text-xl dark:text-gray-400">Votes</h2>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow py-6 px-14 col-span-3 flex flex-col gap-1 dark:bg-gray-800">
          {candidates.map((candidate, index) => (
            <div className="grid grid-cols-7" key={index}>
              <div className="flex col-span-1">
                <span className="text-md font-semibold dark:text-gray-300">{candidate.name}</span>
              </div>
              <div className="bg-gray-200 rounded-full col-span-5 dark:bg-gray-400">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full"
                  style={{
                    width: `${((candidate.votes / totalVotes) * 100).toFixed(0)}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-end col-span-1">
                <span className="text-md font-semibold dark:text-gray-300">{`${(
                  (candidate.votes / totalVotes) *
                  100
                ).toFixed(2)}% (${candidate.votes} Votes)`}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="h-screen bg-gray mt-6 pt-12" id="block-explorer">
          <BlockExplorer />
        </div>
      </div>
    </>
  );
}

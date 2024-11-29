"use client";

import { useRouter } from "next/navigation";
import BlockExplorer from "@/components/block-explorer";
// import Navbar from "@/components/navbar";
import Navbar from "@/components/navbarv2";

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
  const totalVotes = candidates.reduce(
    (acc, candidate) => acc + candidate.votes,
    0
  );

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
                <h2 className="text-sm text-gray-500">{candidate.address}</h2>
                <div>
                  <h1 className="text-black text-center font-bold mt-4 text-5xl dark:text-gray-300">
                    {candidate.votes}
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
                      width: `${((candidate.votes / totalVotes) * 100).toFixed(
                        0
                      )}%`,
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
        </div>
        <div className="h-screen bg-gray pt-32" id="block-explorer">
          <BlockExplorer />
        </div>
      </div>
    </>
  );
}

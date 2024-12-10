"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { format, toZonedTime } from "date-fns-tz";
import { getAllBlocks } from "@/actions/actions";

const truncateString = (input, maxLength, limit) => {
  if (input.length <= limit) return input; // Only truncate if length exceeds limit

  const ellipsis = "...";
  const prefixLength = Math.floor((maxLength - ellipsis.length) / 2); // Length for the start
  const suffixLength = maxLength - ellipsis.length - prefixLength; // Length for the end
  return `${input.slice(0, prefixLength)}${ellipsis}${input.slice(
    -suffixLength
  )}`;
};

export default function Component() {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [currentBlocks, setCurrentBlocks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [latestBlock, setLatestBlock] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("Real-Time Clock");

  const filteredBlocks = useMemo(() => {
    if (!activeSearchQuery.trim() || !currentBlocks) return currentBlocks;

    const query = activeSearchQuery.trim().toLowerCase();
    return currentBlocks.filter((block) => {
      if (!block.transactions || block.transactions.length === 0) return false;
      return block.transactions.some(
        (transaction) =>
          transaction.from?.toLowerCase() === query ||
          transaction.to?.toLowerCase() === query
      );
    });
  }, [activeSearchQuery, currentBlocks]);

  useEffect(() => {
    const fetchBlocks = async () => {
      const response = await getAllBlocks();
      // Add blockHeight to each block, starting from 0
      const blocksWithHeight = response.blocks.map((block, index) => ({
        ...block,
        blockHeight: index,
      }));
      setCurrentBlocks(blocksWithHeight);
      setIsLoading(false);
    };

    fetchBlocks();
  }, []);

  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        const response = await getAllBlocks();
        const blocks = response.blocks;

        if (blocks.length > 0) {
          const lastBlock = {
            ...blocks[blocks.length - 1],
            blockHeight: blocks.length - 1,
          };

          if (!latestBlock || lastBlock.timestamp !== latestBlock.timestamp) {
            setLatestBlock(lastBlock);
            setCurrentBlocks(
              blocks.map((block, index) => ({
                ...block,
                blockHeight: index,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    const interval = setInterval(() => {
      fetchLatestBlock();
    }, 5000);

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const utcDate = new Date();
      const jakartaTime = toZonedTime(utcDate, "Asia/Jakarta");
      const formattedDate = format(
        jakartaTime,
        "EEE, dd MMM yyyy HH:mm:ss 'WIB'"
      );

      setCurrentTime(formattedDate);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setActiveSearchQuery(searchQuery);
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setActiveSearchQuery("");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const openBlockDetails = (block, height) => {
    setSelectedBlock(block);
    setSelectedHeight(height);
    setIsDialogOpen(true);
  };

  return (
    <div
      className="max-w-7xl mx-auto pt-24"
      id="block-explorer"
    >
      <div className={`${isDarkMode ? "dark" : ""}`}>
        <div className="container mx-auto space-y-6 transition-colors duration-200 ease-in-out dark:text-white">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-white mb-4">
              Track Your Vote
            </h2>
            <p className="text-lg text-[#00E5CC]">
              Search and verify your vote in the blockchain
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="backdrop-blur-sm bg-[#001214]/50 rounded-full border border-white/5 flex items-center p-1">
              <input
                type="text"
                placeholder="Search through blockchain transactions by public key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-gray-400 flex-grow px-4 py-2 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-[#00E5CC] text-[#001A1E] rounded-full px-6 py-2 flex items-center transition-colors hover:bg-[#00C4B0]"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* New Block Section */}
          <div className="backdrop-blur-sm bg-gradient-to-r from-cyan-600 to-[#00E5CC] rounded-2xl overflow-hidden">
            <div className="p-0">
              <div className="flex items-center h-12">
                <div className="flex-shrink-0 border-r border-white/5 h-full flex items-center px-6 bg-gray-950/25">
                  <span className="font-medium text-white md:min-w-32 md:text-base text-xs">
                    {isLoading == false && latestBlock !== null
                      ? "New Block Mined!"
                      : "Loading Data..."}
                  </span>
                </div>
                <div className="flex-grow overflow-hidden bg-blue-900/20">
                  <AnimatePresence>
                    <motion.div
                      initial={{ x: "150%" }}
                      animate={{ x: "-200%" }}
                      exit={{ x: "-100%" }}
                      transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                      className="whitespace-nowrap"
                    >
                      {isLoading == false && latestBlock !== null ? (
                        <div className="inline-flex items-center h-14 px-6 gap-8 md:text-base text-xs">
                          <span className="text-white font-semibold">
                            Height:{" "}
                            <span className="text-white font-light">
                              {currentBlocks.length - 1}
                            </span>
                          </span>
                          <span className="text-white font-semibold">
                            Hash:{" "}
                            <span className="text-white font-light">
                              {truncateString(latestBlock.hash, 30, 20)}
                            </span>
                          </span>
                          <span className="text-white font-semibold">
                            Nonce:{" "}
                            <span className="text-white font-light">
                              {latestBlock.nonce}
                            </span>
                          </span>
                          <span className="text-white font-semibold">
                            Previous Hash:{" "}
                            <span className="text-white font-light">
                              {truncateString(latestBlock.previousHash, 30, 20)}
                            </span>
                          </span>
                          <span className="text-white font-semibold">
                            Transactions:{" "}
                            <span className="text-white font-light">
                              {latestBlock.transactions.length}
                            </span>
                          </span>
                          <span className="text-white font-semibold">
                            Timestamp:{" "}
                            <span className="text-white font-light">
                              {latestBlock.timestamp === "0"
                                ? "0"
                                : format(
                                    new Date(parseInt(latestBlock.timestamp)),
                                    "yyyy-MM-dd HH:mm:ss"
                                  )}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center h-14 px-6 gap-8 text-white/80 md:text-base text-xs">
                          <span>Fetching new blocks every 5 seconds...</span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex-shrink-0 border-l border-white/5 h-full flex items-center px-6 bg-gray-950/25 md:text-base text-xs">
                  <span className="font-medium text-white">{currentTime}</span>
                  <span className="relative flex h-3 w-3 md:ml-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 duration-[1500ms]"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Blocks Section */}
          <Card className="backdrop-blur-sm bg-[#001214]/70 rounded-2xl border border-white/5 group hover:border-[#00E5CC]/30 transition-colors dark:bg-gray-800 px-4">
            <CardHeader>
              <CardTitle className="md:text-3xl text-lg font-semibold text-white group-hover:text-[#00E5CC] transition-colors duration-300">
                Recent Blocks
              </CardTitle>
              <CardDescription className="text-[#00E5CC] text-xs md:text-base dark:text-gray-400">
                Latest blocks added to the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto min-h-[20rem] max-h-[20rem]">
                <Table>
                  <TableHeader>
                    <TableRow className="sticky top-0 z-10 hover:bg-[#001214]/50 md:text-base text-xs">
                      <TableHead className="w-[5%] text-white">
                        Height
                      </TableHead>
                      <TableHead className="w-[25%] text-white">Hash</TableHead>
                      <TableHead className="w-[5%] text-white">Nonce</TableHead>
                      <TableHead className="w-[25%] text-white">
                        Previous Hash
                      </TableHead>
                      <TableHead className="w-[20%] text-white">
                        Timestamp
                      </TableHead>
                      <TableHead className="w-[15%] text-white">
                        Transactions
                      </TableHead>
                      <TableHead className="w-[10%] text-white">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="flex justify-center items-center">
                            <span className="text-white dark:text-gray-300 md:text-base text-xs">
                              Loading blocks...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredBlocks ? (
                      filteredBlocks.length > 0 ? (
                        [...filteredBlocks].reverse().map((block, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="text-[#00E5CC] hover:bg-[#001214]/50 md:text-sm text-xs"
                          >
                            <TableCell className="text-center">
                              <span className="text-white">
                                {block.blockHeight}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono">
                              {truncateString(block.hash, 30, 20)}
                            </TableCell>
                            <TableCell className="text-center">
                              {block.nonce}
                            </TableCell>
                            <TableCell className="font-mono">
                              {block.previousHash === ""
                                ? "GENESIS_BLOCK"
                                : truncateString(block.previousHash, 30, 20)}
                            </TableCell>
                            <TableCell>
                              {block.timestamp === "0"
                                ? "0"
                                : format(
                                    new Date(parseInt(block.timestamp)),
                                    "yyyy-MM-dd HH:mm:ss"
                                  )}
                            </TableCell>
                            <TableCell className="text-md">{`${block.transactions.length} transaction(s)`}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openBlockDetails(block, block.blockHeight)
                                }
                                className="bg-black/0 border-white/0 transform text-md hover:scale-105 transition-all hover:bg-gray-800/0 hover:text-white dark:text-white dark:hover:bg-gray-700"
                              >
                                View Details
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <div className="flex justify-center items-center">
                              <span className="text-white dark:text-gray-300">
                                No matching blocks found
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="flex justify-center items-center">
                            <span className="text-white dark:text-gray-300">
                              Loading blocks...
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[625px] dark:bg-gray-800 dark:text-white">
              <DialogHeader>
                <DialogTitle>Block Details</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Detailed information about the selected block
                </DialogDescription>
              </DialogHeader>
              {selectedBlock && (
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-semibold dark:text-gray-300">
                      Height:
                    </span>
                    <span className="col-span-3">{selectedHeight}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-semibold dark:text-gray-300">
                      Hash:
                    </span>
                    <span className="col-span-3 break-words font-mono text-sm">
                      {selectedBlock.hash}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-semibold dark:text-gray-300">
                      Timestamp:
                    </span>
                    <span className="col-span-3">
                      {selectedBlock.timestamp === "0"
                        ? "0"
                        : format(
                            new Date(parseInt(selectedBlock.timestamp)),
                            "yyyy-MM-dd HH:mm:ss"
                          )}
                    </span>
                  </div>
                  {selectedBlock.transactions.map((transaction, index) => (
                    <div key={index}>
                      <span className="font-semibold dark:text-gray-300">
                        Transaction Details {index + 1}:
                      </span>
                      <div key={index} className="items-center gap-4">
                        <div className="flex flex-col mt-3 ml-6">
                          <div className="font-mono text-sm grid grid-cols-12 h-16">
                            <strong className="col-span-2">From:</strong>
                            <span className="break-words col-span-10">
                              {transaction.from}
                            </span>
                          </div>
                          <div className="font-mono text-sm grid grid-cols-12 h-16">
                            <strong className="col-span-2">To:</strong>
                            <span className="break-words col-span-10">
                              {transaction.to}
                            </span>
                          </div>
                          <div className="font-mono text-sm grid grid-cols-12 h-16">
                            <strong className="col-span-2">Signature:</strong>
                            <span className="break-words col-span-10">
                              {transaction.signature}
                            </span>
                          </div>
                          <div className="font-mono text-sm grid grid-cols-12 h-8">
                            <strong className="col-span-2">Amount:</strong>
                            <span className="break-words col-span-10">
                              {transaction.amount} Vote(s)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={() => setIsDialogOpen(false)} className="w-full">
                Close
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

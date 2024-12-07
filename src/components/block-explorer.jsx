"use client";

import { use, useState, useEffect, useMemo } from "react";
import { Search, Moon, Sun, ChevronRight, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export default function Component() {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [currentBlocks, setCurrentBlocks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [latestBlock, setLatestBlock] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("Real-Time Clock");

  useEffect(() => {
    const fetchBlocks = async () => {
      const response = await getAllBlocks();
      setCurrentBlocks(response.blocks);
      setIsLoading(false);
      console.log(response.blocks);
    };

    fetchBlocks();
  }, []);

  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        // Fetch all blocks from the getAllBlocks function
        const response = await getAllBlocks();
        const blocks = response.blocks;

        // Check if we have any blocks to compare
        if (blocks.length > 0) {
          const lastBlock = blocks[blocks.length - 1];

          // Check if this last block is different from the current latestBlock
          if (!latestBlock || lastBlock.timestamp !== latestBlock.timestamp) {
            setLatestBlock(lastBlock);
            setCurrentBlocks(blocks);
          }
        }
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    // Simulate fetching the latest block every 5 seconds
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
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
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

  const truncateString = (input, maxLength, limit) => {
    if (input.length <= limit) return input; // Only truncate if length exceeds limit

    const ellipsis = "...";
    const prefixLength = Math.floor((maxLength - ellipsis.length) / 2); // Length for the start
    const suffixLength = maxLength - ellipsis.length - prefixLength; // Length for the end
    return `${input.slice(0, prefixLength)}${ellipsis}${input.slice(
      -suffixLength
    )}`;
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="container mx-auto space-y-6 transition-colors duration-200 ease-in-out dark:text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            Blockchain Explorer
          </h1> 
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by block height, hash, or transaction ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow dark:bg-gray-800 dark:text-white"
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:text-gray-300"
          >
            <Search className="mr-2 h-4 w-4 dark:text-gray-300" />
            Search
          </Button>
        </form>

        <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center h-12">
              <div className="flex-shrink-0 bg-black bg-opacity-30 h-full flex items-center px-4">
                <span className="font-semibold text-sm">
                  {isLoading == false && latestBlock !== null
                    ? "New Block Mined!"
                    : "Fetching Data"}
                </span>
              </div>
              <div className="flex-grow overflow-hidden">
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
                      <div className="inline-flex items-center h-12 px-4 gap-8 text-sm">
                        <span>Height: {currentBlocks.length - 1}</span>
                        <span>
                          Hash: {truncateString(latestBlock.hash, 30, 20)}
                        </span>
                        <span>Nonce: {latestBlock.nonce}</span>
                        <span>
                          Previous Hash:{" "}
                          {truncateString(latestBlock.previousHash, 30, 20)}
                        </span>
                        <span>
                          Transactions: {latestBlock.transactions.length}
                        </span>
                        <span>
                          Timestamp:{" "}
                          {latestBlock.timestamp === "0"
                            ? "0"
                            : format(
                                new Date(parseInt(latestBlock.timestamp)),
                                "yyyy-MM-dd HH:mm:ss"
                              )}
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center h-12 px-4 gap-8 text-sm">
                        <span>Fetching new blocks every 5 seconds...</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex-shrink-0 bg-black bg-opacity-30 h-full flex items-center px-4">
                <span className="font-semibold text-sm">{currentTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 px-4">
          <CardHeader>
            <CardTitle>Recent Blocks</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Latest blocks added to the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[20rem]">
              <Table>
                <TableHeader>
                  <TableRow className="sticky top-0 z-10">
                    <TableHead className="w-[5%]">Height</TableHead>
                    <TableHead className="w-[25%]">Hash</TableHead>
                    <TableHead className="w-[5%]">Nonce</TableHead>
                    <TableHead className="w-[25%]">Previous Hash</TableHead>
                    <TableHead className="w-[20%]">Timestamp</TableHead>
                    <TableHead className="w-[15%]">Transactions</TableHead>
                    <TableHead className="w-[10%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading == false ? (
                    currentBlocks.toReversed().map((block, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <TableCell className="text-center">
                          {currentBlocks.length - index - 1}
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
                              openBlockDetails(
                                block,
                                currentBlocks.length - index - 1
                              )
                            }
                            className="dark:text-white dark:hover:bg-gray-700"
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
                          <span className="text-gray-500 dark:text-gray-300">
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
              <div className="grid gap-4 py-4">
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
                      Transaction {index + 1}:
                    </span>
                    <div key={index} className="items-center gap-4">
                      <div className="flex flex-col mt-3 ml-6">
                        <div className="font-mono text-sm grid grid-cols-12 h-16">
                          <strong>From:</strong>
                          <span className="break-words col-span-11 pl-4">
                            {transaction.from}
                          </span>
                        </div>
                        <div className="font-mono text-sm grid grid-cols-12 h-16">
                          <strong>To:</strong>
                          <span className="break-words col-span-11 pl-4">
                            {transaction.to}
                          </span>
                        </div>
                        <span className="font-mono text-sm">
                          <strong>Amount:</strong> {transaction.amount} Vote(s)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="mt-4 w-full"
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

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

// Mock data for recent blocks
const recentBlocks = [
  {
    timestamp: "0",
    previousHash: "",
    hash: "1c564c3719dea31372731407f96b80bb0f8218efd77ac1027c44c001280b7095",
    nonce: 0,
    transactions: [
      {
        from: "GENESIS_BLOCK",
        to: "049245c3867215b8f4277c15a9bffee568dc4f5cb2c393f4b1263780aa5a4df0640c036dd69a1c93e5c189a28cbc6781aa6b87dc25be27e5bea0f1bcf25be7efcb",
        amount: 10000000,
      },
    ],
  },
  {
    timestamp: "1731506490874",
    previousHash:
      "1c564c3719dea31372731407f96b80bb0f8218efd77ac1027c44c001280b7095",
    hash: "0cc85cbddd1d5b5c2ddc1a7ad0671e0d242359041ee3bd70b7a35a7d3e3f9031",
    nonce: 0,
    transactions: [
      {
        from: "049245c3867215b8f4277c15a9bffee568dc4f5cb2c393f4b1263780aa5a4df0640c036dd69a1c93e5c189a28cbc6781aa6b87dc25be27e5bea0f1bcf25be7efcb",
        to: "04f4d9c5052fd95916ab569b8bc173600faf8bd8f2afde9b7c982884e0526fde0544b2b6fea3cccd51ac08e4561a0b062892c1e9e15731a7fc11f06d094f028222",
        amount: 1,
        signature:
          "304402202901fbb52f609e51c70cd1bde36a5abaedf092e354856bb27b824eb2ac0c92b3022061b43b78a2e3499e584d0783efdce383091e716911426f101a92b7e1b50f0a7c",
      },
    ],
  },
  {
    timestamp: "1731506970481",
    previousHash:
      "0cc85cbddd1d5b5c2ddc1a7ad0671e0d242359041ee3bd70b7a35a7d3e3f9031",
    hash: "09eddc33e0be4149dccc64b46a1453a6167db2f7ebbd2d00d716811f0c1ef093",
    nonce: 20,
    transactions: [
      {
        from: "049245c3867215b8f4277c15a9bffee568dc4f5cb2c393f4b1263780aa5a4df0640c036dd69a1c93e5c189a28cbc6781aa6b87dc25be27e5bea0f1bcf25be7efcb",
        to: "04b86b037050c62010a7172fc8d920dd95e48fb6e8463bdc6e6e6fc23be11f51f5043073bb3c480f836fcb3d722a36abc6c3a46f203e3dacf07fcf88be7b823a11",
        amount: 1,
        signature:
          "304502201a1f6f023bb9a1837b45c3b512a0ea63358fdbd969ede97140fc6fc4eb12ddc2022100c39677a79298df990275f9377d9e95e16e130fcd3192cd3507d1654fba4b522f",
      },
    ],
  },
  {
    timestamp: "1731507640333",
    previousHash:
      "09eddc33e0be4149dccc64b46a1453a6167db2f7ebbd2d00d716811f0c1ef093",
    hash: "08ca0ef675efea3f1b04cf6b219aa7082017866508918d55ded0cff3c7876d51",
    nonce: 9,
    transactions: [
      {
        from: "049245c3867215b8f4277c15a9bffee568dc4f5cb2c393f4b1263780aa5a4df0640c036dd69a1c93e5c189a28cbc6781aa6b87dc25be27e5bea0f1bcf25be7efcb",
        to: "04270736cd3dc95b23de95cb59c64c5ebf3384a914eabcc18f69e28b4eae0659a4206741d9bc65e423fc01b4036c7ea3753c61270a1dc6c39c137a81847b524dc9",
        amount: 1,
        signature:
          "3046022100d07d6c078ab97dde2ae985fa2dfc1b1dce36a829e5a0083fb1fafee86825763f02210093c76b037db4c03ebd3b0a76d472beb787c6fea0b679b595cc261508a2712c11",
      },
    ],
  },
  {
    timestamp: "1731508160991",
    previousHash:
      "08ca0ef675efea3f1b04cf6b219aa7082017866508918d55ded0cff3c7876d51",
    hash: "0012b4163db01599e82055567c032e0cbf6df25b39f956d4ccd7df0c0cf31cc9",
    nonce: 20,
    transactions: [
      {
        from: "04270736cd3dc95b23de95cb59c64c5ebf3384a914eabcc18f69e28b4eae0659a4206741d9bc65e423fc01b4036c7ea3753c61270a1dc6c39c137a81847b524dc9",
        to: "eriqo-address",
        amount: 1,
        signature:
          "3045022018b925a8cb4074a1edb44bcabeb7f9f98327d8745be05be1c145b71c66ee2e33022100827c54ca36f628f030e4607268a0f8791be91bf0a47d3df20ef9785bfad845fd",
      },
    ],
  },
];

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
      <div className="container mx-auto p-4 space-y-6 transition-colors duration-200 ease-in-out dark:bg-gray-900 dark:text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            Blockchain Explorer
          </h1>
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
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
                <span className="font-semibold">
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
                      <div className="inline-flex items-center h-12 px-4 gap-8">
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
                      <div className="inline-flex items-center h-12 px-4 gap-8">
                        <span>Fetching new blocks every 5 seconds...</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex-shrink-0 bg-black bg-opacity-30 h-full flex items-center px-4">
                <span className="font-semibold">{currentTime}</span>
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

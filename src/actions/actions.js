"use server";

import axios from "axios";

export const getAllBlocks = async () => {
  try {
    const res = await axios.get("https://pollpal.ercloud.xyz/getAllBlocks");
    const blocks = res.data;
    return blocks;
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return error;
  }
};

export const getWalletBalance = async (address) => {
  try {
    const res = await axios.post("https://pollpal.ercloud.xyz/getWalletBalance", {
      publicKey: address
    });
    const balance = res.data;
    return balance;
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return error;
  }
};

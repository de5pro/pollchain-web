"use server";

export const getAllBlocks = async () => {
  const res = await fetch("https://pollpal.ercloud.xyz/getAllBlocks");
  const blocks = await res.json();
  return blocks;
};

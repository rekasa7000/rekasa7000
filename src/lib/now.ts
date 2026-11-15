import { SIMPLE_TIMELINE } from "./career-data";

/**
 * The "this season" strip on the homepage. Edit this file to update it.
 * Items marked `detail` are kept here but left off the page while SIMPLE_TIMELINE is on.
 */
const ITEMS: { label: string; text: string; detail?: boolean }[] = [
  { label: "Leading", text: "A team of eight engineers at Concentrix TPS Philippines." },
  { label: "Starting", text: "A new product initiative for Concentrix TPS Manila." },
  { label: "Building", text: "Akosi.Music NFC cards and a water-footprint tool with UP Diliman.", detail: true },
  { label: "Staying", text: "Hands-on: still in the architecture and the code." },
  { label: "Dreaming of", text: "A small farm, a rocking chair, a cat and a dog." },
];

export const NOW = {
  updated: "November 2026",
  items: (SIMPLE_TIMELINE ? ITEMS.filter((i) => !i.detail) : ITEMS.filter((i) => i.label !== "Staying")).slice(0, 4),
};

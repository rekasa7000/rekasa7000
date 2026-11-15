export const GUEST_KINDS = ["daisy", "sunflower", "tulip", "lavender", "poppy"] as const;
export type GuestKind = (typeof GUEST_KINDS)[number];

export const GUEST_COLORS = ["#e58aa0", "#d9552b", "#fbf7ea", "#9a86d6", "#ffb37a"] as const;

export type GuestFlower = { id: string; name: string; kind: GuestKind; color: string; at: number };

export const NAME_MAX = 16;
/** letters and digits in any script, plus space, dot, apostrophe and hyphen */
export const NAME_PATTERN = /^[\p{L}\p{N} .'-]+$/u;

/**
 * A short list of crude words that are refused as names. It is deliberately small, and
 * leaves out words that sit inside real names (Dick, Hancock, Essex, Nazir, Shital): it
 * catches casual abuse, and the owner's removal tool handles anything it misses.
 */
const BLOCKED = [
  "fuck",
  "bitch",
  "cunt",
  "pussy",
  "asshole",
  "slut",
  "whore",
  "porn",
  "hitler",
  "puta",
  "gago",
  "tangina",
];

/** lower-cases, strips accents and undoes common letter swaps before checking */
export function isBlockedName(name: string) {
  const flat = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/0/g, "o")
    .replace(/1|!/g, "i")
    .replace(/3/g, "e")
    .replace(/4|@/g, "a")
    .replace(/5|\$/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z]/g, "");
  return BLOCKED.some((w) => flat.includes(w));
}

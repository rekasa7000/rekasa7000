export const GUEST_KINDS = ["daisy", "sunflower", "tulip", "lavender", "poppy"] as const;
export type GuestKind = (typeof GUEST_KINDS)[number];

export const GUEST_COLORS = ["#e58aa0", "#d9552b", "#fbf7ea", "#9a86d6", "#ffb37a"] as const;

export type GuestFlower = { id: string; name: string; kind: GuestKind; color: string; at: number };

export const NAME_MAX = 16;
/** letters and digits in any script, plus space, dot, apostrophe and hyphen */
export const NAME_PATTERN = /^[\p{L}\p{N} .'-]+$/u;

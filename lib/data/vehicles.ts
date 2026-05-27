/**
 * Chinese EV brand and model catalogue used by the home page hero search
 * and any other inventory filter UI. Sourced from the CCH operations
 * working sheet (BYD, Geely, Xpeng, Zeekr and friends), grouped by brand.
 */

export const MODELS_BY_BRAND: Record<string, string[]> = {
  Aion: ["LX", "RT", "S Plus", "V Plus", "Y Plus"],
  Arcfox: ["S5", "αS", "αT"],
  BYD: [
    "Atto 3 (Yuan Plus)",
    "Dolphin / Dolphin Surf",
    "Han",
    "Seal",
    "Seal 06 GT",
    "Sealion 7",
    "Song Pro",
    "Tang",
  ],
  "BYD Commercial": ["T3/T5 vans", "eBus", "eTruck"],
  Baojun: ["Huajing S", "KiWi EV", "Yep"],
  "Changan Nevo": ["A05", "AQ series", "Q05 (Laser Smart Edition)"],
  Deepal: ["G318", "L07", "S07", "SL03"],
  "Dongfeng eπ": ["eπ007", "eπ008"],
  Firefly: ["Firefly compact hatchback"],
  "Geely Galaxy": ["E5", "L6", "L7"],
  Geometry: ["Geometry A", "Geometry C", "Geometry E"],
  Haval: ["H6 HEV", "H6 PHEV"],
  Hongqi: ["E-HS9", "EH7"],
  "Huawei HIMA (Aito)": ["Aito M6", "Aito M9", "Luxeed V9", "Shangjie Z7"],
  "IM Motors": ["L7", "LS6", "LS8"],
  Jaecoo: ["Jaecoo 7", "Jaecoo 8"],
  Leapmotor: ["B10", "C10", "C11", "C16", "T03"],
  "Li Auto": ["L6", "L7", "L8", "L9", "Li ONE"],
  "Lynk & Co": ["02 EV", "08 PHEV"],
  MG: ["MG Cyberster", "MG S5 EV", "MG ZS EV", "MG4 EV"],
  Maxus: ["MIFA 7", "MIFA 9"],
  NETA: ["NETA AYA", "NETA S", "NETA U", "NETA V"],
  NIO: ["EC6", "EC7", "ES6 (EL6)", "ES8", "ET5", "ET7"],
  ORA: ["07", "Funky Cat", "Good Cat (03)"],
  Omoda: ["E5", "Omoda 5", "Omoda 7", "Omoda 9"],
  Polestar: ["Polestar 2", "Polestar 3", "Polestar 4", "Polestar 5"],
  "SAIC Maxus": ["MIFA vans", "eDeliver 3", "eDeliver 9"],
  Voyah: ["Dreamer", "Free", "Taishan X8"],
  WEY: ["Coffee 01", "Coffee 02"],
  "WM Motor": ["E5", "EX5", "W6"],
  Wuling: ["Bingo", "Hongguang Mini EV", "Yangguang"],
  XPeng: ["G6", "G9", "P7", "P7+"],
  "Xiaomi EV": ["SU7", "SU7 (new gen)", "YU7", "YU7 GT"],
  Zeekr: ["001", "7GT", "7X", "8X", "9X"],
};

export const BRANDS: string[] = Object.keys(MODELS_BY_BRAND).sort((a, b) =>
  a.localeCompare(b),
);

export const CONDITIONS: { value: string; label: string }[] = [
  { value: "", label: "Any" },
  { value: "new", label: "New cars" },
  { value: "used", label: "Used cars" },
];

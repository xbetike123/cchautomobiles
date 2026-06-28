// Xiaomi YU7 build-and-price catalogue.
// Prices: version `usd` is FOB Nansha; option `rmb` is a CNY uplift converted
// to USD at the live rate the user enters in the configurator.

export type Version = {
  id: string;
  tier: string;
  name: string;
  drive: string;
  range: number;
  hp: number;
  acc: string;
  usd: number;
};

export type Swatch = {
  id: string;
  nm: string;
  sub: string;
  rmb: number;
  hex?: string;
  img: string;
};

export const VERSIONS: Version[] = [
  { id: "ev835", tier: "YU7 EV", name: "XIAOMI YU7 EV 835KM", drive: "Rear-wheel drive", range: 835, hp: 320, acc: "5.88", usd: 39051 },
  { id: "pro770", tier: "YU7 PRO", name: "XIAOMI YU7 PRO EV 770KM", drive: "4WD · dual motor", range: 770, hp: 496, acc: "4.27", usd: 42393 },
  { id: "max760", tier: "YU7 MAX", name: "XIAOMI YU7 MAX EV 760KM", drive: "High-performance 4WD", range: 760, hp: 690, acc: "2.78", usd: 50723 },
];

export const PAINTS: Swatch[] = [
  { id: "green", nm: "Emerald Green", sub: "Green roof", rmb: 0, hex: "#2e7d32", img: "p_green" },
  { id: "orange", nm: "Lava Orange", sub: "Gloss", rmb: 0, hex: "#bf4a2b", img: "p_orange" },
  { id: "silver", nm: "Titanium Silver", sub: "Metallic", rmb: 0, hex: "#b6babf", img: "p_silver" },
  { id: "aqua", nm: "Aqua Mint", sub: "Pearl", rmb: 7000, hex: "#9db8b5", img: "p_aqua" },
  { id: "lilac", nm: "Lilac Frost", sub: "Pearl", rmb: 7000, hex: "#b6a6c2", img: "p_lilac" },
  { id: "burgundy", nm: "Rose Burgundy", sub: "Premium", rmb: 9000, hex: "#7e4a56", img: "p_burgundy" },
  { id: "blue", nm: "Sapphire Blue", sub: "Metallic", rmb: 7000, hex: "#1f50c8", img: "p_blue" },
  { id: "navy", nm: "Midnight Navy", sub: "Black roof", rmb: 7000, hex: "#2b3340", img: "p_navy" },
  { id: "pearl", nm: "Pearl White", sub: "Gloss", rmb: 7000, hex: "#d6d9dc", img: "p_pearl" },
];

export const INTERIORS: Swatch[] = [
  { id: "grey", nm: "Turquoise Grey", sub: "松石灰 · grey/cream", rmb: 0, hex: "#cfc9be", img: "i_grey" },
  { id: "iblue", nm: "Twilight Blue", sub: "暮影蓝 · dark navy", rmb: 0, hex: "#2a3144", img: "i_blue" },
  { id: "purple", nm: "Iris Light Grey", sub: "鸢尾紫 · grey", rmb: 0, hex: "#c9c7c2", img: "i_purple" },
  { id: "iorange", nm: "Coral Orange", sub: "珊瑚橙 · tan", rmb: 3000, hex: "#c8702e", img: "i_orange" },
];

export const WHEELS: Swatch[] = [
  { id: "w19", nm: '19" Aero', sub: "245/55 R19", rmb: 0, img: "w_19" },
  { id: "w20a", nm: '20" Five-spoke', sub: "245/50 R20", rmb: 6000, img: "w_20a" },
  { id: "w20b", nm: '20" Turbine', sub: "245/50 R20", rmb: 6000, img: "w_20b" },
  { id: "w21a", nm: '21" Sport Aero', sub: "245/45 · 275/40 R21", rmb: 12000, img: "w_21a" },
  { id: "w21b", nm: '21" Performance', sub: "245/45 · 275/40 R21", rmb: 16000, img: "w_21b" },
  { id: "w21c", nm: '21" Sport Black', sub: "245/45 · 275/40 R21", rmb: 16000, img: "w_21c" },
];

export const byId = <T extends { id: string }>(arr: T[], id: string): T =>
  arr.find((x) => x.id === id) ?? arr[0];

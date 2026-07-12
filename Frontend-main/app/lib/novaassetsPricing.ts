/** Any Indian state/UT name — the Price Input Module can add new ones beyond the original six. */
export type NovaAssetsPriceState = string;

export type NovaAssetsPriceCategory = "Distributor Price" | "Dealer Price" | "MSP" | "Manual";

type PricePoint = {
  distributor: number;
  dealer: number;
  msp: number;
};

type PriceSheet = Record<NovaAssetsPriceState, PricePoint>;

type ProductLike = {
  model?: string;
  series?: string;
  description?: string;
  productDescription?: string;
  modelDescription?: string;
  hsnSac?: string;
  gstRate?: number;
  dealerPrice?: number;
  distributorPrice?: number;
};

export const NOVAASSETS_PRICE_STATES: NovaAssetsPriceState[] = ["UP", "Bihar", "MP", "Haryana", "Rajasthan", "Punjab"];

/** Every Indian state/UT selectable from the Price Input Module's state dropdown, alphabetical by label. The original six keep their existing keys (UP, MP abbreviated) so old data stays compatible; every other state is keyed by its full name. */
export const INDIA_STATES: { value: NovaAssetsPriceState; label: string }[] = [
  { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "Delhi", label: "Delhi" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Ladakh", label: "Ladakh" },
  { value: "Lakshadweep", label: "Lakshadweep" },
  { value: "MP", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Puducherry", label: "Puducherry" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
];

export const NOVAASSETS_PRICE_CATEGORIES: NovaAssetsPriceCategory[] = [
  "Distributor Price",
  "Dealer Price",
  "MSP",
  "Manual",
];

function pricePoint(distributor: number, dealer: number, msp: number): PricePoint {
  return { distributor, dealer, msp };
}

function priceSheet(
  up: PricePoint,
  bihar: PricePoint,
  mp: PricePoint,
  haryana: PricePoint,
  rajasthan: PricePoint,
  punjab: PricePoint
): PriceSheet {
  return { UP: up, Bihar: bihar, MP: mp, Haryana: haryana, Rajasthan: rajasthan, Punjab: punjab };
}

export const NOVAASSETS_PRICE_TABLE: Record<string, PriceSheet> = {
  "AW-SP-3600": priceSheet(
    pricePoint(34200, 37620, 45144),
    pricePoint(34200, 37620, 45144),
    pricePoint(34800, 38280, 45936),
    pricePoint(34500, 37950, 45540),
    pricePoint(34500, 37950, 45540),
    pricePoint(34500, 37950, 45540)
  ),
  "AW-SP-3000": priceSheet(
    pricePoint(48580, 53438, 66798),
    pricePoint(48580, 53438, 66798),
    pricePoint(48580, 53438, 66798),
    pricePoint(48900, 53790, 67238),
    pricePoint(48900, 53790, 67238),
    pricePoint(48900, 53790, 67238)
  ),
  "AW-SP-4000": priceSheet(
    pricePoint(51040, 56144, 70180),
    pricePoint(51040, 56144, 70180),
    pricePoint(51040, 56144, 70180),
    pricePoint(53040, 58344, 72930),
    pricePoint(53040, 58344, 72930),
    pricePoint(53040, 58344, 72930)
  ),
  "AW-SP-5000": priceSheet(
    pricePoint(57890, 63679, 79599),
    pricePoint(57890, 63679, 79599),
    pricePoint(57890, 63679, 79599),
    pricePoint(58900, 64790, 80988),
    pricePoint(58900, 64790, 80988),
    pricePoint(58900, 64790, 80988)
  ),
  "AW-SP-6000": priceSheet(
    pricePoint(61400, 68768, 89398),
    pricePoint(61400, 68768, 89398),
    pricePoint(61400, 68768, 89398),
    pricePoint(61400, 68768, 89398),
    pricePoint(61400, 68768, 89398),
    pricePoint(61400, 68768, 89398)
  ),
  "AW-SP-8000": priceSheet(
    pricePoint(76500, 84150, 105188),
    pricePoint(76500, 84150, 105188),
    pricePoint(76500, 84150, 105188),
    pricePoint(76500, 84150, 105188),
    pricePoint(76500, 84150, 105188),
    pricePoint(76500, 84150, 105188)
  ),
  "AW-SP-10000": priceSheet(
    pricePoint(84200, 92620, 115775),
    pricePoint(84200, 92620, 115775),
    pricePoint(84200, 92620, 115775),
    pricePoint(87200, 95920, 119900),
    pricePoint(87200, 95920, 119900),
    pricePoint(87200, 95920, 119900)
  ),
  "AW-SP-11000": priceSheet(
    pricePoint(94800, 106176, 138029),
    pricePoint(94800, 106176, 138029),
    pricePoint(94800, 106176, 138029),
    pricePoint(95200, 106624, 138611),
    pricePoint(95200, 106624, 138611),
    pricePoint(95200, 106624, 138611)
  ),
  "AW-TP-8000-L": priceSheet(
    pricePoint(137800, 150202, 177238),
    pricePoint(137800, 150202, 177238),
    pricePoint(137800, 150202, 177238),
    pricePoint(137800, 150202, 177238),
    pricePoint(137800, 150202, 177238),
    pricePoint(137800, 150202, 177238)
  ),
  "AW-TP-10000-L": priceSheet(
    pricePoint(146440, 159620, 188351),
    pricePoint(146440, 159620, 188351),
    pricePoint(146440, 159620, 188351),
    pricePoint(146440, 159619.6, 188351),
    pricePoint(146440, 159619.6, 188351),
    pricePoint(146440, 159619.6, 188351)
  ),
  "AW-TP-12000-L": priceSheet(
    pricePoint(156880, 170999, 201779),
    pricePoint(156880, 170999, 201779),
    pricePoint(156880, 170999, 201779),
    pricePoint(156880, 170999.2, 201779),
    pricePoint(156880, 170999.2, 201779),
    pricePoint(156880, 170999.2, 201779)
  ),
  "AW-TP-15000-H": priceSheet(
    pricePoint(181000, 197290, 232802),
    pricePoint(181000, 197290, 232802),
    pricePoint(181000, 197290, 232802),
    pricePoint(181000, 197290, 232802),
    pricePoint(181000, 197290, 232802),
    pricePoint(181000, 197290, 232802)
  ),
  "AW-TP-20000-H": priceSheet(
    pricePoint(223000, 243070, 286823),
    pricePoint(223000, 243070, 286823),
    pricePoint(223000, 243070, 286823),
    pricePoint(201000, 219090, 258526),
    pricePoint(201000, 219090, 258526),
    pricePoint(201000, 219090, 258526)
  ),
  "AW-TP-50000-H": priceSheet(
    pricePoint(465820, 493769, 567835),
    pricePoint(465820, 493769, 567835),
    pricePoint(465820, 493769, 567835),
    pricePoint(465820, 493769.2, 567835),
    pricePoint(465820, 493769.2, 567835),
    pricePoint(465820, 493769.2, 567835)
  ),
  "AW-LFP-51.2": priceSheet(
    pricePoint(88300, 96247, 115496),
    pricePoint(88300, 96247, 115496),
    pricePoint(88300, 96247, 115496),
    pricePoint(88300, 96247, 115496),
    pricePoint(88300, 96247, 115496),
    pricePoint(88300, 96247, 115496)
  ),
  "AW-LFP-25.6": priceSheet(
    pricePoint(32900, 35861, 43033),
    pricePoint(32900, 35861, 43033),
    pricePoint(32900, 35861, 43033),
    pricePoint(32900, 35861, 43033),
    pricePoint(32900, 35861, 43033),
    pricePoint(32900, 35861, 43033)
  ),
};

function normalizeSource(value: string) {
  return value.toUpperCase().replace(/\s+/g, " ").replace(/\s*-\s*/g, "-").replace(/\s*\/\s*/g, "/");
}

export function normalizeNovaAssetsPriceState(value: string): NovaAssetsPriceState | "" {
  const source = normalizeSource(value.trim());
  if (!source) return "";
  if (source === "UP" || source.includes("UTTAR PRADESH") || source.includes("UTTARPRADESH")) return "UP";
  if (source === "MP" || source.includes("MADHYA PRADESH") || source.includes("MADHYAPRADESH")) return "MP";
  if (source.includes("BIHAR")) return "Bihar";
  if (source.includes("HARYANA")) return "Haryana";
  if (source.includes("RAJASTHAN")) return "Rajasthan";
  if (source.includes("PUNJAB")) return "Punjab";

  const match = INDIA_STATES.find((state) => {
    const label = normalizeSource(state.label);
    return source === label || source.includes(label) || label.includes(source);
  });
  return match?.value ?? "";
}

function inferNovaAssetsPriceModelKey(product: ProductLike | undefined): string | "" {
  if (!product) return "";
  const source = normalizeSource([
    product.model,
    product.series,
    product.description,
    product.productDescription,
    product.modelDescription,
  ].filter(Boolean).join(" "));

  if (!source) return "";

  // IP66 variants of the 8/10/12KW SP series are a distinct (currently unpriced) product line from
  // the IP21 ones below — checked first so they don't fall through to the IP21 8000/10000 keys.
  if (source.includes("IP66") || source.includes("IP 66")) {
    if (source.includes("AW-SP-12000") || source.includes("12000")) return "AW-SP-12000-IP66";
    if (source.includes("AW-SP-10000") || source.includes("10000")) return "AW-SP-10000-IP66";
    if (source.includes("AW-SP-8000") || source.includes("8000")) return "AW-SP-8000-IP66";
  }

  if (source.includes("AW-SP-3600") || source.includes("3.6KW") || source.includes("3.6 KW")) return "AW-SP-3600";
  if (source.includes("AW-SP-3000") || source.includes("3KW") || source.includes("3000")) return "AW-SP-3000";
  if (source.includes("AW-SP-4000") || source.includes("4KW") || source.includes("4000")) return "AW-SP-4000";
  if (source.includes("AW-SP-5000") || source.includes("5KW") || source.includes("5000")) return "AW-SP-5000";
  if (source.includes("AW-SP-6000") || source.includes("6KW") || source.includes("6000")) return "AW-SP-6000";
  if (source.includes("AW-SP-8000") || source.includes("8KW") || source.includes("8000")) return "AW-SP-8000";
  if (source.includes("AW-SP-11000") || source.includes("11KW") || source.includes("11000")) return "AW-SP-11000";
  if (source.includes("AW-SP-10000") || source.includes("10KW") || source.includes("10000")) return "AW-SP-10000";

  if (source.includes("AW-TP-50000-H") || source.includes("50000-H") || source.includes("50000")) return "AW-TP-50000-H";
  if (source.includes("AW-TP-20000-H") || source.includes("20000-H") || source.includes("20000")) return "AW-TP-20000-H";
  if (source.includes("AW-TP-15000-H") || source.includes("15000-H") || source.includes("15000")) return "AW-TP-15000-H";
  if (source.includes("AW-TP-12000-L") || source.includes("12000-L") || source.includes("12000")) return "AW-TP-12000-L";
  if (source.includes("AW-TP-10000-L") || source.includes("10000-L") || source.includes("10000 L")) return "AW-TP-10000-L";
  if (source.includes("AW-TP-8000-L") || source.includes("8000-L") || source.includes("8000 L")) return "AW-TP-8000-L";

  if (source.includes("AW-LFP-25.6") || source.includes("25.6V/100AH") || source.includes("25.6V 100AH")) return "AW-LFP-25.6";
  // The 51.2V LFP family has four distinct-priced variants (10yr/1c, 5yr/1c, 5yr/0.5c "i", and "L") that all
  // share the same "51.2V/100AH" description text — the model suffix (normalized to "-10"/"-5"/"-I"/"-L") is
  // the only thing that tells them apart, so it's checked before falling back to the generic bucket.
  if (source.includes("AW-LFP-51.2-10") || source.includes("51.2V/100AH-10")) return "AW-LFP-51.2-10";
  if (source.includes("AW-LFP-51.2-5") || source.includes("51.2V/100AH-5")) return "AW-LFP-51.2-5";
  if (source.includes("AW-LFP-51.2-I") || source.includes("51.2V/100AH-I")) return "AW-LFP-51.2-i";
  if (source.includes("AW-LFP-51.2-L") || source.includes("51.2V/100AH-L")) return "AW-LFP-51.2-L";
  if (source.includes("AW-LFP-51.2") || source.includes("51.2V/100AH") || source.includes("51.2V 100AH")) return "AW-LFP-51.2";

  return "";
}

export function resolveNovaAssetsPiPrice(
  product: ProductLike | undefined,
  priceCategory: NovaAssetsPriceCategory | string,
  stateRegion: string,
  priceTable: Record<string, PriceSheet> = NOVAASSETS_PRICE_TABLE
): number | undefined {
  if (priceCategory === "Manual") return undefined;
  const modelKey = inferNovaAssetsPriceModelKey(product);
  const priceSheet = modelKey ? priceTable[modelKey] : undefined;
  if (!priceSheet) return undefined;

  const state = normalizeNovaAssetsPriceState(stateRegion) || "UP";
  const row = priceSheet[state];
  if (!row) return undefined;

  if (priceCategory === "Dealer Price") return row.dealer;
  if (priceCategory === "MSP") return row.msp;
  return row.distributor;
}

export function resolveNovaAssetsPiDefaults(
  product: ProductLike | undefined,
  priceCategory: NovaAssetsPriceCategory | string,
  stateRegion: string,
  priceTable: Record<string, PriceSheet> = NOVAASSETS_PRICE_TABLE
) {
  const resolvedRate = resolveNovaAssetsPiPrice(product, priceCategory, stateRegion, priceTable);
  const fallbackRate = priceCategory === "Dealer Price" ? 120 : 100;
  const rate = priceCategory === "Manual" ? "" : String(resolvedRate ?? fallbackRate);

  return {
    hsnSac: product?.hsnSac ?? "8504",
    gstRate: String(product?.gstRate ?? (normalizeSource(`${product?.model ?? ""} ${product?.series ?? ""}`).includes("BATTERY") ? 18 : 5)),
    rate,
  };
}

type PriceEntryLike = {
  modelKey: string;
  prices: Record<NovaAssetsPriceState, PricePoint>;
};

/** Converts admin-managed Price Input Module entries into the lookup shape used by the resolvers above. */
export function buildPriceTableFromEntries(entries: PriceEntryLike[] | undefined | null): Record<string, PriceSheet> {
  const table: Record<string, PriceSheet> = {};
  for (const entry of entries ?? []) {
    if (!entry.modelKey) continue;
    table[entry.modelKey] = entry.prices;
  }
  return table;
}

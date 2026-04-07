const symbolMap = [
  { symbol: "^NSEI", name: "Nifty 50" },
  { symbol: "^BSESN", name: "Sensex" },
  { symbol: "^NSEBANK", name: "Bank Nifty" },
];

const rangeConfig = {
  "5d": { range: "5d", interval: "15m", label: "5 days" },
  "1mo": { range: "1mo", interval: "1d", label: "1 month" },
  "6mo": { range: "6mo", interval: "1d", label: "6 months" },
  "1y": { range: "1y", interval: "1wk", label: "1 year" },
};

const fallbackIndices = [
  { symbol: "^NSEI", name: "Nifty 50", price: 24218.4, changePercent: 0.84, rangeLabel: "Fallback data", updatedAt: "offline mode", series: [23100, 23240, 23310, 23280, 23460, 23600, 23720, 23810, 23950, 24218] },
  { symbol: "^BSESN", name: "Sensex", price: 79944.18, changePercent: -0.18, rangeLabel: "Fallback data", updatedAt: "offline mode", series: [79020, 79150, 79210, 79380, 79520, 79680, 79740, 79820, 80020, 79944] },
  { symbol: "^NSEBANK", name: "Bank Nifty", price: 51102.85, changePercent: 0.82, rangeLabel: "Fallback data", updatedAt: "offline mode", series: [50120, 50250, 50320, 50480, 50520, 50710, 50860, 50990, 51060, 51102] },
];

const sectorMap = {
  banking: { key: "banking", name: "Banking", symbol: "^NSEBANK", description: "The banking sector reflects credit growth, deposit strength, asset quality, and interest-rate sensitivity across leading lenders.", stocks: [{ symbol: "HDFCBANK.NS", weight: 29.0 }, { symbol: "ICICIBANK.NS", weight: 24.0 }, { symbol: "AXISBANK.NS", weight: 10.0 }, { symbol: "SBIN.NS", weight: 9.0 }, { symbol: "KOTAKBANK.NS", weight: 8.0 }, { symbol: "BANKBARODA.NS", weight: 4.0 }, { symbol: "INDUSINDBK.NS", weight: 4.0 }, { symbol: "PNB.NS", weight: 3.0 }, { symbol: "FEDERALBNK.NS", weight: 2.0 }, { symbol: "AUBANK.NS", weight: 2.0 }] },
  it: { key: "it", name: "Information Technology", symbol: "^CNXIT", description: "The IT sector tracks large technology and digital-services businesses, often influenced by global spending cycles and currency moves.", stocks: [{ symbol: "TCS.NS", weight: 28.0 }, { symbol: "INFY.NS", weight: 24.0 }, { symbol: "HCLTECH.NS", weight: 11.0 }, { symbol: "WIPRO.NS", weight: 9.0 }, { symbol: "TECHM.NS", weight: 8.0 }, { symbol: "LTIM.NS", weight: 7.0 }, { symbol: "PERSISTENT.NS", weight: 4.0 }, { symbol: "MPHASIS.NS", weight: 3.0 }, { symbol: "COFORGE.NS", weight: 3.0 }, { symbol: "OFSS.NS", weight: 1.0 }] },
  pharma: { key: "pharma", name: "Pharma", symbol: "^CNXPHARMA", description: "The pharma sector reflects medicine makers, diagnostics, research pipelines, export demand, and regulatory execution.", stocks: [{ symbol: "SUNPHARMA.NS", weight: 26.0 }, { symbol: "DIVISLAB.NS", weight: 13.0 }, { symbol: "CIPLA.NS", weight: 12.0 }, { symbol: "DRREDDY.NS", weight: 11.0 }, { symbol: "LUPIN.NS", weight: 8.0 }, { symbol: "TORNTPHARM.NS", weight: 7.0 }, { symbol: "ZYDUSLIFE.NS", weight: 6.0 }, { symbol: "ALKEM.NS", weight: 5.0 }, { symbol: "BIOCON.NS", weight: 4.0 }, { symbol: "ABBOTINDIA.NS", weight: 3.0 }] },
  fmcg: { key: "fmcg", name: "FMCG", symbol: "^CNXFMCG", description: "The FMCG sector covers essential consumer businesses, pricing power, rural demand trends, and margin resilience.", stocks: [{ symbol: "HINDUNILVR.NS", weight: 30.0 }, { symbol: "ITC.NS", weight: 18.0 }, { symbol: "NESTLEIND.NS", weight: 14.0 }, { symbol: "VBL.NS", weight: 8.0 }, { symbol: "TATACONSUM.NS", weight: 7.0 }, { symbol: "BRITANNIA.NS", weight: 6.0 }, { symbol: "DABUR.NS", weight: 5.0 }, { symbol: "GODREJCP.NS", weight: 4.0 }, { symbol: "COLPAL.NS", weight: 4.0 }, { symbol: "MARICO.NS", weight: 4.0 }] },
  energy: { key: "energy", name: "Energy", symbol: "^CNXENERGY", description: "The energy sector reflects oil, gas, refining, integrated energy businesses, and infrastructure-linked demand.", stocks: [{ symbol: "RELIANCE.NS", weight: 38.0 }, { symbol: "ONGC.NS", weight: 11.0 }, { symbol: "IOC.NS", weight: 10.0 }, { symbol: "BPCL.NS", weight: 8.0 }, { symbol: "GAIL.NS", weight: 7.0 }, { symbol: "HINDPETRO.NS", weight: 6.0 }, { symbol: "ADANIPOWER.NS", weight: 6.0 }, { symbol: "POWERGRID.NS", weight: 5.0 }, { symbol: "NTPC.NS", weight: 5.0 }, { symbol: "OIL.NS", weight: 4.0 }] },
};

const indianSymbolOverrides = {
  SAIL: "SAIL.NS",
  HDFC: "HDFCBANK.NS",
  RELIANCE: "RELIANCE.NS",
  INFOSYS: "INFY.NS",
  TCS: "TCS.NS",
  SBI: "SBIN.NS",
  ICICI: "ICICIBANK.NS",
};

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function decodeXml(value) {
  return value.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

function extractTag(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeXml(match[1].trim()) : "";
}

function parseRssItems(xmlText) {
  const matches = xmlText.match(/<item>([\s\S]*?)<\/item>/gi) || [];
  return matches.map((itemBlock) => ({
    title: extractTag(itemBlock, "title"),
    link: extractTag(itemBlock, "link"),
    publishedAt: extractTag(itemBlock, "pubDate"),
    source: extractTag(itemBlock, "source") || "News feed",
    summary: extractTag(itemBlock, "description").replace(/<[^>]+>/g, "").trim(),
  }));
}

function isIndianQuote(item) {
  const exchange = `${item.exchangeDisp || item.exchange || item.fullExchangeName || ""}`.toUpperCase();
  const symbol = `${item.symbol || ""}`.toUpperCase();
  return symbol.endsWith(".NS") || symbol.endsWith(".BO") || exchange.includes("NSE") || exchange.includes("BSE") || exchange.includes("NATIONAL STOCK EXCHANGE OF INDIA") || exchange.includes("BOMBAY STOCK EXCHANGE");
}

function searchScore(item, query) {
  const q = query.toUpperCase().trim();
  const symbol = `${item.symbol || ""}`.toUpperCase();
  const name = `${item.shortname || item.longname || item.name || ""}`.toUpperCase();
  let score = 0;
  if (isIndianQuote(item)) score += 100;
  if (symbol === `${q}.NS` || symbol === `${q}.BO`) score += 90;
  if (symbol === q) score += 80;
  if (symbol.startsWith(`${q}.`)) score += 70;
  if (symbol.startsWith(q)) score += 60;
  if (name.startsWith(q)) score += 40;
  if (name.includes(q)) score += 20;
  if (item.quoteType === "EQUITY") score += 15;
  return score;
}

async function fetchYahooIndex(symbol, config) {
  const endpoint = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
  endpoint.searchParams.set("range", config.range);
  endpoint.searchParams.set("interval", config.interval);
  endpoint.searchParams.set("includePrePost", "false");
  endpoint.searchParams.set("events", "div,splits");
  const response = await fetch(endpoint, { headers: { "User-Agent": "IntelligentInvestor/1.0", Accept: "application/json" } });
  if (!response.ok) throw new Error(`Yahoo request failed for ${symbol}`);
  const payload = await response.json();
  const result = payload?.chart?.result?.[0];
  const meta = result?.meta;
  const closes = result?.indicators?.quote?.[0]?.close || [];
  if (!meta || !closes.length) throw new Error(`Invalid Yahoo payload for ${symbol}`);
  const cleanSeries = closes.filter((value) => Number.isFinite(value));
  const previous = meta.chartPreviousClose || meta.previousClose || cleanSeries[0];
  const price = meta.regularMarketPrice || cleanSeries[cleanSeries.length - 1];
  const changePercent = ((price - previous) / previous) * 100;
  return { symbol, name: symbolMap.find((item) => item.symbol === symbol)?.name || symbol, price, changePercent, rangeLabel: config.label, updatedAt: new Date().toLocaleString("en-IN"), series: cleanSeries };
}

function averageLast(values, count) {
  const clean = values.filter((value) => Number.isFinite(value));
  const slice = clean.slice(-count);
  if (!slice.length) return null;
  return slice.reduce((sum, value) => sum + value, 0) / slice.length;
}

async function fetchYahooChartSnapshot(symbol) {
  const data = await fetchYahooIndex(symbol, rangeConfig["1y"]);
  return {
    price: data.price,
    changePercent: data.changePercent,
    rangeLabel: data.rangeLabel,
    updatedAt: data.updatedAt,
    series: data.series,
    fiftyTwoWeekLow: data.series.length ? Math.min(...data.series) : null,
    fiftyTwoWeekHigh: data.series.length ? Math.max(...data.series) : null,
    fiftyDayAverage: averageLast(data.series, 50),
    twoHundredDayAverage: averageLast(data.series, 200),
  };
}

async function fetchYahooQuoteBatch(symbols) {
  const endpoint = new URL("https://query1.finance.yahoo.com/v7/finance/quote");
  endpoint.searchParams.set("symbols", symbols.join(","));
  const response = await fetch(endpoint, { headers: { "User-Agent": "IntelligentInvestor/1.0", Accept: "application/json" } });
  if (!response.ok) throw new Error("Yahoo quote batch failed");
  const payload = await response.json();
  return payload?.quoteResponse?.result || [];
}

async function fetchYahooSearch(query) {
  const endpoint = new URL("https://query1.finance.yahoo.com/v1/finance/search");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("quotesCount", "10");
  endpoint.searchParams.set("newsCount", "0");
  const response = await fetch(endpoint, { headers: { "User-Agent": "IntelligentInvestor/1.0", Accept: "application/json" } });
  if (!response.ok) throw new Error("Yahoo search failed");
  return response.json();
}

async function fetchYahooQuoteSummary(symbol) {
  const endpoint = new URL(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}`);
  endpoint.searchParams.set("modules", "price,summaryDetail,assetProfile,defaultKeyStatistics,financialData");
  const response = await fetch(endpoint, { headers: { "User-Agent": "IntelligentInvestor/1.0", Accept: "application/json" } });
  if (!response.ok) throw new Error("Yahoo quote summary failed");
  const payload = await response.json();
  return payload?.quoteSummary?.result?.[0] || null;
}

async function resolveIndianSymbol(queryOrSymbol) {
  const raw = (queryOrSymbol || "").trim().toUpperCase();
  if (!raw) return null;
  if (indianSymbolOverrides[raw]) return indianSymbolOverrides[raw];
  if (raw.endsWith(".NS") || raw.endsWith(".BO")) return raw;
  const sectorMatch = Object.values(sectorMap).flatMap((sector) => sector.stocks.map((stock) => stock.symbol)).find((symbol) => symbol.toUpperCase() === `${raw}.NS` || symbol.toUpperCase().startsWith(`${raw}.NS`));
  if (sectorMatch) return sectorMatch;
  try {
    const directQuotes = await fetchYahooQuoteBatch([`${raw}.NS`, `${raw}.BO`, raw]);
    const directIndian = directQuotes.find((item) => isIndianQuote(item));
    if (directIndian?.symbol) return directIndian.symbol;
  } catch {}
  try {
    const payload = await fetchYahooSearch(raw);
    const bestIndian = (payload?.quotes || []).filter((item) => item.symbol).sort((a, b) => searchScore(b, raw) - searchScore(a, raw))[0];
    if (bestIndian?.symbol) return bestIndian.symbol;
  } catch {}
  return `${raw}.NS`;
}

module.exports = {
  symbolMap,
  rangeConfig,
  fallbackIndices,
  sectorMap,
  sendJson,
  parseRssItems,
  fetchYahooIndex,
  fetchYahooQuoteBatch,
  fetchYahooSearch,
  fetchYahooQuoteSummary,
  fetchYahooChartSnapshot,
  resolveIndianSymbol,
  isIndianQuote,
  searchScore,
};

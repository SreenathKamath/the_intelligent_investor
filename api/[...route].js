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

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
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

async function handleMarketIndices(url) {
  const range = new URL(url).searchParams.get("range") || "1mo";
  const config = rangeConfig[range] || rangeConfig["1mo"];
  try {
    const indices = await Promise.all(symbolMap.map((item) => fetchYahooIndex(item.symbol, config)));
    return json(200, { indices });
  } catch {
    return json(200, { indices: fallbackIndices.map((item) => ({ ...item, rangeLabel: config.label })), warning: "Live market fetch failed, fallback data returned." });
  }
}

async function handleMarketNews() {
  const feeds = [
    "https://news.google.com/rss/search?q=Indian%20stock%20market&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=global%20financial%20markets&hl=en-US&gl=US&ceid=US:en",
  ];
  try {
    const responses = await Promise.all(feeds.map((url) => fetch(url, { headers: { "User-Agent": "IntelligentInvestor/1.0", Accept: "application/rss+xml, application/xml, text/xml" } }).then((result) => result.text())));
    return json(200, { items: responses.flatMap((xmlText) => parseRssItems(xmlText)).slice(0, 8) });
  } catch {
    return json(200, { items: [{ source: "Offline fallback", title: "Live news feed unavailable", summary: "The app is configured for free RSS-based market headlines, but the network request failed.", publishedAt: new Date().toLocaleString("en-IN"), link: "" }], warning: "Live news fetch failed." });
  }
}

async function handleScreenerSectors() {
  const config = rangeConfig["1mo"];
  const sectors = Object.values(sectorMap);
  try {
    const liveSectors = await Promise.all(sectors.map(async (sector) => {
      const live = await fetchYahooIndex(sector.symbol, config);
      return { key: sector.key, name: sector.name, symbol: sector.symbol, description: sector.description, price: live.price, changePercent: live.changePercent };
    }));
    return json(200, { sectors: liveSectors });
  } catch {
    return json(200, { sectors: sectors.map((sector, index) => ({ key: sector.key, name: sector.name, symbol: sector.symbol, description: sector.description, price: 10000 + index * 1500, changePercent: index % 2 === 0 ? 0.8 : -0.3 })), warning: "Fallback sector list returned." });
  }
}

async function handleScreenerSector(url) {
  const key = new URL(url).searchParams.get("key") || "banking";
  const sector = sectorMap[key] || sectorMap.banking;
  try {
    const [sectorIndex, stockQuotes] = await Promise.all([fetchYahooIndex(sector.symbol, rangeConfig["1mo"]), fetchYahooQuoteBatch(sector.stocks.map((item) => item.symbol))]);
    const quoteMap = new Map(stockQuotes.map((quote) => [quote.symbol, quote]));
    const stocks = sector.stocks.map((stock) => {
      const quote = quoteMap.get(stock.symbol) || {};
      return { symbol: stock.symbol, shortName: quote.shortName || stock.symbol, weight: stock.weight, price: quote.regularMarketPrice || 0, changePercent: quote.regularMarketChangePercent || 0, trailingPE: quote.trailingPE ?? null, fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? null, fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? null };
    });
    return json(200, { sector: { ...sectorIndex, key: sector.key, description: sector.description }, stocks });
  } catch {
    return json(200, { sector: { key: sector.key, name: sector.name, symbol: sector.symbol, description: sector.description, price: 10000, changePercent: 0, rangeLabel: "Fallback data", updatedAt: "offline mode", series: [100, 105, 103, 110, 108, 112, 116, 115, 118, 121] }, stocks: sector.stocks.map((stock, index) => ({ symbol: stock.symbol, shortName: stock.symbol, weight: stock.weight, price: 100 + index * 50, changePercent: index % 2 === 0 ? 1.2 : -0.6, trailingPE: 20 + index, fiftyTwoWeekLow: 80 + index * 20, fiftyTwoWeekHigh: 140 + index * 20 })), warning: "Fallback screener sector data returned." });
  }
}

async function handleScreenerSearch(url) {
  const query = new URL(url).searchParams.get("q") || "";
  if (!query) return json(400, { error: "Missing query" });
  try {
    const payload = await fetchYahooSearch(query);
    const matches = (payload?.quotes || []).filter((item) => item.symbol && item.quoteType === "EQUITY" && isIndianQuote(item)).sort((a, b) => searchScore(b, query) - searchScore(a, query)).slice(0, 5).map((item) => ({ symbol: item.symbol, shortName: item.shortname || item.longname || item.symbol, exchange: item.exchangeDisp || item.exchange || "" }));
    const resolvedSymbol = await resolveIndianSymbol(query);
    const bestMatch = matches.find((item) => item.symbol.toUpperCase() === resolvedSymbol?.toUpperCase()) || (resolvedSymbol ? { symbol: resolvedSymbol, shortName: resolvedSymbol, exchange: "India" } : null) || matches[0] || null;
    return json(200, { bestMatch, matches });
  } catch {
    const resolvedSymbol = await resolveIndianSymbol(query);
    return json(200, { bestMatch: resolvedSymbol ? { symbol: resolvedSymbol, shortName: resolvedSymbol, exchange: "India" } : null, matches: resolvedSymbol ? [{ symbol: resolvedSymbol, shortName: resolvedSymbol, exchange: "India" }] : [], warning: "Search fetch failed." });
  }
}

async function handleScreenerStock(url) {
  const requestedSymbol = new URL(url).searchParams.get("symbol");
  if (!requestedSymbol) return json(400, { error: "Missing symbol" });
  const symbol = await resolveIndianSymbol(requestedSymbol);
  try {
    const [summaryResult, quoteResult, chartResult] = await Promise.allSettled([fetchYahooQuoteSummary(symbol), fetchYahooQuoteBatch([symbol]), fetchYahooChartSnapshot(symbol)]);
    const summary = summaryResult.status === "fulfilled" ? summaryResult.value : null;
    const quotes = quoteResult.status === "fulfilled" ? quoteResult.value : [];
    const quote = quotes[0] || {};
    const chart = chartResult.status === "fulfilled" ? chartResult.value : null;
    if (!summary && !quote.symbol && !chart) throw new Error("No live stock detail payload available");
    return json(200, {
      detail: {
        symbol,
        shortName: quote.shortName || quote.longName || summary?.price?.shortName || symbol,
        businessSummary: summary?.assetProfile?.longBusinessSummary || "Detailed business profile is not available from the current source right now, but live price and technical metrics are shown when available.",
        sector: summary?.assetProfile?.sector || "n/a",
        industry: summary?.assetProfile?.industry || "n/a",
        marketCap: quote.marketCap ? new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 2 }).format(quote.marketCap) : "n/a",
        currentPrice: quote.regularMarketPrice ?? chart?.price ?? "n/a",
        trailingPE: quote.trailingPE ?? "n/a",
        dividendYield: quote.trailingAnnualDividendYield ?? "n/a",
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? chart?.fiftyTwoWeekLow ?? "n/a",
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? chart?.fiftyTwoWeekHigh ?? "n/a",
        fiftyDayAverage: quote.fiftyDayAverage ?? chart?.fiftyDayAverage ?? "n/a",
        twoHundredDayAverage: quote.twoHundredDayAverage ?? chart?.twoHundredDayAverage ?? "n/a",
      },
      warning: !summary ? (chart ? "Chart-based live metrics loaded, but business profile is limited right now." : "Live quote loaded, but business profile is limited right now.") : undefined,
    });
  } catch {
    return json(200, { detail: { symbol, shortName: symbol, businessSummary: "Live stock details could not be loaded right now.", sector: "n/a", industry: "n/a", marketCap: "n/a", currentPrice: "n/a", trailingPE: "n/a", dividendYield: "n/a", fiftyTwoWeekLow: "n/a", fiftyTwoWeekHigh: "n/a", fiftyDayAverage: "n/a", twoHundredDayAverage: "n/a" }, warning: "Fallback stock detail returned." });
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const route = (url.pathname.split("/api/")[1] || "").replace(/^\//, "");
    if (route === "market/indices") return handleMarketIndices(url);
    if (route === "market/news") return handleMarketNews();
    if (route === "screener/sectors") return handleScreenerSectors();
    if (route === "screener/sector") return handleScreenerSector(url);
    if (route === "screener/search") return handleScreenerSearch(url);
    if (route === "screener/stock") return handleScreenerStock(url);
    return json(404, { error: "Not found" });
  },
};

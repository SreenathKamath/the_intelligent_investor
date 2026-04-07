const { fetchYahooQuoteBatch, fetchYahooSearch, fetchYahooQuoteSummary, fetchYahooChartSnapshot, isIndianQuote, searchScore } = require("./data");

const sectorCatalog = {
  banking: {
    key: "banking",
    name: "Banking",
    symbol: "^NSEBANK",
    description: "The banking sector reflects credit growth, deposit strength, asset quality, and interest-rate sensitivity across leading lenders.",
    constituentUrl: "https://www.niftyindices.com/IndexConstituent/ind_niftybanklist.csv",
    fallbackStocks: [{ symbol: "HDFCBANK.NS", weight: 29.0 }, { symbol: "ICICIBANK.NS", weight: 24.0 }, { symbol: "AXISBANK.NS", weight: 10.0 }, { symbol: "SBIN.NS", weight: 9.0 }, { symbol: "KOTAKBANK.NS", weight: 8.0 }, { symbol: "BANKBARODA.NS", weight: 4.0 }, { symbol: "INDUSINDBK.NS", weight: 4.0 }, { symbol: "PNB.NS", weight: 3.0 }, { symbol: "FEDERALBNK.NS", weight: 2.0 }, { symbol: "AUBANK.NS", weight: 2.0 }],
  },
  it: {
    key: "it",
    name: "Information Technology",
    symbol: "^CNXIT",
    description: "The IT sector tracks large technology and digital-services businesses, often influenced by global spending cycles and currency moves.",
    constituentUrl: "https://www.niftyindices.com/IndexConstituent/ind_niftyitlist.csv",
    fallbackStocks: [{ symbol: "TCS.NS", weight: 28.0 }, { symbol: "INFY.NS", weight: 24.0 }, { symbol: "HCLTECH.NS", weight: 11.0 }, { symbol: "WIPRO.NS", weight: 9.0 }, { symbol: "TECHM.NS", weight: 8.0 }, { symbol: "LTIM.NS", weight: 7.0 }, { symbol: "PERSISTENT.NS", weight: 4.0 }, { symbol: "MPHASIS.NS", weight: 3.0 }, { symbol: "COFORGE.NS", weight: 3.0 }, { symbol: "OFSS.NS", weight: 1.0 }],
  },
  pharma: {
    key: "pharma",
    name: "Pharma",
    symbol: "^CNXPHARMA",
    description: "The pharma sector reflects medicine makers, diagnostics, research pipelines, export demand, and regulatory execution.",
    constituentUrl: "https://www.niftyindices.com/IndexConstituent/ind_niftypharmalist.csv",
    fallbackStocks: [{ symbol: "SUNPHARMA.NS", weight: 26.0 }, { symbol: "DIVISLAB.NS", weight: 13.0 }, { symbol: "CIPLA.NS", weight: 12.0 }, { symbol: "DRREDDY.NS", weight: 11.0 }, { symbol: "LUPIN.NS", weight: 8.0 }, { symbol: "TORNTPHARM.NS", weight: 7.0 }, { symbol: "ZYDUSLIFE.NS", weight: 6.0 }, { symbol: "ALKEM.NS", weight: 5.0 }, { symbol: "BIOCON.NS", weight: 4.0 }, { symbol: "ABBOTINDIA.NS", weight: 3.0 }],
  },
  fmcg: {
    key: "fmcg",
    name: "FMCG",
    symbol: "^CNXFMCG",
    description: "The FMCG sector covers essential consumer businesses, pricing power, rural demand trends, and margin resilience.",
    constituentUrl: "https://www.niftyindices.com/IndexConstituent/ind_niftyfmcglist.csv",
    fallbackStocks: [{ symbol: "HINDUNILVR.NS", weight: 30.0 }, { symbol: "ITC.NS", weight: 18.0 }, { symbol: "NESTLEIND.NS", weight: 14.0 }, { symbol: "VBL.NS", weight: 8.0 }, { symbol: "TATACONSUM.NS", weight: 7.0 }, { symbol: "BRITANNIA.NS", weight: 6.0 }, { symbol: "DABUR.NS", weight: 5.0 }, { symbol: "GODREJCP.NS", weight: 4.0 }, { symbol: "COLPAL.NS", weight: 4.0 }, { symbol: "MARICO.NS", weight: 4.0 }],
  },
  energy: {
    key: "energy",
    name: "Energy",
    symbol: "^CNXENERGY",
    description: "The energy sector reflects oil, gas, refining, integrated energy businesses, and infrastructure-linked demand.",
    constituentUrl: "https://www.niftyindices.com/IndexConstituent/ind_niftyenergylist.csv",
    fallbackStocks: [{ symbol: "RELIANCE.NS", weight: 38.0 }, { symbol: "ONGC.NS", weight: 11.0 }, { symbol: "IOC.NS", weight: 10.0 }, { symbol: "BPCL.NS", weight: 8.0 }, { symbol: "GAIL.NS", weight: 7.0 }, { symbol: "HINDPETRO.NS", weight: 6.0 }, { symbol: "ADANIPOWER.NS", weight: 6.0 }, { symbol: "POWERGRID.NS", weight: 5.0 }, { symbol: "NTPC.NS", weight: 5.0 }, { symbol: "OIL.NS", weight: 4.0 }],
  },
};

const symbolOverrides = {
  SAIL: "SAIL.NS",
  HDFC: "HDFCBANK.NS",
  RELIANCE: "RELIANCE.NS",
  INFOSYS: "INFY.NS",
  TCS: "TCS.NS",
  SBI: "SBIN.NS",
  ICICI: "ICICIBANK.NS",
};

const learningCatalog = {
  fundamentals: {
    title: "Fundamentals",
    description: "Fundamental learning teaches users how to understand value, financial health, business quality, and long-term investment reasoning.",
    levels: {
      beginner: {
        visual: [{ label: "Revenue", value: 80, className: "essentials" }, { label: "Profit", value: 55, className: "savings" }, { label: "Debt", value: 30, className: "flexible" }],
        topics: [{ term: "Stock", wikiTitle: "Stock" }, { term: "Revenue", wikiTitle: "Revenue" }, { term: "Profit (accounting)", wikiTitle: "Profit_(accounting)" }, { term: "Debt", wikiTitle: "Debt" }],
        quiz: [{ question: "What does buying one stock usually mean?", answer: "You own a small part of the company." }, { question: "Which is left after expenses are paid: revenue or profit?", answer: "Profit." }],
      },
      intermediate: {
        visual: [{ label: "ROE", value: 72, className: "savings" }, { label: "Margin", value: 58, className: "essentials" }, { label: "Leverage", value: 35, className: "flexible" }],
        topics: [{ term: "Price-to-earnings ratio", wikiTitle: "Price%E2%80%93earnings_ratio" }, { term: "Return on equity", wikiTitle: "Return_on_equity" }, { term: "Operating margin", wikiTitle: "Operating_margin" }, { term: "Free cash flow", wikiTitle: "Free_cash_flow" }],
        quiz: [{ question: "What does a healthy ROE often suggest?", answer: "The company is using shareholder capital efficiently." }, { question: "Why is free cash flow important?", answer: "It shows the business has usable cash after running and reinvesting in operations." }],
      },
      expert: {
        visual: [{ label: "Moat", value: 78, className: "savings" }, { label: "Capital Cycle", value: 52, className: "essentials" }, { label: "Risk", value: 28, className: "flexible" }],
        topics: [{ term: "Capital allocation", wikiTitle: "Capital_allocation" }, { term: "Economic moat", wikiTitle: "Economic_moat" }, { term: "Scenario analysis", wikiTitle: "Scenario_analysis" }, { term: "Business cycle", wikiTitle: "Business_cycle" }],
        quiz: [{ question: "What is the purpose of scenario analysis?", answer: "To test multiple future outcomes instead of relying on one perfect forecast." }, { question: "Why does capital allocation matter?", answer: "Because management decisions on profits can shape long-term shareholder returns." }],
      },
    },
  },
  technical: {
    title: "Technical Analysis",
    description: "Technical learning teaches users how price, volume, trend, and market behaviour create trading signals and risk-management frameworks.",
    levels: {
      beginner: {
        visual: [{ label: "Trend", value: 75, className: "essentials" }, { label: "Volume", value: 60, className: "savings" }, { label: "Noise", value: 40, className: "flexible" }],
        topics: [{ term: "Trend", wikiTitle: "Market_trend" }, { term: "Support and resistance", wikiTitle: "Support_and_resistance" }, { term: "Volume (finance)", wikiTitle: "Volume_(finance)" }, { term: "Candlestick chart", wikiTitle: "Candlestick_chart" }],
        quiz: [{ question: "What does resistance usually mean?", answer: "A price area where selling pressure may appear." }, { question: "Why is volume important?", answer: "It helps judge whether a price move has strong participation behind it." }],
      },
      intermediate: {
        visual: [{ label: "Momentum", value: 68, className: "savings" }, { label: "Structure", value: 62, className: "essentials" }, { label: "False Breaks", value: 32, className: "flexible" }],
        topics: [{ term: "Moving average", wikiTitle: "Moving_average" }, { term: "Relative strength index", wikiTitle: "Relative_strength_index" }, { term: "Breakout", wikiTitle: "Breakout_(technical_analysis)" }, { term: "Risk-reward ratio", wikiTitle: "Risk%E2%80%93reward_ratio" }],
        quiz: [{ question: "What does RSI primarily measure?", answer: "Momentum." }, { question: "Why is risk-reward important?", answer: "Because a trade should make sense even if not every setup wins." }],
      },
      expert: {
        visual: [{ label: "Structure", value: 74, className: "essentials" }, { label: "Execution", value: 66, className: "savings" }, { label: "Emotion", value: 24, className: "flexible" }],
        topics: [{ term: "Market structure", wikiTitle: "Market_structure" }, { term: "Multiple time frame analysis", wikiTitle: "Top-down_analysis" }, { term: "Position sizing", wikiTitle: "Position_size" }, { term: "Trading journal", wikiTitle: "Trading_strategy" }],
        quiz: [{ question: "Why use multi-timeframe analysis?", answer: "To align short-term setups with broader market direction." }, { question: "What protects capital more: prediction or position sizing?", answer: "Position sizing discipline." }],
      },
    },
  },
  "stock-market": {
    title: "Stock Market Path",
    description: "This track explains how the stock market works from first principles, then builds into workflows, participants, institutions, and advanced market behaviour.",
    levels: {
      beginner: {
        visual: [{ label: "Company", value: 78, className: "essentials" }, { label: "Exchange", value: 60, className: "savings" }, { label: "Investor", value: 55, className: "flexible" }],
        topics: [{ term: "Stock exchange", wikiTitle: "Stock_exchange" }, { term: "Stock market", wikiTitle: "Stock_market" }, { term: "Broker", wikiTitle: "Prime_broker" }, { term: "Initial public offering", wikiTitle: "Initial_public_offering" }],
        quiz: [{ question: "What is the role of an exchange?", answer: "It provides the marketplace where buy and sell orders are matched." }, { question: "Does buying a stock mean lending money or owning part of a company?", answer: "Owning part of a company." }],
      },
      intermediate: {
        visual: [{ label: "Price Discovery", value: 70, className: "savings" }, { label: "Liquidity", value: 58, className: "essentials" }, { label: "Volatility", value: 42, className: "flexible" }],
        topics: [{ term: "Price discovery", wikiTitle: "Price_discovery" }, { term: "Secondary market", wikiTitle: "Secondary_market" }, { term: "Liquidity", wikiTitle: "Market_liquidity" }, { term: "Market trend", wikiTitle: "Market_trend" }],
        quiz: [{ question: "What happens in the secondary market?", answer: "Investors trade already-listed securities with each other." }, { question: "Why does liquidity matter?", answer: "Because easier trading usually means lower friction and better execution." }],
      },
      expert: {
        visual: [{ label: "Institutions", value: 76, className: "essentials" }, { label: "Flows", value: 63, className: "savings" }, { label: "Friction", value: 28, className: "flexible" }],
        topics: [{ term: "Order flow", wikiTitle: "Order_flow" }, { term: "Market microstructure", wikiTitle: "Market_microstructure" }, { term: "Derivative", wikiTitle: "Derivative_(finance)" }, { term: "Securities regulation", wikiTitle: "Securities_regulation" }],
        quiz: [{ question: "What does market microstructure study?", answer: "The mechanics of order flow, spreads, depth, and execution." }, { question: "Why do institutional flows matter?", answer: "Because large capital movement can influence trend strength and market behaviour." }],
      },
    },
  },
};

const bookSeeds = [
  { id: "rich-dad", title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki" },
  { id: "intelligent-investor", title: "The Intelligent Investor", author: "Benjamin Graham" },
  { id: "psychology-money", title: "The Psychology of Money", author: "Morgan Housel" },
];

const cache = new Map();

async function fetchCached(url, ttlMs, parser = "json") {
  const hit = cache.get(url);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "IntelligentInvestor/1.0",
      Accept: parser === "json" ? "application/json, text/plain, */*" : "*/*",
    },
  });
  if (!response.ok) throw new Error(`Request failed for ${url}`);
  const value = parser === "text" ? await response.text() : await response.json();
  cache.set(url, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

function splitCsvRow(row) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < row.length; index += 1) {
    const char = row[index];
    if (char === '"') {
      if (quoted && row[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvRow(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvRow(line);
    return headers.reduce((record, header, index) => {
      record[header] = values[index] || "";
      return record;
    }, {});
  });
}

function normalizeIndianSymbol(symbol) {
  const raw = `${symbol || ""}`.trim().toUpperCase();
  if (!raw) return "";
  if (raw.endsWith(".NS") || raw.endsWith(".BO")) return raw;
  return `${raw}.NS`;
}

async function fetchSectorStocks(sectorKey) {
  const sector = sectorCatalog[sectorKey] || sectorCatalog.banking;
  try {
    const csvText = await fetchCached(sector.constituentUrl, 1000 * 60 * 60 * 6, "text");
    const rows = parseCsv(csvText);
    const stocks = rows
      .map((row) => ({
        symbol: normalizeIndianSymbol(row.Symbol || row.SYMBOL || row.Symbols),
        companyName: row.Company || row["Company Name"] || row.CompanyName || row.Name || row.Symbol,
        weight: Number.parseFloat((row["Weightage(%)"] || row.Weightage || row.Weight || "0").replace(/[^\d.-]/g, "")) || 0,
      }))
      .filter((item) => item.symbol)
      .sort((left, right) => right.weight - left.weight);

    if (stocks.length) return stocks;
  } catch {}

  return sector.fallbackStocks.map((stock) => ({ ...stock, companyName: stock.symbol.replace(".NS", "") }));
}

async function fetchWikipediaSummary(title) {
  if (!title) return null;
  try {
    const payload = await fetchCached(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, 1000 * 60 * 60 * 6);
    return {
      title: payload?.title || title,
      summary: payload?.extract || "",
      sourceUrl: payload?.content_urls?.desktop?.page || "",
      thumbnail: payload?.thumbnail?.source || "",
    };
  } catch {
    return null;
  }
}

function normalizeBookDescription(description) {
  if (!description) return "";
  if (typeof description === "string") return description;
  if (typeof description?.value === "string") return description.value;
  return "";
}

async function fetchBookCollection() {
  return Promise.all(
    bookSeeds.map(async (seed) => {
      try {
        const searchUrl = new URL("https://openlibrary.org/search.json");
        searchUrl.searchParams.set("title", seed.title);
        searchUrl.searchParams.set("author", seed.author);
        searchUrl.searchParams.set("limit", "1");
        const searchPayload = await fetchCached(searchUrl.toString(), 1000 * 60 * 60 * 12);
        const doc = searchPayload?.docs?.[0] || {};
        let workPayload = null;
        if (doc.key?.startsWith("/works/")) {
          workPayload = await fetchCached(`https://openlibrary.org${doc.key}.json`, 1000 * 60 * 60 * 24);
        }
        return {
          id: seed.id,
          title: doc.title || seed.title,
          author: doc.author_name?.[0] || seed.author,
          description: normalizeBookDescription(workPayload?.description) || doc.first_sentence?.[0] || "Book metadata could not be expanded right now.",
          coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : "",
          subjects: (workPayload?.subjects || doc.subject || []).slice(0, 6),
          sourceUrl: doc.key ? `https://openlibrary.org${doc.key}` : "https://openlibrary.org/",
        };
      } catch {
        return {
          id: seed.id,
          title: seed.title,
          author: seed.author,
          description: "Book metadata could not be loaded from Open Library right now.",
          coverUrl: "",
          subjects: [],
          sourceUrl: "https://openlibrary.org/",
        };
      }
    })
  );
}

async function fetchLearningContent(trackKey, levelKey) {
  const track = learningCatalog[trackKey] || learningCatalog.fundamentals;
  const level = track.levels[levelKey] || track.levels.beginner;
  const cards = await Promise.all(
    level.topics.map(async (topic) => {
      const wiki = await fetchWikipediaSummary(topic.wikiTitle);
      return {
        term: topic.term,
        description: wiki?.summary || `${topic.term} is part of the current ${track.title.toLowerCase()} path.`,
        sourceUrl: wiki?.sourceUrl || "",
      };
    })
  );
  return {
    title: track.title,
    description: track.description,
    visual: level.visual,
    cards,
    quiz: level.quiz,
  };
}

async function resolveIndianSymbol(queryOrSymbol) {
  const raw = (queryOrSymbol || "").trim().toUpperCase();
  if (!raw) return null;
  if (symbolOverrides[raw]) return symbolOverrides[raw];
  if (raw.endsWith(".NS") || raw.endsWith(".BO")) return raw;
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

async function fetchIndianStockDetail(symbol) {
  const resolvedSymbol = await resolveIndianSymbol(symbol);
  const [summaryResult, quoteResult, chartResult] = await Promise.allSettled([
    fetchYahooQuoteSummary(resolvedSymbol),
    fetchYahooQuoteBatch([resolvedSymbol]),
    fetchYahooChartSnapshot(resolvedSymbol),
  ]);
  const summary = summaryResult.status === "fulfilled" ? summaryResult.value : null;
  const quotes = quoteResult.status === "fulfilled" ? quoteResult.value : [];
  const quote = quotes[0] || {};
  const chart = chartResult.status === "fulfilled" ? chartResult.value : null;
  const wiki = !summary?.assetProfile?.longBusinessSummary ? await fetchWikipediaSummary(quote.shortName || quote.longName || resolvedSymbol.replace(".NS", "")) : null;

  return {
    symbol: resolvedSymbol,
    shortName: quote.shortName || quote.longName || summary?.price?.shortName || resolvedSymbol,
    businessSummary: summary?.assetProfile?.longBusinessSummary || wiki?.summary || "Detailed business profile is not available from the current source right now, but live price and technical metrics are shown when available.",
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
    sourceUrl: wiki?.sourceUrl || "",
    warning: !summary?.assetProfile?.longBusinessSummary && wiki?.summary ? "Wikipedia business summary was used because the finance profile source was limited." : undefined,
  };
}

module.exports = {
  sectorCatalog,
  learningCatalog,
  fetchSectorStocks,
  fetchWikipediaSummary,
  fetchBookCollection,
  fetchLearningContent,
  resolveIndianSymbol,
  fetchIndianStockDetail,
};

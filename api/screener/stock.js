const {
  sendJson,
  fetchYahooQuoteSummary,
  fetchYahooQuoteBatch,
  fetchYahooChartSnapshot,
  resolveIndianSymbol,
} = require("../_lib/data");

module.exports = async function handler(req, res) {
  const requestUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const requestedSymbol = requestUrl.searchParams.get("symbol");

  if (!requestedSymbol) {
    sendJson(res, 400, { error: "Missing symbol" });
    return;
  }

  const symbol = await resolveIndianSymbol(requestedSymbol);

  try {
    const [summaryResult, quoteResult, chartResult] = await Promise.allSettled([
      fetchYahooQuoteSummary(symbol),
      fetchYahooQuoteBatch([symbol]),
      fetchYahooChartSnapshot(symbol),
    ]);
    const summary = summaryResult.status === "fulfilled" ? summaryResult.value : null;
    const quotes = quoteResult.status === "fulfilled" ? quoteResult.value : [];
    const quote = quotes[0] || {};
    const chart = chartResult.status === "fulfilled" ? chartResult.value : null;

    if (!summary && !quote.symbol && !chart) {
      throw new Error("No live stock detail payload available");
    }

    sendJson(res, 200, {
      detail: {
        symbol,
        shortName: quote.shortName || quote.longName || summary?.price?.shortName || symbol,
        businessSummary:
          summary?.assetProfile?.longBusinessSummary ||
          "Detailed business profile is not available from the current source right now, but live price and technical metrics are shown when available.",
        sector: summary?.assetProfile?.sector || "n/a",
        industry: summary?.assetProfile?.industry || "n/a",
        marketCap: quote.marketCap
          ? new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 2 }).format(quote.marketCap)
          : "n/a",
        currentPrice: quote.regularMarketPrice ?? chart?.price ?? "n/a",
        trailingPE: quote.trailingPE ?? "n/a",
        dividendYield: quote.trailingAnnualDividendYield ?? "n/a",
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? chart?.fiftyTwoWeekLow ?? "n/a",
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? chart?.fiftyTwoWeekHigh ?? "n/a",
        fiftyDayAverage: quote.fiftyDayAverage ?? chart?.fiftyDayAverage ?? "n/a",
        twoHundredDayAverage: quote.twoHundredDayAverage ?? chart?.twoHundredDayAverage ?? "n/a",
      },
      warning: !summary
        ? chart
          ? "Chart-based live metrics loaded, but business profile is limited right now."
          : "Live quote loaded, but business profile is limited right now."
        : undefined,
    });
  } catch (error) {
    sendJson(res, 200, {
      detail: {
        symbol,
        shortName: symbol,
        businessSummary: "Live stock details could not be loaded right now.",
        sector: "n/a",
        industry: "n/a",
        marketCap: "n/a",
        currentPrice: "n/a",
        trailingPE: "n/a",
        dividendYield: "n/a",
        fiftyTwoWeekLow: "n/a",
        fiftyTwoWeekHigh: "n/a",
        fiftyDayAverage: "n/a",
        twoHundredDayAverage: "n/a",
      },
      warning: "Fallback stock detail returned.",
    });
  }
};

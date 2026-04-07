const { rangeConfig, sendJson, fetchYahooIndex, fetchYahooQuoteBatch } = require("../_lib/data");
const { sectorCatalog, fetchSectorStocks } = require("../_lib/dynamic");

module.exports = async function handler(req, res) {
  const requestUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const key = requestUrl.searchParams.get("key") || "banking";
  const sector = sectorCatalog[key] || sectorCatalog.banking;
  const config = rangeConfig["1mo"];

  try {
    const constituents = await fetchSectorStocks(sector.key);
    const topStocks = constituents.slice(0, 10);
    const [sectorIndex, stockQuotes] = await Promise.all([
      fetchYahooIndex(sector.symbol, config),
      fetchYahooQuoteBatch(topStocks.map((item) => item.symbol)),
    ]);

    const quoteMap = new Map(stockQuotes.map((quote) => [quote.symbol, quote]));
    const stocks = topStocks.map((stock) => {
      const quote = quoteMap.get(stock.symbol) || {};
      return {
        symbol: stock.symbol,
        shortName: quote.shortName || stock.companyName || stock.symbol,
        weight: stock.weight,
        price: quote.regularMarketPrice || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        trailingPE: quote.trailingPE ?? null,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? null,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? null,
      };
    });

    sendJson(res, 200, {
      sector: {
        ...sectorIndex,
        key: sector.key,
        name: sector.name,
        description: sector.description,
      },
      stocks,
      source: sector.constituentUrl,
    });
  } catch (error) {
    sendJson(res, 200, {
      sector: {
        key: sector.key,
        name: sector.name,
        symbol: sector.symbol,
        description: sector.description,
        price: 10000,
        changePercent: 0,
        rangeLabel: "Fallback data",
        updatedAt: "offline mode",
        series: [100, 105, 103, 110, 108, 112, 116, 115, 118, 121],
      },
      stocks: sector.fallbackStocks.map((stock, index) => ({
        symbol: stock.symbol,
        shortName: stock.symbol,
        weight: stock.weight,
        price: 100 + index * 50,
        changePercent: index % 2 === 0 ? 1.2 : -0.6,
        trailingPE: 20 + index,
        fiftyTwoWeekLow: 80 + index * 20,
        fiftyTwoWeekHigh: 140 + index * 20,
      })),
      warning: "Fallback screener sector data returned.",
    });
  }
};

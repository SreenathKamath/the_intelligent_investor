const { rangeConfig, sectorMap, sendJson, fetchYahooIndex, fetchYahooQuoteBatch } = require("../_lib/data");

module.exports = async function handler(req, res) {
  const requestUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const key = requestUrl.searchParams.get("key") || "banking";
  const sector = sectorMap[key] || sectorMap.banking;
  const config = rangeConfig["1mo"];

  try {
    const [sectorIndex, stockQuotes] = await Promise.all([
      fetchYahooIndex(sector.symbol, config),
      fetchYahooQuoteBatch(sector.stocks.map((item) => item.symbol)),
    ]);

    const quoteMap = new Map(stockQuotes.map((quote) => [quote.symbol, quote]));
    const stocks = sector.stocks.map((stock) => {
      const quote = quoteMap.get(stock.symbol) || {};
      return {
        symbol: stock.symbol,
        shortName: quote.shortName || stock.symbol,
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
        description: sector.description,
      },
      stocks,
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
      stocks: sector.stocks.map((stock, index) => ({
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

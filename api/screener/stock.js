const { sendJson } = require("../_lib/data");
const { fetchIndianStockDetail } = require("../_lib/dynamic");

module.exports = async function handler(req, res) {
  const requestUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const requestedSymbol = requestUrl.searchParams.get("symbol");

  if (!requestedSymbol) {
    sendJson(res, 400, { error: "Missing symbol" });
    return;
  }

  try {
    const detail = await fetchIndianStockDetail(requestedSymbol);
    sendJson(res, 200, {
      detail,
      warning: detail.warning,
      sourceUrl: detail.sourceUrl,
    });
  } catch (error) {
    sendJson(res, 200, {
      detail: {
        symbol: requestedSymbol,
        shortName: requestedSymbol,
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

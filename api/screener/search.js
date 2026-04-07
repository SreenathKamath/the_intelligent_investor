const { sendJson, fetchYahooSearch, isIndianQuote, searchScore } = require("../_lib/data");
const { resolveIndianSymbol } = require("../_lib/dynamic");

module.exports = async function handler(req, res) {
  const requestUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const query = requestUrl.searchParams.get("q") || "";

  if (!query) {
    sendJson(res, 400, { error: "Missing query" });
    return;
  }

  try {
    const payload = await fetchYahooSearch(query);
    const matches = (payload?.quotes || [])
      .filter((item) => item.symbol && item.quoteType === "EQUITY" && isIndianQuote(item))
      .sort((a, b) => searchScore(b, query) - searchScore(a, query))
      .slice(0, 5)
      .map((item) => ({
        symbol: item.symbol,
        shortName: item.shortname || item.longname || item.symbol,
        exchange: item.exchangeDisp || item.exchange || "",
      }));

    const resolvedSymbol = await resolveIndianSymbol(query);
    const bestMatch =
      matches.find((item) => item.symbol.toUpperCase() === resolvedSymbol?.toUpperCase()) ||
      (resolvedSymbol ? { symbol: resolvedSymbol, shortName: resolvedSymbol, exchange: "India" } : null) ||
      matches[0] ||
      null;

    sendJson(res, 200, { bestMatch, matches });
  } catch (error) {
    const resolvedSymbol = await resolveIndianSymbol(query);
    sendJson(res, 200, {
      bestMatch: resolvedSymbol ? { symbol: resolvedSymbol, shortName: resolvedSymbol, exchange: "India" } : null,
      matches: resolvedSymbol ? [{ symbol: resolvedSymbol, shortName: resolvedSymbol, exchange: "India" }] : [],
      warning: "Search fetch failed.",
    });
  }
};

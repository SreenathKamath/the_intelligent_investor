const { symbolMap, rangeConfig, fallbackIndices, sendJson, fetchYahooIndex } = require("../_lib/data");

module.exports = async function handler(req, res) {
  const requestUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const range = requestUrl.searchParams.get("range") || "1mo";
  const config = rangeConfig[range] || rangeConfig["1mo"];

  try {
    const indices = await Promise.all(symbolMap.map((item) => fetchYahooIndex(item.symbol, config)));
    sendJson(res, 200, { indices });
  } catch (error) {
    sendJson(res, 200, {
      indices: fallbackIndices.map((item) => ({ ...item, rangeLabel: config.label })),
      warning: "Live market fetch failed, fallback data returned.",
    });
  }
};

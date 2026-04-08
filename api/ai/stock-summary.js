const { sendJson } = require("../_lib/data");
const { DEFAULT_MODEL, hasOpenRouterKey, readJsonRequest, generateAiSummary } = require("../_lib/ai");

module.exports = async function handler(req, res) {
  if (req.method && req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonRequest(req);
    const { stock, sector, sectorSource } = body;
    if (!stock) {
      sendJson(res, 400, { error: "Missing stock data" });
      return;
    }

    if (!hasOpenRouterKey()) {
      sendJson(res, 200, {
        summary: "AI stock summary is ready to use once you add OPENROUTER_API_KEY to your environment.",
        model: DEFAULT_MODEL,
        warning: "Missing OPENROUTER_API_KEY",
        sourceUrl: stock.sourceUrl || "",
        sectorSource: sectorSource || "",
      });
      return;
    }

    const currentPrice = Number.parseFloat(stock.currentPrice);
    const fiftyDayAverage = Number.parseFloat(stock.fiftyDayAverage);
    const twoHundredDayAverage = Number.parseFloat(stock.twoHundredDayAverage);
    const currentTrend =
      Number.isFinite(currentPrice) && Number.isFinite(fiftyDayAverage) && Number.isFinite(twoHundredDayAverage)
        ? currentPrice > fiftyDayAverage && currentPrice > twoHundredDayAverage
          ? "Price is above both the 50-day and 200-day averages, which suggests a constructive medium-term trend."
          : currentPrice < fiftyDayAverage && currentPrice < twoHundredDayAverage
            ? "Price is below both the 50-day and 200-day averages, which suggests a weaker trend setup right now."
            : "Price is mixed versus the 50-day and 200-day averages, which suggests a less decisive trend."
        : "Trend could not be derived cleanly from the available moving-average data.";

    const systemPrompt = "You are an expert Indian equity research analyst and portfolio manager. Summarize a stock for a wide range of users, from serious beginners to intermediate investors. Be balanced, practical, risk-aware, and do not give guaranteed return claims or direct buy/sell calls. Use clear section headings.";
    const userPrompt = `Create a concise stock research summary from the following data.\n\nStock:\n- Symbol: ${stock.symbol}\n- Name: ${stock.shortName}\n- Business summary: ${stock.businessSummary}\n- Sector: ${stock.sector}\n- Industry: ${stock.industry}\n- Market cap: ${stock.marketCap}\n- Current price: ${stock.currentPrice}\n- Trailing PE: ${stock.trailingPE}\n- Dividend yield: ${stock.dividendYield}\n- 52-week low: ${stock.fiftyTwoWeekLow}\n- 52-week high: ${stock.fiftyTwoWeekHigh}\n- 50-day average: ${stock.fiftyDayAverage}\n- 200-day average: ${stock.twoHundredDayAverage}\n\nDerived trend:\n- ${currentTrend}\n\nContext:\n- Active sector: ${sector?.name || "n/a"}\n- Sector description: ${sector?.description || "n/a"}\n\nWrite with these exact headings:\nBusiness Overview:\nFundamental View:\nTechnical View:\nCurrent Trend:\nSuitable For:\nCaution:\nSources:\n\nUnder Sources, briefly mention the external references used. Keep it under 280 words and use a professional financial-manager tone.`;

    const result = await generateAiSummary({ systemPrompt, userPrompt, temperature: 0.2, maxTokens: 480 });
    sendJson(res, 200, {
      ...result,
      sourceUrl: stock.sourceUrl || "",
      sectorSource: sectorSource || "",
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "AI stock summary failed" });
  }
};

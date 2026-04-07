const { rangeConfig, sectorMap, sendJson, fetchYahooIndex } = require("../_lib/data");

module.exports = async function handler(req, res) {
  const config = rangeConfig["1mo"];
  const sectors = Object.values(sectorMap);

  try {
    const liveSectors = await Promise.all(
      sectors.map(async (sector) => {
        const live = await fetchYahooIndex(sector.symbol, config);
        return {
          key: sector.key,
          name: sector.name,
          symbol: sector.symbol,
          description: sector.description,
          price: live.price,
          changePercent: live.changePercent,
        };
      })
    );

    sendJson(res, 200, { sectors: liveSectors });
  } catch (error) {
    sendJson(res, 200, {
      sectors: sectors.map((sector, index) => ({
        key: sector.key,
        name: sector.name,
        symbol: sector.symbol,
        description: sector.description,
        price: 10000 + index * 1500,
        changePercent: index % 2 === 0 ? 0.8 : -0.3,
      })),
      warning: "Fallback sector list returned.",
    });
  }
};

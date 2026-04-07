const { sendJson } = require("../_lib/data");
const { fetchLearningContent } = require("../_lib/dynamic");

module.exports = async function handler(req, res) {
  const requestUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const track = requestUrl.searchParams.get("track") || "fundamentals";
  const level = requestUrl.searchParams.get("level") || "beginner";

  try {
    const content = await fetchLearningContent(track, level);
    sendJson(res, 200, content);
  } catch (error) {
    sendJson(res, 200, {
      title: "Learning content unavailable",
      description: "Live educational content could not be loaded right now.",
      visual: [],
      cards: [],
      quiz: [],
      warning: "Learning fetch failed.",
    });
  }
};

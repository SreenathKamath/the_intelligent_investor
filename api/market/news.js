const { sendJson, parseRssItems } = require("../_lib/data");

module.exports = async function handler(req, res) {
  const feeds = [
    "https://news.google.com/rss/search?q=Indian%20stock%20market&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=global%20financial%20markets&hl=en-US&gl=US&ceid=US:en",
  ];

  try {
    const responses = await Promise.all(
      feeds.map((url) =>
        fetch(url, {
          headers: {
            "User-Agent": "IntelligentInvestor/1.0",
            Accept: "application/rss+xml, application/xml, text/xml",
          },
        }).then((result) => result.text())
      )
    );

    const items = responses.flatMap((xmlText) => parseRssItems(xmlText)).slice(0, 8);
    sendJson(res, 200, { items });
  } catch (error) {
    sendJson(res, 200, {
      items: [
        {
          source: "Offline fallback",
          title: "Live news feed unavailable",
          summary: "The app is configured for free RSS-based market headlines, but the network request failed.",
          publishedAt: new Date().toLocaleString("en-IN"),
          link: "",
        },
      ],
      warning: "Live news fetch failed.",
    });
  }
};

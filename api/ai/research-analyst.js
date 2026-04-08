const { DEFAULT_MODEL, hasOpenRouterKey, readJsonRequest, generateAiSummary } = require("../_lib/ai");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function createContextBlock(label, value) {
  if (!value) return "";
  return `${label}:\n${JSON.stringify(value, null, 2)}`;
}

module.exports = async function researchAnalystHandler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonRequest(request);
    const conversation = Array.isArray(body.messages) ? body.messages.slice(-10) : [];

    if (!conversation.length) {
      sendJson(response, 400, { error: "Missing chat messages" });
      return;
    }

    if (!hasOpenRouterKey()) {
      sendJson(response, 200, {
        reply:
          "Research Analyst is ready, but the OpenRouter key is missing in this environment. Add OPENROUTER_API_KEY to enable live AI chat.",
        model: DEFAULT_MODEL,
        warning: "Missing OPENROUTER_API_KEY",
      });
      return;
    }

    const contextParts = [
      body.page ? `Active page: ${body.page}` : "",
      body.pageHeading ? `Page heading: ${body.pageHeading}` : "",
      body.pageDescription ? `Page description: ${body.pageDescription}` : "",
      createContextBlock("Planner context", body.plannerContext),
      createContextBlock("Screener context", body.screenerContext),
    ].filter(Boolean);

    const messages = [
      {
        role: "system",
        content:
          "You are Research Analyst, the AI financial companion inside Intelligent Investor. Answer like a calm, research-driven financial guide for Indian users. Be clear for beginners, useful for intermediate users, and structured enough for advanced users. Use plain language first, then expert framing when helpful. Do not promise returns. Do not claim certainty. When discussing stocks, separate business quality, fundamentals, technical trend, and risks. When discussing budgeting, separate cash flow, savings, debt, emergency fund, and investing next steps. If page context is available, use it directly. Keep answers concise but actionable.",
      },
      ...(contextParts.length
        ? [
            {
              role: "system",
              content: `Current product context:\n${contextParts.join("\n\n")}`,
            },
          ]
        : []),
      ...conversation
        .filter((message) => message && typeof message.content === "string" && message.content.trim())
        .map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content.trim(),
        })),
    ];

    const result = await generateAiSummary({
      messages,
      temperature: 0.35,
      maxTokens: 700,
    });

    sendJson(response, 200, {
      reply: result.summary,
      model: result.model || DEFAULT_MODEL,
    });
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || "Research Analyst chat failed",
    });
  }
};

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getOpenRouterKey() {
  return process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY || "";
}

function hasOpenRouterKey() {
  return Boolean(getOpenRouterKey());
}

async function readJsonRequest(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  if (!req || typeof req.on !== "function") return {};

  const chunks = await new Promise((resolve, reject) => {
    const parts = [];
    req.on("data", (chunk) => parts.push(chunk));
    req.on("end", () => resolve(parts));
    req.on("error", reject);
  });

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

async function generateAiSummary({ systemPrompt, userPrompt, messages, temperature = 0.3, maxTokens = 500 }) {
  const apiKey = getOpenRouterKey();
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const requestMessages = Array.isArray(messages) && messages.length
    ? messages
    : [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://intelligent-investor.local",
      "X-Title": "Intelligent Investor"
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature,
      max_tokens: maxTokens,
      messages: requestMessages
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || "OpenRouter request failed");
  }

  return {
    summary: payload?.choices?.[0]?.message?.content?.trim() || "",
    model: payload?.model || DEFAULT_MODEL
  };
}

module.exports = {
  DEFAULT_MODEL,
  hasOpenRouterKey,
  readJsonRequest,
  generateAiSummary
};

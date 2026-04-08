const researchAnalystStorageKey = "ii-research-analyst-chat";

const researchAnalystState = {
  open: false,
  loading: false,
  messages: loadResearchAnalystHistory(),
};

function loadResearchAnalystHistory() {
  try {
    const raw = sessionStorage.getItem(researchAnalystStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }
  } catch (error) {
    // Ignore broken session data and restore default welcome state.
  }

  return [
    {
      role: "assistant",
      content:
        "I’m Research Analyst. Ask me about budgeting, emergency funds, portfolio allocation, sector trends, or any stock you are reviewing on this page.",
    },
  ];
}

function saveResearchAnalystHistory() {
  sessionStorage.setItem(researchAnalystStorageKey, JSON.stringify(researchAnalystState.messages.slice(-12)));
}

function escapeHtml(value) {
  return `${value || ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderResearchAnalystText(text) {
  const safe = escapeHtml(text);
  const withLinks = safe.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
  return withLinks.replace(/\n/g, "<br />");
}

function buildResearchAnalystShell() {
  if (document.getElementById("researchAnalystWidget")) return;

  const widget = document.createElement("div");
  widget.id = "researchAnalystWidget";
  widget.className = "research-analyst";
  widget.innerHTML = `
    <button id="researchAnalystLauncher" class="research-analyst-launcher" type="button" aria-expanded="false" aria-controls="researchAnalystPanel">
      <span>RA</span>
    </button>
    <section id="researchAnalystPanel" class="research-analyst-panel glass-panel" aria-hidden="true">
      <header class="research-analyst-header">
        <div>
          <p class="eyebrow">AI Assistant</p>
          <h3>Research Analyst</h3>
          <p class="helper-text">Page-aware financial guidance powered by OpenRouter.</p>
        </div>
        <button id="researchAnalystClose" class="btn btn-secondary research-analyst-close" type="button">Close</button>
      </header>
      <div id="researchAnalystMessages" class="research-analyst-messages"></div>
      <div id="researchAnalystTyping" class="research-analyst-typing" hidden>Research Analyst is typing...</div>
      <form id="researchAnalystForm" class="research-analyst-form">
        <textarea id="researchAnalystInput" rows="2" placeholder="Ask about budgeting, a stock, a sector, or your next financial step..."></textarea>
        <button id="researchAnalystSend" class="btn btn-primary" type="submit">Send</button>
      </form>
    </section>
  `;

  document.body.appendChild(widget);
}

function renderResearchAnalystMessages() {
  const container = document.getElementById("researchAnalystMessages");
  if (!container) return;

  container.innerHTML = researchAnalystState.messages
    .map(
      (message) => `
        <article class="chat-message ${message.role === "assistant" ? "assistant" : "user"}">
          <span class="chat-role">${message.role === "assistant" ? "Research Analyst" : "You"}</span>
          <div class="chat-bubble">${renderResearchAnalystText(message.content)}</div>
        </article>
      `
    )
    .join("");

  container.scrollTop = container.scrollHeight;
}

function setResearchAnalystOpen(isOpen) {
  researchAnalystState.open = isOpen;
  const panel = document.getElementById("researchAnalystPanel");
  const launcher = document.getElementById("researchAnalystLauncher");
  if (!panel || !launcher) return;

  panel.classList.toggle("open", isOpen);
  panel.setAttribute("aria-hidden", String(!isOpen));
  launcher.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    renderResearchAnalystMessages();
    document.getElementById("researchAnalystInput")?.focus();
  }
}

function setResearchAnalystLoading(isLoading) {
  researchAnalystState.loading = isLoading;
  const typing = document.getElementById("researchAnalystTyping");
  const sendButton = document.getElementById("researchAnalystSend");
  const input = document.getElementById("researchAnalystInput");
  if (typing) typing.hidden = !isLoading;
  if (sendButton) sendButton.disabled = isLoading;
  if (input) input.disabled = isLoading;
}

function getResearchAnalystContext() {
  const pageHeading = document.querySelector("main h2, .page-hero h2, .hero h2")?.textContent?.trim() || "";
  const pageDescription = document.querySelector(".page-hero .hero-text, .hero .hero-text")?.textContent?.trim() || "";

  return {
    page: document.body.dataset.page || "unknown",
    pageHeading,
    pageDescription,
    plannerContext: window.intelligentInvestorPlannerContext || null,
    screenerContext: window.intelligentInvestorScreenerContext || null,
  };
}

async function submitResearchAnalystMessage(content) {
  researchAnalystState.messages.push({ role: "user", content });
  saveResearchAnalystHistory();
  renderResearchAnalystMessages();
  setResearchAnalystLoading(true);

  try {
    const response = await fetch("/api/ai/research-analyst", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...getResearchAnalystContext(),
        messages: researchAnalystState.messages.slice(-10),
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Research Analyst is unavailable right now.");

    researchAnalystState.messages.push({
      role: "assistant",
      content: payload.reply || "I could not generate a response right now.",
    });
  } catch (error) {
    researchAnalystState.messages.push({
      role: "assistant",
      content: error.message || "Research Analyst is unavailable right now.",
    });
  } finally {
    saveResearchAnalystHistory();
    renderResearchAnalystMessages();
    setResearchAnalystLoading(false);
  }
}

function initResearchAnalyst() {
  buildResearchAnalystShell();
  renderResearchAnalystMessages();

  document.getElementById("researchAnalystLauncher")?.addEventListener("click", () => {
    setResearchAnalystOpen(!researchAnalystState.open);
  });

  document.getElementById("researchAnalystClose")?.addEventListener("click", () => {
    setResearchAnalystOpen(false);
  });

  document.getElementById("researchAnalystForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("researchAnalystInput");
    const content = input?.value.trim();
    if (!content || researchAnalystState.loading) return;
    input.value = "";
    await submitResearchAnalystMessage(content);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initResearchAnalyst, { once: true });
} else {
  initResearchAnalyst();
}

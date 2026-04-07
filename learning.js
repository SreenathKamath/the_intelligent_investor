const externalResources = [
  {
    title: "SEBI Investor Education",
    url: "https://investor.sebi.gov.in/",
    description: "Official investor education resources from the Securities and Exchange Board of India.",
  },
  {
    title: "NSE Knowledge Hub",
    url: "https://www.nseindia.com/learn",
    description: "Official exchange learning resources on stocks, markets, and investor basics.",
  },
  {
    title: "Zerodha Varsity",
    url: "https://zerodha.com/varsity/",
    description: "Well-structured modules on markets, fundamental analysis, and technical analysis.",
  },
  {
    title: "Investopedia Markets Education",
    url: "https://www.investopedia.com/",
    description: "Useful glossary and educational reference material for financial concepts and market terminology.",
  },
];

const trackSelect = document.getElementById("trackSelect");
const levelSelect = document.getElementById("levelSelect");
const learningTitle = document.getElementById("learningTitle");
const learningDescription = document.getElementById("learningDescription");
const learningVisual = document.getElementById("learningVisual");
const learningCards = document.getElementById("learningCards");
const quizSection = document.getElementById("quizSection");
const resourceLinks = document.getElementById("resourceLinks");

function escapeHtml(value) {
  return `${value || ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function renderLearning() {
  learningTitle.textContent = "Loading...";
  learningDescription.textContent = "Loading live educational summaries...";

  try {
    const response = await fetch(`/api/learning/content?track=${encodeURIComponent(trackSelect.value)}&level=${encodeURIComponent(levelSelect.value)}`);
    const payload = await response.json();

    learningTitle.textContent = `${payload.title} | ${levelSelect.value.charAt(0).toUpperCase()}${levelSelect.value.slice(1)} Level`;
    learningDescription.textContent = payload.description;

    learningVisual.innerHTML = (payload.visual || [])
      .map(
        (item) => `
          <div class="cashflow-row">
            <div class="cashflow-meta">
              <span>${escapeHtml(item.label)}</span>
              <span>${item.value}% focus</span>
            </div>
            <div class="cashflow-bar-track">
              <div class="cashflow-bar-fill ${item.className}" style="width: ${item.value}%"></div>
            </div>
          </div>
        `
      )
      .join("");

    learningCards.innerHTML = (payload.cards || [])
      .map(
        (card) => `
          <article class="insight-item">
            <strong>${escapeHtml(card.term)}</strong>
            <span>${escapeHtml(card.description)}</span>
            ${card.sourceUrl ? `<a class="trend flat" href="${card.sourceUrl}" target="_blank" rel="noreferrer">Read More</a>` : ""}
          </article>
        `
      )
      .join("");

    quizSection.innerHTML = (payload.quiz || [])
      .map(
        (quiz) => `
          <article class="glass-panel quiz-card">
            <h3>${escapeHtml(quiz.question)}</h3>
            <p>${escapeHtml(quiz.answer)}</p>
          </article>
        `
      )
      .join("");
  } catch (error) {
    learningTitle.textContent = "Learning content unavailable";
    learningDescription.textContent = "Live educational content could not be loaded right now.";
    learningVisual.innerHTML = "";
    learningCards.innerHTML = `<article class="insight-item"><strong>Try again later</strong><span>External learning content is temporarily unavailable.</span></article>`;
    quizSection.innerHTML = "";
  }
}

resourceLinks.innerHTML = externalResources
  .map(
    (resource) => `
      <a class="glass-panel route-card" href="${resource.url}" target="_blank" rel="noreferrer">
        <p class="eyebrow">Resource</p>
        <h3>${resource.title}</h3>
        <p>${resource.description}</p>
        <span class="trend flat">Open Link</span>
      </a>
    `
  )
  .join("");

trackSelect.addEventListener("change", renderLearning);
levelSelect.addEventListener("change", renderLearning);
renderLearning();

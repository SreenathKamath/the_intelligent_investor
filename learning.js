const learningData = {
  fundamentals: {
    title: "Fundamentals",
    description:
      "Fundamental learning teaches users how to understand value, financial health, business quality, and long-term investment reasoning.",
    levels: {
      beginner: {
        visual: [
          { label: "Revenue", value: 80, className: "essentials" },
          { label: "Profit", value: 55, className: "savings" },
          { label: "Debt", value: 30, className: "flexible" },
        ],
        cards: [
          {
            term: "What is a stock?",
            description: "A stock is a small ownership share in a company. When the company grows in value, your ownership can grow too.",
          },
          {
            term: "Revenue vs Profit",
            description: "Revenue is the total money a company earns. Profit is what remains after paying costs and expenses.",
          },
          {
            term: "Debt",
            description: "Debt is borrowed money. Too much debt can make a business fragile, especially in weak market conditions.",
          },
          {
            term: "Valuation basics",
            description: "Valuation asks whether a stock price looks expensive, reasonable, or cheap compared with the business underneath it.",
          },
        ],
        quiz: [
          {
            question: "What does buying one stock usually mean?",
            answer: "You own a small part of the company.",
          },
          {
            question: "Which is left after expenses are paid: revenue or profit?",
            answer: "Profit.",
          },
        ],
      },
      intermediate: {
        visual: [
          { label: "ROE", value: 72, className: "savings" },
          { label: "Margin", value: 58, className: "essentials" },
          { label: "Leverage", value: 35, className: "flexible" },
        ],
        cards: [
          {
            term: "P/E Ratio",
            description: "Price-to-Earnings compares the stock price with earnings per share. It helps judge how much investors are paying for current earnings.",
          },
          {
            term: "Return on Equity",
            description: "ROE shows how efficiently a company uses shareholder capital to generate profit.",
          },
          {
            term: "Operating Margin",
            description: "Operating margin shows how much profit a company keeps from operations before interest and tax.",
          },
          {
            term: "Free Cash Flow",
            description: "Free cash flow is cash left after operating costs and capital spending. Strong cash flow improves resilience.",
          },
        ],
        quiz: [
          {
            question: "What does a healthy ROE often suggest?",
            answer: "The company is using shareholder capital efficiently.",
          },
          {
            question: "Why is free cash flow important?",
            answer: "It shows the business has usable cash after running and reinvesting in operations.",
          },
        ],
      },
      expert: {
        visual: [
          { label: "Moat", value: 78, className: "savings" },
          { label: "Capital Cycle", value: 52, className: "essentials" },
          { label: "Risk", value: 28, className: "flexible" },
        ],
        cards: [
          {
            term: "Capital Allocation",
            description: "Expert-level analysis asks how management reinvests profits: into growth, debt reduction, dividends, or buybacks.",
          },
          {
            term: "Economic Moat",
            description: "A moat is the company’s long-term competitive advantage that protects it from rivals.",
          },
          {
            term: "Cycle Awareness",
            description: "Experts study whether an industry is in expansion, peak, slowdown, or recovery before trusting earnings quality.",
          },
          {
            term: "Scenario Analysis",
            description: "Instead of one forecast, expert investors test bullish, base, and bearish outcomes before deciding position size.",
          },
        ],
        quiz: [
          {
            question: "What is the purpose of scenario analysis?",
            answer: "To test multiple future outcomes instead of relying on one perfect forecast.",
          },
          {
            question: "Why does capital allocation matter?",
            answer: "Because management decisions on profits can shape long-term shareholder returns.",
          },
        ],
      },
    },
  },
  technical: {
    title: "Technical Analysis",
    description:
      "Technical learning teaches users how price, volume, trend, and market behaviour create trading signals and risk-management frameworks.",
    levels: {
      beginner: {
        visual: [
          { label: "Trend", value: 75, className: "essentials" },
          { label: "Volume", value: 60, className: "savings" },
          { label: "Noise", value: 40, className: "flexible" },
        ],
        cards: [
          {
            term: "Trend",
            description: "A trend is the general direction of price. It can be upward, downward, or sideways.",
          },
          {
            term: "Support and Resistance",
            description: "Support is an area where buyers often step in. Resistance is an area where sellers often appear.",
          },
          {
            term: "Volume",
            description: "Volume shows how much trading activity is happening. Big moves with strong volume often matter more.",
          },
          {
            term: "Candles",
            description: "Candlestick charts show open, high, low, and close for a time period and help visualize market mood.",
          },
        ],
        quiz: [
          {
            question: "What does resistance usually mean?",
            answer: "A price area where selling pressure may appear.",
          },
          {
            question: "Why is volume important?",
            answer: "It helps judge whether a price move has strong participation behind it.",
          },
        ],
      },
      intermediate: {
        visual: [
          { label: "Momentum", value: 68, className: "savings" },
          { label: "Structure", value: 62, className: "essentials" },
          { label: "False Breaks", value: 32, className: "flexible" },
        ],
        cards: [
          {
            term: "Moving Averages",
            description: "Moving averages smooth price data and help identify direction and trend shifts.",
          },
          {
            term: "RSI",
            description: "Relative Strength Index measures momentum and can hint at overbought or oversold conditions.",
          },
          {
            term: "Breakout",
            description: "A breakout happens when price pushes above resistance or below support with conviction.",
          },
          {
            term: "Risk-Reward",
            description: "Intermediate technical traders focus not just on entries, but on whether the possible reward justifies the risk.",
          },
        ],
        quiz: [
          {
            question: "What does RSI primarily measure?",
            answer: "Momentum.",
          },
          {
            question: "Why is risk-reward important?",
            answer: "Because a trade should make sense even if not every setup wins.",
          },
        ],
      },
      expert: {
        visual: [
          { label: "Structure", value: 74, className: "essentials" },
          { label: "Execution", value: 66, className: "savings" },
          { label: "Emotion", value: 24, className: "flexible" },
        ],
        cards: [
          {
            term: "Market Structure",
            description: "Expert traders study swing highs, swing lows, consolidation zones, and order flow behaviour before acting.",
          },
          {
            term: "Multi-Timeframe Analysis",
            description: "Experts align the larger trend with lower-timeframe setups to reduce poor-quality trades.",
          },
          {
            term: "Position Sizing",
            description: "Technical skill without position sizing discipline can still destroy capital. Experts control size before they chase returns.",
          },
          {
            term: "Trade Journaling",
            description: "An expert workflow includes recording setup, risk, execution, and mistakes so edge can be improved over time.",
          },
        ],
        quiz: [
          {
            question: "Why use multi-timeframe analysis?",
            answer: "To align short-term setups with broader market direction.",
          },
          {
            question: "What protects capital more: prediction or position sizing?",
            answer: "Position sizing discipline.",
          },
        ],
      },
    },
  },
  "stock-market": {
    title: "Stock Market Path",
    description:
      "This track explains how the stock market works from first principles, then builds into workflows, participants, institutions, and advanced market behaviour.",
    levels: {
      beginner: {
        visual: [
          { label: "Company", value: 78, className: "essentials" },
          { label: "Exchange", value: 60, className: "savings" },
          { label: "Investor", value: 55, className: "flexible" },
        ],
        cards: [
          {
            term: "What is the stock market?",
            description: "The stock market is a place where shares of listed companies are bought and sold through exchanges.",
          },
          {
            term: "What is an exchange?",
            description: "An exchange like NSE or BSE is the marketplace infrastructure where trading happens.",
          },
          {
            term: "Who are the participants?",
            description: "Retail investors, institutions, brokers, market makers, regulators, and listed companies all play a role.",
          },
          {
            term: "Basic workflow",
            description: "A company lists shares, investors place buy or sell orders through brokers, and the exchange matches those orders.",
          },
        ],
        quiz: [
          {
            question: "What is the role of an exchange?",
            answer: "It provides the marketplace where buy and sell orders are matched.",
          },
          {
            question: "Does buying a stock mean lending money or owning part of a company?",
            answer: "Owning part of a company.",
          },
        ],
      },
      intermediate: {
        visual: [
          { label: "Price Discovery", value: 70, className: "savings" },
          { label: "Liquidity", value: 58, className: "essentials" },
          { label: "Volatility", value: 42, className: "flexible" },
        ],
        cards: [
          {
            term: "Price discovery",
            description: "Prices move because buyers and sellers continuously negotiate value through orders and volume.",
          },
          {
            term: "Primary vs Secondary Market",
            description: "The primary market is where securities are first issued, such as an IPO. The secondary market is where investors trade them afterward.",
          },
          {
            term: "Liquidity",
            description: "Liquidity describes how easily a stock can be bought or sold without causing a big price change.",
          },
          {
            term: "Market cycles",
            description: "Bull markets, corrections, panic phases, and recoveries shape how investors behave across time.",
          },
        ],
        quiz: [
          {
            question: "What happens in the secondary market?",
            answer: "Investors trade already-listed securities with each other.",
          },
          {
            question: "Why does liquidity matter?",
            answer: "Because easier trading usually means lower friction and better execution.",
          },
        ],
      },
      expert: {
        visual: [
          { label: "Institutions", value: 76, className: "essentials" },
          { label: "Flows", value: 63, className: "savings" },
          { label: "Friction", value: 28, className: "flexible" },
        ],
        cards: [
          {
            term: "Institutional flows",
            description: "At expert level, market moves are often studied through institutional positioning, fund flows, and macro catalysts.",
          },
          {
            term: "Microstructure",
            description: "Microstructure looks at how bid-ask spreads, order books, market depth, and execution mechanics affect price behaviour.",
          },
          {
            term: "Derivatives impact",
            description: "Futures and options can influence spot markets through hedging, positioning, and expiry-related behaviour.",
          },
          {
            term: "Regulation and trust",
            description: "A mature understanding of markets includes how regulation, surveillance, disclosure rules, and governance protect or distort confidence.",
          },
        ],
        quiz: [
          {
            question: "What does market microstructure study?",
            answer: "The mechanics of order flow, spreads, depth, and execution.",
          },
          {
            question: "Why do institutional flows matter?",
            answer: "Because large capital movement can influence trend strength and market behaviour.",
          },
        ],
      },
    },
  },
};

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

function renderLearning() {
  const track = learningData[trackSelect.value];
  const level = track.levels[levelSelect.value];

  learningTitle.textContent = `${track.title} | ${levelSelect.value.charAt(0).toUpperCase()}${levelSelect.value.slice(1)} Level`;
  learningDescription.textContent = track.description;

  learningVisual.innerHTML = level.visual
    .map(
      (item) => `
        <div class="cashflow-row">
          <div class="cashflow-meta">
            <span>${item.label}</span>
            <span>${item.value}% focus</span>
          </div>
          <div class="cashflow-bar-track">
            <div class="cashflow-bar-fill ${item.className}" style="width: ${item.value}%"></div>
          </div>
        </div>
      `
    )
    .join("");

  learningCards.innerHTML = level.cards
    .map(
      (card) => `
        <article class="insight-item">
          <strong>${card.term}</strong>
          <span>${card.description}</span>
        </article>
      `
    )
    .join("");

  quizSection.innerHTML = level.quiz
    .map(
      (quiz) => `
        <article class="glass-panel quiz-card">
          <h3>${quiz.question}</h3>
          <p>${quiz.answer}</p>
        </article>
      `
    )
    .join("");
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

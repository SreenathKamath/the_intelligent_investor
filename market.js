const portfolioPlaybook = [
  { title: "Build a core and satellite structure", copy: "Many strong modern portfolios keep 70% to 90% in broad diversified funds and reserve only a smaller satellite sleeve for tactical ideas or sectors." },
  { title: "Control concentration risk", copy: "A practical beginner rule is to keep a single stock below 10% and any one sector below 25% of the portfolio." },
  { title: "Rebalance with discipline", copy: "Review allocation every 6 to 12 months. Rebalancing is a risk-control habit, not a prediction game." },
  { title: "Increase SIPs as income rises", copy: "A 10% to 15% annual SIP step-up often matters more than trying to time every market dip." },
];

const marketState = { activeRange: "1mo", activeSymbol: "^NSEI", indices: [] };

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

function formatPercent(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function pathFromSeries(series, width, height) {
  const validSeries = series.filter((value) => Number.isFinite(value));
  if (validSeries.length < 2) return { linePath: "", areaPath: "", gridPath: "" };
  const min = Math.min(...validSeries);
  const max = Math.max(...validSeries);
  const range = max - min || 1;
  const points = validSeries.map((value, index) => {
    const x = (index / (validSeries.length - 1)) * width;
    const normalized = (value - min) / range;
    const y = height - normalized * (height - 16) - 8;
    return [x, y];
  });
  const linePath = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const gridPath = [0.25, 0.5, 0.75].map((part) => `M 0 ${(height * part).toFixed(2)} L ${width} ${(height * part).toFixed(2)}`).join(" ");
  return { linePath, areaPath, gridPath };
}

function renderMarketNews(items = []) {
  const newsList = document.getElementById("news-list");
  if (!newsList) return;
  const safeItems = items.length ? items : [{ source: "Market feed unavailable", title: "Live news could not be loaded right now", summary: "The backend is ready to consume free market and news sources, but the current fetch did not succeed.", publishedAt: "", link: "" }];
  newsList.innerHTML = safeItems.slice(0, 6).map((item) => `<article class="news-item"><div class="news-meta">${item.source}${item.publishedAt ? ` | ${item.publishedAt}` : ""}</div><h4>${item.title}</h4><p>${item.summary || "Open the source article for the full update."}</p>${item.link ? `<a class="trend flat" href="${item.link}" target="_blank" rel="noreferrer">Open Source</a>` : ""}</article>`).join("");
}

function renderPortfolioPlaybook() {
  const portfolioPlaybookElement = document.getElementById("portfolio-playbook");
  if (!portfolioPlaybookElement) return;
  portfolioPlaybookElement.innerHTML = portfolioPlaybook.map((item) => `<article class="playbook-card"><h4>${item.title}</h4><p>${item.copy}</p></article>`).join("");
}

function renderSectorInsights(sectors = []) {
  const sectorGrid = document.getElementById("sector-grid");
  if (!sectorGrid) return;
  if (!sectors.length) {
    sectorGrid.innerHTML = `<article class="sector-card"><h4>Sector data unavailable</h4><p>Live sector insight data could not be loaded right now.</p><span class="trend flat">Retry later</span></article>`;
    return;
  }

  sectorGrid.innerHTML = sectors.slice(0, 5).map((sector) => {
    const trend = sector.changePercent > 0.5 ? "up" : sector.changePercent < -0.5 ? "down" : "flat";
    const narrative = trend === "up"
      ? "Momentum is positive right now. A diversified approach still matters more than chasing one move."
      : trend === "down"
        ? "The sector is under pressure right now. Watch quality and valuation before reacting emotionally."
        : "The sector is moving in a more selective range. Focus on quality leadership rather than broad assumptions.";
    return `<article class="sector-card"><div class="sector-meta">${sector.symbol} | ${formatPercent(sector.changePercent)}</div><h4>${sector.name}</h4><p>${sector.description} ${narrative}</p><span class="trend ${trend}">${trend === "up" ? "Constructive" : trend === "down" ? "Cyclical Risk" : "Selective"}</span></article>`;
  }).join("");
}

function renderHeroTicker(indices) {
  const heroTicker = document.getElementById("hero-ticker");
  if (!heroTicker || !indices.length) return;
  const first = indices[0];
  const second = indices[1] || indices[0];
  heroTicker.innerHTML = `<span>${first.name} <strong>${formatNumber(first.price)}</strong></span><span class="${first.changePercent >= 0 ? "profit" : "loss"}">${formatPercent(first.changePercent)}</span><span>${second.name} <strong>${formatNumber(second.price)}</strong></span><span class="${second.changePercent >= 0 ? "profit" : "loss"}">${formatPercent(second.changePercent)}</span>`;
}

function renderSelectedChart() {
  const active = marketState.indices.find((item) => item.symbol === marketState.activeSymbol);
  if (!active) return;
  const mainChart = pathFromSeries(active.series, 900, 320);
  const heroChart = pathFromSeries(active.series, 800, 360);
  const marketLine = document.getElementById("market-line");
  const marketArea = document.getElementById("market-area");
  const marketGridPath = document.getElementById("market-grid-path");
  const heroLinePath = document.getElementById("hero-line-path");
  const heroAreaPath = document.getElementById("hero-area-path");
  const chartCaption = document.getElementById("chart-caption");

  if (marketLine && marketArea && marketGridPath) {
    marketLine.setAttribute("d", mainChart.linePath);
    marketArea.setAttribute("d", mainChart.areaPath);
    marketGridPath.setAttribute("d", mainChart.gridPath);
  }
  if (heroLinePath && heroAreaPath) {
    heroLinePath.setAttribute("d", heroChart.linePath);
    heroAreaPath.setAttribute("d", heroChart.areaPath);
  }
  if (chartCaption) {
    chartCaption.textContent = `${active.name} | ${active.rangeLabel} | Last updated ${active.updatedAt}`;
  }
}

function renderLiveIndices(indices) {
  const liveIndexGrid = document.getElementById("live-index-grid");
  marketState.indices = indices;
  renderHeroTicker(indices);
  if (liveIndexGrid) {
    liveIndexGrid.innerHTML = indices.map((item) => `<article class="live-index-card ${item.symbol === marketState.activeSymbol ? "active" : ""}"><button type="button" data-symbol="${item.symbol}"><span>${item.name}</span><h4>${formatNumber(item.price)}</h4><p>${formatPercent(item.changePercent)} | ${item.rangeLabel}</p></button></article>`).join("");
    document.querySelectorAll("[data-symbol]").forEach((button) => {
      button.addEventListener("click", () => {
        marketState.activeSymbol = button.dataset.symbol;
        renderLiveIndices(marketState.indices);
        renderSelectedChart();
      });
    });
  }
  renderSelectedChart();
}

async function loadMarketData(range = marketState.activeRange) {
  marketState.activeRange = range;
  try {
    const response = await fetch(`/api/market/indices?range=${encodeURIComponent(range)}`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Market data request failed");
    renderLiveIndices(payload.indices || []);
  } catch (error) {
    const chartCaption = document.getElementById("chart-caption");
    if (chartCaption) chartCaption.textContent = "Live market data could not be loaded right now.";
  }
}

async function loadNews() {
  try {
    const response = await fetch("/api/market/news");
    const payload = await response.json();
    renderMarketNews(payload.items || []);
  } catch (error) {
    renderMarketNews([]);
  }
}

async function loadDynamicSectors() {
  try {
    const response = await fetch("/api/screener/sectors");
    const payload = await response.json();
    renderSectorInsights(payload.sectors || []);
  } catch (error) {
    renderSectorInsights([]);
  }
}

const rangeButtons = [...document.querySelectorAll(".range-btn")];
rangeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rangeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    loadMarketData(button.dataset.range);
  });
});

if (document.getElementById("live-index-grid") || document.getElementById("hero-ticker")) {
  loadMarketData();
  setInterval(() => loadMarketData(marketState.activeRange), 1000 * 60 * 10);
}

if (document.getElementById("news-list")) {
  loadNews();
  setInterval(loadNews, 1000 * 60 * 20);
}

renderPortfolioPlaybook();
loadDynamicSectors();

const screenerState = {
  activeSector: "banking",
  range: "1mo",
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "n/a";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function pathFromSeries(series, width, height) {
  const validSeries = series.filter((value) => Number.isFinite(value));
  if (validSeries.length < 2) return { linePath: "", areaPath: "", gridPath: "" };
  const min = Math.min(...validSeries);
  const max = Math.max(...validSeries);
  const range = max - min || 1;
  const points = validSeries.map((value, index) => {
    const x = (index / (validSeries.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 16) - 8;
    return [x, y];
  });
  const linePath = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const gridPath = [0.25, 0.5, 0.75].map((part) => `M 0 ${(height * part).toFixed(2)} L ${width} ${(height * part).toFixed(2)}`).join(" ");
  return { linePath, areaPath, gridPath };
}

async function loadSectorList() {
  const response = await fetch("/api/screener/sectors");
  const payload = await response.json();
  return payload.sectors || [];
}

function renderSectorList(sectors) {
  const sectorList = document.getElementById("sectorList");
  sectorList.innerHTML = sectors
    .map(
      (sector) => `
        <button class="sector-item ${sector.key === screenerState.activeSector ? "active" : ""}" type="button" data-sector="${sector.key}">
          <span>${sector.name}</span>
          <strong>${formatNumber(sector.price)}</strong>
          <small>${formatPercent(sector.changePercent)}</small>
        </button>
      `
    )
    .join("");

  document.querySelectorAll("[data-sector]").forEach((button) => {
    button.addEventListener("click", () => {
      screenerState.activeSector = button.dataset.sector;
      loadSectorDetail();
    });
  });
}

function renderSectorDetail(payload) {
  document.getElementById("sectorTitle").textContent = payload.sector.name;
  document.getElementById("sectorDescription").textContent = payload.sector.description;

  document.getElementById("sectorMetrics").innerHTML = `
    <article class="live-index-card active">
      <span>Sector Index</span>
      <h4>${formatNumber(payload.sector.price)}</h4>
      <p>${formatPercent(payload.sector.changePercent)} | ${payload.sector.symbol}</p>
    </article>
    <article class="live-index-card">
      <span>Top Weight</span>
      <h4>${payload.stocks[0]?.shortName || "n/a"}</h4>
      <p>${payload.stocks[0]?.weight || "n/a"}% sector weight</p>
    </article>
    <article class="live-index-card">
      <span>Coverage</span>
      <h4>${payload.stocks.length} Stocks</h4>
      <p>Top weighted names in this sector</p>
    </article>
  `;

  const chart = pathFromSeries(payload.sector.series || [], 900, 320);
  document.getElementById("sectorLinePath").setAttribute("d", chart.linePath);
  document.getElementById("sectorArea").setAttribute("d", chart.areaPath);
  document.getElementById("sectorGridPath").setAttribute("d", chart.gridPath);
  document.getElementById("sectorCaption").textContent = `${payload.sector.name} | ${payload.sector.rangeLabel} | Last updated ${payload.sector.updatedAt}`;

  document.getElementById("stockTable").innerHTML = payload.stocks
    .map(
      (stock) => `
        <article class="stock-row">
          <div>
            <strong>${stock.shortName}</strong>
            <div class="lane-meta">${stock.symbol} | Weight ${stock.weight}%</div>
          </div>
          <div>${formatCurrency(stock.price)}</div>
          <div>${formatPercent(stock.changePercent)}</div>
          <div>P/E ${stock.trailingPE ?? "n/a"}</div>
          <div>52W ${stock.fiftyTwoWeekLow ?? "n/a"} - ${stock.fiftyTwoWeekHigh ?? "n/a"}</div>
          <button class="btn btn-secondary stock-open-btn" type="button" data-symbol-open="${stock.symbol}">View</button>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-symbol-open]").forEach((button) => {
    button.addEventListener("click", () => loadStockDetail(button.dataset.symbolOpen));
  });
}

async function loadSectorDetail() {
  const [sectorsResponse, sectorDetailResponse] = await Promise.all([
    loadSectorList(),
    fetch(`/api/screener/sector?key=${encodeURIComponent(screenerState.activeSector)}`).then((r) => r.json()),
  ]);
  renderSectorList(sectorsResponse);
  renderSectorDetail(sectorDetailResponse);
}

function renderStockDetail(detail, warning = "") {
  const target = document.getElementById("stockDetail");
  if (!detail) {
    target.innerHTML = `<div class="insight-item"><strong>No stock details available</strong><span>Try another symbol or search term.</span></div>`;
    return;
  }

  target.innerHTML = `
    <div class="insight-item">
      <strong>${detail.shortName} (${detail.symbol})</strong>
      <span>${detail.businessSummary || "Business summary not available."}</span>
    </div>
    <div class="insight-item">
      <strong>Business Snapshot</strong>
      <span>Sector: ${detail.sector || "n/a"} | Industry: ${detail.industry || "n/a"} | Market Cap: ${detail.marketCap || "n/a"}</span>
    </div>
    <div class="insight-item">
      <strong>Price & Valuation</strong>
      <span>Current price: ${detail.currentPrice || "n/a"} | P/E: ${detail.trailingPE || "n/a"} | Dividend Yield: ${detail.dividendYield || "n/a"}</span>
    </div>
    <div class="insight-item">
      <strong>Technical Snapshot</strong>
      <span>52-week range: ${detail.fiftyTwoWeekLow || "n/a"} to ${detail.fiftyTwoWeekHigh || "n/a"} | 50D average: ${detail.fiftyDayAverage || "n/a"} | 200D average: ${detail.twoHundredDayAverage || "n/a"}</span>
    </div>
    <div class="insight-item">
      <strong>Workflow idea</strong>
      <span>Start with business quality, then check valuation, then compare price trend with the 50-day and 200-day averages before making a conviction decision.</span>
    </div>
    ${warning ? `<div class="insight-item"><strong>Source note</strong><span>${warning}</span></div>` : ""}
  `;
}

async function loadStockDetail(symbol) {
  const response = await fetch(`/api/screener/stock?symbol=${encodeURIComponent(symbol)}`);
  const payload = await response.json();
  const feedback = document.getElementById("searchFeedback");
  if (feedback) {
    feedback.innerHTML = `Showing Indian market result for <strong>${payload.detail?.symbol || symbol}</strong>.`;
  }
  renderStockDetail(payload.detail, payload.warning || "");
}

async function searchStock() {
  const query = document.getElementById("stockSearchInput").value.trim();
  if (!query) return;
  const response = await fetch(`/api/screener/search?q=${encodeURIComponent(query)}`);
  const payload = await response.json();
  const feedback = document.getElementById("searchFeedback");
  if (feedback) {
    if (payload.bestMatch?.symbol) {
      const alternates = (payload.matches || [])
        .map((item) => item.symbol)
        .filter((symbol) => symbol !== payload.bestMatch.symbol)
        .slice(0, 3);

      feedback.innerHTML = `
        Resolved to Indian symbol <strong>${payload.bestMatch.symbol}</strong>${payload.bestMatch.exchange ? ` on ${payload.bestMatch.exchange}` : ""}.
        ${alternates.length ? `Other India matches: ${alternates.join(", ")}.` : ""}
      `;
    } else {
      feedback.innerHTML = "No Indian market match was found for that search.";
    }
  }
  if (payload.bestMatch?.symbol) {
    loadStockDetail(payload.bestMatch.symbol);
  } else {
    renderStockDetail(null);
  }
}

document.getElementById("stockSearchButton").addEventListener("click", searchStock);
document.getElementById("stockSearchInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchStock();
  }
});

loadSectorDetail();

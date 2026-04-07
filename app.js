function loadScript(path) {
  const script = document.createElement("script");
  script.src = path;
  document.body.appendChild(script);
}

const page = document.body.dataset.page;

if (page === "planner") {
  loadScript("./planner.js");
}

if (page === "market" || page === "home") {
  loadScript("./market.js");
}

if (page === "planner" || page === "market") {
  loadScript("./knowledge.js");
}

if (page === "learning") {
  loadScript("./learning.js");
}

if (page === "screener") {
  loadScript("./screener.js");
}

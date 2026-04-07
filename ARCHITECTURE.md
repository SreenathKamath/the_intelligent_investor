# Intelligent Investor Architecture

## Frontend structure

- `index.html`: upgraded product surface with focused navigation into planning, markets, learning, and founder trust layers.
- `planner.html`: dedicated financial planning and calculator workflow.
- `market.html`: dedicated market analysis and intelligence workflow.
- `learning.html`: dedicated structured education workflow for fundamentals, technical analysis, stock market foundations, and quizzes.
- `founder.html`: trust-focused founder and platform mission page.
- `styles.css`: futuristic fintech visual system with glassmorphism panels, responsive dashboard grids, chart shells, and richer information density.
- `app.js`: lightweight page loader that activates only the scripts needed for the current route.
- `planner.js`: multi-ratio financial engine, goal projections, and allocation guidance.
- `market.js`: live market chart rendering, sector intelligence, and news surfaces.
- `knowledge.js`: book-based knowledge hub interactions.
- `learning.js`: level-based learning tracks, concept cards, visual explainers, and quizzes.
- `server.js`: static file server plus API proxy endpoints for live indices and market news.

## Suggested component breakdown for a production app

- `HeroSection`: headline, trust messaging, founder identity, primary CTAs.
- `BudgetPlanner`: form inputs, rule engine, budget split cards.
- `AllocationGuide`: age-based model, charts, investment suggestions.
- `RiskEngine`: emergency fund status, runway, affordability warnings.
- `MarketNewsDashboard`: India/global news feed cards with refresh logic.
- `SectorInsights`: sector performance summaries and trend states.
- `IndexAnalysis`: Nifty 50, Sensex, Bank Nifty signal cards.
- `ProjectionStudio`: long-term compounding and what-if scenario simulator.
- `KnowledgeHub`: book listing and detail surface.
- `FounderSection`: mission, trust signals, certifications, long-term vision.

## Backend architecture suggestion

### Recommended services

- `api-gateway`: single entry point for frontend requests, authentication, rate limits, and versioning.
- `market-data-service`: fetches index, sector, and quote data from external market APIs, normalizes time-series payloads, and exposes frontend-safe chart data.
- `news-intelligence-service`: aggregates Indian and global financial news, deduplicates sources, tags sentiment, and maintains a cache of fresh headlines.
- `planning-engine`: computes budget splits, EMI thresholds, emergency fund targets, and scenario analysis.
- `recommendation-engine`: creates age-based allocation, beginner tips, risk-profile guidance, bucket-level investment suggestions, and goal funding diagnostics.
- `cache-layer`: Redis or in-memory cache for market snapshots and news responses.
- `scheduler`: cron jobs for daily sync, sector summaries, and stale data cleanup.

### Suggested stack

- Frontend: React or Next.js for component-driven UI and future auth/dashboard expansion.
- Backend: Node.js with Express, Fastify, or NestJS for modular service layers.
- Data store: PostgreSQL for users, preferences, and saved plans.
- Cache: Redis for short-lived market/news responses.
- Jobs: BullMQ or lightweight cron workers.
- Deployment: Vercel or Netlify for frontend, Render/Railway/AWS for backend services.

## API integration flow

1. Frontend requests `/api/market/indices?range=1mo` and `/api/market/news`.
2. API layer checks cache for market time series and news feed freshness.
3. On cache miss, market data is fetched from Yahoo Finance-compatible chart endpoints and news is fetched from free RSS-based sources.
4. Responses are normalized into a consistent schema for cards, charts, and badges.
5. Planning screens call `planning-engine` and `recommendation-engine` with user financial inputs.
6. The UI combines live market context with user-specific planning outputs in one surface.

## Example route design

```txt
GET  /api/market/indices?range=1mo
GET  /api/market/news
GET  /api/sectors
POST /api/planner/budget
POST /api/planner/projection
POST /api/recommendations/profile
```

## Example external data sources

- Yahoo Finance chart endpoints for broad market index time series via backend proxying.
- Google News RSS search feeds for free headline aggregation.
- Alpha Vantage or Finnhub as optional next upgrades when API keys are available.
- Financial Modeling Prep for additional market breadth and company-level data where coverage fits the product.

## Error handling and resilience

- Cache the last successful market and news payloads.
- Return `dataStatus: "stale"` when external APIs fail but cached data exists.
- Apply per-provider timeouts and circuit breakers.
- Store provider-specific transformers so one API schema change does not break the whole platform.
- Log fetch failures with retry counters and alert thresholds.

## Personalization roadmap

- Saved user profiles for age, income, dependents, goals, and risk tolerance.
- Personalized dashboards with beginner, planner, and investor modes.
- AI copilot for finance queries, watchlist explanations, scenario reasoning, and beginner walkthroughs.
- Voice assistant and portfolio tracker as later premium modules.

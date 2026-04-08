# Intelligent Investor

Intelligent Investor is a multi-page financial platform built for budgeting, market research, financial education, Indian stock screening, and AI-assisted guidance.

It is designed to feel like a trusted financial companion for three user groups:
- beginners who want to understand money clearly
- intermediate users who want structure, projections, and better decisions
- advanced investors who want research surfaces, sector context, and faster screening workflows

## Product Areas

- `index.html`: landing page and main product entry
- `planner.html`: budgeting engine, ratios, goal projections, allocation guidance, and AI budgeting summary
- `market.html`: live market intelligence, indices, news, and sector snapshots
- `learning.html`: fundamentals, technicals, stock market education tracks, and quizzes
- `screener.html`: Indian-market screener with sector research, stock details, and AI stock analysis
- `founder.html`: founder credibility, mission, and platform vision

## Core Features

- Multi-page fintech product architecture
- Beginner-friendly budgeting engine with selectable budget rules
- Ratio explanations in plain language
- Cash-flow and allocation visuals
- Goal projection engine with SIP guidance
- Live market and news APIs
- Indian stock screener focused on sector-level discovery
- Dynamic learning content and knowledge hub integrations
- AI budgeting summary powered by OpenRouter
- AI stock summary powered by OpenRouter
- Shared `Research Analyst` chatbot available across the site

## AI Layer

The project includes three AI-powered features:

- `AI Summary` in the planner for budgeting interpretation
- `AI Stock Summary` in the screener for business, technical, and risk framing
- `Research Analyst` chatbot across all pages for interactive finance questions

### AI Model Strategy

The app uses OpenRouter with the default model route:

- `OPENROUTER_MODEL=openrouter/free`

This is a practical default for free-tier usage because OpenRouter can route across currently available free models instead of hardcoding a model that may disappear.

## Security And Secrets

Secrets are handled server-side only.

Safe practices already set up in this repo:
- `.env` is ignored by git
- `.env.local` is ignored by git
- OpenRouter keys are read only on the backend
- the frontend never stores or exposes your API key directly

Important:
- never paste your real API key into frontend files
- never commit your real `.env`
- for Vercel, add environment variables in the Vercel dashboard instead of storing production secrets in Git

## Environment Variables

Create a local `.env` in the project root, based on `.env.example`.

Required for AI features:
- `OPENROUTER_API_KEY`

Optional:
- `OPENROUTER_MODEL=openrouter/free`
- `PORT=3000`

Example:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openrouter/free
PORT=3000
```

## Local Development

Run in PowerShell:

```powershell
cd "d:\Intelligent Investor"
npm run check
npm start
```

Open locally:

```txt
http://localhost:3000
```

If port `3000` is already in use:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 3000 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
npm start
```

## Scripts

- `npm start`: start the local Node server
- `npm run dev`: same local server flow
- `npm run check`: syntax-check the frontend, local server, and API route files

## API Surfaces

### Market
- `/api/market/indices`
- `/api/market/news`

### Screener
- `/api/screener/sectors`
- `/api/screener/sector`
- `/api/screener/search`
- `/api/screener/stock`

### Learning And Knowledge
- `/api/books`
- `/api/learning/content`

### AI
- `/api/ai/budget`
- `/api/ai/stock-summary`
- `/api/ai/research-analyst`

## Deployment On Vercel

This project is prepared for Vercel using file-based serverless routes inside `api/`.

### Deploy Steps

1. Push the repository to GitHub
2. Import `SreenathKamath/the_intelligent_investor` into Vercel
3. Keep default framework detection as `Other`
4. Add environment variables in Vercel Project Settings
5. Deploy

### Vercel Environment Variables

Add these in Vercel:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`

Recommended value:

```txt
openrouter/free
```

### After Deployment

Test these directly:
- `/planner.html`
- `/screener.html`
- `/api/market/indices?range=1mo`
- `/api/screener/search?q=HDFC`
- `/api/ai/research-analyst`

## Project Structure

- `server.js`: local development server
- `app.js`: shared page loader
- `chat.js`: shared floating Research Analyst bot
- `planner.js`: budgeting engine and planner AI integration
- `market.js`: market page logic
- `learning.js`: learning hub logic
- `screener.js`: screener interactions and stock AI integration
- `knowledge.js`: books and knowledge hub rendering
- `styles.css`: shared design system
- `api/_lib/data.js`: shared market/screener helpers
- `api/_lib/dynamic.js`: dynamic external data helpers
- `api/_lib/ai.js`: shared OpenRouter AI helper
- `api/ai/*.js`: AI serverless routes
- `api/market/*.js`: market serverless routes
- `api/screener/*.js`: screener serverless routes
- `api/learning/*.js`: learning content routes
- `ARCHITECTURE.md`: architecture and system design notes

## Notes

- The screener is intentionally focused on the Indian market
- Some free market data providers may occasionally return limited metadata for specific symbols
- AI features require a valid OpenRouter key in the environment
- For production reliability, always validate deployed serverless endpoints after each major API change

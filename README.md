# Intelligent Investor

Intelligent Investor is a multi-page fintech platform built for financial learning, personal planning, market intelligence, and Indian stock screening.

The product is designed to feel like a trusted financial companion:
- simple enough for beginners
- structured enough for planners
- useful enough for research-oriented investors

## Core Pages

- `index.html`: landing page and product entry point
- `planner.html`: budgeting, ratios, projections, and investment guidance
- `market.html`: live index radar, news, sector lens, and portfolio ideas
- `learning.html`: fundamentals, technicals, stock market learning tracks, and quizzes
- `screener.html`: Indian-market screener with sectors, weighted stocks, and stock search
- `founder.html`: founder profile, mission, and trust-building content

## Main Features

- Multi-page financial website architecture
- Beginner-friendly planning engine with selectable budgeting rules
- Ratio explanations and visual cash-flow guidance
- Goal projection and portfolio mix suggestions
- Live market index and news APIs
- Learning hub with beginner, intermediate, and expert content
- Indian-market screener for sector analysis and stock discovery
- Founder branding for Sreenath S Kamath

## Local Development

Run these commands in PowerShell:

```powershell
cd "d:\Intelligent Investor"
npm run check
npm start
```

Open:

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

- `npm start`: runs the local Node server
- `npm run check`: syntax-checks the JavaScript files
- `npm run dev`: same local start flow for convenience

## Deployment

This project is prepared for Vercel:

- static pages are served directly
- API endpoints are available through `api/[...route].js`
- local development still uses `server.js`

Recommended deployment flow:

1. Push this repository to GitHub
2. Import the repository into Vercel
3. Deploy with default settings

## Project Files

- `server.js`: local Node server for development
- `api/[...route].js`: Vercel serverless API entry
- `styles.css`: shared design system and layout
- `app.js`: page-level script loader
- `planner.js`: planning and calculator logic
- `market.js`: market data and news logic
- `learning.js`: learning hub content and quiz logic
- `screener.js`: screener workflows and stock detail UI
- `knowledge.js`: book/knowledge hub logic
- `ARCHITECTURE.md`: higher-level product and system design notes

## Notes

- The screener is intentionally focused on the Indian market
- Some data providers may occasionally return limited metadata for specific symbols
- The app includes fallbacks where possible so the UI remains usable

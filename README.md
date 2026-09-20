# Statistical Arbitrage

A standalone QuantCorner series in Thai on Pairs Trading, with four lessons, ten computed figures, three interactive labs, and a reproducible Python Notebook. All strategy examples use hypothetical data.

- Website: https://nutdnuy.github.io/statistical-arbitrage/
- Repository: https://github.com/nutdnuy/statistical-arbitrage
- Local project: `~/Desktop/QuantConnet Content/statistical-arbitrage`

The series was separated from Quantitative Finance Notes. Its source files, build, preview, tests and GitHub Pages deployment live in this project. Prerequisite links to the earlier book remain external.

## Run locally

Use Node.js 22 or newer and the locked dependencies.

```sh
npm ci
npm test
npm run build:pages
npm run dev
```

Open http://localhost:8765/. With that preview running, use `npm run check:site` to check the pages, controls, accessibility and offline export. Browser checks require Playwright Chromium; install it with `npx playwright install chromium` if needed.

## Contents

| Source | Lesson |
| --- | --- |
| `intro.md` | Series landing page |
| `statistical-arbitrage.md` | Long–Short positions and hedge ratios |
| `pairs-trading-cointegration.md` | Correlation, cointegration and residual spread |
| `pairs-trading-backtest.md` | Signals, fills, costs and performance |
| `pairs-trading-ml.md` | Clustering, PCA and prediction |
| `glossary.md` | Shared series terminology |

`src/pairs-trading.mjs` contains the browser calculations; `src/pairs-trading.jsx` contains the labs. `scripts/` contains the Python research, figure and Notebook generators. `data/pairs-trading-provenance.json` records source access, assumptions, corrections and migration context.

See [EDITING.md](EDITING.md) for generation and validation, [DEPLOYMENT.md](DEPLOYMENT.md) for publishing, and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for asset credits and licenses. Source PDFs, course slide images and private reference material are not distributed.

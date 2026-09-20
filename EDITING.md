# Editing the series

Edit the root Markdown lessons, `intro.md` and `glossary.md`. `_toc.yml` controls navigation; `_config.yml` controls the site title, repository, Notebook and author profile. This is a custom Node.js/Markdown builder, not Jupyter Book.

Root HTML, `app.js`, `site.js`, `search-index.js`, `build-manifest.json` and `_site/` are generated. Change their sources and rebuild. Preserve relative links within this project and use full URLs for prerequisite pages in Quantitative Finance Notes.

## Checks

```sh
npm test
npm run build:pages
npm run dev
```

The preview uses http://localhost:8765/. While it is running, execute `npm run check:site` in another terminal. The browser checks use Playwright Chromium and axe-core. Finish by reviewing the diff and running `git diff --check`.

## Python research, figures and Notebook

Use Python 3 with NumPy, SciPy, statsmodels, Matplotlib and nbformat. A project virtual environment can be prepared with:

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install numpy scipy statsmodels matplotlib nbformat
```

Regenerate changed computations and their outputs in this order:

```sh
python scripts/pairs_trading_research.py
python scripts/make_pairs_trading_figures.py
python scripts/make_pairs_trading_notebook.py
```

The research generator updates `data/pairs-ml-results.json`. The figure generator creates the ten `assets/images/pairs-*.svg` charts. The Notebook generator reads all four Markdown lessons, embeds the local figures, executes its code cells and writes `notebooks/pairs-trading.ipynb`. It also validates the research results and records source hashes. Keep personal Notebook experiments under a different filename.

After a prose-only lesson change, regenerate the Notebook so its text and source hashes match. After a formula or simulation change, regenerate all affected outputs and run the numerical and browser checks. The Python research uses a separate synthetic sample from the browser Backtest; their seeds, lengths and purpose are recorded in the provenance file.

Keep signal time separate from fill time, fit estimates on the stated training window, count both legs and trading costs, and state the return denominator. Do not present simulated performance as observed market performance. Preserve the source-access limitations and image credits in the lessons and provenance.

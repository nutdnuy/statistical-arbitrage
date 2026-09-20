# GitHub Pages deployment

- Repository: https://github.com/nutdnuy/statistical-arbitrage
- Published path: https://nutdnuy.github.io/statistical-arbitrage/
- Branch: `main`
- Workflow: **Publish book**, in `.github/workflows/pages.yml`

For initial setup, select **Settings → Pages → Source → GitHub Actions** in this repository.

A push to `main` runs the locked Node.js install, numerical tests and `npm run build:pages`, then publishes `_site/` through GitHub Pages. Pull requests run the build and checks without deploying. The workflow can also be started manually.

Before pushing, run the relevant local checks in [EDITING.md](EDITING.md). Commit the source files and maintained assets; generated root HTML/JavaScript and `_site/` are rebuilt by the workflow. Keep private source PDFs, dependencies and temporary QA files out of commits.

After pushing, verify the **Publish book** workflow and open the live landing page and changed lesson URLs. A successful local build alone does not establish that the live site has changed. This project uses its own Pages path; deployment does not require a DNS or custom-domain change.

The local preview is http://localhost:8765/ so it can run alongside the original book on port 8763.

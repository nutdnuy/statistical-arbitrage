# Sources and notices

## Runtime dependencies

React and React DOM are bundled for local use. Retained package licenses are in `vendor/`; the JavaScript build writes bundled legal notices to `app.js.LEGAL.txt`.

KaTeX 0.16.22 renders native HTML and MathML equations. Its distribution and equation fonts are in `assets/katex/`; the MIT license is retained in `vendor/katex-LICENSE.txt`.

## Fonts and search icon

Roboto, Roboto Mono and Noto Sans Thai are packaged Fontsource-based assets. Their licenses are in `assets/fonts/`. Computed SVGs embed the existing Roboto Latin font subsets for offline display.

The search icon is Tabler Icons `search`, native 24px outline and 2px stroke, from commit `6d128ed935d4546607b1e4d5d08c8b27bdbe7758`. The MIT license is retained in `vendor/tabler-LICENSE.txt`; the source SVG is `assets/icons/search.svg`. Adaptation is limited to currentColor, display sizing and decorative accessibility attributes.

## QuantCorner / Quantsera logos

`assets/images/quantcorner-horizontal-transparent-offwhite-1024.png` and `assets/images/quantsera-horizontal-transparent-offwhite-1024.png` are the owner's approved brand assets, copied unchanged. Native HTML/CSS places the separate logos on a black background. Brand rights remain with their respective owners; this project does not grant a license to reuse the marks. Source hashes and original layout provenance are retained in `data/brand-cover-provenance.json`.

## Author profile image

`assets/images/nuth-cartoon.png` is the existing editorial cartoon of Nuthdanai Wangpratham, generated with OpenAI Image Generator from the owner's supplied reference photograph for the website author profile. The source photograph is not published. The existing image is reused unchanged; source, authorization and SHA-256 are retained in `data/author-portrait-provenance.json`.

## Statistical Arbitrage / Pairs Trading — 2026-09-20

The four Thai lessons are original teaching material informed by the user-supplied 146-page module PDF, the two AlgoAddict pairs-trading articles, the public Coursera syllabus, and linked primary references. They are not a reproduction of the course. The requested Max Margenot video was identified through search metadata; no video transcript was verified. The PDF, extracted text, slide images, course videos and lab solutions are not redistributed. Access limitations and corrections to source formulas and validation terminology are recorded in `data/pairs-trading-provenance.json`. Copyright in referenced works remains with their owners.

`assets/images/pairs-nyse.jpg`: *New York Stock Exchange - Frontal - NYSE* by **www.elbpresse.de (Wikimedia Commons user Chs87)**, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:New_York_Stock_Exchange_-_Frontal_-_NYSE.jpg), licensed under [Creative Commons Attribution–ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/). The original 2000 × 1500 JPEG was downloaded unchanged on 2026-09-20; no cropping, recoloring or other image editing was performed. The image remains under CC BY-SA 4.0 and does not imply endorsement by the photographer or exchange. It shows the building exterior, not a trading floor or evidence of strategy performance. Source, dimensions and SHA-256 are recorded in `data/pairs-trading-provenance.json`; retain a visible source and license credit when displaying it.

The website and mathematical/ML figures follow the `no-image-generator` route. Computational examples are separately authored and explicitly hypothetical; no generated decorative filler or source chart image is used.

## ECB exchange-rate observations — risk chapter

`data/ecb-chf-eur-2014-2015.csv` retains the ECB API response verbatim, including metadata, for `EXR.D.CHF.EUR.SP00.A`, 1 October 2014–27 February 2015. Source: ECB statistics. Retrieved 20 September 2026. Free reuse is subject to [ESCB statistical reuse conditions](https://www.ecb.europa.eu/stats/ecb_statistics/governance_and_quality_framework/html/usage_policy.en.html) and [ECB disclaimer and copyright](https://www.ecb.europa.eu/services/using-our-site/disclaimer/html/index.en.html). Raw data and metadata are unchanged. Rate returns, EWMA forecasts and charts are separately identified as QuantCorner calculations, not ECB forecasts or executable prices. The checksum and download URL are recorded in `data/pairs-fx-policy-risk.json`.

The risk chapter paraphrases the SNB announcement of 15 January 2015, the Bank of England report on July–September 1992 and the Bank of Thailand crisis history, linking each primary source in the lesson. No source photograph, screenshot, policy PDF or course image is copied into this chapter.

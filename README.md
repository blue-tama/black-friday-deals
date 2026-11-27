# black-friday-deals

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/blue-tama/black-friday-deals/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/blue-tama/black-friday-deals/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Bargain Beacon — a Black Friday deal finder. 31 real deals from six stores (Amazon, Best Buy, Walmart, Target, Newegg, B&H Photo), each price checked on 27 November 2026 in a deals source that names the store, with an honest verdict on every deal: a new low, a strong price, or a routine sale — and the evidence for it.

## Run it

```sh
# serve app/ with any static server, then open app/index.html
python3 -m http.server --directory app 8080
```

Or open `app/index.html` through any static file server rooted at `app/`. The site needs no network: search, category/store/discount filters, sorting, per-deal detail pages and same-product comparisons all run from the deals data in `app/data.js`.

## What it does

- **31 deals, 6 stores, 12 categories** — TVs, laptops, audio, gaming, smart home and more.
- **Search** by product name, **filter** by category, store and discount (20/40/50%+), **sort** by biggest discount, biggest saving, lowest price, or best verdict.
- **An honest verdict on every deal** — "new low", "strong price" or "routine sale", with the evidence (for example, when another store sells the same product cheaper).
- **Same product, compared** — a deal page shows the product's price at every store that carries it and marks the cheapest.
- **Checked, not guessed** — each deal records its sale price, usual price, the store link, when the price was checked and the source it was read in. Prices were checked 27 November 2026.

## Deals at a glance

The deepest cuts: Beats Studio Pro at Walmart ($99, was $299), Echo Spot at Amazon ($44, was $109), Sony WH-1000XM5 at Best Buy ($169.99, was $397.99) and Beats Solo 4 at Target ($79.99, was $199.99). The most compared product is the AirPods Pro 3 — $149 at Amazon and $149.99 at Target, but $179 at Best Buy.

## Structure

- `app/index.html` — the shell (header, app mount, footer with the method note)
- `app/main.js` — hash router and the search / filter / sort controls
- `app/views.js` — HTML for the list, the deal detail page and the comparison table
- `app/data.js` — the 31 checked deals, each with store, prices, link, check time, source, verdict and evidence
- `app/style.css` — the original design (deep ink, warm amber, cream paper)
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

---

<sub>Entered on [make.fun](https://make.fun/?ref=61rbbv6y&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>

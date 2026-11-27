// HTML for each page of Bargain Beacon, built from the deal data. Every value
// is escaped before it goes into the page, so a deal's text can never break it.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: Number(n) % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const saved = (d) => d.was - d.price;
const day = (iso) => new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

const SIGNAL_LABEL = { "new low": "New low", strong: "Strong price", routine: "Routine sale" };
const SIGNAL_CLASS = { "new low": "signal-new", strong: "signal-strong", routine: "signal-routine" };

export function signalBadge(d) {
  return `<span class="signal ${SIGNAL_CLASS[d.signal]}">${SIGNAL_LABEL[d.signal]} · ${percentOff(d)}% off</span>`;
}

export function card(d) {
  return `<li class="card">
  <div class="store-row"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <div class="price-row"><span class="sale">${usd(d.price)}</span><span class="was">${usd(d.was)}</span><span class="off">${percentOff(d)}% off</span></div>
  ${signalBadge(d)}
  <p class="evidence">${escape(d.evidence)}</p>
  <span class="spacer"></span>
  <a class="store-link" href="${escape(d.url)}" rel="noopener" target="_blank">See it at ${escape(d.store)} &rarr;</a>
  <p class="checked">Checked ${day(d.checked)} · ${escape(d.source)}</p>
</li>`;
}

export function rows(shown) {
  if (shown.length === 0) {
    return `<li class="empty"><strong>No deal matches.</strong><br>Try a different search word, or clear a filter.</li>`;
  }
  return shown.map(card).join("");
}

export function stats(deals) {
  const stores = new Set(deals.map((d) => d.store)).size;
  const best = Math.max(...deals.map(percentOff));
  const newLows = deals.filter((d) => d.signal === "new low").length;
  return `<ul class="stats">
  <li><b>${deals.length}</b> deals checked</li>
  <li><b>${stores}</b> stores</li>
  <li><b>${best}%</b> biggest cut</li>
  <li><b>${newLows}</b> new lows</li>
</ul>`;
}

export function list(deals, categories, stores) {
  const catOptions = categories.map((c) => `<option value="${escape(c)}">${escape(c)}</option>`).join("");
  const storeOptions = stores.map((s) => `<option value="${escape(s)}">${escape(s)}</option>`).join("");
  return `<h1>Black Friday deals, checked today</h1>
<p class="lede">Every deal below was found and price-checked on 27 November 2026, in a deals source that names the store. The verdict on each one says whether it is really a deal — a new low, a strong price, or a routine sale — and why.</p>
${stats(deals)}
<form class="controls" id="controls" onsubmit="return false">
  <label class="grow">Search
    <input type="search" id="q" placeholder="Try “AirPods”, “TV”, “laptop”…">
  </label>
  <label>Category
    <select id="cat"><option value="">All categories</option>${catOptions}</select>
  </label>
  <label>Store
    <select id="store"><option value="">All stores</option>${storeOptions}</select>
  </label>
  <label>Discount
    <select id="minoff">
      <option value="0">Any discount</option>
      <option value="20">20% off or more</option>
      <option value="40">40% off or more</option>
      <option value="50">50% off or more</option>
    </select>
  </label>
  <label>Sort by
    <select id="sort">
      <option value="off">Biggest discount</option>
      <option value="save">Biggest saving ($)</option>
      <option value="price">Lowest price</option>
      <option value="signal">Best verdict first</option>
    </select>
  </label>
</form>
<p class="count" id="count"></p>
<ul class="deals" id="deals"></ul>`;
}

export function compareTable(d, others) {
  if (!others.length) return "";
  const rowsHtml = others
    .map((o) => {
      const best = o.price === Math.min(d.price, ...others.map((x) => x.price));
      return `<tr${best ? ' class="best"' : ""}><td>${escape(o.store)}</td><td>${usd(o.price)}</td><td>${usd(o.was)}</td><td>${percentOff(o)}% off</td><td>${best ? '<span class="tag-best">Cheapest</span>' : ""}</td></tr>`;
    })
    .join("");
  const selfBest = d.price === Math.min(d.price, ...others.map((x) => x.price));
  const selfRow = `<tr${selfBest ? ' class="best"' : ""}><td>${escape(d.store)} (this page)</td><td>${usd(d.price)}</td><td>${usd(d.was)}</td><td>${percentOff(d)}% off</td><td>${selfBest ? '<span class="tag-best">Cheapest</span>' : ""}</td></tr>`;
  return `<section class="compare">
  <h2>Same product at other stores</h2>
  <table>
    <thead><tr><th>Store</th><th>Sale price</th><th>Usual price</th><th>Discount</th><th></th></tr></thead>
    <tbody>${selfRow}${rowsHtml}</tbody>
  </table>
</section>`;
}

export function deal(d, others) {
  return `<p><a class="back" href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="store-row"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h1>${escape(d.title)}</h1>
  <div class="price-row"><span class="sale">${usd(d.price)}</span><span class="was">${usd(d.was)}</span><span class="off">${percentOff(d)}% off</span></div>
  <p class="save">You save ${usd(saved(d))} off the usual ${usd(d.was)}.</p>
  ${signalBadge(d)}
  <div class="verdict"><h2>Is it really a deal?</h2><p>${escape(d.evidence)}</p></div>
  <table class="facts">
    <tr><th>Store</th><td>${escape(d.store)}</td></tr>
    <tr><th>Category</th><td>${escape(d.category)}</td></tr>
    <tr><th>Sale price</th><td>${usd(d.price)}</td></tr>
    <tr><th>Usual price</th><td>${usd(d.was)}</td></tr>
    <tr><th>Discount</th><td>${percentOff(d)}% off (${usd(saved(d))} saved)</td></tr>
    <tr><th>Price checked</th><td>${day(d.checked)}</td></tr>
    <tr><th>Read in</th><td>${escape(d.source)}</td></tr>
  </table>
  <a class="store-link" href="${escape(d.url)}" rel="noopener" target="_blank">Find it at ${escape(d.store)} &rarr;</a>
</article>
${compareTable(d, others)}`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}

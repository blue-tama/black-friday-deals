// Bargain Beacon's router and controls. The deals live in data.js, so the site
// needs no network to show them; each deal links out to its store.
//
//   #/            the deal list, with search, filters and sorting
//   #/deal/<id>   one deal, with its verdict and a same-product comparison
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from "./data.js";
import { deal, list, missing, rows } from "./views.js";

const app = document.getElementById("app");
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const SIGNAL_RANK = { "new low": 0, strong: 1, routine: 2 };

const categories = [...new Set(deals.map((d) => d.category))].sort();
const stores = [...new Set(deals.map((d) => d.store))].sort();

function sortDeals(shown, mode) {
  const copy = [...shown];
  if (mode === "save") return copy.sort((a, b) => b.was - b.price - (a.was - a.price));
  if (mode === "price") return copy.sort((a, b) => a.price - b.price);
  if (mode === "signal") {
    return copy.sort((a, b) => SIGNAL_RANK[a.signal] - SIGNAL_RANK[b.signal] || percentOff(b) - percentOff(a));
  }
  return copy.sort((a, b) => percentOff(b) - percentOff(a));
}

function applyFilters() {
  const q = document.getElementById("q").value.trim().toLowerCase();
  const cat = document.getElementById("cat").value;
  const store = document.getElementById("store").value;
  const minoff = Number(document.getElementById("minoff").value);
  const sort = document.getElementById("sort").value;
  let shown = deals.filter((d) => {
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    if (cat && d.category !== cat) return false;
    if (store && d.store !== store) return false;
    if (percentOff(d) < minoff) return false;
    return true;
  });
  shown = sortDeals(shown, sort);
  document.getElementById("deals").innerHTML = rows(shown);
  document.getElementById("count").textContent =
    `Showing ${shown.length} of ${deals.length} deals` + (shown.length !== deals.length ? " — change a filter to see more." : ".");
}

function renderList() {
  document.title = "Bargain Beacon — Real Black Friday deals, checked today";
  app.innerHTML = list(deals, categories, stores);
  for (const id of ["q", "cat", "store", "minoff", "sort"]) {
    const el = document.getElementById(id);
    el.addEventListener("input", applyFilters);
    el.addEventListener("change", applyFilters);
  }
  applyFilters();
}

function renderDeal(id) {
  const found = deals.find((d) => d.id === decodeURIComponent(id));
  if (!found) {
    document.title = "Not found | Bargain Beacon";
    app.innerHTML = missing();
    return;
  }
  const others = found.group ? deals.filter((d) => d.group === found.group && d.id !== found.id) : [];
  document.title = `${found.title} — ${found.price} at ${found.store} | Bargain Beacon`;
  app.innerHTML = deal(found, others);
}

function render() {
  window.__shotReady = false;
  const hash = location.hash;
  if (hash === "#how") {
    renderList();
    const how = document.getElementById("how");
    if (how) how.scrollIntoView();
  } else {
    const match = hash.match(/^#\/deal\/([^/?]+)/);
    if (match) renderDeal(match[1]);
    else renderList();
    window.scrollTo(0, 0);
  }
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();

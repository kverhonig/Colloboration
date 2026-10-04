const state = {
  products: [],
  cart: [],
  lastActivity: Date.now()
};

const STORAGE_CART = "smartGroceryCart";
const STORAGE_STATS = "smartGroceryStats";
const INACTIVITY_LIMIT = 3 * 60 * 60 * 1000;

const $ = (id) => document.getElementById(id);
const money = (value) => `€${value.toFixed(2)}`;

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) throw new Error("Produktdaten konnten nicht geladen werden.");
    const data = await response.json();
    state.products = data.products || [];
    populateProductSelect();
  } catch (error) {
    // Fallback für den direkten Aufruf von index.html:
    // Manche Browser erlauben fetch() auf eine lokale JSON-Datei nicht.
    state.products = [
      {"id":"milch","name":"Milch","category":"Milchprodukte","prices":{"Billa":1.79,"Hofer":1.39,"Spar":1.69}},
      {"id":"nudeln","name":"Nudeln","category":"Grundnahrungsmittel","prices":{"Billa":1.69,"Hofer":1.29,"Spar":1.49}},
      {"id":"tomaten","name":"Tomaten","category":"Obst & Gemüse","prices":{"Billa":3.20,"Hofer":2.49,"Spar":2.89}},
      {"id":"kaese","name":"Käse","category":"Milchprodukte","prices":{"Billa":3.49,"Hofer":3.29,"Spar":2.99}},
      {"id":"aepfel","name":"Äpfel","category":"Obst & Gemüse","prices":{"Billa":2.79,"Hofer":2.49,"Spar":2.29}},
      {"id":"bananen","name":"Bananen","category":"Obst & Gemüse","prices":{"Billa":2.19,"Hofer":1.89,"Spar":1.99}},
      {"id":"brot","name":"Brot","category":"Backwaren","prices":{"Billa":2.69,"Hofer":2.39,"Spar":2.49}},
      {"id":"butter","name":"Butter","category":"Milchprodukte","prices":{"Billa":2.89,"Hofer":2.69,"Spar":2.79}},
      {"id":"reis","name":"Reis","category":"Grundnahrungsmittel","prices":{"Billa":2.29,"Hofer":1.89,"Spar":1.99}},
      {"id":"cola","name":"Cola","category":"Getränke","prices":{"Billa":2.19,"Hofer":1.99,"Spar":1.79}},
      {"id":"eier","name":"Eier","category":"Grundnahrungsmittel","prices":{"Billa":3.29,"Hofer":2.99,"Spar":3.19}},
      {"id":"joghurt","name":"Joghurt","category":"Milchprodukte","prices":{"Billa":1.49,"Hofer":1.19,"Spar":1.39}}
    ];
    populateProductSelect();
    console.warn("products.json konnte lokal nicht geladen werden; Fallback-Daten werden verwendet.");
  }
}

function populateProductSelect() {
  $("productSelect").innerHTML = '<option value="">Produkt auswählen …</option>';
  state.products.forEach(product => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} · ${product.category}`;
    $("productSelect").appendChild(option);
  });
}

function selectedProduct() {
  return state.products.find(p => p.id === $("productSelect").value);
}

function touchActivity() {
  state.lastActivity = Date.now();
  localStorage.setItem("smartGroceryLastActivity", String(state.lastActivity));
}

function restoreSession() {
  const last = Number(localStorage.getItem("smartGroceryLastActivity") || 0);
  if (last && Date.now() - last >= INACTIVITY_LIMIT) {
    localStorage.removeItem(STORAGE_CART);
    localStorage.removeItem(STORAGE_CART + "_meta");
    return;
  }
  try {
    state.cart = JSON.parse(localStorage.getItem(STORAGE_CART) || "[]");
  } catch {
    state.cart = [];
  }
}

function saveSession() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(state.cart));
  touchActivity();
}

function addProduct() {
  const product = selectedProduct();
  const quantity = Number($("quantity").value);

  if (!product) return alert("Bitte zuerst ein Produkt auswählen.");
  if (!Number.isInteger(quantity) || quantity < 1) return alert("Die Menge muss mindestens 1 sein.");
  if (state.cart.reduce((sum, item) => sum + item.quantity, 0) + quantity > 200)
    return alert("Ein Einkauf darf maximal 200 Produkte enthalten.");

  const existing = state.cart.find(item => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else state.cart.push({ id: product.id, name: product.name, category: product.category, prices: product.prices, quantity });

  saveSession();
  renderCart();
}

function addCustomProduct() {
  const name = $("customName").value.trim();
  const category = $("customCategory").value.trim() || "Sonstiges";
  const prices = {
    Billa: Number($("customBilla").value),
    Hofer: Number($("customHofer").value),
    Spar: Number($("customSpar").value)
  };

  if (!name) return alert("Bitte einen Produktnamen eingeben.");
  if (Object.values(prices).some(p => !Number.isFinite(p) || p < 0 || p > 200))
    return alert("Alle Preise müssen zwischen €0 und €200 liegen.");

  state.cart.push({
    id: "custom-" + Date.now(),
    name, category, prices, quantity: 1, custom: true
  });
  if (state.cart.reduce((sum, item) => sum + item.quantity, 0) > 200) {
    state.cart.pop();
    return alert("Ein Einkauf darf maximal 200 Produkte enthalten.");
  }
  saveSession();
  renderCart();
  ["customName","customCategory","customBilla","customHofer","customSpar"].forEach(id => $(id).value = "");
}

function removeItem(index) {
  state.cart.splice(index, 1);
  saveSession();
  renderCart();
}

function clearCart() {
  state.cart = [];
  localStorage.removeItem(STORAGE_CART);
  renderCart();
  $("resultCard").classList.add("hidden");
  touchActivity();
}

function renderCart() {
  const container = $("shoppingList");
  $("itemCount").textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (!state.cart.length) {
    $("emptyState").style.display = "block";
    container.innerHTML = "";
    return;
  }
  $("emptyState").style.display = "none";
  container.innerHTML = state.cart.map((item, index) => `
    <div class="item">
      <div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)}</small></div>
      <div><strong>${item.quantity}×</strong><small>Menge</small></div>
      <div><strong>${money(item.prices.Billa)}</strong><small>Billa</small></div>
      <div><strong>${money(Math.min(item.prices.Billa, item.prices.Hofer, item.prices.Spar))}</strong><small>günstigster Einzelpreis</small></div>
      <button class="remove" onclick="removeItem(${index})">Entfernen</button>
    </div>
  `).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
}

function discounts() {
  return {
    Billa: Math.max(0, Math.min(100, Number($("discountBilla").value) || 0)),
    Hofer: Math.max(0, Math.min(100, Number($("discountHofer").value) || 0)),
    Spar: Math.max(0, Math.min(100, Number($("discountSpar").value) || 0))
  };
}

function adjustedPrice(item, market) {
  return item.prices[market] * (1 - discounts()[market] / 100);
}

function combinationNames(maxMarkets) {
  const markets = ["Billa", "Hofer", "Spar"];
  const combinations = [];
  function build(start, chosen) {
    if (chosen.length >= 1 && chosen.length <= maxMarkets) combinations.push([...chosen]);
    if (chosen.length === maxMarkets) return;
    for (let i = start; i < markets.length; i++) build(i + 1, [...chosen, markets[i]]);
  }
  build(0, []);
  return combinations;
}

function calculateCombination(combination) {
  let total = 0;
  const allocation = [];
  state.cart.forEach(item => {
    let bestMarket = combination[0];
    let bestUnitPrice = adjustedPrice(item, bestMarket);
    for (const market of combination.slice(1)) {
      const candidate = adjustedPrice(item, market);
      if (candidate < bestUnitPrice) {
        bestUnitPrice = candidate;
        bestMarket = market;
      }
    }
    total += bestUnitPrice * item.quantity;
    allocation.push({ item, market: bestMarket, unitPrice: bestUnitPrice });
  });
  return { combination, total, allocation };
}

function calculateBest() {
  if (!state.cart.length) return alert("Bitte füge zuerst mindestens ein Produkt hinzu.");

  const combinations = combinationNames(Number($("maxMarkets").value));
  let best = null;
  combinations.forEach(combination => {
    const result = calculateCombination(combination);
    if (!best || result.total < best.total) best = result;
  });

  renderResult(best);
  savePurchase(best);
  touchActivity();
}

function renderResult(best) {
  const budget = Number($("budget").value);
  const hasBudget = Number.isFinite(budget) && budget >= 0;
  const remaining = hasBudget ? budget - best.total : null;

  $("resultCard").classList.remove("hidden");
  $("budgetStatus").className = "status " + (!hasBudget || remaining >= 0 ? "ok" : "bad");
  $("budgetStatus").textContent = !hasBudget ? "Kein Budget angegeben" :
    remaining >= 0 ? `Im Budget · ${money(remaining)} übrig` : `Budget überschritten · ${money(Math.abs(remaining))}`;

  const original = state.cart.reduce((sum, item) => {
    const cheapestWithoutDiscount = Math.min(...Object.values(item.prices));
    return sum + cheapestWithoutDiscount * item.quantity;
  }, 0);
  const savings = Math.max(0, original - best.total);
  const productCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  $("summary").innerHTML = `
    <div class="metric"><span>♡ Gesamtpreis</span><strong>${money(best.total)}</strong></div>
    <div class="metric"><span>▦ Produkte</span><strong>${productCount}</strong></div>
    <div class="metric"><span>✦ Gesparte Kosten</span><strong>${money(savings)}</strong></div>
    <div class="metric"><span>⌂ Supermärkte</span><strong>${best.combination.length}</strong></div>
  `;

  const grouped = {};
  best.allocation.forEach(row => {
    if (!grouped[row.market]) grouped[row.market] = [];
    grouped[row.market].push(row);
  });

  $("recommendation").innerHTML = `
    <div class="market-result">
      <div class="market-head">
        <span>Empfohlene Kombination: ${best.combination.join(" + ")}</span>
        <span>${money(best.total)}</span>
      </div>
      ${Object.entries(grouped).map(([market, rows]) => `
        <div class="result-row" style="font-weight:800;background:#fbfcfb;">
          <div>${market}</div><div>Produkt</div><div>Menge</div><div>Preis/Stk.</div>
        </div>
        ${rows.map(row => `
          <div class="result-row">
            <div><strong>${escapeHtml(row.item.name)}</strong><br><small>${escapeHtml(row.item.category)}</small></div>
            <div>${market}</div>
            <div>${row.item.quantity}×</div>
            <div>${money(row.unitPrice)}</div>
          </div>
        `).join("")}
      `).join("")}
    </div>
  `;
}

function getStats() {
  try { return JSON.parse(localStorage.getItem(STORAGE_STATS) || "[]"); }
  catch { return []; }
}

function savePurchase(best) {
  const history = getStats();
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  history.push({ total: best.total, count, date: new Date().toISOString() });
  localStorage.setItem(STORAGE_STATS, JSON.stringify(history.slice(-50)));
  renderStats();
}

function renderStats() {
  const history = getStats();
  if (!history.length) {
    $("stats").innerHTML = `
      <div class="stat"><strong>–</strong><span>♡ Ø Einkaufswert</span></div>
      <div class="stat"><strong>–</strong><span>▦ Ø Produkte</span></div>
      <div class="stat"><strong>0</strong><span>✦ Einkäufe</span></div>
      <div class="stat"><strong>–</strong><span>€ Gesamtausgaben</span></div>`;
    return;
  }
  const avgTotal = history.reduce((s, x) => s + x.total, 0) / history.length;
  const avgCount = history.reduce((s, x) => s + x.count, 0) / history.length;
  const total = history.reduce((s, x) => s + x.total, 0);
  $("stats").innerHTML = `
    <div class="stat"><strong>${money(avgTotal)}</strong><span>♡ Ø Einkaufswert</span></div>
    <div class="stat"><strong>${avgCount.toFixed(1)}</strong><span>▦ Ø Produkte</span></div>
    <div class="stat"><strong>${history.length}</strong><span>✦ Einkäufe</span></div>
    <div class="stat"><strong>${money(total)}</strong><span>€ Gesamtausgaben</span></div>`;
}

$("productSelect").addEventListener("change", () => {
  const product = selectedProduct();
  $("categoryPreview").value = product ? product.category : "";
  touchActivity();
});
$("addBtn").addEventListener("click", addProduct);
$("customAddBtn").addEventListener("click", addCustomProduct);
$("clearBtn").addEventListener("click", clearCart);
$("calculateBtn").addEventListener("click", calculateBest);
document.addEventListener("input", touchActivity);
document.addEventListener("click", touchActivity);

restoreSession();
renderCart();
renderStats();
loadProducts();

setInterval(() => {
  const last = Number(localStorage.getItem("smartGroceryLastActivity") || state.lastActivity);
  if (last && Date.now() - last >= INACTIVITY_LIMIT && state.cart.length) {
    state.cart = [];
    localStorage.removeItem(STORAGE_CART);
    renderCart();
    $("resultCard").classList.add("hidden");
  }
}, 60 * 1000);

/* ========== Menu page logic ========== */
(function () {
  const { Cart, Table, fmt, toast } = window.HAAJA;
  const C = window.HAAJA_CONFIG;
  const MODE_KEY = "haaja_mode_v1";
  const root = document.getElementById("menuRoot");
  const tabsEl = document.getElementById("tabs");
  const search = document.getElementById("search");
  let activeCat = (location.hash || "#all").slice(1);
  if (activeCat !== "all" && !window.HAAJA_CATEGORIES.some(c => c.id === activeCat)) activeCat = "all";

  /* ---------- order mode ---------- */
  const qs = new URLSearchParams(location.search);
  let mode = qs.get("mode") || localStorage.getItem(MODE_KEY) || (Table.get() ? "dinein" : "delivery");
  if (Table.get() && !qs.get("mode") && !localStorage.getItem(MODE_KEY)) mode = "dinein";
  const tableBox = document.getElementById("tableBox");
  const tableNum = document.getElementById("tableNum");
  const chip = document.getElementById("tableChip");

  function paintMode() {
    localStorage.setItem(MODE_KEY, mode);
    document.querySelectorAll(".mode").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
    tableBox.hidden = mode !== "dinein";
    chip.textContent = Table.get() ? "رقم " + Table.get() : "";
    if (Table.get()) tableNum.value = Table.get();
  }
  document.querySelectorAll(".mode").forEach(b => b.addEventListener("click", () => { mode = b.dataset.mode; paintMode(); }));
  document.getElementById("saveTable").addEventListener("click", () => {
    const v = parseInt(tableNum.value, 10);
    if (!v || v < 1 || v > C.tablesCount) { tableNum.classList.add("is-bad"); toast("رقم الترابيزة من 1 إلى " + C.tablesCount); return; }
    tableNum.classList.remove("is-bad"); Table.set(v); paintMode(); toast("تم تسجيل ترابيزة رقم " + v);
  });
  paintMode();

  /* ---------- tabs ---------- */
  function paintTabs() {
    const all = [{ id: "all", name: "الكل", icon: "✨" }, ...window.HAAJA_CATEGORIES];
    tabsEl.innerHTML = all.map(c => `<button class="tab ${c.id === activeCat ? "active" : ""}" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join("");
  }
  tabsEl.addEventListener("click", e => {
    const t = e.target.closest(".tab"); if (!t) return;
    activeCat = t.dataset.cat; history.replaceState(null, "", "#" + activeCat);
    paintTabs(); render(); window.scrollTo({ top: document.querySelector(".toolbar").offsetTop - 60, behavior: "smooth" });
  });

  /* ---------- render ---------- */
  function card(p) {
    const qty = (Cart.items().find(i => i.id === p.id) || {}).qty || 0;
    return `
    <div class="col-sm-6 col-lg-4 col-xl-3 reveal">
      <article class="pcard">
        <div class="pimg">${p.img ? `<img src="../assets/img/${p.img}" alt="${p.name}" style="object-position:${p.pos || "50% 50%"}" loading="lazy">` : `<span class="emoji">${p.emoji}</span>`}
          ${p.tag ? `<span class="ptag">${p.tag}</span>` : ""}</div>
        <div class="pbody"><h3>${p.name}</h3><p>${p.desc}</p>
          <div class="pfoot"><span class="price">${fmt(p.price)}</span>
            ${qty ? `<div class="qty-row"><button data-act="dec" data-id="${p.id}" aria-label="تقليل">−</button><span>${qty}</span><button data-act="inc" data-id="${p.id}" aria-label="زيادة">+</button></div>`
                  : `<button class="add" data-act="inc" data-id="${p.id}" aria-label="أضف ${p.name} للعربة"><i class="bi bi-plus-lg"></i></button>`}
          </div>
        </div>
      </article>
    </div>`;
  }
  function render(instant) {
    const q = search.value.trim();
    let html = "";
    window.HAAJA_CATEGORIES.forEach(c => {
      if (activeCat !== "all" && activeCat !== c.id) return;
      const list = window.HAAJA_PRODUCTS.filter(p => p.cat === c.id && (!q || (p.name + p.desc).includes(q)));
      if (!list.length) return;
      html += `<section class="cat-block" id="${c.id}"><h2>${c.icon} ${c.name}</h2><div class="gold-line"></div><div class="row g-4">${list.map(card).join("")}</div></section>`;
    });
    root.innerHTML = html || `<div class="empty"><i class="bi bi-emoji-frown fs-1"></i><p class="mt-2">مفيش نتائج مطابقة… جرّب كلمة تانية.</p></div>`;
    if (instant === true) root.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
    else window.HAAJA.initReveal(root);
    paintBar();
  }
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const id = b.dataset.id;
    const cur = (Cart.items().find(i => i.id === id) || {}).qty || 0;
    b.dataset.act === "inc" ? (cur ? Cart.setQty(id, cur + 1) : Cart.add(id)) : Cart.setQty(id, cur - 1);
  });
  search.addEventListener("input", () => render());
  document.addEventListener("cart:change", () => render(true));

  /* ---------- bottom cart bar ---------- */
  function paintBar() {
    const bar = document.getElementById("cartBar");
    bar.hidden = Cart.count() === 0;
    document.getElementById("barCount").textContent = Cart.count().toLocaleString("ar-EG");
    document.getElementById("barTotal").textContent = fmt(Cart.subtotal());
  }

  paintTabs(); render();
})();

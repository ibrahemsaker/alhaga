/* ========== Cart page logic ========== */
(function () {
  const { Cart, Table, fmt, byId, toast, openWhatsApp } = window.HAAJA;
  const C = window.HAAJA_CONFIG;
  const MODE_KEY = "haaja_mode_v1";
  const $ = id => document.getElementById(id);
  const form = $("orderForm");
  const typeOf = () => (form.querySelector('input[name="type"]:checked') || {}).value;

  /* ---------- saved customer details ---------- */
  const CUST_KEY = "haaja_customer_v1";
  try {
    const saved = JSON.parse(localStorage.getItem(CUST_KEY) || "{}");
    ["name", "phone", "address", "landmark"].forEach(k => { if (saved[k]) $(k).value = saved[k]; });
  } catch (e) {}

  /* ---------- initial order type ---------- */
  const initial = localStorage.getItem(MODE_KEY) || (Table.get() ? "dinein" : "delivery");
  const radio = form.querySelector(`input[name="type"][value="${initial}"]`) || form.querySelector('input[name="type"]');
  radio.checked = true;
  if (Table.get()) $("table").value = Table.get();

  /* ---------- render items ---------- */
  function renderItems() {
    const items = Cart.items();
    $("emptyState").hidden = items.length > 0;
    $("cartWrap").hidden = items.length === 0;
    $("items").innerHTML = items.map(i => {
      const p = byId(i.id);
      return `<div class="item">
        <div class="thumb">${p.img ? `<img src="../assets/img/${p.img}" alt="${p.name}" style="object-position:${p.pos || "50% 50%"}">` : p.emoji}</div>
        <div><h3>${p.name}</h3><small>${fmt(p.price)} للواحد</small></div>
        <div class="side">
          <span class="ip">${fmt(p.price * i.qty)}</span>
          <div class="qty"><button data-a="dec" data-id="${p.id}" aria-label="تقليل">−</button><span>${i.qty}</span><button data-a="inc" data-id="${p.id}" aria-label="زيادة">+</button></div>
          <button class="rm" data-a="rm" data-id="${p.id}"><i class="bi bi-x-circle"></i> حذف</button>
        </div>
      </div>`;
    }).join("");
    renderTotals();
  }
  $("items").addEventListener("click", e => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    const id = b.dataset.id, cur = (Cart.items().find(i => i.id === id) || {}).qty || 0;
    if (b.dataset.a === "inc") Cart.setQty(id, cur + 1);
    if (b.dataset.a === "dec") Cart.setQty(id, cur - 1);
    if (b.dataset.a === "rm") Cart.remove(id);
  });
  $("clearCart").addEventListener("click", () => { if (confirm("تفريغ العربة بالكامل؟")) Cart.clear(); });
  document.addEventListener("cart:change", renderItems);

  /* ---------- totals ---------- */
  function totals() {
    const sub = Cart.subtotal();
    const isDel = typeOf() === "delivery";
    const free = sub >= C.freeDeliveryFrom;
    const fee = isDel && !free ? C.deliveryFee : 0;
    return { sub, fee, total: sub + fee, isDel, free };
  }
  function renderTotals() {
    const t = totals();
    $("sSub").textContent = fmt(t.sub);
    $("sFee").textContent = !t.isDel ? "—" : (t.free ? "مجاني" : fmt(t.fee));
    $("sTotal").textContent = fmt(t.total);
    $("freeNote").textContent = t.isDel && !t.free
      ? "ضيف " + fmt(C.freeDeliveryFrom - t.sub) + " كمان وخد توصيل مجاني 🛵" : (t.isDel ? "🎉 التوصيل عليك مجاني" : "");
  }

  /* ---------- show/hide fields per type ---------- */
  function syncType() {
    const t = typeOf();
    document.querySelectorAll(".f-delivery").forEach(el => el.hidden = t !== "delivery");
    document.querySelectorAll(".f-dinein").forEach(el => el.hidden = t !== "dinein");
    document.querySelectorAll(".f-pickup").forEach(el => el.hidden = t !== "pickup");
    localStorage.setItem(MODE_KEY, t);
    renderTotals();
  }
  form.addEventListener("change", e => { if (e.target.name === "type") syncType(); });
  syncType();

  /* ---------- validation ---------- */
  function bad(el, cond) { el.classList.toggle("is-bad", cond); return cond; }
  function validate() {
    const t = typeOf();
    let err = false;
    err = bad($("name"), $("name").value.trim().length < 2) || err;
    err = bad($("phone"), !/^01[0-25]\d{8}$/.test($("phone").value.replace(/\s|-/g, ""))) || err;
    if (t === "delivery") err = bad($("address"), $("address").value.trim().length < 8) || err;
    if (t === "dinein") { const v = parseInt($("table").value, 10); err = bad($("table"), !(v >= 1 && v <= C.tablesCount)) || err; }
    return !err;
  }
  form.addEventListener("input", e => e.target.classList.remove("is-bad"));

  /* ---------- build WhatsApp message ---------- */
  function buildMessage(orderNo) {
    const t = typeOf(), tot = totals();
    const typeName = { delivery: "ديليفري 🛵", pickup: "استلام من الفرع 🛍️", dinein: "على ترابيزة 🍽️" }[t];
    const lines = [];
    lines.push("*طلب جديد من موقع الحاجة* 🟣");
    lines.push("رقم الطلب: " + orderNo);
    lines.push("────────────");
    Cart.items().forEach(i => { const p = byId(i.id); lines.push(`• ${p.name} × ${i.qty} = ${i.qty * p.price} ${C.currency}`); });
    lines.push("────────────");
    lines.push(`المجموع: ${tot.sub} ${C.currency}`);
    if (t === "delivery") lines.push(`التوصيل: ${tot.free ? "مجاني" : tot.fee + " " + C.currency}`);
    lines.push(`*الإجمالي: ${tot.total} ${C.currency}*`);
    lines.push("────────────");
    lines.push("طريقة الطلب: " + typeName);
    lines.push("الاسم: " + $("name").value.trim());
    lines.push("الموبايل: " + $("phone").value.trim());
    if (t === "delivery") {
      lines.push("العنوان: " + $("address").value.trim());
      if ($("landmark").value.trim()) lines.push("علامة مميزة: " + $("landmark").value.trim());
    }
    if (t === "dinein") lines.push("رقم الترابيزة: " + $("table").value);
    if (t === "pickup" && $("pickTime").value) lines.push("وقت الاستلام: " + $("pickTime").value);
    lines.push("الدفع: " + $("pay").value);
    if ($("notes").value.trim()) lines.push("ملاحظات: " + $("notes").value.trim());
    return lines.join("\n");
  }

  /* ---------- confirm ---------- */
  $("confirmBtn").addEventListener("click", () => {
    if (!Cart.count()) return;
    if (!validate()) {
      toast("راجع البيانات المطلوبة");
      const first = form.querySelector(".is-bad"); if (first) { first.scrollIntoView({ behavior: "smooth", block: "center" }); first.focus(); }
      return;
    }
    const orderNo = "H" + Date.now().toString().slice(-6);
    const msg = buildMessage(orderNo);
    try {
      localStorage.setItem(CUST_KEY, JSON.stringify({
        name: $("name").value.trim(), phone: $("phone").value.trim(),
        address: $("address").value.trim(), landmark: $("landmark").value.trim()
      }));
    } catch (e) {}
    $("orderNo").textContent = orderNo;
    $("reopenWa").href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(msg);
    new bootstrap.Modal($("doneModal")).show();
    openWhatsApp(msg);
    Cart.clear();
  });

  renderItems();
})();

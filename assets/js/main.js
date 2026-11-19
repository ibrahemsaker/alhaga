/* ========== الحاجة | Al Haaja — shared logic ========== */
(function () {
  const C = window.HAAJA_CONFIG;
  const ROOT = document.body.dataset.root || "./";
  const PAGE = document.body.dataset.page || "";
  const CART_KEY = "haaja_cart_v1";
  const TABLE_KEY = "haaja_table_v1";

  /* ---------- helpers ---------- */
  const fmt = n => Number(n).toLocaleString("ar-EG") + " " + C.currency;
  const byId = id => window.HAAJA_PRODUCTS.find(p => p.id === id);
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* ---------- cart API ---------- */
  const Cart = {
    items() { return read(CART_KEY, []).filter(i => byId(i.id)); },
    save(items) { write(CART_KEY, items); Cart.updateBadge(); document.dispatchEvent(new CustomEvent("cart:change")); },
    add(id, qty = 1) {
      const items = Cart.items();
      const found = items.find(i => i.id === id);
      found ? (found.qty += qty) : items.push({ id, qty });
      Cart.save(items);
      Cart.bump();
      toast("تمت إضافة «" + byId(id).name + "» للعربة");
    },
    setQty(id, qty) {
      let items = Cart.items();
      if (qty <= 0) items = items.filter(i => i.id !== id);
      else items.forEach(i => { if (i.id === id) i.qty = qty; });
      Cart.save(items);
    },
    remove(id) { Cart.save(Cart.items().filter(i => i.id !== id)); },
    clear() { Cart.save([]); },
    count() { return Cart.items().reduce((s, i) => s + i.qty, 0); },
    subtotal() { return Cart.items().reduce((s, i) => s + i.qty * byId(i.id).price, 0); },
    updateBadge() { document.querySelectorAll(".cart-count").forEach(el => el.textContent = Cart.count().toLocaleString("ar-EG")); },
    bump() { document.querySelectorAll(".cart-count").forEach(el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }); }
  };

  /* ---------- table number (from QR: ?table=5) ---------- */
  const Table = {
    get() { return read(TABLE_KEY, null); },
    set(n) { write(TABLE_KEY, n); },
    clear() { localStorage.removeItem(TABLE_KEY); }
  };
  const qs = new URLSearchParams(location.search);
  if (qs.get("table")) {
    const t = parseInt(qs.get("table"), 10);
    if (t >= 1 && t <= C.tablesCount) Table.set(t);
  }

  /* ---------- toast ---------- */
  function toast(msg) {
    let t = document.querySelector(".haaja-toast");
    if (!t) { t = document.createElement("div"); t.className = "haaja-toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- WhatsApp ---------- */
  function openWhatsApp(text) {
    const url = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  }

  /* ---------- loader ---------- */
  const loader = document.getElementById("page-loader");
  if (loader) {
    loader.innerHTML =
      '<div class="loader-wrap"><div class="loader-ring"></div><div class="loader-badge">الحاجة</div></div>' +
      '<div class="loader-text">الحاجة · كافيه ومكسرات</div><div class="loader-bar"><i></i></div>';
    const start = performance.now();
    const hide = () => setTimeout(() => loader.classList.add("hide"), Math.max(0, 900 - (performance.now() - start)));
    document.readyState === "complete" ? hide() : window.addEventListener("load", hide);
    window.addEventListener("pageshow", e => { if (e.persisted) loader.classList.add("hide"); });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || !loader) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:") || a.target === "_blank" || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    loader.classList.remove("hide");
    setTimeout(() => (location.href = a.href), 650);
  });

  /* ---------- navbar ---------- */
  const links = [
    ["home", "home/index.html", "الرئيسية"],
    ["menu", "menu/index.html", "المنيو"],
    ["reservation", "reservation/index.html", "حجز ترابيزة"],
    ["about", "about/index.html", "من نحن"]
  ];
  const navHost = document.getElementById("site-nav");
  if (navHost) {
    navHost.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-haaja" id="mainNav">
      <div class="container">
        <a class="navbar-brand brand m-0" href="${ROOT}home/index.html" aria-label="الحاجة">
          <span class="brand-badge">الحاجة</span>
          <span><span class="brand-name">الحاجة</span><small class="brand-sub">AL HAAJA · CAFE &amp; NUTS</small></span>
        </a>
        <div class="d-flex align-items-center gap-2 order-lg-3">
          <a href="${ROOT}cart/index.html" class="cart-btn" aria-label="العربة"><i class="bi bi-bag-heart-fill"></i><span class="d-none d-sm-inline">العربة</span><span class="cart-count">0</span></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="القائمة"><span class="navbar-toggler-icon"></span></button>
        </div>
        <div class="collapse navbar-collapse justify-content-center" id="navMenu">
          <ul class="navbar-nav gap-lg-1">
            ${links.map(l => `<li class="nav-item"><a class="nav-link ${PAGE === l[0] ? "active" : ""}" href="${ROOT}${l[1]}">${l[2]}</a></li>`).join("")}
          </ul>
        </div>
      </div>
    </nav>`;
    const nav = document.getElementById("mainNav");
    const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
    onScroll(); addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- footer + floating buttons ---------- */
  const footHost = document.getElementById("site-footer");
  if (footHost) {
    footHost.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="brand mb-3"><span class="brand-badge">الحاجة</span><span><span class="brand-name">الحاجة</span><small class="brand-sub">AL HAAJA · CAFE &amp; NUTS</small></span></div>
            <p class="text-secondary" style="color:var(--muted)!important">قهوة، حلويات، شوكولاتة ومكسرات طازجة… كل اللي تحتاجه في مكان واحد، وبطعم البيت.</p>
            <div class="social mt-3">
              <a href="${C.facebook}" target="_blank" rel="noopener" aria-label="فيسبوك"><i class="bi bi-facebook"></i></a>
              <a href="${C.instagram}" target="_blank" rel="noopener" aria-label="انستجرام"><i class="bi bi-instagram"></i></a>
              <a href="${C.tiktok}" target="_blank" rel="noopener" aria-label="تيك توك"><i class="bi bi-tiktok"></i></a>
              <a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener" aria-label="واتساب"><i class="bi bi-whatsapp"></i></a>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <h5>الصفحات</h5>
            <ul>${links.map(l => `<li><a href="${ROOT}${l[1]}">${l[2]}</a></li>`).join("")}<li><a href="${ROOT}cart/index.html">العربة</a></li></ul>
          </div>
          <div class="col-6 col-lg-3">
            <h5>المنيو</h5>
            <ul>${window.HAAJA_CATEGORIES.slice(0, 5).map(c => `<li><a href="${ROOT}menu/index.html#${c.id}">${c.name}</a></li>`).join("")}</ul>
          </div>
          <div class="col-lg-3">
            <h5>تواصل معنا</h5>
            <ul>
              <li><i class="bi bi-geo-alt-fill text-warning"></i> <a href="${C.mapsUrl}" target="_blank" rel="noopener">${C.address}</a></li>
              <li><i class="bi bi-telephone-fill text-warning"></i> <a href="tel:${C.phone.replace(/\s/g, "")}" dir="ltr">${C.phone}</a></li>
              <li><i class="bi bi-clock-fill text-warning"></i> ${C.hours}</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between gap-2 text-center text-md-start">
          <span>© ${new Date().getFullYear()} الحاجة كافيه ومكسرات. جميع الحقوق محفوظة.</span>
          <span>تصميم وتطوير <b>Rief Code</b></span>
        </div>
      </div>
    </footer>
    <a class="fab-wa" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener" aria-label="تواصل واتساب"><i class="bi bi-whatsapp"></i></a>
    <button class="to-top" aria-label="للأعلى"><i class="bi bi-chevron-up"></i></button>`;
    const top = footHost.querySelector(".to-top");
    addEventListener("scroll", () => top.classList.toggle("show", scrollY > 500), { passive: true });
    top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal(root = document) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    root.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
  }
  initReveal();
  Cart.updateBadge();

  window.HAAJA = { Cart, Table, fmt, byId, toast, openWhatsApp, initReveal, config: C };
})();

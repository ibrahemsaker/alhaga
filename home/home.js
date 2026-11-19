/* ========== Home page logic ========== */
(function () {
  const { Cart, Table, fmt, toast } = window.HAAJA;
  const C = window.HAAJA_CONFIG;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- sparkles ---------- */
  const sp = document.querySelector(".sparkles");
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
    s.style.animationDuration = (4 + Math.random() * 5).toFixed(1) + "s";
    sp.appendChild(s);
  }

  /* ---------- 3D ring ---------- */
  const stage = document.getElementById("stage");
  const ring = document.getElementById("ring");
  const faces = [...ring.querySelectorAll(".face")];
  const n = faces.length, step = 360 / n;
  let angle = 0, target = 0, tiltX = -6, tiltTarget = -6, radius = 300;
  let dragging = false, lastX = 0, velocity = 0, hover = false, lastMove = 0;

  function layout() {
    const w = stage.clientWidth;
    const cw = Math.max(150, Math.min(230, w * 0.34));
    const ch = cw * 1.38;
    ring.style.setProperty("--cw", cw + "px");
    ring.style.setProperty("--ch", ch + "px");
    radius = (cw / 2) / Math.tan(Math.PI / n) * 1.32;
    faces.forEach((f, i) => f.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`);
  }
  layout();
  addEventListener("resize", layout);

  function frame() {
    if (!dragging && !hover && !reduce) target -= 0.22;      // auto-rotate
    if (!dragging && Math.abs(velocity) > 0.01) { target += velocity; velocity *= 0.94; }
    angle += (target - angle) * 0.085;
    tiltX += (tiltTarget - tiltX) * 0.06;
    ring.style.transform = `translateZ(${-radius * 0.55}px) rotateX(${tiltX}deg) rotateY(${angle}deg)`;
    // dim faces at the back
    faces.forEach((f, i) => {
      let a = ((i * step + angle) % 360 + 360) % 360;
      const facing = Math.cos(a * Math.PI / 180);           // 1 = front, -1 = back
      f.style.filter = `brightness(${(0.55 + 0.45 * (facing + 1) / 2).toFixed(2)})`;
      f.style.zIndex = Math.round((facing + 1) * 50);
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // pointer drag
  stage.addEventListener("pointerdown", e => {
    dragging = true; lastX = e.clientX; velocity = 0; stage.classList.add("dragging");
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", e => {
    const r = stage.getBoundingClientRect();
    tiltTarget = -6 + ((e.clientY - r.top) / r.height - 0.5) * -14; // tilt with pointer
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    target += dx * 0.45; velocity = dx * 0.12;
  });
  const endDrag = () => { dragging = false; stage.classList.remove("dragging"); };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("mouseenter", () => hover = true);
  stage.addEventListener("mouseleave", () => { hover = false; tiltTarget = -6; });

  // arrows
  const snap = dir => { velocity = 0; target = Math.round((target + dir * step) / step) * step; };
  document.getElementById("next3d").addEventListener("click", () => snap(-1));
  document.getElementById("prev3d").addEventListener("click", () => snap(1));
  stage.setAttribute("tabindex", "0");
  stage.addEventListener("keydown", e => { if (e.key === "ArrowLeft") snap(-1); if (e.key === "ArrowRight") snap(1); });

  /* ---------- categories ---------- */
  document.getElementById("catGrid").innerHTML = window.HAAJA_CATEGORIES.map(c => `
    <div class="col-6 col-md-4 col-lg reveal"><a class="cat" href="../menu/index.html#${c.id}"><span class="em">${c.icon}</span><b>${c.name}</b></a></div>`).join("");

  /* ---------- featured products ---------- */
  const featured = window.HAAJA_PRODUCTS.filter(p => p.tag).slice(0, 8);
  const feat = document.getElementById("featured");
  feat.innerHTML = featured.map(p => `
    <div class="col-sm-6 col-lg-3 reveal">
      <article class="pcard">
        <div class="pimg">${p.img ? `<img src="../assets/img/${p.img}" alt="${p.name}" style="object-position:${p.pos || "50% 50%"}" loading="lazy">` : `<span class="emoji">${p.emoji}</span>`}
          <span class="ptag">${p.tag}</span></div>
        <div class="pbody"><h3>${p.name}</h3><p>${p.desc}</p>
          <div class="pfoot"><span class="price">${fmt(p.price)}</span><button class="add" data-id="${p.id}" aria-label="أضف ${p.name} للعربة"><i class="bi bi-plus-lg"></i></button></div>
        </div>
      </article>
    </div>`).join("");
  feat.addEventListener("click", e => { const b = e.target.closest(".add"); if (b) Cart.add(b.dataset.id); });
  window.HAAJA.initReveal();

  document.getElementById("freeFrom").textContent = fmt(C.freeDeliveryFrom);

  /* ---------- table modal ---------- */
  document.getElementById("tMax").textContent = C.tablesCount;
  const input = document.getElementById("tableInput");
  if (Table.get()) input.value = Table.get();
  document.getElementById("tableGo").addEventListener("click", () => {
    const v = parseInt(input.value, 10);
    if (!v || v < 1 || v > C.tablesCount) { input.classList.add("is-bad"); return; }
    Table.set(v);
    toast("تم تسجيل ترابيزة رقم " + v);
    setTimeout(() => (location.href = "../menu/index.html?mode=dinein"), 600);
  });
  input.addEventListener("input", () => input.classList.remove("is-bad"));
})();

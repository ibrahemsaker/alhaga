/* ========== Reservation logic ========== */
(function () {
  const { toast, openWhatsApp } = window.HAAJA;
  const C = window.HAAJA_CONFIG;
  const $ = id => document.getElementById(id);
  let picked = null;

  /* date: from today */
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  $("rDate").min = today.toISOString().slice(0, 10);
  $("rDate").value = today.toISOString().slice(0, 10);

  /* time slots every 30 min, 10:00 → 01:30 */
  const slots = [];
  for (let m = 10 * 60; m <= 25 * 60 + 30; m += 30) {
    const h = Math.floor(m / 60) % 24, mm = m % 60;
    const ap = h >= 12 ? "م" : "ص", h12 = h % 12 || 12;
    slots.push(`${h12}:${String(mm).padStart(2, "0")} ${ap}`);
  }
  $("rTime").innerHTML = slots.map(s => `<option>${s}</option>`).join("");
  $("rTime").value = slots[8];

  /* guests */
  $("rGuests").innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1} ${i === 0 ? "شخص" : "أشخاص"}</option>`).join("");
  $("rGuests").value = "2";

  /* tables with capacity */
  const capOf = n => (n <= Math.ceil(C.tablesCount * 0.4) ? 2 : n <= Math.ceil(C.tablesCount * 0.8) ? 4 : 8);
  const floor = $("floor");
  function paintFloor() {
    const g = parseInt($("rGuests").value, 10);
    if (picked && capOf(picked) < g) picked = null;
    floor.innerHTML = Array.from({ length: C.tablesCount }, (_, i) => {
      const n = i + 1, cap = capOf(n), off = cap < g;
      return `<button type="button" class="tbl ${picked === n ? "sel" : ""}" data-n="${n}" ${off ? "disabled" : ""} role="radio" aria-checked="${picked === n}" aria-label="ترابيزة ${n} تتسع ${cap}"><span>${n}<small>${cap} أفراد</small></span></button>`;
    }).join("");
    summary();
  }
  floor.addEventListener("click", e => {
    const b = e.target.closest(".tbl"); if (!b || b.disabled) return;
    picked = parseInt(b.dataset.n, 10); $("tblErr").style.display = "none"; paintFloor();
  });

  /* summary */
  function dateAr(v) { if (!v) return "—"; return new Date(v + "T12:00").toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" }); }
  function summary() {
    $("sDate").textContent = dateAr($("rDate").value);
    $("sTime").textContent = $("rTime").value;
    $("sGuests").textContent = $("rGuests").value + " أشخاص";
    $("sTable").textContent = picked ? "ترابيزة رقم " + picked : "لم يتم اختيار ترابيزة";
    $("pickedLbl").textContent = picked ? "اخترت رقم " + picked : "لم يتم الاختيار";
  }
  ["rDate", "rTime"].forEach(id => $(id).addEventListener("change", summary));
  $("rGuests").addEventListener("change", paintFloor);
  $("resForm").addEventListener("input", e => e.target.classList.remove("is-bad"));

  /* confirm */
  $("resBtn").addEventListener("click", () => {
    const bad = (el, c) => { el.classList.toggle("is-bad", c); return c; };
    let err = false;
    err = bad($("rName"), $("rName").value.trim().length < 2) || err;
    err = bad($("rPhone"), !/^01[0-25]\d{8}$/.test($("rPhone").value.replace(/\s|-/g, ""))) || err;
    err = bad($("rDate"), !$("rDate").value || $("rDate").value < $("rDate").min) || err;
    if (!picked) { $("tblErr").style.display = "block"; err = true; }
    if (err) { toast("راجع بيانات الحجز"); return; }

    const no = "R" + Date.now().toString().slice(-6);
    const lines = [
      "*طلب حجز ترابيزة — الحاجة* 🟣", "رقم الحجز: " + no, "────────────",
      "الاسم: " + $("rName").value.trim(), "الموبايل: " + $("rPhone").value.trim(),
      "التاريخ: " + dateAr($("rDate").value), "الوقت: " + $("rTime").value,
      "عدد الأشخاص: " + $("rGuests").value, "رقم الترابيزة: " + picked
    ];
    if ($("rOcc").value) lines.push("المناسبة: " + $("rOcc").value);
    if ($("rNotes").value.trim()) lines.push("ملاحظات: " + $("rNotes").value.trim());
    const msg = lines.join("\n");
    $("resWa").href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(msg);
    new bootstrap.Modal($("resDone")).show();
    openWhatsApp(msg);
  });

  paintFloor();
})();

/* ========== About page logic ========== */
(function () {
  const C = window.HAAJA_CONFIG, $ = id => document.getElementById(id);
  $("cAddr").textContent = C.address; $("cAddr").href = C.mapsUrl;
  $("cPhone").textContent = C.phone; $("cPhone").href = "tel:" + C.phone.replace(/\s/g, "");
  $("cHours").textContent = C.hours; $("mapBtn").href = C.mapsUrl;
  $("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const n = $("cName"), m = $("cMsg");
    n.classList.toggle("is-bad", n.value.trim().length < 2);
    m.classList.toggle("is-bad", m.value.trim().length < 3);
    if (document.querySelector("#contactForm .is-bad")) return;
    const txt = ["*رسالة من موقع الحاجة* 🟣", "الاسم: " + n.value.trim()];
    if ($("cTel").value.trim()) txt.push("الموبايل: " + $("cTel").value.trim());
    txt.push("الرسالة: " + m.value.trim());
    window.HAAJA.openWhatsApp(txt.join("\n"));
    window.HAAJA.toast("تم تجهيز رسالتك على واتساب");
    e.target.reset();
  });
  $("contactForm").addEventListener("input", e => e.target.classList.remove("is-bad"));
})();

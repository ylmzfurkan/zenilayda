// Mobil hamburger menü aç/kapa (tüm sayfalarda ortak)
(function () {
  const toggle = document.querySelector(".nav-toggle");
  if (!toggle) return;
  const body = document.body;

  function setIcon(open) {
    toggle.textContent = open ? "✕" : "☰"; // ✕ / ☰
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  setIcon(false);

  toggle.addEventListener("click", () => {
    setIcon(body.classList.toggle("nav-open"));
  });

  // Bir menü bağlantısına tıklanınca paneli kapat
  document.querySelectorAll(".site-nav a, .hero__nav a").forEach((a) => {
    a.addEventListener("click", () => {
      body.classList.remove("nav-open");
      setIcon(false);
    });
  });
})();

/**
 * Yaratıcı Süreç
 *
 * Masaüstü: statik "pipeline" (akış şeması). Kartlar HTML'de hazır durur;
 *   bir kartın görseline tıklanınca ilgili PDF sayfası tam ekran (lightbox)
 *   açılır. Görseller dile göre: TR sitede tr-01.webp…tr-22.webp,
 *   EN sitede en-01.webp…en-22.webp (PDF'in 22 sayfası 300dpi → webp).
 *
 * Mobil (≤600px): PDF sayfaları alt alta (dikey kaydırma). JS ile tembel
 *   yüklemeyle oluşturulur — masaüstü pipeline mobilde CSS ile gizlidir.
 *
 * SPA notu: calismalar.js ile aynı desen — window.SPA'ya "process" olarak
 * kaydolur; mount() dinleyicileri kurar, unmount() temizler.
 */
(function () {
  "use strict";

  const PAGE_COUNT = 22;
  const BASE = "/assets/creative-process/";

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  /* Aktif dile göre görsel öneki: TR sitede Türkçe PDF, EN sitede İngilizce. */
  function prefix() {
    return window.i18nLang === "en" ? "en-" : "tr-";
  }

  /* Sayfa görselinin yolu. (i: 0 tabanlı) */
  function srcFor(i) {
    return BASE + prefix() + pad(i + 1) + ".webp";
  }

  let el = {};
  let mq = null; // (max-width: 600px) — mobil mod
  let scrollBuilt = false; // mobil dikey liste oluşturuldu mu
  let lbOn = false; // lightbox dinleyicileri bağlı mı
  let lbIndex = 0; // lightbox'ta gösterilen sayfa (0 tabanlı)

  /* --- Mobil: tüm sayfaları alt alta oluştur (bir kez, tembel yüklemeyle) --- */
  function buildScroll() {
    if (scrollBuilt || !el.scroll) return;
    scrollBuilt = true;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < PAGE_COUNT; i++) {
      const img = new Image(2153, 1238);
      img.className = "process__page";
      img.src = srcFor(i);
      img.decoding = "async";
      img.loading = i < 2 ? "eager" : "lazy";
      img.alt = "Creative Process — " + (i + 1) + " / " + PAGE_COUNT;
      frag.appendChild(img);
    }
    el.scroll.appendChild(frag);
  }

  /* --- Dil değişince görselleri güncelle (masaüstü + mobil + lightbox) --- */
  function syncPipe() {
    if (!el.pipe) return;
    el.pipe.querySelectorAll(".pipe__thumb").forEach((btn) => {
      const page = parseInt(btn.getAttribute("data-page"), 10);
      const img = btn.querySelector("img");
      if (img && page >= 1) img.src = srcFor(page - 1);
    });
  }
  function syncScroll() {
    if (!el.scroll) return;
    el.scroll.querySelectorAll("img").forEach((img, i) => {
      img.src = srcFor(i);
    });
  }
  function onLangChange() {
    syncPipe();
    syncScroll();
    if (el.lb && el.lb.classList.contains("is-open")) lbRender();
  }

  /* --- Lightbox (masaüstü pipeline kartından PDF sayfasını büyüt) ---
   * Açıldıktan sonra oklarla / ← → tuşlarıyla sayfalar arasında gezilir. */
  function lbRender() {
    if (!el.lbImg) return;
    el.lbImg.src = srcFor(lbIndex);
    el.lbImg.alt = "Creative Process — " + (lbIndex + 1) + " / " + PAGE_COUNT;
    if (el.lbCount) {
      el.lbCount.textContent = pad(lbIndex + 1) + " / " + pad(PAGE_COUNT);
    }
  }
  function openLightbox(i) {
    if (!el.lb || !el.lbImg) return;
    lbIndex = ((i % PAGE_COUNT) + PAGE_COUNT) % PAGE_COUNT;
    lbRender();
    el.lb.classList.add("is-open");
    el.lb.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", onLbKey);
  }
  function closeLightbox() {
    if (!el.lb) return;
    el.lb.classList.remove("is-open");
    el.lb.setAttribute("aria-hidden", "true");
    if (el.lbImg) el.lbImg.removeAttribute("src");
    document.removeEventListener("keydown", onLbKey);
  }
  function lbGo(dir) {
    lbIndex = (lbIndex + dir + PAGE_COUNT) % PAGE_COUNT;
    lbRender();
  }
  function onLbKey(e) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") lbGo(1);
    else if (e.key === "ArrowLeft") lbGo(-1);
  }
  function onPipeClick(e) {
    const btn = e.target.closest(".pipe__thumb");
    if (!btn) return;
    const page = parseInt(btn.getAttribute("data-page"), 10);
    if (page >= 1) openLightbox(page - 1); // data-page 1 tabanlı
  }
  function onLbPrev(e) {
    e.stopPropagation();
    lbGo(-1);
  }
  function onLbNext(e) {
    e.stopPropagation();
    lbGo(1);
  }
  function onLbClick(e) {
    // Görsele tıklamak kapatmaz; arka plana / kapat düğmesine tıklamak kapatır.
    if (e.target === el.lbImg) return;
    closeLightbox();
  }

  function attachLightbox() {
    if (lbOn || !el.pipe) return;
    lbOn = true;
    el.pipe.addEventListener("click", onPipeClick);
    if (el.lb) el.lb.addEventListener("click", onLbClick);
    if (el.lbPrev) el.lbPrev.addEventListener("click", onLbPrev);
    if (el.lbNext) el.lbNext.addEventListener("click", onLbNext);
  }
  function detachLightbox() {
    if (!lbOn) return;
    lbOn = false;
    if (el.pipe) el.pipe.removeEventListener("click", onPipeClick);
    if (el.lb) el.lb.removeEventListener("click", onLbClick);
    if (el.lbPrev) el.lbPrev.removeEventListener("click", onLbPrev);
    if (el.lbNext) el.lbNext.removeEventListener("click", onLbNext);
    document.removeEventListener("keydown", onLbKey);
  }

  /* --- Ekran boyutuna göre modu uygula --- */
  function applyMode() {
    if (mq && mq.matches) {
      buildScroll(); // mobil: dikey kaydırma
    }
    // pipeline (masaüstü) statik — her durumda lightbox bağlı kalsın
  }
  function onMode() {
    applyMode();
  }

  /* --- Sayfaya giriş --- */
  function mount() {
    el = {
      root: document.getElementById("process"),
      pipe: document.querySelector(".pipe"),
      scroll: document.getElementById("p-scroll"),
      lb: document.getElementById("p-lightbox"),
      lbImg: document.getElementById("p-lb-img"),
      lbClose: document.getElementById("p-lb-close"),
      lbPrev: document.getElementById("p-lb-prev"),
      lbNext: document.getElementById("p-lb-next"),
      lbCount: document.getElementById("p-lb-count"),
    };
    if (!el.root) return; // beklenmedik DOM — sessizce çık

    // SPA gezinmesinde body sınıfı değişmez; sayfa düzeni için gerekli.
    document.body.classList.add("process-page");

    scrollBuilt = false;
    lbOn = false;

    attachLightbox();
    syncPipe(); // masaüstü kartları aktif dile göre ayarla (kayıtlı dil EN olabilir)
    window.addEventListener("langchanged", onLangChange);

    mq = window.matchMedia("(max-width: 600px)");
    if (mq.addEventListener) mq.addEventListener("change", onMode);
    else if (mq.addListener) mq.addListener(onMode); // eski Safari
    applyMode();
  }

  /* --- Sayfadan çıkış: dinleyicileri temizle --- */
  function unmount() {
    detachLightbox();
    closeLightbox();
    window.removeEventListener("langchanged", onLangChange);
    if (mq) {
      if (mq.removeEventListener) mq.removeEventListener("change", onMode);
      else if (mq.removeListener) mq.removeListener(onMode);
      mq = null;
    }
    document.body.classList.remove("process-page");
  }

  if (window.SPA) {
    window.SPA.register("process", { mount, unmount });
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount);
    } else {
      mount();
    }
  }
})();

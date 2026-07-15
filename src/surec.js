/**
 * Yaratıcı Süreç — yatay slayt (PDF sayfaları)
 *
 * "İlayda Özen — Creative Process" PDF'inin 22 sayfası tek tek görsel olarak
 * gösterilir. Sayfalar arası oklarla, klavye (← →), fare tekerleği, görselin
 * sol/sağ yarısına tıklayarak veya mobilde yana kaydırarak gezinilir.
 *
 * Görseller: /assets/creative-process/en-01.webp ... en-22.webp
 * (PDF 22 sayfayı 300dpi → webp olarak çevrildi.)
 *
 * DİL NOTU: Şu an yalnızca İngilizce sayfa görselleri var (PDF İngilizce).
 * Türkçe eklenmek istenirse: aynı isimlendirmeyle tr-01.webp ... tr-22.webp
 * görsellerini aynı klasöre koyup aşağıdaki PREFIX mantığını
 *   const lang = window.i18nLang === "tr" ? "tr" : "en";
 * olarak açmak yeterli. Şimdilik her iki dilde de "en-" kullanılır.
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

  /* Sayfa görselinin yolu. Türkçe görseller eklenince buradan aç. */
  function srcFor(i) {
    // const lang = window.i18nLang === "tr" ? "tr" : "en";
    const lang = "en"; // şimdilik yalnızca İngilizce
    return BASE + lang + "-" + pad(i + 1) + ".webp";
  }

  let el = {};
  let index = 0;
  let animating = false;
  let wheelLock = false;
  let touchX = null;
  let touchYStart = null;
  const preloaded = {};
  let mq = null; // (max-width: 600px) — mobil mod
  let sliderOn = false; // masaüstü slayt dinleyicileri bağlı mı
  let scrollBuilt = false; // mobil dikey liste oluşturuldu mu

  function preload(i) {
    if (i < 0 || i >= PAGE_COUNT || preloaded[i]) return;
    const img = new Image();
    img.src = srcFor(i);
    preloaded[i] = true;
  }

  function render(i) {
    el.img.classList.remove("loaded");
    el.img.alt = "Creative Process — " + (i + 1) + " / " + PAGE_COUNT;
    el.img.src = srcFor(i);
    el.progress.textContent = pad(i + 1) + " / " + pad(PAGE_COUNT);
    if (el.bar) el.bar.style.width = ((i + 1) / PAGE_COUNT) * 100 + "%";
    // Komşu sayfaları önceden yükle (geçişler akıcı olsun)
    preload(i + 1);
    preload(i - 1);
  }

  function go(dir) {
    if (animating) return;
    const next = (index + dir + PAGE_COUNT) % PAGE_COUNT;
    if (next === index) return;
    animating = true;
    index = next;
    render(index);
  }

  /* --- Dinleyiciler (adlandırılmış — mount/unmount ile eklenip kaldırılır) --- */
  function onImgLoad() {
    el.img.classList.add("loaded");
    animating = false;
  }
  function onImgError() {
    animating = false;
  }
  function onPrev(e) {
    e.stopPropagation();
    go(-1);
  }
  function onNext(e) {
    e.stopPropagation();
    go(1);
  }
  function onStageClick(e) {
    // Görselin sol yarısı: geri, sağ yarısı: ileri
    const rect = el.stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    go(x < rect.width / 2 ? -1 : 1);
  }
  function onWheel(e) {
    e.preventDefault();
    if (wheelLock || Math.abs(e.deltaY) < 6) return;
    wheelLock = true;
    go(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => {
      wheelLock = false;
    }, 650);
  }
  function onKey(e) {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      go(1);
    } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(-index);
    } else if (e.key === "End") {
      e.preventDefault();
      go(PAGE_COUNT - 1 - index);
    }
  }
  function onTouchStart(e) {
    touchX = e.touches[0].clientX;
    touchYStart = e.touches[0].clientY;
  }
  function onTouchEnd(e) {
    if (touchX === null) return;
    const dx = touchX - e.changedTouches[0].clientX;
    const dy = touchYStart - e.changedTouches[0].clientY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dx > 0 ? 1 : -1);
    }
    touchX = null;
    touchYStart = null;
  }

  /* --- Masaüstü slayt dinleyicileri ---
   * Mobilde bağlanMAZ: wheel/touch preventDefault dikey kaydırmayı engellerdi.
   */
  function attachSlider() {
    if (sliderOn) return;
    sliderOn = true;
    el.img.addEventListener("load", onImgLoad);
    el.img.addEventListener("error", onImgError);
    el.prev.addEventListener("click", onPrev);
    el.next.addEventListener("click", onNext);
    el.stage.addEventListener("click", onStageClick);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    render(index);
  }

  function detachSlider() {
    if (!sliderOn) return;
    sliderOn = false;
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchend", onTouchEnd);
    if (el.img) {
      el.img.removeEventListener("load", onImgLoad);
      el.img.removeEventListener("error", onImgError);
    }
    if (el.prev) el.prev.removeEventListener("click", onPrev);
    if (el.next) el.next.removeEventListener("click", onNext);
    if (el.stage) el.stage.removeEventListener("click", onStageClick);
  }

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

  /* --- Ekran boyutuna göre modu uygula --- */
  function applyMode() {
    if (mq && mq.matches) {
      detachSlider(); // mobil: dikey kaydırma
      buildScroll();
    } else {
      attachSlider(); // masaüstü: yatay slayt
    }
  }
  function onMode() {
    applyMode();
  }

  /* --- Sayfaya giriş --- */
  function mount() {
    el = {
      root: document.getElementById("process"),
      stage: document.getElementById("p-stage"),
      img: document.getElementById("p-img"),
      prev: document.getElementById("p-prev"),
      next: document.getElementById("p-next"),
      progress: document.getElementById("p-progress"),
      bar: document.getElementById("p-bar"),
      scroll: document.getElementById("p-scroll"),
    };
    if (!el.root) return; // beklenmedik DOM — sessizce çık

    // SPA gezinmesinde body sınıfı değişmez; slayt/kaydırma için gerekli.
    document.body.classList.add("process-page");

    index = 0;
    animating = false;
    wheelLock = false;
    touchX = null;
    touchYStart = null;
    sliderOn = false;
    scrollBuilt = false;

    mq = window.matchMedia("(max-width: 600px)");
    if (mq.addEventListener) mq.addEventListener("change", onMode);
    else if (mq.addListener) mq.addListener(onMode); // eski Safari
    applyMode();
  }

  /* --- Sayfadan çıkış: dinleyicileri temizle --- */
  function unmount() {
    detachSlider();
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

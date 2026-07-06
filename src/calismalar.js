/**
 * Çalışmalar — interaktif galeri
 * Ok tuşları (↑ ↓ / ← →), scroll veya görsele tıklayarak gezinilir.
 *
 * Kendi çalışmalarını eklemek için aşağıdaki WORKS dizisini düzenle.
 * - image:  görsel yolu (kendi görsellerini assets/works/ içine koyup
 *           "assets/works/1.jpg" gibi verebilirsin)
 * - fields: solda görünen künye satırları (etiket + değer).
 *           Sıra: "Designed for" en üstte, "Designed by" en altta.
 *
 * SPA notu: Bu modül window.SPA'ya kaydolur; sayfaya girerken mount(),
 * çıkarken unmount() çalışır. Böylece window dinleyicileri (wheel/tuş/dokunma)
 * yalnızca Çalışmalar sayfasında aktif kalır, diğer sayfalarda temizlenir.
 */
(function () {
  "use strict";

  const WORKS = [
    {
      numeral: "I",
      image: "/assets/works/vatoz-cerceve.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "VATOZ",
      poem: {
        tr: "Vatoz isimli tablomu, Mikasa Moor markasının kendi pirinç vatoz aksesuarlarına uyumlu olacak şekilde tasarladım. İlk başta soyut sabit renklerdeki bir arka planda düşündüğüm bu tabloyu, objesi vatoz olduğu için organik bir forma taşıma ihtiyacı hissedip onları kendi yaşam alanına su altına yerleştirdim. Böylece çok daha organik ve akışta olan bir tablo oldu.<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
        en: "I designed “Vatoz” (Stingray) to complement Mikasa Moor’s own brass stingray accessories. Although I first imagined it set against an abstract background of flat, fixed colours, the subject being a stingray made me feel the need to carry it into a more organic form — so I placed the rays in their own habitat, underwater. The result became a far more organic painting, alive with movement.<br /><br />Piece dimensions: 65×125 cm — printed on glass.",
      },
    },
    {
      numeral: "II",
      image: "/assets/works/sutun.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "SÜTUN",
      poem: {
        tr: "Sütun isimli tablomu, Mikasa Moor markasının butik koleksiyonu için tasarladım. Antik Roma mimarisinden esinlendiğim bu tasarımda iki farklı sütunu aynı kanvas içinde görüyoruz. Zarif mimari detaylar ve aynı tonlar…<br /><br />Tablonun ölçüsü: 90x120 cm - cam baskıdır.",
        en: "I designed “Sütun” (Column) for Mikasa Moor’s boutique collection. Inspired by ancient Roman architecture, this design brings two different columns together within a single canvas. Elegant architectural details and harmonious tones…<br /><br />Piece dimensions: 90×120 cm — printed on glass.",
      },
    },
    {
      numeral: "III",
      image: "/assets/works/tapinak-tablo.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "TAPINAK",
      poem: {
        tr: "Tapınak isimli tablomu, Mikasa Moor markasının, sezon için kurguladığı lüks mimari evi ve ofis aksesuarlarına uygun olacak şekilde tasarladım. İpek, uçuş uçuş ve sezonun rengi kahve detaylara sahip bir tablo…<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
        en: "I designed “Tapınak” (Temple) to suit the luxurious architectural home and office accessories Mikasa Moor envisioned for the season. A painting of flowing silk and the season’s signature brown details…<br /><br />Piece dimensions: 65×125 cm — printed on glass.",
      },
    },
    {
      numeral: "IV",
      image: "/assets/works/girl-cerceve.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "DENGE",
      poem: {
        tr: "Denge isimli, Mikasa Moor markası için tasarladığım bu tabloda sulu boya efekti kullandım. Bir kadının içindeki iki farklı ruh halini temsil ettim aslında.<br /><br />Tablonun ölçüsü: 90x120 cm - cam baskıdır.",
        en: "In “Denge” (Balance), which I designed for Mikasa Moor, I used a watercolour effect. In truth, I wanted to represent the two different states of mind that live within a single woman.<br /><br />Piece dimensions: 90×120 cm — printed on glass.",
      },
    },
    {
      numeral: "V",
      image: "/assets/works/yesil-heykel.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "FEMINEN",
      poem: {
        tr: "Feminen isimli tablomu, Mikasa Moor markasının daha feminen dokunuşlarda duvar aksesuarı talebi ile tasarladım. Antik Roma mimarisinin birleşiminde yer alan bir kadın heykelinin dansı…<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
        en: "I designed “Feminen” (Feminine) in response to Mikasa Moor’s request for a wall accessory with a softer, more feminine touch. The dance of a female sculpture, set within a fusion of ancient Roman architecture…<br /><br />Piece dimensions: 65×125 cm — printed on glass.",
      },
    },
  ];

  /* Aktif dil (i18n.js tarafından ayarlanır; yoksa tr) */
  function currentLang() {
    return window.i18nLang === "en" ? "en" : "tr";
  }

  /* Künye etiketleri yalnızca Türkçe sürümde çevrilir (İngilizcede aynı kalır) */
  const LABEL_TR = {
    "Designed for": "Marka",
    Date: "Tarih",
    "Designed by": "Görsel Tasarımcı",
  };
  function labelFor(label) {
    return currentLang() === "tr" ? LABEL_TR[label] || label : label;
  }

  /* --------------------------------------------------------- */
  let el = {};
  let index = 0;
  let animating = false;
  let wheelLock = false;
  let touchX = null;
  let touchYStart = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function fill(i) {
    const w = WORKS[i];

    el.fields.innerHTML = w.fields
      .map(
        (f) =>
          `<div class="field"><dt>${labelFor(f.label)}</dt><dd>${f.value}</dd></div>`
      )
      .join("");

    el.title.innerHTML = w.title;
    el.poem.innerHTML =
      typeof w.poem === "string" ? w.poem : w.poem[currentLang()] || w.poem.tr;
    el.progress.textContent = `${pad(i + 1)} / ${pad(WORKS.length)}`;

    // Görsel
    el.img.classList.remove("loaded");
    el.ph.textContent = ""; // yüklenirken isim gösterme
    el.img.alt = (w.title || "").replace(/<[^>]+>/g, " ").trim();
    el.img.src = w.image;
  }

  function go(dir) {
    if (animating) return;
    animating = true;

    hideSwipeHint(); // ilk gezinmede mobil kaydırma ipucunu gizle

    el.gallery.classList.add("is-anim");

    setTimeout(() => {
      index = (index + dir + WORKS.length) % WORKS.length;
      fill(index);
      el.gallery.classList.remove("is-anim");
      setTimeout(() => {
        animating = false;
      }, 420);
    }, 360);
  }

  /* --- Dinleyiciler (adlandırılmış — mount/unmount ile eklenip kaldırılır) --- */
  function onImgLoad() {
    el.img.classList.add("loaded");
  }
  function onImgError() {
    el.img.classList.remove("loaded");
  }
  function onStageClick() {
    go(1);
  }
  function onWheel(e) {
    e.preventDefault();
    if (wheelLock || Math.abs(e.deltaY) < 6) return;
    wheelLock = true;
    go(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => {
      wheelLock = false;
    }, 850);
  }
  function onKey(e) {
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      go(1);
    } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
      e.preventDefault();
      go(-1);
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
    // Yalnızca yatay baskın kaydırmada geçiş yap (dikey kaydırmayı yok say)
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dx > 0 ? 1 : -1);
    }
    touchX = null;
    touchYStart = null;
  }
  function onLang() {
    fill(index);
  }

  /* --- Mobil kaydırma ipucu ---
   * Kullanıcıya eserler arasında yana kaydırarak geçebileceğini gösterir.
   * Yalnızca mobilde görünür (CSS), ilk gezinmede kaybolur.
   */
  let swipeHint = null;
  let onHintLang = null;
  function hideSwipeHint() {
    if (!swipeHint) return;
    if (onHintLang) {
      window.removeEventListener("langchanged", onHintLang);
      onHintLang = null;
    }
    const node = swipeHint;
    swipeHint = null;
    node.classList.add("is-hidden");
    setTimeout(() => node.remove(), 500);
  }
  function createSwipeHint() {
    if (WORKS.length < 2) return; // tek eser varsa gerek yok
    const hint = document.createElement("div");
    hint.className = "swipe-hint";
    hint.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "swipe-hint__text";
    const setText = () => {
      label.textContent = currentLang() === "en" ? "Swipe" : "Kaydırın";
    };
    setText();
    onHintLang = setText;
    window.addEventListener("langchanged", onHintLang);
    hint.innerHTML =
      '<span class="swipe-hint__chevrons"><i></i><i></i><i></i></span>';
    hint.appendChild(label);
    document.body.appendChild(hint);
    swipeHint = hint;
  }

  /* --- Sayfaya giriş: DOM'a bağlan, dinleyicileri kur, ilk eseri göster --- */
  function mount() {
    el = {
      gallery: document.getElementById("gallery"),
      fields: document.getElementById("g-fields"),
      stage: document.getElementById("g-stage"),
      img: document.getElementById("g-img"),
      ph: document.getElementById("g-ph"),
      title: document.getElementById("g-title"),
      poem: document.getElementById("g-poem"),
      progress: document.getElementById("g-progress"),
    };
    if (!el.gallery) return; // beklenmedik DOM — sessizce çık

    index = 0;
    animating = false;
    wheelLock = false;
    touchX = null;
    touchYStart = null;

    el.img.addEventListener("load", onImgLoad);
    el.img.addEventListener("error", onImgError);
    el.stage.addEventListener("click", onStageClick);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("langchanged", onLang);

    createSwipeHint();
    fill(0);
  }

  /* --- Sayfadan çıkış: tüm dinleyicileri ve ipucunu temizle --- */
  function unmount() {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("langchanged", onLang);
    if (el.img) {
      el.img.removeEventListener("load", onImgLoad);
      el.img.removeEventListener("error", onImgError);
    }
    if (el.stage) el.stage.removeEventListener("click", onStageClick);
    hideSwipeHint();
  }

  if (window.SPA) {
    window.SPA.register("works", { mount, unmount });
  } else {
    // SPA yoksa (güvenlik ağı / klasik gezinme): eski davranışla başlat
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount);
    } else {
      mount();
    }
  }
})();

/**
 * Çalışmalar — interaktif galeri
 * Ok tuşları (↑ ↓ / ← →), scroll veya görsele tıklayarak gezinilir.
 *
 * Kendi çalışmalarını eklemek için aşağıdaki WORKS dizisini düzenle.
 * - image:  görsel yolu (kendi görsellerini assets/works/ içine koyup
 *           "assets/works/1.jpg" gibi verebilirsin)
 * - fields: solda görünen künye satırları (etiket + değer).
 *           Sıra: "Designed for" en üstte, "Designed by" en altta.
 */
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
const el = {
  gallery: document.getElementById("gallery"),
  fields: document.getElementById("g-fields"),
  stage: document.getElementById("g-stage"),
  img: document.getElementById("g-img"),
  ph: document.getElementById("g-ph"),
  title: document.getElementById("g-title"),
  poem: document.getElementById("g-poem"),
  progress: document.getElementById("g-progress"),
};

let index = 0;
let animating = false;

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

el.img.addEventListener("load", () => el.img.classList.add("loaded"));
el.img.addEventListener("error", () => el.img.classList.remove("loaded"));

function go(dir) {
  if (animating) return;
  animating = true;

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

/* --- Görsele tıklayınca sonraki esere geç --- */
el.stage.addEventListener("click", () => go(1));

/* --- Scroll ile gezinme --- */
let wheelLock = false;
window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    if (wheelLock || Math.abs(e.deltaY) < 6) return;
    wheelLock = true;
    go(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => {
      wheelLock = false;
    }, 850);
  },
  { passive: false }
);

/* --- Ok tuşları ile gezinme --- */
window.addEventListener("keydown", (e) => {
  if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
    e.preventDefault();
    go(1);
  } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
    e.preventDefault();
    go(-1);
  }
});

/* --- Dokunmatik kaydırma (yalnızca YATAY: sağ/sol) ---
 * Mobilde dikey (aşağı) kaydırma sayfayı kaydırır, eser geçişi yapmaz.
 * Eserler arası geçiş sadece görsele tıklayınca ya da yatay kaydırınca olur.
 */
let touchX = null;
let touchYStart = null;
window.addEventListener(
  "touchstart",
  (e) => {
    touchX = e.touches[0].clientX;
    touchYStart = e.touches[0].clientY;
  },
  { passive: true }
);
window.addEventListener(
  "touchend",
  (e) => {
    if (touchX === null) return;
    const dx = touchX - e.changedTouches[0].clientX;
    const dy = touchYStart - e.changedTouches[0].clientY;
    // Yalnızca yatay baskın kaydırmada geçiş yap (dikey kaydırmayı yok say)
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dx > 0 ? 1 : -1);
    }
    touchX = null;
    touchYStart = null;
  },
  { passive: true }
);

// Dil değişince mevcut eseri seçili dilde yeniden yaz
window.addEventListener("langchanged", () => fill(index));

// İlk eser
fill(0);

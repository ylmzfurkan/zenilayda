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
    image: "assets/works/vatoz-cerceve.webp",
    fields: [
      { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
      { label: "Date", value: "2024" },
      { label: "Designed by", value: "İlayda Özen" },
    ],
    title: "VATOZ",
    poem:
      "Vatoz isimli tablomu, Mikasa Moor markasının kendi pirinç vatoz aksesuarlarına uyumlu olacak şekilde tasarladım. İlk başta soyut sabit renklerdeki bir arka planda düşündüğüm bu tabloyu, objesi vatoz olduğu için organik bir forma taşıma ihtiyacı hissedip onları kendi yaşam alanına su altına yerleştirdim. Böylece çok daha organik ve akışta olan bir tablo oldu.<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
  },
  {
    numeral: "II",
    image: "assets/works/sutun.webp",
    fields: [
      { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
      { label: "Date", value: "2024" },
      { label: "Designed by", value: "İlayda Özen" },
    ],
    title: "SÜTUN",
    poem:
      "Sütun isimli tablomu, Mikasa Moor markasının butik koleksiyonu için tasarladım. Antik Roma mimarisinden esinlendiğim bu tasarımda iki farklı sütunu aynı kanvas içinde görüyoruz. Zarif mimari detaylar ve aynı tonlar…<br /><br />Tablonun ölçüsü: 90x120 cm - cam baskıdır.",
  },
  {
    numeral: "III",
    image: "assets/works/tapinak-tablo.webp",
    fields: [
      { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
      { label: "Date", value: "2024" },
      { label: "Designed by", value: "İlayda Özen" },
    ],
    title: "TAPINAK",
    poem:
      "Tapınak isimli tablomu, Mikasa Moor markasının, sezon için kurguladığı lüks mimari evi ve ofis aksesuarlarına uygun olacak şekilde tasarladım. İpek, uçuş uçuş ve sezonun rengi kahve detaylara sahip bir tablo…<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
  },
  {
    numeral: "IV",
    image: "assets/works/girl-cerceve.webp",
    fields: [
      { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
      { label: "Date", value: "2024" },
      { label: "Designed by", value: "İlayda Özen" },
    ],
    title: "DENGE",
    poem:
      "Denge isimli, Mikasa Moor markası için tasarladığım bu tabloda sulu boya efekti kullandım. Bir kadının içindeki iki farklı ruh halini temsil ettim aslında.<br /><br />Tablonun ölçüsü: 90x120 cm - cam baskıdır.",
  },
  {
    numeral: "V",
    image: "assets/works/yesil-heykel.webp",
    fields: [
      { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
      { label: "Date", value: "2024" },
      { label: "Designed by", value: "İlayda Özen" },
    ],
    title: "FEMINEN",
    poem:
      "Feminen isimli tablomu, Mikasa Moor markasının daha feminen dokunuşlarda duvar aksesuarı talebi ile tasarladım. Antik Roma mimarisinin birleşiminde yer alan bir kadın heykelinin dansı…<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
  },
];

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
      (f) => `<div class="field"><dt>${f.label}</dt><dd>${f.value}</dd></div>`
    )
    .join("");

  el.title.innerHTML = w.title;
  el.poem.innerHTML = w.poem;
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

// İlk eser
fill(0);

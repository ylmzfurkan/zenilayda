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
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg?width=1100",
    fields: [
      { label: "Designed for", value: "The Birth of Venus" },
      { label: "Date", value: "c. 1485" },
      { label: "Designed by", value: "Sandro Botticelli" },
    ],
    title: "Light<br />as a beginning.",
    poem:
      "A shell brushes the shore.<br />The goddess arrives, never having travelled.<br /><br />The wind pushes her, flowers cover her.<br />The world, suddenly, begins again.",
  },
  {
    numeral: "II",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/1665_Girl_with_a_Pearl_Earring.jpg?width=1000",
    fields: [
      { label: "Designed for", value: "Girl with a Pearl Earring" },
      { label: "Date", value: "c. 1665" },
      { label: "Designed by", value: "Johannes Vermeer" },
    ],
    title: "A glance<br />held still.",
    poem:
      "She turns, only for a moment.<br />A pearl catches the last of the light.<br /><br />Nothing is said, yet everything waits<br />in the quiet between two breaths.",
  },
  {
    numeral: "III",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tsunami_by_hokusai_19th_century.jpg?width=1100",
    fields: [
      { label: "Designed for", value: "The Great Wave" },
      { label: "Date", value: "c. 1831" },
      { label: "Designed by", value: "Katsushika Hokusai" },
    ],
    title: "The sea<br />remembers.",
    poem:
      "A wave rises, taller than the mountain.<br />Foam reaches like fingers toward the sky.<br /><br />Beneath it, small boats hold their breath,<br />and the world tilts for an instant.",
  },
  {
    numeral: "IV",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gustav_Klimt_016.jpg?width=950",
    fields: [
      { label: "Designed for", value: "The Kiss" },
      { label: "Date", value: "1907 – 1908" },
      { label: "Designed by", value: "Gustav Klimt" },
    ],
    title: "Gold,<br />and surrender.",
    poem:
      "Two figures fold into one another,<br />wrapped in a field of gold.<br /><br />The world dissolves around them—<br />only the embrace remains.",
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
  el.img.alt = w.fields.find((f) => f.label === "Designed for")?.value || "";
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

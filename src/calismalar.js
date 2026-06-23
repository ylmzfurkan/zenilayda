/**
 * Çalışmalar — interaktif galeri
 * Ok tuşları (↑ ↓ / ← →) veya scroll ile eserler arasında gezinilir.
 *
 * Kendi çalışmalarını eklemek için aşağıdaki WORKS dizisini düzenle.
 * - image:  görsel yolu (kendi görsellerini assets/works/ içine koyup
 *           "assets/works/1.jpg" gibi verebilirsin)
 * - fields: solda görünen künye satırları (etiket + değer)
 */
const WORKS = [
  {
    numeral: "I",
    medium: "Tempera",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg?width=1100",
    caption: "Sandro Botticelli · The Birth of Venus · c. 1485",
    fields: [
      { label: "Author", value: "Sandro Botticelli" },
      { label: "Work", value: "The Birth of Venus" },
      { label: "Date", value: "c. 1485" },
      { label: "Location", value: "Uffizi Gallery · Florence" },
      { label: "Movement", value: "Renaissance · Quattrocento" },
    ],
    title: "Light<br />as a beginning.",
    poem:
      "A shell brushes the shore.<br />The goddess arrives, never having travelled.<br /><br />The wind pushes her, flowers cover her.<br />The world, suddenly, begins again.",
    chamber: "Chamber I",
  },
  {
    numeral: "II",
    medium: "Oil on canvas",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/1665_Girl_with_a_Pearl_Earring.jpg?width=1000",
    caption: "Johannes Vermeer · Girl with a Pearl Earring · c. 1665",
    fields: [
      { label: "Author", value: "Johannes Vermeer" },
      { label: "Work", value: "Girl with a Pearl Earring" },
      { label: "Date", value: "c. 1665" },
      { label: "Location", value: "Mauritshuis · The Hague" },
      { label: "Movement", value: "Dutch Golden Age" },
    ],
    title: "A glance<br />held still.",
    poem:
      "She turns, only for a moment.<br />A pearl catches the last of the light.<br /><br />Nothing is said, yet everything waits<br />in the quiet between two breaths.",
    chamber: "Chamber II",
  },
  {
    numeral: "III",
    medium: "Woodblock print",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tsunami_by_hokusai_19th_century.jpg?width=1100",
    caption: "Katsushika Hokusai · The Great Wave off Kanagawa · c. 1831",
    fields: [
      { label: "Author", value: "Katsushika Hokusai" },
      { label: "Work", value: "The Great Wave" },
      { label: "Date", value: "c. 1831" },
      { label: "Location", value: "Tokyo · Edo Period" },
      { label: "Movement", value: "Ukiyo-e" },
    ],
    title: "The sea<br />remembers.",
    poem:
      "A wave rises, taller than the mountain.<br />Foam reaches like fingers toward the sky.<br /><br />Beneath it, small boats hold their breath,<br />and the world tilts for an instant.",
    chamber: "Chamber III",
  },
  {
    numeral: "IV",
    medium: "Oil & gold leaf",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gustav_Klimt_016.jpg?width=950",
    caption: "Gustav Klimt · The Kiss · 1908",
    fields: [
      { label: "Author", value: "Gustav Klimt" },
      { label: "Work", value: "The Kiss" },
      { label: "Date", value: "1907 – 1908" },
      { label: "Location", value: "Belvedere · Vienna" },
      { label: "Movement", value: "Symbolism · Art Nouveau" },
    ],
    title: "Gold,<br />and surrender.",
    poem:
      "Two figures fold into one another,<br />wrapped in a field of gold.<br /><br />The world dissolves around them—<br />only the embrace remains.",
    chamber: "Chamber IV",
  },
];

/* --------------------------------------------------------- */
const el = {
  gallery: document.getElementById("gallery"),
  num: document.getElementById("g-num"),
  medium: document.getElementById("g-medium"),
  fields: document.getElementById("g-fields"),
  img: document.getElementById("g-img"),
  ph: document.getElementById("g-ph"),
  caption: document.getElementById("g-caption"),
  title: document.getElementById("g-title"),
  poem: document.getElementById("g-poem"),
  chamber: document.getElementById("g-chamber"),
  progress: document.getElementById("g-progress"),
};

let index = 0;
let animating = false;

function pad(n) {
  return String(n).padStart(2, "0");
}

function fill(i) {
  const w = WORKS[i];

  el.num.textContent = w.numeral;
  el.medium.textContent = w.medium;

  el.fields.innerHTML = w.fields
    .map(
      (f) =>
        `<div class="field"><dt>${f.label}</dt><dd>${f.value}</dd></div>`
    )
    .join("");

  el.title.innerHTML = w.title;
  el.poem.innerHTML = w.poem;
  el.chamber.textContent = w.chamber;
  el.caption.textContent = w.caption;
  el.progress.textContent = `${pad(i + 1)} / ${pad(WORKS.length)}`;

  // Görsel
  el.img.classList.remove("loaded");
  el.ph.textContent = w.fields.find((f) => f.label === "Work")?.value || "Görsel";
  el.img.alt = w.caption;
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

/* --- Dokunmatik kaydırma --- */
let touchY = null;
window.addEventListener(
  "touchstart",
  (e) => {
    touchY = e.touches[0].clientY;
  },
  { passive: true }
);
window.addEventListener(
  "touchend",
  (e) => {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) go(dy > 0 ? 1 : -1);
    touchY = null;
  },
  { passive: true }
);

// İlk eser
fill(0);

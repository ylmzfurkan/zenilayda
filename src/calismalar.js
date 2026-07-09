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
      image: "/assets/works/hurrem-suleyman.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Tablo — Altın Çağ Koleksiyonu" },
        { label: "Date", value: "2026" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: 'Taht Ve Akıl:<br /><span class="t-nowrap">Süleyman İle Hürrem</span>',
      poem: {
        tr: "Altın Çağ koleksiyonu için tasarladığım bu tabloda Tahtın gücü Kanuni ve zekâsı ile ünlü Hürrem Sultan var. Bu tabloda da ikisi birlikte varoluyor.<br /><br />Tablonun adet ölçüsü: 95x125 cm - cam baskıdır.",
        en: "In this piece, which I designed for the Golden Age (Altın Çağ) collection, stand Süleyman — the might of the throne — and Hürrem Sultan, renowned for her intelligence. Here, once more, the two come into being together.<br /><br />Piece dimensions: 95×125 cm — printed on glass.",
      },
    },
    {
      numeral: "II",
      image: "/assets/works/barok.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Tablo — Altın Çağ Koleksiyonu" },
        { label: "Date", value: "2026" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Rafael Ve İnci Küpeli Kız",
      poem: {
        tr: "Altın Çağ koleksiyonu için tasarladığım Rafael ve İnci Küpeli Kız isimli bu tabloda rönesans eserlerinden ilham aldım ve onlara tasarımda manipülasyon tekniğini uyguladım.<br /><br />Tablonun adet ölçüsü: 95x125 cm - cam baskıdır.",
        en: "In “Rafael ve İnci Küpeli Kız” (Raphael and the Girl with a Pearl Earring), which I designed for the Golden Age collection, I drew inspiration from Renaissance works and applied a manipulation technique to them in the design.<br /><br />Piece dimensions: 95×125 cm — printed on glass.",
      },
    },
    {
      numeral: "III",
      image: "/assets/works/vatoz-cerceve.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Vatoz",
      poem: {
        tr: "Vatoz isimli tablomu, Mikasa Moor markasının kendi pirinç vatoz aksesuarlarına uyumlu olacak şekilde tasarladım. İlk başta soyut sabit renklerdeki bir arka planda düşündüğüm bu tabloyu, objesi vatoz olduğu için organik bir forma taşıma ihtiyacı hissedip onları kendi yaşam alanına su altına yerleştirdim. Böylece çok daha organik ve akışta olan bir tablo oldu.<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
        en: "I designed “Vatoz” (Stingray) to complement Mikasa Moor’s own brass stingray accessories. Although I first imagined it set against an abstract background of flat, fixed colours, the subject being a stingray made me feel the need to carry it into a more organic form — so I placed the rays in their own habitat, underwater. The result became a far more organic painting, alive with movement.<br /><br />Piece dimensions: 65×125 cm — printed on glass.",
      },
    },
    {
      numeral: "IV",
      image: "/assets/works/sutun.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Sütun",
      poem: {
        tr: "Sütun isimli tablomu, Mikasa Moor markasının butik koleksiyonu için tasarladım. Antik Roma mimarisinden esinlendiğim bu tasarımda iki farklı sütunu aynı kanvas içinde görüyoruz. Zarif mimari detaylar ve aynı tonlar…<br /><br />Tablonun ölçüsü: 90x120 cm - cam baskıdır.",
        en: "I designed “Sütun” (Column) for Mikasa Moor’s boutique collection. Inspired by ancient Roman architecture, this design brings two different columns together within a single canvas. Elegant architectural details and harmonious tones…<br /><br />Piece dimensions: 90×120 cm — printed on glass.",
      },
    },
    {
      numeral: "V",
      image: "/assets/works/tapinak-tablo.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Tapınak",
      poem: {
        tr: "Tapınak isimli tablomu, Mikasa Moor markasının, sezon için kurguladığı lüks mimari evi ve ofis aksesuarlarına uygun olacak şekilde tasarladım. İpek, uçuş uçuş ve sezonun rengi kahve detaylara sahip bir tablo…<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
        en: "I designed “Tapınak” (Temple) to suit the luxurious architectural home and office accessories Mikasa Moor envisioned for the season. A painting of flowing silk and the season’s signature brown details…<br /><br />Piece dimensions: 65×125 cm — printed on glass.",
      },
    },
    {
      numeral: "VI",
      image: "/assets/works/girl-cerceve.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Denge",
      poem: {
        tr: "Denge isimli, Mikasa Moor markası için tasarladığım bu tabloda sulu boya efekti kullandım. Bir kadının içindeki iki farklı ruh halini temsil ettim aslında.<br /><br />Tablonun ölçüsü: 90x120 cm - cam baskıdır.",
        en: "In “Denge” (Balance), which I designed for Mikasa Moor, I used a watercolour effect. In truth, I wanted to represent the two different states of mind that live within a single woman.<br /><br />Piece dimensions: 90×120 cm — printed on glass.",
      },
    },
    {
      numeral: "VII",
      image: "/assets/works/yesil-heykel.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Home x Mikasa Moor" },
        { label: "Date", value: "2024" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Feminen",
      poem: {
        tr: "Feminen isimli tablomu, Mikasa Moor markasının daha feminen dokunuşlarda duvar aksesuarı talebi ile tasarladım. Antik Roma mimarisinin birleşiminde yer alan bir kadın heykelinin dansı…<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
        en: "I designed “Feminen” (Feminine) in response to Mikasa Moor’s request for a wall accessory with a softer, more feminine touch. The dance of a female sculpture, set within a fusion of ancient Roman architecture…<br /><br />Piece dimensions: 65×125 cm — printed on glass.",
      },
    },
    {
      numeral: "VIII",
      image: "/assets/works/anatolian-at.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Tablo Koleksiyonu" },
        { label: "Date", value: "2025" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Anadolu’da Bir Siyah İnci",
      poem: {
        tr: "Anatolian koleksiyonunda olan Siyah İnci isimli bu tabloyu Türk motiflerinin olduğu bir Anadolu halısı ile tasarladım. Siyah at gücü, özgürlüğü temsil ediyorken vücudunun iki ayrı bölümde var olması ise kendi bedenimizin iki farklı yüzünü gösterir.<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
        en: "I designed “Siyah İnci” (Black Pearl), part of the Anatolian collection, upon an Anatolian rug adorned with Turkish motifs. While the black horse represents power and freedom, its body existing in two separate parts reveals the two different faces of our own being.<br /><br />Piece dimensions: 65×125 cm — printed on glass.",
      },
    },
    {
      numeral: "IX",
      image: "/assets/works/ikili-at.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Tablo Koleksiyonu" },
        { label: "Date", value: "2026" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Dualitenin Portresi",
      poem: {
        tr: "At Portre koleksiyonunda yer alan Dualitenin Portresi isimli tablomda, uçuşan mürdüm renk soyut bir şal ile dualiteyi sarmalayan iki farklı at portresi bulunuyor. Bu tablo uçuşan şallar ile Roma mimarisi ile birleşiyor.<br /><br />Tablonun adet ölçüsü: 85x115 cm - cam baskıdır.",
        en: "In “Dualitenin Portresi” (The Portrait of Duality), part of the Horse Portrait collection, two different horse portraits enfold duality within a flowing, abstract plum-coloured shawl. The painting merges these drifting shawls with Roman architecture.<br /><br />Piece dimensions: 85×115 cm — printed on glass.",
      },
    },
    {
      numeral: "X",
      image: "/assets/works/leopard-2.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Tablo Koleksiyonu" },
        { label: "Date", value: "2026" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Camazotz",
      poem: {
        tr: "Leopar Portre Koleksiyonunda yer alan Camazotz isimli tablomda fantastik bir evrenden ilham aldım. Camazotz tehlikeli bir labirenttir. Maya mitolojisinden alıntı bu evrende yer alan vahşi ve güçlü leopar bu labirentin tam ortasındadır.<br /><br />Tablonun adet ölçüsü: 85x115 cm - cam baskıdır.",
        en: "In “Camazotz”, part of the Leopard Portrait collection, I drew inspiration from a fantastical universe. Camazotz is a perilous labyrinth. Drawn from Maya mythology, the wild and powerful leopard of this universe stands at the very centre of the maze.<br /><br />Piece dimensions: 85×115 cm — printed on glass.",
      },
    },
    {
      numeral: "XI",
      image: "/assets/works/leopard.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Tablo Koleksiyonu" },
        { label: "Date", value: "2026" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Ters Düz Dünya",
      poem: {
        tr: "Leopar Portre Koleksiyonunda yer alan Ters Düz Dünya isimli tablomu, farklı evrenlerden ilham alarak tasarladım. Leoparın kendi yüzü ile şehrin mimarisinin içinde karşılaştığı bir ayna evreni…<br /><br />Tablonun adet ölçüsü: 65x125 cm - cam baskıdır.",
        en: "I designed “Ters Düz Dünya” (Upside-Down World), part of the Leopard Portrait collection, drawing inspiration from different universes. A mirror-world where the leopard comes face to face with its own reflection within the architecture of the city…<br /><br />Piece dimensions: 65×125 cm — printed on glass.",
      },
    },
    {
      numeral: "XII",
      image: "/assets/works/leopard-yuksek.webp",
      transparent: true, // şeffaf arka plan: dikdörtgen çerçeve gölgesi gizlenir
      fields: [
        { label: "Designed for", value: "Ev ve Yaşam Fuarı Antalya" },
        { label: "Date", value: "2026" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Anadolu Leoparı",
      poem: {
        tr: "Anatolian koleksiyonunda yer alan Anadolu Leoparı isimli, yuvarlak bir modelin içine yerleştirdiğim bu tablo keskin hatlar değil yumuşak hatlar taşıyor. Anadolu’nun izinde Türk halısı üzerinde gücün simgesi bir leopar…<br /><br />Tablonun ölçüsü: Çap 80 cm - cam baskıdır.",
        en: "Part of the Anatolian collection, “Anadolu Leoparı” (The Anatolian Leopard) is set within a circular form and carries soft contours rather than sharp lines. On the trail of Anatolia, a leopard — the symbol of power — upon a Turkish rug…<br /><br />Piece dimensions: 80 cm diameter — printed on glass.",
      },
    },
    {
      numeral: "XIII",
      image: "/assets/works/kirmizi-at.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Tablo Koleksiyonu" },
        { label: "Date", value: "2026" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Arzular Ve İhtiraslar",
      poem: {
        tr: "Arzular ve İhtiraslar adlı tablomda, siyah at, bordo renk ve şapkalı kadınla birleşen bir kompozisyon var. Bu bize damarlarımızda akan o ihtişamı hissettiriyor. Hepimizin içinde yanan arzular ve ihtişamlı bir taraf var. Aynı şapkalı bu zarif kadın gibi…<br /><br />Tablonun ölçüsü: 90x120 cm - cam baskıdır.",
        en: "In “Arzular ve İhtiraslar” (Desires and Passions), a composition unites a black horse, a deep burgundy hue and a woman in a hat. It makes us feel the splendour flowing through our veins. Within each of us burns a side of desire and magnificence — just like this elegant woman in her hat…<br /><br />Piece dimensions: 90×120 cm — printed on glass.",
      },
    },
    {
      numeral: "XIV",
      image: "/assets/works/kadin-tablo.webp",
      fields: [
        { label: "Designed for", value: "Kuzey Tablo Koleksiyonu" },
        { label: "Date", value: "2025" },
        { label: "Designed by", value: "İlayda Özen" },
      ],
      title: "Altın Sır Ve Kadın",
      poem: {
        tr: "Kadın Portre koleksiyonunda Altın Sır ve Kadın olarak tasarladığım bu tablo, altın gibi sakladığımız o ihtişamı anlatıyor. Yüzü görünmeyen bir kadın ama bir o kadar da görünen ve ihtişamlı bir kadın…<br /><br />Tablonun ölçüsü: 90x120 cm - cam baskıdır.",
        en: "Designed as “Altın Sır ve Kadın” (The Golden Secret and the Woman) within the Woman Portrait collection, this piece speaks of the splendour we guard like gold. A woman whose face remains unseen, yet all the more present and magnificent…<br /><br />Piece dimensions: 90×120 cm — printed on glass.",
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

    // Şeffaf arka planlı görseller için dikdörtgen çerçeve gölgesini gizle
    if (el.stage) el.stage.classList.toggle("is-transparent", !!w.transparent);

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

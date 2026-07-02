/**
 * Basit i18n (TR / EN) — tüm sayfalarda ortak.
 *
 * Kullanım:
 *  - Çevrilecek metin öğesine  data-i18n="anahtar"        (textContent değişir)
 *  - İçinde <br>/<strong> olan öğeye  data-i18n-html="anahtar"  (innerHTML değişir)
 *  - <title data-i18n="title.x"> ile sekme başlığı da çevrilir.
 *
 * Dil seçimi localStorage('lang') içinde saklanır (varsayılan: tr).
 * Galeri gibi JS ile üretilen içerik için  'langchanged'  olayı tetiklenir;
 * ayrıca window.i18nLang güncel dili tutar.
 */
(function () {
  "use strict";

  const I18N = {
    tr: {
      /* --- gezinme --- */
      "nav.works": "Çalışmalar",
      "nav.about": "Hakkında",
      "nav.contact": "İletişim",

      /* --- sekme başlıkları --- */
      "title.home": "Zenilayda — Portfolyo",
      "title.works": "Çalışmalar — Zenilayda",
      "title.about": "Hakkında — Zenilayda",
      "title.contact": "İletişim — Zenilayda",

      /* --- Ana sayfa hero sözü (iki satır) --- */
      "hero.quote":
        '<span class="quote-line quote-line--tr">İçimdeki <em>denizlerden</em></span><span class="quote-rule quote-rule-wide quote-rule--tr"></span><span class="quote-line quote-line--tr">dijital <em>sanata.</em></span>',

      /* --- İletişim --- */
      "contact.title": "Birlikte üretelim.",
      "contact.lead":
        "Yeni bir proje, iş birliği ya da sadece bir merhaba — bana aşağıdaki kanallardan ulaşabilirsiniz. En kısa sürede dönüş yapmaya çalışırım.",
      "contact.mailLabel": "E-posta",

      /* --- Hakkında: künye --- */
      "about.lblEducation": "Eğitim",
      "about.lblFocus": "Odak",
      "about.lblBrand": "Marka",
      "about.lblApproach": "Yaklaşım",
      "about.valEducation":
        "İstanbul Bilgi Üniversitesi · Görsel İletişim Tasarımı · Yüksek Onur, 2021",
      "about.valFocus": "Dijital Sanat · ~6 Yıl",
      "about.valBrand": "Kuzey Home · Cam Baskı Dijital Tablolar",
      "about.valApproach": "Geleneksel Tasarım + Yapay Zekâ Destekli Üretim",

      /* --- Hakkında: anlatı --- */
      "about.lead":
        "Ben İlayda, İstanbul'da doğdum; küçüklüğümden beri doğayla, hayvanlarla ve yaşamın kendi akışıyla güçlü bir bağ kurdum.",
      "about.p2":
        "Fotoğraf çekmek, hissettiklerimi yazmak ve sürekli yeni şeyler üretmek, zamanla dünyayı algılama biçimimin ayrılmaz bir parçası haline geldi. İlhamımı yalnızca gördüklerimden değil, yaşadığım deneyimlerden de alıyorum.",
      "about.p3":
        "Kolay bir yolculuktan gelmiyorum; hayat, beni birçok şeye erken yaşta olgunlaşarak bakmaya davet etti. Bazen kendimi büyük bir denizin içinde kaybolmuş gibi hissettim. Belki de tüm bu süreç, aslında kendimi bulma yolculuğunun ta kendisiydi.",
      "about.p4":
        "<strong>2021</strong> yılında <strong>İstanbul Bilgi Üniversitesi Görsel İletişim Tasarımı</strong> bölümünden yüksek onur derecesiyle mezun oldum. Yaklaşık altı yıldır dijital sanat alanında üretmeye devam ediyor, tasarımı yalnızca estetik bir ifade biçimi değil, aynı zamanda duyguların, anıların ve hikâyelerin görsel bir dili olarak görüyorum.",
      "about.p5":
        "Kendi markamız olan <strong>Kuzey Home</strong> bünyesinde <strong>özel cam baskı dijital tablolar</strong> tasarlıyor, farklı markalar için özel koleksiyonlar ve görsel dünyalar oluşturuyorum. Bunun yanı sıra bağımsız projelerimde kendi estetik anlayışımı ve anlatım dilimi keşfetmeye devam ediyorum.",
      "about.p6":
        "Geleneksel tasarım yaklaşımını yeni teknolojilerle bir araya getirmeyi seviyorum. Bazı çalışmalarımda yapay zekâ destekli üretim süreçlerinden faydalanıyor, dijital araçları yaratıcılığın sınırlarını genişleten yeni ifade biçimleri olarak görüyorum. Benim için önemli olan kullanılan araç değil, ortaya çıkan hissin samimiyeti ve anlatmak istediği hikâye.",
      "about.p7":
        "Bugün ürettiğim her şey, biraz geçmişimin, biraz hayallerimin ve biraz da hâlâ devam eden kendini keşfetme yolculuğumun bir yansıması.",
      "about.quote": "İçinizde ne varsa, onu bulun ve parlamasına izin verin.",
      "about.sign": "Sevgiler, <strong>İlayda Özen</strong>",
    },

    en: {
      /* --- navigation --- */
      "nav.works": "Works",
      "nav.about": "About",
      "nav.contact": "Contact",

      /* --- tab titles --- */
      "title.home": "Zenilayda — Portfolio",
      "title.works": "Works — Zenilayda",
      "title.about": "About — Zenilayda",
      "title.contact": "Contact — Zenilayda",

      /* --- Home hero quote --- */
      "hero.quote":
        '<span class="quote-line quote-what">where <em>inner </em><em>oceans</em></span><span class="quote-rule quote-rule-wide" style="--rx: 5rem"></span><span class="quote-line quote-through">become <em>stories</em></span><span class="quote-rule quote-rule-wide" style="--rx: 5rem"></span><span class="quote-line quote-change">and <em>stories</em></span><span class="quote-rule quote-rule-wide" style="--rx: 5rem"></span><span class="quote-line quote-reinvention">become <em>digital art.</em></span><span class="quote-rule quote-rule-wide" style="--rx: 5rem"></span>',

      /* --- Contact --- */
      "contact.title": "Let's create together.",
      "contact.lead":
        "Whether it's a new project, a collaboration, or simply a hello — you can reach me through the channels below. I'll get back to you as soon as I can.",
      "contact.mailLabel": "Email",

      /* --- About: credits --- */
      "about.lblEducation": "Education",
      "about.lblFocus": "Focus",
      "about.lblBrand": "Brand",
      "about.lblApproach": "Approach",
      "about.valEducation":
        "İstanbul Bilgi University · Visual Communication Design · High Honors, 2021",
      "about.valFocus": "Digital Art · ~6 Years",
      "about.valBrand": "Kuzey Home · Digital Prints on Glass",
      "about.valApproach": "Traditional Design + AI-Assisted Production",

      /* --- About: narrative --- */
      "about.lead":
        "I'm İlayda, born in Istanbul. Since childhood I've felt a deep bond with nature, with animals, and with the natural flow of life.",
      "about.p2":
        "Taking photographs, writing down what I feel, and constantly creating new things have, over time, become an inseparable part of how I perceive the world. I draw my inspiration not only from what I see, but also from what I live through.",
      "about.p3":
        "Mine hasn't been an easy journey; life invited me to mature early and to look at many things with deeper eyes. At times I felt lost in the middle of a vast sea. Perhaps that whole process was, in truth, the very journey of finding myself.",
      "about.p4":
        "In <strong>2021</strong> I graduated with high honors from <strong>İstanbul Bilgi University, Visual Communication Design</strong>. For nearly six years I have continued to create in the field of digital art, seeing design not merely as an aesthetic form of expression, but as a visual language for emotions, memories, and stories.",
      "about.p5":
        "Under our own brand <strong>Kuzey Home</strong>, I design <strong>custom digital prints on glass</strong>, and I create bespoke collections and visual worlds for different brands. Alongside this, I keep exploring my own aesthetic and narrative language through independent projects.",
      "about.p6":
        "I love bringing a traditional design approach together with new technologies. In some of my works I make use of AI-assisted production processes, viewing digital tools as new forms of expression that widen the boundaries of creativity. What matters to me is not the tool itself, but the sincerity of the feeling that emerges and the story it longs to tell.",
      "about.p7":
        "Everything I create today is a reflection — a little of my past, a little of my dreams, and a little of my still-unfolding journey of self-discovery.",
      "about.quote": "Whatever lies within you, find it — and let it shine.",
      "about.sign": "With love, <strong>İlayda Özen</strong>",
    },
  };

  const STORAGE_KEY = "lang";
  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "tr" ? saved : "tr";
  }

  // Galeri gibi erken çalışan modüllerin okuyabilmesi için hemen tanımla
  window.i18nLang = getLang();

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.tr;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (key in dict) {
        if (node.tagName === "TITLE") {
          document.title = dict[key];
        } else {
          node.textContent = dict[key];
        }
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const key = node.getAttribute("data-i18n-html");
      if (key in dict) node.innerHTML = dict[key];
    });

    document.documentElement.setAttribute("lang", lang);

    // Buton durumlarını güncelle
    document.querySelectorAll(".lang-opt").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    window.i18nLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent("langchanged", { detail: { lang } }));
  }

  function wireSwitch() {
    document.querySelectorAll(".lang-opt").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }

  function init() {
    wireSwitch();
    applyLang(getLang());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

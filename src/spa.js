/**
 * SPA yönlendiricisi (client-side router).
 *
 * Amaç: Aynı site içindeki sayfa geçişlerinde tarayıcının sayfayı TAM
 * yeniden yüklemesini engellemek. İçerik fetch ile getirilip yerine konur,
 * böylece hafızadaki JS durumu (özellikle music.js'teki Audio nesnesi) canlı
 * kalır → ARKA PLAN MÜZİĞİ HİÇ KESİLMEZ. Ayrıca mobilde her yeni sayfada
 * otomatik oynatma engeline takılmaz.
 *
 * GÜVENLİK AĞI: Herhangi bir hata olursa (fetch, parse, mount, bilinmeyen
 * rota, tarayıcı desteği) tam-yükleme gezinmeye düşülür (location.href).
 * Yani en kötü ihtimalde site, SPA öncesi haliyle aynı çalışır — asla bozulmaz.
 *
 * Sayfa modülleri (main.js = ana sayfa 3D, calismalar.js = galeri) kendini
 * window.SPA.register(anahtar, { mount, unmount }) ile kaydeder. Router
 * sayfaya girerken mount(), çıkarken unmount() çağırır.
 *   - main.js (3D): mount = render döngüsünü sürdür, unmount = duraklat.
 *     WebGL bağlamı ASLA yeniden yaratılmaz → 3D bozulmaz.
 */
(function () {
  "use strict";

  // Tarayıcı desteği yoksa hiç devreye girme (klasik gezinme kullanılır)
  if (!window.history || !window.fetch || !window.DOMParser) return;

  const registry = {};
  let currentKey = null;
  let currentUnmount = null;
  let navToken = 0;

  window.SPA = {
    register(key, api) {
      registry[key] = api;
    },
    get current() {
      return currentKey;
    },
  };

  /* --- URL -> sayfa anahtarı --- */
  function keyForPath(pathname) {
    const p = pathname.replace(/index\.html$/, "").replace(/\/+$/, "/");
    if (p === "/" || p === "") return "home";
    if (p.indexOf("/calismalar") === 0) return "works";
    if (p.indexOf("/hakkinda") === 0) return "about";
    if (p.indexOf("/iletisim") === 0) return "contact";
    return null; // bilinmeyen -> klasik gezinme
  }

  /* --- Sayfaya özel modülü (gerekliyse) yükle --- */
  async function loadModule(key) {
    if (registry[key]) return;
    if (key === "home") await import("/src/main.js");
    else if (key === "works") await import("/src/calismalar.js");
    // about / contact: modül yok
  }

  /* --- Hedef sayfanın stil sayfasına geç (home: style.css, diğerleri: pages.css) --- */
  function swapStylesheet(doc) {
    const target = doc.querySelector('link[rel="stylesheet"]');
    const cur = document.querySelector('link[rel="stylesheet"]');
    const targetHref = target && target.getAttribute("href");
    const curHref = cur && cur.getAttribute("href");
    if (!targetHref || targetHref === curHref) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = targetHref;
    // Yeni stil yüklenince eskisini kaldır (stilsiz an olmasın)
    link.addEventListener(
      "load",
      () => {
        if (cur && cur.parentNode) cur.remove();
      },
      { once: true }
    );
    // Yüklenemezse yine de eskiyi bırakmayalım ki çakışma olmasın
    link.addEventListener(
      "error",
      () => {
        if (cur && cur.parentNode) cur.remove();
      },
      { once: true }
    );
    document.head.appendChild(link);
  }

  /* --- Kanvas (3D arka plan) görünürlüğü — yalnızca ana sayfada göster --- */
  function setCanvasVisible(vis) {
    const cv = document.getElementById("scene");
    if (cv) cv.style.display = vis ? "block" : "none";
  }

  /* --- Gövde içeriğini değiştir; [data-spa-persist] düğümlerini koru ---
   * Sağlam yöntem: persist düğümleri ayır, gövdeyi tamamen boşalt, persist'i
   * geri koy, sonra yeni içeriği ekle. Böylece kalıcı kanvas/müzik butonu
   * hiçbir kenar durumda kaybolmaz.
   */
  function swapBody(doc) {
    const persist = Array.prototype.slice.call(
      document.body.querySelectorAll(":scope > [data-spa-persist]")
    );
    // Gövdeyi boşalt (persist düğümler hafızada referanslı, güvende)
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    // Persist düğümleri geri koy (kanvas, müzik butonu — durumları korunur)
    persist.forEach((n) => document.body.appendChild(n));
    // Yeni içeriği ekle (persist ve script hariç)
    Array.prototype.slice.call(doc.body.children).forEach((el) => {
      if (el.hasAttribute && el.hasAttribute("data-spa-persist")) return;
      if (el.tagName === "SCRIPT") return; // script'leri elle yönetiyoruz
      document.body.appendChild(document.importNode(el, true));
    });
  }

  /* --- Ana geçiş --- */
  async function swap(url, push) {
    const key = keyForPath(new URL(url, location.href).pathname);
    if (!key) throw new Error("unknown route");

    const token = ++navToken;
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error("fetch " + res.status);
    const html = await res.text();
    if (token !== navToken) return; // arada başka gezinme oldu

    const doc = new DOMParser().parseFromString(html, "text/html");

    // 1) Önceki sayfayı sök
    if (currentUnmount) {
      try {
        currentUnmount();
      } catch (e) {
        /* yut */
      }
      currentUnmount = null;
    }

    // 2) Stil + başlık + gövde
    swapStylesheet(doc);
    document.title = doc.title || document.title;
    swapBody(doc);
    setCanvasVisible(key === "home"); // 3D yalnızca ana sayfada görünür

    // 3) Çeviriyi yeni içeriğe uygula
    if (window.applyI18n) window.applyI18n();

    // 4) Sayfa modülünü yükle + mount
    await loadModule(key);
    if (token !== navToken) return;
    currentKey = key;
    const api = registry[key];
    if (api && api.mount) {
      try {
        api.mount();
        currentUnmount = api.unmount || null;
      } catch (e) {
        currentUnmount = null;
      }
    }

    // 5) history + kaydırmayı sıfırla
    if (push) history.pushState({ spa: true }, "", url);
    window.scrollTo(0, 0);
  }

  async function navigate(url, push) {
    try {
      await swap(url, push);
    } catch (err) {
      // Güvenlik ağı: klasik tam-yükleme gezinme
      console.warn("[SPA] fallback:", err);
      window.location.href = url;
    }
  }

  /* --- İç bağlantı tıklamalarını yakala --- */
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    const a = e.target.closest && e.target.closest("a");
    if (!a) return;
    if (a.target && a.target !== "_self") return;
    if (a.hasAttribute("download")) return;
    const href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;
    let url;
    try {
      url = new URL(href, location.href);
    } catch (_) {
      return;
    }
    if (url.origin !== location.origin) return; // dış link
    if (url.pathname === location.pathname) {
      e.preventDefault();
      return; // aynı sayfa
    }
    if (!keyForPath(url.pathname)) return; // bilinmeyen -> klasik gezinme
    e.preventDefault();
    navigate(url.href, true);
  });

  /* --- Geri/İleri --- */
  window.addEventListener("popstate", () => {
    navigate(location.href, false);
  });

  /* --- İlk yükleme: mevcut sayfayı kaydet + mount --- */
  const key0 = keyForPath(location.pathname);
  if (key0) {
    loadModule(key0)
      .then(() => {
        currentKey = key0;
        const api = registry[key0];
        if (api && api.mount) {
          try {
            api.mount();
            currentUnmount = api.unmount || null;
          } catch (e) {
            /* yut */
          }
        }
        setCanvasVisible(key0 === "home"); // ilk yüklemede kanvas görünürlüğü
      })
      .catch((e) => console.warn("[SPA] ilk yükleme:", e));
  }
})();

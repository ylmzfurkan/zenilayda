/**
 * Arka plan müziği — tüm sayfalarda ortak, kendi kendine yeterli widget.
 *
 * Davranış:
 *  - Site çok sayfalı (MPA) olduğu için her gezinmede sayfa yeniden yüklenir.
 *    Müziğin kaldığı yerden sürmesi için çalma konumu + açık/kapalı durumu
 *    localStorage'da saklanır.
 *  - Tarayıcılar kullanıcı etkileşimi olmadan otomatik ses çalmayı engeller.
 *    Bu yüzden müzik VARSAYILAN OLARAK KAPALIDIR. Kullanıcı ikona bir kez
 *    dokununca açılır ve bu tercih tüm sayfalarda/oturumlarda hatırlanır.
 *  - Kullanıcı müziği açtıktan sonra başka bir sayfaya geçerse, müzik kaldığı
 *    yerden otomatik sürer; tarayıcı yine de engellerse ilk tıklama/kaydırmada
 *    devreye girer.
 *
 * Sağ altta küçük bir cam (glass) düğme; çalarken hareketli ekolayzer,
 * kapalıyken sessiz simgesi gösterir.
 */
(function () {
  "use strict";

  const SRC = "/assets/bg-music.mp3";
  const KEY_ON = "bg-music-on"; // "1" | "0"
  const KEY_TIME = "bg-music-time"; // saniye (kayan nokta)
  const KEY_SEEN = "bg-music-seen"; // ilk ziyaret ipucu için
  const VOLUME = 0.35; // arka plan için düşük ses
  const FADE_MS = 600;

  /* ---------- Stil ---------- */
  const css = `
  .bgm-btn{
    position: fixed;
    right: 1.1rem;
    bottom: 1.1rem;
    z-index: 60;
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    padding: 0;
    border-radius: 999px;
    cursor: pointer;
    color: var(--ink, #eafffb);
    background: rgba(6, 28, 30, 0.5);
    -webkit-backdrop-filter: blur(18px);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(234, 255, 251, 0.18);
    box-shadow: 0 12px 34px rgba(0, 30, 32, 0.4);
    transition: transform .25s ease, background .25s ease, border-color .25s ease, opacity .25s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .bgm-btn:hover{ background: rgba(6,28,30,.66); border-color: rgba(234,255,251,.34); transform: translateY(-1px); }
  .bgm-btn:focus-visible{ outline: 2px solid rgba(234,255,251,.7); outline-offset: 3px; }

  /* Ekolayzer çubukları */
  .bgm-eq{ display:flex; align-items:center; justify-content:center; gap:3px; height:16px; }
  .bgm-eq i{
    display:block; width:3px; height:5px; border-radius:2px;
    background: currentColor;
    transform-origin: 50% 100%;
  }
  .bgm-btn.is-playing .bgm-eq i{ animation: bgm-bounce .9s ease-in-out infinite; }
  .bgm-btn.is-playing .bgm-eq i:nth-child(1){ animation-delay: -.7s; }
  .bgm-btn.is-playing .bgm-eq i:nth-child(2){ animation-delay: -.4s; }
  .bgm-btn.is-playing .bgm-eq i:nth-child(3){ animation-delay: -.9s; }
  .bgm-btn.is-playing .bgm-eq i:nth-child(4){ animation-delay: -.2s; }
  @keyframes bgm-bounce{
    0%,100%{ transform: scaleY(.4); }
    50%{ transform: scaleY(1.6); }
  }
  /* Kapalıyken: çubuklar kısık + üzeri çizik */
  .bgm-btn:not(.is-playing){ color: var(--ink-soft, rgba(234,255,251,.66)); }
  .bgm-btn:not(.is-playing) .bgm-eq i{ height: 5px; }
  .bgm-slash{
    position:absolute; width:26px; height:1.5px; border-radius:2px;
    background: currentColor; transform: rotate(-45deg);
    opacity: 0; transition: opacity .2s ease;
  }
  .bgm-btn:not(.is-playing) .bgm-slash{ opacity: .8; }

  /* İlk ziyaret ipucu — nazik nabız */
  .bgm-btn.bgm-hint{ animation: bgm-pulse 2.4s ease-out 3; }
  @keyframes bgm-pulse{
    0%{ box-shadow: 0 12px 34px rgba(0,30,32,.4), 0 0 0 0 rgba(234,255,251,.45); }
    60%{ box-shadow: 0 12px 34px rgba(0,30,32,.4), 0 0 0 12px rgba(234,255,251,0); }
    100%{ box-shadow: 0 12px 34px rgba(0,30,32,.4), 0 0 0 0 rgba(234,255,251,0); }
  }

  @media (prefers-reduced-motion: reduce){
    .bgm-btn.is-playing .bgm-eq i{ animation: none; height: 12px; }
    .bgm-btn.bgm-hint{ animation: none; }
  }

  /* Mobilde alt sekme çubuğunun (tabbar) üstüne kaldır */
  @media (max-width: 600px){
    .bgm-btn{ bottom: 4.4rem; right: .9rem; }
  }`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Düğme ---------- */
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "bgm-btn";
  btn.setAttribute("aria-pressed", "false");
  btn.innerHTML =
    '<span class="bgm-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
    '<span class="bgm-slash" aria-hidden="true"></span>';
  document.body.appendChild(btn);

  /* ---------- Ses ---------- */
  const audio = new Audio(SRC);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;

  // Kayıtlı konumu geri yükle
  const savedTime = parseFloat(localStorage.getItem(KEY_TIME) || "0");
  const applyTime = () => {
    if (savedTime > 0 && isFinite(audio.duration) && savedTime < audio.duration) {
      try { audio.currentTime = savedTime; } catch (_) {}
    }
  };
  if (audio.readyState >= 1) applyTime();
  else audio.addEventListener("loadedmetadata", applyTime, { once: true });

  /* ---------- Ses geçişi (fade) ---------- */
  let fadeTimer = null;
  function fadeTo(target, done) {
    clearInterval(fadeTimer);
    const start = audio.volume;
    const steps = Math.max(1, Math.round(FADE_MS / 40));
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      audio.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
      if (i >= steps) {
        clearInterval(fadeTimer);
        audio.volume = target;
        if (done) done();
      }
    }, 40);
  }

  /* ---------- Etiketler (i18n) ---------- */
  function lang() {
    return window.i18nLang || document.documentElement.lang || "tr";
  }
  function updateLabel() {
    const en = lang() === "en";
    const playing = !audio.paused;
    const label = playing
      ? (en ? "Turn music off" : "Müziği kapat")
      : (en ? "Turn music on" : "Müziği aç");
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
  window.addEventListener("langchanged", updateLabel);

  /* ---------- Durum yansıtma ---------- */
  audio.addEventListener("play", () => {
    btn.classList.add("is-playing");
    btn.setAttribute("aria-pressed", "true");
    updateLabel();
  });
  audio.addEventListener("pause", () => {
    btn.classList.remove("is-playing");
    btn.setAttribute("aria-pressed", "false");
    updateLabel();
  });

  /* ---------- Oynat / duraklat ---------- */
  function startPlayback() {
    audio.volume = 0;
    const p = audio.play();
    if (p && typeof p.then === "function") {
      return p.then(() => fadeTo(VOLUME)).catch((err) => {
        // Otomatik oynatma engellendi — ilk etkileşimde tekrar dene
        armGesture();
        throw err;
      });
    }
    fadeTo(VOLUME);
    return Promise.resolve();
  }

  function stopPlayback() {
    fadeTo(0, () => audio.pause());
  }

  // Otomatik oynatma engellendiyse ilk kullanıcı hareketinde başlat
  let armed = false;
  function armGesture() {
    if (armed) return;
    armed = true;
    const resume = () => {
      cleanup();
      if (localStorage.getItem(KEY_ON) === "1") {
        audio.play().then(() => fadeTo(VOLUME)).catch(() => {});
      }
    };
    const cleanup = () => {
      armed = false;
      ["pointerdown", "keydown", "touchstart"].forEach((e) =>
        window.removeEventListener(e, resume)
      );
    };
    ["pointerdown", "keydown", "touchstart"].forEach((e) =>
      window.addEventListener(e, resume, { once: true, passive: true })
    );
  }

  /* ---------- Tıklama ---------- */
  btn.addEventListener("click", () => {
    localStorage.setItem(KEY_SEEN, "1");
    btn.classList.remove("bgm-hint");
    if (audio.paused) {
      localStorage.setItem(KEY_ON, "1");
      startPlayback().catch(() => {});
    } else {
      localStorage.setItem(KEY_ON, "0");
      localStorage.setItem(KEY_TIME, String(audio.currentTime));
      stopPlayback();
    }
  });

  /* ---------- Konumu sakla ---------- */
  let lastSave = 0;
  audio.addEventListener("timeupdate", () => {
    const now = Date.now();
    if (now - lastSave > 1000) {
      lastSave = now;
      localStorage.setItem(KEY_TIME, String(audio.currentTime));
    }
  });
  const saveNow = () => {
    if (!audio.paused) localStorage.setItem(KEY_TIME, String(audio.currentTime));
  };
  window.addEventListener("pagehide", saveNow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveNow();
  });

  /* ---------- Başlangıç ---------- */
  updateLabel();
  if (localStorage.getItem(KEY_ON) === "1") {
    startPlayback().catch(() => {}); // engellenirse armGesture zaten kuruldu
  } else if (!localStorage.getItem(KEY_SEEN)) {
    // İlk ziyaret: ikona nazikçe dikkat çek
    btn.classList.add("bgm-hint");
  }
})();

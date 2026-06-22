# Zenilayda — Portfolyo

Su dalgası (WebGL flowmap + dalga simülasyonu) arka planı ve cam/mavi
animasyonlu anka kuşu (Three.js + GLTF) içeren tek sayfalık portfolyo.

## Çalıştırma
Statik site — bir HTTP sunucusu yeterli:

```bash
python3 -m http.server 5500
```

Sonra tarayıcıda `http://localhost:5500`.

## Yapı
- `index.html` — sayfa iskeleti + kahraman metni
- `src/main.js` — WebGL su efekti + anka kuşu (Three.js)
- `src/style.css` — düzen, tipografi, fontlar
- `assets/` — kapak görseli, fontlar
- `models/v20.glb` — anka kuşu modeli (Draco sıkıştırmalı)

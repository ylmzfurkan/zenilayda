import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Zenilayda — Ana sayfa su/cam efekti (Noomo tarzı)
 *
 * İKİ KATMAN birlikte çalışır:
 *  A) DALGA SİMÜLASYONU (height-field): imleç dokununca halkalar yayılır,
 *     kenarlardan yansır, mouse dursa bile sönerek devam eder.
 *  B) TRAIL (flowmap): mouse'un geçtiği yolu yumuşak, ipeksi bir maske +
 *     akış yönü olarak tutar; her kare yavaşça söner.
 *
 * Ana shader büyük distortion yerine İNCE displacement + parlak normal
 * çizgileri + trail ışığı kullanır -> "görselin üstünde cam/su katmanı"
 * hissi (Noomo gibi), "havuza taş atma" halkası değil.
 */

const IMAGE_URL = "assets/websitezenilaydakapak.jpg";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false; // su arka planı + anka kuşunu elle kompozit edeceğiz
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const geometry = new THREE.PlaneGeometry(2, 2);

const fullscreenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* SIM ÇÖZÜNÜRLÜĞÜ                                                     */
/* ------------------------------------------------------------------ */
const SIM_SCALE = 0.38;
let simW = Math.round(window.innerWidth * SIM_SCALE);
let simH = Math.round(window.innerHeight * SIM_SCALE);

const rtOptions = {
  type: THREE.HalfFloatType,
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  depthBuffer: false,
  stencilBuffer: false,
};

// Dalga: R = şimdiki yükseklik, G = önceki yükseklik
let waveA = new THREE.WebGLRenderTarget(simW, simH, rtOptions);
let waveB = new THREE.WebGLRenderTarget(simW, simH, rtOptions);

// Trail: RG = akış yönü, B = iz yoğunluğu
let trailA = new THREE.WebGLRenderTarget(simW, simH, rtOptions);
let trailB = new THREE.WebGLRenderTarget(simW, simH, rtOptions);

let sceneRT = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  depthBuffer: true,
  stencilBuffer: false,
});

/* ------------------------------------------------------------------ */
/* 1. DALGA SİMÜLASYONU (dalga denklemi çözücü)                        */
/* ------------------------------------------------------------------ */
const waveMaterial = new THREE.ShaderMaterial({
  uniforms: {
    tPrev: { value: null },
    uTexel: { value: new THREE.Vector2(1 / simW, 1 / simH) },
    uAspect: { value: simW / simH },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uForce: { value: 0.0 },
    uRadius: { value: 0.075 }, // imleç ucundaki dalga başlangıç genişliği
    uDamping: { value: 0.98 },
  },
  vertexShader: fullscreenVertex,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D tPrev;
    uniform vec2 uTexel;
    uniform float uAspect;
    uniform vec2 uMouse;
    uniform vec2 uPrevMouse;
    uniform float uForce;
    uniform float uRadius;
    uniform float uDamping;

    float lineDist(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
      return length(pa - ba * h);
    }

    void main() {
      vec2 uv = vUv;
      vec4 data = texture2D(tPrev, uv);
      float current = data.r;
      float previous = data.g;

      float n = texture2D(tPrev, uv + vec2(0.0,  uTexel.y)).r;
      float s = texture2D(tPrev, uv - vec2(0.0,  uTexel.y)).r;
      float e = texture2D(tPrev, uv + vec2(uTexel.x, 0.0)).r;
      float w = texture2D(tPrev, uv - vec2(uTexel.x, 0.0)).r;

      float newHeight = (n + s + e + w) * 0.5 - previous;
      newHeight *= uDamping;

      vec2 p = uv;          p.x *= uAspect;
      vec2 a = uMouse;      a.x *= uAspect;
      vec2 b = uPrevMouse;  b.x *= uAspect;
      float d = lineDist(p, a, b);
      newHeight += smoothstep(uRadius, 0.0, d) * uForce;

      gl_FragColor = vec4(newHeight, current, 0.0, 1.0);
    }
  `,
});

/* ------------------------------------------------------------------ */
/* 2. TRAIL (flowmap) — ipeksi mouse izi + akış yönü                   */
/* ------------------------------------------------------------------ */
const trailMaterial = new THREE.ShaderMaterial({
  uniforms: {
    tMap: { value: null },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uVelocity: { value: new THREE.Vector2(0, 0) },
    uAspect: { value: simW / simH },
    uFalloff: { value: 0.18 },      // iz genişliği
    uDissipation: { value: 0.965 }, // iz ömrü (1'e yakın = uzun)
  },
  vertexShader: fullscreenVertex,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D tMap;
    uniform vec2 uMouse;
    uniform vec2 uVelocity;
    uniform float uAspect;
    uniform float uFalloff;
    uniform float uDissipation;

    void main() {
      vec4 color = texture2D(tMap, vUv) * uDissipation;

      vec2 cursor = vUv - uMouse;
      cursor.x *= uAspect;

      vec3 stamp = vec3(
        uVelocity * vec2(1.0, -1.0),
        1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0)
      );

      float falloff = smoothstep(uFalloff, 0.0, length(cursor));
      color.rgb = mix(color.rgb, stamp, vec3(falloff));

      gl_FragColor = color;
    }
  `,
});

/* ------------------------------------------------------------------ */
/* 3. ANA SAHNE — arka plan + Noomo tarzı su/cam overlay              */
/* ------------------------------------------------------------------ */
const texture = new THREE.TextureLoader().load(IMAGE_URL, (tex) => {
  backgroundMaterial.uniforms.uImageResolution.value.set(tex.image.width, tex.image.height);
});
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.generateMipmaps = false;

const backgroundMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: texture },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uImageResolution: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: fullscreenVertex,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uImageResolution;

    vec2 coverUv(vec2 uv) {
      vec2 s = uResolution;
      vec2 i = uImageResolution;
      float rs = s.x / s.y;
      float ri = i.x / i.y;
      vec2 newSize = rs < ri ? vec2(i.x * s.y / i.y, s.y)
                             : vec2(s.x, i.y * s.x / i.x);
      vec2 offset = (rs < ri ? vec2(newSize.x - s.x, 0.0)
                             : vec2(0.0, newSize.y - s.y)) * 0.5 / newSize;
      return uv * s / newSize + offset;
    }

    void main() {
      vec2 uv = coverUv(vUv);
      // Çalışmalar sayfasıyla aynı: arka planın üstüne %74 siyah (kuş hariç,
      // çünkü kuş bu arka plandan SONRA çiziliyor -> önde/parlak kalır)
      vec3 col = texture2D(uTexture, uv).rgb * 0.46;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
});

const waterOverlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  depthTest: false,
  uniforms: {
    uScene: { value: null },
    uWave: { value: null },
    uTrail: { value: null },
    uTexel: { value: new THREE.Vector2(1 / simW, 1 / simH) },
    uStrength: { value: 0.010 },
    uTrailStrength: { value: 0.002 },
    uOpacity: { value: 0.20 },
  },
  vertexShader: fullscreenVertex,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D uScene;
    uniform sampler2D uWave;
    uniform sampler2D uTrail;
    uniform vec2 uTexel;
    uniform float uStrength;
    uniform float uTrailStrength;
    uniform float uOpacity;

    void main() {
      float hL = texture2D(uWave, vUv - vec2(uTexel.x, 0.0)).r;
      float hR = texture2D(uWave, vUv + vec2(uTexel.x, 0.0)).r;
      float hD = texture2D(uWave, vUv - vec2(0.0, uTexel.y)).r;
      float hU = texture2D(uWave, vUv + vec2(0.0, uTexel.y)).r;
      vec2 normal = vec2(hL - hR, hD - hU);
      float slope = length(normal);

      vec3 trail = texture2D(uTrail, vUv).rgb;
      vec2 flow = trail.rg;
      float trailMask = trail.b;

      vec2 disp = normal * uStrength + flow * uTrailStrength;
      vec3 color = texture2D(uScene, vUv + disp).rgb;

      float rim = smoothstep(0.008, 0.075, slope);
      vec3 cyan = vec3(0.55, 0.95, 1.0);
      vec3 blue = vec3(0.12, 0.48, 0.95);
      vec3 pearl = vec3(0.90, 0.94, 1.0);

      vec3 light = cyan * rim * 0.07;
      light += pearl * pow(rim, 2.0) * 0.055;
      light += cyan * trailMask * 0.018;
      light += blue * pow(trailMask, 2.0) * 0.012;

      color += light;

      vec2 edgeUv = vUv * (1.0 - vUv);
      float alpha = pow(16.0 * edgeUv.x * edgeUv.y, 1.1);

      gl_FragColor = vec4(color, alpha * uOpacity);
    }
  `,
});

const sceneCopyMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uScene: { value: null },
  },
  vertexShader: fullscreenVertex,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uScene;

    void main() {
      gl_FragColor = vec4(texture2D(uScene, vUv).rgb, 1.0);
    }
  `,
});

const scene = new THREE.Scene();
scene.add(new THREE.Mesh(geometry, backgroundMaterial));

const waveScene = new THREE.Scene();
waveScene.add(new THREE.Mesh(geometry, waveMaterial));

const trailScene = new THREE.Scene();
trailScene.add(new THREE.Mesh(geometry, trailMaterial));

const waterScene = new THREE.Scene();
waterScene.add(new THREE.Mesh(geometry, waterOverlayMaterial));

const sceneCopyScene = new THREE.Scene();
sceneCopyScene.add(new THREE.Mesh(geometry, sceneCopyMaterial));

/* ------------------------------------------------------------------ */
/* 3.5  ANKA KUŞU (v20.glb) — cam/mavi model + kanat animasyonu        */
/* ------------------------------------------------------------------ */
const phoenixScene = new THREE.Scene();

const phoenixCamera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
phoenixCamera.position.set(0, 0, 5.2);
phoenixCamera.lookAt(0, 0, 0);

// Cam yansımaları için HDR yerine prosedürel ortam (harici dosya gerekmez)
const pmrem = new THREE.PMREMGenerator(renderer);
phoenixScene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// Hafif yönlü ışık (iridescence/clearcoat parlasın)
const keyLight = new THREE.DirectionalLight(0xd8f6ff, 3.0);
keyLight.position.set(2, 3, 4);
phoenixScene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x66aaff, 2.2);
rimLight.position.set(-3, -1, -2);
phoenixScene.add(rimLight);
phoenixScene.add(new THREE.AmbientLight(0x88c4ff, 0.4));

// Modeli yumuşak sallandırmak için kök grup
const phoenixGroup = new THREE.Group();
phoenixScene.add(phoenixGroup);

const basePhoenixGroupRotationY = THREE.MathUtils.degToRad(180);

let mixer = null;
let phoenix = null;

let phoenixGlassMaterial = null;

function applyBlueGlassMaterial(root) {
  phoenixGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#d8f8ff"),
    emissive: new THREE.Color("#5bbcff"),
    emissiveIntensity: 0.13,

    metalness: 0.02,
    roughness: 0.025,

    transmission: 0.92,
    thickness: 1.15,
    ior: 1.48,

    transparent: true,
    opacity: 0.48,

    clearcoat: 1,
    clearcoatRoughness: 0.01,

    iridescence: 1,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [220, 900],

    envMapIntensity: 4.8,

    side: THREE.DoubleSide,
    forceSinglePass: true,
    depthWrite: true,
    depthTest: true,
  });

phoenixGlassMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uPhoenixTime = { value: 0 };

  shader.fragmentShader = shader.fragmentShader.replace(
    "void main() {",
    `
      uniform float uPhoenixTime;

      void main() {
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <dithering_fragment>",
    `
      float fresnel = pow(
        1.0 - abs(dot(normalize(normal), normalize(-vViewPosition))),
        2.2
      );

      float vertical = smoothstep(-1.2, 1.2, vViewPosition.y);
      float shimmer = 0.5 + 0.5 * sin(
        vViewPosition.y * 7.0 +
        vViewPosition.x * 4.0 +
        uPhoenixTime * 0.8
      );

      vec3 deepBlue = vec3(0.18, 0.58, 1.00);
      vec3 glassBlue = vec3(0.58, 0.92, 1.00);
      vec3 silver = vec3(0.94, 0.98, 1.00);
      vec3 pearl = vec3(0.78, 0.88, 1.00);

      vec3 gradientColor = mix(deepBlue, glassBlue, vertical);
      gradientColor = mix(gradientColor, silver, fresnel * 0.85);
      gradientColor = mix(gradientColor, pearl, shimmer * 0.22);

      gl_FragColor.rgb = mix(gl_FragColor.rgb, gradientColor, 0.62);
      gl_FragColor.rgb += fresnel * vec3(0.8, 0.95, 1.0) * 0.85;
      gl_FragColor.rgb += shimmer * vec3(0.35, 0.65, 1.0) * 0.08;

      #include <dithering_fragment>
    `
  );

  phoenixGlassMaterial.userData.shader = shader;
};

  root.traverse((child) => {
    if (child.name === "trail") {
      child.visible = false;
      return;
    }

    if (child.isMesh) {
      child.material = phoenixGlassMaterial;
      child.frustumCulled = false;
    }
  });
}

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  "models/v20.glb",
  (gltf) => {
    phoenix = gltf.scene;

    // Modeli ortala ve sahnede tutarlı boyuta ölçekle
    const box = new THREE.Box3().setFromObject(phoenix);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 1.05; // daha küçük
    const scale = targetSize / maxDim;

    phoenix.position.sub(center.multiplyScalar(scale)); // merkeze al
    phoenix.scale.setScalar(scale);
    // Y ekseninde 200° çevrik, X/Z düz
    phoenix.rotation.set(0.05, -0.42, 0.12);

    // Sol üst köşe — ZENİLAYDA yazısının altı (biraz sağa kaydırıldı)
    phoenixGroup.position.set(-1.1, 0.7, 0);

    phoenixGroup.add(phoenix);
    applyBlueGlassMaterial(phoenix);

    // Giriş animasyonu: küçükten yumuşak açılış
    phoenixGroup.scale.setScalar(0.001);
    const start = performance.now();
    (function grow() {
      const t = Math.min((performance.now() - start) / 1600, 1);
      const e = 1 - Math.pow(1 - t, 3); // power3.out
      phoenixGroup.scale.setScalar(e);
      if (t < 1) requestAnimationFrame(grow);
    })();

    // Kanat çırpma animasyonu
    mixer = new THREE.AnimationMixer(phoenix);

    // Tüm klipleri hazırla, ada göre eriş
    const actions = {};
    gltf.animations.forEach((c) => {
      const a = mixer.clipAction(c);
      a.setLoop(THREE.LoopRepeat);
      actions[c.name] = a;
    });
    console.log("Anka kuşu klipleri:", Object.keys(actions));

    let current = null;
    function playClip(name) {
      const next = actions[name] || Object.values(actions)[0];
      if (!next || next === current) return;
      next.reset().fadeIn(0.4).play();
      if (current) current.fadeOut(0.4);
      current = next;
    }

    // Varsayılan: belirgin kanat çırpması
    playClip("Idle_MainPose_flying");

    // 1-2-3-4 tuşlarıyla klip değiştir (en iyi çırpmayı seç)
    const order = [
      "Idle_MainPose_flying",
      "Float_WingPulse",
      "Idle_MainPose_gliding",
      "Wing_CloseUp",
    ];
    window.addEventListener("keydown", (e) => {
      const i = parseInt(e.key, 10) - 1;
      if (i >= 0 && i < order.length) {
        playClip(order[i]);
        console.log("Oynatılan klip:", order[i]);
      }
    });
  },
  undefined,
  (err) => console.error("v20.glb yüklenemedi:", err)
);

/* ------------------------------------------------------------------ */
/* 4. MOUSE TAKİBİ                                                     */
/* ------------------------------------------------------------------ */
const mouse = new THREE.Vector2(0.5, 0.5);
const prevMouse = new THREE.Vector2(0.5, 0.5);
const velocity = new THREE.Vector2(0, 0);
let injectForce = 0.0;
let firstMove = true;

function updatePointer(x, y) {
  const nx = x / window.innerWidth;
  const ny = 1.0 - y / window.innerHeight;

  if (firstMove) {
    mouse.set(nx, ny);
    prevMouse.set(nx, ny);
    firstMove = false;
    return;
  }

  prevMouse.copy(mouse);
  mouse.set(nx, ny);

  const speed = mouse.distanceTo(prevMouse);
  injectForce = Math.min(0.01 + speed * 1.7, 0.11);

  // Trail akış yönü (ekran ölçeğine getirilmiş hız)
  velocity.set(mouse.x - prevMouse.x, mouse.y - prevMouse.y).multiplyScalar(22);
}

window.addEventListener("mousemove", (e) => updatePointer(e.clientX, e.clientY));
window.addEventListener(
  "touchmove",
  (e) => {
    const t = e.touches[0];
    if (t) updatePointer(t.clientX, t.clientY);
  },
  { passive: true }
);

/* ------------------------------------------------------------------ */
/* 5. ANİMASYON DÖNGÜSÜ                                                */
/* ------------------------------------------------------------------ */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const time = clock.elapsedTime;

  // --- Dalga simülasyonu (render target) ---
  waveMaterial.uniforms.tPrev.value = waveA.texture;
  waveMaterial.uniforms.uMouse.value.copy(mouse);
  waveMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
  waveMaterial.uniforms.uForce.value = injectForce;

  renderer.setRenderTarget(waveB);
  renderer.render(waveScene, camera);

  let tmp = waveA; waveA = waveB; waveB = tmp;

  // --- Trail (flowmap, render target) ---
  trailMaterial.uniforms.tMap.value = trailA.texture;
  trailMaterial.uniforms.uMouse.value.copy(mouse);
  trailMaterial.uniforms.uVelocity.value.copy(velocity);

  renderer.setRenderTarget(trailB);
  renderer.render(trailScene, camera);

  tmp = trailA; trailA = trailB; trailB = tmp;

  // İmleç durunca enjeksiyon ve akış söner; dalgalar yayılmaya devam eder.
  prevMouse.copy(mouse);
  injectForce *= 0.78;
  velocity.multiplyScalar(0.85);

  // === NOOMO TARZI KOMPOZIT ===
  // 1) Arka plan + phoenix önce ekran dışı texture'a çizilir.
  renderer.setRenderTarget(sceneRT);
  renderer.clear();

  renderer.render(scene, camera);

  if (mixer) mixer.update(delta);
  if (phoenix) {
    // yumuşak süzülme + mouse'a çok hafif tepki (base konum: 1.05)
    phoenixGroup.position.y = 0.7 + Math.sin(time * 0.8) * 0.08;
    phoenixGroup.rotation.z = Math.sin(time * 0.5) * 0.025;
    phoenixGroup.rotation.y = basePhoenixGroupRotationY + (mouse.x - 0.5) * 0.08;
    phoenixGroup.rotation.x = -(mouse.y - 0.5) * 0.08;
  }

  if (phoenixGlassMaterial?.userData.shader) {
  phoenixGlassMaterial.userData.shader.uniforms.uPhoenixTime.value = time;
  }
  renderer.clearDepth();
  renderer.render(phoenixScene, phoenixCamera);

  // 2) Sonra bu görüntü ekrana basılır ve üstünden su/cam overlay geçirilir.
  renderer.setRenderTarget(null);
  renderer.clear();

  sceneCopyMaterial.uniforms.uScene.value = sceneRT.texture;
  waterOverlayMaterial.uniforms.uScene.value = sceneRT.texture;
  waterOverlayMaterial.uniforms.uWave.value = waveA.texture;
  waterOverlayMaterial.uniforms.uTrail.value = trailA.texture;

  renderer.render(sceneCopyScene, camera);
  renderer.render(waterScene, camera);
}
animate();

/* ------------------------------------------------------------------ */
/* 6. RESIZE                                                           */
/* ------------------------------------------------------------------ */
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  sceneRT.setSize(w, h);

  phoenixCamera.aspect = w / h;
  phoenixCamera.updateProjectionMatrix();

  simW = Math.round(w * SIM_SCALE);
  simH = Math.round(h * SIM_SCALE);
  waveA.setSize(simW, simH);
  waveB.setSize(simW, simH);
  trailA.setSize(simW, simH);
  trailB.setSize(simW, simH);

  const texel = new THREE.Vector2(1 / simW, 1 / simH);
  waveMaterial.uniforms.uTexel.value.copy(texel);
  waveMaterial.uniforms.uAspect.value = simW / simH;
  trailMaterial.uniforms.uAspect.value = simW / simH;
  waterOverlayMaterial.uniforms.uTexel.value.copy(texel);
  backgroundMaterial.uniforms.uResolution.value.set(w, h);
});
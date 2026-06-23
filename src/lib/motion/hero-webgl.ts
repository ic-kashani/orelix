import { allowHeavyMotion } from "./env";

// Lazy, self-contained WebGL hero. A single full-screen textured quad with a
// cursor-reactive ripple + slow drift + navy grade + film grain. Three.js is
// dynamically imported so it never weighs down the critical path, and the whole
// thing only boots when allowHeavyMotion() passes (no reduced-motion, has WebGL,
// not a small screen). Otherwise the CSS background shows through unchanged.
export async function initHeroWebGL(): Promise<void> {
  const mount = document.querySelector<HTMLElement>("[data-hero-canvas]");
  if (!mount || !allowHeavyMotion()) return;

  const src = mount.getAttribute("data-hero-src");
  if (!src) return;

  const THREE = await import("three");

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const canvas = renderer.domElement;
  canvas.className = "hero-gl";
  mount.appendChild(canvas);

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = "anonymous";

  const texture = await new Promise<any>((resolve, reject) => {
    loader.load(src, resolve, undefined, reject);
  }).catch(() => null);

  if (!texture) {
    renderer.dispose();
    canvas.remove();
    return;
  }
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const uniforms = {
    uTexture: { value: texture },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uImgRes: {
      value: new THREE.Vector2(
        texture.image?.naturalWidth || texture.image?.width || 1,
        texture.image?.naturalHeight || texture.image?.height || 1
      ),
    },
    uScreenRes: { value: new THREE.Vector2(1, 1) },
    uTint: { value: new THREE.Color(0x0a1f44) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uHover;
      uniform vec2 uImgRes;
      uniform vec2 uScreenRes;
      uniform vec3 uTint;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

      void main() {
        // cover-fit the texture
        float screenAspect = uScreenRes.x / uScreenRes.y;
        float imgAspect = uImgRes.x / uImgRes.y;
        vec2 ratio = vec2(
          min(screenAspect / imgAspect, 1.0),
          min(imgAspect / screenAspect, 1.0)
        );
        vec2 uv = vec2(
          (vUv.x - 0.5) * (imgAspect < screenAspect ? 1.0 : ratio.x) + 0.5,
          (vUv.y - 0.5) * (imgAspect < screenAspect ? ratio.y / (ratio.x) * (screenAspect/imgAspect) : 1.0) + 0.5
        );
        // simpler robust cover
        vec2 cuv = (vUv - 0.5);
        if (screenAspect > imgAspect) {
          cuv.y *= imgAspect / screenAspect;
        } else {
          cuv.x *= screenAspect / imgAspect;
        }
        cuv += 0.5;

        // cursor ripple
        float d = distance(vUv, uMouse);
        float ripple = sin(d * 22.0 - uTime * 2.2) * 0.0035 * uHover;
        ripple += sin(d * 9.0 - uTime * 1.1) * 0.002;
        vec2 dir = normalize(cuv - uMouse + 0.0001);
        vec2 disp = dir * ripple;

        // slow ambient drift
        disp += vec2(
          sin(uTime * 0.12 + cuv.y * 3.0) * 0.0015,
          cos(uTime * 0.1 + cuv.x * 3.0) * 0.0015
        );

        vec3 col = texture2D(uTexture, cuv + disp).rgb;

        // navy grade: push shadows toward brand navy, keep highlights
        col = mix(col * uTint * 2.0, col, 0.55);
        col = mix(col, uTint, 0.18);

        // radial vignette
        float vig = smoothstep(1.15, 0.35, distance(vUv, vec2(0.5)));
        col *= mix(0.55, 1.05, vig);

        // subtle glow toward cursor
        col += (1.0 - smoothstep(0.0, 0.4, d)) * 0.06 * uHover;

        // film grain
        float g = hash(vUv * uScreenRes + uTime) - 0.5;
        col += g * 0.035;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  const resize = () => {
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uScreenRes.value.set(w, h);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // pointer → smoothed mouse + hover
  let targetX = 0.5;
  let targetY = 0.5;
  let hoverTarget = 0;
  mount.addEventListener(
    "pointermove",
    (e) => {
      const r = mount.getBoundingClientRect();
      targetX = (e.clientX - r.left) / r.width;
      targetY = 1 - (e.clientY - r.top) / r.height;
      hoverTarget = 1;
    },
    { passive: true }
  );
  mount.addEventListener("pointerleave", () => (hoverTarget = 0));

  // visibility gating
  let inView = true;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => (inView = en.isIntersecting)),
      { threshold: 0.01 }
    );
    io.observe(mount);
  }

  const start = performance.now();
  let raf = 0;
  const render = () => {
    raf = requestAnimationFrame(render);
    if (!inView || document.hidden) return;
    uniforms.uTime.value = (performance.now() - start) / 1000;
    const m = uniforms.uMouse.value;
    m.x += (targetX - m.x) * 0.06;
    m.y += (targetY - m.y) * 0.06;
    uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.05;
    renderer.render(scene, camera);
  };
  render();

  mount.classList.add("hero-gl-ready");

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(raf);
    renderer.dispose();
    material.dispose();
    texture.dispose();
  });
}

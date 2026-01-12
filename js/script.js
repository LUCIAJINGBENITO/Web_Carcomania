gsap.registerPlugin(ScrollTrigger);

/* ===== HELPERS ===== */
const getDotBounds = () => {
  const bar = document.querySelector(".loader-bar");
  const dot = document.querySelector(".loader-dot");
  const styles = getComputedStyle(bar);
  const paddingLeft = parseFloat(styles.paddingLeft);
  const paddingRight = parseFloat(styles.paddingRight);
  return {
    start: paddingLeft,
    end: bar.clientWidth - dot.offsetWidth - paddingRight
  };
};

/* ===== ESTADOS INICIALES ===== */
const bounds = getDotBounds();

gsap.set(".left", { x: -40, opacity: 0 });
gsap.set(".right", { x: 40, opacity: 0 });
gsap.set(".loader-bar", { scaleX: 0.9, opacity: 0 });
gsap.set(".loader-dot", { x: bounds.start });

gsap.set(".start-screen", { opacity: 0, pointerEvents: "none" });
gsap.set(".start-circle", { scale: 0, opacity: 0 });

/* ===== TIMELINE LOADER ===== */
const tl = gsap.timeline({ delay: 0.6 });

tl.to([".left", ".right"], {
  x: 0,
  opacity: 1,
  duration: 1.2,
  ease: "power3.out",
  stagger: 0.12
})
.to(".loader-bar", {
  scaleX: 1,
  opacity: 1,
  duration: 1,
  ease: "power3.out"
}, "-=0.9")
.to(".loader-dot", {
  x: bounds.end,
  duration: 3,
  ease: "expo.inOut"
}, "+=0.2")
.to([".left", ".right", ".loader-bar", ".loader-dot"], {
  x: 0,
  opacity: 0,
  duration: 0.3,
  ease: "power1.in"
}, "+=0.5")
.to(".start-screen", { opacity: 1, pointerEvents: "auto", duration: 0.01 })
.to(".start-circle", {
  scale: 1,
  opacity: 1,
  duration: 0.8,
  ease: "power3.out",
  onComplete: () => {
    gsap.to(".start-circle", {
      scale: 1.05, // respiración ligera
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
});

/* ===== CURSOR PERSONALIZADO ===== */
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

window.addEventListener("mousemove", (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power3.out" });
});

/* ===== FONDO REACTIVO AL RATÓN (CANVAS) ===== */
const canvas = document.createElement("canvas");
canvas.id = "mouse-bg";
document.body.insertBefore(canvas, document.body.firstChild);

const ctx = canvas.getContext("2d");

let w, h;
const resize = () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
};
resize();
window.addEventListener("resize", resize);

let mouse = { x: w / 2, y: h / 2 };
let target = { x: mouse.x, y: mouse.y };

window.addEventListener("mousemove", e => {
  target.x = e.clientX;
  target.y = e.clientY;
});

/* ===== PARTICLE GAME BACKGROUND ===== */
const particles = [];
const PARTICLE_COUNT = Math.floor(Math.random() * 50) + 50; // 50–100
const colors = [
  "rgba(255,255,255,0.8)",
  "rgba(123,193,207,0.8)",
  "rgba(86,87,156,0.8)",
  "rgba(200,200,200,0.6)"
];

let attractToCenter = false;
let explodeParticles = false;
let explosionPower = 0;
const center = { x: () => w / 2, y: () => h / 2 };

class Particle {
  constructor() {
    this.radius = gsap.utils.random(4, 10);
    this.x = gsap.utils.random(this.radius, w - this.radius);
    this.y = gsap.utils.random(this.radius, h - this.radius);
    this.vx = gsap.utils.random(-0.6, 0.6);
    this.vy = gsap.utils.random(-0.6, 0.6);
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.mass = this.radius * 0.5;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bordes
    if (this.x <= this.radius || this.x >= w - this.radius) this.vx *= -1;
    if (this.y <= this.radius || this.y >= h - this.radius) this.vy *= -1;

    // Cursor repulsión
    const dxm = this.x - mouse.x;
    const dym = this.y - mouse.y;
    const distMouse = Math.sqrt(dxm * dxm + dym * dym);
    const forceRadius = 120;

    if (distMouse < forceRadius) {
      const force = (forceRadius - distMouse) / forceRadius;
      this.vx += (dxm / distMouse) * force * 0.6;
      this.vy += (dym / distMouse) * force * 0.6;
    }

    // Atracción al centro
    if (attractToCenter) {
      const dx = center.x() - this.x;
      const dy = center.y() - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
      const force = Math.min(1, 80 / dist);
      this.vx += (dx / dist) * force * 0.15;
      this.vy += (dy / dist) * force * 0.15;
    }

    // Explosión
    if (explodeParticles) {
      const dx = this.x - center.x();
      const dy = this.y - center.y();
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
      this.vx += (dx / dist) * explosionPower * 6;
      this.vy += (dy / dist) * explosionPower * 6;
    }

    // Fricción
    this.vx *= 0.99;
    this.vy *= 0.99;
  }
}

// Colisiones entre partículas
function resolveCollisions() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = p1.radius + p2.radius;
      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = p1.x + Math.cos(angle) * minDist;
        const ty = p1.y + Math.sin(angle) * minDist;
        const ax = (tx - p2.x) * 0.05;
        const ay = (ty - p2.y) * 0.05;
        p1.vx -= ax;
        p1.vy -= ay;
        p2.vx += ax;
        p2.vy += ay;
      }
    }
  }
}

// Inicializar partículas
function initParticles() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}
initParticles();

/* ===== RENDER LOOP ===== */
function render() {
  mouse.x += (target.x - mouse.x) * 0.08;
  mouse.y += (target.y - mouse.y) * 0.08;

  ctx.clearRect(0, 0, w, h);

  // Fondo reactivo
  const gradient = ctx.createRadialGradient(
    mouse.x, mouse.y, 0,
    mouse.x, mouse.y, 400
  );
  gradient.addColorStop(0, "rgba(123,193,207,0.35)");
  gradient.addColorStop(0.4, "rgba(86,87,156,0.15)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Partículas
  if (document.querySelector(".start-screen").style.pointerEvents !== "none") {
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    resolveCollisions();
  }

  // Explosión fade
  if (explodeParticles) explosionPower *= 0.92;

  requestAnimationFrame(render);
}
render();

/* ===== INTERACCIONES CURSOR ===== */
const startCircle = document.querySelector(".start-circle");

startCircle.addEventListener("mouseenter", () => {
  gsap.to(cursor, { scale: 1.6, borderColor: "#7BC1CF", backgroundColor: "rgba(123,193,207,0.2)", duration: 0.3, ease: "power3.out" });
  attractToCenter = true;
});

startCircle.addEventListener("mouseleave", () => {
  gsap.to(cursor, { scale: 1, borderColor: "rgba(255,255,255,0.8)", backgroundColor: "rgba(255,255,255,0.15)", duration: 0.3, ease: "power3.out" });
  attractToCenter = false;
});

/* ===== ANIMACIÓN CLICK COMENZAR ===== */
startCircle.addEventListener("click", () => {
  explodeParticles = true;
  explosionPower = 1;

  gsap.to(canvas, { opacity: 0, duration: 0.8, ease: "power2.out" });

  startCircle.style.background = "linear-gradient(45deg, #000000, #3F0043, #56579C, #7BC1CF)";
  startCircle.style.backgroundSize = "300% 300%";

  const tlClick = gsap.timeline({
    onComplete: () => window.location.href = "index.html"
  });

  tlClick.to(startCircle, {
    scale: 3,
    opacity: 0,
    filter: "blur(12px)",
    duration: 0.7,
    ease: "power3.in"
  });

  tlClick.to(startCircle, {
    backgroundPosition: "100% 100%",
    duration: 0.7,
    ease: "power3.in"
  }, 0);
});

/* ===== REVEAL SCROLL ESTABLE ===== */
if (document.querySelector(".reveal-section")) {
  const tlReveal = gsap.timeline({
    scrollTrigger: {
      trigger: ".reveal-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      pin: true,
    }
  });

  tlReveal.fromTo(".reveal-shape", { y: "0vh" }, { y: "-120vh", ease: "none" });
  tlReveal.fromTo(".reveal-text", { color: "#555" }, { color: "#ffffff", ease: "none" }, 0);
}

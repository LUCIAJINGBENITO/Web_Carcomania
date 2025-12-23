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

const startCircle = document.querySelector(".start-circle");

startCircle.addEventListener("mouseenter", () => {
  gsap.to(cursor, { backgroundColor: "#7BC1CF", scale: 1.3, duration: 0.3 });
});

startCircle.addEventListener("mouseleave", () => {
  gsap.to(cursor, { backgroundColor: "#ffffff", scale: 1, duration: 0.3 });
});

/* ===== ANIMACIÓN CLICK COMENZAR ===== */
startCircle.addEventListener("click", () => {
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

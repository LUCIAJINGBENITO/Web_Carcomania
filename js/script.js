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

const tl = gsap.timeline({ delay: 0.6 });

/* ===== ENTRADA ===== */
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

/* ===== MOVIMIENTO DEL PUNTO ===== */
.to(".loader-dot", {
  x: bounds.end,
  duration: 3,
  ease: "expo.inOut"
}, "+=0.2")

/* ===== ATRACCIÓN AL CENTRO Y DESAPARICIÓN ===== */
.to([".left", ".right", ".loader-bar", ".loader-dot"], {
  x: 0,
  opacity: 0,
  duration: 0.3,
  ease: "power1.in"
}, "+=0.5")

/* ===== APARICIÓN DEL CÍRCULO ===== */
.to(".start-screen", { opacity: 1, pointerEvents: "auto", duration: 0.01 })
.to(".start-circle", {
  scale: 1, // tamaño inicial visible
  opacity: 1,
  duration: 0.8,
  ease: "power3.out",
  onComplete: () => {
    // respiración constante
    gsap.to(".start-circle", {
      scale: 1.05, // respiración ligera sin reducir demasiado
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
});

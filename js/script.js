gsap.registerPlugin(ScrollTrigger);

/* ===== CÁLCULO CORRECTO DEL RECORRIDO ===== */
const getDotTravel = () => {
    const bar = document.querySelector(".loader-bar");
    const dot = document.querySelector(".loader-dot");
  
    const styles = getComputedStyle(bar);
    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingRight = parseFloat(styles.paddingRight);
  
    return bar.clientWidth - dot.offsetWidth - paddingLeft - paddingRight;
};

/* ===== ESTADOS INICIALES ===== */
gsap.set(".left", { x: -40, opacity: 0 });
gsap.set(".right", { x: 40, opacity: 0 });
gsap.set(".loader-bar", { scaleX: 0.9, opacity: 0 });

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
  x: getDotTravel,
  duration: 3,
  ease: "expo.inOut"
}, "+=0.2")

/* ===== MICRO TENSIÓN FINAL ===== */
.to(".loader-bar", {
  scaleX: 1.05,
  duration: 0.4,
  ease: "power1.out"
})

/* ===== COLAPSO NOOMO ===== */
.add("collapse")
.to(".loader-text", {
  letterSpacing: "-0.15em",
  opacity: 0,
  duration: 0.5,
  ease: "power2.in"
}, "collapse")
.to(".loader-container", {
  scale: 0.85,
  filter: "blur(12px)",
  opacity: 0,
  duration: 0.9,
  ease: "power3.in"
}, "collapse+=0.1")

/* ===== START ===== */
.to(".start-screen", {
  opacity: 1,
  duration: 0.1
})
.to(".start-circle", {
  opacity: 1,
  scale: 1,
  duration: 1,
  ease: "power3.out"
});

/* ===== RESPIRACIÓN SUTIL ===== */
gsap.to(".start-circle", {
  scale: 1.06,
  duration: 2.8,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

# Web_Carcomania
startCircle.addEventListener("click", () => {
  // Animación de salida
  gsap.to(".start-screen", {
    opacity: 0,
    scale: 1.2,
    duration: 0.6,
    ease: "power3.inOut",
    onComplete: () => {
      // Redirigir a index.html
      window.location.href = "index.html";
    }
  });
});

.profile-hero::after {
  content: "";
  position: absolute;
  top: -40%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(
    circle at top,
    rgba(255,255,255,0.06),
    transparent 60%
  );
  pointer-events: none;
}
# Web_Carcomania



Pruebas

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



esto es una prueba :) 

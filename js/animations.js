gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CURSOR GLOBAL
  ================================ */
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  window.addEventListener("mousemove", e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power3.out" });
  });

  /* ===============================
     HOVER-TEXT GLOBAL
  ================================ */
  const hoverTexts = document.querySelectorAll(".hover-text");

  window.addEventListener("mousemove", e => {
    hoverTexts.forEach(el => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // posición relativa dentro del texto
      const y = e.clientY - rect.top;

      // Convertimos a porcentaje
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

      // Movemos el gradiente para que la "lupa" siga el cursor
      el.style.background = `radial-gradient(circle 50px at ${px}% ${py}%, #7BC1CF, #fff)`;
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
    });
  });

  /* ===============================
     SCROLLTRIGGER ENTRADAS
  ================================ */
  gsap.from(".user-card, .garage-card, .accessory-mini", {
    scrollTrigger: {
      trigger: ".user-area",
      start: "top 70%",
    },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    stagger: 0.15
  });

  gsap.from(".accessories-title", {
    scrollTrigger: {
      trigger: ".accessories-section",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
  });

  gsap.from(".accessories-subtitle", {
    scrollTrigger: {
      trigger: ".accessories-section",
      start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 0.9,
    delay: 0.15,
    ease: "power3.out"
  });

  /* ===============================
     MATCHMEDIA
  ================================ */
  const mm = gsap.matchMedia();

  /* -------- DESKTOP: hover, tilt 3D, parallax -------- */
  mm.add("(min-width: 769px)", () => {
    document.querySelectorAll(".accessory-mini").forEach(card => {
      const glow = card.querySelector(".glow");
      const img = card.querySelector("img");

      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Tilt 3D
        const rotX = y * 0.05;
        const rotY = x * 0.05;
        gsap.to(card, { rotationX: -rotX, rotationY: rotY, duration: 0.3, ease: "power2.out" });

        // Parallax interno
        gsap.to(img, { x: x * 0.05, y: y * 0.05, duration: 0.3, ease: "power2.out" });

        // Glow dinámico
        if (glow) {
          glow.style.opacity = 1;
          glow.style.transform = `translate(${x}px, ${y}px)`;
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(img, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
        if (glow) {
          glow.style.opacity = 0;
          glow.style.transform = `translate(0,0)`;
        }
      });
    });
  });

  /* -------- MOBILE: parallax y glow ligero -------- */
  mm.add("(max-width: 768px)", () => {
    document.querySelectorAll(".accessory-mini").forEach(card => {
      const glow = card.querySelector(".glow");
      const img = card.querySelector("img");

      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Parallax más suave
        gsap.to(img, { x: x * 0.02, y: y * 0.02, duration: 0.3, ease: "power2.out" });

        // Glow más suave
        if (glow) {
          glow.style.opacity = 0.6;
          glow.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(img, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
        if (glow) {
          glow.style.opacity = 0;
          glow.style.transform = `translate(0,0)`;
        }
      });
    });
  });

});

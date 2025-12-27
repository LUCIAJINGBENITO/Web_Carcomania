gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  const mm = gsap.matchMedia();

  /* ===============================
     DESKTOP (hover + parallax)
  ================================ */

  mm.add("(min-width: 769px)", () => {

    gsap.from(".accessories-title", {
      scrollTrigger: {
        trigger: ".accessories-section",
        start: "top 75%",
      },
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    });

    gsap.from(".accessories-subtitle", {
      scrollTrigger: {
        trigger: ".accessories-section",
        start: "top 75%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.15,
      ease: "power3.out"
    });

    gsap.from(".accessory-card", {
      scrollTrigger: {
        trigger: ".accessories-section",
        start: "top 65%",
      },
      y: 80,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.18
    });

    document.querySelectorAll(".accessory-card").forEach(card => {
      const img = card.querySelector("img");

      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -12, duration: 0.45, ease: "power3.out" });
        gsap.to(img, { scale: 1.22, duration: 0.9, ease: "power3.out" });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.5, ease: "power3.out" });
        gsap.to(img, { scale: 1.1, duration: 0.9, ease: "power3.out" });
      });
    });

    document.querySelectorAll(".accessory-img img").forEach(img => {
      gsap.to(img, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6
        }
      });
    });

  });

  /* ===============================
     MOBILE (simple, limpio)
  ================================ */

  mm.add("(max-width: 768px)", () => {

    gsap.from(".accessories-title, .accessories-subtitle", {
      scrollTrigger: {
        trigger: ".accessories-section",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.15
    });

    gsap.from(".accessory-card", {
      scrollTrigger: {
        trigger: ".accessories-section",
        start: "top 70%",
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.2
    });

  });

});

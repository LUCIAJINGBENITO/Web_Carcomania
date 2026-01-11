
gsap.registerPlugin(ScrollTrigger);

// Fade-in título
gsap.from(".carco-nosotros-title", {
  scrollTrigger: {
    trigger: ".carco-nosotros-title",
    start: "top 80%",
    toggleActions: "play none none none"
  },
  opacity: 0,
  y: 40,
  duration: 1,
  ease: "power2.out"
});

// Fade-in texto
gsap.from(".carco-nosotros-text", {
  scrollTrigger: {
    trigger: ".carco-nosotros-text",
    start: "top 85%",
    toggleActions: "play none none none"
  },
  opacity: 0,
  y: 40,
  duration: 1,
  ease: "power2.out"
});

// Fade + Zoom para imágenes
gsap.utils.toArray(".nos-img").forEach((img, i) => {
  gsap.fromTo(img,
    {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    {
      scrollTrigger: {
        trigger: img,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      delay: i * 0.1
    }
  );
});

// Agrupación dinámica (parallax) de imágenes
gsap.to(".nos-img", {
  scrollTrigger: {
    trigger: ".carco-nosotros-images",
    start: "top center",
    end: "bottom center",
    scrub: true
  },
  y: -35,
  x: 40,
  scale: 0.95,
  ease: "power2.out"
});


gsap.utils.toArray(".nos-img").forEach((img, i) => {
  gsap.to(img, {
    scrollTrigger: {
      trigger: ".carco-nosotros-images",
      start: "top center",
      end: "bottom center",
      scrub: true
    },
    x: () => {
      const bounds = img.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      return centerX - (bounds.left + bounds.width / 2);
    },
    y: () => {
      const bounds = img.getBoundingClientRect();
      const centerY = window.innerHeight / 2;
      return centerY - (bounds.top + bounds.height / 2) - 100;
    },
    scale: 0.85,
    ease: "power2.out"
  });
});


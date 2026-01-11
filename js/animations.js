gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CURSOR GLOBAL
  ================================ */
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power3.out" });
  });

  /* ===============================
     CANVAS LIQUID DISTORTION / RIPPLES
  ================================ */
  const canvas = document.createElement("canvas");
  canvas.id = "mouse-bg";
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext("2d");

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const ripples = [];
  const maxRadius = 100;

  window.addEventListener("mousemove", e => {
    ripples.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 0.4 });
  });

  function drawCanvas() {
    ctx.clearRect(0, 0, w, h);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 4;
      r.alpha *= 0.95;

      const gradient = ctx.createRadialGradient(r.x, r.y, r.radius * 0.2, r.x, r.y, r.radius);
      gradient.addColorStop(0, `rgba(123,193,207,${r.alpha})`);
      gradient.addColorStop(0.4, `rgba(86,87,156,${r.alpha * 0.2})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(r.x - r.radius, r.y - r.radius, r.radius * 2, r.radius * 2);

      if (r.alpha < 0.01 || r.radius > maxRadius) ripples.splice(i, 1);
    }

    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();

  /* ===============================
     HOVER-TEXT GLOBAL
  ================================ */
  const hoverTexts = document.querySelectorAll(".hover-text");

  window.addEventListener("mousemove", e => {
    hoverTexts.forEach(el => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

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
     MATCHMEDIA: TILT, PARALLAX Y GLOW
  ================================ */
  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", () => {
    document.querySelectorAll(".accessory-mini").forEach(card => {
      const glow = card.querySelector(".glow");
      const img = card.querySelector("img");

      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, { rotationX: -y * 0.05, rotationY: x * 0.05, duration: 0.3, ease: "power2.out" });
        gsap.to(img, { x: x * 0.05, y: y * 0.05, duration: 0.3, ease: "power2.out" });

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

  mm.add("(max-width: 768px)", () => {
    document.querySelectorAll(".accessory-mini").forEach(card => {
      const glow = card.querySelector(".glow");
      const img = card.querySelector("img");

      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(img, { x: x * 0.02, y: y * 0.02, duration: 0.3, ease: "power2.out" });
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

  /* ===============================
   USER PANEL <details> GSAP
  =============================== */
  document.querySelectorAll('.panel-accordion').forEach(accordion => {
    const btn = accordion.querySelector('.panel-header');
    const content = accordion.querySelector('.panel-content');
    const arrow = accordion.querySelector('.arrow-icon');
  
    // Estado inicial: ocultar contenido
    gsap.set(content, { height: 0, opacity: 0 });
  
    btn.addEventListener('click', () => {
      const isOpen = accordion.classList.contains('open');
  
      if (isOpen) {
        // Cerrar
        gsap.to(content, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
        gsap.to(arrow, { rotation: 0, duration: 0.4, ease: "power2.inOut" });
        accordion.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        // Abrir
        const fullHeight = content.scrollHeight;
        gsap.to(content, { height: fullHeight, opacity: 1, duration: 0.4, ease: "power2.inOut" });
        gsap.to(arrow, { rotation: 90, duration: 0.4, ease: "power2.inOut" });
        accordion.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  window.addEventListener('load', () => {
    const row = document.querySelector('.row.g-4.align-cards');
    if (!row) return;
  
    const cols = row.querySelectorAll('.col-md-6');
    let maxHeight = 0;
  
    // Calcula altura máxima
    cols.forEach(col => {
      const card = col.querySelector('.user-card');
      if (card) {
        const h = card.offsetHeight;
        if (h > maxHeight) maxHeight = h;
      }
    });
  
    // Aplica altura máxima a todas las tarjetas
    cols.forEach(col => {
      const card = col.querySelector('.user-card');
      if (card) card.style.height = maxHeight + 'px';
    });
  });

  /* ===============================
     FILTROS Y ORDEN CATALOGO
  ================================ */
  const categoryButtons = document.querySelectorAll('.category-filters button');
  const priceButtons = document.querySelectorAll('.price-filters button');
  const sortSelect = document.querySelector('.catalog-sort select');
  const cards = document.querySelectorAll('.catalog-card');

  let activeCategory = 'all';
  let activePrice = 'all';
  let activeSort = 'default';

  function filterCards() {
    cards.forEach(card => {
      const cat = card.dataset.category;
      const price = parseFloat(card.dataset.price);
      const isNew = card.dataset.new === 'true';
      const isPopular = card.dataset.popular === 'true';

      let categoryMatch = activeCategory === 'all' || cat === activeCategory;

      let priceMatch = true;
      if (activePrice !== 'all') {
        if (activePrice === '20+') priceMatch = price > 20;
        else {
          const [min, max] = activePrice.split('-').map(Number);
          priceMatch = price >= min && price <= max;
        }
      }

      let sortMatch = true;
      if (activeSort === 'new') sortMatch = isNew;
      if (activeSort === 'popular') sortMatch = isPopular;

      card.style.display = categoryMatch && priceMatch && sortMatch ? 'flex' : 'none';
    });

    // Ordenar por precio asc/desc si corresponde
    const grid = document.querySelector('.catalog-grid');
    const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');

    if (activeSort === 'price-asc') visibleCards.sort((a,b)=>parseFloat(a.dataset.price)-parseFloat(b.dataset.price));
    if (activeSort === 'price-desc') visibleCards.sort((a,b)=>parseFloat(b.dataset.price)-parseFloat(a.dataset.price));

    visibleCards.forEach(card => grid.appendChild(card));
  }

  // Filtrar por categoría
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.filter;
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCards();
    });
  });

  // Filtrar por precio
  priceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activePrice = btn.dataset.price;
      priceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCards();
    });
  });

  // Ordenar y filtrar por select
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;

      // Si seleccionamos “Nuevos” o “Populares”
      if (sortSelect) {
        sortSelect.addEventListener('change', () => {
          activeSort = sortSelect.value;
          filterCards();
        });
      }
    });
  }

  /* ===============================
     ACORDEON DESCRIPCIÓN EXTENDIDA
  ================================ */
  const toggles = document.querySelectorAll(".accordion-toggle");

  toggles.forEach(toggle => {
    const arrow = toggle.querySelector(".arrow-icon"); // seleccionamos la flecha
    const text = toggle.querySelector(".accordion-text"); // el texto si quieres manejarlo separado

    toggle.addEventListener("click", () => {
      const content = toggle.nextElementSibling;
      const isOpen = content.style.maxHeight;

      if (isOpen) {
        // cerrar
        content.style.maxHeight = null;
        gsap.to(arrow, { rotation: 0, duration: 0.35, ease: "power2.inOut" });
      } else {
        // abrir
        content.style.maxHeight = content.scrollHeight + "px";
        gsap.to(arrow, { rotation: 180, duration: 0.35, ease: "power2.inOut" });
      }
    });
  });

  /* ===============================
     NUEVO JS: Productos relacionados
  ================================ */
  document.querySelectorAll(".related-card").forEach(card => {
    const img = card.querySelector("img");

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;

      gsap.to(card, { rotationX: -y*0.05, rotationY: x*0.05, duration: 0.3, ease: "power2.out" });
      gsap.to(img, { x: x*0.03, y: y*0.03, duration: 0.3, ease: "power2.out" });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(img, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    });
  });

  /* ===============================
    ACORDEON FAQ / INFORMACIÓN ADICIONAL
  =============================== */
  const faqToggles = document.querySelectorAll(".faq-toggle");

  faqToggles.forEach(toggle => {
    const arrow = toggle.querySelector(".arrow-icon");
    const content = toggle.nextElementSibling;

    toggle.addEventListener("click", () => {
      const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

      if (isOpen) {
        // cerrar
        gsap.to(content, { maxHeight: 0, opacity: 0, duration: 0.35, ease: "power2.inOut" });
        gsap.to(arrow, { rotation: 0, duration: 0.35, ease: "power2.inOut" });
      } else {
        // abrir
        gsap.to(content, { maxHeight: content.scrollHeight + "px", opacity: 1, duration: 0.35, ease: "power2.inOut" });
        gsap.to(arrow, { rotation: 90, duration: 0.35, ease: "power2.inOut" });
      }
    });
  });


});

// ===========================
// CARRITO + ANIMACIONES
// ===========================
(() => {
  // ---------- ELEMENTOS DEL CARRITO ----------
  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cartPanel');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartClose = document.getElementById('cartClose');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');

  if (!cartBtn || !cartPanel || !cartBackdrop || !cartClose || !cartItemsContainer) return;

  // ---------- CARRITO DESDE LOCALSTORAGE ----------
  let cart = JSON.parse(localStorage.getItem('carcoCart')) || [];

  const saveCart = () => localStorage.setItem('carcoCart', JSON.stringify(cart));

  const renderCart = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;
      count += item.qty;

      const div = document.createElement('div');
      div.className = 'carco-cart-item';
      div.setAttribute('data-price', item.price);
      div.setAttribute('data-qty', item.qty);
      div.innerHTML = `
        <div class="carco-cart-thumb">
          <img src="${item.img}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" />
        </div>
        <div>
          <div class="carco-cart-info-title">${item.name}</div>
          <div class="carco-cart-meta">${item.meta || ''}</div>
          <div class="carco-cart-qty mt-1">
            <button class="carco-cart-qty-btn" data-action="minus">-</button>
            <span class="carco-cart-qty-value">${item.qty}</span>
            <button class="carco-cart-qty-btn" data-action="plus">+</button>
          </div>
        </div>
        <div class="text-end">
          <div class="carco-cart-price"><span class="carco-cart-line-price">${lineTotal.toFixed(2)}</span>€</div>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartTotalEl.textContent = total.toFixed(2);
    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? 'flex' : 'none';
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.slug === product.slug);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({...product, qty: 1});
    }
    saveCart();
    renderCart();
  };

  // ---------- EVENTOS DEL CARRITO ----------
  cartBtn.addEventListener('click', () => {
    cartPanel.classList.add('show');
    cartBackdrop.classList.add('show');
  });

  cartClose.addEventListener('click', () => {
    cartPanel.classList.remove('show');
    cartBackdrop.classList.remove('show');
  });

  cartBackdrop.addEventListener('click', () => {
    cartPanel.classList.remove('show');
    cartBackdrop.classList.remove('show');
  });

  // Evita que clicks dentro del panel cierren el carrito
  cartPanel.addEventListener('click', (e) => e.stopPropagation());

  cartItemsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.carco-cart-qty-btn');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const itemDiv = btn.closest('.carco-cart-item');
    const index = Array.from(cartItemsContainer.children).indexOf(itemDiv);
    if (index === -1) return;

    if (action === 'plus') cart[index].qty++;
    if (action === 'minus') cart[index].qty--;

    if (cart[index].qty <= 0) cart.splice(index, 1);

    saveCart();
    renderCart();
  });

  renderCart();

  // ---------- BOTONES AÑADIR EN CATALOGO ----------
  const addButtons = document.querySelectorAll('.catalog-card .btn-edit');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.catalog-card');
      const product = {
        name: card.querySelector('h3').textContent,
        price: parseFloat(card.getAttribute('data-price')),
        slug: card.getAttribute('data-slug'),
        img: card.querySelector('img').src,
        meta: card.querySelector('.catalog-badge')?.textContent || ''
      };
      addToCart(product);
    });
  });

  // ===========================
  // ANIMACIONES GSAP
  // ===========================
  if (typeof gsap !== 'undefined') {
    gsap.from(".carco-hero-bg", {
      scale: 0.9,
      opacity: 0,
      duration: 1.8,
      ease: "power3.out"
    });

    gsap.from(".carco-hero-car img", {
      y: 60,
      opacity: 0,
      duration: 1.4,
      ease: "power3.out",
      delay: 0.3
    });
  }

  // ===========================
  // ANIMACIONES AOS
  // ===========================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      easing: 'ease-out-cubic'
    });
  }

  // ===========================
  // OBSERVER SECCIONES
  // ===========================
  const sections = document.querySelectorAll('.comunidad-section');
  sections.forEach(section => {
    section.style.opacity = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.style.transition = "opacity 1s ease-out";
            section.style.opacity = 1;
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
  });

  // ===========================
  // CHECKOUT RESUMEN
  // ===========================
  (() => {
    const checkoutSummary = document.getElementById('checkoutSummary');
    const confirmBtn = document.querySelector('.btn-success');

    // Solo ejecutamos si estamos en checkout
    if (!checkoutSummary) return;

    function renderCheckout() {
      checkoutSummary.innerHTML = '';
      let total = 0;

      if(cart.length === 0){
        checkoutSummary.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
      }

      cart.forEach(item => {
        const lineTotal = (item.price * item.qty).toFixed(2);
        total += item.price * item.qty;

        const div = document.createElement('div');
        div.classList.add('checkout-item');

        div.innerHTML = `
          <div>
            <img src="${item.img}" class="checkout-thumb" alt="${item.name}">
            <div class="checkout-info">
              <span class="checkout-name">${item.name}</span>
              <span class="checkout-price">${item.price.toFixed(2)} € x ${item.qty}</span>
            </div>
          </div>
          <div class="checkout-line-price">${lineTotal} €</div>
        `;

        checkoutSummary.appendChild(div);
      });

      const totalDiv = document.createElement('div');
      totalDiv.classList.add('checkout-item');
      totalDiv.style.fontWeight = '700';
      totalDiv.style.marginTop = '1rem';
      totalDiv.innerHTML = `<span>Total</span><span>${total.toFixed(2)} €</span>`;
      checkoutSummary.appendChild(totalDiv);
    }

    document.addEventListener('DOMContentLoaded', renderCheckout);

    // Confirmar pedido
    if(confirmBtn){
      confirmBtn.addEventListener('click', () => {
        localStorage.removeItem('carcoCart'); // vaciar carrito
        alert('¡Pedido confirmado! Gracias por tu compra.');
        window.location.href = 'index.html';
      });
    }

  })();


})();

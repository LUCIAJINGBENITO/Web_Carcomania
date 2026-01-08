const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

function openCart() {
  cartPanel.classList.add('show');
  cartBackdrop.classList.add('show');
}

function closeCart() {
  cartPanel.classList.remove('show');
  cartBackdrop.classList.remove('show');
}

function updateCartSummary() {
  const items = cartItemsContainer.querySelectorAll('.carco-cart-item');
  let total = 0;
  let count = 0;

  items.forEach(item => {
    const price = parseFloat(item.getAttribute('data-price')) || 0;
    const qty = parseInt(item.getAttribute('data-qty')) || 0;
    const lineTotal = price * qty;

    item.querySelector('.carco-cart-qty-value').textContent = qty;
    item.querySelector('.carco-cart-line-price').textContent = lineTotal.toFixed(2);

    total += lineTotal;
    count += qty;
  });

  cartTotalEl.textContent = total.toFixed(2);
  cartCountEl.textContent = count;
  cartCountEl.style.display = count > 0 ? 'flex' : 'none';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

cartItemsContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.carco-cart-qty-btn');
  if (!btn) return;

  const action = btn.getAttribute('data-action');
  const item = btn.closest('.carco-cart-item');
  let qty = parseInt(item.getAttribute('data-qty')) || 0;

  if (action === 'plus') qty++;
  if (action === 'minus') qty--;

  if (qty <= 0) {
    item.remove();
  } else {
    item.setAttribute('data-qty', qty);
  }

  updateCartSummary();
});

updateCartSummary();



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


AOS.init({
  once: true,
  easing: 'ease-out-cubic'
});

(function () {
  // --- State ---
  let cart = JSON.parse(sessionStorage.getItem('lumoraCart') || '[]');

  // --- Helpers ---
  function save() { sessionStorage.setItem('lumoraCart', JSON.stringify(cart)); }

  function totalItems() { return cart.reduce((s, i) => s + i.qty, 0); }

  function totalPrice() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

  function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

  // --- Update all count badges ---
  function updateBadges() {
    const n = totalItems();
    document.querySelectorAll('#cartCount, #cartCountCanvas').forEach(el => {
      el.textContent = n;
      el.style.display = n === 0 ? 'none' : '';
    });
  }

  // --- Render cart items in offcanvas ---
  function renderCart() {
    const container = document.getElementById('cartItems');
    const empty = document.getElementById('emptyCart');
    const summary = document.getElementById('cartSummary');
    if (!container) return;

    if (cart.length === 0) {
      if (empty) empty.classList.remove('d-none');
      if (summary) summary.classList.add('d-none');
      container.querySelectorAll('.cart-item').forEach(el => el.remove());
      return;
    }

    if (empty) empty.classList.add('d-none');
    if (summary) summary.classList.remove('d-none');

    // Clear existing items
    container.querySelectorAll('.cart-item').forEach(el => el.remove());

    cart.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'cart-item d-flex gap-3 align-items-start';
      div.innerHTML = `
        <div class="order-thumb bg-light rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:56px;height:56px;font-size:1.5rem">
          ${item.emoji || '🛍️'}
        </div>
        <div class="flex-grow-1">
          <div class="fw-medium small">${item.name}</div>
          <div class="text-muted small">${fmt(item.price)} × ${item.qty}</div>
          <div class="d-flex align-items-center gap-2 mt-1">
            <button class="btn btn-sm btn-outline-dark py-0 px-2 cart-qty-btn" data-idx="${idx}" data-delta="-1">−</button>
            <span class="small">${item.qty}</span>
            <button class="btn btn-sm btn-outline-dark py-0 px-2 cart-qty-btn" data-idx="${idx}" data-delta="1">+</button>
          </div>
        </div>
        <div class="d-flex flex-column align-items-end gap-1">
          <span class="fw-semibold small">${fmt(item.price * item.qty)}</span>
          <button class="btn btn-link text-danger p-0 small cart-remove" data-idx="${idx}"><i class="bi bi-trash"></i></button>
        </div>
      `;
      container.appendChild(div);
    });

    // Totals
    const sub = document.getElementById('cartSubtotal');
    const tot = document.getElementById('cartTotal');
    if (sub) sub.textContent = fmt(totalPrice());
    if (tot) tot.textContent = fmt(totalPrice());
  }

  // --- Add to cart ---
  function addItem(name, price, emoji) {
    price = parseInt(price);
    const idx = cart.findIndex(i => i.name === name);
    if (idx >= 0) {
      cart[idx].qty += 1;
    } else {
      cart.push({ name, price, qty: 1, emoji: emoji || '🛍️' });
    }
    save();
    updateBadges();
    renderCart();
    showToast(`${name} added to bag`);
  }

  // --- Show toast ---
  function showToast(msg) {
    const el = document.getElementById('cartToast');
    const msgEl = document.getElementById('toastMsg');
    if (!el) return;
    if (msgEl) msgEl.textContent = msg;
    const t = new bootstrap.Toast(el, { delay: 2500 });
    t.show();
  }

  // --- Bind add-to-cart buttons ---
  function bindButtons() {
    document.addEventListener('click', function (e) {
      // Add to cart
      const addBtn = e.target.closest('.add-to-cart');
      if (addBtn) {
        const name = addBtn.dataset.name || 'Product';
        const price = addBtn.dataset.price || 0;
        const emoji = addBtn.dataset.emoji || '🛍️';
        addItem(name, price, emoji);
        return;
      }

      // Qty change
      const qtyBtn = e.target.closest('.cart-qty-btn');
      if (qtyBtn) {
        const idx = parseInt(qtyBtn.dataset.idx);
        const delta = parseInt(qtyBtn.dataset.delta);
        cart[idx].qty += delta;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        save(); updateBadges(); renderCart();
        return;
      }

      // Remove
      const removeBtn = e.target.closest('.cart-remove');
      if (removeBtn) {
        const idx = parseInt(removeBtn.dataset.idx);
        cart.splice(idx, 1);
        save(); updateBadges(); renderCart();
        return;
      }
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    renderCart();
    bindButtons();
  });

  // Expose for other scripts
  window.lumoraCart = { addItem, cart };
})();

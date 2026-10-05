/* ============================================================
   Lumora Products — static data + grid rendering + filter
   ============================================================ */

const PRODUCTS = [
  { id: 1, name: 'Vitamin C Brightening Serum', category: 'skincare', price: 899, originalPrice: 1199, rating: 4.9, reviews: 2341, badge: 'Bestseller', badgeColor: 'success', emoji: '🧴', link: 'pages/product.html' },
  { id: 2, name: 'Ashwagandha Sleep Blend', category: 'wellness', price: 649, originalPrice: 849, rating: 4.7, reviews: 987, badge: 'Sale', badgeColor: 'danger', emoji: '🌿', link: 'pages/product.html' },
  { id: 3, name: 'Cedarwood Soy Candle Set', category: 'home', price: 1249, originalPrice: null, rating: 4.9, reviews: 543, badge: null, emoji: '🕯️', link: 'pages/product.html' },
  { id: 4, name: 'Hyaluronic Acid Moisturiser', category: 'skincare', price: 799, originalPrice: 999, rating: 4.8, reviews: 1102, badge: null, emoji: '🧖', link: 'pages/product.html' },
  { id: 5, name: 'SPF 50 Sunscreen Gel', category: 'skincare', price: 549, originalPrice: null, rating: 4.7, reviews: 786, badge: 'New', badgeColor: 'primary', emoji: '☀️', link: 'pages/product.html' },
  { id: 6, name: 'Luxury Gift Set — Skin Ritual', category: 'gifting', price: 1999, originalPrice: 2499, rating: 5.0, reviews: 234, badge: 'Gift', badgeColor: 'warning', emoji: '🎁', link: 'pages/product.html' },
  { id: 7, name: 'Retinol Night Repair Serum', category: 'skincare', price: 949, originalPrice: 1299, rating: 4.8, reviews: 654, badge: null, emoji: '🌙', link: 'pages/product.html' },
  { id: 8, name: 'Aromatherapy Essential Oil Set', category: 'home', price: 899, originalPrice: null, rating: 4.6, reviews: 421, badge: null, emoji: '🌸', link: 'pages/product.html' },
  { id: 9, name: 'Collagen Boost Supplements', category: 'wellness', price: 799, originalPrice: 999, rating: 4.7, reviews: 567, badge: 'Popular', badgeColor: 'info', emoji: '💊', link: 'pages/product.html' },
  { id: 10, name: 'Bamboo Gift Wrap Set', category: 'gifting', price: 349, originalPrice: null, rating: 4.5, reviews: 189, badge: null, emoji: '🎀', link: 'pages/product.html' },
  { id: 11, name: 'Rose Quartz Face Roller', category: 'skincare', price: 599, originalPrice: 799, rating: 4.6, reviews: 892, badge: null, emoji: '💎', link: 'pages/product.html' },
  { id: 12, name: 'Gut Health Probiotic Blend', category: 'wellness', price: 699, originalPrice: null, rating: 4.8, reviews: 445, badge: 'New', badgeColor: 'primary', emoji: '🦠', link: 'pages/product.html' },
];

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  return `<span class="text-warning small">${stars}</span>`;
}

function renderProduct(p) {
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  return `
    <div class="col-6 col-md-4 col-lg-3 product-item" data-category="${p.category}">
      <div class="card product-card border-0 h-100">
        <div class="card-img-wrap bg-light text-center position-relative" style="padding:2rem 1rem">
          ${p.badge ? `<span class="badge bg-${p.badgeColor || 'dark'} position-absolute top-0 start-0 m-2">${p.badge}</span>` : ''}
          ${discount > 0 ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">${discount}% off</span>` : ''}
          <a href="${p.link}">
            <span class="product-emoji d-block">${p.emoji}</span>
          </a>
          <button class="btn btn-dark btn-sm wishlist-btn position-absolute bottom-0 end-0 m-2 rounded-circle" style="width:32px;height:32px;padding:0" title="Wishlist">
            <i class="bi bi-heart"></i>
          </button>
        </div>
        <div class="card-body d-flex flex-column">
          <small class="text-muted text-capitalize">${p.category}</small>
          <a href="${p.link}" class="text-dark text-decoration-none">
            <h6 class="card-title mt-1 mb-2" style="line-height:1.35">${p.name}</h6>
          </a>
          <div class="d-flex align-items-center gap-1 mb-2">
            ${renderStars(p.rating)}
            <small class="text-muted">(${p.reviews.toLocaleString('en-IN')})</small>
          </div>
          <div class="mt-auto d-flex align-items-center justify-content-between">
            <div>
              <span class="fw-bold">₹${p.price.toLocaleString('en-IN')}</span>
              ${p.originalPrice ? `<del class="text-muted small ms-1">₹${p.originalPrice.toLocaleString('en-IN')}</del>` : ''}
            </div>
            <button class="btn btn-dark btn-sm add-to-cart" 
              data-name="${p.name}" 
              data-price="${p.price}" 
              data-emoji="${p.emoji}">
              <i class="bi bi-bag-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAllProducts(products) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = products.map(renderProduct).join('');
}

function filterProducts(category) {
  const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
  renderAllProducts(filtered);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderAllProducts(PRODUCTS);

  // Wishlist toggle
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.wishlist-btn');
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon.classList.contains('bi-heart')) {
        icon.classList.replace('bi-heart', 'bi-heart-fill');
        btn.classList.add('btn-danger');
        btn.classList.remove('btn-dark');
      } else {
        icon.classList.replace('bi-heart-fill', 'bi-heart');
        btn.classList.add('btn-dark');
        btn.classList.remove('btn-danger');
      }
    }
  });
});

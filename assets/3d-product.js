/* ============================================
   KITAB WALA - ALL INTERACTIONS JS
   ============================================ */

'use strict';

// ─── SCROLL REVEAL ───────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ─── SIDEBAR MENU ────────────────────────────
function initSidebar() {
  const trigger = document.getElementById('sidebar-trigger');
  const sidebar = document.getElementById('sidebar-menu');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('sidebar-close');

  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (trigger) trigger.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  let startX = 0;
  sidebar.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  sidebar.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientX - startX < -60) closeSidebar();
  });
}

// ─── SEARCH MODAL ────────────────────────────
function initSearchModal() {
  const searchTriggers = document.querySelectorAll('[data-open-search]');
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('search-modal-input');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input && input.focus(), 200);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  searchTriggers.forEach(t => t.addEventListener('click', openModal));
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.search-suggestion-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      if (input) input.value = tag.textContent.trim();
      input && input.focus();
    });
  });
}

// ─── LANGUAGE SWITCHER ───────────────────────
function initLanguageSwitcher() {
  // Toggle language dropdown on click/touch
  const langWrapper = document.querySelector('.lang-dropdown-wrapper');
  const langPill = document.querySelector('.lang-dropdown-wrapper .lang-pill');
  if (langPill && langWrapper) {
    langPill.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      langWrapper.classList.toggle('active');
    });
    document.addEventListener('click', () => {
      langWrapper.classList.remove('active');
    });
  }

  // Redirect function for language switching
  function switchLanguage(langCode) {
    let path = window.location.pathname;
    // Clean path from existing language prefixes (/ur or /pa)
    path = path.replace(/^\/(ur|pa)(\/|$)/, '/');
    if (path === '') path = '/';
    
    // Construct new URL
    let newUrl = window.location.origin;
    if (langCode !== 'en') {
      newUrl += '/' + langCode + (path === '/' ? '' : path);
    } else {
      newUrl += path;
    }
    newUrl += window.location.search + window.location.hash;
    window.location.href = newUrl;
  }

  // Desktop hover dropdown language selector buttons
  const langSelectButtons = document.querySelectorAll('[data-locale-btn]');
  langSelectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = btn.getAttribute('data-locale-btn');
      switchLanguage(selectedLang);
    });
  });

  // Mobile sidebar lang buttons
  const mobileUrduBtn = document.querySelector('[data-lang-btn="ur"]');
  const mobileEnglishBtn = document.querySelector('[data-lang-btn="en"]');
  if (mobileUrduBtn) {
    mobileUrduBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchLanguage('ur');
    });
  }
  if (mobileEnglishBtn) {
    mobileEnglishBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchLanguage('en');
    });
  }
}

// ─── CATEGORIES SHOW MORE ────────────────────
function initCategoriesShowMore() {
  const btn = document.getElementById('show-more-categories-btn');
  if (!btn) return;
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const hiddenCards = document.querySelectorAll('.category-card-hidden');
    if (hiddenCards.length > 0) {
      hiddenCards.forEach(card => {
        card.classList.remove('category-card-hidden');
      });
      btn.style.display = 'none'; // Hide button once all revealed
    } else {
      window.location.href = btn.dataset.url || '/collections';
    }
  });
}

// ─── STICKY HEADER ───────────────────────────
function initStickyHeader() {
  const header = document.getElementById('shopify-section-header');
  if (!header) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ─── QUANTITY SELECTOR ───────────────────────
function initQuantitySelectors() {
  document.querySelectorAll('.quantity-selector').forEach(wrapper => {
    const input = wrapper.querySelector('.quantity-input');
    const decreaseBtn = wrapper.querySelector('.quantity-decrease');
    const increaseBtn = wrapper.querySelector('.quantity-increase');
    if (!input) return;

    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        const val = parseInt(input.value) || 1;
        if (val > 1) input.value = val - 1;
      });
    }
    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        const val = parseInt(input.value) || 1;
        const max = parseInt(input.max) || 999;
        if (val < max) input.value = val + 1;
      });
    }
  });
}

// ─── PRODUCT IMAGE GALLERY ───────────────────
function initProductGallery() {
  const mainImg = document.getElementById('product-main-image');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.dataset.src || thumb.querySelector('img')?.src;
      if (src) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = src;
          mainImg.style.opacity = '1';
        }, 200);
      }
    });
  });

  mainImg.addEventListener('click', () => {
    mainImg.classList.toggle('zoomed');
  });
}

// ─── 3D BOOK ANIMATION ───────────────────────
function init3DBook() {
  // Old product cards
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const img = card.querySelector('.product-card-img');
    if (!img) return;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
      img.style.transform = `rotateY(${x * 18}deg) rotateX(${y * 10}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });

  // New app-style cards
  const appCards = document.querySelectorAll('.app-card');
  appCards.forEach(card => {
    const img = card.querySelector('.app-card-image img');
    if (!img) return;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
      img.style.transform = `perspective(400px) rotateY(${x * 18}deg) rotateX(${y * 10}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      img.style.transform = 'perspective(400px) rotateY(-5deg)';
    });
  });
}

// ─── FAQ ACCORDION ───────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ─── WISHLIST ────────────────────────────────
function initWishlist() {
  document.querySelectorAll('.product-card-wishlist').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.dataset.productId;
      btn.classList.toggle('active');
      btn.classList.add('heart-beat');
      setTimeout(() => btn.classList.remove('heart-beat'), 600);

      const wishlist = JSON.parse(localStorage.getItem('kw-wishlist') || '[]');
      if (btn.classList.contains('active')) {
        if (!wishlist.includes(productId)) wishlist.push(productId);
      } else {
        const idx = wishlist.indexOf(productId);
        if (idx > -1) wishlist.splice(idx, 1);
      }
      localStorage.setItem('kw-wishlist', JSON.stringify(wishlist));
    });
  });

  const wishlist = JSON.parse(localStorage.getItem('kw-wishlist') || '[]');
  wishlist.forEach(id => {
    const btn = document.querySelector(`.product-card-wishlist[data-product-id="${id}"]`);
    if (btn) btn.classList.add('active');
  });
}

// ─── HERO SLIDER ─────────────────────────────
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-banner-card');
  const dots = document.querySelectorAll('.app-hero-dot');
  if (slides.length < 2) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  }

  function autoPlay() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { clearInterval(timer); goTo(i); autoPlay(); });
  });

  autoPlay();
}

// ─── ADD TO CART ─────────────────────────────
function initAddToCart() {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const variantId = btn.dataset.variantId;
      const qty = parseInt(document.querySelector('.quantity-input')?.value || '1');
      if (!variantId) return;

      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;

      const isUrdu = document.documentElement.lang === 'ur' || window.location.pathname.startsWith('/ur');

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: qty })
        });
        const data = await res.json();
        if (data.id) {
          showToast(isUrdu ? 'کارٹ میں شامل ہو گیا ✓' : 'Added to cart ✓');
          updateCartCount();
        }
      } catch (err) {
        showToast(isUrdu ? 'خرابی! دوبارہ کوشش کریں' : 'Error! Please try again', 'error');
      }

      btn.innerHTML = originalText;
      btn.disabled = false;
    });
  });
}

// ─── CART COUNT ──────────────────────────────
async function updateCartCount() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    document.querySelectorAll('.cart-item-count').forEach(el => {
      el.textContent = cart.item_count;
      el.style.display = cart.item_count > 0 ? 'flex' : 'none';
    });
  } catch (e) {}
}

// ─── TOAST ───────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.kw-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `kw-toast toast-notification ${type}`;
  toast.style.cssText = `
    position:fixed; top:80px; left:50%; transform:translateX(-50%);
    background:${type === 'error' ? '#e74c3c' : '#2e7d32'}; color:#fff;
    padding:12px 24px; border-radius:50px; font-size:0.9rem;
    z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,0.2);
    font-family:'Noto Nastaliq Urdu',serif; direction:rtl;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── NEWSLETTER ──────────────────────────────
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.querySelector('[type="email"]')?.value;
    if (!email) return;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '...';
    btn.disabled = true;

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `form_type=customer&contact[email]=${encodeURIComponent(email)}&contact[tags]=newsletter`
      });
      if (res.ok) {
        showToast('شکریہ! سبسکرائب ہو گئے ✓');
        form.reset();
      }
    } catch (e) {
      showToast('کوشش ناکام، دوبارہ کریں', 'error');
    }
    btn.textContent = originalText;
    btn.disabled = false;
  });
}

// ─── FILTERS TOGGLE (MOBILE) ─────────────────
function initFiltersToggle() {
  const filterToggle = document.getElementById('filter-toggle');
  const filterPanel = document.getElementById('filter-panel');
  if (!filterToggle || !filterPanel) return;

  filterToggle.addEventListener('click', () => {
    filterPanel.classList.toggle('open');
    filterToggle.textContent = filterPanel.classList.contains('open')
      ? 'فلٹر بند کریں ✕'
      : 'فلٹر کریں ☰';
  });
}

// ─── HEADER SEARCH BAR ───────────────────────
function initDesktopSearch() {
  const form = document.querySelector('.header-search-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    const input = form.querySelector('input[type="search"], .header-search-input');
    if (!input?.value.trim()) e.preventDefault();
  });
}

// ─── MOBILE DROPDOWNS ────────────────────────
function initMobileDropdowns() {
  document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = trigger.parentElement;
      const menu = trigger.nextElementSibling;
      if (!menu) return;
      const isHidden = menu.style.display === 'none' || menu.style.display === '';
      menu.style.display = isHidden ? 'block' : 'none';
      trigger.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
  });
}

// ─── INIT ALL ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSidebar();
  initSearchModal();
  initLanguageSwitcher();
  initStickyHeader();
  initQuantitySelectors();
  initProductGallery();
  init3DBook();
  initFAQ();
  initWishlist();
  initHeroSlider();
  initAddToCart();
  updateCartCount();
  initNewsletter();
  initFiltersToggle();
  initDesktopSearch();
  initCategoriesShowMore();
  initMobileDropdowns();
});

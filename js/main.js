/**
 * main.js  —  KOYA ITO Portfolio
 * 担当機能:
 *   1. カスタムカーソル
 *   2. スクロールでナビ背景変更
 *   3. ハンバーガーメニュー
 *   4. IntersectionObserver フェードイン
 *   5. スムーズスクロール（navオフセット考慮）
 */

'use strict';

/* ──────────────────────────────────────
   1. カスタムカーソル
   ────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  // タッチデバイスは非表示
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ラフなイージングで滑らかに追従
  function animateCursor() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ホバー可能な要素にカーソル変形
  const hoverTargets = document.querySelectorAll(
    'a, button, .case, .sk-card, .btn, .nav__link'
  );
  hoverTargets.forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
  });
})();


/* ──────────────────────────────────────
   2. スクロールでナビ背景変更
   ────────────────────────────────────── */
(function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  let ticking = false;

  function updateNav() {
    if (window.scrollY > 8) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
})();


/* ──────────────────────────────────────
   3. ハンバーガーメニュー
   ────────────────────────────────────── */
(function initBurger() {
  const btn   = document.getElementById('burgerBtn');
  const menu  = document.getElementById('mobileMenu');
  const links = menu ? menu.querySelectorAll('.nav__overlay-link') : [];
  if (!btn || !menu) return;

  let isOpen = false;

  function open() {
    isOpen = true;
    btn.classList.add('is-open');
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'メニューを閉じる');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    isOpen = false;
    btn.classList.remove('is-open');
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    isOpen ? close() : open();
  });

  // リンククリックで閉じる
  links.forEach(function (link) {
    link.addEventListener('click', close);
  });

  // ESCキー
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });
})();


/* ──────────────────────────────────────
   4. IntersectionObserver フェードイン
   ────────────────────────────────────── */
(function initFadeIn() {
  const els = document.querySelectorAll('.js-fade');
  if (!els.length) return;

  // IO 非対応ブラウザのフォールバック
  if (!window.IntersectionObserver) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(function (el) { observer.observe(el); });
})();


/* ──────────────────────────────────────
   5. スムーズスクロール（navオフセット）
   ────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_HEIGHT = 64; // CSS --nav-h と同値

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  // フッター TOP ボタン
  const topBtn = document.getElementById('toTop');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

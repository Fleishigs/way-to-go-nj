/* WAY TO GO NJ — v4 */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  var form = document.getElementById('contactForm');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = menu.querySelectorAll('.nav__link');
  var anims = document.querySelectorAll('.anim');
  var noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Mobile nav */
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.addEventListener('click', function (e) {
    if (e.target === menu || e.target.closest('.nav__link') || e.target.closest('.btn')) {
      menu.classList.remove('open'); toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open'); toggle.classList.remove('open'); document.body.style.overflow = '';
    }
  });

  /* Sticky nav */
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight, behavior: noMotion ? 'auto' : 'smooth' });
    });
  });

  /* Active link */
  var linkObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
      }
    });
  }, { rootMargin: '-25% 0px -55% 0px' });
  sections.forEach(function (s) { linkObs.observe(s); });

  /* Scroll reveal with stagger for sibling cards */
  if (!noMotion && anims.length) {
    var seen = new Set();
    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var p = el.parentElement;

        if (p && (p.classList.contains('cards') || p.classList.contains('why__grid'))) {
          if (!seen.has(p)) {
            seen.add(p);
            var kids = p.querySelectorAll('.anim');
            kids.forEach(function (k, i) { setTimeout(function () { k.classList.add('visible'); }, i * 120); });
          }
        } else {
          el.classList.add('visible');
        }
        fadeObs.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    anims.forEach(function (el) { fadeObs.observe(el); });
  } else {
    anims.forEach(function (el) { el.classList.add('visible'); });
  }

  /* Form validation */
  if (form) {
    form.addEventListener('submit', function (e) {
      var ok = true; clear();
      var n = form.querySelector('#name');
      if (!n.value.trim()) { err(n, 'Enter your name.'); ok = false; }
      var em = form.querySelector('#email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { err(em, 'Enter a valid email.'); ok = false; }
      var sv = form.querySelector('#service');
      if (!sv.value) { err(sv, 'Select a service.'); ok = false; }
      var msg = form.querySelector('#message');
      if (!msg.value.trim()) { err(msg, 'Enter a message.'); ok = false; }
      if (!ok) { e.preventDefault(); var f = form.querySelector('.error'); if (f) f.focus(); }
    });
  }
  function err(inp, txt) {
    inp.classList.add('error');
    var d = document.createElement('div'); d.className = 'f__error'; d.textContent = txt;
    inp.parentElement.appendChild(d);
  }
  function clear() {
    form.querySelectorAll('.f__error').forEach(function (e) { e.remove(); });
    form.querySelectorAll('.error').forEach(function (i) { i.classList.remove('error'); });
  }
  document.querySelectorAll('.f input,.f select,.f textarea').forEach(function (inp) {
    inp.addEventListener('input', function () {
      this.classList.remove('error');
      var e = this.parentElement.querySelector('.f__error'); if (e) e.remove();
    });
  });

})();

/* ============================
   WAY TO GO NEW JERSEY — v2
   script.js
   ============================ */

(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var contactForm = document.getElementById('contactForm');
  var hero = document.querySelector('.hero');
  var allNavLinks = navLinks.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');
  var reveals = document.querySelectorAll('.reveal');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero Animation Orchestration ----------
     Bus drives across → title wipes in behind it → subtitle/ctas fade in.
     All controlled via the `.animate` class on .hero which unpauses CSS animations.
  */
  function initHero() {
    if (prefersReducedMotion) {
      hero.classList.add('animate');
      return;
    }

    // Small delay so page settles, then trigger all hero animations
    setTimeout(function () {
      hero.classList.add('animate');
    }, 400);
  }

  // Start hero animation once Lottie is ready (or after timeout as fallback)
  var busLottie = document.getElementById('busLottie');
  var heroStarted = false;

  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    initHero();
  }

  if (busLottie) {
    busLottie.addEventListener('ready', startHero);
  }

  // Fallback: start after 2s even if Lottie hasn't loaded
  setTimeout(startHero, 2000);

  /* ---------- Mobile Nav ---------- */
  function openMobileNav() {
    navLinks.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    navLinks.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target === navLinks || e.target.classList.contains('nav__link') || e.target.classList.contains('nav__cta')) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileNav();
    }
  });

  /* ---------- Sticky Nav ---------- */
  function handleNavScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------- Smooth Anchor Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight;
      window.scrollTo({ top: offset, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Active Nav Link ---------- */
  var activeLinkObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        allNavLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(function (s) { activeLinkObs.observe(s); });

  /* ---------- Scroll Reveal ---------- */
  if (!prefersReducedMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var parent = el.parentElement;

        // Stagger siblings in grids
        if (parent && (parent.classList.contains('services__grid') || parent.classList.contains('why-us__grid'))) {
          var siblings = parent.querySelectorAll('.reveal');
          siblings.forEach(function (sib, i) {
            setTimeout(function () { sib.classList.add('revealed'); }, i * 140);
          });
        } else {
          el.classList.add('revealed');
        }

        revealObs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---------- Contact Form Validation ---------- */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var valid = true;

      contactForm.querySelectorAll('.form__error').forEach(function (err) { err.remove(); });
      contactForm.querySelectorAll('.error').forEach(function (inp) { inp.classList.remove('error'); });

      var name = contactForm.querySelector('#name');
      if (!name.value.trim()) { showError(name, 'Please enter your name.'); valid = false; }

      var email = contactForm.querySelector('#email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError(email, 'Please enter a valid email.'); valid = false; }

      var service = contactForm.querySelector('#service');
      if (!service.value) { showError(service, 'Please select a service.'); valid = false; }

      var message = contactForm.querySelector('#message');
      if (!message.value.trim()) { showError(message, 'Please enter a message.'); valid = false; }

      if (!valid) {
        e.preventDefault();
        var first = contactForm.querySelector('.error');
        if (first) first.focus();
      }
    });
  }

  function showError(input, msg) {
    input.classList.add('error');
    var el = document.createElement('div');
    el.className = 'form__error';
    el.textContent = msg;
    input.parentElement.appendChild(el);
  }

  document.querySelectorAll('.form__input').forEach(function (input) {
    function clearErr() {
      this.classList.remove('error');
      var err = this.parentElement.querySelector('.form__error');
      if (err) err.remove();
    }
    input.addEventListener('input', clearErr);
    input.addEventListener('change', clearErr);
  });

})();

/* ============================
   WAY TO GO NEW JERSEY
   script.js
   ============================ */

(function () {
  'use strict';

  // ---------- DOM References ----------
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const heroBus = document.getElementById('heroBus');
  const heroContent = document.getElementById('heroContent');
  const allNavLinks = navLinks.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');
  const reveals = document.querySelectorAll('.reveal');

  // ---------- Reduced Motion Check ----------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile Nav Toggle ----------
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
    if (navLinks.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Close on overlay click
  navLinks.addEventListener('click', function (e) {
    if (e.target === navLinks || e.target.classList.contains('nav__link') || e.target.classList.contains('nav__cta')) {
      closeMobileNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // ---------- Sticky Nav on Scroll ----------
  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Check on load

  // ---------- Smooth Anchor Scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var navHeight = nav.offsetHeight;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  // ---------- Active Nav Link Highlighting ----------
  var activeLinkObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          allNavLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    }
  );

  sections.forEach(function (section) {
    activeLinkObserver.observe(section);
  });

  // ---------- Scroll Reveal Animations ----------
  if (!prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger children if they're cards
            var parent = entry.target.parentElement;
            if (parent && parent.classList.contains('services__grid')) {
              var cards = parent.querySelectorAll('.reveal');
              cards.forEach(function (card, i) {
                setTimeout(function () {
                  card.classList.add('revealed');
                }, i * 150);
              });
            } else if (parent && parent.classList.contains('why-us__grid')) {
              var items = parent.querySelectorAll('.reveal');
              items.forEach(function (item, i) {
                setTimeout(function () {
                  item.classList.add('revealed');
                }, i * 120);
              });
            } else {
              entry.target.classList.add('revealed');
            }
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion, show everything immediately
    reveals.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ---------- Contact Form Validation ----------
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form__error').forEach(function (err) {
        err.remove();
      });
      contactForm.querySelectorAll('.error').forEach(function (input) {
        input.classList.remove('error');
      });

      // Name
      var name = contactForm.querySelector('#name');
      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        isValid = false;
      }

      // Email
      var email = contactForm.querySelector('#email');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      // Service
      var service = contactForm.querySelector('#service');
      if (!service.value) {
        showError(service, 'Please select a service.');
        isValid = false;
      }

      // Message
      var message = contactForm.querySelector('#message');
      if (!message.value.trim()) {
        showError(message, 'Please enter a message.');
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
        // Focus first error field
        var firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
      }
    });
  }

  function showError(input, msg) {
    input.classList.add('error');
    var errorEl = document.createElement('div');
    errorEl.className = 'form__error';
    errorEl.textContent = msg;
    input.parentElement.appendChild(errorEl);
  }

  // Clear error on input
  document.querySelectorAll('.form__input').forEach(function (input) {
    input.addEventListener('input', function () {
      this.classList.remove('error');
      var err = this.parentElement.querySelector('.form__error');
      if (err) err.remove();
    });

    input.addEventListener('change', function () {
      this.classList.remove('error');
      var err = this.parentElement.querySelector('.form__error');
      if (err) err.remove();
    });
  });

})();

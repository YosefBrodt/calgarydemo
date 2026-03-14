/* ============================================================
   THE HEATING NINJA — main.js
   Scroll animations, navbar, hamburger, form handling
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM REFS ────────────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu= document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const contactForm = document.getElementById('contact-form');

  /* ── NAVBAR: scroll shadow ───────────────────────────────── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── HAMBURGER MENU ──────────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !navbar.contains(e.target)
    ) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });

  /* ── SCROLL FADE-IN ANIMATIONS ───────────────────────────── */
  const fadeElements = document.querySelectorAll('.section-fade');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger child cards inside grids
          const cards = entry.target.querySelectorAll(
            '.service-card, .why-card, .program-card, .review-card, .area-chip, .brand-chip, .trust-item'
          );
          cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 60}ms`;
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  fadeElements.forEach(el => observer.observe(el));

  /* ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── CONTACT FORM : basic client-side UX ────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('form-submit-btn');
      const originalText = submitBtn.textContent;

      // Gather basic required fields
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#ef4444';
        }
      });

      if (!valid) {
        submitBtn.textContent = 'Please fill in all required fields';
        setTimeout(() => { submitBtn.textContent = originalText; }, 3000);
        return;
      }

      // Show sending state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // NOTE: Replace the action attribute with Formspree endpoint
      // e.g. action="https://formspree.io/f/YOUR_FORM_ID"
      // For now we simulate a successful submission
      setTimeout(() => {
        submitBtn.textContent = '✅ Message sent — we\'ll be in touch soon!';
        submitBtn.style.background = '#16a34a';
        submitBtn.style.borderColor = '#16a34a';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 5000);
      }, 1200);
    });
  }

  /* ── ACTIVE NAV LINK HIGHLIGHT ON SCROLL ─────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinksAll.forEach(link => {
            link.classList.toggle(
              'nav-link--active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))}px 0px 0px 0px` }
  );

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ── PHONE NUMBER FORMATTING ─────────────────────────────── */
  // Auto-format phone input as user types
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 10) {
        val = val.substring(0, 10);
        e.target.value = `${val.slice(0,3)}-${val.slice(3,6)}-${val.slice(6)}`;
      }
    });
  }

})();

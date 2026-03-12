/* ─────────────────────────────────────────────────────────
   main.js — Portfolio interactions
   ─────────────────────────────────────────────────────────  */

'use strict';

// ── Navbar scroll behaviour ─────────────────────────────
const navbar = document.getElementById('navbar');

const handleNavScroll = () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

// ── Active nav link on scroll ────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const activateNavLink = () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', activateNavLink, { passive: true });

// ── Mobile nav toggle ────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Typed hero title ─────────────────────────────────────
const typedEl = document.getElementById('typed');
const phrases = [
  'Full Stack Developer',
  'TypeScript Engineer',
  'Cloud Architect',
  'API Designer',
  'React / Node.js Expert',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

const typeEffect = () => {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000;  // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeEffect, delay);
};

// Start typing after a short delay
setTimeout(typeEffect, 800);

// ── Animate On Scroll (lightweight CSS-class trigger) ────
const aosElements = document.querySelectorAll('[data-aos]');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
};

const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
      aosObserver.unobserve(entry.target); // trigger once
    }
  });
}, observerOptions);

aosElements.forEach(el => aosObserver.observe(el));

// ── Footer year ──────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Contact form ─────────────────────────────────────────
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const setFieldError = (input, hasError) => {
  if (hasError) {
    input.classList.add('error');
  } else {
    input.classList.remove('error');
  }
};

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput    = form.elements['name'];
    const emailInput   = form.elements['email'];
    const messageInput = form.elements['message'];

    let valid = true;

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, true);
      valid = false;
    } else {
      setFieldError(nameInput, false);
    }

    if (!validateEmail(emailInput.value.trim())) {
      setFieldError(emailInput, true);
      valid = false;
    } else {
      setFieldError(emailInput, false);
    }

    if (!messageInput.value.trim()) {
      setFieldError(messageInput, true);
      valid = false;
    } else {
      setFieldError(messageInput, false);
    }

    if (!valid) {
      formStatus.textContent = 'Please fill in all required fields correctly.';
      formStatus.className   = 'form-note error';
      return;
    }

    // Build mailto link as a GitHub Pages-compatible fallback
    // (replace with a backend/Formspree endpoint when available)
    const subject  = encodeURIComponent('Portfolio Inquiry from ' + nameInput.value.trim());
    const body     = encodeURIComponent(
      'Name: ' + nameInput.value.trim() + '\n' +
      'Email: ' + emailInput.value.trim() + '\n\n' +
      messageInput.value.trim()
    );

    formStatus.textContent = 'Opening your mail client…';
    formStatus.className   = 'form-note';

    window.location.href = 'mailto:hello@yeshu.in?subject=' + subject + '&body=' + body;

    // Reset form after a short delay
    setTimeout(() => {
      form.reset();
      formStatus.textContent = 'Thanks! Your message has been prepared.';
      formStatus.className   = 'form-note success';
    }, 1000);
  });

  // Clear error on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => setFieldError(field, false));
  });
}

// ── Smooth scroll for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────────────────
   main.js — Data-driven portfolio renderer
   Reads all content from /data/resume.json
   ─────────────────────────────────────────────────────────  */

'use strict';

// ── SVG icon library ──────────────────────────────────────
const ICONS = {
  github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  email:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  verified:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  external:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  document:`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" stroke-width="1.5"/><path d="M8 12h8M8 8h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  shield:  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5"/></svg>`,
  globe:   `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 2a14.5 14.5 0 010 20M2 12h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  grid:    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  linkedin:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
};

// ── Fetch & bootstrap ─────────────────────────────────────
fetch('/data/resume.json')
  .then(res => {
    if (!res.ok) throw new Error('Failed to load resume.json: ' + res.status);
    return res.json();
  })
  .then(data => {
    renderAll(data);
    initInteractions(data);
  })
  .catch(err => {
    console.error('Portfolio data error:', err);
  });

// ── Master render orchestrator ────────────────────────────
function renderAll(data) {
  updateMetaTags(data.meta, data.social);
  renderHero(data.hero, data.social);
  renderAbout(data.about, data.social);
  renderSkills(data.skills);
  renderExperience(data.experience);
  renderProjects(data.projects, data.social);
  renderContact(data.contact, data.meta);
  renderFooter(data.social);
}

// ── Meta / structured data ────────────────────────────────
function updateMetaTags(meta, social) {
  document.title = meta.title;
  setMeta('name',     'title',       meta.title);
  setMeta('name',     'description', meta.description);
  setMeta('name',     'keywords',    meta.keywords.join(', '));
  setMeta('property', 'og:title',    meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url',   meta.siteUrl + '/');
  if (meta.ogImage) {
    setMeta('property', 'og:image',      meta.ogImage);
    setMeta('name',     'twitter:image', meta.ogImage);
  }
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && meta.siteUrl) canonical.href = meta.siteUrl + '/';
  setMeta('name', 'twitter:title',       meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setMeta('name', 'twitter:url',         meta.siteUrl + '/');

  // JSON-LD
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: meta.author,
    url: meta.siteUrl,
    sameAs: [social.github, social.toptal, social.linkedin].filter(Boolean),
    jobTitle: 'Full Stack Developer',
    description: meta.description,
  };
  const ldEl = document.getElementById('structured-data');
  if (ldEl) ldEl.textContent = JSON.stringify(ld, null, 2);
}

function setMeta(attr, val, content) {
  const el = document.querySelector(`meta[${attr}="${val}"]`);
  if (el) el.setAttribute('content', content);
}

// ── Hero ──────────────────────────────────────────────────
function renderHero(hero, social) {
  const greetingEl = document.getElementById('hero-greeting');
  if (greetingEl) {
    greetingEl.innerHTML =
      `<span class="tag-open">&lt;</span>${escHtml(hero.greeting)}<span class="tag-close">/&gt;</span>`;
  }

  setText('hero-name', hero.name);
  setHtml('hero-summary', hero.summary);

  // Hire Me button
  const hireBtnLi = document.getElementById('nav-hire-btn');
  if (hireBtnLi && social.toptal) {
    hireBtnLi.innerHTML =
      `<a href="${escAttr(social.toptal)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Hire Me</a>`;
  }

  // Toptal badge
  const badgesEl = document.getElementById('hero-badges');
  if (badgesEl && social.toptal) {
    badgesEl.innerHTML =
      `<a href="${escAttr(social.toptal)}" target="_blank" rel="noopener noreferrer" class="badge-toptal">
        ${ICONS.verified} Expert-Vetted on Toptal
      </a>`;
  }

  // Code window
  const filenameEl = document.getElementById('code-filename');
  const codeBodyEl = document.getElementById('code-body');
  if (filenameEl && hero.codeSnippet) {
    filenameEl.textContent = hero.codeSnippet.filename;
  }
  if (codeBodyEl && hero.codeSnippet && hero.codeSnippet.code) {
    codeBodyEl.innerHTML = highlightTS(hero.codeSnippet.code);
  }
}

// ── Lightweight TypeScript syntax highlighter ─────────────
// Applies colour classes to a code string for the code window.
function highlightTS(raw) {
  // Escape HTML first, then re-apply highlight spans
  let s = escHtml(raw);

  // Keywords
  s = s.replace(/\b(const|let|var|new|true|false|null|undefined|return|class|function|async|await|import|export|from)\b/g,
    '<span class="kw">$1</span>');

  // Strings — double-quoted (already HTML-escaped to &quot; ... &quot;)
  s = s.replace(/(&quot;[^&]*?&quot;)/g,
    '<span class="str">$1</span>');

  // Class names (PascalCase)
  s = s.replace(/\b([A-Z][a-zA-Z0-9]+)\b/g,
    '<span class="cls">$1</span>');

  // Property names before colon (inside object literals)
  s = s.replace(/\b([a-z][a-zA-Z0-9]*)(\s*:(?!=))/g,
    '<span class="var">$1</span>$2');

  // Punctuation  { } ( ) [ ] , ;
  s = s.replace(/([{}()[\],;])/g,
    '<span class="punc">$1</span>');

  // Operators = .
  s = s.replace(/([=.])/g,
    '<span class="op">$1</span>');

  return s;
}

// ── About ─────────────────────────────────────────────────
function renderAbout(about, social) {
  const parasEl = document.getElementById('about-paragraphs');
  if (parasEl) {
    parasEl.innerHTML = about.paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  const factsEl = document.getElementById('about-facts');
  if (factsEl) {
    factsEl.innerHTML = about.facts.map(f =>
      `<li>${ICONS.check} ${escHtml(f)}</li>`
    ).join('');
  }

  const statsEl = document.getElementById('about-stats');
  if (statsEl) {
    statsEl.innerHTML = about.stats.map(s =>
      `<div class="stat-card">
        <span class="stat-value">${escHtml(s.value)}</span>
        <span class="stat-label">${escHtml(s.label)}</span>
      </div>`
    ).join('');
  }

  const resumeLink = document.getElementById('about-resume-link');
  if (resumeLink && social.toptal) {
    resumeLink.href = social.toptal;
  }
}

// ── Skills ────────────────────────────────────────────────
function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  grid.innerHTML = skills.map(cat => {
    const chips = cat.items.map(item =>
      `<span class="chip${cat.accent ? ' chip-accent' : ''}">${escHtml(item)}</span>`
    ).join('');

    return `<div class="skill-category">
      <h3 class="skill-category-title">${escHtml(cat.category)}</h3>
      <div class="skill-chips">${chips}</div>
    </div>`;
  }).join('');
}

// ── Experience ────────────────────────────────────────────
function renderExperience(experience) {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  timeline.innerHTML = experience.map((job, i) => {
    const companyHtml = job.companyUrl
      ? `${escHtml(job.company)} <a href="${escAttr(job.companyUrl)}" target="_blank" rel="noopener noreferrer" class="external-link" aria-label="View profile">${ICONS.external}</a>`
      : escHtml(job.company);

    const bullets = job.bullets.map(b => `<li>${escHtml(b)}</li>`).join('');
    const techChips = job.tech.map(t => `<span class="chip chip-sm">${escHtml(t)}</span>`).join('');
    const delay = i > 0 ? ` data-aos-delay="${i * 100}"` : '';

    return `<div class="timeline-item" data-aos="fade-up"${delay}>
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${escHtml(job.role)}</h3>
            <p class="timeline-company">${companyHtml}</p>
          </div>
          <span class="timeline-period">${escHtml(job.period)}</span>
        </div>
        <ul class="timeline-bullets" role="list">${bullets}</ul>
        <div class="timeline-tech">${techChips}</div>
      </div>
    </div>`;
  }).join('');
}

// ── Projects ──────────────────────────────────────────────
function renderProjects(projects, social) {
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.innerHTML = projects.map((proj, i) => {
      const delay = i > 0 ? ` data-aos-delay="${i * 100}"` : '';
      const techChips = proj.tech.map(t => `<span class="chip chip-sm">${escHtml(t)}</span>`).join('');

      const links = [
        proj.githubUrl ? `<a href="${escAttr(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${ICONS.github}</a>` : '',
        proj.liveUrl   ? `<a href="${escAttr(proj.liveUrl)}"   target="_blank" rel="noopener noreferrer" aria-label="Live demo">${ICONS.external}</a>` : '',
      ].filter(Boolean).join('');

      return `<article class="project-card" data-aos="fade-up"${delay}>
        <div class="project-card-top">
          <div class="project-icon">${ICONS[proj.icon] || ICONS.document}</div>
          <div class="project-links" aria-label="Project links">${links}</div>
        </div>
        <h3 class="project-title">${escHtml(proj.title)}</h3>
        <p class="project-desc">${escHtml(proj.description)}</p>
        <div class="project-tech">${techChips}</div>
      </article>`;
    }).join('');
  }

  const githubLink = document.getElementById('github-all-link');
  if (githubLink && social.github) {
    githubLink.href = social.github;
  }
}

// ── Contact ───────────────────────────────────────────────
function renderContact(contact, meta) {
  setHtml('contact-intro', contact.intro);

  const linksEl = document.getElementById('contact-links');
  if (linksEl) {
    linksEl.innerHTML = contact.links.map(link => {
      const target = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escAttr(link.href)}"${target} class="contact-link-item">
        ${ICONS[link.icon] || ''} ${escHtml(link.label)}
      </a>`;
    }).join('');
  }

  // Store email for form submit
  window._contactEmail = meta.email || 'hello@yeshu.in';
}

// ── Footer ────────────────────────────────────────────────
function renderFooter(social) {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const socialsEl = document.getElementById('footer-socials');
  if (!socialsEl) return;

  const links = [
    social.github   ? { href: social.github,   icon: 'github',   label: 'GitHub profile' }   : null,
    social.toptal   ? { href: social.toptal,    icon: 'verified', label: 'Toptal profile' }   : null,
    social.linkedin ? { href: social.linkedin,  icon: 'linkedin', label: 'LinkedIn profile' } : null,
  ].filter(Boolean);

  socialsEl.innerHTML = links.map(l =>
    `<a href="${escAttr(l.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escAttr(l.label)}">
      ${ICONS[l.icon]}
    </a>`
  ).join('');
}

// ── DOM helpers ───────────────────────────────────────────
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// Safe HTML escaping for user-sourced text
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Safe attribute escaping
function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Interactions (run after render) ──────────────────────
function initInteractions(data) {
  initNavbar();
  initMobileNav();
  initTyped(data.hero.typedPhrases);
  initAOS();
  initContactForm();
  initSmoothScroll();
}

// ── Navbar scroll behaviour ───────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    // Scrolled style
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile nav ────────────────────────────────────────────
function initMobileNav() {
  const toggle   = document.getElementById('navToggle');
  const linksEl  = document.getElementById('navLinks');
  if (!toggle || !linksEl) return;

  toggle.addEventListener('click', () => {
    const isOpen = linksEl.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  linksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      linksEl.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ── Typewriter effect ─────────────────────────────────────
function initTyped(phrases) {
  const typedEl = document.getElementById('typed');
  if (!typedEl || !phrases || phrases.length === 0) return;

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  const tick = () => {
    const phrase = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === phrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  };

  setTimeout(tick, 800);
}

// ── Animate On Scroll ─────────────────────────────────────
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ── Contact form ──────────────────────────────────────────
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (!form) return;

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const setError = (input, hasErr) => input.classList.toggle('error', hasErr);

  // Returns true if the field is valid, false otherwise (and marks the error)
  const validateField = (input, condition) => {
    const ok = condition(input.value);
    setError(input, !ok);
    return ok;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameInput    = form.elements['name'];
    const emailInput   = form.elements['email'];
    const messageInput = form.elements['message'];

    const valid =
      validateField(nameInput,    v => v.trim() !== '') &
      validateField(emailInput,   v => validateEmail(v)) &
      validateField(messageInput, v => v.trim() !== '');

    if (!valid) {
      formStatus.textContent = 'Please fill in all required fields correctly.';
      formStatus.className   = 'form-note error';
      return;
    }

    const to      = window._contactEmail || 'hello@yeshu.in';
    const subject = encodeURIComponent('Portfolio Inquiry from ' + nameInput.value.trim());
    const body    = encodeURIComponent(
      'Name: '  + nameInput.value.trim()    + '\n' +
      'Email: ' + emailInput.value.trim()   + '\n\n' +
      messageInput.value.trim()
    );

    formStatus.textContent = 'Opening your mail client…';
    formStatus.className   = 'form-note';
    window.location.href   = `mailto:${to}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      form.reset();
      formStatus.textContent = 'Thanks! Your message has been prepared.';
      formStatus.className   = 'form-note success';
    }, 1000);
  });

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => setError(field, false));
  });
}

// ── Smooth scroll ─────────────────────────────────────────
function initSmoothScroll() {
  const navbar = document.getElementById('navbar');
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
}

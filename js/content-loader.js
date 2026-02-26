/**
 * Kleine Helden – Content Loader
 * Loads content.json and renders dynamic sections
 */

const WHATSAPP_BASE = 'https://wa.me/';
let siteContent = null;

async function loadContent() {
  try {
    const res = await fetch('data/content.json');
    siteContent = await res.json();
    renderPage();
  } catch (err) {
    console.error('Fehler beim Laden der Inhalte:', err);
  }
}

function getWhatsAppLink(text) {
  const number = siteContent?.site?.whatsapp || '491621946201';
  if (text) {
    return `${WHATSAPP_BASE}${number}?text=${encodeURIComponent(text)}`;
  }
  return `${WHATSAPP_BASE}${number}`;
}

function getIconSvg(name) {
  // Return data-lucide attribute for Lucide icons
  const map = {
    'sparkles': 'sparkles',
    'palette': 'palette',
    'heart': 'heart',
    'sun': 'sun',
    'calendar': 'calendar-days',
    'palmtree': 'tree-palm',
    'users': 'users',
    'clock': 'clock',
    'cloud': 'cloud',
    'smile': 'smile-plus',
    'trending-up': 'trending-up',
    'star': 'star',
    'quote': 'quote',
  };
  return map[name] || name;
}

function renderPage() {
  if (!siteContent) return;

  const page = document.body.dataset.page;

  // Render based on page
  switch (page) {
    case 'home': renderHome(); break;
    case 'ueber-mich': renderUeberMich(); break;
    case 'angebot': renderAngebot(); break;
    case 'faq': renderFAQ(); break;
    case 'kontakt': renderKontakt(); break;
  }

  // Re-render Lucide icons after dynamic content
  if (window.lucide) lucide.createIcons();
}

/* ==========================================
   Home Page
   ========================================== */
function renderHome() {
  const c = siteContent;

  // Hero
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroTitle) heroTitle.innerHTML = c.hero.title;
  if (heroSubtitle) heroSubtitle.textContent = c.hero.subtitle;

  // Features
  const featuresGrid = document.getElementById('features-grid');
  if (featuresGrid && c.features) {
    featuresGrid.innerHTML = c.features.map(f => `
      <div class="card feature-card">
        <div class="card__icon card__icon--center">
          <i data-lucide="${getIconSvg(f.icon)}"></i>
        </div>
        <h3>${f.title}</h3>
        <p>${f.description}</p>
      </div>
    `).join('');
  }

  // About teaser
  const aboutName = document.getElementById('about-name');
  const aboutText = document.getElementById('about-text');
  if (aboutName) aboutName.innerHTML = c.about.name;
  if (aboutText) {
    aboutText.innerHTML = `
      <p>${c.about.shortIntro}</p>
      <p>${c.about.shortIntro2}</p>
    `;
  }

  // Testimonials
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid && c.testimonials) {
    testimonialsGrid.innerHTML = c.testimonials.map(t => `
      <div class="card testimonial-card">
        <i data-lucide="quote" class="quote-icon"></i>
        <blockquote class="testimonial-card__quote">&ldquo;${t.quote}&rdquo;</blockquote>
        <p class="testimonial-card__author">– ${t.author}</p>
      </div>
    `).join('');
  }

  // CTA WhatsApp link
  const ctaBtn = document.getElementById('cta-whatsapp');
  if (ctaBtn) {
    ctaBtn.href = getWhatsAppLink('Hallo! Ich möchte gerne ein Kennenlerngespräch vereinbaren.');
  }
}

/* ==========================================
   Über Mich Page
   ========================================== */
function renderUeberMich() {
  const c = siteContent;

  const aboutName = document.getElementById('about-name');
  if (aboutName) aboutName.innerHTML = c.about.name;

  const aboutIntro = document.getElementById('about-intro-text');
  if (aboutIntro) {
    aboutIntro.innerHTML = c.about.fullIntro.map(p => `<p>${p}</p>`).join('');
  }

  const schwerpunkte = document.getElementById('schwerpunkte-grid');
  if (schwerpunkte && c.about.schwerpunkte) {
    schwerpunkte.innerHTML = c.about.schwerpunkte.map(s => `
      <div class="card">
        <div class="card__icon">
          <i data-lucide="${getIconSvg(s.icon)}"></i>
        </div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
      </div>
    `).join('');
  }
}

/* ==========================================
   Angebot Page
   ========================================== */
function renderAngebot() {
  const c = siteContent;
  const grid = document.getElementById('angebote-grid');
  if (!grid || !c.angebote) return;

  grid.innerHTML = c.angebote.map(a => `
    <div class="card" style="display:flex;flex-direction:column;height:100%;">
      ${a.badge ? `<span class="card__badge">${a.badge}</span>` : ''}
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
        <div class="card__icon" style="margin-bottom:0;">
          <i data-lucide="${getIconSvg(a.icon)}"></i>
        </div>
        <h3 class="mb-0">${a.title}</h3>
      </div>
      <div style="margin-bottom:1.5rem;flex:1;">
        ${a.details.map(d => `
          <div class="card__detail">
            <strong>${d.label}:</strong> <span>${d.value}</span>
          </div>
        `).join('')}
      </div>
      <div class="card__actions">
        <a href="${getWhatsAppLink(a.whatsappText)}" target="_blank" rel="noopener" class="btn btn--whatsapp btn--full">
          <i data-lucide="message-circle"></i>
          Per WhatsApp anfragen
        </a>
      </div>
    </div>
  `).join('');
}

/* ==========================================
   FAQ Page
   ========================================== */
function renderFAQ() {
  const c = siteContent;
  const accordion = document.getElementById('faq-accordion');
  if (!accordion || !c.faq) return;

  accordion.innerHTML = c.faq.map((item, i) => `
    <div class="accordion__item">
      <button class="accordion__trigger" aria-expanded="false" aria-controls="faq-panel-${i}">
        <span>${item.question}</span>
        <i data-lucide="chevron-down"></i>
      </button>
      <div class="accordion__content" id="faq-panel-${i}" role="region">
        <div class="accordion__body">${item.answer}</div>
      </div>
    </div>
  `).join('');

  // Re-init accordion after dynamic render
  initAccordion();
}

/* ==========================================
   Kontakt Page
   ========================================== */
function renderKontakt() {
  const c = siteContent;

  const phone = document.getElementById('contact-phone');
  const email = document.getElementById('contact-email');
  const insta = document.getElementById('contact-instagram');
  const instaHandle = document.getElementById('contact-instagram-handle');
  const waBtn = document.getElementById('contact-whatsapp-btn');

  if (phone) phone.textContent = c.site.phone;
  if (email) email.textContent = c.site.email;
  if (insta) insta.href = c.site.instagram;
  if (instaHandle) instaHandle.textContent = c.site.instagramHandle;
  if (waBtn) {
    waBtn.href = getWhatsAppLink('Hallo! Ich habe eine Frage zur Kinderbetreuung.');
  }
}

// Accordion init function (also used by main.js but needed here for dynamic content)
function initAccordion() {
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    // Remove old listeners by cloning
    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);

    newTrigger.addEventListener('click', () => {
      const item = newTrigger.closest('.accordion__item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion__item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        newTrigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Auto-load
document.addEventListener('DOMContentLoaded', loadContent);

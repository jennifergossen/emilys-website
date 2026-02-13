/**
 * Kleine Helden – Admin Panel
 * Loads content.json, provides edit forms, generates download
 */

const ADMIN_PASSWORD = 'kleinehelden2025';
let adminContent = null;

/* ==========================================
   Auth
   ========================================== */
function checkAuth() {
  const stored = sessionStorage.getItem('admin-auth');
  if (stored === 'true') {
    showPanel();
    return;
  }
  document.getElementById('admin-login').style.display = 'block';
  document.getElementById('admin-panel').style.display = 'none';
}

function doLogin() {
  const pw = document.getElementById('admin-password').value;
  if (pw === ADMIN_PASSWORD) {
    sessionStorage.setItem('admin-auth', 'true');
    showPanel();
  } else {
    document.getElementById('login-error').textContent = 'Falsches Passwort.';
  }
}

function doLogout() {
  sessionStorage.removeItem('admin-auth');
  location.reload();
}

async function showPanel() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  await loadAdminContent();
  renderAdminForms();
}

/* ==========================================
   Load Content
   ========================================== */
async function loadAdminContent() {
  try {
    const res = await fetch('data/content.json');
    adminContent = await res.json();
  } catch (err) {
    alert('Fehler beim Laden der Inhalte.');
    console.error(err);
  }
}

/* ==========================================
   Render Forms
   ========================================== */
function renderAdminForms() {
  if (!adminContent) return;
  renderSiteSettings();
  renderHeroSection();
  renderAboutSection();
  renderFeaturesSection();
  renderTestimonialsSection();
  renderAngeboteSection();
  renderFAQSection();
}

function renderSiteSettings() {
  const c = adminContent.site;
  document.getElementById('site-name').value = c.name || '';
  document.getElementById('site-slogan').value = c.slogan || '';
  document.getElementById('site-phone').value = c.phone || '';
  document.getElementById('site-email').value = c.email || '';
  document.getElementById('site-whatsapp').value = c.whatsapp || '';
  document.getElementById('site-instagram').value = c.instagram || '';
  document.getElementById('site-instagram-handle').value = c.instagramHandle || '';
  document.getElementById('site-location').value = c.location || '';
}

function renderHeroSection() {
  document.getElementById('hero-title').value = stripHtml(adminContent.hero.title);
  document.getElementById('hero-subtitle').value = adminContent.hero.subtitle;
}

function renderAboutSection() {
  const a = adminContent.about;
  document.getElementById('about-name').value = a.name || '';
  document.getElementById('about-short1').value = a.shortIntro || '';
  document.getElementById('about-short2').value = a.shortIntro2 || '';
  document.getElementById('about-full').value = a.fullIntro.map(stripHtml).join('\n\n');

  renderSchwerpunkte();
}

function renderSchwerpunkte() {
  const container = document.getElementById('schwerpunkte-list');
  container.innerHTML = adminContent.about.schwerpunkte.map((s, i) => `
    <div class="admin-item">
      <div class="form-group">
        <label>Titel</label>
        <input class="form-input" value="${escapeAttr(s.title)}" onchange="adminContent.about.schwerpunkte[${i}].title=this.value">
      </div>
      <div class="form-group">
        <label>Beschreibung</label>
        <textarea class="form-textarea" rows="3" onchange="adminContent.about.schwerpunkte[${i}].description=this.value">${escapeHtml(s.description)}</textarea>
      </div>
      <div class="admin-item__actions">
        <button class="btn btn--danger btn--small" onclick="removeSchwerpunkt(${i})">Entfernen</button>
      </div>
    </div>
  `).join('');
}

function addSchwerpunkt() {
  adminContent.about.schwerpunkte.push({
    icon: 'star',
    title: 'Neuer Schwerpunkt',
    description: 'Beschreibung hier eingeben...'
  });
  renderSchwerpunkte();
}

function removeSchwerpunkt(i) {
  if (confirm('Diesen Schwerpunkt wirklich entfernen?')) {
    adminContent.about.schwerpunkte.splice(i, 1);
    renderSchwerpunkte();
  }
}

function renderFeaturesSection() {
  const container = document.getElementById('features-list');
  container.innerHTML = adminContent.features.map((f, i) => `
    <div class="admin-item">
      <div class="form-group">
        <label>Titel</label>
        <input class="form-input" value="${escapeAttr(f.title)}" onchange="adminContent.features[${i}].title=this.value">
      </div>
      <div class="form-group">
        <label>Beschreibung</label>
        <input class="form-input" value="${escapeAttr(f.description)}" onchange="adminContent.features[${i}].description=this.value">
      </div>
    </div>
  `).join('');
}

function renderTestimonialsSection() {
  const container = document.getElementById('testimonials-list');
  container.innerHTML = adminContent.testimonials.map((t, i) => `
    <div class="admin-item">
      <div class="form-group">
        <label>Zitat</label>
        <textarea class="form-textarea" rows="2" onchange="adminContent.testimonials[${i}].quote=this.value">${escapeHtml(t.quote)}</textarea>
      </div>
      <div class="form-group">
        <label>Autor</label>
        <input class="form-input" value="${escapeAttr(t.author)}" onchange="adminContent.testimonials[${i}].author=this.value">
      </div>
      <div class="admin-item__actions">
        <button class="btn btn--danger btn--small" onclick="removeTestimonial(${i})">Entfernen</button>
      </div>
    </div>
  `).join('');
}

function addTestimonial() {
  adminContent.testimonials.push({ quote: 'Neues Zitat...', author: 'Familie X., Ort' });
  renderTestimonialsSection();
}

function removeTestimonial(i) {
  if (confirm('Dieses Testimonial wirklich entfernen?')) {
    adminContent.testimonials.splice(i, 1);
    renderTestimonialsSection();
  }
}

function renderAngeboteSection() {
  const container = document.getElementById('angebote-list');
  container.innerHTML = adminContent.angebote.map((a, i) => `
    <div class="admin-item">
      <div class="form-group">
        <label>Titel</label>
        <input class="form-input" value="${escapeAttr(a.title)}" onchange="adminContent.angebote[${i}].title=this.value">
      </div>
      <div class="form-group">
        <label>WhatsApp-Nachricht</label>
        <input class="form-input" value="${escapeAttr(a.whatsappText)}" onchange="adminContent.angebote[${i}].whatsappText=this.value">
      </div>
      <div class="form-group">
        <label>Badge (optional, z.B. "In Planung")</label>
        <input class="form-input" value="${escapeAttr(a.badge || '')}" onchange="adminContent.angebote[${i}].badge=this.value||undefined">
      </div>
      <h4 style="margin:1rem 0 0.5rem;font-size:0.875rem;">Details:</h4>
      ${a.details.map((d, j) => `
        <div style="display:grid;grid-template-columns:120px 1fr;gap:0.5rem;margin-bottom:0.5rem;">
          <input class="form-input" value="${escapeAttr(d.label)}" onchange="adminContent.angebote[${i}].details[${j}].label=this.value" style="font-size:0.8125rem;">
          <input class="form-input" value="${escapeAttr(d.value)}" onchange="adminContent.angebote[${i}].details[${j}].value=this.value" style="font-size:0.8125rem;">
        </div>
      `).join('')}
      <div class="admin-item__actions">
        <button class="btn btn--secondary btn--small" onclick="addAngebotDetail(${i})">+ Detail</button>
        <button class="btn btn--danger btn--small" onclick="removeAngebot(${i})">Angebot entfernen</button>
      </div>
    </div>
  `).join('');
}

function addAngebot() {
  adminContent.angebote.push({
    title: 'Neues Angebot',
    icon: 'star',
    whatsappText: 'Hallo! Ich interessiere mich für das neue Angebot.',
    details: [{ label: 'Wann', value: '' }]
  });
  renderAngeboteSection();
}

function removeAngebot(i) {
  if (confirm('Dieses Angebot wirklich entfernen?')) {
    adminContent.angebote.splice(i, 1);
    renderAngeboteSection();
  }
}

function addAngebotDetail(i) {
  adminContent.angebote[i].details.push({ label: 'Neu', value: '' });
  renderAngeboteSection();
}

function renderFAQSection() {
  const container = document.getElementById('faq-list');
  container.innerHTML = adminContent.faq.map((f, i) => `
    <div class="admin-item">
      <div class="form-group">
        <label>Frage</label>
        <input class="form-input" value="${escapeAttr(f.question)}" onchange="adminContent.faq[${i}].question=this.value">
      </div>
      <div class="form-group">
        <label>Antwort</label>
        <textarea class="form-textarea" rows="3" onchange="adminContent.faq[${i}].answer=this.value">${escapeHtml(f.answer)}</textarea>
      </div>
      <div class="admin-item__actions">
        <button class="btn btn--danger btn--small" onclick="removeFAQ(${i})">Entfernen</button>
      </div>
    </div>
  `).join('');
}

function addFAQ() {
  adminContent.faq.push({ question: 'Neue Frage?', answer: 'Antwort hier...' });
  renderFAQSection();
}

function removeFAQ(i) {
  if (confirm('Diese FAQ wirklich entfernen?')) {
    adminContent.faq.splice(i, 1);
    renderFAQSection();
  }
}

/* ==========================================
   Save / Collect changes from simple fields
   ========================================== */
function collectSimpleFields() {
  adminContent.site.name = document.getElementById('site-name').value;
  adminContent.site.slogan = document.getElementById('site-slogan').value;
  adminContent.site.phone = document.getElementById('site-phone').value;
  adminContent.site.email = document.getElementById('site-email').value;
  adminContent.site.whatsapp = document.getElementById('site-whatsapp').value;
  adminContent.site.instagram = document.getElementById('site-instagram').value;
  adminContent.site.instagramHandle = document.getElementById('site-instagram-handle').value;
  adminContent.site.location = document.getElementById('site-location').value;

  // Hero
  const heroTitle = document.getElementById('hero-title').value;
  adminContent.hero.title = heroTitle.includes('<') ? heroTitle : `${heroTitle}`;
  adminContent.hero.subtitle = document.getElementById('hero-subtitle').value;

  // About
  adminContent.about.name = document.getElementById('about-name').value;
  adminContent.about.shortIntro = document.getElementById('about-short1').value;
  adminContent.about.shortIntro2 = document.getElementById('about-short2').value;
  adminContent.about.fullIntro = document.getElementById('about-full').value
    .split('\n\n')
    .filter(p => p.trim());
}

function downloadContent() {
  collectSimpleFields();

  const json = JSON.stringify(adminContent, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  a.click();
  URL.revokeObjectURL(url);

  document.getElementById('save-status').textContent =
    'content.json wurde heruntergeladen! Laden Sie die Datei in den data/-Ordner auf GitHub hoch.';
  document.getElementById('save-status').style.display = 'block';
}

/* ==========================================
   Helpers
   ========================================== */
function stripHtml(str) {
  const tmp = document.createElement('div');
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Init
document.addEventListener('DOMContentLoaded', checkAuth);

/* ============================================
   KHYATI SCHOLARS — JavaScript v2.0
   Bug-Fixed | New Animations | AI Chat Enhanced
   ============================================ */

/* ========== PAGE LOAD ========== */
// Fix: set class BEFORE DOM is ready, then remove preload on load
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.remove('preload');
    document.body.classList.add('loaded');
  });
});

/* ========== PARTICLE CANVAS ========== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 55;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  // Only show particles over hero section
  let heroBottom = 0;
  function getHeroBottom() {
    const hero = document.getElementById('home');
    heroBottom = hero ? hero.getBoundingClientRect().bottom + window.scrollY : H;
  }
  getHeroBottom();
  window.addEventListener('scroll', getHeroBottom, { passive: true });

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    const scrollY = window.scrollY;
    if (scrollY > heroBottom) { requestAnimationFrame(drawParticles); return; }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(96,165,250,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

/* ========== TYPING ANIMATION ========== */
(function initTyping() {
  const el = document.getElementById('typingHeadline');
  if (!el) return;

  const phrases = [
    'अंग्रेज़ी भविष्य',
    'सीखने की राह',
    'AI से स्मार्ट बनें',
    'बोर्ड में सफलता',
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.slice(0, charIndex--);
    } else {
      el.textContent = current.slice(0, charIndex++);
    }

    let delay = isDeleting ? 55 : 95;
    if (!isDeleting && charIndex === current.length + 1) {
      // Pause at end
      el.classList.add('typing-done');
      setTimeout(() => {
        el.classList.remove('typing-done');
        isDeleting = true;
        setTimeout(type, 1200);
      }, 10);
      return;
    }
    if (isDeleting && charIndex < 0) {
      isDeleting = false;
      charIndex = 0;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 600);
})();

/* ========== NAVBAR SCROLL & ACTIVE LINKS ========== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section[id]');

// Combine scroll listeners into one
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar style
  if (scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Back-to-top visibility
  if (backToTop) {
    if (scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }

  // Hero parallax
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg && scrollY < window.innerHeight * 1.5) {
    heroBg.style.transform = `translateY(${scrollY * 0.28}px)`;
  }
}, { passive: true });

// Back to top click
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Active nav link via IntersectionObserver
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.25, rootMargin: '-60px 0px -60px 0px' });

sections.forEach(sec => sectionObserver.observe(sec));

/* ========== MOBILE MENU ========== */
function toggleMenu() {
  const navLinksEl = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (!navLinksEl || !hamburger) return;

  const isOpen = navLinksEl.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

  const spans = hamburger.querySelectorAll('span');
  if (spans.length >= 3) {
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0'; spans[1].style.transform = 'scaleX(0)';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      document.body.style.overflow = 'hidden';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = ''; spans[1].style.transform = '';
      spans[2].style.transform = '';
      document.body.style.overflow = '';
    }
  }
}

function closeMenu() {
  const navLinksEl = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (navLinksEl && navLinksEl.classList.contains('open')) {
    navLinksEl.classList.remove('open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      const spans = hamburger.querySelectorAll('span');
      if (spans.length >= 3) {
        spans[0].style.transform = '';
        spans[1].style.opacity = ''; spans[1].style.transform = '';
        spans[2].style.transform = '';
      }
    }
    document.body.style.overflow = '';
  }
}

// Close menu on any nav link or dropdown link click
document.querySelectorAll('#navLinks a').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Close on outside tap (mobile)
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar') && !e.target.closest('#navLinks')) {
    closeMenu();
  }
});

/* ========== SEARCH TABS ========== */
function setTab(el) {
  document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

/* ========== HERO SEARCH ========== */
function handleHeroSearch() {
  const query = document.getElementById('hero-search-input').value.trim();
  if (query) {
    document.getElementById('insights').scrollIntoView({ behavior: 'smooth' });
  }
}

const heroInput = document.getElementById('hero-search-input');
if (heroInput) {
  heroInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleHeroSearch();
  });
}

function fillSearch(chip) {
  const inp = document.getElementById('hero-search-input');
  if (inp) { inp.value = chip.textContent.trim(); inp.focus(); }
}

/* ========== STORIES CAROUSEL ========== */
let currentSlide = 0;
const slides = document.querySelectorAll('.story-slide');
const totalSlides = slides.length;
const dotsContainer = document.querySelector('.carousel-dots');

// Build dots dynamically
if (dotsContainer) {
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Story ${i + 1}`);
    dot.addEventListener('click', () => { clearInterval(carouselInterval); showSlide(i); carouselInterval = setInterval(carouselNext, 5500); });
    dotsContainer.appendChild(dot);
  }
}

function showSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');

  const countEl = document.getElementById('carousel-count');
  if (countEl) countEl.textContent = `${currentSlide + 1} / ${totalSlides}`;

  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function carouselPrev() { showSlide(currentSlide - 1); }
function carouselNext() { showSlide(currentSlide + 1); }

let carouselInterval = setInterval(carouselNext, 5500);

const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(carouselInterval); carouselPrev(); carouselInterval = setInterval(carouselNext, 5500); });
if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(carouselInterval); carouselNext(); carouselInterval = setInterval(carouselNext, 5500); });

// Swipe support on carousel
const carousel = document.getElementById('storiesCarousel');
if (carousel) {
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { clearInterval(carouselInterval); dx < 0 ? carouselNext() : carouselPrev(); carouselInterval = setInterval(carouselNext, 5500); }
  }, { passive: true });
}

/* ========== SCROLL REVEAL ========== */
// Fix: add reveal class BEFORE creating observer
const revealTargets = document.querySelectorAll(
  '.solution-card, .case-card, .insight-card, .domain-pill, .stat-item, .story-text, .ai-action-header, .craft-container > *, .domains-header'
);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 5) * 70}ms`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

/* ========== COUNTER ANIMATION ========== */
const statNumbers = document.querySelectorAll('.stat-num');
let countersStarted = false;
const statsSection = document.getElementById('stats');

if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounters();
      // Trigger stat underline animations
      document.querySelectorAll('.stat-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('animated'), i * 150);
      });
    }
  }, { threshold: 0.35 });
  statsObserver.observe(statsSection);
}

function animateCounters() {
  statNumbers.forEach((el, index) => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const startDelay = index * 120;
    setTimeout(() => {
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(update);
    }, startDelay);
  });
}

/* ========== DOMAIN PILLS ========== */
document.querySelectorAll('.domain-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.domain-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    setTimeout(() => {
      document.getElementById('insights').scrollIntoView({ behavior: 'smooth' });
    }, 200);
  });
});

/* ========== AI CHAT WIDGET ========== */
let chatOpen = false;

function toggleAIChat() {
  chatOpen = !chatOpen;
  const widget = document.getElementById('aiChatWidget');
  const fab = document.getElementById('aiFab');
  if (chatOpen) {
    widget.classList.add('open');
    fab.style.transform = 'scale(0.9)';
    fab.style.opacity = '0.7';
    setTimeout(() => {
      const inp = document.getElementById('chatInput');
      if (inp) inp.focus();
    }, 350);
  } else {
    widget.classList.remove('open');
    fab.style.transform = '';
    fab.style.opacity = '';
  }
}

const aiData = {
  english: "हमारी AI-powered English coaching में grammar, vocabulary, reading comprehension, essay writing और spoken English शामिल हैं — सब RBSE syllabus के अनुसार Classes 1-12 के लिए। हर छात्र को हर हफ्ते update होने वाला personalised AI study plan मिलता है!",
  enroll: "Enroll करने के लिए 'फ्री डेमो बुक करें' पर click करें या हमें WhatsApp करें +91 89497 60116 पर। हम 3 FREE demo classes देते हैं, कोई obligation नहीं। हर batch में सिर्फ 15 छात्र होते हैं इसलिए जल्दी seat book करें!",
  fee: "हमारी fees Tier 2-3 शहरों के परिवारों के हिसाब से affordable और transparent हैं — कोई hidden charge नहीं। Current batch fee के लिए WhatsApp करें +91 89497 60116 पर।",
  result: "हमारे छात्र लगातार RBSE English board exams में 90%+ लाते हैं। हमारे M.A. Gold Medalist faculty की personalised approach और AI study plans ने 95%+ pass rate दिया है हर साल!",
  ai: "हम AI tools का इस्तेमाल करते हैं हर छात्र की English writing analyze करने, grammar patterns पहचानने, targeted vocabulary exercises suggest करने और weekly personalised practice plans बनाने के लिए। समझो यह 24/7 AI-powered English tutor है — हमारे expert faculty के साथ!",
  batch: "हम हर batch में सिर्फ अधिकतम 15 छात्र रखते हैं ताकि हर बच्चे पर individual attention मिले। Batch full होते ही नया खोलते हैं। जल्दी seat book करें!",
  location: "हमारा मुख्य coaching centre मालपुरा, राजस्थान में है। WhatsApp, Zoom और Google Meet पर online classes भी होती हैं — राजस्थान और उससे बाहर के छात्रों के लिए।",
  hello: "नमस्ते! ख्याति स्कॉलर्स अकादमी में स्वागत है &#128075; मैं KhyatiAI हूँ। AI-powered English coaching, batches, fees या किसी भी चीज़ के बारे में पूछें — हिंदी में!",
  teacher: "हमारी lead faculty M.A. (English) में Gold Medalist हैं MDS University से (Top 10 rank) और B.Ed. Topper भी। Classes XI &amp; XII में active school teaching का अनुभव है। Expert human mentorship + AI personalisation — दोनों एक साथ!",
  default: [
    "हमारी AI-powered English programme expert M.A. Gold Medalist faculty और personalised AI study plans को मिलाती है — Tier 2-3 India के हर छात्र को metro-quality English education देती है किफायती fees पर।",
    "बढ़िया सवाल! ख्याति स्कॉलर्स में AI exactly पहचानता है कि छात्र English में कहाँ struggle कर रहा है — grammar हो, vocabulary हो या comprehension — और उसके लिए रोज़ custom practice plan बनाता है।",
    "हमने मालपुरा और आसपास के Tier-3 कस्बों के 500+ छात्रों को सिर्फ 3 महीने में RBSE English scores में औसतन 22 अंक सुधारने में मदद की है। क्या आप FREE demo session book करना चाहेंगे?",
    "ख्याति में AI का मतलब है: 24/7 grammar correction, AI-generated RBSE-aligned practice questions, parents के लिए weekly performance reports, और adaptive difficulty जो छात्र के साथ बढ़ती है — सब Tier-3 city fees पर!",
  ]
};

function getBotResponse(userMsg) {
  const msg = userMsg.toLowerCase();
  if (msg.match(/hello|hi|hey|namaste|hy/)) return aiData.hello;
  if (msg.match(/enroll|join|admission|demo|book/)) return aiData.enroll;
  if (msg.match(/fee|fees|price|cost|charge|rate/)) return aiData.fee;
  if (msg.match(/result|score|mark|board|rbse|pass/)) return aiData.result;
  if (msg.match(/ai|artificial|tool|app|tech|software/)) return aiData.ai;
  if (msg.match(/batch|seat|limit|student|class/)) return aiData.batch;
  if (msg.match(/location|address|where|malpura|rajasthan|online|offline/)) return aiData.location;
  if (msg.match(/teacher|faculty|ma|gold|medalist|mentor/)) return aiData.teacher;
  if (msg.match(/english|grammar|vocabulary|speaking|writing|reading/)) return aiData.english;
  return aiData.default[Math.floor(Math.random() * aiData.default.length)];
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  if (!input || !messages) return;
  const userMsg = input.value.trim();
  if (!userMsg) return;

  // User bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-msg user-msg';
  userDiv.innerHTML = `<p>${userMsg.replace(/</g, '&lt;')}</p>`;
  messages.appendChild(userDiv);
  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot-msg';
  typingDiv.innerHTML = '<p><span class="typing-dots">&#x25CF;&#x25CF;&#x25CF;</span></p>';
  messages.appendChild(typingDiv);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    typingDiv.innerHTML = `<p>${getBotResponse(userMsg)}</p>`;
    messages.scrollTop = messages.scrollHeight;
  }, 850 + Math.random() * 500);
}

const chatInput = document.getElementById('chatInput');
if (chatInput) {
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
  });
}

/* ========== RIPPLE EFFECT ON BUTTONS ========== */
function addRipple(e) {
  const btn = e.currentTarget;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position:absolute;width:${size}px;height:${size}px;
    left:${e.clientX - rect.left - size/2}px;
    top:${e.clientY - rect.top - size/2}px;
    background:rgba(255,255,255,0.25);border-radius:50%;
    transform:scale(0);animation:rippleAnim 0.55s ease-out;
    pointer-events:none;
  `;
  if (!btn.style.position || btn.style.position === 'static') btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// Add ripple style
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }';
document.head.appendChild(rippleStyle);

document.querySelectorAll('.btn-hero-primary, .btn-hero-outline, .btn-primary-outline, .btn-future, .btn-ai-chat, .btn-whatsapp-nav').forEach(btn => {
  btn.addEventListener('click', addRipple);
});

/* ========== IMAGE LAZY LOAD SHIMMER ========== */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.closest('.insight-card, .sol-card-img, .case-img-wrap')?.classList.add('loading');
  img.addEventListener('load', () => {
    img.closest('.insight-card, .sol-card-img, .case-img-wrap')?.classList.remove('loading');
  });
  img.addEventListener('error', () => {
    img.closest('.insight-card, .sol-card-img, .case-img-wrap')?.classList.remove('loading');
  });
});

/* ========== CAROUSEL DOTS (append to DOM) ========== */
const storiesSection = document.querySelector('.top-stories');
if (storiesSection && !storiesSection.querySelector('.carousel-dots')) {
  const dotsDiv = document.createElement('div');
  dotsDiv.className = 'carousel-dots';
  storiesSection.appendChild(dotsDiv);
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { clearInterval(carouselInterval); showSlide(i); carouselInterval = setInterval(carouselNext, 5500); });
    dotsDiv.appendChild(dot);
  }
}

/* ========== SMOOTH LINK SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

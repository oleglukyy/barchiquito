// ===================== NAVBAR SCROLL =====================
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===================== HAMBURGER MENU =====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// ===================== HERO BG ANIMATION =====================
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  setTimeout(() => heroBg.classList.add('loaded'), 100);
}

// ===================== SCROLL REVEAL =====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===================== ACTIVE NAV LINK =====================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ===================== CARTA TABS ACTIVE STATE =====================
const cartaTabs = document.querySelectorAll('.carta-tab');
if (cartaTabs.length > 0) {
  const sections = document.querySelectorAll('[data-section]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('data-section');
        cartaTabs.forEach(tab => {
          tab.classList.toggle('active', tab.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  cartaTabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(tab.getAttribute('href'));
      if (target) {
        const offset = 120;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===================== TEAM CAROUSEL =====================
(function () {
  const track = document.getElementById('teamTrack');
  if (!track) return;

  const cards = Array.from(track.children);
  const dotsContainer = document.getElementById('teamDots');
  const btnLeft = document.querySelector('.team-arrow-left');
  const btnRight = document.querySelector('.team-arrow-right');

  let current = 0;
  let autoTimer = null;

  function getVisible() {
    const vw = window.innerWidth;
    if (vw <= 480) return 1;
    if (vw <= 768) return 2;
    if (vw <= 1024) return 3;
    return 4;
  }

  function maxIndex() {
    return Math.max(0, cards.length - getVisible());
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'team-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Ir a slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.team-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function getCardWidth() {
    if (!cards[0]) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function render() {
    const offset = current * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    btnLeft.disabled = current === 0;
    btnRight.disabled = current >= maxIndex();
    updateDots();
  }

  function goTo(idx) {
    current = Math.min(Math.max(idx, 0), maxIndex());
    render();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    autoTimer = setInterval(() => {
      if (current >= maxIndex()) goTo(0);
      else next();
    }, 3500);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  btnLeft.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  btnRight.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startAuto();
  });

  window.addEventListener('resize', () => {
    if (current > maxIndex()) current = maxIndex();
    buildDots();
    render();
  });

  buildDots();
  render();
  startAuto();
})();


function staggerReveal(selector, delay = 100) {
  const items = document.querySelectorAll(selector);
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * delay}ms`;
    revealObserver.observe(item);
  });
}

staggerReveal('.spec-card.reveal', 80);
staggerReveal('.review-card.reveal', 100);
staggerReveal('.postre-card.reveal', 80);

const stage = document.querySelector('#stage');
const screens = [...document.querySelectorAll('.screen')];
const hero = document.querySelector('#hero');
const detail = document.querySelector('#experience-detail');
const detailTitle = document.querySelector('.experience__detail-title');
const detailBack = document.querySelector('.experience__detail-back');
const detailCopy = document.querySelector('.experience__detail-copy');
const about = document.querySelector('#about');
const aboutParagraph = document.querySelector('.about__body p');
const scrollCue = document.querySelector('#scroll-cue');
let current = 0;
let transitioning = false;
let aboutOffset = 0;
let heroGestureProgress = 0;
const ABOUT_SCROLL_DISTANCE = 3072;
const aboutWords = aboutParagraph.textContent.trim().split(/\s+/);

aboutParagraph.replaceChildren(...aboutWords.flatMap((word, index) => {
  const span = document.createElement('span');
  span.className = 'about__word';
  span.textContent = word;
  return index === aboutWords.length - 1 ? [span] : [span, document.createTextNode(' ')];
}));

const experience = {
  amini: 'Serving in the Office of the CEO, I support product success, client adoption, and government stakeholder engagement across Amini’s national digital transformation initiatives.\n\nMy work includes coordinating between government officials, Product, Engineering, Support, and Data teams to align product scope, track KPIs, resolve implementation issues, and translate stakeholder feedback into actionable product insights. \n\nI have also supported the Bajan-X national data-exchange initiative by delivering API training, conducting government data audits, supporting API ingestion, AWS data storage, RAG-based knowledge graph development, software demos, and geospatial digital twin work using Blender and QGIS.',
  bluewaters: 'Acted as Stock Control Coordinator, I supported warehouse stock accuracy, reporting, and operational efficiency across saleable and non-saleable inventory. \n\nI designed a macro-enabled Excel damage recording system that automated data entry, storage, clearing, and PDF reporting, improving warehouse documentation and reporting speed. \n\nI also managed daily stock reporting, supported monthly financial stock counts, investigated variances, enforced stock control policies, built GP and Power BI reports, and developed ABC analysis to support warehouse transformation and inventory decision-making.',
  ey: 'Acted as a Staff 2 AI & Data Consultant, I supported data analytics, automation, reporting, and project delivery across client engagements. \n\nI automated survey data workflows from Microsoft Forms to SQL using SSIS, performed data validation and cleansing for government salary backpay audits, and used tools such as Alteryx, R, SQL, Qualtrics, Excel, PowerPoint, and Power BI to analyze data and present insights. \n\nI also developed executive dashboards, supported project management activities, and prepared Statements of Work and engagement memos for client projects.',
  prestige: 'Acted as a Project and Business Analyst, I supported the VP of Operations by coordinating operational projects, gathering data to build realistic project timelines, and reporting on project progress using MS Project and other reporting tools.\n\nI also developed Tableau insights to help identify opportunities for reducing waste and improving operational efficiency across business processes.',
  guardian: 'Acted as a Data Transformation Associate in the Office of the President, I supported enterprise transformation reporting, analytics, and project management across a large portfolio of initiatives. \n\nI prepared over 20 weekly Steering Committee reports, mined and cleaned data from Power BI, McKinsey’s WAVE platform, and Excel, and used pivot tables, graphs, and milestone analysis to highlight project delays, upcoming deliverables, and KPI updates. \n\nI also tracked over 1,000 initiatives and milestones, liaised with stakeholders and executives, quality-checked data, and documented transformation processes to support accurate decision-making.'
};

const experiencePositions = {
  amini: [814, 258],
  bluewaters: [816, 258],
  ey: [814, 258],
  prestige: [816, 256],
  guardian: [814, 258]
};

const experienceNames = {
  amini: 'Amini',
  bluewaters: 'Blue Waters Products Ltd',
  ey: 'Ernst and Young',
  prestige: 'Prestige Holdings Limited',
  guardian: 'Guardian Life'
};

const isMobileView = () => matchMedia('(max-width: 768px), (pointer: coarse)').matches;

function fitStage() {
  const mobile = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  const width = mobile ? 402 : 1440;
  const height = mobile ? 874 : 1024;
  const scale = Math.min(innerWidth / width, innerHeight / height);
  stage.style.setProperty('--scale', scale);
}

function setViewportBackground(color) {
  document.documentElement.style.backgroundColor = color;
  document.body.style.backgroundColor = color;
}

function show(index) {
  current = Math.max(0, Math.min(2, index));
  screens.forEach((screen, i) => screen.classList.toggle('is-active', i === current));
  scrollCue.classList.toggle('is-visible', current === 0);
  setViewportBackground(current === 1 ? (about.style.backgroundColor || 'rgb(227,242,114)') : 'rgb(14,17,23)');
}

function mixColor(from, to, amount) {
  const value = from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
  return `rgb(${value.join(',')})`;
}

function updateAboutProgress() {
  const progress = Math.max(0, Math.min(1, aboutOffset / ABOUT_SCROLL_DISTANCE));
  const words = document.querySelectorAll('.about__word');
  words.forEach((word, index) => {
    const start = index / words.length;
    const end = (index + 1) / words.length;
    const wordProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    word.style.color = mixColor([124,77,255], [14,17,23], wordProgress);
  });
  const backgroundProgress = Math.max(0, Math.min(1, (progress - .7) / .3));
  const aboutBackground = mixColor([227,242,114], [14,17,23], backgroundProgress);
  about.style.backgroundColor = aboutBackground;
  if (current === 1) setViewportBackground(aboutBackground);
}

const heroParts = {
  blob: document.querySelector('.hero__blob-wrap'),
  portrait: document.querySelector('.hero__portrait-wrap'),
  data: document.querySelector('.hero__role--data'),
  web: document.querySelector('.hero__role--web'),
  name: document.querySelector('.hero__name'),
  location: document.querySelector('.hero__location')
};

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function renderHeroGesture(progress) {
  heroGestureProgress = clamp(progress);
  const p = heroGestureProgress;
  scrollCue.classList.toggle('is-visible', p < .03);
  hero.classList.remove('is-entering', 'is-exiting', 'is-returning');
  hero.style.visibility = 'visible';
  hero.style.opacity = '1';
  hero.style.pointerEvents = p < .98 ? 'auto' : 'none';
  about.style.visibility = 'visible';
  about.style.opacity = String(clamp((p - .72) / .28));
  about.style.pointerEvents = 'none';

  heroParts.blob.style.transform = `translate(${462.228 * p}px, ${-184 * p}px) scale(${1 + 8.04 * p})`;
  heroParts.portrait.style.transform = `translateY(${726.237 * p}px)`;
  heroParts.data.style.transform = `translateX(${-415 * p}px)`;
  heroParts.web.style.transform = `translateX(${537 * p}px)`;
  heroParts.name.style.transform = `translateY(${-337 * p}px)`;
  heroParts.location.style.transform = `translateX(${440 * p}px)`;
  aboutParagraph.style.transform = `translateY(${200 * (1 - p)}px)`;
  aboutParagraph.style.opacity = String(clamp((p - .72) / .28));
}

function clearHeroGestureStyles() {
  Object.values(heroParts).forEach(part => { part.style.transform = ''; });
  hero.style.visibility = '';
  hero.style.opacity = '';
  hero.style.pointerEvents = '';
  about.style.visibility = '';
  about.style.opacity = '';
  about.style.pointerEvents = '';
  aboutParagraph.style.transform = '';
  aboutParagraph.style.opacity = '';
}

function settleHero(target, velocity = 0) {
  const start = heroGestureProgress;
  const distance = Math.abs(target - start);
  const speed = Math.max(.75, Math.min(2.4, Math.abs(velocity) * 2.2));
  const duration = Math.max(120, 520 * distance / speed);
  const started = performance.now();
  transitioning = true;
  const tick = now => {
    const t = clamp((now - started) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    renderHeroGesture(start + (target - start) * eased);
    if (t < 1) requestAnimationFrame(tick);
    else {
      transitioning = false;
      if (target === 1) {
        clearHeroGestureStyles();
        showAbout(0);
      } else {
        clearHeroGestureStyles();
        show(0);
        heroGestureProgress = 0;
      }
    }
  };
  requestAnimationFrame(tick);
}

function showAbout(progress = 0) {
  show(1);
  aboutOffset = ABOUT_SCROLL_DISTANCE * progress;
  updateAboutProgress();
  about.classList.remove('is-entering');
  void about.offsetWidth;
  about.classList.add('is-entering');
  setTimeout(() => about.classList.remove('is-entering'), 500);
}

function aboutToExperience() {
  if (transitioning) return;
  const experienceScreen = document.querySelector('#experience');
  transitioning = true;
  show(2);
  experienceScreen.classList.add('is-entering');
  setTimeout(() => {
    experienceScreen.classList.remove('is-entering');
    transitioning = false;
  }, 600);
}

function down() {
  if (transitioning) return;
  if (current === 0) {
    scrollCue.classList.remove('is-visible');
    transitioning = true;
    hero.classList.remove('is-entering', 'is-returning');
    hero.classList.add('is-exiting');
    setTimeout(() => { showAbout(0); transitioning = false; }, 2000);
  } else if (current === 1) aboutToExperience();
}

function up() {
  if (transitioning || current === 0) return;
  if (current === 2) { showAbout(1); return; }
  transitioning = true;
  show(0);
  hero.classList.remove('is-exiting', 'is-entering', 'is-returning');
  void hero.offsetWidth;
  hero.classList.add('is-returning');
  setTimeout(() => {
    hero.classList.remove('is-returning');
    transitioning = false;
  }, 2018);
}

addEventListener('resize', fitStage);
addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') { event.preventDefault(); down(); }
  if (event.key === 'ArrowUp') { event.preventDefault(); up(); }
});

let lastWheel = 0;
addEventListener('wheel', event => {
  if (current === 1 && !transitioning) {
    event.preventDefault();
    if (event.deltaY > 0 && aboutOffset >= ABOUT_SCROLL_DISTANCE) { aboutToExperience(); return; }
    if (event.deltaY < 0 && aboutOffset <= 0) { up(); return; }
    aboutOffset = Math.max(0, Math.min(ABOUT_SCROLL_DISTANCE, aboutOffset + event.deltaY));
    updateAboutProgress();
    return;
  }
  const now = Date.now();
  if (now - lastWheel < 900 || Math.abs(event.deltaY) < 12) return;
  lastWheel = now;
  if (event.deltaY > 0) down();
  else up();
}, { passive:false });

let touch = null;
addEventListener('touchstart', event => {
  if (transitioning || event.touches.length !== 1) return;
  const y = event.touches[0].clientY;
  touch = { startY:y, lastY:y, lastTime:performance.now(), velocity:0, startAbout:aboutOffset, startHero:heroGestureProgress };
}, { passive:true });

addEventListener('touchmove', event => {
  if (!touch || event.touches.length !== 1) return;
  const now = performance.now();
  const y = event.touches[0].clientY;
  const dt = Math.max(1, now - touch.lastTime);
  touch.velocity = (touch.lastY - y) / dt;
  touch.lastY = y;
  touch.lastTime = now;
  const upwardDistance = touch.startY - y;

  if (current === 0) {
    event.preventDefault();
    renderHeroGesture(touch.startHero + upwardDistance / (innerHeight * .72));
    return;
  }

  if (current === 1) {
    event.preventDefault();
    aboutOffset = clamp(touch.startAbout + upwardDistance * 5.2, 0, ABOUT_SCROLL_DISTANCE);
    updateAboutProgress();
    const reverseOverscroll = Math.max(0, y - touch.startY - touch.startAbout / 5.2);
    if (reverseOverscroll > 0) {
      heroGestureProgress = clamp(1 - reverseOverscroll / (innerHeight * .72));
      renderHeroGesture(heroGestureProgress);
    }
  }
}, { passive:false });

addEventListener('touchend', () => {
  if (!touch) return;
  const velocity = touch.velocity;
  if (current === 0) {
    const target = heroGestureProgress > .28 || velocity > .45 ? 1 : 0;
    settleHero(target, velocity);
  } else if (current === 1) {
    if (heroGestureProgress < .96) settleHero(0, velocity);
    else if (aboutOffset >= ABOUT_SCROLL_DISTANCE - 2 && velocity > .18) aboutToExperience();
  } else if (current === 2 && velocity < -.18) {
    const experienceScreen = document.querySelector('#experience');
    if (experienceScreen.classList.contains('is-detail-mode')) closeMobileDetail();
    else showAbout(1);
  }
  touch = null;
}, { passive:true });

addEventListener('touchcancel', () => {
  if (current === 0 && heroGestureProgress > 0) settleHero(heroGestureProgress > .5 ? 1 : 0);
  touch = null;
}, { passive:true });

document.querySelectorAll('[data-company]').forEach(link => {
  const reveal = () => {
    const company = link.dataset.company;
    const [left, top] = experiencePositions[company];
    detailCopy.textContent = `\n${experience[company]}`;
    detail.style.left = `${left}px`;
    detail.style.top = `${top}px`;
    detail.classList.remove('is-visible');
    void detail.offsetWidth;
    detail.classList.add('is-visible');
  };
  link.addEventListener('mouseenter', reveal);
  link.addEventListener('focus', reveal);
  link.addEventListener('click', event => {
    if (!isMobileView()) return;
    event.preventDefault();
    const company = link.dataset.company;
    detail.style.left = '';
    detail.style.top = '';
    detailTitle.textContent = experienceNames[company];
    detailCopy.textContent = experience[company];
    document.querySelector('#experience').classList.add('is-detail-mode');
    detail.classList.remove('is-visible');
    void detail.offsetWidth;
    detail.classList.add('is-visible');
  });
});

function closeMobileDetail() {
  document.querySelector('#experience').classList.remove('is-detail-mode');
  detail.classList.remove('is-visible');
}

detailTitle.addEventListener('click', closeMobileDetail);
detailBack.addEventListener('click', closeMobileDetail);
scrollCue.addEventListener('click', down);

fitStage();
setTimeout(() => hero.classList.remove('is-entering'), 501);

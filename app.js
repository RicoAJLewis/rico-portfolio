const stage = document.querySelector('#stage');
const screens = [...document.querySelectorAll('.screen')];
const hero = document.querySelector('#hero');
const detail = document.querySelector('#experience-detail');
const about = document.querySelector('#about');
const aboutParagraph = document.querySelector('.about__body p');
let current = 0;
let transitioning = false;
let aboutOffset = 0;
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

function fitStage() {
  const scale = Math.min(innerWidth / 1440, innerHeight / 1024);
  stage.style.setProperty('--scale', scale);
}

function show(index) {
  current = Math.max(0, Math.min(2, index));
  screens.forEach((screen, i) => screen.classList.toggle('is-active', i === current));
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
  about.style.backgroundColor = mixColor([227,242,114], [14,17,23], backgroundProgress);
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

let touchStartY = null;
addEventListener('touchstart', event => { touchStartY = event.touches[0].clientY; }, { passive:true });
addEventListener('touchend', event => {
  if (touchStartY == null) return;
  const distance = touchStartY - event.changedTouches[0].clientY;
  if (Math.abs(distance) > 40) distance > 0 ? down() : up();
  touchStartY = null;
}, { passive:true });

document.querySelectorAll('[data-company]').forEach(link => {
  const reveal = () => {
    const company = link.dataset.company;
    const [left, top] = experiencePositions[company];
    detail.textContent = `\n${experience[company]}`;
    detail.style.left = `${left}px`;
    detail.style.top = `${top}px`;
    detail.classList.remove('is-visible');
    void detail.offsetWidth;
    detail.classList.add('is-visible');
  };
  link.addEventListener('mouseenter', reveal);
  link.addEventListener('focus', reveal);
});

fitStage();
setTimeout(() => hero.classList.remove('is-entering'), 501);

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const demoForm = document.getElementById('demoQuoteForm');
const formStatus = document.getElementById('formStatus');
const revealItems = document.querySelectorAll('[data-reveal]');

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  siteNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu();
  });
}

if (demoForm && formStatus) {
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = 'Demo only: this sample form does not transmit or store information.';
  });
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', Math.min(index * 34, 170) + 'ms');
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const services = [
  {
    name: 'Interior Reset',
    price: '$149',
    use: 'Ideal demo use case: daily buildup, neglected cabin surfaces, or a vehicle that needs its interior to feel organized again.',
    description: 'Focused cleanup for the cabin, touchpoints, glass, surfaces, and the everyday buildup that makes a vehicle feel tired.',
    includes: ['Interior vacuum and surface reset', 'Interior glass', 'Dash and touchpoint cleanup', 'Finishing pass on trim and presentation']
  },
  {
    name: 'Exterior Detail',
    price: '$179',
    use: 'Ideal demo use case: exterior road film, wheel buildup, dull presentation, or a vehicle that needs a careful outside reset.',
    description: 'Careful wash process, wheel and tire cleanup, exterior glass, finishing touches, and protection for a sharper final presentation.',
    includes: ['Careful exterior wash', 'Wheel and tire cleanup', 'Exterior glass', 'Finishing protection example']
  },
  {
    name: 'Full Detail',
    price: '$289',
    use: 'Ideal demo use case: vehicles that need coordinated interior and exterior attention rather than a single-area cleanup.',
    description: 'A coordinated interior and exterior reset for vehicles that need more than a quick pass and deserve a complete refresh.',
    includes: ['Interior Reset presentation', 'Exterior Detail presentation', 'Coordinated finishing pass', 'Condition-based final inspection']
  },
  {
    name: 'Paint Enhancement',
    price: 'Quote example',
    use: 'Ideal demo use case: paint that looks dull or lightly marred and would benefit from a more deliberate finish-focused service.',
    description: 'A demo example of a higher-care finish service focused on improving gloss and reducing the visual impact of light defects.',
    includes: ['Paint-condition inspection', 'Finish-preparation example', 'Gloss-enhancement process', 'Protection and final presentation']
  },
  {
    name: 'Maintenance Detail',
    price: '$99',
    use: 'Ideal demo use case: a previously detailed vehicle that needs a lighter recurring service to stay clean and presentable.',
    description: 'A lighter recurring service concept designed to help a previously detailed vehicle stay clean and presentable.',
    includes: ['Light interior refresh', 'Maintenance exterior wash', 'Glass and touchpoint cleanup', 'Presentation check']
  }
];

const stage = document.getElementById('serviceOrbitStage');
const orbit = document.getElementById('serviceOrbit');
const cards = orbit ? [...orbit.querySelectorAll('.orbit-card')] : [];
const previousButton = document.getElementById('servicePrevious');
const nextButton = document.getElementById('serviceNext');
const status = document.getElementById('serviceStatus');
const dialog = document.getElementById('serviceDialog');
const dialogClose = document.getElementById('serviceDialogClose');
const dialogTitle = document.getElementById('serviceDialogTitle');
const dialogUse = document.getElementById('serviceDialogUse');
const dialogDescription = document.getElementById('serviceDialogDescription');
const dialogPrice = document.getElementById('serviceDialogPrice');
const dialogIncludes = document.getElementById('serviceDialogIncludes');
const dialogCta = document.getElementById('serviceDialogCta');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const AUTO_CYCLE_MS = 5600;
const USER_PAUSE_MS = 15000;
let selectedIndex = 0;
let userPauseUntil = 0;
let autoTimer = null;

function wrappedDelta(index, selected, count) {
  let delta = index - selected;
  const midpoint = Math.floor(count / 2);
  if (delta > midpoint) delta -= count;
  if (delta < -midpoint) delta += count;
  return delta;
}

function setCardTransform(card, delta, mobile) {
  const distance = Math.abs(delta);
  let x;
  let y;
  let z;
  let yaw;
  let scale;
  let opacity;

  if (mobile) {
    x = delta * 74;
    y = distance * 15;
    z = distance * -42;
    yaw = delta * -7;
    scale = Math.max(0.78, 1 - distance * 0.1);
    opacity = Math.max(0.35, 1 - distance * 0.24);
  } else {
    const angle = delta * 58;
    const radians = angle * Math.PI / 180;
    x = Math.sin(radians) * 310;
    y = distance * 22;
    z = (Math.cos(radians) - 1) * 115;
    yaw = delta * -13;
    scale = Math.max(0.72, 1 - distance * 0.12);
    opacity = Math.max(0.42, 1 - distance * 0.2);
  }

  card.style.setProperty('--orbit-x', x + 'px');
  card.style.setProperty('--orbit-y', y + 'px');
  card.style.setProperty('--orbit-z', z + 'px');
  card.style.setProperty('--orbit-yaw', yaw + 'deg');
  card.style.setProperty('--orbit-scale', String(scale));
  card.style.setProperty('--orbit-opacity', String(opacity));
  card.style.zIndex = String(20 - distance);
}

function renderOrbit() {
  if (!cards.length) return;
  const mobile = window.innerWidth < 700;

  cards.forEach((card, index) => {
    const delta = wrappedDelta(index, selectedIndex, cards.length);
    const selected = delta === 0;

    setCardTransform(card, delta, mobile);
    card.classList.toggle('is-selected', selected);
    card.setAttribute('aria-current', selected ? 'true' : 'false');
    card.tabIndex = selected ? 0 : -1;
  });

  if (status) {
    status.textContent = services[selectedIndex].name + ' selected · ' + (selectedIndex + 1) + ' of ' + services.length;
  }

  stage?.style.setProperty('--selected-index', String(selectedIndex));
}

function pauseAutomaticCycle() {
  userPauseUntil = Date.now() + USER_PAUSE_MS;
}

function selectService(index, userInitiated = false) {
  selectedIndex = (index + services.length) % services.length;
  if (userInitiated) pauseAutomaticCycle();
  renderOrbit();
}

function rotateServices(direction, userInitiated = true) {
  selectService(selectedIndex + direction, userInitiated);
}

function openServiceDialog(index, trigger) {
  if (!dialog) return;
  const service = services[index];
  if (!service) return;

  selectedIndex = index;
  pauseAutomaticCycle();
  renderOrbit();

  dialogTitle.textContent = service.name;
  dialogUse.textContent = service.use;
  dialogDescription.textContent = service.description;
  dialogPrice.textContent = service.price;
  dialogIncludes.replaceChildren(...service.includes.map((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }));

  dialog.dataset.returnFocus = trigger?.dataset?.service ?? '';
  dialog.showModal();
}

function startAutomaticCycle() {
  window.clearInterval(autoTimer);
  autoTimer = null;

  if (reducedMotion.matches || !cards.length) return;

  autoTimer = window.setInterval(() => {
    if (document.hidden || dialog?.open || Date.now() < userPauseUntil) return;
    rotateServices(1, false);
  }, AUTO_CYCLE_MS);
}

previousButton?.addEventListener('click', () => rotateServices(-1, true));
nextButton?.addEventListener('click', () => rotateServices(1, true));

cards.forEach((card, index) => {
  card.addEventListener('click', () => openServiceDialog(index, card));
});

stage?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    rotateServices(-1, true);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    rotateServices(1, true);
  } else if ((event.key === 'Enter' || event.key === ' ') && event.target === stage) {
    event.preventDefault();
    openServiceDialog(selectedIndex, cards[selectedIndex]);
  }
});

stage?.addEventListener('pointerdown', pauseAutomaticCycle, { passive: true });
stage?.addEventListener('focusin', pauseAutomaticCycle);

dialogClose?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog?.addEventListener('close', () => {
  pauseAutomaticCycle();
  const returnIndex = Number(dialog.dataset.returnFocus);
  if (Number.isInteger(returnIndex) && cards[returnIndex]) cards[returnIndex].focus();
});
dialogCta?.addEventListener('click', () => dialog.close());

window.addEventListener('resize', renderOrbit);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) pauseAutomaticCycle();
});
reducedMotion.addEventListener?.('change', () => {
  renderOrbit();
  startAutomaticCycle();
});

renderOrbit();
startAutomaticCycle();

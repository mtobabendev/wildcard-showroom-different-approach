const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const revealItems = document.querySelectorAll('[data-reveal]');
const demoForm = document.getElementById('demoQuoteForm');
const formStatus = document.getElementById('formStatus');

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  siteNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', function () {
    const open = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  navLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) closeMenu(); });
}

if (demoForm && formStatus) {
  demoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    formStatus.textContent = 'Demo only: this sample commerce inquiry does not transmit, save, or purchase anything.';
  });
}

const showcaseItems = [
  {
    title: 'Signature Full Detail',
    type: 'FEATURED SERVICE PACKAGE',
    price: 'SAMPLE · $349',
    description: 'A premium inside-and-out reset presented as the hero offer for visitors who want the complete experience.',
    includes: ['Interior deep clean presentation', 'Exterior decontamination presentation', 'Finish protection presentation']
  },
  {
    title: 'Ceramic Prep',
    type: 'SPECIALTY SERVICE PATH',
    price: 'SAMPLE · $499',
    description: 'A higher-value specialist package demonstrating how prep, correction, and protection can be merchandised as a premium journey.',
    includes: ['Condition review presentation', 'Paint preparation story', 'Protection-ready finish presentation']
  },
  {
    title: 'Interior Luxe',
    type: 'PREMIUM INTERIOR PACKAGE',
    price: 'SAMPLE · $229',
    description: 'A richer interior-only package framed for customers who care about cabin presentation, materials, and finishing detail.',
    includes: ['Deep cabin reset presentation', 'Material-focused care story', 'Glass and touchpoint finishing']
  },
  {
    title: 'Finish Lab Kit',
    type: 'DEMO CARE KIT',
    price: 'SAMPLE · $89',
    description: 'A product-style maintenance kit concept showing how physical merchandise could sit naturally beside detailing services.',
    includes: ['Sample wash-care product', 'Sample microfiber set', 'Sample finishing product']
  },
  {
    title: 'Weekend Reset Bundle',
    type: 'DEMO SERVICE + PRODUCT BUNDLE',
    price: 'SAMPLE · $129',
    description: 'A bundled-offer concept combining maintenance tools with a fictional future service credit for stronger merchandising.',
    includes: ['Sample maintenance essentials', 'Sample storage pouch', 'Fictional service-credit presentation']
  }
];

const showcaseStage = document.getElementById('showcaseStage');
const showcaseCards = Array.from(document.querySelectorAll('.showcase-card'));
const showcasePrevious = document.getElementById('showcasePrevious');
const showcaseNext = document.getElementById('showcaseNext');
const showcaseStatus = document.getElementById('showcaseStatus');
const spotlightTitle = document.getElementById('spotlightTitle');
const spotlightDescription = document.getElementById('spotlightDescription');
const spotlightType = document.getElementById('spotlightType');
const spotlightPrice = document.getElementById('spotlightPrice');
const spotlightIncludes = document.getElementById('spotlightIncludes');
const spotlightDetails = document.getElementById('spotlightDetails');
let selectedShowcaseIndex = 0;

function positionShowcaseCards() {
  const smallScreen = window.innerWidth <= 650;
  const radius = smallScreen ? 165 : 215;
  showcaseCards.forEach(function (card, index) {
    const relative = index - selectedShowcaseIndex;
    const angle = relative * (360 / showcaseCards.length) - 90;
    card.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'deg) translateY(-' + radius + 'px) rotate(' + (-angle) + 'deg)';
  });
}

function renderShowcase(index) {
  selectedShowcaseIndex = (index + showcaseItems.length) % showcaseItems.length;
  const item = showcaseItems[selectedShowcaseIndex];
  showcaseCards.forEach(function (card, cardIndex) {
    const selected = cardIndex === selectedShowcaseIndex;
    card.classList.toggle('is-selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });
  showcaseStatus.textContent = item.title + ' selected · ' + (selectedShowcaseIndex + 1) + ' of ' + showcaseItems.length;
  spotlightTitle.textContent = item.title;
  spotlightDescription.textContent = item.description;
  spotlightType.textContent = item.type;
  spotlightPrice.textContent = item.price;
  spotlightIncludes.replaceChildren();
  item.includes.forEach(function (line) {
    const li = document.createElement('li');
    li.textContent = line;
    spotlightIncludes.appendChild(li);
  });
  positionShowcaseCards();
}

showcaseCards.forEach(function (card, index) {
  card.addEventListener('click', function () { renderShowcase(index); });
});
if (showcasePrevious) showcasePrevious.addEventListener('click', function () { renderShowcase(selectedShowcaseIndex - 1); });
if (showcaseNext) showcaseNext.addEventListener('click', function () { renderShowcase(selectedShowcaseIndex + 1); });
if (showcaseStage) {
  showcaseStage.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      renderShowcase(selectedShowcaseIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      renderShowcase(selectedShowcaseIndex + 1);
    }
    if (event.key === 'Enter' && spotlightDetails) {
      event.preventDefault();
      spotlightDetails.click();
    }
  });
}
window.addEventListener('resize', positionShowcaseCards);
renderShowcase(0);

const productDialog = document.getElementById('productDialog');
const productDialogClose = document.getElementById('productDialogClose');
const productDialogKicker = document.getElementById('productDialogKicker');
const productDialogTitle = document.getElementById('productDialogTitle');
const productDialogDescription = document.getElementById('productDialogDescription');
const productDialogPrice = document.getElementById('productDialogPrice');
const productDialogIncludes = document.getElementById('productDialogIncludes');
const productDialogCta = document.getElementById('productDialogCta');
let lastDialogTrigger = null;

const productItems = {
  'finish-lab': showcaseItems[3],
  'weekend-reset': showcaseItems[4],
  'interior-pair': {
    title: 'Interior Care Pair',
    type: 'DEMO ESSENTIALS',
    price: 'SAMPLE · $49',
    description: 'A small add-on product concept for demonstrating cross-sell presentation without adding transaction logic.',
    includes: ['Sample interior cleaner', 'Sample finishing towel', 'Presentation-only quick detail']
  }
};

function openProductDialog(item, trigger) {
  if (!productDialog || !item) return;
  lastDialogTrigger = trigger || document.activeElement;
  productDialogKicker.textContent = item.type;
  productDialogTitle.textContent = item.title;
  productDialogDescription.textContent = item.description;
  productDialogPrice.textContent = item.price;
  productDialogIncludes.replaceChildren();
  item.includes.forEach(function (line) {
    const li = document.createElement('li');
    li.textContent = line;
    productDialogIncludes.appendChild(li);
  });
  productDialog.showModal();
}

document.querySelectorAll('.product-detail-trigger').forEach(function (button) {
  button.addEventListener('click', function () {
    openProductDialog(productItems[button.dataset.product], button);
  });
});

if (spotlightDetails) {
  spotlightDetails.addEventListener('click', function () {
    openProductDialog(showcaseItems[selectedShowcaseIndex], spotlightDetails);
  });
}

if (productDialogClose && productDialog) {
  productDialogClose.addEventListener('click', function () { productDialog.close(); });
  productDialog.addEventListener('click', function (event) {
    if (event.target === productDialog) productDialog.close();
  });
  productDialog.addEventListener('close', function () {
    if (lastDialogTrigger && typeof lastDialogTrigger.focus === 'function') lastDialogTrigger.focus();
  });
}
if (productDialogCta && productDialog) {
  productDialogCta.addEventListener('click', function () { productDialog.close(); });
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach(function (item) { observer.observe(item); });
} else {
  revealItems.forEach(function (item) { item.classList.add('is-visible'); });
}

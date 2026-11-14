const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});

const gallery = [
  ['swimsafe.webp', 'Children taking part in CIPRB SwimSafe water safety training', 'SwimSafe training'],
  ['anchal.webp', 'Children and caregivers at an Anchal community childcare centre', 'Anchal childcare'],
  ['seasafe.webp', 'CIPRB SeaSafe lifeguards', 'SeaSafe lifeguards']
];
const photo = document.querySelector('#feature-image');
const caption = document.querySelector('#feature-link');
caption.parentElement.setAttribute('aria-live', 'polite');
let currentPhoto = 0;
document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => {
    currentPhoto = (currentPhoto + Number(button.dataset.gallery) + gallery.length) % gallery.length;
    const [file, alt, label] = gallery[currentPhoto];
    photo.src = 'assets/images/' + file;
    photo.alt = alt;
    photo.dataset.frame = file;
    caption.replaceChildren(document.createTextNode(label + ' '));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.className = 'arrow';
    caption.append(arrow);
  });
});

const dialog = document.querySelector('#search-dialog');
const search = document.querySelector('#site-search');
const results = document.querySelector('#search-results');
const status = document.querySelector('#search-status');
const sections = [...document.querySelectorAll('main section[id], footer[id]')];

function renderResults() {
  const query = search.value.trim().toLowerCase();
  results.replaceChildren();
  if (!query) {
    status.textContent = '';
    return;
  }
  const terms = query.split(/\s+/);
  const matches = sections.filter(section => terms.every(term => section.textContent.toLowerCase().includes(term)));
  for (const section of matches) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.setAttribute('role', 'link');
    link.setAttribute('aria-disabled', 'true');
    link.textContent = section.querySelector('h1, h2').textContent.trim();
    item.append(link);
    results.append(item);
  }
  status.textContent = matches.length ? matches.length + (matches.length === 1 ? ' section found' : ' sections found') : 'No sections found.';
}

document.querySelector('.search-open').addEventListener('click', () => {
  dialog.showModal();
  search.focus();
});
document.querySelector('.search-close').addEventListener('click', () => dialog.close());
search.addEventListener('input', renderResults);

const groups = [...navigation.querySelectorAll('.nav-group')];
for (const group of groups) {
  group.addEventListener('toggle', () => {
    if (group.open) groups.filter(item => item !== group).forEach(item => { item.open = false; });
  });
}
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) || event.target.closest('a')) {
    groups.forEach(group => { group.open = false; });
  }
});
document.addEventListener('keydown', event => {
  const openGroup = groups.find(group => group.open);
  if (event.key === 'Escape' && openGroup) {
    openGroup.open = false;
    if (!matchMedia('(max-width:870px)').matches) openGroup.querySelector('summary').focus();
  }
});

for (const logo of document.querySelectorAll('.partner-mark')) {
  logo.addEventListener('error', () => { logo.hidden = true; });
  if (logo.complete && !logo.naturalWidth) logo.hidden = true;
}


const heroWord = document.querySelector('#hero-word');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const phrases = ['safer childhoods.', 'safer roads.', 'better care.'];
let phrase = 0;
setInterval(() => {
  if (motion.matches || document.hidden) return;
  phrase = (phrase + 1) % phrases.length;
  heroWord.textContent = phrases[phrase];
  heroWord.animate(
    [{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'translateY(0)'}],
    {duration: 420, easing: 'ease-out'}
  );
}, 3800);

const viewportBlur = document.querySelector('.viewport-blur');
const page = document.documentElement;

function updateViewportBlur() {
  const distanceToEnd = page.scrollHeight - page.clientHeight - window.scrollY;
  const fadeDistance = viewportBlur.offsetHeight * 2;
  const opacity = Math.max(0, Math.min(1, distanceToEnd / fadeDistance));
  viewportBlur.style.setProperty('--viewport-blur-opacity', opacity);
}

window.addEventListener('scroll', updateViewportBlur, { passive: true });
window.addEventListener('resize', updateViewportBlur);
window.addEventListener('pageshow', updateViewportBlur);
updateViewportBlur();

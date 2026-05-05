import { getConnections, getCompanies, seedIfNeeded } from './store.js';

// ── Sticky nav border on scroll ───────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

// ── Nav counts ────────────────────────────────────────────────────
function updateNavCounts() {
  seedIfNeeded();
  const connCount = getConnections().length;
  const compCount = getCompanies().length;

  const cc = document.getElementById('nav-count-connections');
  const gc = document.getElementById('nav-count-companies');
  if (cc) cc.textContent = connCount;
  if (gc) gc.textContent = compCount;
}

document.addEventListener('DOMContentLoaded', updateNavCounts);

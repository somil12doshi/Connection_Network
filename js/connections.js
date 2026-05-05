import { getConnections, getCompanies, getCompanyCareerPage, seedIfNeeded } from './store.js';

// ── Avatar color palette ──────────────────────────────────────────
const AVATAR_COLORS = [
  ['#3b82f6','#1d4ed8'], ['#8b5cf6','#6d28d9'], ['#06b6d4','#0891b2'],
  ['#ec4899','#be185d'], ['#f59e0b','#d97706'], ['#22c55e','#15803d'],
  ['#f97316','#c2410c'], ['#14b8a6','#0f766e'],
];

function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// ── State ─────────────────────────────────────────────────────────
let state = { search: '', company: '', sort: 'name-az' };

// ── Render helpers ────────────────────────────────────────────────
function renderCard(conn, idx) {
  const [c1, c2] = avatarColor(conn.name);
  const initial = conn.name.trim()[0]?.toUpperCase() || '?';
  const careerPage = conn.company ? getCompanyCareerPage(conn.company) : null;

  const li = `aria-label="LinkedIn profile"`;
  const em = `aria-label="Send email"`;
  const ph = `aria-label="Call phone"`;
  const cp = `aria-label="Career page"`;

  return `
  <div class="connection-card glass animate-in" style="animation-delay:${idx * 60}ms">
    <div class="card-header">
      <div class="avatar" style="background:linear-gradient(135deg,${c1},${c2})">
        ${initial}
      </div>
      <div class="card-identity">
        <div class="card-name">${escHtml(conn.name)}</div>
        ${conn.title ? `<div class="card-title">${escHtml(conn.title)}</div>` : ''}
      </div>
    </div>
    ${conn.company ? `<div class="card-company"><span class="pill">${escHtml(conn.company)}</span></div>` : ''}

    <div class="card-actions">
      ${conn.linkedin ? `<a href="${conn.linkedin}" target="_blank" rel="noopener" class="btn btn-ghost btn-icon" ${li}>🔗 LinkedIn</a>` : ''}
      ${conn.email ? `<button onclick="copyToClipboard('${escHtml(conn.email)}', 'Email')" class="btn btn-ghost btn-icon" ${em}>✉ Email</button>` : ''}
      ${conn.phone ? `<button onclick="copyToClipboard('${escHtml(conn.phone)}', 'Phone')" class="btn btn-ghost btn-icon" ${ph}>📞 Phone</button>` : ''}
      ${careerPage ? `<a href="${careerPage}" target="_blank" rel="noopener" class="btn btn-ghost btn-icon" ${cp}>🏢 Careers</a>` : ''}
    </div>
  </div>`;
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

window.copyToClipboard = function(text, type) {
  navigator.clipboard.writeText(text).then(() => {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const el = document.createElement('div');
    el.className = 'toast success';
    el.textContent = '✓ ' + type + ' copied to clipboard';
    c.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  });
};

// ── Filter + sort ─────────────────────────────────────────────────
function applyFilters(connections) {
  let list = [...connections];
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.title || '').toLowerCase().includes(q)
    );
  }
  if (state.company) {
    list = list.filter(c => c.company === state.company);
  }
  switch (state.sort) {
    case 'name-az':  list.sort((a,b) => a.name.localeCompare(b.name)); break;
    case 'name-za':  list.sort((a,b) => b.name.localeCompare(a.name)); break;
    case 'company':  list.sort((a,b) => (a.company||'').localeCompare(b.company||'')); break;
    case 'date-new': list.sort((a,b) => new Date(b.addedOn) - new Date(a.addedOn)); break;
    case 'date-old': list.sort((a,b) => new Date(a.addedOn) - new Date(b.addedOn)); break;
  }
  return list;
}

// ── Main render ───────────────────────────────────────────────────
function render() {
  const allConnections = getConnections();
  const companies = getCompanies();
  const filtered = applyFilters(allConnections);

  // Company filter dropdown
  const companySelect = document.getElementById('filter-company');
  const prev = companySelect.value;
  companySelect.innerHTML = '<option value="">All Companies</option>' +
    companies.map(c => `<option value="${escHtml(c.name)}" ${c.name === prev ? 'selected' : ''}>${escHtml(c.name)}</option>`).join('');



  // Filter stats
  document.getElementById('filter-stats').textContent =
    filtered.length === allConnections.length
      ? `${allConnections.length} connections`
      : `${filtered.length} of ${allConnections.length}`;

  // Cards
  const grid = document.getElementById('connections-grid');
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🔍</div>
        <h3>No connections found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>`;
  } else {
    grid.innerHTML = filtered.map((c, i) => renderCard(c, i)).join('');
  }
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  seedIfNeeded();
  render();

  document.getElementById('search-input').addEventListener('input', e => {
    state.search = e.target.value.trim();
    render();
  });
  document.getElementById('filter-company').addEventListener('change', e => {
    state.company = e.target.value;
    render();
  });
  document.getElementById('sort-select').addEventListener('change', e => {
    state.sort = e.target.value;
    render();
  });
});

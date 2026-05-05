import { getCompanies, getConnectionsForCompany, seedIfNeeded } from './store.js';

let search = '';

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── Company card ─────────────────────────────────────────────────
function companyInitial(name) {
  return name.trim()[0]?.toUpperCase() || '?';
}

function renderCard(company, idx) {
  const connections = getConnectionsForCompany(company.name);
  const count = connections.length;
  const badgeClass = count > 0 ? 'conn-badge has-connections' : 'conn-badge';
  const badgeText = count > 0 ? `${count} connection${count > 1 ? 's' : ''} here` : 'No connections yet';

  return `
  <div class="company-card glass animate-in" style="animation-delay:${idx * 60}ms">
    <span class="${badgeClass}" aria-hidden="true">${badgeText}</span>
    <div class="company-logo">
      ${company.logo
        ? `<img src="${escHtml(company.logo)}" alt="${escHtml(company.name)} logo" loading="lazy" />`
        : companyInitial(company.name)}
    </div>
    <div class="company-name" title="${escHtml(company.name)}">${escHtml(company.name)}</div>
    ${company.industry
      ? `<div class="company-industry">🏭 ${escHtml(company.industry)}</div>`
      : `<div class="company-industry" style="color:var(--text-muted)">Industry unknown</div>`}
    <div class="company-footer">
      ${count > 0
        ? `<span class="pill pill-green">👥 ${count} connection${count > 1 ? 's' : ''}</span>`
        : `<span class="pill pill-muted">No connections</span>`}
      ${company.careerPage
        ? `<a href="${escHtml(company.careerPage)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" aria-label="Career page for ${escHtml(company.name)}">🔗 Careers</a>`
        : `<span class="btn btn-ghost btn-sm" style="opacity:0.4;cursor:default">No career page</span>`}
    </div>
  </div>`;
}

// ── Render all ────────────────────────────────────────────────────
function render() {
  const companies = getCompanies();
  const filtered = search
    ? companies.filter(c =>
        c.name.toLowerCase().includes(search) ||
        (c.industry || '').toLowerCase().includes(search))
    : companies;

  document.getElementById('filter-stats').textContent =
    filtered.length === companies.length
      ? `${companies.length} companies`
      : `${filtered.length} of ${companies.length}`;

  const grid = document.getElementById('companies-grid');
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🏢</div>
        <h3>No companies found</h3>
        <p>Try a different search.</p>
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
    search = e.target.value.trim().toLowerCase();
    render();
  });
});

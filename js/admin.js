import {
  isLoggedIn, login, logout,
  getConnections, addConnection, updateConnection, deleteConnection,
  getCompanies, addCompany, updateCompany, deleteCompany,
  seedIfNeeded,
} from './store.js';

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = (type === 'success' ? '✓ ' : '✗ ') + msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── Auth ──────────────────────────────────────────────────────────
function initAuth() {
  if (isLoggedIn()) {
    showPanel();
    return;
  }

  const form = document.getElementById('login-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    if (login(user, pass)) {
      showPanel();
    } else {
      const err = document.getElementById('login-error');
      err.classList.add('show');
      document.getElementById('login-card').classList.add('shake');
      setTimeout(() => document.getElementById('login-card').classList.remove('shake'), 400);
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    location.reload();
  });
}

function showPanel() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-panel').classList.add('visible');
  seedIfNeeded();
  renderStats();
  renderConnectionsTab();
  renderCompaniesTab();
}

// ── Stats ─────────────────────────────────────────────────────────
function renderStats() {
  const conns = getConnections();
  const comps = getCompanies();
  const withLinkedIn = conns.filter(c => c.linkedin).length;
  const withEmail    = conns.filter(c => c.email).length;

  document.getElementById('astat-connections').textContent = conns.length;
  document.getElementById('astat-companies').textContent   = comps.length;
  document.getElementById('astat-linkedin').textContent    = withLinkedIn;
  document.getElementById('astat-email').textContent       = withEmail;
}

// ── Tabs ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
  initAuth();
  document.getElementById('search-conn')?.addEventListener('input', renderConnectionsTab);
  document.getElementById('search-comp')?.addEventListener('input', renderCompaniesTab);
});

// ── Connections tab ───────────────────────────────────────────────
function renderConnectionsTab() {
  let conns = getConnections();
  const searchInput = document.getElementById('search-conn');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  if (query) {
    conns = conns.filter(c => 
      c.name.toLowerCase().includes(query) || 
      (c.company || '').toLowerCase().includes(query) ||
      (c.title || '').toLowerCase().includes(query)
    );
  }

  const tbody = document.getElementById('conn-tbody');
  if (conns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state" style="text-align:center;padding:2rem;color:var(--text-muted)">No connections found.</td></tr>`;
    return;
  }
  tbody.innerHTML = conns.map(c => `
    <tr>
      <td class="name-cell">${escHtml(c.name)}</td>
      <td>${escHtml(c.company || '—')}</td>
      <td>${escHtml(c.title || '—')}</td>
      <td>${c.linkedin ? `<a href="${escHtml(c.linkedin)}" target="_blank" rel="noopener" style="color:var(--accent-blue)">🔗</a>` : '—'}</td>
      <td class="action-cell">
        <button class="btn btn-ghost btn-sm" onclick="openEditConn('${c.id}')" aria-label="Edit ${escHtml(c.name)}">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteConn('${c.id}','${escHtml(c.name)}')" aria-label="Delete ${escHtml(c.name)}">🗑 Delete</button>
      </td>
    </tr>`).join('');
}

window.openEditConn = function(id) {
  const conn = getConnections().find(c => c.id === id);
  if (!conn) return;
  populateConnForm(conn);
  document.getElementById('conn-modal-title').textContent = 'Edit Connection';
  document.getElementById('conn-form').dataset.editId = id;
  openModal('conn-modal');
};

window.confirmDeleteConn = function(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  deleteConnection(id);
  renderConnectionsTab();
  renderStats();
  toast(`Deleted ${name}`);
};

function populateConnForm(conn) {
  const f = document.getElementById('conn-form');
  f.elements['name'].value      = conn.name    || '';
  f.elements['company'].value   = conn.company || '';
  f.elements['title'].value     = conn.title   || '';
  f.elements['linkedin'].value  = conn.linkedin || '';
  f.elements['email'].value     = conn.email   || '';
  f.elements['phone'].value     = conn.phone   || '';
  f.elements['notes'].value     = conn.notes   || '';
  populateCompanyDropdown(conn.company);
}

function populateCompanyDropdown(selected) {
  const dl = document.getElementById('company-datalist');
  if (!dl) return;
  const companies = getCompanies();
  dl.innerHTML = companies.map(c => `<option value="${escHtml(c.name)}"></option>`).join('');

  const compInput = document.getElementById('conn-company');
  const careerGroup = document.getElementById('conn-career-group');
  const careerInput = document.getElementById('conn-careerPage');

  compInput.oninput = () => {
    const val = compInput.value.trim();
    if (val && !companies.find(c => c.name.toLowerCase() === val.toLowerCase())) {
      careerGroup.style.display = 'block';
    } else {
      careerGroup.style.display = 'none';
      careerInput.value = '';
    }
  };

  compInput.value = selected || '';
  compInput.oninput();
}

document.getElementById('add-conn-btn')?.addEventListener('click', () => {
  resetForm('conn-form');
  document.getElementById('conn-modal-title').textContent = 'Add Connection';
  delete document.getElementById('conn-form').dataset.editId;
  populateCompanyDropdown('');
  openModal('conn-modal');
});

document.getElementById('conn-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const companyName = f.elements['company'].value.trim();
  const careerPage = f.elements['careerPage'] ? f.elements['careerPage'].value.trim() : '';

  if (companyName) {
    const companies = getCompanies();
    if (!companies.find(c => c.name.toLowerCase() === companyName.toLowerCase())) {
      addCompany({ name: companyName, careerPage: careerPage, industry: '', logo: '' });
      renderCompaniesTab();
    }
  }

  const data = {
    name:     f.elements['name'].value.trim(),
    company:  companyName,
    title:    f.elements['title'].value.trim(),
    linkedin: f.elements['linkedin'].value.trim(),
    email:    f.elements['email'].value.trim(),
    phone:    f.elements['phone'].value.trim(),
    notes:    f.elements['notes'].value.trim(),
  };
  if (!data.name) return;
  const editId = f.dataset.editId;
  if (editId) {
    updateConnection(editId, data);
    toast('Connection updated');
  } else {
    addConnection(data);
    toast('Connection added');
  }
  closeModal('conn-modal');
  renderConnectionsTab();
  renderStats();
});

// ── Companies tab ─────────────────────────────────────────────────
function renderCompaniesTab() {
  let comps = getCompanies();
  const searchInput = document.getElementById('search-comp');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  if (query) {
    comps = comps.filter(c => 
      c.name.toLowerCase().includes(query) || 
      (c.industry || '').toLowerCase().includes(query)
    );
  }

  const tbody = document.getElementById('comp-tbody');
  if (comps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state" style="text-align:center;padding:2rem;color:var(--text-muted)">No companies found.</td></tr>`;
    return;
  }
  tbody.innerHTML = comps.map(c => `
    <tr>
      <td class="name-cell">${escHtml(c.name)}</td>
      <td>${escHtml(c.industry || '—')}</td>
      <td>${c.careerPage ? `<a href="${escHtml(c.careerPage)}" target="_blank" rel="noopener" style="color:var(--accent-cyan)">🔗 Link</a>` : '—'}</td>
      <td class="action-cell">
        <button class="btn btn-ghost btn-sm" onclick="openEditComp('${c.id}')" aria-label="Edit ${escHtml(c.name)}">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteComp('${c.id}','${escHtml(c.name)}')" aria-label="Delete ${escHtml(c.name)}">🗑 Delete</button>
      </td>
    </tr>`).join('');
}

window.openEditComp = function(id) {
  const comp = getCompanies().find(c => c.id === id);
  if (!comp) return;
  populateCompForm(comp);
  document.getElementById('comp-modal-title').textContent = 'Edit Company';
  document.getElementById('comp-form').dataset.editId = id;
  openModal('comp-modal');
};

window.confirmDeleteComp = function(id, name) {
  if (!confirm(`Delete company "${name}"? This cannot be undone.`)) return;
  deleteCompany(id);
  renderCompaniesTab();
  renderStats();
  toast(`Deleted ${name}`);
};

function populateCompForm(comp) {
  const f = document.getElementById('comp-form');
  f.elements['name'].value       = comp.name       || '';
  f.elements['industry'].value   = comp.industry   || '';
  f.elements['careerPage'].value = comp.careerPage || '';
  f.elements['logo'].value       = comp.logo       || '';
}

document.getElementById('add-comp-btn')?.addEventListener('click', () => {
  resetForm('comp-form');
  document.getElementById('comp-modal-title').textContent = 'Add Company';
  delete document.getElementById('comp-form').dataset.editId;
  openModal('comp-modal');
});

document.getElementById('comp-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const data = {
    name:       f.elements['name'].value.trim(),
    industry:   f.elements['industry'].value.trim(),
    careerPage: f.elements['careerPage'].value.trim(),
    logo:       f.elements['logo'].value.trim(),
  };
  if (!data.name) return;
  const editId = f.dataset.editId;
  if (editId) {
    updateCompany(editId, data);
    toast('Company updated');
  } else {
    addCompany(data);
    toast('Company added');
  }
  closeModal('comp-modal');
  renderCompaniesTab();
  renderStats();
});

// ── Modal helpers ─────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
  document.body.style.overflow = '';
}
function resetForm(id) {
  document.getElementById(id)?.reset();
}

document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
  });
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// Keyboard close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

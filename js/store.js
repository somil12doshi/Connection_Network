const KEYS = {
  connections: 'cnw_connections',
  companies:   'cnw_companies',
  session:     'cnw_admin_session',
  seeded:      'cnw_seeded',
};

// ── Connections ──────────────────────────────────────────────────
export function getConnections() {
  return JSON.parse(localStorage.getItem(KEYS.connections) || '[]');
}
export function saveConnections(arr) {
  localStorage.setItem(KEYS.connections, JSON.stringify(arr));
}
export function addConnection(obj) {
  const arr = getConnections();
  const item = { id: generateId(), addedOn: new Date().toISOString(), ...obj };
  arr.push(item);
  saveConnections(arr);
  return item;
}
export function updateConnection(id, obj) {
  const arr = getConnections().map(c => c.id === id ? { ...c, ...obj } : c);
  saveConnections(arr);
}
export function deleteConnection(id) {
  saveConnections(getConnections().filter(c => c.id !== id));
}

// ── Companies ────────────────────────────────────────────────────
export function getCompanies() {
  return JSON.parse(localStorage.getItem(KEYS.companies) || '[]');
}
export function saveCompanies(arr) {
  localStorage.setItem(KEYS.companies, JSON.stringify(arr));
}
export function addCompany(obj) {
  const arr = getCompanies();
  const item = { id: generateId(), addedOn: new Date().toISOString(), ...obj };
  arr.push(item);
  saveCompanies(arr);
  return item;
}
export function updateCompany(id, obj) {
  const arr = getCompanies().map(c => c.id === id ? { ...c, ...obj } : c);
  saveCompanies(arr);
}
export function deleteCompany(id) {
  saveCompanies(getCompanies().filter(c => c.id !== id));
}

// ── Auth session ─────────────────────────────────────────────────
export function isLoggedIn() {
  return sessionStorage.getItem(KEYS.session) === 'true';
}
export function login(user, pass) {
  if (user === 'admin' && pass === 'admin2026') {
    sessionStorage.setItem(KEYS.session, 'true');
    return true;
  }
  return false;
}
export function logout() {
  sessionStorage.removeItem(KEYS.session);
}

// ── Helpers ──────────────────────────────────────────────────────
export function generateId() {
  return crypto.randomUUID();
}

export function getCompanyCareerPage(companyName) {
  const companies = getCompanies();
  const match = companies.find(c => c.name.toLowerCase() === companyName?.toLowerCase());
  return match?.careerPage || null;
}

export function getConnectionsForCompany(companyName) {
  return getConnections().filter(c => c.company?.toLowerCase() === companyName?.toLowerCase());
}

// ── Seed ─────────────────────────────────────────────────────────
export function seedIfNeeded() {
  if (localStorage.getItem(KEYS.seeded)) return;

  const companies = [
    { name: 'Halliburton',               industry: 'Energy / Oil & Gas',          careerPage: 'https://halliburton.com/careers',                       logo: '' },
    { name: 'Apple',                     industry: 'Technology',                   careerPage: 'https://apple.com/careers',                             logo: '' },
    { name: 'HP',                        industry: 'Technology',                   careerPage: 'https://hp.com/us-en/jobs',                             logo: '' },
    { name: 'Equinor',                   industry: 'Energy / Oil & Gas',          careerPage: 'https://equinor.com/careers',                           logo: '' },
    { name: 'Publicis Sapient',          industry: 'Consulting / Tech',            careerPage: 'https://careers.publicissapient.com/',                  logo: '' },
    { name: 'CVS',                       industry: 'Healthcare',                   careerPage: 'https://jobs.cvshealth.com',                            logo: '' },
    { name: 'AOI',                       industry: '',                             careerPage: '',                                                      logo: '' },
    { name: 'Harris County',             industry: 'Government',                   careerPage: 'https://hrrm.harriscountytx.gov/Pages/Employment.aspx', logo: '' },
    { name: 'Gilbane Building Company',  industry: 'Construction',                 careerPage: 'https://gilbaneco.com/careers',                         logo: '' },
    { name: 'Baylor',                    industry: 'Education / Healthcare',       careerPage: 'https://jobs.baylor.edu',                               logo: '' },
    { name: 'NOV',                       industry: 'Energy / Manufacturing',       careerPage: 'https://nov.com/careers',                               logo: '' },
    { name: 'BenrockEngies',             industry: '',                             careerPage: '',                                                      logo: '' },
    { name: 'Alcon',                     industry: 'Healthcare / Medical Devices', careerPage: 'https://alcon.com/careers',                             logo: '' },
    { name: 'Google',                    industry: 'Technology',                   careerPage: 'https://careers.google.com',                            logo: '' },
    { name: 'Amazon',                    industry: 'Technology / E-commerce',      careerPage: 'https://amazon.jobs',                                   logo: '' },
    { name: 'LinkedIn',                  industry: 'Technology',                   careerPage: 'https://careers.linkedin.com',                          logo: '' },
    { name: 'Charles Schwab',            industry: 'FinTech / Finance',            careerPage: 'https://schwab.com/careers',                            logo: '' },
    { name: 'TRC',                       industry: 'Engineering / Consulting',     careerPage: 'https://trcsolutions.com/careers',                      logo: '' },
    { name: 'Mc Query',                  industry: '',                             careerPage: '',                                                      logo: '' },
    { name: 'EY',                        industry: 'Consulting / Finance',         careerPage: 'https://ey.com/careers',                                logo: '' },
    { name: 'Texas Children / Baylor',   industry: 'Healthcare',                   careerPage: 'https://texaschildrens.org/careers',                    logo: '' },
    { name: 'Duke Energy / Wells Fargo', industry: 'Energy / Finance',             careerPage: '',                                                      logo: '' },
    { name: 'Mansfield Energy Corp',     industry: 'Energy',                       careerPage: 'https://mansfield.com/careers',                         logo: '' },
    { name: 'Zepnil Systems',            industry: '',                             careerPage: '',                                                      logo: '' },
    { name: 'SAP',                       industry: 'Technology / ERP',             careerPage: 'https://sap.com/careers',                               logo: '' },
    { name: 'Qualcomm',                  industry: 'Technology / Semiconductors',  careerPage: 'https://qualcomm.com/careers',                          logo: '' },
    { name: 'Freightliner',              industry: 'Manufacturing / Automotive',   careerPage: 'https://jobs.daimler-truck.com',                        logo: '' },
    { name: 'Applied Materials',         industry: 'Technology / Semiconductors',  careerPage: 'https://www.appliedmaterials.com/us/en/careers.html', logo: '' },
  ];

  const connections = [
    { name: 'Jainish Shah',    company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Vidhi Shah',      company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Carol',           company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '', notes: 'HR contact' },
    { name: 'Comfort',         company: 'Apple',                     title: '', linkedin: '', email: '', phone: '', notes: 'Bridges' },
    { name: 'Bhumik Shah',     company: '',                          title: '', linkedin: '', email: '', phone: '', notes: 'Company TBD' },
    { name: 'Parth Borecha',   company: '',                          title: '', linkedin: '', email: '', phone: '', notes: 'Company TBD' },
    { name: 'Jenit Parmar',    company: 'Apple',                     title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Megha Rajal',     company: '',                          title: '', linkedin: '', email: '', phone: '', notes: 'HR contact' },
    { name: 'Nishchal',        company: 'Apple',                     title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Parag Seth',      company: '',                          title: '', linkedin: '', email: '', phone: '', notes: 'Company TBD' },
    { name: 'Niti Patel',      company: 'Phoenix Mecano',            title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Prabhav',         company: '',                          title: '', linkedin: '', email: '', phone: '', notes: 'Company TBD' },
    { name: 'Prameet',         company: 'HP',                        title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Prerit Shah',     company: 'Equinor',                   title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Nupur',           company: 'Publicis Sapient',          title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Sethu',           company: 'CVS',                       title: 'Data Engineer', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Snehi',           company: 'AOI',                       title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Nikita',          company: 'Harris County',             title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Suketu',          company: 'Gilbane Building Company',  title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Dhruvil',         company: 'Baylor',                    title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Sydney',          company: 'NOV',                       title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Tochukwu',        company: 'BenrockEngies',             title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Nupoor',          company: 'Alcon',                     title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Arvind',          company: 'Applied Materials',         title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Abhinav',         company: 'Google',                    title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Neel',            company: 'Amazon',                    title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Rajvi',           company: 'LinkedIn',                  title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Utsav (Swami)',   company: '',                          title: '', linkedin: '', email: '', phone: '', notes: 'Company TBD' },
    { name: 'Ankit Shah',      company: 'Charles Schwab',            title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Karan Jain',      company: '',                          title: '', linkedin: '', email: '', phone: '', notes: 'Company TBD' },
    { name: 'Maunik',          company: 'TRC',                       title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Tejas',           company: 'Mc Query',                  title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Rupesh Reddy',    company: 'NOV',                       title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Vimal',           company: 'EY',                        title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Sachin',          company: 'Texas Children / Baylor',   title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Purvesh',         company: 'Duke Energy / Wells Fargo', title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Denil',           company: 'Mansfield Energy Corp',     title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Jay',             company: 'Zepnil Systems',            title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Varun',           company: 'SAP',                       title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Krishi',          company: 'Apple',                     title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Venu',            company: 'Amazon',                    title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Sahil',           company: 'Qualcomm',                  title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Utsav',           company: 'Freightliner',              title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'Geetha Nair',     company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '', notes: '' },
    { name: 'James Keeble',    company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '', notes: '' },
  ];

  const now = new Date().toISOString();
  saveCompanies(companies.map(c => ({ id: generateId(), addedOn: now, ...c })));
  saveConnections(connections.map(c => ({ id: generateId(), addedOn: now, ...c })));
  localStorage.setItem(KEYS.seeded, 'true');
}

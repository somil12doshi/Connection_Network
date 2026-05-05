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

const defaultCompanies = [
  { name: 'Halliburton',               industry: 'Energy / Oil & Gas',          careerPage: 'https://halliburton.com/careers',                       logo: '' },
  { name: 'Apple',                     industry: 'Technology',                   careerPage: 'https://apple.com/careers',                             logo: '' },
  { name: 'HP',                        industry: 'Technology',                   careerPage: 'https://hp.com/us-en/jobs',                             logo: '' },
  { name: 'Equinor',                   industry: 'Energy / Oil & Gas',          careerPage: 'https://equinor.com/careers',                           logo: '' },
  { name: 'Publicis Sapient',          industry: 'Consulting / Tech',            careerPage: 'https://careers.publicissapient.com/',                  logo: '' },
  { name: 'CVS',                       industry: 'Healthcare',                   careerPage: 'https://jobs.cvshealth.com',                            logo: '' },
  { name: 'AOI',                       industry: 'Industrial Solutions',         careerPage: 'https://www.ao-inc.com/careers',                        logo: '' },
  { name: 'Harris County',             industry: 'Government',                   careerPage: 'https://hrrm.harriscountytx.gov/Pages/Employment.aspx', logo: '' },
  { name: 'Gilbane Building Company',  industry: 'Construction',                 careerPage: 'https://gilbaneco.com/careers',                         logo: '' },
  { name: 'Baylor',                    industry: 'Education / Healthcare',       careerPage: 'https://jobs.baylor.edu',                               logo: '' },
  { name: 'NOV',                       industry: 'Energy / Manufacturing',       careerPage: 'https://nov.com/careers',                               logo: '' },
  { name: 'BenrockEngies',             industry: 'Energy / Engineering',         careerPage: '',                                                      logo: '' },
  { name: 'Alcon',                     industry: 'Healthcare / Medical Devices', careerPage: 'https://alcon.com/careers',                             logo: '' },
  { name: 'Google',                    industry: 'Technology',                   careerPage: 'https://careers.google.com',                            logo: '' },
  { name: 'Amazon',                    industry: 'Technology / E-commerce',      careerPage: 'https://amazon.jobs',                                   logo: '' },
  { name: 'LinkedIn',                  industry: 'Technology',                   careerPage: 'https://careers.linkedin.com',                          logo: '' },
  { name: 'Charles Schwab',            industry: 'FinTech / Finance',            careerPage: 'https://schwab.com/careers',                            logo: '' },
  { name: 'TRC',                       industry: 'Engineering / Consulting',     careerPage: 'https://trcsolutions.com/careers',                      logo: '' },
  { name: 'Mc Query',                  industry: 'Consulting',                   careerPage: '',                                                      logo: '' },
  { name: 'EY',                        industry: 'Consulting / Finance',         careerPage: 'https://ey.com/careers',                                logo: '' },
  { name: 'Texas Children / Baylor',   industry: 'Healthcare',                   careerPage: 'https://texaschildrens.org/careers',                    logo: '' },
  { name: 'Duke Energy / Wells Fargo', industry: 'Energy / Finance',             careerPage: 'https://duke-energy.com/careers',                       logo: '' },
  { name: 'Mansfield Energy Corp',     industry: 'Energy',                       careerPage: 'https://mansfield.com/careers',                         logo: '' },
  { name: 'Zepnil Systems',            industry: 'Technology',                   careerPage: '',                                                      logo: '' },
  { name: 'SAP',                       industry: 'Technology / ERP',             careerPage: 'https://sap.com/careers',                               logo: '' },
  { name: 'Qualcomm',                  industry: 'Technology / Semiconductors',  careerPage: 'https://qualcomm.com/careers',                          logo: '' },
  { name: 'Freightliner',              industry: 'Manufacturing / Automotive',   careerPage: 'https://jobs.daimler-truck.com',                        logo: '' },
  { name: 'Applied Materials',         industry: 'Technology / Semiconductors',  careerPage: 'https://www.appliedmaterials.com/us/en/careers.html', logo: '' },
  { name: 'Phoenix Mecano',            industry: 'Manufacturing / Tech',         careerPage: 'https://www.phoenix-mecano.com/en/careers',             logo: '' },
  // ── Added from Image ──────────────────────────────────────────
  { name: 'Anthropic', industry: 'AI Research', careerPage: 'https://www.anthropic.com/careers', logo: '' },
  { name: 'Reliable Robotics', industry: 'Autonomous Aviation', careerPage: 'https://reliable.co/careers', logo: '' },
  { name: 'Ray Therapeutics', industry: 'Biotechnology', careerPage: 'https://raytherapeutics.com/careers', logo: '' },
  { name: 'Omni', industry: 'AI Analytics', careerPage: 'https://omni.co/careers', logo: '' },
  { name: 'Tortugas Neuroscience', industry: 'Biotechnology', careerPage: 'https://tortugasneuro.com/careers', logo: '' },
  { name: 'AcuityMD', industry: 'MedTech AI', careerPage: 'https://www.acuitymd.com/careers', logo: '' },
  { name: 'OpenAI', industry: 'AI Research', careerPage: 'https://openai.com/careers', logo: '' },
  { name: 'Orkes', industry: 'Developer Tools', careerPage: 'https://orkes.io/careers', logo: '' },
  { name: 'Courier Health', industry: 'HealthTech CRM', careerPage: 'https://www.courierhealth.com/careers', logo: '' },
  { name: 'Serif Biomedicines', industry: 'Biotechnology', careerPage: 'https://www.serifbio.com/careers', logo: '' },
  { name: 'Slate Auto', industry: 'Automotive / EV', careerPage: 'https://slate.auto/careers', logo: '' },
  { name: 'Beeline Medicines', industry: 'Biotechnology', careerPage: 'https://beelinemedicines.com/careers', logo: '' },
  { name: 'Glydways', industry: 'Transportation / AV', careerPage: 'https://glydways.com/careers', logo: '' },
  { name: 'Factory', industry: 'AI / DevTools', careerPage: 'https://factory.ai/careers', logo: '' },
  { name: 'Terremoto Biosciences', industry: 'Biotechnology', careerPage: 'https://terremotobio.com/careers', logo: '' },
  { name: 'Zum', industry: 'Transportation / EdTech', careerPage: 'https://www.ridezum.com/careers', logo: '' },
  { name: 'Neomorph', industry: 'Biotechnology', careerPage: 'https://neomorph.com/careers', logo: '' },
  { name: 'Slash', industry: 'FinTech', careerPage: 'https://slash.com/careers', logo: '' },
  { name: 'nEye', industry: 'AI / Computer Vision', careerPage: 'https://neye.ai/join-us', logo: '' },
  { name: 'Turion Space', industry: 'SpaceTech', careerPage: 'https://turionspace.com/careers', logo: '' },
  { name: 'SiFive', industry: 'Semiconductors', careerPage: 'https://www.sifive.com/careers', logo: '' },
  { name: 'Hermeus', industry: 'Aerospace', careerPage: 'https://www.hermeus.com/careers', logo: '' },
  { name: 'Sidewinder Therapeutics', industry: 'Biotechnology', careerPage: 'https://www.sidewinderbio.com', logo: '' },
  { name: 'Aria Networks', industry: 'Networking / AI', careerPage: 'https://aria-networks.com/careers', logo: '' },
  { name: 'Starfish Space', industry: 'SpaceTech', careerPage: 'https://www.starfishspace.com/careers', logo: '' },
  { name: 'Stipple Bio', industry: 'Biotechnology', careerPage: 'https://stipple.bio/careers', logo: '' },
  { name: 'Chapter', industry: 'HealthTech / InsurTech', careerPage: 'https://www.getchapter.com/careers', logo: '' },
  { name: 'Modus', industry: 'LegalTech / FinTech', careerPage: 'https://modus.com/careers', logo: '' },
  { name: 'Endovascular Engineering', industry: 'MedTech', careerPage: 'https://e2helo.breezy.hr/', logo: '' },
  { name: 'Life Biosciences', industry: 'Biotechnology', careerPage: 'https://www.lifebiosciences.com/careers', logo: '' },
  { name: 'Saronic', industry: 'DefenseTech', careerPage: 'https://www.saronic.ai/careers', logo: '' },
  { name: 'Whoop', industry: 'HealthTech / Wearables', careerPage: 'https://www.whoop.com/careers', logo: '' },
  { name: 'Valar Atomics', industry: 'Energy / Nuclear', careerPage: 'https://valaratomics.com/careers', logo: '' },
  { name: 'EnerVenue', industry: 'Energy / Storage', careerPage: 'https://enervenue.com/careers', logo: '' },
  { name: 'ScaleOps', industry: 'Cloud / AI', careerPage: 'https://scaleops.com/careers', logo: '' },
  { name: 'Ambrosia Biosciences', industry: 'Biotechnology', careerPage: 'https://www.ambrosiabiosciences.com', logo: '' },
  { name: 'OpenFX', industry: 'FinTech / FX', careerPage: 'https://openfx.com/careers', logo: '' },
  { name: 'Cursor', industry: 'AI DevTools', careerPage: 'https://www.cursor.com/careers', logo: '' },
  { name: 'World Labs', industry: 'AI Research', careerPage: 'https://www.worldlabs.ai/careers', logo: '' },
  { name: 'Vestwell', industry: 'FinTech', careerPage: 'https://www.vestwell.com/careers', logo: '' },
  { name: 'Cloaked', industry: 'Privacy / Security', careerPage: 'https://www.cloaked.com/careers', logo: '' },
  { name: 'Heron Power', industry: 'Energy / Nuclear', careerPage: 'https://heronpower.com/careers', logo: '' },
  { name: 'Code Metal', industry: 'AI / Embedded', careerPage: 'https://codemetal.ai/careers', logo: '' },
  { name: 'Cape', industry: 'Privacy / AI', careerPage: 'https://cape.co/careers', logo: '' },
  { name: 'Render', industry: 'Cloud Platform', careerPage: 'https://render.com/careers', logo: '' },
  { name: 'Latent', industry: 'AI / Edge', careerPage: 'https://latenthealth.com/careers', logo: '' },
  { name: 'Crossbow Therapeutics', industry: 'Biotechnology', careerPage: 'https://crossbowtx.com/careers', logo: '' },
  { name: 'RoboForce', industry: 'Robotics / AI', careerPage: 'https://roboforce.ai/careers', logo: '' },
  { name: 'Spektr', industry: 'FinTech / Compliance', careerPage: 'https://spektr.com/careers', logo: '' },
  { name: 'GetWhys', industry: 'AI / Analytics', careerPage: 'https://boards.greenhouse.io/getwhys', logo: '' },
];

// ── Seed ─────────────────────────────────────────────────────────
export function seedIfNeeded() {
  const seededV3 = localStorage.getItem(KEYS.seeded + '_v3');
  if (seededV3) return;

  const existingCompanies = getCompanies();
  const existingConnections = getConnections();
  const now = new Date().toISOString();

  // Merge default companies
  const updatedCompanies = [...existingCompanies];
  defaultCompanies.forEach(def => {
    const exists = updatedCompanies.some(c => c.name.toLowerCase() === def.name.toLowerCase());
    if (!exists) {
      updatedCompanies.push({ id: generateId(), addedOn: now, ...def });
    } else {
      // Optional: update careerPage if it was missing
      const match = updatedCompanies.find(c => c.name.toLowerCase() === def.name.toLowerCase());
      if (!match.careerPage && def.careerPage) {
        match.careerPage = def.careerPage;
      }
      if (!match.industry && def.industry) {
        match.industry = def.industry;
      }
    }
  });

  saveCompanies(updatedCompanies);

  // If never seeded at all, add default connections
  if (!localStorage.getItem(KEYS.seeded)) {
    const connections = [
      { name: 'Jainish Shah',    company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '' },
      { name: 'Vidhi Shah',      company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '' },
      { name: 'Carol',           company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '' },
      { name: 'Comfort',         company: 'Apple',                     title: '', linkedin: '', email: '', phone: '' },
      { name: 'Bhumik Shah',     company: '',                          title: '', linkedin: '', email: '', phone: '' },
      { name: 'Parth Borecha',   company: '',                          title: '', linkedin: '', email: '', phone: '' },
      { name: 'Jenit Parmar',    company: 'Apple',                     title: '', linkedin: '', email: '', phone: '' },
      { name: 'Megha Rajal',     company: '',                          title: '', linkedin: '', email: '', phone: '' },
      { name: 'Nishchal',        company: 'Apple',                     title: '', linkedin: '', email: '', phone: '' },
      { name: 'Parag Seth',      company: '',                          title: '', linkedin: '', email: '', phone: '' },
      { name: 'Niti Patel',      company: 'Phoenix Mecano',            title: '', linkedin: '', email: '', phone: '' },
      { name: 'Prabhav',         company: '',                          title: '', linkedin: '', email: '', phone: '' },
      { name: 'Prameet',         company: 'HP',                        title: '', linkedin: '', email: '', phone: '' },
      { name: 'Prerit Shah',     company: 'Equinor',                   title: '', linkedin: '', email: '', phone: '' },
      { name: 'Nupur',           company: 'Publicis Sapient',          title: '', linkedin: '', email: '', phone: '' },
      { name: 'Sethu',           company: 'CVS',                       title: 'Data Engineer', linkedin: '', email: '', phone: '' },
      { name: 'Snehi',           company: 'AOI',                       title: '', linkedin: '', email: '', phone: '' },
      { name: 'Nikita',          company: 'Harris County',             title: '', linkedin: '', email: '', phone: '' },
      { name: 'Suketu',          company: 'Gilbane Building Company',  title: '', linkedin: '', email: '', phone: '' },
      { name: 'Dhruvil',         company: 'Baylor',                    title: '', linkedin: '', email: '', phone: '' },
      { name: 'Sydney',          company: 'NOV',                       title: '', linkedin: '', email: '', phone: '' },
      { name: 'Tochukwu',        company: 'BenrockEngies',             title: '', linkedin: '', email: '', phone: '' },
      { name: 'Nupoor',          company: 'Alcon',                     title: '', linkedin: '', email: '', phone: '' },
      { name: 'Arvind',          company: 'Applied Materials',         title: '', linkedin: '', email: '', phone: '' },
      { name: 'Abhinav',         company: 'Google',                    title: '', linkedin: '', email: '', phone: '' },
      { name: 'Neel',            company: 'Amazon',                    title: '', linkedin: '', email: '', phone: '' },
      { name: 'Rajvi',           company: 'LinkedIn',                  title: '', linkedin: '', email: '', phone: '' },
      { name: 'Utsav (Swami)',   company: '',                          title: '', linkedin: '', email: '', phone: '' },
      { name: 'Ankit Shah',      company: 'Charles Schwab',            title: '', linkedin: '', email: '', phone: '' },
      { name: 'Karan Jain',      company: '',                          title: '', linkedin: '', email: '', phone: '' },
      { name: 'Maunik',          company: 'TRC',                       title: '', linkedin: '', email: '', phone: '' },
      { name: 'Tejas',           company: 'Mc Query',                  title: '', linkedin: '', email: '', phone: '' },
      { name: 'Rupesh Reddy',    company: 'NOV',                       title: '', linkedin: '', email: '', phone: '' },
      { name: 'Vimal',           company: 'EY',                        title: '', linkedin: '', email: '', phone: '' },
      { name: 'Sachin',          company: 'Texas Children / Baylor',   title: '', linkedin: '', email: '', phone: '' },
      { name: 'Purvesh',         company: 'Duke Energy / Wells Fargo', title: '', linkedin: '', email: '', phone: '' },
      { name: 'Denil',           company: 'Mansfield Energy Corp',     title: '', linkedin: '', email: '', phone: '' },
      { name: 'Jay',             company: 'Zepnil Systems',            title: '', linkedin: '', email: '', phone: '' },
      { name: 'Varun',           company: 'SAP',                       title: '', linkedin: '', email: '', phone: '' },
      { name: 'Krishi',          company: 'Apple',                     title: '', linkedin: '', email: '', phone: '' },
      { name: 'Venu',            company: 'Amazon',                    title: '', linkedin: '', email: '', phone: '' },
      { name: 'Sahil',           company: 'Qualcomm',                  title: '', linkedin: '', email: '', phone: '' },
      { name: 'Utsav',           company: 'Freightliner',              title: '', linkedin: '', email: '', phone: '' },
      { name: 'Geetha Nair',     company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '' },
      { name: 'James Keeble',    company: 'Halliburton',               title: '', linkedin: '', email: '', phone: '' },
    ];
    saveConnections(connections.map(c => ({ id: generateId(), addedOn: now, ...c })));
    localStorage.setItem(KEYS.seeded, 'true');
  }

  localStorage.setItem(KEYS.seeded + '_v3', 'true');
}

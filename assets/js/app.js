/* Home page: load skills.json, render category filters + cards, handle search. */
(function () {
  const grid = document.getElementById('grid');
  const filters = document.getElementById('filters');
  const searchInput = document.getElementById('search');
  const resultsMeta = document.getElementById('resultsMeta');

  let skills = [];
  let activeCategory = 'All';
  let query = '';

  function initials(name) {
    if (!name) return '·';
    return name.split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
  }

  function catsOf(skill) {
    return skill.categories || (skill.category ? [skill.category] : []);
  }

  function matches(skill) {
    const inCat = activeCategory === 'All' || catsOf(skill).includes(activeCategory);
    if (!inCat) return false;
    if (!query) return true;
    const hay = [skill.title, skill.summary, catsOf(skill).join(' '), skill.trigger, (skill.tags || []).join(' ')]
      .join(' ').toLowerCase();
    return query.toLowerCase().split(/\s+/).every(t => hay.includes(t));
  }

  function renderFilters() {
    const counts = {};
    skills.forEach(s => catsOf(s).forEach(c => { counts[c] = (counts[c] || 0) + 1; }));
    const cats = ['All', ...Object.keys(counts).sort()];
    filters.innerHTML = cats.map(cat => {
      const count = cat === 'All' ? skills.length : counts[cat];
      const active = cat === activeCategory ? ' active' : '';
      return `<button class="chip${active}" data-cat="${cat}">${cat}<span class="count">${count}</span></button>`;
    }).join('');
    filters.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        activeCategory = chip.dataset.cat;
        renderFilters();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const list = skills.filter(matches);
    resultsMeta.textContent = list.length === skills.length
      ? `${list.length} skills`
      : `${list.length} of ${skills.length} skills`;

    if (!list.length) {
      grid.innerHTML = '<div class="empty">No skills match your search yet. Try another term or category.</div>';
      return;
    }

    grid.innerHTML = list.map(s => `
      <a class="card" href="skill.html?slug=${encodeURIComponent(s.slug)}">
        <span class="pills">${catsOf(s).map(c => `<span class="pill${c === 'HubSpot' ? ' pill-hubspot' : ''}">${c}</span>`).join('')}</span>
        <h3>${s.title}</h3>
        <p>${s.summary || ''}</p>
        <div class="meta">
          <span class="owner"><span class="avatar">${initials(s.owner)}</span>${s.owner || 'Visma GTM'}</span>
          <span class="arrow">Open &rarr;</span>
        </div>
      </a>
    `).join('');
  }

  searchInput.addEventListener('input', e => { query = e.target.value; renderGrid(); });

  // Skills are embedded in assets/js/skills-data.js (window.SKILLS) — no fetch needed,
  // so the site works on GitHub Pages regardless of Jekyll, and even from file://.
  if (Array.isArray(window.SKILLS)) {
    skills = window.SKILLS.slice().sort((a, b) => a.title.localeCompare(b.title));
    // Prefill search from ?q= (e.g. when arriving from the home page search box).
    const initialQuery = new URLSearchParams(location.search).get('q');
    if (initialQuery) {
      query = initialQuery;
      searchInput.value = initialQuery;
    }
    renderFilters();
    renderGrid();
  } else {
    grid.innerHTML = '<div class="empty">Could not load the skill library. The data file (assets/js/skills-data.js) is missing.</div>';
  }
})();

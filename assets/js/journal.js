(function () {
  const STORAGE_KEY = 'troiaJournalEntries';

  const form = document.getElementById('journal-form');
  const entriesContainer = document.getElementById('journal-entries');
  const searchInput = document.getElementById('journal-search');
  const filterSelect = document.getElementById('entry-filter');
  const dateInput = document.getElementById('entry-date');
  const successText = document.getElementById('journal-success');
  const countEl = document.getElementById('entry-count');

  if (!form || !entriesContainer || !searchInput || !filterSelect || !dateInput) {
    return;
  }

  if (successText) {
    successText.hidden = true;
  }

  const today = () => new Date().toISOString().split('T')[0];

  const setDefaultDate = () => {
    if (!dateInput.value) {
      dateInput.value = today();
    }
  };

  const loadEntries = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Unable to read journal entries', error);
      return [];
    }
  };

  let entries = loadEntries();

  const saveEntries = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Unable to save journal entries', error);
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const createEntryElement = (entry) => {
    const card = document.createElement('article');
    card.className = 'journal-entry';

    const badge = document.createElement('span');
    badge.className = `badge ${entry.type === 'dream' ? 'badge-soft' : 'badge-primary'}`;
    badge.textContent = entry.type === 'dream' ? 'Dream' : 'Day';

    const header = document.createElement('div');
    header.className = 'entry-header';

    const title = document.createElement('h3');
    title.textContent = entry.title || 'Untitled entry';

    const meta = document.createElement('p');
    meta.className = 'entry-meta';
    const parts = [formatDate(entry.date)];
    if (entry.mood) parts.push(entry.mood);
    if (entry.tags) parts.push(entry.tags);
    meta.textContent = parts.filter(Boolean).join(' · ');

    header.appendChild(badge);
    header.appendChild(title);
    header.appendChild(meta);

    const body = document.createElement('p');
    body.className = 'entry-body';
    body.textContent = entry.notes;

    card.appendChild(header);
    card.appendChild(body);

    return card;
  };

  const renderEntries = () => {
    const query = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;
    const list = document.createDocumentFragment();

    const filtered = entries
      .filter((entry) => {
        const matchesType = filter === 'all' ? true : entry.type === filter;
        const matchesQuery =
          !query ||
          entry.title.toLowerCase().includes(query) ||
          entry.notes.toLowerCase().includes(query) ||
          (entry.tags && entry.tags.toLowerCase().includes(query));
        return matchesType && matchesQuery;
      })
      .sort((a, b) => {
        if (a.date === b.date) {
          return (b.createdAt || 0) - (a.createdAt || 0);
        }
        return b.date.localeCompare(a.date);
      });

    entriesContainer.innerHTML = '';
    countEl.textContent = entries.length.toString();

    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'journal-empty';
      empty.innerHTML = `<strong>No entries found.</strong><p>Log a new day or dream to see it here.</p>`;
      entriesContainer.appendChild(empty);
      return;
    }

    filtered.forEach((entry) => list.appendChild(createEntryElement(entry)));
    entriesContainer.appendChild(list);
  };

  const showSuccess = (message) => {
    if (!successText) return;
    successText.textContent = message;
    successText.hidden = false;
    successText.classList.add('visible');
    setTimeout(() => {
      successText.classList.remove('visible');
      successText.hidden = true;
    }, 2600);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: formData.get('type') || 'day',
      date: formData.get('date') || today(),
      title: (formData.get('title') || '').toString().trim(),
      notes: (formData.get('notes') || '').toString().trim(),
      mood: (formData.get('mood') || '').toString().trim(),
      tags: (formData.get('tags') || '').toString().trim(),
      createdAt: Date.now(),
    };

    if (!entry.title || !entry.notes) {
      return;
    }

    entries = [entry, ...entries];
    saveEntries();
    renderEntries();
    form.reset();
    setDefaultDate();
    showSuccess('Entry saved to this device.');
  });

  searchInput.addEventListener('input', () => renderEntries());
  filterSelect.addEventListener('change', () => renderEntries());

  setDefaultDate();
  renderEntries();
})();

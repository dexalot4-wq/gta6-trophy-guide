// Leonida Trophy Guide — offline tracker over the 55 official GTA VI trophies.
// Progress and settings live in localStorage only; nothing is sent anywhere.
const KEY = 'gta6-trophy-guide-v1';
const PHASES = [
  { n: 1, title: 'Story first', text: 'Play Chapters 1–4 and the finale in order. Grab the two partner trophies while your partner is riding with you — that window closes after the finale.' },
  { n: 2, title: 'Strangers & contacts', text: 'Clear the contact strands (Andy, Kenton, Billy, Randy, Tyrone, Bret) until 8 stranger strands are done. Several trophies finish together here.' },
  { n: 3, title: 'Activities & skills', text: 'Shooting Range golds, races, fishing, bowling, meditation, stunts and challenges. Sample every activity type once for Master of None.' },
  { n: 4, title: 'Collectibles & cleanup', text: 'Cards, WAiNK spots, vehicles, areas and money trophies. Then 100% completion — and the platinum pops right after.' },
];
const KIND_LABEL = {
  story: 'Story', side: 'Side mission', activity: 'Activity', collectible: 'Collectible',
  combat: 'Combat & crime', exploration: 'Exploration', economy: 'Money & property', misc: 'Misc',
};

let doc;
try {
  doc = await (await fetch('data/trophies.json')).json();
} catch (e) {
  document.getElementById('list').textContent = 'Could not load data/trophies.json — this guide needs its own files to run.';
  throw e;
}
const sourcesByKey = Object.fromEntries(doc.sources.map((s) => [s.key, s]));

let state = { earned: [], spoiler: false, hideEarned: false, grade: 'all', kind: 'all', query: '' };
try {
  const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
  if (saved && Array.isArray(saved.earned)) state = { ...state, ...saved, earned: saved.earned };
} catch { /* corrupted save: start fresh */ }

const $ = (id) => document.getElementById(id);
const listEl = $('list');
const openGuides = new Set();

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function targetLabel(t) {
  if (t.target == null) return null;
  const n = t.target.toLocaleString('en-US');
  return (t.kind === 'economy' && t.target >= 100000 ? '$' : '') + n;
}

function trophyMatches(t) {
  const q = state.query.trim().toLowerCase();
  if (state.grade !== 'all' && t.grade !== state.grade) return false;
  if (state.kind === 'missable') {
    if (t.missable === 'no') return false;
  } else if (state.kind !== 'all' && t.kind !== state.kind) return false;
  if (state.hideEarned && state.earned.includes(t.name)) return false;
  if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
  return true;
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderRoadmap() {
  const wrap = $('phases');
  wrap.replaceChildren();
  for (const p of PHASES) {
    const card = el('article', 'phase');
    const h = el('h3');
    h.append(el('span', 'n', 'Phase ' + p.n), document.createTextNode(p.title));
    card.append(h, el('p', null, p.text));
    const chips = el('div', 'chips');
    for (const t of doc.trophies.filter((x) => x.phase === p.n)) {
      const c = el('button', 'chip' + (state.earned.includes(t.name) ? ' done' : ''), t.name);
      c.type = 'button';
      c.addEventListener('click', () => {
        state.grade = 'all'; state.kind = 'all'; state.query = '';
        $('grade').value = 'all'; $('kind').value = 'all'; $('search').value = '';
        openGuides.add(t.name);
        render();
        document.getElementById('trophy-' + t.id)?.scrollIntoView({ block: 'center' });
      });
      chips.append(c);
    }
    card.append(chips);
    wrap.append(card);
  }
}

function renderList() {
  listEl.replaceChildren();
  const shown = doc.trophies.filter(trophyMatches);
  $('showing').textContent = `Showing ${shown.length} of ${doc.trophies.length} trophies`;
  const missableLeft = doc.trophies.filter((t) => t.missable !== 'no' && !state.earned.includes(t.name));
  $('missable-count').textContent = missableLeft.length
    ? `· ${missableLeft.length} missable / watch-out troph${missableLeft.length === 1 ? 'y' : 'ies'} still open`
    : '· all missable trophies earned';
  for (const t of shown) {
    const earned = state.earned.includes(t.name);
    const card = el('article', 'card' + (earned ? ' earned' : ''));
    card.id = 'trophy-' + t.id;
    const head = el('div', 'card-head');
    head.append(el('span', 'badge ' + t.grade, t.grade));
    const hidden = state.spoiler && t.kind === 'story' && !earned;
    head.append(el('h3', null, hidden ? 'Hidden story trophy' : t.name));
    card.append(head);
    card.append(el('p', 'desc', hidden ? 'Spoiler-safe mode is on — earn this story trophy to reveal its name and description.' : t.description));
    const tags = el('div', 'tags');
    tags.append(el('span', 'tag', KIND_LABEL[t.kind] ?? t.kind));
    const tl = targetLabel(t);
    if (tl) tags.append(el('span', 'tag target', 'Target: ' + tl));
    if (t.missable === 'partner') tags.append(el('span', 'tag missable', 'Partner window — do it during the story'));
    if (t.missable === 'watch') tags.append(el('span', 'tag missable', 'Watch out — trigger not pinned down yet'));
    card.append(tags);
    const actions = el('div', 'card-actions');
    const earn = el('label', 'earn');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned;
    box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
    box.addEventListener('change', () => {
      state.earned = box.checked ? [...state.earned, t.name] : state.earned.filter((n) => n !== t.name);
      save();
      render();
    });
    earn.append(box, document.createTextNode(earned ? 'Earned ✓' : 'Mark earned'));
    actions.append(earn);
    if (!hidden) {
      const toggle = el('button', 'guide-toggle', openGuides.has(t.name) ? 'Hide guide' : 'Show guide');
      toggle.type = 'button';
      toggle.addEventListener('click', () => {
        if (openGuides.has(t.name)) openGuides.delete(t.name);
        else openGuides.add(t.name);
        render();
      });
      actions.append(toggle);
    }
    card.append(actions);
    if (!hidden && openGuides.has(t.name)) {
      const g = el('div', 'guide');
      g.append(el('p', null, t.guide));
      if (t.missable_note) g.append(el('p', 'warn-note', t.missable_note));
      if (t.missable === 'watch') {
        g.append(el('p', 'warn-note', 'Not yet pinned down: the official description gives no place or step for this one, so this guide does not invent one. Check the community guides once the trigger is confirmed.'));
      }
      const src = el('p', 'sources', 'Sources: ');
      for (const key of t.sources) {
        const s = sourcesByKey[key];
        if (!s) continue;
        const a = document.createElement('a');
        a.href = s.url;
        a.textContent = s.label;
        a.target = '_blank';
        a.rel = 'noopener';
        src.append(a);
      }
      g.append(src);
      card.append(g);
    }
    listEl.append(card);
  }
  if (!shown.length) listEl.append(el('p', 'spoiled', 'No trophies match these filters.'));
}

function renderProgress() {
  const total = doc.trophies.length;
  const n = state.earned.length;
  $('progress-num').textContent = `${n} / ${total}`;
  $('progress-pct').textContent = `${Math.round((n / total) * 100)}% to platinum`;
  $('ring-fg').style.strokeDashoffset = String(326.7 * (1 - n / total));
  const byGrade = {};
  for (const t of doc.trophies) {
    byGrade[t.grade] = byGrade[t.grade] ?? [0, 0];
    byGrade[t.grade][1] += 1;
    if (state.earned.includes(t.name)) byGrade[t.grade][0] += 1;
  }
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    const [e, tot] = byGrade[g] ?? [0, 0];
    $('count-' + g).textContent = `${g[0].toUpperCase() + g.slice(1)} ${e}/${tot}`;
  }
}

function render() {
  renderRoadmap();
  renderList();
  renderProgress();
}

$('search').addEventListener('input', (e) => { state.query = e.target.value; save(); renderList(); });
$('grade').addEventListener('change', (e) => { state.grade = e.target.value; save(); renderList(); });
$('kind').addEventListener('change', (e) => { state.kind = e.target.value; save(); renderList(); });
$('hide-earned').addEventListener('change', (e) => { state.hideEarned = e.target.checked; save(); renderList(); });
$('spoiler').addEventListener('change', (e) => { state.spoiler = e.target.checked; save(); renderList(); });
$('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: doc.game, exported_at: new Date().toISOString(), earned: state.earned }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = new Set(doc.trophies.map((t) => t.name));
    state.earned = (Array.isArray(data) ? data : data.earned ?? []).filter((n) => names.has(n));
    save();
    render();
  } catch {
    alert('That file is not a valid progress export.');
  }
  e.target.value = '';
});
$('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  state.earned = [];
  openGuides.clear();
  save();
  render();
});

// Restore saved control state into the toolbar.
$('search').value = state.query;
$('grade').value = state.grade;
$('kind').value = state.kind;
$('hide-earned').checked = state.hideEarned;
$('spoiler').checked = state.spoiler;
render();

import * as db from './db.js';
import * as sync from './sync.js';
import { GROUPS, TYPES, EXERCISES, groupOf, exerciseIcon } from './exercises.js';

/* ---------- Utilidades ---------- */
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => toISO(new Date());
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return toISO(d); };
const mondayOf = s => addDays(s, -((parseD(s).getDay() + 6) % 7));
const dayIdx = s => (parseD(s).getDay() + 6) % 7; // 0 = lunes
const DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const DAY3 = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const num = (n, d = 2) => n == null ? '–' : Number(n).toLocaleString('es-AR', { maximumFractionDigits: d });
const parseNum = t => { if (t == null) return null; const v = parseFloat(String(t).replace(',', '.').trim()); return Number.isFinite(v) && v >= 0 ? v : null; };
const dateShort = s => { const d = parseD(s); return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`; };
const dateLong = s => { const d = parseD(s); return s === today() ? 'Hoy' : `${DAYS[dayIdx(s)][0].toUpperCase()}${DAYS[dayIdx(s)].slice(1)} ${d.getDate()} de ${MONTHS[d.getMonth()]}${d.getFullYear() !== new Date().getFullYear() ? ' de ' + d.getFullYear() : ''}`; };
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const kgs = v => v >= 10000 ? `${num(v / 1000, 1)} t` : `${num(v, 0)} kg`;
const setTxt = s => s.w ? `${num(s.w)} kg × ${num(s.r)}` : `${num(s.r)} reps`;
const IN_CLAUDE = !!window.claude?.use || /claude(usercontent)?\.(ai|com)$/.test(location.hostname);

/* ---------- Íconos ---------- */
const svg = (p, s = 24) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I = {
  today: svg('<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
  routines: svg('<path d="M4 9v6M7 6v12M17 6v12M20 9v6M7 12h10"/>'),
  book: svg('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>'),
  chart: svg('<path d="M4 18l5-6 4 3 7-9"/>'),
  gear: svg('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
  chev: svg('<path d="M9 6l6 6-6 6"/>', 20),
  check: svg('<path d="M5 13l4 4L19 7"/>', 24),
  up: svg('<path d="M12 19V5M6 11l6-6 6 6"/>', 20),
  down: svg('<path d="M12 5v14M6 13l6 6 6-6"/>', 20),
  trash: svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', 20),
  plus: svg('<path d="M12 5v14M5 12h14"/>', 18),
  minus: svg('<path d="M5 12h14"/>', 18),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>', 20),
  note: svg('<path d="M4 20l1-4L16 5l3 3L8 19z"/>', 16),
  clock: svg('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>', 16),
};
const dUp = '<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2l5 8H1z"/></svg>';
const dDown = '<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10L1 2h10z"/></svg>';

/* ---------- Estado ---------- */
const S = {
  tab: 'hoy', routines: [], sessions: [], runs: [], customs: [], moves: [],
  session: null, editRoutine: null, syncStatus: sync.status,
  lib: { q: '', group: '', muscle: '', type: '' },
  prog: { seg: 'resumen', track: 'todo', q: '' },
};
const STORE_KEY = { routines: 'routines', sessions: 'sessions', runs: 'runs', exercises: 'customs', moves: 'moves' };

const SEED = [
  { id: 'r-lunes', name: 'Rutina lunes', focus: 'Piernas', day: 0, rehab: false },
  { id: 'r-miercoles', name: 'Rutina miércoles', focus: 'Piernas', day: 2, rehab: false },
  { id: 'r-jueves', name: 'Rutina jueves', focus: 'Piernas rehab', day: 3, rehab: true },
  { id: 'r-viernes', name: 'Rutina viernes', focus: 'Tren superior', day: 4, rehab: false },
].map((r, i) => ({ ...r, items: [], order: i, updatedAt: 1 }));

async function load() {
  if (!(await db.getMeta('seeded'))) {
    const have = await db.all('routines');
    const missing = SEED.filter(s => !have.some(h => h.id === s.id));
    if (missing.length) await db.putMany('routines', missing);
    await db.setMeta('seeded', true);
  }
  await reload();
}
async function reload() {
  for (const [store, key] of Object.entries(STORE_KEY)) S[key] = (await db.all(store)).filter(x => !x.deleted);
  S.routines.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  S.sessions.sort((a, b) => (b.date + (b.startedAt || '')).localeCompare(a.date + (a.startedAt || '')));
  S.runs.sort((a, b) => b.date.localeCompare(a.date));
  S.active = S.sessions.find(s => s.status === 'active') || null;
}
async function save(store, item) {
  item.updatedAt = Math.max(Date.now(), (item.updatedAt || 0) + 1); item.dirty = true;
  await db.put(store, JSON.parse(JSON.stringify(item)));
  await reload();
  sync.kick();
}
const remove = (store, item) => save(store, { ...item, deleted: true });

/* ---------- Ejercicios ---------- */
const allExercises = () => [...EXERCISES, ...S.customs].sort((a, b) => a.name.localeCompare(b.name, 'es'));
const exById = id => EXERCISES.find(x => x.id === id) || S.customs.find(x => x.id === id) || null;
const doneSessions = () => S.sessions.filter(s => s.status === 'done');
const volOfSets = sets => sets.reduce((a, s) => a + (s.w || 0) * (s.r || 0), 0);
const sessVolume = s => s.exercises.reduce((a, x) => a + volOfSets(x.sets), 0);
const sessSets = s => s.exercises.reduce((a, x) => a + x.sets.length, 0);

/* Historial de un ejercicio. Rehab y general se llevan por separado. */
function historyOf(exId, rehab, excludeId) {
  const out = [];
  for (const s of doneSessions()) {
    if (!!s.rehab !== !!rehab || s.id === excludeId) continue;
    const x = s.exercises.find(y => y.exId === exId);
    if (x && x.sets.length) out.push({ date: s.date, session: s, ex: x });
  }
  return out; // más reciente primero
}
const topW = sets => sets.reduce((m, s) => Math.max(m, s.w || 0), 0);
const totalReps = sets => sets.reduce((a, s) => a + (s.r || 0), 0);
function bestOf(hist) {
  let best = null, bestVol = null;
  for (const h of hist) {
    for (const s of h.ex.sets) if (!best || (s.w || 0) > (best.w || 0) || ((s.w || 0) === (best.w || 0) && (s.r || 0) > (best.r || 0))) best = { ...s, date: h.date };
    const v = volOfSets(h.ex.sets); if (!bestVol || v > bestVol.v) bestVol = { v, date: h.date };
  }
  return { best, bestVol };
}
function compare(cur, prev) { return { w: topW(cur) - topW(prev), r: totalReps(cur) - totalReps(prev), v: volOfSets(cur) - volOfSets(prev), s: cur.length - prev.length }; }
function deltaHtml(c) {
  const chip = (v, txt) => `<span class="d ${v > 0 ? 'up' : v < 0 ? 'down' : ''}">${v > 0 ? dUp : v < 0 ? dDown : '='} ${txt}</span>`;
  return `<div class="delta">${chip(c.w, `${num(Math.abs(c.w))} kg`)}${chip(c.r, `${num(Math.abs(c.r))} reps`)}</div>`;
}

/* Sugerencia de progresión: solo mira tus registros y tus objetivos. No cambia nada por su cuenta. */
export function suggest(target, sets, rehab) {
  if (rehab) return { kind: 'rehab', text: 'Rehabilitación: la carga la decidís vos.' };
  if (!target || !sets?.length) return null;
  const { sets: nSets, repMin, repMax, inc } = target;
  const w = topW(sets), atTop = sets.filter(s => (s.w || 0) === w).map(s => s.r || 0).sort((a, b) => b - a);
  const hit = atTop.filter(r => r >= repMax).length;
  const label = w ? `${num(w)} kg` : 'tu peso corporal';
  if (hit >= nSets) {
    if (!inc || !w) return { kind: 'up', text: `Lograste ${nSets} × ${repMax} con ${label}. Ya podés sumar dificultad.` };
    return { kind: 'up', next: w + inc, text: `Lograste ${nSets} × ${repMax} con ${label}. Podés probar ${num(w + inc)} kg.` };
  }
  if (atTop.length < nSets) return { kind: 'hold', text: `Mantené ${label}. Hiciste ${atTop.length} de ${nSets} series con ese peso. Objetivo: ${nSets} × ${repMin}–${repMax}.` };
  let missing = 0;
  for (let i = 0; i < nSets; i++) missing += Math.max(0, repMax - atTop[i]);
  return { kind: 'hold', text: `Mantené ${label}. Te ${missing === 1 ? 'falta 1 rep' : `faltan ${missing} reps`} para ${nSets} × ${repMax}.` };
}
const targetFor = (exId, rehab) => { for (const r of S.routines) if (!!r.rehab === !!rehab) { const it = r.items.find(i => i.exId === exId); if (it) return it; } return null; };

/* ---------- Plan semanal ---------- */
const moveId = (monday, rid) => `${monday}_${rid}`;
function weekPlan(monday) {
  const out = [];
  for (const r of S.routines) {
    if (r.day == null) continue;
    const mv = S.moves.find(m => m.id === moveId(monday, r.id));
    const skipped = !!mv && mv.date === null;
    const date = mv?.date || addDays(monday, r.day);
    const done = doneSessions().find(s => s.routineId === r.id && mondayOf(s.date) === monday) || null;
    out.push({ routine: r, date, moved: !!mv, skipped, done });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}
function nextPlan(afterToday = false) {
  const t = today(), mon = mondayOf(t);
  const cur = weekPlan(mon).find(p => !p.done && !p.skipped && (afterToday ? p.date > t : p.date >= t));
  if (cur) return cur;
  for (let i = 1; i <= 4; i++) { const n = weekPlan(addDays(mon, 7 * i)).find(p => !p.skipped); if (n) return n; }
  return null;
}
const routineShort = r => (r.focus || r.name).replace(/^Piernas rehab$/i, 'Rehab').replace(/^Tren superior$/i, 'Superior');

/* ---------- Navegación ---------- */
const TABS = [['hoy', 'Hoy', I.today], ['rutinas', 'Rutinas', I.routines], ['biblioteca', 'Ejercicios', I.book], ['progreso', 'Progreso', I.chart]];
function renderNav() {
  $('#nav').innerHTML = `<div class="brand"><img src="icon-192.png" width="30" height="30" alt="">My Training</div>` + TABS.map(([k, l, ic]) => `<button class="tab" data-act="tab" data-k="${k}" ${S.tab === k ? 'aria-current="page"' : ''}>${ic}<span>${l}</span></button>`).join('');
}
function render(keepScroll = true) {
  const main = $('#main'), y = main.scrollTop;
  $('#nav').hidden = !!S.session;
  if (S.session) { main.innerHTML = sessionView(); }
  else if (S.editRoutine) { main.innerHTML = routineEditor(); }
  else {
    renderNav();
    main.innerHTML = { hoy: homeView, rutinas: routinesView, biblioteca: libraryView, progreso: progressView, ajustes: settingsView }[S.tab]();
  }
  if (keepScroll) main.scrollTop = y; else main.scrollTop = 0;
}
const go = tab => { S.tab = tab; S.editRoutine = null; render(false); };

/* ---------- Gráficos ---------- */
function niceMax(v) { if (v <= 0) return 1; const p = 10 ** Math.floor(Math.log10(v)); for (const m of [1, 2, 2.5, 5, 10]) if (v <= m * p) return m * p; return 10 * p; }
function barChart(rows, { fmt = v => num(v), label = '', h = 150 } = {}) {
  const W = 340, H = h, L = 34, B = 20, T = 8, max = niceMax(Math.max(...rows.map(r => r.v), 0)), n = rows.length, gap = 4, bw = (W - L - gap * (n - 1)) / n, y = v => T + (H - T - B) * (1 - v / max);
  const ticks = [0, max / 2, max];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(label)}: ${rows.map(r => `${r.l} ${fmt(r.v)}`).join(', ')}">
    ${ticks.map(t => `<line class="grid" x1="${L}" x2="${W}" y1="${y(t)}" y2="${y(t)}"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end">${e(fmtAxis(t))}</text>`).join('')}
    ${rows.map((r, i) => { const x = L + i * (bw + gap), yy = y(r.v), bh = T + (H - T - B) - yy; return `<g data-tip="${e(r.tip || r.l + ': ' + fmt(r.v))}"><rect x="${x}" y="${T}" width="${bw}" height="${H - T - B}" fill="transparent"/>${r.v > 0 ? `<path d="M${x} ${yy + bh}V${yy + Math.min(4, bh)}q0-${Math.min(4, bh)} ${Math.min(4, bw / 2)}-${Math.min(4, bh)}H${x + bw - Math.min(4, bw / 2)}q${Math.min(4, bw / 2)} 0 ${Math.min(4, bw / 2)} ${Math.min(4, bh)}V${yy + bh}z" fill="${r.hi ? 'var(--accent)' : 'var(--accent-mid)'}"/>` : ''}<text x="${x + bw / 2}" y="${H - 5}" text-anchor="middle">${e(r.l)}</text></g>`; }).join('')}
  </svg>`;
}
const fmtAxis = v => v >= 10000 ? `${num(v / 1000, 1)} t` : num(v, 1);
function lineChart(rows, { fmt = v => num(v), label = '', h = 160, unit = '' } = {}) {
  if (!rows.length) return '';
  const W = 340, H = h, L = 38, R = 12, B = 20, T = 12, vs = rows.map(r => r.v);
  let lo = Math.min(...vs), hi = Math.max(...vs);
  if (lo === hi) { lo = Math.max(0, lo - 5); hi = hi + 5; }
  const pad_ = (hi - lo) * .15; lo = Math.max(0, lo - pad_); hi += pad_;
  const x = i => rows.length === 1 ? (L + W - R) / 2 : L + i * (W - L - R) / (rows.length - 1), y = v => T + (H - T - B) * (1 - (v - lo) / (hi - lo));
  const path = rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(r.v).toFixed(1)}`).join('');
  const base = H - B, ticks = [lo, (lo + hi) / 2, hi];
  const labelIdx = rows.length <= 2 ? rows.map((_, i) => i) : [0, rows.length - 1];
  const hitW = Math.max(22, (W - L - R) / rows.length);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(label)}: ${rows.map(r => `${r.l} ${fmt(r.v)}`).join(', ')}">
    ${ticks.map(t => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end">${e(fmtAxis(Math.round(t * 10) / 10))}</text>`).join('')}
    ${rows.length > 1 ? `<path d="${path}L${x(rows.length - 1)} ${base}L${x(0)} ${base}z" fill="var(--accent)" opacity=".25"/>` : ''}
    <path d="${path}" fill="none" stroke="var(--accent-line)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${rows.map((r, i) => `<g data-tip="${e(r.l + ': ' + fmt(r.v))}"><rect x="${x(i) - hitW / 2}" y="${T}" width="${hitW}" height="${H - T - B}" fill="transparent"/>${i === rows.length - 1 ? `<circle cx="${x(i)}" cy="${y(r.v)}" r="5" fill="var(--accent-line)" stroke="var(--surface)" stroke-width="2"/>` : rows.length <= 14 ? `<circle cx="${x(i)}" cy="${y(r.v)}" r="3" fill="var(--accent-line)"/>` : ''}</g>`).join('')}
    ${labelIdx.map(i => `<text x="${x(i)}" y="${H - 5}" text-anchor="${rows.length === 1 ? 'middle' : i === 0 ? 'start' : 'end'}">${e(rows[i].l)}</text>`).join('')}
  </svg>`;
}
const weeksBack = n => { const m = mondayOf(today()); return Array.from({ length: n }, (_, i) => addDays(m, -7 * (n - 1 - i))); };
function volumeWeeks(n, list = doneSessions()) {
  return weeksBack(n).map((m, i) => { const v = list.filter(s => mondayOf(s.date) === m).reduce((a, s) => a + sessVolume(s), 0); return { l: dateShort(m).split(' ')[0] + '/' + (parseD(m).getMonth() + 1), v, hi: i === n - 1, tip: `Semana del ${dateShort(m)}: ${kgs(v)}` }; });
}

/* ---------- Hoy ---------- */
function exLine(it) {
  const x = exById(it.exId) || { name: it.name };
  return `<li>${exerciseIcon(x, 30)}<span>${e(x.name)}</span><em>${it.sets} × ${it.repMin}–${it.repMax}</em></li>`;
}
function homeView() {
  const t = today(), mon = mondayOf(t), plan = weekPlan(mon), todays = plan.filter(p => p.date === t && !p.skipped);
  const pending = todays.filter(p => !p.done), next = nextPlan(pending.length > 0 && !S.active);
  const d = parseD(t);
  let hero;
  if (S.active) {
    const a = S.active, done = a.exercises.reduce((n, x) => n + x.sets.filter(s => s.done).length, 0), tot = sessSets(a);
    hero = `<section class="hero"><div class="eyebrow">Entrenamiento en curso</div><h2>${e(a.focus || a.name)}</h2><p>${done} de ${tot} series cargadas</p><button class="btn" data-act="resume">Seguir entrenando</button></section>`;
  } else if (pending.length) {
    const p = pending[0], r = p.routine;
    hero = `<section class="hero"><div class="eyebrow">Hoy · ${e(r.name)}${r.rehab ? ' · Seguimiento aparte' : ''}</div><h2>${e(r.focus || r.name)}</h2>
      ${r.items.length ? `<ol>${r.items.map(exLine).join('')}</ol><button class="btn" data-act="start" data-id="${r.id}">Empezar entrenamiento</button>` : `<p>Todavía no cargaste los ejercicios de esta rutina. Lo hacés una sola vez y queda guardada.</p><button class="btn" data-act="edit-routine" data-id="${r.id}">Cargar ejercicios</button>`}
      <div class="links"><button data-act="move" data-id="${r.id}">Mover a otro día</button>${r.items.length ? `<button data-act="edit-routine" data-id="${r.id}">Editar rutina</button>` : ''}</div>
      ${pending[1] ? `<button class="btn" data-act="start" data-id="${pending[1].routine.id}">También hoy: ${e(pending[1].routine.focus)}</button>` : ''}</section>`;
  } else if (todays.length) {
    const s = todays[0].done;
    hero = `<section class="hero rest"><div class="eyebrow">Hoy</div><h2>Hecho</h2><p>${e(s.focus || s.name)}: ${sessSets(s)} series, ${kgs(sessVolume(s))}.</p><button class="btn sec" data-act="open-session" data-id="${s.id}">Ver entrenamiento</button></section>`;
  } else {
    hero = `<section class="hero rest"><div class="eyebrow">Hoy · ${DAYS[dayIdx(t)]}</div><h2>Sin gimnasio</h2>${next ? `<p>Próximo: ${e(next.routine.focus)}, ${DAYS[dayIdx(next.date)]} ${parseD(next.date).getDate()}.</p>` : '<p>No tenés rutinas asignadas a un día.</p>'}
      ${next ? `<button class="btn sec" data-act="start" data-id="${next.routine.id}">Entrenar ${e(next.routine.focus)} hoy</button>` : ''}</section>`;
  }
  const weekSess = doneSessions().filter(s => mondayOf(s.date) === mon), weekRuns = S.runs.filter(r => mondayOf(r.date) === mon);
  const nPlan = plan.filter(p => !p.skipped).length, vol = weekSess.reduce((a, s) => a + sessVolume(s), 0), km = weekRuns.reduce((a, r) => a + (r.km || 0), 0);
  const cal = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(mon, i), ps = plan.filter(p => p.date === date && !p.skipped), ds = weekSess.filter(s => s.date === date), run = weekRuns.some(r => r.date === date);
    const isDone = ds.length > 0, miss = !isDone && ps.length && date < t && ps.some(p => !p.done);
    const tag = isDone ? (ds[0].focus ? routineShort(ds[0]) : 'Libre') : ps.map(p => routineShort(p.routine)).join(' + ');
    return `<button class="dayc ${ps.length ? 'plan' : ''} ${isDone ? 'done' : ''} ${date === t ? 'today' : ''} ${miss ? 'miss' : ''}" data-act="day" data-date="${date}" aria-label="${DAYS[i]} ${parseD(date).getDate()}${tag ? ': ' + e(tag) : ''}${isDone ? ', hecho' : ''}"><small>${DAY3[i][0]}</small><b>${parseD(date).getDate()}</b><span class="tag">${e(tag)}</span>${run ? '<i class="run"></i>' : ''}</button>`;
  }).join('');
  const nextTile = next ? `<button class="tile" data-act="move" data-id="${next.routine.id}"><div><small>Próximo entrenamiento</small><b>${e(next.routine.focus)}</b><small>${next.date === t ? 'Hoy' : dateLong(next.date)} · ${e(next.routine.name)}</small></div><span class="pill">Mover</span></button>` : '';
  const vols = volumeWeeks(8);
  return `<div class="page">
    <div class="top"><div><div class="wordmark">My Training</div><small>${DAYS[dayIdx(t)][0].toUpperCase() + DAYS[dayIdx(t)].slice(1)} ${d.getDate()} de ${MONTHS[d.getMonth()]}</small></div><button class="iconbtn" data-act="tab" data-k="ajustes" aria-label="Ajustes">${I.gear}</button></div>
    ${IN_CLAUDE ? '<p class="notice">Vista de prueba: lo que cargues acá queda solo en este navegador. Para usarla en serio, instalá la versión con tu propio link.</p>' : ''}
    ${hero}
    <div class="grid2">
      <section class="card"><header><h2>Tu semana</h2></header>
        <div class="week">${cal}</div>
        <div class="legend"><span><i style="background:var(--accent)"></i>Hecho</span><span><i style="background:var(--raise);border:1px solid var(--ink3)"></i>Planificado</span><span><i style="background:var(--ink);border-radius:50%"></i>Running</span></div>
        <div class="stats"><div class="stat"><small>Entrenamientos</small><b>${weekSess.length}<i>/${nPlan}</i></b></div><div class="stat"><small>Volumen</small><b>${kgs(vol)}</b></div><div class="stat"><small>Running</small><b>${num(km, 1)}<i>km</i></b></div></div>
        ${weekSess.length ? `<div class="wrapchips">${weekSess.slice().reverse().map(s => `<button class="chip sm" data-act="open-session" data-id="${s.id}">${DAY3[dayIdx(s.date)]}: ${e(routineShort(s))}</button>`).join('')}</div>` : ''}
      </section>
      <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
        ${nextTile}
        <section class="card"><header><h2>Volumen de entrenamiento</h2><p>Kilos totales por semana (peso × repeticiones)</p></header>
          ${vols.some(v => v.v) ? barChart(vols, { fmt: kgs, label: 'Volumen semanal' }) : '<p class="empty">Cuando termines tu primer entrenamiento vas a ver acá tu evolución.</p>'}</section>
        <div class="actions"><button class="btn sec small" data-act="new-run">Registrar running</button><button class="btn sec small" data-act="start-other">Otro entrenamiento</button></div>
      </div>
    </div></div>`;
}
function daySheet(date) {
  const mon = mondayOf(date), ps = weekPlan(mon).filter(p => p.date === date && !p.skipped), ss = doneSessions().filter(s => s.date === date), rs = S.runs.filter(r => r.date === date);
  const unplanned = weekPlan(mon).filter(p => p.date !== date && !p.done);
  openSheet(`<div class="sheet-head"><h2>${e(dateLong(date))}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
    ${ss.map(s => `<button class="tile" data-act="open-session" data-id="${s.id}"><div><small>Hecho</small><b>${e(s.focus || s.name)}</b><small>${sessSets(s)} series · ${kgs(sessVolume(s))}</small></div><span class="chev">${I.chev}</span></button>`).join('')}
    ${ps.filter(p => !p.done).map(p => `<section class="card"><header><h2>${e(p.routine.focus)}</h2><p>${e(p.routine.name)}${p.moved ? ' · Movida esta semana' : ''}</p></header><div class="two"><button class="btn small" data-act="start" data-id="${p.routine.id}" data-date="${date <= today() ? date : today()}">Empezar</button><button class="btn sec small" data-act="move" data-id="${p.routine.id}">Mover</button></div></section>`).join('')}
    ${rs.map(r => `<button class="tile" data-act="edit-run" data-id="${r.id}"><div><small>Running · ${e(r.type)}</small><b>${num(r.km, 2)} km</b><small>${runSummary(r)}</small></div><span class="chev">${I.chev}</span></button>`).join('')}
    ${unplanned.length ? `<div class="field"><span class="lbl">Traer una rutina a este día</span><div class="wrapchips">${unplanned.map(p => `<button class="chip" data-act="move-here" data-id="${p.routine.id}" data-date="${date}">${e(p.routine.focus)} (${DAY3[dayIdx(p.date)]})</button>`).join('')}</div></div>` : ''}
    ${!ps.length && !ss.length && !rs.length && !unplanned.length ? '<p class="empty">No hay nada planificado para este día.</p>' : ''}
    <button class="btn sec small" data-act="new-run" data-date="${date}">Registrar running este día</button>
  </div>`);
}
function moveSheet(rid) {
  const r = S.routines.find(x => x.id === rid), mon = mondayOf(today()), p = weekPlan(mon).find(q => q.routine.id === rid);
  let scope = 'week';
  const draw = () => {
    openSheet(`<div class="sheet-head"><h2>Mover ${e(r.focus)}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
      <div class="seg"><button data-act="move-scope" data-v="week" aria-pressed="${scope === 'week'}">Solo esta semana</button><button data-act="move-scope" data-v="always" aria-pressed="${scope === 'always'}">Todas las semanas</button></div>
      <p class="count">${scope === 'week' ? `Esta semana cae ${p?.skipped ? 'salteada' : 'el ' + DAYS[dayIdx(p.date)]}. La semana que viene vuelve a su día.` : `Queda fija para los ${r.day == null ? 'días que elijas' : DAYS[r.day]}. Elegí el nuevo día.`}</p>
      <div class="wrapchips" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr))">${DAYS.map((d, i) => { const date = addDays(mon, i), on = scope === 'week' ? (!p?.skipped && p?.date === date) : r.day === i; return `<button class="chip" style="justify-content:center" data-act="move-to" data-i="${i}" aria-pressed="${on}">${DAY3[i]}</button>`; }).join('')}</div>
      ${scope === 'week' ? `<button class="btn sec small" data-act="move-skip">Saltear esta semana</button>` : ''}
    </div>`);
    sheetAct = handler;
  };
  const handler = async (act, el) => {
    if (act === 'move-scope') { scope = el.dataset.v; draw(); return true; }
    if (act === 'move-to') {
      const i = +el.dataset.i;
      if (scope === 'always') { await save('routines', { ...r, day: i }); toast(`${r.focus} queda para los ${DAYS[i]}`); }
      else await setMove(r, mon, addDays(mon, i));
      closeSheet(); render(); return true;
    }
    if (act === 'move-skip') { await save('moves', { id: moveId(mon, r.id), routineId: r.id, date: null }); toast('Salteada esta semana'); closeSheet(); render(); return true; }
    return false;
  };
  draw();
}
async function setMove(r, mon, date) {
  const id = moveId(mon, r.id), def = r.day != null ? addDays(mon, r.day) : null, cur = S.moves.find(m => m.id === id);
  if (date === def) { if (cur) await remove('moves', cur); }
  else await save('moves', { ...(cur || {}), id, routineId: r.id, date });
  toast(`${r.focus}: ${DAYS[dayIdx(date)]} de esta semana`);
}

/* ---------- Rutinas ---------- */
function routinesView() {
  const wk = weekPlan(mondayOf(today()));
  return `<div class="page narrow"><div class="top"><h1>Rutinas</h1></div>
    <p class="count">Cada día abre su rutina. Si la cambiás, se actualiza para las próximas sesiones y tu historial no se toca.</p>
    <div class="list">${S.routines.map(r => { const p = wk.find(q => q.routine.id === r.id); return `<button class="item" data-act="edit-routine" data-id="${r.id}"><div class="txt"><b>${e(r.focus || r.name)}</b><small>${e(r.name)} · ${r.day == null ? 'Sin día fijo' : `Todos los ${DAYS[r.day]}`}${p?.moved ? (p.skipped ? ' · Salteada esta semana' : ` · Esta semana: ${DAYS[dayIdx(p.date)]}`) : ''}</small><small>${r.items.length ? `${r.items.length} ejercicios` : 'Sin ejercicios cargados'} ${r.rehab ? '<span class="pill rehab">Rehab</span>' : ''}</small></div><span class="chev">${I.chev}</span></button>`; }).join('')}</div>
    <button class="btn sec" data-act="new-routine">Nueva rutina</button></div>`;
}
const itemSummary = it => `${it.sets} × ${it.repMin}–${it.repMax}${it.weight ? ` · ${num(it.weight)} kg` : ''}${it.rest ? ` · ${it.rest} s` : ''}`;
function routineEditor() {
  const r = S.routines.find(x => x.id === S.editRoutine);
  return `<div class="page narrow">
    <div class="top"><button class="iconbtn" data-act="close-routine" aria-label="Volver" style="transform:scaleX(-1)">${I.chev}</button><h1 style="flex:1;min-width:0;overflow-wrap:anywhere">${e(r.focus || r.name)}</h1>${r.items.length ? `<button class="btn small" style="width:auto" data-act="start" data-id="${r.id}">Empezar</button>` : ''}</div>
    <div class="two"><div class="field"><label for="rname">Nombre</label><input class="input" id="rname" value="${e(r.name)}" data-act-input="rname"></div><div class="field"><label for="rfocus">Foco</label><input class="input" id="rfocus" value="${e(r.focus || '')}" data-act-input="rfocus"></div></div>
    <div class="field"><span class="lbl">Día de la semana</span><div class="wrapchips">${DAYS.map((d, i) => `<button class="chip sm" data-act="r-day" data-i="${i}" aria-pressed="${r.day === i}">${DAY3[i]}</button>`).join('')}<button class="chip sm" data-act="r-day" data-i="" aria-pressed="${r.day == null}">Sin día</button></div></div>
    <button class="toggle" data-act="r-rehab" aria-pressed="${!!r.rehab}"><span><b>Seguimiento de rehabilitación</b><small>Historial aparte y sin sugerencias de aumento de carga</small></span><i class="sw"></i></button>
    <p class="sec-title">Ejercicios en orden</p>
    ${r.items.length ? `<div class="list">${r.items.map((it, i) => { const x = exById(it.exId) || { name: it.name, muscle: '' }; return `<div class="item"><button class="thumb" data-act="r-item" data-i="${i}" aria-label="Configurar ${e(x.name)}">${exerciseIcon(x, 40)}</button><button class="txt" data-act="r-item" data-i="${i}"><b>${e(x.name)}</b><small>${itemSummary(it)}</small>${it.note ? `<small>${e(it.note)}</small>` : ''}</button><div style="display:flex;flex:none"><button class="iconbtn" style="width:36px" data-act="r-up" data-i="${i}" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>${I.up}</button><button class="iconbtn" style="width:36px" data-act="r-down" data-i="${i}" aria-label="Bajar" ${i === r.items.length - 1 ? 'disabled' : ''}>${I.down}</button></div></div>`; }).join('')}</div>` : '<p class="empty">Esta rutina todavía no tiene ejercicios. Agregalos desde la biblioteca.</p>'}
    <button class="btn" data-act="r-add">Agregar ejercicios</button>
    ${r.id.startsWith('r-') ? '' : ''}<button class="btn danger small" data-act="r-delete">Eliminar rutina</button>
  </div>`;
}
const newItem = exId => {
  const x = exById(exId);
  return { itemId: uid(), exId, name: x?.name, sets: 3, repMin: 10, repMax: 12, weight: null, inc: 2.5, rest: 90, note: '' };
};
function stepper(id, value, step, opts = {}) {
  return `<div class="stepper"><button type="button" data-act="step" data-t="${id}" data-d="${-step}" aria-label="Menos">−</button><input id="${id}" inputmode="${opts.int ? 'numeric' : 'decimal'}" value="${String(value ?? '').replace('.', ',')}" placeholder="${opts.ph ?? ''}" autocomplete="off"><button type="button" data-act="step" data-t="${id}" data-d="${step}" aria-label="Más">+</button></div>`;
}
function itemSheet(r, i) {
  const it = r.items[i], x = exById(it.exId) || { name: it.name };
  const hist = historyOf(it.exId, r.rehab), sug = hist[0] ? suggest(it, hist[0].ex.sets, r.rehab) : null;
  openSheet(`<div class="sheet-head"><h2>${e(x.name)}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
    <div class="two"><div class="field"><label for="i-sets">Series objetivo</label>${stepper('i-sets', it.sets, 1, { int: 1 })}</div><div class="field"><label for="i-weight">Peso de referencia (kg)</label>${stepper('i-weight', it.weight, 2.5, { ph: '–' })}</div></div>
    <div class="two"><div class="field"><label for="i-min">Reps mínimas</label>${stepper('i-min', it.repMin, 1, { int: 1 })}</div><div class="field"><label for="i-max">Reps máximas</label>${stepper('i-max', it.repMax, 1, { int: 1 })}</div></div>
    <div class="two">${r.rehab ? '' : `<div class="field"><label for="i-inc">Aumento sugerido (kg)</label>${stepper('i-inc', it.inc, 0.5)}</div>`}<div class="field"><label for="i-rest">Descanso (segundos)</label>${stepper('i-rest', it.rest, 15, { int: 1 })}</div></div>
    <div class="field"><label for="i-note">Notas</label><textarea class="input" id="i-note" rows="2" placeholder="Ej: asiento en posición 4">${e(it.note || '')}</textarea></div>
    ${sug ? `<div class="hint ${sug.kind}"><span>${e(sug.text)}</span></div>` : ''}
    <button class="btn sec small" data-act="ex-detail" data-id="${e(it.exId)}">Ver ficha del ejercicio</button>
  </div><div class="sheet-foot"><button class="btn danger" style="flex:none;width:auto" data-act="i-del">Quitar</button><button class="btn" data-act="i-save">Guardar</button></div>`);
  sheetAct = async act => {
    if (act === 'i-save') {
      const min = parseNum($('#i-min').value) ?? it.repMin, max = parseNum($('#i-max').value) ?? it.repMax;
      r.items[i] = { ...it, sets: Math.max(1, Math.round(parseNum($('#i-sets').value) ?? it.sets)), repMin: Math.min(min, max), repMax: Math.max(min, max), weight: parseNum($('#i-weight').value), inc: r.rehab ? it.inc : (parseNum($('#i-inc').value) ?? 0), rest: Math.round(parseNum($('#i-rest').value) ?? 0), note: $('#i-note').value.trim() };
      await save('routines', r); closeSheet(); render(); toast('Rutina guardada'); return true;
    }
    if (act === 'i-del') { r.items.splice(i, 1); await save('routines', r); closeSheet(); render(); toast('Ejercicio quitado'); return true; }
    return false;
  };
}

/* ---------- Biblioteca ---------- */
function filterEx({ q, group, muscle, type }) {
  const qn = norm(q || '').trim();
  return allExercises().filter(x => {
    if (muscle && x.muscle !== muscle) return false;
    if (group && groupOf(x.muscle) !== group) return false;
    if (type && !(x.types || []).includes(type)) return false;
    if (qn) { const hay = norm([x.name, x.muscle, (x.secondary || []).join(' '), x.equipment, (x.types || []).join(' ')].join(' ')); if (!qn.split(/\s+/).every(w => hay.includes(w))) return false; }
    return true;
  });
}
function filtersHtml(f, prefix = 'lib') {
  return `<div class="chips">${['', ...Object.keys(GROUPS)].map(g => `<button class="chip" data-act="${prefix}-group" data-v="${e(g)}" aria-pressed="${f.group === g}">${g || 'Todos'}</button>`).join('')}</div>
    ${f.group ? `<div class="chips">${GROUPS[f.group].map(m => `<button class="chip sm" data-act="${prefix}-muscle" data-v="${e(m)}" aria-pressed="${f.muscle === m}">${m}</button>`).join('')}</div>` : ''}
    <div class="chips">${TYPES.map(t => `<button class="chip sm" data-act="${prefix}-type" data-v="${e(t)}" aria-pressed="${f.type === t}">${t}</button>`).join('')}</div>`;
}
function exRows(list, act, picked = null) {
  return list.map(x => `<button class="item" data-act="${act}" data-id="${e(x.id)}"><span class="thumb">${exerciseIcon(x, 42)}</span><span class="txt"><b>${e(x.name)}</b><small>${e(x.muscle)} · ${e(x.equipment || 'Sin equipamiento')}</small></span>${picked ? (picked.has(x.id) ? `<span class="pill mint">Agregado</span>` : `<span class="chev">${I.plus}</span>`) : `<span class="chev">${I.chev}</span>`}</button>`).join('');
}
function libraryListHtml() {
  const l = filterEx(S.lib);
  return `<p class="count">${l.length} ${l.length === 1 ? 'ejercicio' : 'ejercicios'}</p>${l.length ? `<div class="list library-list">${exRows(l, 'ex-detail')}</div>` : `<p class="empty">No encontramos ese ejercicio. Probá otra palabra o crealo vos.</p>`}`;
}
function libraryView() {
  return `<div class="page"><div class="top"><h1>Ejercicios</h1><button class="btn small sec" style="width:auto" data-act="new-ex">Crear</button></div>
    <div class="search">${I.search}<input class="input" id="lib-q" type="search" placeholder="Buscar por nombre, músculo o equipo" value="${e(S.lib.q)}" autocomplete="off"></div>
    <div id="lib-filters" style="display:flex;flex-direction:column;gap:8px">${filtersHtml(S.lib)}</div>
    <div id="lib-list" style="display:flex;flex-direction:column;gap:8px">${libraryListHtml()}</div></div>`;
}
function exDetail(id) {
  const x = exById(id);
  if (!x) return toast('Ese ejercicio ya no está en la biblioteca');
  const hasHist = historyOf(id, false).length || historyOf(id, true).length;
  openSheet(`<div class="sheet-head"><h2>${e(x.name)}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
    <div class="bigfig">${exerciseIcon(x, 132)}</div>
    ${x.desc ? `<p>${e(x.desc)}</p>` : ''}
    <dl class="kv"><dt>Principal</dt><dd>${e(x.muscle)} · ${e(groupOf(x.muscle))}</dd><dt>Secundarios</dt><dd>${e((x.secondary || []).join(', ') || '–')}</dd><dt>Equipamiento</dt><dd>${e(x.equipment || '–')}</dd><dt>Tipo</dt><dd>${e((x.types || []).join(', ') || 'Personalizado')}</dd></dl>
    <div class="field"><span class="lbl">Agregar a una rutina</span><div class="wrapchips">${S.routines.map(r => { const has = r.items.some(i => i.exId === id); return `<button class="chip" data-act="add-to" data-r="${r.id}" aria-pressed="${has}">${e(routineShort(r))} · ${r.day == null ? 'sin día' : DAY3[r.day]}</button>`; }).join('')}</div></div>
    ${hasHist ? `<button class="btn sec small" data-act="ex-progress" data-id="${e(id)}" data-rehab="${historyOf(id, false).length ? '' : '1'}">Ver mi progreso</button>` : ''}
    ${x.builtin ? '' : `<div class="two"><button class="btn sec small" data-act="edit-ex" data-id="${e(id)}">Editar</button><button class="btn danger small" data-act="del-ex" data-id="${e(id)}">Eliminar</button></div>`}
  </div>`);
  sheetAct = async (act, el) => {
    if (act === 'add-to') {
      const r = S.routines.find(q => q.id === el.dataset.r);
      if (r.items.some(i => i.exId === id)) { toast('Ya está en esa rutina'); return true; }
      r.items.push(newItem(id)); await save('routines', r); el.setAttribute('aria-pressed', 'true'); toast(`Agregado a ${r.focus}`); return true;
    }
    return false;
  };
}
function exForm(x) {
  const cur = x || { name: '', muscle: 'Cuádriceps', secondary: [], equipment: '', desc: '' };
  openSheet(`<div class="sheet-head"><h2>${x ? 'Editar ejercicio' : 'Crear ejercicio'}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
    <div class="field"><label for="x-name">Nombre</label><input class="input" id="x-name" value="${e(cur.name)}" placeholder="Ej: Sentadilla en Smith"></div>
    <div class="field"><label for="x-muscle">Grupo muscular principal</label><select id="x-muscle">${Object.entries(GROUPS).map(([g, ms]) => `<optgroup label="${g}">${ms.map(m => `<option ${m === cur.muscle ? 'selected' : ''}>${m}</option>`).join('')}</optgroup>`).join('')}</select></div>
    <div class="field"><label for="x-sec">Músculos secundarios (opcional)</label><input class="input" id="x-sec" value="${e((cur.secondary || []).join(', '))}" placeholder="Ej: Glúteos, Abdomen"></div>
    <div class="field"><label for="x-eq">Equipamiento (opcional)</label><input class="input" id="x-eq" value="${e(cur.equipment)}" placeholder="Ej: Máquina Smith"></div>
    <div class="field"><label for="x-desc">Cómo se hace (opcional)</label><textarea class="input" id="x-desc" rows="2">${e(cur.desc)}</textarea></div>
    <p class="err" id="x-err" hidden></p>
  </div><div class="sheet-foot"><button class="btn" data-act="x-save">Guardar</button></div>`);
  sheetAct = async act => {
    if (act !== 'x-save') return false;
    const name = $('#x-name').value.trim();
    if (!name) { const er = $('#x-err'); er.textContent = 'Poné un nombre para el ejercicio.'; er.hidden = false; return true; }
    await save('exercises', { ...cur, id: cur.id || 'c-' + uid(), name, muscle: $('#x-muscle').value, secondary: $('#x-sec').value.split(',').map(s => s.trim()).filter(Boolean), equipment: $('#x-eq').value.trim(), desc: $('#x-desc').value.trim(), types: cur.types || [], builtin: false });
    closeSheet(); render(); toast('Ejercicio guardado'); return true;
  };
}
/* Selector de ejercicios para rutinas y entrenamientos */
function picker(onAdd, existing) {
  const f = { q: '', group: '', muscle: '', type: '' }, picked = new Set(existing);
  const list = () => { const l = filterEx(f); return `<p class="count">${l.length} ejercicios</p>${l.length ? `<div class="list">${exRows(l, 'pick', picked)}</div>` : '<p class="empty">No aparece. Podés crearlo desde Ejercicios.</p>'}`; };
  const draw = () => { $('#pick-filters').innerHTML = filtersHtml(f, 'pk'); $('#pick-list').innerHTML = list(); };
  openSheet(`<div class="sheet-head"><h2>Agregar ejercicios</h2><button data-act="close-sheet" style="color:var(--ink)">Listo</button></div><div class="sheet-body">
    <div class="search">${I.search}<input class="input" id="pick-q" type="search" placeholder="Buscar" autocomplete="off"></div>
    <div id="pick-filters" style="display:flex;flex-direction:column;gap:8px"></div><div id="pick-list" style="display:flex;flex-direction:column;gap:8px"></div></div>`, true);
  draw();
  $('#pick-q').addEventListener('input', ev => { f.q = ev.target.value; $('#pick-list').innerHTML = list(); });
  sheetAct = async (act, el) => {
    const v = el.dataset.v;
    if (act === 'pk-group') { f.group = f.group === v ? '' : v; f.muscle = ''; draw(); return true; }
    if (act === 'pk-muscle') { f.muscle = f.muscle === v ? '' : v; draw(); return true; }
    if (act === 'pk-type') { f.type = f.type === v ? '' : v; draw(); return true; }
    if (act === 'pick') {
      const id = el.dataset.id;
      if (picked.has(id)) return true;
      picked.add(id); await onAdd(id);
      const y = el.closest('.sheet-body').scrollTop; $('#pick-list').innerHTML = list(); $('.sheet-body').scrollTop = y; return true;
    }
    return false;
  };
}

/* ---------- Entrenamiento ---------- */
function buildExercise(exId, item, rehab) {
  const x = exById(exId) || { name: item?.name, muscle: 'Otros' };
  const last = historyOf(exId, rehab)[0]?.ex.sets || [];
  const target = item ? { sets: item.sets, repMin: item.repMin, repMax: item.repMax, inc: item.inc } : (t => t && { sets: t.sets, repMin: t.repMin, repMax: t.repMax, inc: t.inc })(targetFor(exId, rehab));
  const n = item?.sets ?? (last.length || target?.sets || 3);
  const sets = Array.from({ length: n }, (_, i) => {
    const ref = last[i] || last[last.length - 1];
    return { w: null, r: null, done: false, pw: ref ? (ref.w ?? null) : (item?.weight ?? null), pr: ref ? ref.r : (target?.repMin ?? null) };
  });
  return { key: uid(), exId, name: x.name, muscle: x.muscle, target, rest: item?.rest ?? 0, note: item?.note || '', routineNote: item?.note || '', sets };
}
async function startSession(routine, date) {
  if (S.active) { S.session = S.active; toast('Ya tenés un entrenamiento en curso'); render(false); return; }
  const s = { id: uid(), date: date || today(), startedAt: new Date().toISOString(), status: 'active', routineId: routine?.id || null, name: routine?.name || 'Entrenamiento libre', focus: routine?.focus || 'Libre', rehab: !!routine?.rehab, exercises: (routine?.items || []).map(it => buildExercise(it.exId, it, routine.rehab)), note: '' };
  await save('sessions', s);
  S.session = S.sessions.find(x => x.id === s.id);
  S.session = JSON.parse(JSON.stringify(S.session));
  wake(true); closeSheetIfOpen(); render(false);
}
let saveT = null;
function autosave() { clearTimeout(saveT); saveT = setTimeout(() => { if (S.session && S.session.status !== 'done') save('sessions', S.session); }, 350); }
function setsDone(x) { return x.sets.filter(s => s.done); }
function exBlock(x, i, s) {
  const fig = exById(x.exId) || { name: x.name, muscle: x.muscle };
  const hist = historyOf(x.exId, s.rehab, s.id).filter(h => h.date <= s.date), last = hist[0];
  const sug = last ? suggest(x.target, last.ex.sets, s.rehab) : (s.rehab ? suggest(null, null, true) : null);
  const done = setsDone(x), all = done.length === x.sets.length && x.sets.length > 0;
  return `<article class="ex ${all ? 'finished' : ''}" id="ex-${x.key}" data-key="${x.key}">
    <div class="ex-head"><button class="thumb" data-act="ex-detail" data-id="${e(x.exId)}" aria-label="Ver ficha">${exerciseIcon(fig, 42)}</button><button class="txt" data-act="ex-progress" data-id="${e(x.exId)}" data-rehab="${s.rehab ? '1' : ''}"><b>${e(x.name)}</b><small>${e(x.muscle)}${x.target ? ` · Objetivo ${x.target.sets} × ${x.target.repMin}–${x.target.repMax}` : ''}</small></button><button class="iconbtn danger" data-act="ex-remove" data-k="${x.key}" aria-label="Quitar ejercicio">${I.trash}</button></div>
    ${last ? `<p class="last"><strong>Última vez, ${dateShort(last.date)}:</strong> ${last.ex.sets.map(setTxt).join(' · ')} <br>${last.ex.sets.length} ${last.ex.sets.length === 1 ? 'serie' : 'series'}</p>` : '<p class="last">Primera vez que lo registrás.</p>'}
    ${sug ? `<div class="hint ${sug.kind}"><span>${e(sug.text)}</span>${sug.next ? `<button data-act="use-next" data-k="${x.key}" data-w="${sug.next}">Usar</button>` : ''}</div>` : ''}
    ${x.routineNote ? `<p class="count">${e(x.routineNote)}</p>` : ''}
    <div class="sets"><span class="h">#</span><span class="h">kg</span><span class="h">reps</span><span></span>
    ${x.sets.map((st, j) => `<span class="n">${j + 1}</span><input id="w-${x.key}-${j}" class="${st.done ? 'ok' : ''}" inputmode="decimal" aria-label="Peso de la serie ${j + 1}" data-set="w" data-k="${x.key}" data-j="${j}" value="${st.w ?? ''}" placeholder="${st.pw ?? '–'}" autocomplete="off"><input id="r-${x.key}-${j}" class="${st.done ? 'ok' : ''}" inputmode="numeric" aria-label="Repeticiones de la serie ${j + 1}" data-set="r" data-k="${x.key}" data-j="${j}" value="${st.r ?? ''}" placeholder="${st.pr ?? '–'}" autocomplete="off"><button class="check" data-act="set-check" data-k="${x.key}" data-j="${j}" aria-pressed="${!!st.done}" aria-label="Marcar serie ${j + 1}">${I.check}</button>`).join('')}</div>
    ${last && done.length ? `<div data-delta>${deltaHtml(compare(done, last.ex.sets))}</div>` : ''}
    <div class="ex-actions"><button class="ghost" data-act="set-add" data-k="${x.key}">${I.plus}Serie</button><button class="ghost" data-act="set-del" data-k="${x.key}" ${x.sets.length <= 1 ? 'disabled style="opacity:.4"' : ''}>${I.minus}Serie</button><button class="ghost" data-act="ex-notes" data-k="${x.key}">${I.note}Nota${x.note && x.note !== x.routineNote ? ' •' : ''}</button><button class="ghost" data-act="ex-notes" data-k="${x.key}">${I.clock}${x.rest ? x.rest + ' s' : 'Descanso'}</button></div>
  </article>`;
}
function sessionView() {
  const s = S.session, tot = sessSets(s), done = s.exercises.reduce((n, x) => n + setsDone(x).length, 0);
  const editing = s.status === 'done';
  return `<div class="session-wrap"><div class="session-top"><button class="iconbtn" data-act="session-back" aria-label="Salir" style="transform:scaleX(-1)">${I.chev}</button><div><h1>${e(s.focus || s.name)}</h1><small>${editing ? 'Editando' : `${done} de ${tot} series`}${s.rehab ? ' · Rehab' : ''}</small></div><button class="btn" data-act="session-finish">${editing ? 'Guardar' : 'Terminar'}</button></div>
    <div class="progressbar"><i style="width:${tot ? done / tot * 100 : 0}%"></i></div>
    <div class="page" style="padding-top:12px;max-width:680px;padding-bottom:90px">
      ${s.exercises.map((x, i) => exBlock(x, i, s)).join('') || '<p class="empty">Todavía no agregaste ejercicios.</p>'}
      <button class="btn sec" data-act="session-add">Agregar ejercicio</button>
      <div class="field"><label for="s-date">Fecha</label><input class="input" id="s-date" type="date" value="${s.date}" max="${today()}"></div>
      <div class="field"><label for="s-note">Notas del entrenamiento</label><textarea class="input" id="s-note" rows="2" placeholder="Opcional">${e(s.note || '')}</textarea></div>
      ${editing ? '' : '<button class="btn danger small" data-act="session-discard">Descartar entrenamiento</button>'}
    </div></div>`;
}
const findEx = k => S.session.exercises.find(x => x.key === k);
function redrawEx(k) {
  const x = findEx(k), el = document.getElementById('ex-' + k);
  if (!el) return;
  const i = S.session.exercises.indexOf(x), tmp = document.createElement('div');
  tmp.innerHTML = exBlock(x, i, S.session);
  el.replaceWith(tmp.firstElementChild);
  const tot = sessSets(S.session), done = S.session.exercises.reduce((n, y) => n + setsDone(y).length, 0);
  $('.progressbar i').style.width = (tot ? done / tot * 100 : 0) + '%';
  if (S.session.status !== 'done') $('.session-top small').textContent = `${done} de ${tot} series${S.session.rehab ? ' · Rehab' : ''}`;
}
async function finishSession() {
  const s = S.session;
  // las series con datos cargados cuentan aunque no se hayan tildado
  for (const x of s.exercises) x.sets = x.sets.map(st => (!st.done && st.r != null) ? { ...st, w: st.w ?? st.pw, done: true } : st).filter(st => st.done);
  const kept = s.exercises.filter(x => x.sets.length);
  if (!kept.length) {
    if (s.status === 'done') { toast('Cargá al menos una serie, o eliminá el entrenamiento'); return; }
    const ok = await confirmBox({ title: '¿Descartar?', body: 'No marcaste ninguna serie, así que no hay nada para guardar.', ok: 'Descartar' });
    if (ok) { await remove('sessions', s); S.session = null; wake(false); stopRest(); render(false); }
    else { S.session = JSON.parse(JSON.stringify(S.sessions.find(q => q.id === s.id))); render(); }
    return;
  }
  const wasEdit = s.status === 'done';
  const rec = { ...s, exercises: kept.map(x => ({ ...x, sets: x.sets.map(({ w, r }) => ({ w: w ?? 0, r: r ?? 0 })) })), status: 'done', endedAt: s.endedAt || new Date().toISOString() };
  clearTimeout(saveT);
  await save('sessions', rec);
  S.session = null; wake(false); stopRest();
  S.tab = 'hoy'; render(false);
  if (wasEdit) { toast('Entrenamiento actualizado'); return; }
  summarySheet(S.sessions.find(q => q.id === rec.id));
}
function prsOf(s) {
  const out = [];
  for (const x of s.exercises) {
    const prior = historyOf(x.exId, s.rehab, s.id).filter(h => h.date <= s.date);
    if (!prior.length) continue;
    const { best } = bestOf(prior), mine = bestOf([{ ex: x, date: s.date }]).best;
    if ((mine.w || 0) > (best.w || 0) || ((mine.w || 0) === (best.w || 0) && (mine.r || 0) > (best.r || 0))) out.push({ name: x.name, set: mine });
  }
  return out;
}
function summarySheet(s) {
  const prev = doneSessions().find(q => q.id !== s.id && q.routineId === s.routineId && q.date <= s.date && s.routineId);
  const v = sessVolume(s), dv = prev ? v - sessVolume(prev) : null, prs = prsOf(s);
  openSheet(`<div class="sheet-head"><h2>Entrenamiento guardado</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
    <div class="stats"><div class="stat"><small>Volumen</small><b>${kgs(v)}</b></div><div class="stat"><small>Series</small><b>${sessSets(s)}</b></div><div class="stat"><small>Vs. anterior</small><b>${dv == null ? '–' : (dv > 0 ? '+' : dv < 0 ? '−' : '') + kgs(Math.abs(dv))}</b></div></div>
    ${prs.length ? `<section class="card"><h2 class="pr">Mejores marcas</h2>${prs.map(p => `<p>${e(p.name)}: <b>${setTxt(p.set)}</b></p>`).join('')}</section>` : ''}
    <section class="card"><h2>Comparado con la vez anterior</h2>${s.exercises.map(x => { const h = historyOf(x.exId, s.rehab, s.id).filter(q => q.date <= s.date)[0]; return `<div class="sess-ex"><b>${e(x.name)}</b><div class="setlist">${x.sets.map(st => `<span>${setTxt(st)}</span>`).join('')}</div>${h ? deltaHtml(compare(x.sets, h.ex.sets)) : '<small class="count">Primera vez</small>'}</div>`; }).join('')}</section>
  </div>`);
}
function sessionSheet(id) {
  const s = S.sessions.find(q => q.id === id);
  openSheet(`<div class="sheet-head"><h2>${e(s.focus || s.name)}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
    <p class="count">${e(dateLong(s.date))} · ${e(s.name)} ${s.rehab ? '<span class="pill rehab">Rehab</span>' : ''}</p>
    <div class="stats"><div class="stat"><small>Volumen</small><b>${kgs(sessVolume(s))}</b></div><div class="stat"><small>Series</small><b>${sessSets(s)}</b></div><div class="stat"><small>Ejercicios</small><b>${s.exercises.length}</b></div></div>
    <section class="card">${s.exercises.map(x => { const h = historyOf(x.exId, s.rehab, s.id).filter(q => q.date <= s.date)[0]; return `<div class="sess-ex"><button data-act="ex-progress" data-id="${e(x.exId)}" data-rehab="${s.rehab ? '1' : ''}"><b>${e(x.name)}</b></button><div class="setlist">${x.sets.map(st => `<span>${setTxt(st)}</span>`).join('')}</div>${h ? deltaHtml(compare(x.sets, h.ex.sets)) : ''}${x.note ? `<small class="count">${e(x.note)}</small>` : ''}</div>`; }).join('')}</section>
    ${s.note ? `<p>${e(s.note)}</p>` : ''}
    <div class="two"><button class="btn sec small" data-act="session-edit" data-id="${s.id}">Editar</button><button class="btn danger small" data-act="session-del" data-id="${s.id}">Eliminar</button></div>
  </div>`);
}

/* Temporizador de descanso */
let restT = null, restEnd = 0;
function startRest(sec) {
  if (!sec) return;
  restEnd = Date.now() + sec * 1000; clearInterval(restT); restT = setInterval(tickRest, 500); tickRest();
}
function tickRest() {
  const left = Math.ceil((restEnd - Date.now()) / 1000);
  if (left <= 0) { stopRest(); navigator.vibrate?.(200); toast('Terminó el descanso'); return; }
  const bar = $('#restbar');
  bar.hidden = false;
  bar.innerHTML = `<span>Descanso</span><b>${Math.floor(left / 60)}:${pad(left % 60)}</b><button data-act="rest-add">+15 s</button><button data-act="rest-stop">Listo</button>`;
}
function stopRest() { clearInterval(restT); $('#restbar').hidden = true; }
let lock = null;
async function wake(on) { try { if (on && !lock) { lock = await navigator.wakeLock?.request('screen'); } else if (!on) { await lock?.release(); lock = null; } } catch { lock = null; } }

/* ---------- Running ---------- */
const paceOf = r => { if (!r.km || !r.min) return null; const p = r.min / r.km, m = Math.floor(p), s = Math.round((p - m) * 60); return `${s === 60 ? m + 1 : m}:${pad(s === 60 ? 0 : s)} /km`; };
const fmtMin = v => { if (v == null) return ''; const m = Math.floor(v), s = Math.round((v - m) * 60); return `${m}:${pad(s)}`; };
const runSummary = r => [r.min ? fmtMin(r.min) + ' min' : '', paceOf(r), r.note].filter(Boolean).map(e).join(' · ');
const parseTime = t => { const s = String(t).trim(); if (!s) return null; if (s.includes(':')) { const p = s.split(':').map(Number); if (p.some(n => !Number.isFinite(n))) return null; return p.length === 3 ? p[0] * 60 + p[1] + p[2] / 60 : p[0] + p[1] / 60; } return parseNum(s); };
const RUN_TYPES = ['Rodaje', 'Fondo', 'Series', 'Tempo', 'Carrera', 'Otro'];
function runForm(r, date) {
  const cur = r || { date: date || today(), type: 'Rodaje', km: null, min: null, note: '' };
  let type = cur.type;
  openSheet(`<div class="sheet-head"><h2>${r ? 'Editar running' : 'Registrar running'}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
    <div class="wrapchips" id="run-types">${RUN_TYPES.map(t => `<button class="chip sm" data-act="run-type" data-v="${t}" aria-pressed="${t === type}">${t}</button>`).join('')}</div>
    <div class="two"><div class="field"><label for="run-km">Distancia (km)</label><input class="input" id="run-km" inputmode="decimal" value="${cur.km ?? ''}" placeholder="10"></div><div class="field"><label for="run-min">Tiempo (mm:ss)</label><input class="input" id="run-min" inputmode="text" value="${fmtMin(cur.min)}" placeholder="55:00"></div></div>
    <p class="count" id="run-pace"></p>
    <div class="field"><label for="run-date">Fecha</label><input class="input" id="run-date" type="date" value="${cur.date}" max="${today()}"></div>
    <div class="field"><label for="run-note">Notas (opcional)</label><input class="input" id="run-note" value="${e(cur.note || '')}" placeholder="Cómo te sentiste"></div>
    <p class="err" id="run-err" hidden></p>
  </div><div class="sheet-foot">${r ? '<button class="btn danger" style="flex:none;width:auto" data-act="run-del">Eliminar</button>' : ''}<button class="btn" data-act="run-save">Guardar</button></div>`);
  const pace = () => { const km = parseNum($('#run-km').value), min = parseTime($('#run-min').value), p = paceOf({ km, min }); $('#run-pace').textContent = p ? 'Ritmo: ' + p : ''; };
  $('#run-km').addEventListener('input', pace); $('#run-min').addEventListener('input', pace); pace();
  sheetAct = async (act, el) => {
    if (act === 'run-type') { type = el.dataset.v; document.querySelectorAll('#run-types .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.v === type)); return true; }
    if (act === 'run-save') {
      const km = parseNum($('#run-km').value);
      if (!km) { const er = $('#run-err'); er.textContent = 'Cargá la distancia en kilómetros.'; er.hidden = false; return true; }
      await save('runs', { ...cur, id: cur.id || uid(), type, km, min: parseTime($('#run-min').value), date: $('#run-date').value || today(), note: $('#run-note').value.trim() });
      closeSheet(); render(); toast('Running guardado'); return true;
    }
    if (act === 'run-del') { await remove('runs', r); closeSheet(); render(); toast('Running eliminado'); return true; }
    return false;
  };
}

/* ---------- Progreso ---------- */
function progressView() {
  const p = S.prog;
  const body = { resumen: statsSection, sesiones: sessionsSection, ejercicios: exercisesSection, running: runningSection }[p.seg]();
  return `<div class="page"><div class="top"><h1>Progreso</h1></div>
    <div class="seg">${[['resumen', 'Resumen'], ['sesiones', 'Sesiones'], ['ejercicios', 'Ejercicios'], ['running', 'Running']].map(([k, l]) => `<button data-act="prog-seg" data-v="${k}" aria-pressed="${p.seg === k}">${l}</button>`).join('')}</div>${body}</div>`;
}
const trackFilter = list => S.prog.track === 'todo' ? list : list.filter(s => !!s.rehab === (S.prog.track === 'rehab'));
const trackChips = () => `<div class="wrapchips">${[['todo', 'Todo'], ['general', 'General'], ['rehab', 'Rehabilitación']].map(([k, l]) => `<button class="chip sm" data-act="prog-track" data-v="${k}" aria-pressed="${S.prog.track === k}">${l}</button>`).join('')}</div>`;
function statsSection() {
  const list = trackFilter(doneSessions());
  if (!list.length) return `${trackChips()}<section class="card"><p class="empty">Todavía no hay entrenamientos terminados${S.prog.track !== 'todo' ? ' en este seguimiento' : ''}. Los gráficos se arman solos con lo que registres.</p></section>`;
  const wk = weeksBack(8).map((m, i) => ({ l: dateShort(m).split(' ')[0] + '/' + (parseD(m).getMonth() + 1), v: list.filter(s => mondayOf(s.date) === m).length, hi: i === 7, tip: `Semana del ${dateShort(m)}: ${list.filter(s => mondayOf(s.date) === m).length}` }));
  const t = parseD(today()), mo = Array.from({ length: 6 }, (_, i) => { const d = new Date(t.getFullYear(), t.getMonth() - 5 + i, 1), k = toISO(d).slice(0, 7), v = list.filter(s => s.date.startsWith(k)).length; return { l: MONTHS[d.getMonth()].slice(0, 3), v, hi: i === 5, tip: `${MONTHS[d.getMonth()]}: ${v}` }; });
  const since = addDays(today(), -30), freq = {};
  for (const s of list.filter(q => q.date >= since)) { const seen = new Set(s.exercises.map(x => x.muscle)); for (const m of seen) freq[m] = (freq[m] || 0) + 1; }
  const fr = Object.entries(freq).sort((a, b) => b[1] - a[1]), fmax = Math.max(1, ...fr.map(f => f[1]));
  const counts = {};
  for (const s of list) for (const x of s.exercises) { if (topW(x.sets) > 0) { const k = x.exId + '|' + (s.rehab ? 1 : 0); counts[k] = (counts[k] || 0) + 1; } }
  const main = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  return `${trackChips()}<div class="grid2">
    <section class="card"><header><h2>Entrenamientos por semana</h2></header>${barChart(wk, { label: 'Entrenamientos por semana', fmt: v => num(v, 0), h: 130 })}</section>
    <section class="card"><header><h2>Entrenamientos por mes</h2></header>${barChart(mo, { label: 'Entrenamientos por mes', fmt: v => num(v, 0), h: 130 })}</section>
    <section class="card"><header><h2>Volumen semanal</h2><p>Kilos totales: peso × repeticiones</p></header>${lineChart(volumeWeeks(8, list), { fmt: kgs, label: 'Volumen semanal' })}</section>
    <section class="card"><header><h2>Frecuencia por grupo muscular</h2><p>Entrenamientos que lo incluyeron, últimos 30 días</p></header>${fr.length ? `<div class="hbars">${fr.map(([m, v]) => `<div class="hbar"><span>${e(m)}</span><div><i style="width:${v / fmax * 100}%"></i></div><b>${v}</b></div>`).join('')}</div>` : '<p class="empty">Sin entrenamientos en los últimos 30 días.</p>'}</section>
    <section class="card wide"><header><h2>Evolución de tus ejercicios principales</h2><p>Mayor peso de cada sesión. Son los que más repetiste con carga.</p></header>
      ${main.length ? `<div class="grid2">${main.map(([k]) => { const [id, rh] = k.split('|'), h = historyOf(id, rh === '1').slice().reverse(), x = h[h.length - 1]?.ex; return `<button data-act="ex-progress" data-id="${e(id)}" data-rehab="${rh === '1' ? '1' : ''}" style="display:flex;flex-direction:column;gap:4px;min-width:0"><b>${e(x?.name)} ${rh === '1' ? '<span class="pill rehab">Rehab</span>' : ''}</b>${lineChart(h.map(q => ({ l: dateShort(q.date), v: topW(q.ex.sets) })), { fmt: v => num(v) + ' kg', label: 'Peso', h: 110 })}</button>`; }).join('')}</div>` : '<p class="empty">Todavía no registraste ejercicios con peso.</p>'}</section>
  </div>`;
}
function sessionsSection() {
  const list = trackFilter(doneSessions());
  return `${trackChips()}${list.length ? `<div class="list">${list.map(s => `<button class="item" data-act="open-session" data-id="${s.id}"><div class="txt"><b>${e(s.focus || s.name)} ${s.rehab ? '<span class="pill rehab">Rehab</span>' : ''}</b><small>${e(dateLong(s.date))} · ${s.exercises.length} ejercicios · ${sessSets(s)} series</small></div><span class="val">${kgs(sessVolume(s))}</span></button>`).join('')}</div>` : '<p class="empty">Todavía no hay entrenamientos.</p>'}
    <button class="btn sec small" data-act="start-other" data-past="1">Cargar un entrenamiento pasado</button>`;
}
function exercisesSection() {
  const map = new Map();
  for (const s of doneSessions()) for (const x of s.exercises) { const k = x.exId + '|' + (s.rehab ? 1 : 0); if (!map.has(k)) map.set(k, { id: x.exId, rehab: !!s.rehab, name: x.name, muscle: x.muscle, n: 0, last: s.date }); map.get(k).n++; }
  const q = norm(S.prog.q || ''), all = [...map.values()].filter(x => (S.prog.track === 'todo' || x.rehab === (S.prog.track === 'rehab')) && (!q || norm(x.name).includes(q))).sort((a, b) => b.last.localeCompare(a.last));
  return `${trackChips()}<div class="search">${I.search}<input class="input" id="prog-q" type="search" placeholder="Buscar en lo que entrenaste" value="${e(S.prog.q)}" autocomplete="off"></div>
    ${all.length ? `<div class="list">${all.map(x => { const { best } = bestOf(historyOf(x.id, x.rehab)); const fig = exById(x.id) || x; return `<button class="item" data-act="ex-progress" data-id="${e(x.id)}" data-rehab="${x.rehab ? '1' : ''}"><span class="thumb">${exerciseIcon(fig, 42)}</span><span class="txt"><b>${e(x.name)} ${x.rehab ? '<span class="pill rehab">Rehab</span>' : ''}</b><small>${x.n} ${x.n === 1 ? 'sesión' : 'sesiones'} · Última: ${dateShort(x.last)}</small></span><span class="val">${best ? setTxt(best).replace(' kg × ', ' × ') : ''}</span></button>`; }).join('')}</div>` : '<p class="empty">Cuando registres un ejercicio aparece acá con todo su historial.</p>'}`;
}
function exProgressSheet(id, rehab) {
  const hist = historyOf(id, rehab), x = exById(id) || { name: hist[0]?.ex.name };
  if (!hist.length) { toast('Todavía no lo registraste'); return; }
  const { best, bestVol } = bestOf(hist), asc = hist.slice().reverse();
  const t = targetFor(id, rehab), sug = t ? suggest(t, hist[0].ex.sets, rehab) : (rehab ? suggest(null, null, true) : null);
  const hasW = asc.some(h => topW(h.ex.sets) > 0);
  openSheet(`<div class="sheet-head"><h2>${e(x.name)} ${rehab ? '<span class="pill rehab">Rehab</span>' : ''}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
    <div class="stats"><div class="stat"><small>Mejor marca</small><b style="font-size:20px">${setTxt(best).replace(' kg × ', ' × ')}</b><small>${dateShort(best.date)}</small></div><div class="stat"><small>Mejor volumen</small><b style="font-size:20px">${kgs(bestVol.v)}</b><small>${dateShort(bestVol.date)}</small></div><div class="stat"><small>Sesiones</small><b style="font-size:20px">${hist.length}</b></div></div>
    ${sug ? `<div class="hint ${sug.kind}"><span>${e(sug.text)}</span></div>` : ''}
    ${hist[1] ? `<section class="card"><h2>Última sesión vs. la anterior</h2>${deltaHtml(compare(hist[0].ex.sets, hist[1].ex.sets))}</section>` : ''}
    <section class="card"><header><h2>${hasW ? 'Evolución de la carga' : 'Evolución de las repeticiones'}</h2><p>${hasW ? 'Mayor peso de cada sesión' : 'Total de repeticiones por sesión'}</p></header>${lineChart(asc.map(h => ({ l: dateShort(h.date), v: hasW ? topW(h.ex.sets) : totalReps(h.ex.sets) })), { fmt: v => hasW ? num(v) + ' kg' : num(v) + ' reps', label: 'Evolución' })}</section>
    <section class="card"><h2>Todas las sesiones</h2>${hist.map((h, i) => `<div class="sess-ex"><button data-act="open-session" data-id="${h.session.id}" style="display:flex;justify-content:space-between;gap:8px"><b>${e(dateLong(h.date))}</b><small class="count">${h.ex.sets.length} ${h.ex.sets.length === 1 ? 'serie' : 'series'} · ${kgs(volOfSets(h.ex.sets))}</small></button><div class="setlist">${h.ex.sets.map(s => `<span>${setTxt(s)}</span>`).join('')}</div>${hist[i + 1] ? deltaHtml(compare(h.ex.sets, hist[i + 1].ex.sets)) : ''}</div>`).join('')}</section>
  </div>`, true);
}
function runningSection() {
  const list = S.runs;
  const wk = weeksBack(8).map((m, i) => { const v = list.filter(r => mondayOf(r.date) === m).reduce((a, r) => a + (r.km || 0), 0); return { l: dateShort(m).split(' ')[0] + '/' + (parseD(m).getMonth() + 1), v, hi: i === 7, tip: `Semana del ${dateShort(m)}: ${num(v, 1)} km` }; });
  const month = toISO(new Date()).slice(0, 7), mk = list.filter(r => r.date.startsWith(month)).reduce((a, r) => a + (r.km || 0), 0), longest = list.reduce((m, r) => Math.max(m, r.km || 0), 0);
  return `<button class="btn" data-act="new-run">Registrar running</button>
    ${list.length ? `<section class="card"><div class="stats"><div class="stat"><small>Este mes</small><b>${num(mk, 1)}<i>km</i></b></div><div class="stat"><small>Salidas</small><b>${list.length}</b></div><div class="stat"><small>Más larga</small><b>${num(longest, 1)}<i>km</i></b></div></div><header><h2>Kilómetros por semana</h2></header>${barChart(wk, { fmt: v => num(v, 1) + ' km', label: 'Kilómetros por semana', h: 130 })}</section>
    <div class="list">${list.map(r => `<button class="item" data-act="edit-run" data-id="${r.id}"><div class="txt"><b>${e(r.type)}</b><small>${e(dateLong(r.date))}${runSummary(r) ? ' · ' + runSummary(r) : ''}</small></div><span class="val">${num(r.km, 2)} km</span></button>`).join('')}</div>` : '<p class="empty">Todavía no registraste salidas.</p>'}`;
}

/* ---------- Ajustes ---------- */
function isStandalone() { return matchMedia('(display-mode: standalone)').matches || navigator.standalone; }
function settingsView() {
  const acct = sync.account();
  let syncHtml;
  if (IN_CLAUDE) syncHtml = '<p>Esta vista de prueba no sincroniza. La sincronización funciona en la versión instalada, con tu propio link.</p>';
  else if (!sync.configured()) syncHtml = '<p>La sincronización todavía no está activada. Tus datos quedan guardados en este dispositivo.</p>';
  else if (acct) {
    const st = S.syncStatus;
    const msg = { ok: 'Todo sincronizado.', syncing: 'Sincronizando…', pending: `${st.pending} cambios por subir.`, offline: st.pending ? `Sin conexión. ${st.pending} cambios van a subir cuando vuelva internet.` : 'Sin conexión.', error: 'No pudimos sincronizar. Vamos a reintentar solos.', expired: 'Tu sesión venció. Cerrá sesión y volvé a ingresar.' }[st.state] || '';
    syncHtml = `<p>Conectada como <strong>${e(acct)}</strong>.</p><p id="sync-msg">${msg}</p><div class="two"><button class="btn sec small" data-act="sync-now">Sincronizar ahora</button><button class="btn sec small" data-act="logout">Cerrar sesión</button></div>`;
  } else syncHtml = `<p>Usá la misma cuenta en tu compu y en tu celular para ver los mismos entrenamientos.</p>
    <form id="auth-form" class="set" novalidate><input class="input" id="auth-email" type="email" autocomplete="username" placeholder="Mail" inputmode="email" autocapitalize="off"><input class="input" id="auth-pass" type="password" autocomplete="current-password" placeholder="Contraseña (mínimo 6 caracteres)"><p class="err" id="auth-err" hidden></p><div class="two"><button class="btn small" type="submit" data-mode="login">Ya tengo cuenta</button><button class="btn sec small" type="submit" data-mode="create">Crear cuenta</button></div></form>`;
  return `<div class="page narrow"><div class="top"><button class="iconbtn" data-act="tab" data-k="hoy" aria-label="Volver" style="transform:scaleX(-1)">${I.chev}</button><h1 style="flex:1">Ajustes</h1></div>
    <p class="sec-title">Sincronización</p><section class="card set">${syncHtml}</section>
    <p class="sec-title">Tus datos</p>
    <section class="card set"><p>Exportá tu historial a un archivo que abre en Excel, o guardá una copia completa para recuperar todo si hace falta.</p>
      <button class="btn sec small" data-act="export-csv">Exportar historial (CSV para Excel)</button>
      <div class="two"><button class="btn sec small" data-act="backup">Guardar copia</button><button class="btn sec small" data-act="restore">Restaurar copia</button></div></section>
    ${isStandalone() ? '' : `<p class="sec-title">Instalar</p><section class="card set"><p>Agregá My Training a tu pantalla de inicio para abrirla como una app.</p><ol class="steps"><li><b>iPhone:</b> en Safari, Compartir → Agregar a inicio.</li><li><b>Android:</b> en Chrome, menú ⋮ → Instalar app.</li></ol></section>`}
    <p class="count">${EXERCISES.length} ejercicios en la biblioteca · ${S.customs.length} tuyos</p></div>`;
}
function bindAuth() {
  const form = $('#auth-form');
  if (!form || form.dataset.bound) return; form.dataset.bound = '1';
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const create = ev.submitter?.dataset.mode === 'create', err = $('#auth-err'); err.hidden = true;
    const email = $('#auth-email').value.trim(), pass = $('#auth-pass').value;
    if (!email || !pass) { err.textContent = 'Completá mail y contraseña.'; err.hidden = false; return; }
    form.querySelectorAll('button').forEach(b => b.disabled = true);
    try { await sync.login(email, pass, create); toast('Cuenta conectada'); render(); }
    catch (x) { err.textContent = x.message; err.hidden = false; form.querySelectorAll('button').forEach(b => b.disabled = false); }
  });
}
const csvCell = v => { const s = String(v ?? ''); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
function buildCSV() {
  const rows = [['Fecha', 'Tipo', 'Rutina', 'Seguimiento', 'Ejercicio', 'Grupo muscular', 'Serie', 'Peso (kg)', 'Repeticiones', 'Volumen (kg)', 'Distancia (km)', 'Tiempo (min)', 'Ritmo', 'Notas']];
  const dec = v => v == null ? '' : String(v).replace('.', ',');
  for (const s of doneSessions().slice().reverse()) for (const x of s.exercises) x.sets.forEach((st, i) => rows.push([s.date, 'Gimnasio', s.focus || s.name, s.rehab ? 'Rehabilitación' : 'General', x.name, x.muscle, i + 1, dec(st.w), st.r, dec((st.w || 0) * (st.r || 0)), '', '', '', i === 0 ? x.note : '']));
  for (const r of S.runs.slice().reverse()) rows.push([r.date, 'Running', r.type, '', '', '', '', '', '', '', dec(r.km), dec(r.min ? Math.round(r.min * 100) / 100 : null), paceOf(r) || '', r.note]);
  return '﻿' + rows.map(r => r.map(csvCell).join(';')).join('\r\n');
}
async function saveFile(filename, data, mime) {
  if (window.claude?.use) {
    const dl = await window.claude.use('downloads');
    if (dl) { try { await dl.save({ filename, data }); toast('Archivo listo'); } catch (x) { if (x.code !== 'declined') toast('No pudimos guardar el archivo'); } return; }
  }
  const blob = new Blob([data], { type: mime });
  const file = new File([blob], filename, { type: mime });
  if (isStandalone() && navigator.canShare?.({ files: [file] })) { try { await navigator.share({ files: [file] }); return; } catch (x) { if (x.name === 'AbortError') return; } }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000); toast('Archivo descargado');
}
async function backup() {
  const data = { app: 'my-training', version: 1, exportedAt: new Date().toISOString() };
  for (const st of db.STORES) data[st] = (await db.all(st)).map(({ dirty, ...x }) => x);
  await saveFile(`my-training-copia-${today()}.json`, JSON.stringify(data), 'application/json');
}
async function restore(file) {
  let data;
  try { data = JSON.parse(await file.text()); } catch { return toast('Ese archivo no se puede leer'); }
  if (data.app !== 'my-training') return toast('Ese archivo no es una copia de My Training');
  let n = 0;
  for (const st of db.STORES) {
    const items = [];
    for (const x of data[st] || []) { const cur = await db.get(st, x.id); if (!cur || cur.deleted || (x.updatedAt || 0) >= cur.updatedAt) { items.push({ ...x, updatedAt: Math.max(x.updatedAt || 0, Date.now()), dirty: true }); n++; } }
    if (items.length) await db.putMany(st, items);
  }
  await reload(); sync.kick(); render(); toast(`Copia restaurada: ${n} registros`);
}

/* ---------- Hojas y avisos ---------- */
let sheetOpen = false, sheetAct = null;
const hist = (fn, ...a) => { try { history[fn](...a); } catch { /* el marco puede no permitirlo */ } };
function openSheet(html, tall = false) {
  if (!sheetOpen) { hist('pushState', { sheet: 1 }, ''); sheetOpen = true; }
  sheetAct = null;
  const sh = $('#sheet'); sh.classList.toggle('tall', tall);
  sh.innerHTML = `<div class="grab" id="grab"></div>${html}`;
  sh.style.transform = '';
  $('#sheet-layer').hidden = false; hideTip();
}
function hideSheet() { $('#sheet-layer').hidden = true; sheetOpen = false; sheetAct = null; }
function closeSheet() { if (sheetOpen) { hideSheet(); hist('back'); } }
const closeSheetIfOpen = closeSheet;
addEventListener('popstate', () => { if (sheetOpen) hideSheet(); });
addEventListener('keydown', ev => { if (ev.key === 'Escape') { if (!$('#confirm-layer').hidden) $('#c-no')?.click(); else closeSheet(); } });
let drag = null;
document.addEventListener('pointerdown', ev => { if (ev.target.id === 'grab') { drag = { y: ev.clientY, dy: 0 }; ev.target.setPointerCapture?.(ev.pointerId); } });
document.addEventListener('pointermove', ev => { if (drag) { drag.dy = Math.max(0, ev.clientY - drag.y); $('#sheet').style.transform = `translateY(${drag.dy}px)`; } });
document.addEventListener('pointerup', () => { if (drag) { const d = drag.dy; drag = null; if (d > 90) closeSheet(); else $('#sheet').style.transform = ''; } });
function confirmBox({ title, body, ok }) {
  return new Promise(res => {
    $('#confirm').innerHTML = `<h2>${e(title)}</h2><p>${e(body)}</p><div class="acts"><button class="btn sec small" id="c-no">Cancelar</button><button class="btn small danger-solid" id="c-ok">${e(ok)}</button></div>`;
    $('#confirm-layer').hidden = false;
    const done = v => { $('#confirm-layer').hidden = true; res(v); };
    $('#c-no').onclick = () => done(false); $('#c-ok').onclick = () => done(true);
  });
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }
function hideTip() { $('#tip').hidden = true; }

/* ---------- Eventos ---------- */
document.addEventListener('click', async ev => {
  const tipEl = ev.target.closest('[data-tip]');
  if (tipEl) {
    const t = $('#tip'); t.textContent = tipEl.dataset.tip; t.hidden = false;
    const r = tipEl.getBoundingClientRect();
    t.style.left = Math.max(8, Math.min(innerWidth - t.offsetWidth - 8, r.left + r.width / 2 - t.offsetWidth / 2)) + 'px';
    t.style.top = Math.max(8, r.top - t.offsetHeight - 6) + 'px';
    clearTimeout(t._h); t._h = setTimeout(hideTip, 2500);
  } else hideTip();
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (sheetAct && await sheetAct(act, el)) return;
  const h = ACTIONS[act];
  if (h) await h(el, el.dataset);
});
const routineEditing = () => S.routines.find(x => x.id === S.editRoutine);
const ACTIONS = {
  'tab': (_, d) => go(d.k),
  'close-sheet': () => closeSheet(),
  'start': async (_, d) => { const r = S.routines.find(x => x.id === d.id); closeSheet(); S.editRoutine = null; await startSession(r, d.date); },
  'resume': () => { S.session = JSON.parse(JSON.stringify(S.active)); wake(true); render(false); },
  'start-other': (_, d) => {
    const past = !!d.past;
    openSheet(`<div class="sheet-head"><h2>${past ? 'Cargar entrenamiento pasado' : 'Otro entrenamiento'}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body">
      ${past ? `<div class="field"><label for="other-date">Fecha</label><input class="input" id="other-date" type="date" value="${addDays(today(), -1)}" max="${today()}"></div>` : ''}
      <div class="list">${S.routines.map(r => `<button class="item" data-act="start-with" data-id="${r.id}"><div class="txt"><b>${e(r.focus)}</b><small>${e(r.name)} · ${r.items.length} ejercicios</small></div><span class="chev">${I.chev}</span></button>`).join('')}<button class="item" data-act="start-with" data-id=""><div class="txt"><b>Entrenamiento libre</b><small>Elegís los ejercicios sobre la marcha</small></div><span class="chev">${I.chev}</span></button></div></div>`);
  },
  'start-with': async (_, d) => { const date = $('#other-date')?.value; const r = S.routines.find(x => x.id === d.id); closeSheet(); await startSession(r || null, date); },
  'day': (_, d) => daySheet(d.date),
  'move': (_, d) => moveSheet(d.id),
  'move-here': async (_, d) => { const r = S.routines.find(x => x.id === d.id); await setMove(r, mondayOf(d.date), d.date); closeSheet(); render(); },
  'new-routine': async () => { const id = uid(); await save('routines', { id, name: 'Rutina nueva', focus: 'Nueva', day: null, rehab: false, items: [], order: S.routines.length }); S.editRoutine = id; render(false); },
  'edit-routine': (_, d) => { closeSheet(); S.editRoutine = d.id; S.tab = 'rutinas'; renderNav(); render(false); },
  'close-routine': () => { S.editRoutine = null; render(false); },
  'r-day': async (_, d) => { const r = routineEditing(); await save('routines', { ...r, day: d.i === '' ? null : +d.i }); render(); },
  'r-rehab': async () => { const r = routineEditing(); await save('routines', { ...r, rehab: !r.rehab }); render(); },
  'r-up': async (_, d) => { const r = routineEditing(), i = +d.i; [r.items[i - 1], r.items[i]] = [r.items[i], r.items[i - 1]]; await save('routines', r); render(); },
  'r-down': async (_, d) => { const r = routineEditing(), i = +d.i; [r.items[i + 1], r.items[i]] = [r.items[i], r.items[i + 1]]; await save('routines', r); render(); },
  'r-item': (_, d) => itemSheet(routineEditing(), +d.i),
  'r-add': () => { const rid = S.editRoutine; picker(async id => { const r = S.routines.find(x => x.id === rid); r.items.push(newItem(id)); await save('routines', r); render(); toast('Agregado'); }, routineEditing().items.map(i => i.exId)); },
  'r-delete': async () => { const r = routineEditing(); if (await confirmBox({ title: `¿Eliminar ${r.focus}?`, body: 'Tus entrenamientos anteriores con esta rutina quedan guardados.', ok: 'Eliminar' })) { await remove('routines', r); S.editRoutine = null; render(false); toast('Rutina eliminada'); } },
  'step': (_, d) => { const inp = document.getElementById(d.t), v = (parseNum(inp.value) ?? 0) + parseFloat(d.d); inp.value = String(Math.max(0, Math.round(v * 100) / 100)).replace('.', ','); },
  'lib-group': (_, d) => { S.lib.group = S.lib.group === d.v ? '' : d.v; S.lib.muscle = ''; if (!d.v) S.lib.group = ''; $('#lib-filters').innerHTML = filtersHtml(S.lib); $('#lib-list').innerHTML = libraryListHtml(); },
  'lib-muscle': (_, d) => { S.lib.muscle = S.lib.muscle === d.v ? '' : d.v; $('#lib-filters').innerHTML = filtersHtml(S.lib); $('#lib-list').innerHTML = libraryListHtml(); },
  'lib-type': (_, d) => { S.lib.type = S.lib.type === d.v ? '' : d.v; $('#lib-filters').innerHTML = filtersHtml(S.lib); $('#lib-list').innerHTML = libraryListHtml(); },
  'ex-detail': (_, d) => exDetail(d.id),
  'new-ex': () => exForm(null),
  'edit-ex': (_, d) => exForm(exById(d.id)),
  'del-ex': async (_, d) => { const x = exById(d.id); if (await confirmBox({ title: `¿Eliminar ${x.name}?`, body: 'Sale de la biblioteca. Tu historial no se borra.', ok: 'Eliminar' })) { await remove('exercises', x); closeSheet(); render(); toast('Ejercicio eliminado'); } },
  'ex-progress': (_, d) => exProgressSheet(d.id, !!d.rehab),
  'set-check': (el, d) => {
    const x = findEx(d.k), st = x.sets[+d.j];
    if (st.done) { st.done = false; autosave(); redrawEx(d.k); return; }
    const r = st.r ?? st.pr;
    if (r == null) { document.getElementById(`r-${d.k}-${d.j}`).focus(); toast('Cargá las repeticiones'); return; }
    st.w = st.w ?? st.pw ?? 0; st.r = r; st.done = true;
    autosave(); redrawEx(d.k); startRest(x.rest);
  },
  'set-add': (_, d) => { const x = findEx(d.k), l = x.sets[x.sets.length - 1]; x.sets.push({ w: null, r: null, done: false, pw: l ? (l.w ?? l.pw) : null, pr: l ? (l.r ?? l.pr) : null }); autosave(); redrawEx(d.k); },
  'set-del': (_, d) => { const x = findEx(d.k); if (x.sets.length > 1) { x.sets.pop(); autosave(); redrawEx(d.k); } },
  'use-next': (_, d) => { const x = findEx(d.k); for (const s of x.sets) if (!s.done) s.pw = +d.w, s.w = null; autosave(); redrawEx(d.k); toast(`Cargaste ${num(+d.w)} kg como referencia de hoy. Tu rutina no cambia.`); },
  'ex-remove': async (_, d) => { const x = findEx(d.k); if (await confirmBox({ title: `¿Quitar ${x.name}?`, body: 'Solo sale de este entrenamiento. Tu rutina no cambia.', ok: 'Quitar' })) { S.session.exercises = S.session.exercises.filter(y => y.key !== d.k); autosave(); render(); } },
  'ex-notes': (_, d) => {
    const x = findEx(d.k);
    openSheet(`<div class="sheet-head"><h2>${e(x.name)}</h2><button data-act="close-sheet">Cerrar</button></div><div class="sheet-body"><div class="field"><label for="n-rest">Descanso (segundos)</label>${stepper('n-rest', x.rest || '', 15, { int: 1, ph: 'Sin temporizador' })}</div><div class="field"><label for="n-note">Comentario de hoy</label><textarea class="input" id="n-note" rows="3" placeholder="Opcional">${e(x.note === x.routineNote ? '' : x.note)}</textarea></div></div><div class="sheet-foot"><button class="btn" data-act="n-save">Guardar</button></div>`);
    sheetAct = async act => { if (act !== 'n-save') return false; x.rest = Math.round(parseNum($('#n-rest').value) ?? 0); x.note = $('#n-note').value.trim(); autosave(); closeSheet(); redrawEx(d.k); return true; };
  },
  'session-add': () => {
    const s = S.session;
    picker(async id => { s.exercises.push(buildExercise(id, null, s.rehab)); autosave(); render(); toast('Agregado'); }, s.exercises.map(x => x.exId));
  },
  'session-back': async () => {
    if (S.session.status === 'done') { if (await confirmBox({ title: '¿Salir sin guardar?', body: 'Se pierden los cambios de esta edición.', ok: 'Salir' })) { S.session = null; render(false); } return; }
    clearTimeout(saveT); await save('sessions', S.session); S.session = null; S.tab = 'hoy'; wake(false); render(false); toast('Tu entrenamiento sigue guardado');
  },
  'session-finish': () => finishSession(),
  'session-discard': async () => { if (await confirmBox({ title: '¿Descartar entrenamiento?', body: 'Se borra todo lo cargado en esta sesión.', ok: 'Descartar' })) { clearTimeout(saveT); await remove('sessions', S.session); S.session = null; wake(false); stopRest(); render(false); toast('Entrenamiento descartado'); } },
  'open-session': (_, d) => sessionSheet(d.id),
  'session-edit': (_, d) => { const s = JSON.parse(JSON.stringify(S.sessions.find(q => q.id === d.id))); s.exercises.forEach(x => { x.key = x.key || uid(); x.sets = x.sets.map(st => ({ ...st, done: true })); }); closeSheet(); S.session = s; render(false); },
  'session-del': async (_, d) => { const s = S.sessions.find(q => q.id === d.id); if (await confirmBox({ title: '¿Eliminar entrenamiento?', body: `${s.focus || s.name}, ${dateLong(s.date)}. No se puede deshacer.`, ok: 'Eliminar' })) { await remove('sessions', s); closeSheet(); render(); toast('Entrenamiento eliminado'); } },
  'rest-add': () => { restEnd += 15000; tickRest(); },
  'rest-stop': () => stopRest(),
  'new-run': (_, d) => runForm(null, d.date),
  'edit-run': (_, d) => runForm(S.runs.find(r => r.id === d.id)),
  'prog-seg': (_, d) => { S.prog.seg = d.v; render(false); },
  'prog-track': (_, d) => { S.prog.track = d.v; render(); },
  'export-csv': () => saveFile(`my-training-historial-${today()}.csv`, buildCSV(), 'text/csv'),
  'backup': () => backup(),
  'restore': () => $('#import-file').click(),
  'sync-now': () => sync.run(),
  'logout': async () => { if (await confirmBox({ title: '¿Cerrar sesión?', body: 'Los datos quedan en este dispositivo, pero deja de sincronizar.', ok: 'Cerrar sesión' })) { await sync.logout(); render(); } },
};
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.dataset.set) {
    const x = findEx(t.dataset.k), st = x.sets[+t.dataset.j];
    const v = t.value.trim() === '' ? null : parseNum(t.value);
    if (t.dataset.set === 'w') st.w = v; else st.r = v == null ? null : Math.round(v);
    autosave();
  } else if (t.id === 's-note') { S.session.note = t.value; autosave(); }
  else if (t.id === 's-date') { if (t.value) { S.session.date = t.value; autosave(); } }
  else if (t.id === 'lib-q') { S.lib.q = t.value; $('#lib-list').innerHTML = libraryListHtml(); }
  else if (t.id === 'prog-q') { S.prog.q = t.value; const y = t.selectionStart; render(); const n = $('#prog-q'); n.focus(); n.setSelectionRange(y, y); }
});
document.addEventListener('change', async ev => {
  const t = ev.target;
  if (t.id === 'rname' || t.id === 'rfocus') { const r = routineEditing(); await save('routines', { ...r, [t.id === 'rname' ? 'name' : 'focus']: t.value.trim() || r[t.id === 'rname' ? 'name' : 'focus'] }); }
  if (t.id === 'import-file' && t.files[0]) { await restore(t.files[0]); t.value = ''; }
});
new MutationObserver(bindAuth).observe($('#main'), { childList: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden && !S.session && !sheetOpen && S.tab === 'hoy') render(); if (!document.hidden && S.session) wake(true); });

/* ---------- Arranque ---------- */
(async () => {
  await load();
  S.tab = 'hoy';
  renderNav(); render(false);
  setTimeout(() => $('#splash').classList.add('out'), 200);
  sync.start({
    onChange: async () => { await reload(); if (!S.session && !sheetOpen) { const a = document.activeElement; if (!(a && /INPUT|TEXTAREA/.test(a.tagName))) render(); } },
    onStatus: st => { S.syncStatus = st; if (S.tab === 'ajustes' && !S.session) { const m = $('#sync-msg'); if (m) render(); } },
  });
  if ('serviceWorker' in navigator && !IN_CLAUDE) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
window.__MT = { S, suggest, buildCSV, db, reload, render };

import { d as React, Ng as Gear } from './runtime-0ef486abf046.js';
import {
  searchVerses,
  highlightedParts,
  tokens,
  parseReference,parseIpb,
  LIMIT
} from './bible-tools-fd1661b42c3c.js';
export { parseReference,searchVerses, highlightedParts, tokens };
// Additions to the original website only. React, fonts and all reader data are local assets.
const el = React.createElement,
  { useState, useEffect, useRef } = React;
// Preserve the original wide and touch layouts. Between them use a compact left rail,
// never a simulated wide viewport, a UA sniff, or a remount of the form/editor.
const viewKey = 'zau_web_display_v1',
  viewEvent = 'zau-layout-change';
const full = matchMedia('(min-width:64rem)'),
  laptop = matchMedia('(min-width:720px) and (any-pointer:fine)'),
  canPin = matchMedia('(min-width:640px)');
let preference = 'auto';
function setView(mode, save = true) {
  preference = mode === 'desktop' ? 'desktop' : 'auto';
  if (save)
    try {
      localStorage.setItem(viewKey, preference);
    } catch {}
  const kind = full.matches
    ? 'wide'
    : laptop.matches || (preference === 'desktop' && canPin.matches)
      ? 'compact'
      : 'mobile';
  document.documentElement.dataset.zauLayout = kind;
  window.dispatchEvent(new Event(viewEvent));
}
try {
  preference = localStorage.getItem(viewKey) || 'auto';
} catch {}
const loc = new URL(location.href),
  requested = loc.searchParams.get('view');
if (requested === 'desktop' || requested === 'auto') {
  setView(requested);
  loc.searchParams.delete('view');
  history.replaceState(history.state, '', loc.href);
} else setView(preference, false);
for (const q of [full, laptop, canPin])
  q.addEventListener('change', () => setView(preference, false));
window.addEventListener('storage', (e) => {
  if (e.key === viewKey) setView(e.newValue, false);
});
function LayoutControl() {
  const read = () => [
    preference,
    document.documentElement.dataset.zauLayout,
    innerWidth
  ];
  const [[pref, kind, width], sync] = useState(read);
  useEffect(() => {
    const cb = () => sync(read());
    window.addEventListener(viewEvent, cb);
    window.addEventListener('resize', cb);
    return () => {
      window.removeEventListener(viewEvent, cb);
      window.removeEventListener('resize', cb);
    };
  }, []);
  return el(
    'div',
    { className: 'zw-display' },
    choice(
      'Вид сайта',
      { auto: 'Автоматически', desktop: 'Для компьютера' },
      pref,
      setView
    ),
    el(
      'p',
      { 'aria-live': 'polite' },
      (kind === 'mobile'
        ? 'Сейчас — мобильный вид'
        : kind === 'compact'
          ? 'Сейчас — компактный компьютерный вид'
          : 'Сейчас — компьютерный вид') +
        ' · ширина окна ' +
        width +
        ' px.'
    ),
    pref === 'desktop' &&
      kind === 'mobile' &&
      el(
        'p',
        null,
        'Расширьте окно хотя бы до 640 px, чтобы показать левое меню.'
      )
  );
}
const prefKey = 'zau_bible_search_v1';
const scopeNames = {
  all: 'Вся Библия',
  old: 'Ветхий Завет',
  new: 'Новый Завет',
  book: 'Текущая книга'
};
export function readFilters() {
  try {
    const f = JSON.parse(localStorage.getItem(prefKey) || '{}');
    return {
      scope: Object.hasOwn(scopeNames, f.scope) ? f.scope : 'all',
      mode: f.mode === 'phrase' ? 'phrase' : 'words'
    };
  } catch {
    return { scope: 'all', mode: 'words' };
  }
}
export function setFilterPrefs(f) {
  try {
    localStorage.setItem(prefKey, JSON.stringify(f));
  } catch {}
}
export function renderParts(parts) {
  return parts.map((p, i) =>
    p.hit ? el('mark', { className: 'zw-mark', key: i }, p.text) : p.text
  );
}
function db() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('zau-reader-library', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('editions');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function editionTx(mode, operation) {
  const conn = await db();
  try {
    return await new Promise((resolve, reject) => {
      const tx = conn.transaction('editions', mode);
      const req = operation(tx.objectStore('editions'));
      tx.oncomplete = () => resolve(req.result);
      tx.onabort = () =>
        reject(tx.error || Error('Браузер не сохранил книгу.'));
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    conn.close();
  }
}
function asBible(raw, canon) {
  const edition = parseIpb(raw, canon.books);
  return {
    ...edition.data,
    translation: edition.label,
    copyright: edition.attribution
  };
}
let builtinBook57;
async function loadBuiltin57(){if(!builtinBook57){const r=await fetch(new URL('data/ipb2015.json',document.baseURI),{credentials:'omit'});if(!r.ok)throw Error('Не загружен ИПБ 2015. Откройте сайт при наличии сети и повторите.');const b=await r.json();if(b.edition!=="BTI'15"||b.books?.length!==66)throw Error('Неверный пакет ИПБ 2015.');builtinBook57={...b,builtin:true};}return builtinBook57;}
export async function loadEdition(canon) {
  try{const raw=await editionTx('readonly',s=>s.get('kulakov'));if(raw && localStorage.getItem('zau_ipb_prefer_builtin')!=='1')return asBible(raw,canon);}catch{}
  return loadBuiltin57();
}
const button = (text, onClick, props = {}) =>
  el(
    'button',
    { type: 'button', className: 'zw-btn', onClick, ...props },
    text
  );
const choice = (label, values, selected, pick) =>
  el(
    'fieldset',
    { className: 'zw-field' },
    el('legend', null, label),
    el(
      'div',
      { className: 'zw-options' },
      ...Object.entries(values).map(([k, v]) =>
        button(v, () => pick(k), { key: k, 'aria-pressed': selected === k })
      )
    )
  );
// Nested, focus-trapped native dialog. Escape closes only the settings, not the whole reader.
function Dialog({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current,
      prior = document.activeElement;
    d.showModal();
    return () => {
      d.close();
      if (prior?.isConnected) prior.focus();
    };
  }, []);
  return el(
    'dialog',
    {
      ref,
      className: 'zw-dialog',
      'aria-label': title,
      onCancel: (e) => {
        e.preventDefault();
        onClose();
      },
      onKeyDown: (e) => {
        e.stopPropagation();
      },
      onClick: (e) => {
        if (e.target === ref.current) {
          const a = ref.current.getBoundingClientRect();
          if (
            e.clientX < a.x ||
            e.clientX > a.right ||
            e.clientY < a.y ||
            e.clientY > a.bottom
          )
            onClose();
        }
      }
    },
    el(
      'header',
      null,
      el('h2', null, title),
      button('×', onClose, {
        'aria-label': 'Закрыть настройки',
        className: 'zw-close'
      })
    ),
    el('div', { className: 'zw-dialog-body' }, children)
  );
}
export function WebPreferences({
  font,
  step,
  surface,
  setSurface,
  filters,
  changeFilter,
  canon,
  edition,
  choose,
  translation,
  onImported
}) {
  const [open, show] = useState(false),
    [message, notify] = useState(''),
    [personal57,remember57]=useState(false);
  useEffect(()=>{let live=true;if(open)editionTx('readonly',s=>s.count('kulakov')).then(n=>{if(live)remember57(n>0)}).catch(()=>{});return()=>{live=false};},[open,edition]);
  const [offline59]=useOffline();
  return el(
    React.Fragment,
    null,
    button(
      el(Gear, { className: 'h-4 w-4' }),
      () => {
        notify('');
        show(true);
      },
      {
        'aria-label': 'Настройки Библии',
        title: 'Настройки Библии',
        className: 'zw-gear'
      }
    ),
    open &&
      el(
        Dialog,
        { title: 'Настройки Библии', onClose: () => show(false) },
        el(
          'fieldset',
          { className: 'zw-field' },
          el('legend', null, 'Размер шрифта'),
          el(
            'div',
            { className: 'zw-options' },
            button('А−', () => step(-1), {
              disabled: font <= 14,
              'aria-label': 'Уменьшить шрифт'
            }),
            el('output', { 'aria-live': 'polite' }, font),
            button('А+', () => step(1), {
              disabled: font >= 26,
              'aria-label': 'Увеличить шрифт'
            })
          )
        ),
        choice(
          'Оформление',
          { ivory: 'Светлый', sepia: 'Сепия', night: 'Ночной' },
          surface,
          setSurface
        ),
        choice('Где искать', scopeNames, filters.scope, (v) =>
          changeFilter({ scope: v })
        ),
        choice(
          'Совпадение',
          { words: 'Все слова', phrase: 'Точная фраза' },
          filters.mode,
          (v) => changeFilter({ mode: v })
        ),
        el(
          'fieldset',
          { className: 'zw-field' },
          el('legend', null, 'Перевод и офлайн-библиотека'),
          el(
            'div',
            { className: 'zw-options' },
            button('Синодальный', () => choose('synodal'), {
              'aria-pressed': translation === 'synodal'
            }),
            button('ИПБ 2015 (Кулакова)', async()=>{try{const b=await loadBuiltin57();localStorage.setItem('zau_ipb_prefer_builtin','1');onImported(b);}catch(e){notify(e.message);}}, {'aria-pressed':translation==='kulakov'&&!!edition?.builtin}),
            personal57 &&
              button('ИПБ · моя редакция', async()=>{try{if(!edition?.builtin)return choose('kulakov');const raw=await editionTx('readonly',s=>s.get('kulakov')),b=asBible(raw,canon);localStorage.removeItem('zau_ipb_prefer_builtin');onImported(b);}catch(e){notify(e.message);}}, {
                'aria-pressed': translation === 'kulakov' && !edition?.builtin
              })
          ),
          el(
            'p',
            null,
            'Синодальный перевод · 66 книг · общественное достояние.'
          ),
          el(
            'p',
            null,
            'ИПБ 2015 встроен: 66 книг. При первом открытии сайт сохраняет оба перевода внутри браузера для чтения без сети. В папке «Загрузки» файлов не будет. © 2015, Институт перевода Библии в Заокском, под ред. М. П. и М. М. Кулакова. Личный JSON по-прежнему хранится только в этом браузере.'
          ),
          el('p',{role:'status'},offline59==='ready'?'Оба перевода доступны офлайн':offline59==='preparing'?'Подготовка офлайн-чтения…':'Офлайн-хранилище браузера пока недоступно.'),
          edition && el('p', null, edition.copyright)
        ),
        el('p', { role: 'status' }, message),
        button('К чтению', () => show(false), { className: 'zw-primary' })
      )
  );
}
const readyEvent = 'zau-web-offline',
  recoverEvent = 'zau-site-recovery';
let registration = null,
  activeState = 'preparing',
  waiting = null;
const signal = () => {
  window.zauOfflineState = activeState;
  window.dispatchEvent(new Event(readyEvent));
};
export async function initWebOffline() {
  signal();
  try {
    if (!('serviceWorker' in navigator)) throw Error();
    const scope = new URL('./', document.baseURI).href,
      script = new URL('sw.js', scope).href;
    const prior = await navigator.serviceWorker.getRegistration(scope);
    registration =
      prior?.scope === scope &&
      [prior.active, prior.waiting, prior.installing].some(
        (w) => w?.scriptURL === script
      )
        ? prior
        : await navigator.serviceWorker.register(script, {
            scope,
            updateViaCache: 'none'
          });
    const freshPath = new URL('open/classic/', scope).pathname;
    const explicitFresh =
      location.pathname === freshPath ||
      location.pathname === freshPath + 'index.html';
    const checked = new WeakSet();
    const adoptCurrent = async (w) => {
      if (!explicitFresh || !w || checked.has(w)) return;
      checked.add(w);
      const ch = new MessageChannel();
      try {
        const id = await new Promise((resolve) => {
          const timer = setTimeout(() => resolve(null), 1800);
          ch.port1.onmessage = (e) => {
            clearTimeout(timer);
            resolve(e.data);
          };
          w.postMessage('ZAU_SITE_STATUS', [ch.port2]);
        });
        // The user explicitly opened this release; the tab ALREADY renders its JS. Do not reload or clear any data.
        if (id === release.id && registration.waiting === w)
          w.postMessage('ZAU_APPLY');
      } finally {
        ch.port1.close();
      }
    };
    let sequence = 0;
    const verifyActive = async () => {
      const seq = ++sequence,
        worker = registration.active;
      if (!worker) return;
      const channel = new MessageChannel();
      try {
        const id = await new Promise((resolve) => {
          const timer = setTimeout(() => resolve(null), 1500);
          channel.port1.onmessage = (e) => {
            clearTimeout(timer);
            resolve(e.data);
          };
          worker.postMessage('ZAU_SITE_STATUS', [channel.port2]);
        });
        if (sequence === seq && id === release.id) {
          activeState = 'ready';
          check();
        }
      } finally {
        channel.port1.close();
      }
    };
    const check = () => {
      waiting =
        registration.waiting && registration.active
          ? registration.waiting
          : null;
      adoptCurrent(waiting).catch(() => {});
      signal();
    };
    const watch = () => {
      const worker = registration.installing;
      if (worker)
        worker.addEventListener('statechange', () => {
          if (!registration.active && worker.state === 'redundant')
            activeState = 'unavailable';
          check();
          setTimeout(check, 0);
        });
    };
    registration.addEventListener('updatefound', watch);
    watch();
    check();
    let lastProbe = 0;
    const update = () => {
      const now = Date.now();
      if (now - lastProbe > 60000) {
        lastProbe = now;
        registration.update().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) update();
    });
    window.addEventListener('online', update);
    update();
    await navigator.serviceWorker.ready;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      verifyActive().catch(() => {});
      check();
    });
    await verifyActive();
    check();
  } catch {
    activeState = 'unavailable';
    signal();
  }
}
function useOffline() {
  const [v, set] = useState(() => [activeState, waiting]);
  useEffect(() => {
    const cb = () => set([activeState, waiting]);
    cb();
    window.addEventListener(readyEvent, cb);
    return () => window.removeEventListener(readyEvent, cb);
  }, []);
  return v;
}
const release = {"id":"2026.11.18-workspace-24c8c781ff38","title":"ЗАУ Учёба · Моя группа","changes":["Учёба открывает вашу группу. ДЗ создаётся отдельной кнопкой, а новый конспект видите только вы — до выбора группы или подтверждённого потока.","Компактное расписание и раскрывающиеся сроки по дисциплине: экзамены отдельно от работ.","Перейдите к стиху по адресу, например Быт 3:16. Переводы открываются внутри Библии без скачивания файла."]};
export function WebStatus() {
  const [state] = useOffline(),
    [open, set] = useState(false);
  const name =
    state === 'ready'
      ? 'Готов к офлайн-запуску'
      : state === 'unavailable'
        ? 'Офлайн недоступен'
        : 'Готовим офлайн…';
  return el(
    React.Fragment,
    null,
    el(
      'button',
      {
        type: 'button',
        className: 'zw-status',
        onClick: () => set(true),
        title: 'Информация о сайте'
      },
      'Веб-версия · ' + name
    ),
    open &&
      el(
        Dialog,
        { title: 'Версия сайта', onClose: () => set(false) },
        el(LayoutControl),
        el('h3', null, release.title),
        el('p', null, release.id),
        el(
          'a',
          {
            className: 'zw-btn',
            target: '_blank',
            rel: 'noopener noreferrer',
            href: new URL(
              'open/classic/?build=' + encodeURIComponent(release.id),
              document.baseURI
            ).href
          },
          'Открыть свежую версию сайта'
        ),
        el('ul', null, ...release.changes.map((c) => el('li', { key: c }, c))),
        el(
          'p',
          null,
          name +
            '. При первом посещении нужен интернет. Учебные данные сохраняются после открытия соответствующих разделов.'
        )
      )
  );
}
export function WebUpdate() {
  const [, worker] = useOffline();
  if (!worker) return null;
  return el(
    'aside',
    { className: 'zw-update', role: 'status' },
    el(
      'span',
      null,
      'Загружена новая версия сайта. Сохраните изменения перед обновлением.'
    ),
    button('Обновить сейчас', () => {
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        () => location.reload(),
        {
          once: true
        }
      );
      worker.postMessage('ZAU_APPLY');
    })
  );
}
export function useRecovery(fn) {
  const current = useRef(fn);
  current.current = fn;
  useEffect(() => {
    const cb = () => current.current();
    window.addEventListener(recoverEvent, cb);
    return () => window.removeEventListener(recoverEvent, cb);
  }, []);
}
export function WebGuestLink({ api, login }) {
  const initial = new URLSearchParams(location.search).get('guest') || '';
  const [open, set] = useState(Boolean(initial)),
    [value, edit] = useState(initial),
    [err, fail] = useState(''),
    [busy, wait] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    let token = value.trim();
    try {
      const u = new URL(token);
      token = u.searchParams.get('guest') || u.searchParams.get('start') || '';
    } catch {}
    token = token.replace(/^guest_/i, '');
    if (!/^[\w-]{3,180}$/.test(token))
      return fail('Введите код приглашения или гостевую ссылку.');
    wait(true);
    fail('');
    try {
      const res = await api('/api/mobile/auth/guest-link', {
        method: 'POST',
        body: { token }
      });
      if (!res.token || !res.user) throw Error('Сервер не подтвердил вход.');
      if (initial) {
        const url = new URL(location.href);
        url.searchParams.delete('guest');
        history.replaceState(null, '', url);
      }
      login(res.token, res.user);
    } catch (e) {
      fail(e.message);
    } finally {
      wait(false);
    }
  };
  return el(
    'div',
    { className: 'zw-invite' },
    !open
      ? button('Вход по приглашению', () => set(true), {
          className: 'zw-text-button'
        })
      : el(
          'form',
          { onSubmit: submit },
          el(
            'label',
            null,
            'Гостевая ссылка или код',
            el('input', {
              value,
              onChange: (e) => edit(e.target.value),
              autoComplete: 'off',
              maxLength: 600
            })
          ),
          el(
            'div',
            { className: 'zw-options' },
            el(
              'button',
              { type: 'submit', className: 'zw-btn', disabled: busy },
              'Войти по ссылке'
            ),
            button('Отмена', () => set(false))
          ),
          err && el('p', { role: 'alert' }, err)
        )
  );
}
export function AdminReports({ api, onOpenLibrary }) {
  const [data, set] = useState(null),
    [busy, wait] = useState(false),
    [err, fail] = useState('');
  async function load(offset = 0, prior = null) {
    wait(true);
    fail('');
    try {
      const p = await api(
        '/api/mobile/admin/storage-inventory?limit=10&offset=' + offset,
        { retryOn404: true, timeoutMs: 50000 }
      );
      if (!p.telegram) throw Error('Формат отчёта не поддерживается сервером.');
      set({
        next: p.telegram.nextOffset,
        checked: (prior?.checked || 0) + p.telegram.checkedThisPage,
        bytes: (prior?.bytes || 0) + p.telegram.bytesThisPage,
        unknown: (prior?.unknown || 0) + p.telegram.unknownSizesThisPage,
        app: p.appUploads
      });
    } catch (e) {
      fail(e.message || 'Не удалось проверить файлы.');
    } finally {
      wait(false);
    }
  }
  return el(
    'section',
    { className: 'zau-card zw-card' },
    el('small', null, 'АДМИНИСТРАТОР · ТОЛЬКО ЧТЕНИЕ'),
    el('h3', null, 'Библиотека и файлы'),
    el(
      'div',
      { className: 'zw-options' },
      onOpenLibrary && button('Открыть библиотеку всех групп', onOpenLibrary),
      button('Инвентаризация файлов', () => load(), { disabled: busy })
    ),
    el(
      'div',
      { 'aria-live': 'polite' },
      err && el('p', null, err),
      data &&
        el(
          'p',
          null,
          `Telegram: проверено ${data.checked}, подтверждено ${data.bytes} Б, размер неизвестен для ${data.unknown}. Файлы приложения: ${data.app?.fileCount ?? '—'}, ${data.app?.totalBytes ?? '—'} Б. ${data.next == null ? 'Проверка завершена.' : 'Проверка частичная.'} Внешние ссылки в размер не входят.`
        ),
      Number.isInteger(data?.next) &&
        button('Следующая страница', () => load(data.next, data), {
          disabled: busy
        })
    )
  );
}
// Reads returned membership; this control never accepts a group to be added to an ACL.
export function SemesterStreams({
  semester,
  subjects,
  version,
  offline,
  indexState,
  refresh,
  select
}) {
  const latest = useRef(refresh);
  latest.current = refresh;
  useEffect(() => {
    if (offline || !indexState?.pending) return;
    let timer;
    const tick = () => {
      if (document.visibilityState === 'visible') latest.current();
    };
    timer = setInterval(tick, indexState.status === 'checking' ? 15000 : 60000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [offline, indexState?.pending, indexState?.status]);
  const shared = (subjects || []).filter((s) => s.stream),
    date = (s) =>
      String(s || '')
        .split('-')
        .reverse()
        .join('.');
  const state = offline
    ? 'Офлайн: сохранённый список.'
    : version === 0
      ? 'Сервер ещё не поддерживает потоки.'
      : indexState?.status === 'unmapped'
        ? 'В справочнике EduPage пока нет однозначного соответствия вашей группе. Личные материалы группы доступны.'
        : indexState?.status === 'unavailable'
          ? 'Часть расписания недоступна. Сохранённые подтверждения действуют; сервер повторит проверку.'
          : indexState?.pending
            ? `Идёт автоматическая сверка семестра${Number.isInteger(indexState.checked) ? ': недель с расписанием вашей группы ' + indexState.checked + ' из ' + indexState.total : ''}.`
            : null;
  return el(
    'details',
    { className: 'zau-card zw-streams' },
    el(
      'summary',
      null,
      el('span', null, 'Общие предметы потока'),
      el('small', null, `${shared.length} · ${semester} семестр`)
    ),
    el(
      'div',
      { className: 'zw-stream-body' },
      el(
        'p',
        null,
        'Состав групп определяет расписание EduPage. Задания, конспекты, литература и материалы к зачётам открываются за весь семестр, независимо от срока сдачи.'
      ),
      state && el('p', { role: 'status' }, state),
      shared.length
        ? el(
            'ul',
            null,
            ...shared.map((s) =>
              el(
                'li',
                { key: s.id },
                button(s.name, () => select(s.id), {
                  title: 'Открыть дисциплину'
                }),
                el(
                  'span',
                  null,
                  s.stream.peers
                    .map((p) => p.group + ' · ' + date(p.date))
                    .join('; ')
                )
              )
            )
          )
        : el('p', null, 'Совместных дисциплин пока не подтверждено.')
    )
  );
}

function mountDesk56(root,kind,api){
  const people=kind==='accounts'; let offset=0, seq=0, timer, dead=false, programs=[], loaded=false;
  function el(tag,txt,cls){const x=document.createElement(tag);if(txt!=null)x.textContent=txt;if(cls)x.className=cls;return x;}
  function btn(text,click,cls=''){const x=el('button',text,cls);x.type='button';x.onclick=click;return x;}
  function field(title,input){const l=el('label',null,'ad-field'),s=el('span',title);l.append(s,input);return l;}
  function sel(title,values){const x=el('select');x.setAttribute('aria-label',title);for(const [v,t] of values)x.add(new Option(t,v));return x;}
  function input(title,value=''){const x=el('input');x.value=value;x.setAttribute('aria-label',title);return x;}
  function picker(where,key,choose,empty){const holder=el('div',null,'ad-pair'),p=sel('Программа', [['',empty||'Выберите программу'],...programs.map(p=>[p.id,p.name])]),g=sel('Курс или уровень',[]),unit=field('Курс или уровень',g);let selected=programs.find(x=>x.groups.some(y=>y.key===key));p.value=selected?.id||'';
    function draw(pre){selected=programs.find(x=>x.id===p.value);g.replaceChildren();unit.hidden=!selected;if(!selected)return;unit.firstChild.textContent=selected.unit;for(const o of selected.groups)g.add(new Option(selected.unit+' '+o.n,o.key));if(selected.groups.some(o=>o.key===pre))g.value=pre;}
    draw(key);p.onchange=()=>{draw();choose(selected?g.value:'');};g.onchange=()=>choose(g.value);holder.append(field('Очная программа',p),unit);where.append(holder);return holder;}
  root.classList.add('ad-desk');root.replaceChildren();const head=el('header',null,'ad-head'),intro=el('div');intro.append(el('small','ЗАУ   /   АДМИНИСТРАТОР'),el('h2',people?'Аккаунты приложения':'Предметы'),el('p',people?'Зарегистрированные профили. Пользователи только из Telegram и временные гости сюда не входят.':'Справочник дисциплин и доступа к материалам. Архив можно восстановить.'));head.append(intro);root.append(head);
  const filter=el('div',null,'ad-filters'),search=input('Поиск');search.type='search';search.placeholder=people?'Имя, фамилия или логин':'Название предмета';search.maxLength=160;filter.append(field('Поиск',search));const pairBox=el('div');filter.append(pairBox);let group='';const state=sel('Раздел предметов',[['active','Активные'],['archive','Архив'],['all','Любое состояние']]),term=sel('Семестр',[['','Оба семестра'],['1','1 семестр'],['2','2 семестр']]);if(!people)filter.append(field('Состояние',state),field('Семестр',term));root.append(filter);search.oninput=()=>{list.replaceChildren();nav.hidden=true;count.textContent='';notice.textContent='Поиск…';clearTimeout(timer);seq++;timer=setTimeout(first,200);};state.onchange=term.onchange=first;
  const info=el('div',null,'ad-info'),count=el('strong'),notice=el('span');notice.setAttribute('role','status');info.append(count,notice,btn('Обновить',()=>load()));const list=el('div',null,'ad-list'),nav=el('div',null,'ad-nav'),prev=btn('← Назад',()=>{offset=Math.max(0,offset-30);load();}),next=btn('Далее →',()=>{offset+=30;load();});nav.append(prev,next);root.append(info,list,nav);let dialog;
  const add=btn('Добавить предмет',()=>editor(null),'ad-primary');if(!people){head.append(add);add.disabled=true;}
  function first(){offset=0;load();}
  async function load(message=''){if(dead)return;const ticket=++seq;notice.textContent='Загрузка…';list.replaceChildren();nav.hidden=true;const qs=new URLSearchParams({q:search.value,offset:String(offset)});if(group)qs.set('group',group);if(!people){qs.set('state',state.value);qs.set('semester',term.value);}try{const r=await api(kind+'?'+qs);if(dead||ticket!==seq)return;programs=r.programs;if(!loaded){picker(pairBox,'',v=>{group=v;first();},'Все программы');loaded=true;add.disabled=false;}if(!r.items.length&&offset>0){offset=Math.max(0,offset-30);return load(message);}count.textContent='Найдено: '+r.total;notice.textContent=message;list.replaceChildren();for(const item of r.items){const row=el('article',null,'ad-row'),details=el('div',null,'ad-details'),actions=el('div',null,'ad-actions');details.append(el('h3',people?item.displayName:item.name));if(people){details.append(el('p',item.login+' · '+(item.emailVerified?'Почта подтверждена':'Старый профиль')),el('span',item.groupKey||'Группа не указана','ad-tag'));}else{details.append(el('p',item.allGroups?'Все группы':item.groups.join(' · ')),el('span',item.semester+' семестр  ·  Материалов: '+item.materials+'  ·  '+item.status,'ad-tag'));}if(people&&item.protected){actions.append(el('span','Защищённый аккаунт','ad-tag'));}else {if(people||item.active)actions.append(btn('Изменить',()=>editor(item)));actions.append(people?btn('Удалить',()=>confirmAction(item,'delete'),'ad-danger'):item.active?btn('В архив',()=>confirmAction(item,'archive')):btn('Восстановить',()=>confirmAction(item,'restore'),'ad-primary'));}row.append(details,actions);list.append(row);}if(!r.items.length)list.append(el('p','Ничего не найдено. Попробуйте другой запрос или фильтр.','ad-empty'));prev.disabled=offset===0;next.disabled=r.next==null;nav.hidden=!offset&&r.next==null;}catch(err){if(!dead&&ticket===seq){list.replaceChildren();count.textContent='';notice.textContent=err.message;}}}
  function modal(title){dialog?.remove();dialog=el('dialog',null,'ad-dialog');dialog.setAttribute('aria-label',title);const f=el('form'),h=el('div',null,'ad-dialog-head'),close=btn('Закрыть',()=>dialog.close());h.append(el('h3',title),close);const errors=el('p',null,'ad-error');errors.setAttribute('role','alert');const foot=el('div',null,'ad-actions'),submit=el('button',null,'ad-primary');submit.type='submit';foot.append(btn('Отмена',()=>dialog.close()),submit);const body=el('div',null,'ad-form');f.append(h,body,errors,foot);dialog.append(f);root.append(dialog);dialog.addEventListener('close',()=>dialog?.remove(),{once:true});dialog.showModal();return {body,submit,save(fn,text){submit.textContent=text;f.onsubmit=async e=>{e.preventDefault();if(submit.disabled)return;submit.disabled=true;errors.textContent='';try{const msg=await fn();dialog.close();await load(msg);}catch(err){errors.textContent=err.message;}finally{submit.disabled=false;}};}};}
  function editor(item){const m=modal(people?'Изменить профиль':item?'Изменить предмет':'Новый предмет');if(people){const first=input('Имя',item.firstName),last=input('Фамилия',item.lastName);first.maxLength=last.maxLength=80;first.required=last.required=true;m.body.append(el('p',item.login+' · Логин, почта, пароль и права не меняются.'),field('Имя',first),field('Фамилия',last));let key=item.groupKey;picker(m.body,key,v=>key=v);m.body.append(el('p','После перевода в другую группу студент войдёт заново.'));m.save(async()=>{await api(kind+'/'+encodeURIComponent(item.id),'PATCH',{firstName:first.value,lastName:last.value,groupKey:key,revision:item.revision});return 'Профиль сохранён.';},'Сохранить профиль');}else{const name=input('Название предмета',item?.name||''),sem=sel('Семестр предмета',[['1','1 семестр'],['2','2 семестр']]),scope=sel('Видимость',[['groups','Выбранные группы'],['all','Все группы']]);name.required=true;name.maxLength=120;sem.value=String(item?.semester||term.value||1);scope.value=item?.allGroups?'all':'groups';m.body.append(field('Название предмета',name),field('Семестр',sem),field('Видимость',scope));const choices=el('div',null,'ad-form'),tags=el('div',null,'ad-actions'),keys=new Set(item?.groups||[]);let key='';picker(choices,'',v=>key=v);const put=btn('Добавить группу',()=>{if(key)keys.add(key);refresh();});choices.append(put,tags);function refresh(){tags.replaceChildren();for(const k of keys)tags.append(btn(k+' ×',()=>{keys.delete(k);refresh();},'ad-tag'));}refresh();m.body.append(choices);scope.onchange=()=>{choices.hidden=scope.value==='all';};scope.onchange();m.save(async()=>{const allGroups=scope.value==='all',groups=allGroups?[]:Array.from(keys);if(!allGroups&&!groups.length&&key)groups.push(key);if(!allGroups&&!groups.length)throw Error('Выберите очную программу и курс или уровень.');await api(kind+(item?'/'+encodeURIComponent(item.id):''),item?'PATCH':'POST',{name:name.value,semester:Number(sem.value),allGroups,groups,...item&&{revision:item.revision}});return 'Предмет сохранён.';},'Сохранить предмет');}}
  function confirmAction(item,act){const del=act==='delete',restore=act==='restore';const m=modal(del?'Удалить аккаунт':restore?'Восстановить предмет':'Перевести в архив');m.body.append(el('strong',people?item.displayName:item.name),el('p',del?'Личные данные и сессии аккаунта будут удалены безвозвратно. Общие материалы и отдельный профиль Telegram сохранятся.':restore?'Предмет и прежние материалы снова будут доступны своим группам.':'Предмет и его материалы будут скрыты от студентов. Синхронизация не вернёт их из архива.'));const check=input('Подтверждение логина');if(del){check.required=true;m.body.append(field('Введите логин: '+item.login,check));}m.save(async()=>{if(del&&check.value!==item.login)throw Error('Логин не совпадает.');await api(kind+'/'+encodeURIComponent(item.id),restore?'PATCH':'DELETE',{revision:item.revision,...del&&{confirmLogin:check.value},...restore&&{restore:true}});return del?'Аккаунт удалён.':restore?'Предмет восстановлен.':'Предмет в архиве.';},del?'Удалить безвозвратно':restore?'Подтвердить восстановление':'Подтвердить архивирование');}
  load();return ()=>{dead=true;clearTimeout(timer);dialog?.remove();root.replaceChildren();};
}

export function AccountDirectory56({api}){const root=useRef(null);useEffect(()=>mountDesk56(root.current,'accounts',(path,method='GET',body)=>api('/api/mobile/admin/'+path,{method,retryTransport:false,...body&&{body}})),[api]);return el('div',{ref:root});}

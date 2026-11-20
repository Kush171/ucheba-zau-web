import { d as React, Ng as Gear } from './runtime-0ef486abf046.js';
import { searchVerses, highlightedParts, tokens, parseIpb, LIMIT } from './bible-tools-3722994372e4.js';
export { searchVerses, highlightedParts, tokens };
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
  const read = () => [preference, document.documentElement.dataset.zauLayout, innerWidth];
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
    choice('Вид сайта', { auto: 'Автоматически', desktop: 'Для компьютера' }, pref, setView),
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
      el('p', null, 'Расширьте окно хотя бы до 640 px, чтобы показать левое меню.')
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
      tx.onabort = () => reject(tx.error || Error('Браузер не сохранил книгу.'));
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    conn.close();
  }
}
function asBible(raw, canon) {
  const edition = parseIpb(raw, canon.books);
  return { ...edition.data, translation: edition.label, copyright: edition.attribution };
}
export async function loadEdition(canon) {
  const raw = await editionTx('readonly', (s) => s.get('kulakov'));
  return raw ? asBible(raw, canon) : null;
}
export async function importEdition(file, canon) {
  if (!canon) throw Error('Дождитесь загрузки Синодального перевода.');
  if (!file || file.size > LIMIT) throw Error('Выберите JSON не больше 20 МБ.');
  const raw = await file.text();
  const bible = asBible(raw, canon);
  await editionTx('readwrite', (s) => s.put(raw, 'kulakov'));
  return bible;
}
export function downloadSynodal(canon) {
  if (!canon) return;
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(canon)], { type: 'application/json;charset=utf-8' })
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ZAU-Synodal.json';
  document.body.append(a);
  try {
    a.click();
  } finally {
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
}
const button = (text, onClick, props = {}) =>
  el('button', { type: 'button', className: 'zw-btn', onClick, ...props }, text);
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
          if (e.clientX < a.x || e.clientX > a.right || e.clientY < a.y || e.clientY > a.bottom)
            onClose();
        }
      }
    },
    el(
      'header',
      null,
      el('h2', null, title),
      button('×', onClose, { 'aria-label': 'Закрыть настройки', className: 'zw-close' })
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
    [busy, wait] = useState(false);
  const input = useRef(null);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || busy) return;
    wait(true);
    notify('');
    try {
      const b = await importEdition(file, canon);
      onImported(b);
      notify('ИПБ сохранён на этом устройстве.');
    } catch (err) {
      notify(err.message || 'Не удалось сохранить файл. Предыдущая копия не изменена.');
    } finally {
      wait(false);
    }
  };
  return el(
    React.Fragment,
    null,
    button(
      el(Gear, { className: 'h-4 w-4' }),
      () => {
        notify('');
        show(true);
      },
      { 'aria-label': 'Настройки Библии', title: 'Настройки Библии', className: 'zw-gear' }
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
            button('А−', () => step(-1), { disabled: font <= 14, 'aria-label': 'Уменьшить шрифт' }),
            el('output', { 'aria-live': 'polite' }, font),
            button('А+', () => step(1), { disabled: font >= 26, 'aria-label': 'Увеличить шрифт' })
          )
        ),
        choice(
          'Оформление',
          { ivory: 'Светлый', sepia: 'Сепия', night: 'Ночной' },
          surface,
          setSurface
        ),
        choice('Где искать', scopeNames, filters.scope, (v) => changeFilter({ scope: v })),
        choice('Совпадение', { words: 'Все слова', phrase: 'Точная фраза' }, filters.mode, (v) =>
          changeFilter({ mode: v })
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
            edition &&
              button('ИПБ (Кулакова)', () => choose('kulakov'), {
                'aria-pressed': translation === 'kulakov'
              })
          ),
          el('p', null, 'Синодальный перевод · 66 книг · общественное достояние.'),
          el(
            'div',
            { className: 'zw-options' },
            button('Скачать Синодальный · JSON', () => downloadSynodal(canon), {
              disabled: !canon
            }),
            el(
              'a',
              {
                className: 'zw-btn',
                href: 'https://www.bible.com/ru/versions/313-bti-bibliya-pod-red-m-dot-p-kulakova-i-m-dot-m-kulakova',
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              'ИПБ в YouVersion ↗'
            )
          ),
          el(
            'p',
            null,
            'Полный текст ИПБ не входит в сайт. Свой разрешённый JSON можно сохранить в этом браузере. Он не отправляется на сервер.'
          ),
          el('input', {
            type: 'file',
            accept: '.json,application/json',
            ref: input,
            hidden: true,
            onChange: upload
          }),
          button(
            busy ? 'Сохраняем…' : edition ? 'Заменить файл ИПБ' : 'Загрузить файл ИПБ',
            () => input.current?.click(),
            { disabled: busy || !canon }
          ),
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
      [prior.active, prior.waiting, prior.installing].some((w) => w?.scriptURL === script)
        ? prior
        : await navigator.serviceWorker.register(script, { scope, updateViaCache: 'none' });
    const freshPath = new URL('open/classic/', scope).pathname;
    const explicitFresh =
      location.pathname === freshPath || location.pathname === freshPath + 'index.html';
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
        if (id === release.id && registration.waiting === w) w.postMessage('ZAU_APPLY');
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
      waiting = registration.waiting && registration.active ? registration.waiting : null;
      adoptCurrent(waiting).catch(() => {});
      signal();
    };
    const watch = () => {
      const worker = registration.installing;
      if (worker)
        worker.addEventListener('statechange', () => {
          if (!registration.active && worker.state === 'redundant') activeState = 'unavailable';
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
const release = {"id":"2026.11.18-account-7408e4713ef2","title":"ЗАУ Учёба · Почта и профиль","changes":["Для нового аккаунта нужны почта, код из письма, имя и фамилия. Почта служит логином.","Уже зарегистрированы? Войдите как раньше. В профиле видно, какие поля осталось заполнить.","Прогресс, записи, связь с Telegram и доступ к общим предметам остаются у того же аккаунта."]};
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
            href: new URL('open/classic/?build=' + encodeURIComponent(release.id), document.baseURI)
              .href
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
    el('span', null, 'Загружена новая версия сайта. Сохраните изменения перед обновлением.'),
    button('Обновить сейчас', () => {
      navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), {
        once: true
      });
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
    if (!/^[\w-]{3,180}$/.test(token)) return fail('Введите код приглашения или гостевую ссылку.');
    wait(true);
    fail('');
    try {
      const res = await api('/api/mobile/auth/guest-link', { method: 'POST', body: { token } });
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
      ? button('Вход по приглашению', () => set(true), { className: 'zw-text-button' })
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
const reasons = {
  insufficient_evidence: 'Недостаточно данных о преподавателе или времени пары',
  matched: 'Общая пара подтверждена',
  no_peer_match: 'В проверенных группах совпадения нет',
  source_lesson_absent: 'В исходной группе нет занятия на эту дату',
  schedule_unavailable: 'Расписание EduPage недоступно. Попробуйте позже',
  partial: 'Часть расписаний недоступна: проверка неполная',
  group_unmapped: 'Нет класса этой группы в справочнике EduPage',
  no_peer_schedules: 'Нет расписаний других групп для сравнения',
  invalid_context: 'Проверьте группу и дату самого занятия'
};
const today = () => new Date(Date.now() + 10800000).toISOString().slice(0, 10);
export function SharedPair({ api, group }) {
  const [name, edit] = useState('Русский'),
    [date, when] = useState(today),
    [busy, wait] = useState(false),
    [r, set] = useState(null),
    [e, fail] = useState('');
  const check = async (dt) => {
    when(dt);
    wait(true);
    set(null);
    fail('');
    try {
      const res = await api(
        '/api/mobile/shared-lesson?' +
          new URLSearchParams({ subject: name.trim(), date: dt, groupKey: group }),
        { retryOn404: true, timeoutMs: 45000 }
      );
      if (!res.status) throw Error('Сервер пока не поддерживает проверку общих пар.');
      set(res);
    } catch (err) {
      fail(
        err.status === 404 ? 'На действующем сервере эта проверка ещё не доступна.' : err.message
      );
    } finally {
      wait(false);
    }
  };
  return el(
    'section',
    { className: 'zau-card zw-card', 'aria-label': 'Общая ли пара?' },
    el('small', null, 'УЧЕБНОЕ РАСПИСАНИЕ'),
    el('h3', null, 'Общая ли пара?'),
    el(
      'p',
      null,
      'Группа: ' + (group || 'не выбрана') + '. Укажите дату занятия, а не срок сдачи. Доступ к материалам за семестр показан в «Учёба → Общие предметы потока».'
    ),
    el(
      'form',
      {
        onSubmit: (ev) => {
          ev.preventDefault();
          check(date);
        }
      },
      el(
        'label',
        null,
        'Предмет',
        el('input', {
          value: name,
          maxLength: 140,
          required: true,
          disabled: busy,
          onChange: (ev) => {
            edit(ev.target.value);
            set(null);
            fail('');
          }
        })
      ),
      el(
        'label',
        null,
        'Дата занятия',
        el('input', {
          type: 'date',
          value: date,
          required: true,
          disabled: busy,
          onChange: (ev) => {
            when(ev.target.value);
            set(null);
            fail('');
          }
        })
      ),
      el(
        'button',
        {
          className: 'zw-primary',
          type: 'submit',
          disabled: busy || !group || group === 'ALL' || !name.trim() || !date
        },
        busy ? 'Проверяем…' : 'Сверить с EduPage'
      )
    ),
    el(
      'div',
      { 'aria-live': 'polite' },
      e && el('p', null, e),
      r &&
        el(
          React.Fragment,
          null,
          el('strong', null, reasons[r.status] || 'Сервер не подтвердил результат'),
          ...(r.peers || []).map((p, i) =>
            el(
              'p',
              { key: 'p' + i },
              p.group +
                ' · ' +
                p.subject +
                ' · ' +
                (p.start || `пара ${p.period}`) +
                (p.end ? ' – ' + p.end : '') +
                ' · ' +
                (p.proof === 'classids' ? 'общая карточка EduPage' : (p.teachers || []).join(', '))
            )
          ),
          r.otherDates?.length > 0 && el('p', null, 'Предмет есть в другие дни этой недели:'),
          ...(r.otherDates || []).map((dt) =>
            button(dt, () => check(dt), { key: dt, disabled: busy })
          ),
          r.missing?.length > 0 && el('p', null, 'Не ответили: ' + r.missing.join(', ')),
          r.unmapped?.length > 0 && el('p', null, 'Нет сопоставления: ' + r.unmapped.join(', '))
        )
    )
  );
}
export function AdminReports({ api }) {
  const [busy, wait] = useState(false),
    [data, set] = useState(null),
    [err, fail] = useState('');
  const run = async (kind, offset = 0, prior = null) => {
    wait(true);
    fail('');
    try {
      const storage = kind === 'storage',
        p = await api(
          '/api/mobile/admin/' +
            (storage ? 'storage-inventory?limit=10' : 'homework-sharing-preview?limit=3') +
            '&offset=' +
            offset,
          { retryOn404: true, timeoutMs: 50000 }
        );
      if ((storage && !p.telegram) || (!storage && !Array.isArray(p.results)))
        throw Error('Формат отчёта не поддерживается сервером.');
      set({
        kind,
        next: storage ? p.telegram.nextOffset : p.nextOffset,
        bytes: (prior?.bytes || 0) + (p.telegram?.bytesThisPage || 0),
        checked: (prior?.checked || 0) + (p.telegram?.checkedThisPage || 0),
        unknown: (prior?.unknown || 0) + (p.telegram?.unknownSizesThisPage || 0),
        page: p
      });
    } catch (e) {
      fail(e.status === 404 ? 'На действующем сервере отчёт ещё не доступен.' : e.message);
    } finally {
      wait(false);
    }
  };
  return el(
    'section',
    { className: 'zau-card zw-card' },
    el('small', null, 'АДМИНИСТРАТОР · ТОЛЬКО ЧТЕНИЕ'),
    el('h3', null, 'Предварительные отчёты'),
    el(
      'div',
      { className: 'zw-options' },
      button('Проверить общие ДЗ', () => run('sharing'), { disabled: busy }),
      button('Инвентаризация файлов', () => run('storage'), { disabled: busy })
    ),
    el(
      'div',
      { 'aria-live': 'polite' },
      err && el('p', null, err),
      data &&
        (data.kind === 'storage'
          ? el(
              'p',
              null,
              `Telegram: проверено ${data.checked}, подтверждено ${data.bytes} Б, размер неизвестен для ${data.unknown}. Файлы приложения: ${data.page.appUploads?.fileCount ?? '—'}, ${data.page.appUploads?.totalBytes ?? '—'} Б. ${data.page.telegram.nextOffset == null ? 'Проверка завершена.' : 'Проверка частичная.'} Внешние ссылки в размер не входят.`
            )
          : el(
              React.Fragment,
              null,
              el(
                'p',
                null,
                `Обработано ${data.page.processed} из ${data.page.total}; расхождений со старой отметкой ДЗ: ${data.page.wouldChange}. Это сверка отдельной пары, не список доступа потока. Ничего не записано.`
              ),
              ...data.page.results.map((r, i) =>
                el(
                  'p',
                  { key: i },
                  `${r.subject} · ${r.date || 'без срока'}${r.detail?.date && r.detail.date !== r.date ? ' (пара ' + r.detail.date + ')' : ''} · ${r.sourceGroup}: ${r.wouldAddGroups?.length ? 'кандидаты — ' + r.wouldAddGroups.join(', ') : r.status === 'already_current' ? 'отметка записи: ' + (r.alreadySharedGroups || []).join(', ') : reasons[r.status] || 'недостаточно данных'}${r.detail?.otherDates?.length ? ' · Другие даты: ' + r.detail.otherDates.join(', ') : ''}`
                )
              )
            )),
      Number.isInteger(data?.next) &&
        button('Следующая страница', () => run(data.kind, data.next, data), { disabled: busy })
    )
  );
}

// Reads returned membership; this control never accepts a group to be added to an ACL.
export function SemesterStreams({api,group,semester,subjects,version,offline,refresh,select}){
 const [data,set]=useState(null),[date,when]=useState(today),[busy,wait]=useState(false),[err,fail]=useState('');
 const serial=useRef(0),latest=useRef(refresh);latest.current=refresh;
 const path='/api/mobile/subject-streams',query='?'+new URLSearchParams({groupKey:group});
 const valid=r=>r?.streamVersion===1 && r.groupKey===group && Number(r.semester)===Number(semester);
 async function check(dt,seq){wait(true);fail('');try{
   const r=await api(path+'/refresh'+query,{method:'POST',body:{date:dt},retryTransport:false,timeoutMs:52000,validateResponse:valid});if(seq!==serial.current)return;set(r);await latest.current();
 }catch(e){if(seq===serial.current)fail(e.message||'Не удалось связаться с расписанием.');}finally{if(seq===serial.current)wait(false);}}
 useEffect(()=>{const seq=++serial.current;if(version!==1||offline){wait(false);return;}
 (async()=>{try{const r=await api(path+query,{validateResponse:valid});if(seq!==serial.current)return;set(r);when(r.today);fail('');
 // First visit after deployment: don't make students wait for the first cron sweep. A D1 lease deduplicates this across viewers.
 if(!r.history?.some(h=>h.week===r.week))await check(r.today,seq);
 }catch(e){if(seq===serial.current)fail(e.message||'Не удалось загрузить подтверждения.');}})();return ()=>{serial.current++;};},[group,semester,version,offline]);
 const shared=(subjects||[]).filter(s=>s.stream),last=data?.scan || data?.history?.find(h=>h.week===data.week),datestr=s=>typeof s==='string'?s.split('-').reverse().join('.'):'',
 status=last?.status==='checking'?'Проверка уже выполняется.':last?.status==='unavailable'?'EduPage не дал достаточно данных для этой недели.':last?.unmapped?.includes(group)?'Группа не определена в справочнике этой недели.':last?.missing?.includes(group)?'Не удалось прочитать расписание вашей группы.':last?.status==='partial'?'Проверена часть расписаний.':'Неделя сверена.';
 return el('details',{className:'zau-card zw-streams'},el('summary',null,el('span',null,'Общие предметы потока'),el('small',null,version===1?`${shared.length} · ${semester} семестр`:'EduPage')),
 el('div',{className:'zw-stream-body'},el('p',null,'Одна запись для групп, у которых EduPage подтвердил совместное занятие. Общие ДЗ, конспекты, литература и материалы к зачётам видны весь семестр. Отметка «выполнено» и напоминания остаются вашими.'),
 shared.length>0&&el('ul',null,...shared.map(s=>el('li',{key:s.id},button(s.name,()=>select(s.id),{title:'Открыть дисциплину'}),el('span',null,s.stream.peers.map(p=>p.group+' · '+datestr(p.date)+(p.start?' '+p.start:p.period?' · пара '+p.period:'')).join('; '))))),
 offline?el('p',null,'Офлайн: показана сохранённая информация. Для сверки нужен интернет.'):version===0?el('p',{role:'status'},'Сервер ещё не поддерживает общие потоки. Нужен выпуск Worker, а не только сайта.'):version!==1?el('p',null,'Ожидаем ответ сервера…'):
 el(React.Fragment,null,!shared.length&&el('p',null,busy?'Сверяем группы с EduPage…':'Пока нет подтверждённого общего предмета в вашем каталоге.'),el('form',{onSubmit:e=>{e.preventDefault();if(!busy)check(date,++serial.current);}},el('label',null,'Дата учебной недели',el('input',{type:'date',required:true,value:date,onChange:e=>when(e.target.value),max:data?.today||today(),disabled:busy})),el('button',{type:'submit',className:'zw-btn',disabled:busy||!date},busy?'Проверяем…':'Сверить неделю с EduPage')),el('small',null,'Выберите неделю, когда группы учились вместе, даже если срок сдачи был позже. Расписание также проверяется автоматически.'),last&&el('p',{role:'status'},'Неделя с '+datestr(last.week)+'. '+status),err&&el('p',{role:'alert'},err))));
}

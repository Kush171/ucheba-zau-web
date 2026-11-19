// Original ZAU web cabinet, recovered from the retained production export.
// The presentation, layout and interactions below are the website itself, not Expo.
import {
  ig,
  cg,
  $h,
  ir,
  rg,
  Jh,
  Ih,
  cr,
  og,
  ma,
  vi,
  Wh,
  Ph,
  d,
  Pu,
  ug,
  xa,
  nd,
  Kt,
  ot,
  eb,
  dg,
  fg,
  Ni,
  sd,
  tb,
  rr,
  gi,
  wh,
  xg,
  lb,
  or,
  ur,
  id,
  dr,
  vn,
  cd,
  mg,
  hg,
  rd,
  hs,
  bn,
  bg,
  Ch,
  pg,
  gg,
  yg,
  vg,
  ab,
  Pc,
  fr,
  qu,
  nb,
  sb,
  od,
  ib,
  cb,
  ud,
  Ng,
  ji,
  ed,
  jg,
  rb,
  Eg,
  wg,
  Cg,
  Ag,
  ob,
  Sg,
  Fg,
  Dg,
  Bg,
  Tg,
  ub,
  zg,
  _g,
  Og,
  Mg,
  Rg,
  Ug,
  n,
  Xg,
} from "./runtime-0ef486abf046.js";
import {
  WebPreferences,
  WebStatus,
  WebUpdate,
  SharedPair,
  AdminReports,
  WebGuestLink,
  renderParts,
  useRecovery,
  initWebOffline,
  searchVerses,
  highlightedParts,
  tokens,
  loadEdition,
  importEdition,
  readFilters,
  setFilterPrefs,
  downloadSynodal,
} from "./web-tools-90ef5c23fa63.js";
const Xu = "https://functions.yandexcloud.net/d4e420kmoeiiken0fgci",
  er = "https://ucheba-zau-bot.zauucheba.workers.dev",
  db = [
    {
      id: "theology",
      name: "Теология",
      subtitle: "Протестантская теология и библейские исследования",
      category: "Бакалавриат",
      courses: [1, 2, 3, 4],
    },
    {
      id: "english",
      name: "Учитель английского",
      subtitle: "Лингвистика и преподавание английского языка",
      category: "Бакалавриат",
      courses: [1, 2, 3, 4],
    },
    {
      id: "primary",
      name: "Начальное образование",
      subtitle: "Педагогическое образование • Начальные классы",
      category: "Бакалавриат",
      courses: [1, 2, 3, 4],
    },
    {
      id: "music",
      name: "Учитель музыки",
      subtitle: "Музыкальное и педагогическое образование",
      category: "Бакалавриат",
      courses: [1, 2, 3, 4],
    },
    {
      id: "economics",
      name: "Международная экономика",
      subtitle: "Экономика, финансы и управление",
      category: "Бакалавриат",
      courses: [1, 2, 3, 4],
    },
  ];
function fb(r) {
  const m = new Map(
    (Array.isArray(r) ? r : [])
      .filter((x) => x && typeof x.name == "string")
      .map((x) => [x.name, x]),
  );
  return db.map((x) => {
    const u = m.get(x.name) || {};
    return {
      ...x,
      ...u,
      id: x.id,
      name: x.name,
      courses: Array.isArray(u.courses) && u.courses.length ? u.courses : x.courses,
    };
  });
}
function xb(r) {
  return fb(r).flatMap((x) =>
    (x.courses || [1, 2, 3, 4]).map((u) => ({
      groupKey: u === 1 ? x.name : `${x.name} • ${u} курс`,
      label: `${x.name} • ${u} курс`,
      course: u,
      direction: x,
    })),
  );
}
function fs(r = new Date()) {
  try {
    const m = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Moscow",
        month: "numeric",
      }).formatToParts(r),
      x = Number(m.find((u) => u.type === "month")?.value || r.getMonth() + 1);
    return x >= 2 && x <= 8 ? 2 : 1;
  } catch {
    const m = r.getMonth() + 1;
    return m >= 2 && m <= 8 ? 2 : 1;
  }
}
const Zg = {},
  tr = "zau_web_backend_mode_v1",
  Vg = "zau_custom_api_url_v1",
  $g = "zau_offline_cache_v3:";
function nr(r) {
  return r === "local" ? "zau_local_token_v1" : "zau_auth_token_v1";
}
function dd(r) {
  return r === "local" ? "zau_local_user_v1" : "zau_auth_user_v1";
}
let sessionGeneration = 0,
  apiHadFailure = false,
  lastRecovery = 0;
function recovered() {
  const now = Date.now();
  if (now - lastRecovery > 1000) {
    lastRecovery = now;
    window.dispatchEvent(new Event("zau-site-recovery"));
  }
}
let Et = "cloud",
  Xl = "",
  td = "",
  xr = "public",
  sr = "",
  Jg = "";
function fd(r) {
  const m = r?.accountId || r?.effectiveUserId || r?.login || "",
    x = m ? encodeURIComponent(String(m)) : "public";
  return `${Et}_${x}`;
}
function mb(r) {
  return `${$g}${xr}:${r}`;
}
function Ig() {
  return Et;
}
function Wg() {
  try {
    const m = (
      typeof window < "u" ? new URLSearchParams(window.location.search) : null
    )?.get("backendMode");
    if (m === "local" || m === "cloud") ((Et = m), localStorage.setItem(tr, m));
    else if (localStorage.getItem(tr) === "local") {
      const F = localStorage.getItem(nr("local")) || "";
      ((Et = F ? "local" : "cloud"), F || localStorage.setItem(tr, "cloud"));
    } else Et = "cloud";
    ((td = localStorage.getItem(Vg) || ""), (Xl = localStorage.getItem(nr(Et)) || ""));
    const x = localStorage.getItem(dd(Et)),
      u = x ? JSON.parse(x) : null;
    return ((xr = fd(u)), { token: Xl, user: u, mode: Et });
  } catch {
    return { token: "", user: null, mode: "cloud" };
  }
}
function Zu(r, m) {
  if (Xl !== (r || "") || xr !== fd(m)) sessionGeneration++;
  ((Xl = r || ""), (xr = fd(m)));
  try {
    const x = nr(Et),
      u = dd(Et);
    (Xl ? localStorage.setItem(x, Xl) : localStorage.removeItem(x),
      m ? localStorage.setItem(u, JSON.stringify(m)) : localStorage.removeItem(u));
  } catch {}
}
function purgeStudy(r, scope) {
  if (!scope || scope.endsWith("_public")) return;
  try {
    const prefixes = [$g + scope + ":"];
    if (r === "cloud") prefixes.push("zau_offline_cache_v2:" + scope.slice(6) + ":");
    for (const k of Object.keys(localStorage))
      if (prefixes.some((p) => k.startsWith(p))) localStorage.removeItem(k);
  } catch {}
}
function zh() {
  const mode = Et,
    scope = xr;
  sessionGeneration++;
  Xl = "";
  sr = "";
  Et = "cloud";
  xr = fd(null);
  try {
    localStorage.removeItem(nr(mode));
    localStorage.removeItem(dd(mode));
    localStorage.setItem(tr, "cloud");
  } catch {}
  purgeStudy(mode, scope);
}
function sameSession(epoch, token, mode) {
  if (epoch !== sessionGeneration || mode !== Et || token !== Xl) return false;
  try {
    return (localStorage.getItem(nr(mode)) || "") === token;
  } catch {
    return true;
  }
}
function xd() {
  const r = typeof window < "u" ? window.location.origin : "";
  if (Et === "local") return [r].filter(Boolean);
  if (Et === "custom" && td)
    return [td, r, Xu, er].filter((F, M, B) => !!F && B.indexOf(F) === M);
  // The public installation is static. Never send a cloud credential to the Pages host.
  // A separate self-hosted local backend retains its original origin and storage keys.
  // Keep the original public site’s RU gateway first, with its existing Worker as fallback.
  return [Xu, er];
}
function md(r, m) {
  const x = String(r || "").replace(/\/+$/, ""),
    u = m.startsWith("/") ? m : `/${m}`;
  if (x.includes("functions.yandexcloud.net")) {
    const p = u.indexOf("?"),
      F = p >= 0 ? u.slice(0, p) : u,
      M = p >= 0 ? u.slice(p + 1) : "",
      B = x.includes("?") ? "&" : "?";
    return `${x}${B}_path=${encodeURIComponent(F)}${M ? `&${M}` : ""}`;
  }
  return `${x}${u}`;
}
function previousCacheKey(r) {
  if (!r || !Xl || Et !== "cloud" || !xr.startsWith("cloud_") || xr === "cloud_public")
    return null;
  const old = r
    .replace(/^dash_web_v1_/, "dash_scope_v6_")
    .replace(/^sched_web_v1_/, "sched_scope_v4_")
    .replace(/^entries_web_v1_/, "entries_scope_v6_")
    .replace(/^reminders_web_v1_/, "reminders_");
  return old === r
    ? null
    : "zau_offline_cache_v2:" +
        xr.slice(6) +
        ":" +
        (r.startsWith("sched_web_v1_") ? old.replace(/_current$/, "_cur") : old);
}
function gs(r) {
  if (!r) return null;
  try {
    let m = localStorage.getItem(mb(r));
    // One-way compatible fallback to the preceding PWA, for this cloud account only.
    const previous = previousCacheKey(r);
    if (!m && previous) m = localStorage.getItem(previous);
    if (!m) return null;
    const x = JSON.parse(m);
    return !x || !x.data || typeof x.data != "object"
      ? null
      : { ...x.data, _offline: !0, _cachedAt: Number(x.savedAt) || 0 };
  } catch {
    return null;
  }
}
async function Pg(r, m, x) {
  const u = new AbortController(),
    p = setTimeout(() => u.abort(), x);
  try {
    const response = await fetch(r, {
      ...m,
      signal: u.signal,
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });
    return [response, await response.text()];
  } finally {
    clearTimeout(p);
  }
}
async function be(r, m = {}) {
  const {
      method: x = "GET",
      body: u = null,
      cacheKey: p = "",
      retryOn403: F = !1,
      retryOn404: M = !1,
      retryTransport: B = !0,
      timeoutMs: q = 15e3,
      validateResponse: J,
    } = m,
    epoch = sessionGeneration,
    tokenAtStart = Xl,
    modeAtStart = Et,
    accountCache = p ? mb(p) : "",
    ae = xd(),
    G = [ae.includes(sr) ? sr : ae[0], ...ae].filter(
      (H, R, Z) => !!H && Z.indexOf(H) === R,
    ),
    L = typeof window < "u" ? window.location.origin : "";
  let Q = null,
    X = null;
  for (const H of G)
    try {
      const R = { Accept: "application/json" };
      if (!sameSession(epoch, tokenAtStart, modeAtStart))
        throw Error("Аккаунт изменился.");
      (tokenAtStart && (R.Authorization = `Bearer ${tokenAtStart}`),
        u != null && (R["Content-Type"] = "application/json"),
        H === L && (R["X-Zau-Backend-Mode"] = Et === "local" ? "local" : "cloud"));
      const Z = md(H, r),
        [ie, Y] = await Pg(
          Z,
          {
            method: x,
            headers: R,
            body: u != null ? JSON.stringify(u) : void 0,
          },
          q,
        );
      if (!sameSession(epoch, tokenAtStart, modeAtStart))
        throw Error("Аккаунт изменился.");
      let ne = {},
        me = !1;
      try {
        ((ne = Y ? JSON.parse(Y) : {}), (me = !!(Y && ne && typeof ne == "object")));
      } catch {}
      if (!me && (ie.ok || (H === L && Et !== "local"))) {
        const re = new Error("Статический хостинг без серверного прокси");
        throw ((re.status = 502), (re.isApiResponse = !1), re);
      }
      if (!ie.ok || ne?.ok === !1) {
        const re = new Error(ne?.error || `Ошибка сервера (${ie.status})`);
        throw (
          (re.status = ie.status),
          (re.code = ne?.code || (ie.status === 403 ? "HTTP_403" : "")),
          (re.endpoint = H),
          (re.isApiResponse =
            me &&
            ne?.ok === !1 &&
            typeof ne?.error == "string" &&
            typeof ne?.code == "string"),
          re
        );
      }
      if (typeof J == "function" && !J(ne)) {
        const re = new Error(
          "Сервер вернул данные для другой группы или устаревшей версии API.",
        );
        throw (
          (re.status = 502),
          (re.code = "RESPONSE_CONTEXT_MISMATCH"),
          (re.endpoint = H),
          (re.isApiResponse = !1),
          re
        );
      }
      if (
        ((sr = H),
        (Jg = ie.headers.get("x-zau-served-by") || new URL(H).host),
        x === "GET" && p)
      )
        try {
          localStorage.setItem(
            accountCache,
            JSON.stringify({ savedAt: Date.now(), data: ne }),
          );
        } catch {}
      if (apiHadFailure) {
        apiHadFailure = false;
        queueMicrotask(recovered);
      }
      return { ...ne, _offline: !1 };
    } catch (R) {
      if (!sameSession(epoch, tokenAtStart, modeAtStart))
        throw Error("Аккаунт изменился.");
      const Z = R instanceof Error ? R : new Error(String(R));
      if (Z.name === "AbortError") {
        const err = new Error("Сервер не ответил вовремя.");
        err.name = "TimeoutError";
        R = err;
      }
      if (accountCache && Z.isApiResponse && [401, 403].includes(Z.status)) {
        try {
          localStorage.removeItem(accountCache);
          const prev = previousCacheKey(p);
          if (prev) localStorage.removeItem(prev);
        } catch {}
      }
      if (
        ((Q = Z.name === "AbortError" ? R : Z), (x === "GET" || F) && Z.status === 403)
      ) {
        if (Z.isApiResponse) {
          X = Z;
          break;
        }
        if (B) continue;
        break;
      }
      if (M && (Z.status === 404 || Z.code === "NOT_FOUND")) continue;
      if (Z.status && Z.status >= 400 && Z.status < 500) throw Z;
      if (!B || x !== "GET") break;
    }
  if (!sameSession(epoch, tokenAtStart, modeAtStart)) throw Error("Аккаунт изменился.");
  if (X) throw X;
  if (!Q?.isApiResponse) apiHadFailure = true;
  if (x === "GET" && p) {
    const H = gs(p);
    if (H && (typeof J !== "function" || J(H)) && Q?.code !== "RESPONSE_CONTEXT_MISMATCH")
      return H;
  }
  throw (
    Q ||
    new Error(
      "Не удалось подключиться к серверу ЗАУ. Проверьте интернет или настройки подключения.",
    )
  );
}
function _h(r, m = "notes", x = "") {
  const u = sr || xd()[0] || "",
    p = typeof window < "u" ? window.location.origin : "",
    F = new URLSearchParams({
      collection: m,
      token: Xl,
      ...(x ? { groupKey: x } : {}),
      ...(u === p && Et === "local" ? { backendMode: "local" } : {}),
    }).toString();
  return md(u, `/api/mobile/entries/${encodeURIComponent(r)}/docx?${F}`);
}
function Oh(r, m = "") {
  const x = sr || xd()[0] || "",
    u = typeof window < "u" ? window.location.origin : "",
    p = new URLSearchParams({
      token: Xl,
      ...(m ? { groupKey: m } : {}),
      ...(x === u && Et === "local" ? { backendMode: "local" } : {}),
    }).toString();
  return md(x, `/api/mobile/lectures/${encodeURIComponent(r)}/docx?${p}`);
}
function hb() {
  return Et === "local" && typeof window < "u"
    ? `${window.location.origin}/admin`
    : `${er}/admin`;
}
function Pe(r, m) {
  const x = String(r || "")
      .trim()
      .slice(0, 64),
    u = String(m || "")
      .trim()
      .slice(0, 80);
  !x ||
    !u ||
    be("/api/mobile/activity", {
      method: "POST",
      retryTransport: !1,
      timeoutMs: 8e3,
      body: { screen: x, action: u, platform: "web" },
    }).catch(() => {});
}
function bs({ size: r = 48, variant: m = "light", className: x = "" }) {
  const u = m === "light",
    p = u ? "#FFFFFF" : "#93161B",
    F = u ? "#FAF8F5" : "#16161A",
    M = u ? "#F0C274" : "#B88946",
    B = u ? "#6B0D12" : "#FFFFFF";
  return n.jsxs("svg", {
    width: r,
    height: r,
    viewBox: "0 0 100 100",
    fill: "none",
    "aria-hidden": "true",
    className: `shrink-0 select-none ${x}`,
    children: [
      n.jsx("path", { d: "M46 18 L50 9.5 L54 18 L54 25 L46 25 Z", fill: p }),
      n.jsx("path", { d: "M32.5 34 L50 19.5 L67.5 34 Z", fill: p }),
      n.jsx("rect", {
        x: "18",
        y: "34",
        width: "64",
        height: "31",
        rx: "2.2",
        fill: p,
      }),
      n.jsx("path", { d: "M23 65 V44 A4.5 4.5 0 0 1 32 44 V65 Z", fill: B }),
      n.jsx("path", { d: "M35.5 65 V46 A4 4 0 0 1 43.5 46 V65 Z", fill: B }),
      n.jsx("path", { d: "M46 65 V45 A4 4 0 0 1 54 45 V65 Z", fill: B }),
      n.jsx("path", { d: "M56.5 65 V46 A4 4 0 0 1 64.5 46 V65 Z", fill: B }),
      n.jsx("path", { d: "M68 65 V44 A4.5 4.5 0 0 1 77 44 V65 Z", fill: B }),
      n.jsx("path", {
        d: "M14 73 Q32 63 50 72 Q68 63 86 73",
        stroke: F,
        strokeWidth: "4.2",
        strokeLinecap: "round",
        fill: "none",
      }),
      n.jsx("path", {
        d: "M12 78.5 L88 78.5",
        stroke: F,
        strokeWidth: "3.2",
        strokeLinecap: "round",
      }),
      n.jsx("path", {
        d: "M35 71 L42 70 L39 87.5 L35.5 84 L32 87.5 Z",
        fill: M,
      }),
      n.jsx("circle", { cx: "14", cy: "66", r: "1.8", fill: M }),
      n.jsx("circle", { cx: "86", cy: "66", r: "1.8", fill: M }),
    ],
  });
}
function ey({
  user: r,
  activeTab: m,
  activeSecondary: x,
  activeSemester: u,
  activeGroupKey: p,
  adminGroupOptions: F,
  sabbathModeActive: M,
  onChangeAdminGroup: B,
  onNavigateTab: q,
  onOpenBible: J,
  onOpenAdmin: ae,
  onOpenSupport: G,
  onLogout: L,
  children: Q,
}) {
  const X = [
    { id: "home", label: "Главная", icon: rg },
    { id: "schedule", label: "Расписание", icon: Jh },
    ...(M ? [] : [{ id: "study", label: "Учёба", icon: Ih }]),
    { id: "reminders", label: "Напоминания", icon: cr },
    { id: "profile", label: "Профиль", icon: og },
  ];
  return n.jsxs("div", {
    className: "min-h-screen flex bg-[#FAF8F5] text-[#16161A]",
    children: [
      n.jsxs("aside", {
        className:
          "no-print hidden lg:flex lg:w-68 xl:w-72 shrink-0 flex-col border-r border-[#E8E1D9] bg-white sticky top-0 h-screen",
        children: [
          n.jsxs("div", {
            className: "zau-hero-gradient m-3.5 rounded-2xl p-4 text-white",
            children: [
              n.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  n.jsx(bs, { size: 42, variant: "light" }),
                  n.jsxs("div", {
                    className: "min-w-0",
                    children: [
                      n.jsx("p", {
                        className:
                          "text-[10px] font-extrabold tracking-[0.12em] text-white/80 uppercase",
                        children: "Заокский • 1988",
                      }),
                      n.jsx("h1", {
                        className: "truncate text-base font-extrabold leading-tight",
                        children: "ЗАУ Учёба",
                      }),
                    ],
                  }),
                ],
              }),
              r.isAdmin
                ? n.jsxs("div", {
                    className: "mt-3.5 pt-3 border-t border-white/15",
                    children: [
                      n.jsx("label", {
                        className:
                          "block text-[9.5px] font-extrabold tracking-[0.1em] text-[#F5D69B] uppercase mb-1",
                        children: "Админ · Просмотр группы",
                      }),
                      n.jsxs("div", {
                        className: "relative",
                        children: [
                          n.jsx("select", {
                            value: p,
                            onChange: (H) => B(H.target.value),
                            className:
                              "w-full appearance-none rounded-xl bg-black/25 border border-white/20 pl-3 pr-8 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#F5D69B]",
                            children: F.map((H) =>
                              n.jsx(
                                "option",
                                {
                                  value: H.groupKey,
                                  className: "text-[#16161A] bg-white",
                                  children: H.label,
                                },
                                H.groupKey,
                              ),
                            ),
                          }),
                          n.jsx($h, {
                            className:
                              "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/80",
                          }),
                        ],
                      }),
                    ],
                  })
                : n.jsxs("div", {
                    className:
                      "mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between gap-2 text-xs",
                    children: [
                      n.jsxs("span", {
                        className: "truncate font-bold text-white/95",
                        children: [r.direction, " · ", r.course, " курс"],
                      }),
                      n.jsxs("span", {
                        className:
                          "shrink-0 rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold",
                        children: [u, " сем."],
                      }),
                    ],
                  }),
            ],
          }),
          M &&
            n.jsxs("div", {
              className:
                "mx-3.5 mb-2 flex items-center gap-2 rounded-xl border border-[#EBD7B1] bg-[#FFFDF7] px-3 py-2 text-xs font-bold text-[#6B0D12]",
              children: [
                n.jsx(ir, { className: "h-4 w-4 shrink-0 text-[#B88946]" }),
                n.jsx("span", { children: "Субботний покой" }),
              ],
            }),
          n.jsxs("nav", {
            className: "flex-1 overflow-y-auto px-3.5 py-1 space-y-1",
            "aria-label": "Навигация",
            children: [
              X.map((H) => {
                const R = H.icon,
                  Z = !x && m === H.id;
                return n.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => q(H.id),
                    className: `w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${Z ? "bg-[#FCEEEE] text-[#93161B] shadow-2xs" : "text-[#5C5861] hover:bg-[#FAF8F5] hover:text-[#16161A]"}`,
                    children: [
                      n.jsx(R, {
                        className: `h-4.5 w-4.5 ${Z ? "text-[#93161B]" : "text-[#8F8A94]"}`,
                      }),
                      n.jsx("span", { children: H.label }),
                    ],
                  },
                  H.id,
                );
              }),
              n.jsxs("div", {
                className: "pt-3 mt-3 border-t border-[#E8E1D9] space-y-1",
                children: [
                  n.jsx("p", {
                    className:
                      "px-3.5 pb-1 text-[10px] font-extrabold tracking-[0.09em] text-[#8F8A94] uppercase",
                    children: "Инструменты",
                  }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: J,
                    className:
                      "w-full flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#5C5861] hover:bg-[#FDF6EA] hover:text-[#6B0D12] transition",
                    children: [
                      n.jsxs("span", {
                        className: "flex items-center gap-3",
                        children: [
                          n.jsx(ma, {
                            className: "h-4.5 w-4.5 text-[#B88946]",
                          }),
                          n.jsx("span", { children: "Библия" }),
                        ],
                      }),
                      n.jsx("span", {
                        className:
                          "rounded-md bg-[#FDF6EA] border border-[#EBD7B1] px-1.5 py-0.5 text-[10px] font-bold text-[#806332]",
                        children: "Офлайн",
                      }),
                    ],
                  }),
                  r.isAdmin
                    ? n.jsxs("button", {
                        type: "button",
                        onClick: ae,
                        className: `w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${x === "admin" ? "bg-[#FCEEEE] text-[#93161B]" : "text-[#5C5861] hover:bg-[#FAF8F5] hover:text-[#16161A]"}`,
                        children: [
                          n.jsx(vi, {
                            className: "h-4.5 w-4.5 text-[#93161B]",
                          }),
                          n.jsx("span", { children: "Админ-панель" }),
                        ],
                      })
                    : n.jsxs("button", {
                        type: "button",
                        onClick: G,
                        className: `w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${x === "support" ? "bg-[#FCEEEE] text-[#93161B]" : "text-[#5C5861] hover:bg-[#FAF8F5] hover:text-[#16161A]"}`,
                        children: [
                          n.jsx(Wh, {
                            className: "h-4.5 w-4.5 text-[#8F8A94]",
                          }),
                          n.jsx("span", { children: "Поддержка" }),
                        ],
                      }),
                ],
              }),
            ],
          }),
          n.jsx("div", {
            className: "border-t border-[#E8E1D9] p-3.5",
            children: n.jsxs("div", {
              className: "flex items-center gap-3 rounded-xl bg-[#FAF8F5] p-2.5",
              children: [
                n.jsx("div", {
                  className:
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#93161B] text-xs font-extrabold text-white uppercase",
                  children: (r.displayName || r.login || "З").slice(0, 1),
                }),
                n.jsxs("div", {
                  className: "min-w-0 flex-1",
                  children: [
                    n.jsx("p", {
                      className: "truncate text-xs font-extrabold text-[#16161A]",
                      children: r.displayName,
                    }),
                    n.jsx("p", {
                      className: "truncate text-[11px] text-[#5C5861]",
                      children: r.roleLabel,
                    }),
                  ],
                }),
                n.jsx("button", {
                  type: "button",
                  onClick: L,
                  title: "Выйти из аккаунта",
                  className:
                    "rounded-lg p-1.5 text-[#8F8A94] hover:bg-[#FFF0F0] hover:text-[#C92A2A] transition",
                  children: n.jsx(Ph, { className: "h-4 w-4" }),
                }),
              ],
            }),
          }),
        ],
      }),
      n.jsxs("div", {
        className: "flex-1 min-w-0 flex flex-col",
        children: [
          n.jsxs("header", {
            className:
              "no-print lg:hidden sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-[#E8E1D9] bg-white/95 backdrop-blur-md px-4 py-2.5",
            children: [
              n.jsxs("div", {
                className: "flex items-center gap-2.5 min-w-0",
                children: [
                  n.jsx("div", {
                    className:
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#93161B]",
                    children: n.jsx(bs, { size: 24, variant: "light" }),
                  }),
                  n.jsxs("div", {
                    className: "min-w-0",
                    children: [
                      n.jsx("p", {
                        className: "truncate text-sm font-extrabold text-[#16161A]",
                        children: "ЗАУ Учёба",
                      }),
                      n.jsx("p", {
                        className: "truncate text-[10.5px] font-semibold text-[#5C5861]",
                        children: r.isAdmin ? p : `${r.direction} · ${r.course} курс`,
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex items-center gap-1.5",
                children: [
                  n.jsxs("button", {
                    type: "button",
                    onClick: J,
                    className:
                      "inline-flex items-center gap-1 rounded-xl border border-[#EBD7B1] bg-[#FDF6EA] px-2.5 py-1.5 text-xs font-bold text-[#6B0D12]",
                    children: [
                      n.jsx(ma, { className: "h-3.5 w-3.5 text-[#B88946]" }),
                      "Библия",
                    ],
                  }),
                  r.isAdmin &&
                    n.jsx("button", {
                      type: "button",
                      onClick: ae,
                      className: "rounded-xl bg-[#FCEEEE] p-2 text-[#93161B]",
                      "aria-label": "Панель администратора",
                      children: n.jsx(vi, { className: "h-4 w-4" }),
                    }),
                ],
              }),
            ],
          }),
          n.jsx("main", {
            className:
              "flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 lg:pb-10",
            children: Q,
          }),
          n.jsx("nav", {
            "aria-label": "Мобильная навигация",
            className:
              "no-print lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-[#E8E1D9] bg-white/98 backdrop-blur-md px-1.5 pt-1.5 safe-bottom shadow-[0_-4px_20px_rgba(22,22,26,0.06)]",
            children: X.map((H) => {
              const R = H.icon,
                Z = !x && m === H.id;
              return n.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => q(H.id),
                  className: "flex flex-1 flex-col items-center justify-center py-1",
                  children: [
                    n.jsx("span", {
                      className: `flex h-7 w-12 items-center justify-center rounded-full transition ${Z ? "bg-[#FCEEEE] text-[#93161B]" : "text-[#8F8A94]"}`,
                      children: n.jsx(R, { className: "h-4.5 w-4.5" }),
                    }),
                    n.jsx("span", {
                      className: `mt-0.5 text-[10px] ${Z ? "font-extrabold text-[#93161B]" : "font-semibold text-[#5C5861]"}`,
                      children: H.label,
                    }),
                  ],
                },
                H.id,
              );
            }),
          }),
        ],
      }),
    ],
  });
}
const bb = [
    {
      id: "pentateuch",
      title: "Пятикнижие Моисеево",
      shortTitle: "Пятикнижие",
      testament: "old",
      myBibleHex: "#CCCCFF",
      order: 1,
      light: {
        bg: "#EEF0FF",
        border: "#C4C8FA",
        text: "#343A8C",
        badgeBg: "#DFE2FF",
        dot: "#636AE8",
        activeBg: "#3F47A6",
        activeText: "#FFFFFF",
        activeBorder: "#3F47A6",
      },
      sepia: {
        bg: "#E8E6F7",
        border: "#BEBBE6",
        text: "#33387E",
        badgeBg: "#DAD7F2",
        dot: "#5B62D6",
        activeBg: "#3F47A6",
        activeText: "#FFFFFF",
        activeBorder: "#3F47A6",
      },
      dark: {
        bg: "#23253D",
        border: "#4A4E82",
        text: "#CCCCFF",
        badgeBg: "#2D3052",
        dot: "#CCCCFF",
        activeBg: "#CCCCFF",
        activeText: "#141526",
        activeBorder: "#CCCCFF",
      },
    },
    {
      id: "historical",
      title: "Исторические книги",
      shortTitle: "Исторические",
      testament: "old",
      myBibleHex: "#FFCC99",
      order: 2,
      light: {
        bg: "#FFF3E6",
        border: "#F7C999",
        text: "#8A4608",
        badgeBg: "#FFE5C8",
        dot: "#E68A2E",
        activeBg: "#B85D0C",
        activeText: "#FFFFFF",
        activeBorder: "#B85D0C",
      },
      sepia: {
        bg: "#F8E7D2",
        border: "#E8BC8E",
        text: "#7C3E06",
        badgeBg: "#F2D9BA",
        dot: "#D97E24",
        activeBg: "#B85D0C",
        activeText: "#FFFFFF",
        activeBorder: "#B85D0C",
      },
      dark: {
        bg: "#36281C",
        border: "#785534",
        text: "#FFCC99",
        badgeBg: "#473322",
        dot: "#FFCC99",
        activeBg: "#FFCC99",
        activeText: "#24170B",
        activeBorder: "#FFCC99",
      },
    },
    {
      id: "poetic",
      title: "Поэтические (Учительные)",
      shortTitle: "Поэтические",
      testament: "old",
      myBibleHex: "#66FF99",
      order: 3,
      light: {
        bg: "#E8FBF0",
        border: "#9CE5B8",
        text: "#136337",
        badgeBg: "#D1F5DF",
        dot: "#28B463",
        activeBg: "#187943",
        activeText: "#FFFFFF",
        activeBorder: "#187943",
      },
      sepia: {
        bg: "#DFEFE2",
        border: "#99CFA8",
        text: "#145A32",
        badgeBg: "#CDE6D3",
        dot: "#239B56",
        activeBg: "#187943",
        activeText: "#FFFFFF",
        activeBorder: "#187943",
      },
      dark: {
        bg: "#193324",
        border: "#2F6E49",
        text: "#66FF99",
        badgeBg: "#20422E",
        dot: "#66FF99",
        activeBg: "#66FF99",
        activeText: "#0D2115",
        activeBorder: "#66FF99",
      },
    },
    {
      id: "major_prophets",
      title: "Большие пророки",
      shortTitle: "Бол. пророки",
      testament: "old",
      myBibleHex: "#FF9FB4",
      order: 4,
      light: {
        bg: "#FFF0F4",
        border: "#F5B5C5",
        text: "#8F2040",
        badgeBg: "#FFE0E8",
        dot: "#E55B7D",
        activeBg: "#B3294E",
        activeText: "#FFFFFF",
        activeBorder: "#B3294E",
      },
      sepia: {
        bg: "#F7E3E7",
        border: "#E5A8B7",
        text: "#821C39",
        badgeBg: "#F0D2D9",
        dot: "#D94F70",
        activeBg: "#B3294E",
        activeText: "#FFFFFF",
        activeBorder: "#B3294E",
      },
      dark: {
        bg: "#382027",
        border: "#7A3E4E",
        text: "#FF9FB4",
        badgeBg: "#4A2832",
        dot: "#FF9FB4",
        activeBg: "#FF9FB4",
        activeText: "#260E15",
        activeBorder: "#FF9FB4",
      },
    },
    {
      id: "minor_prophets",
      title: "Малые пророки",
      shortTitle: "Мал. пророки",
      testament: "old",
      myBibleHex: "#FFFF99",
      order: 5,
      light: {
        bg: "#FEFCE6",
        border: "#E8DC82",
        text: "#6E5C00",
        badgeBg: "#FCF5BD",
        dot: "#D4B81E",
        activeBg: "#8C7400",
        activeText: "#FFFFFF",
        activeBorder: "#8C7400",
      },
      sepia: {
        bg: "#F6F0CE",
        border: "#DDD07A",
        text: "#635200",
        badgeBg: "#EFE6B4",
        dot: "#C4A919",
        activeBg: "#8C7400",
        activeText: "#FFFFFF",
        activeBorder: "#8C7400",
      },
      dark: {
        bg: "#33321C",
        border: "#706C33",
        text: "#FFFF99",
        badgeBg: "#424022",
        dot: "#FFFF99",
        activeBg: "#FFFF99",
        activeText: "#21200B",
        activeBorder: "#FFFF99",
      },
    },
    {
      id: "gospels",
      title: "Евангелия",
      shortTitle: "Евангелия",
      testament: "new",
      myBibleHex: "#FF6600",
      order: 6,
      light: {
        bg: "#FFEDE3",
        border: "#F7B088",
        text: "#9E3600",
        badgeBg: "#FFDCCB",
        dot: "#F25C05",
        activeBg: "#CC4700",
        activeText: "#FFFFFF",
        activeBorder: "#CC4700",
      },
      sepia: {
        bg: "#F8E0D1",
        border: "#EAA57D",
        text: "#8F3000",
        badgeBg: "#F2CEB8",
        dot: "#E05300",
        activeBg: "#CC4700",
        activeText: "#FFFFFF",
        activeBorder: "#CC4700",
      },
      dark: {
        bg: "#382114",
        border: "#87451D",
        text: "#FF8533",
        badgeBg: "#4A2A17",
        dot: "#FF6600",
        activeBg: "#FF6600",
        activeText: "#FFFFFF",
        activeBorder: "#FF6600",
      },
    },
    {
      id: "acts",
      title: "Деяния святых апостолов",
      shortTitle: "Деяния",
      testament: "new",
      myBibleHex: "#00FFFF",
      order: 7,
      light: {
        bg: "#E6FAFC",
        border: "#8EDCE6",
        text: "#085E6E",
        badgeBg: "#CCF3F7",
        dot: "#00ACC1",
        activeBg: "#007C91",
        activeText: "#FFFFFF",
        activeBorder: "#007C91",
      },
      sepia: {
        bg: "#DCEFDF",
        border: "#8ACBD4",
        text: "#075666",
        badgeBg: "#C8E7EC",
        dot: "#0097A7",
        activeBg: "#007C91",
        activeText: "#FFFFFF",
        activeBorder: "#007C91",
      },
      dark: {
        bg: "#143136",
        border: "#266F7A",
        text: "#4DF7FF",
        badgeBg: "#1A4047",
        dot: "#00FFFF",
        activeBg: "#00E5EE",
        activeText: "#082024",
        activeBorder: "#00E5EE",
      },
    },
    {
      id: "general_epistles",
      title: "Соборные послания",
      shortTitle: "Соборные",
      testament: "new",
      myBibleHex: "#00FF00",
      order: 8,
      light: {
        bg: "#ECFAE6",
        border: "#A2DE8E",
        text: "#1F6610",
        badgeBg: "#D8F5CC",
        dot: "#43A047",
        activeBg: "#2B7A1B",
        activeText: "#FFFFFF",
        activeBorder: "#2B7A1B",
      },
      sepia: {
        bg: "#E2F0DA",
        border: "#9CCF8A",
        text: "#1D5E0F",
        badgeBg: "#D1E8C5",
        dot: "#388E3C",
        activeBg: "#2B7A1B",
        activeText: "#FFFFFF",
        activeBorder: "#2B7A1B",
      },
      dark: {
        bg: "#1B3318",
        border: "#35732D",
        text: "#7DFF6B",
        badgeBg: "#23421F",
        dot: "#00FF00",
        activeBg: "#4CE838",
        activeText: "#0C1F0A",
        activeBorder: "#4CE838",
      },
    },
    {
      id: "pauline_epistles",
      title: "Послания апостола Павла",
      shortTitle: "Посл. Павла",
      testament: "new",
      myBibleHex: "#FFFF00",
      order: 9,
      light: {
        bg: "#FFF8DB",
        border: "#F2D06B",
        text: "#7A5400",
        badgeBg: "#FFEFB3",
        dot: "#EAB308",
        activeBg: "#A67300",
        activeText: "#FFFFFF",
        activeBorder: "#A67300",
      },
      sepia: {
        bg: "#F7ECC6",
        border: "#E5C35E",
        text: "#6E4B00",
        badgeBg: "#F0DFAA",
        dot: "#D9A307",
        activeBg: "#A67300",
        activeText: "#FFFFFF",
        activeBorder: "#A67300",
      },
      dark: {
        bg: "#363014",
        border: "#7A6B21",
        text: "#FFE84D",
        badgeBg: "#473F19",
        dot: "#FFFF00",
        activeBg: "#FFE600",
        activeText: "#211D05",
        activeBorder: "#FFE600",
      },
    },
    {
      id: "revelation",
      title: "Пророческая (Апокалипсис)",
      shortTitle: "Откровение",
      testament: "new",
      myBibleHex: "#FF7C80",
      order: 10,
      light: {
        bg: "#FFECEC",
        border: "#F5A6A9",
        text: "#991B1F",
        badgeBg: "#FFD9DB",
        dot: "#E53935",
        activeBg: "#B71C1C",
        activeText: "#FFFFFF",
        activeBorder: "#B71C1C",
      },
      sepia: {
        bg: "#F7DFDF",
        border: "#E69C9F",
        text: "#8C181C",
        badgeBg: "#F0CECE",
        dot: "#D32F2F",
        activeBg: "#B71C1C",
        activeText: "#FFFFFF",
        activeBorder: "#B71C1C",
      },
      dark: {
        bg: "#3A1E20",
        border: "#82393C",
        text: "#FF7C80",
        badgeBg: "#4D2629",
        dot: "#FF7C80",
        activeBg: "#FF7C80",
        activeText: "#260B0C",
        activeBorder: "#FF7C80",
      },
    },
  ],
  Mh = new Map(bb.map((r) => [r.id, r])),
  ty = {
    GEN: { section: "pentateuch", abbr: "Быт" },
    EXO: { section: "pentateuch", abbr: "Исх" },
    LEV: { section: "pentateuch", abbr: "Лев" },
    NUM: { section: "pentateuch", abbr: "Чис" },
    DEU: { section: "pentateuch", abbr: "Втор" },
    JOS: { section: "historical", abbr: "Нав" },
    JDG: { section: "historical", abbr: "Суд" },
    RUT: { section: "historical", abbr: "Руфь" },
    "1SA": { section: "historical", abbr: "1Цар" },
    "2SA": { section: "historical", abbr: "2Цар" },
    "1KI": { section: "historical", abbr: "3Цар" },
    "2KI": { section: "historical", abbr: "4Цар" },
    "1CH": { section: "historical", abbr: "1Пар" },
    "2CH": { section: "historical", abbr: "2Пар" },
    EZR: { section: "historical", abbr: "Ездр" },
    NEH: { section: "historical", abbr: "Неем" },
    EST: { section: "historical", abbr: "Есф" },
    JOB: { section: "poetic", abbr: "Иов" },
    PSA: { section: "poetic", abbr: "Пс" },
    PRO: { section: "poetic", abbr: "Прит" },
    ECC: { section: "poetic", abbr: "Еккл" },
    SNG: { section: "poetic", abbr: "Песн" },
    ISA: { section: "major_prophets", abbr: "Ис" },
    JER: { section: "major_prophets", abbr: "Иер" },
    LAM: { section: "major_prophets", abbr: "Плач" },
    EZK: { section: "major_prophets", abbr: "Иез" },
    DAN: { section: "major_prophets", abbr: "Дан" },
    HOS: { section: "minor_prophets", abbr: "Ос" },
    JOL: { section: "minor_prophets", abbr: "Иоил" },
    AMO: { section: "minor_prophets", abbr: "Ам" },
    OBA: { section: "minor_prophets", abbr: "Авд" },
    JON: { section: "minor_prophets", abbr: "Иона" },
    MIC: { section: "minor_prophets", abbr: "Мих" },
    NAM: { section: "minor_prophets", abbr: "Наум" },
    HAB: { section: "minor_prophets", abbr: "Авв" },
    ZEP: { section: "minor_prophets", abbr: "Соф" },
    HAG: { section: "minor_prophets", abbr: "Агг" },
    ZEC: { section: "minor_prophets", abbr: "Зах" },
    MAL: { section: "minor_prophets", abbr: "Мал" },
    MAT: { section: "gospels", abbr: "Мат" },
    MRK: { section: "gospels", abbr: "Мар" },
    LUK: { section: "gospels", abbr: "Лук" },
    JHN: { section: "gospels", abbr: "Ин" },
    ACT: { section: "acts", abbr: "Деян" },
    JAS: { section: "general_epistles", abbr: "Иак" },
    "1PE": { section: "general_epistles", abbr: "1Пет" },
    "2PE": { section: "general_epistles", abbr: "2Пет" },
    "1JN": { section: "general_epistles", abbr: "1Ин" },
    "2JN": { section: "general_epistles", abbr: "2Ин" },
    "3JN": { section: "general_epistles", abbr: "3Ин" },
    JUD: { section: "general_epistles", abbr: "Иуд" },
    ROM: { section: "pauline_epistles", abbr: "Рим" },
    "1CO": { section: "pauline_epistles", abbr: "1Кор" },
    "2CO": { section: "pauline_epistles", abbr: "2Кор" },
    GAL: { section: "pauline_epistles", abbr: "Гал" },
    EPH: { section: "pauline_epistles", abbr: "Еф" },
    PHP: { section: "pauline_epistles", abbr: "Флп" },
    COL: { section: "pauline_epistles", abbr: "Кол" },
    "1TH": { section: "pauline_epistles", abbr: "1Фес" },
    "2TH": { section: "pauline_epistles", abbr: "2Фес" },
    "1TI": { section: "pauline_epistles", abbr: "1Тим" },
    "2TI": { section: "pauline_epistles", abbr: "2Тим" },
    TIT: { section: "pauline_epistles", abbr: "Тит" },
    PHM: { section: "pauline_epistles", abbr: "Флм" },
    HEB: { section: "pauline_epistles", abbr: "Евр" },
    REV: { section: "revelation", abbr: "Откр" },
  };
function Rh(r, m = "") {
  const x = String(r || "").toUpperCase(),
    u = ty[x],
    p = (u && Mh.get(u.section)) || Mh.get("pentateuch"),
    F = u?.abbr || m.slice(0, 4) || x;
  return { section: p, abbr: F };
}
const pn = {
  version: 1,
  translation: "synodal",
  lastRead: { synodal: { bookId: "GEN", chapter: 1, verse: 1, updatedAt: 0 } },
  bookLayout: "list",
  updatedAt: 0,
};
function ly(r) {
  if (!r || typeof r != "object") return null;
  const m = String(r.bookId || "")
      .trim()
      .slice(0, 24),
    x = Math.trunc(Number(r.chapter)),
    u = Math.trunc(Number(r.verse));
  return !/^[A-Za-z0-9_-]{1,24}$/.test(m) ||
    !Number.isInteger(x) ||
    x < 1 ||
    x > 200 ||
    !Number.isInteger(u) ||
    u < 1 ||
    u > 2e3
    ? null
    : {
        bookId: m,
        chapter: x,
        verse: u,
        updatedAt: Math.max(0, Math.trunc(Number(r.updatedAt) || 0)),
      };
}
function ld(r) {
  if (!r || typeof r != "object" || Array.isArray(r))
    return { ...pn, lastRead: { synodal: { ...pn.lastRead.synodal } } };
  const m = {};
  if (r.lastRead && typeof r.lastRead == "object")
    for (const x of ["synodal", "kulakov"]) {
      const u = ly(r.lastRead[x]);
      u && (m[x] = u);
    }
  return (
    m.synodal || (m.synodal = { ...pn.lastRead.synodal }),
    {
      version: 1,
      translation: r.translation === "kulakov" ? "kulakov" : "synodal",
      lastRead: m,
      bookLayout: r.bookLayout === "grid" ? "grid" : "list",
      theme: ["light", "sepia", "dark"].includes(r.theme) ? r.theme : undefined,
      updatedAt: Math.max(0, Math.trunc(Number(r.updatedAt) || 0)),
    }
  );
}
function Uh(r, m) {
  const x = ld(r),
    u = ld(m),
    p = { ...x.lastRead };
  for (const [M, B] of Object.entries(u.lastRead)) {
    const q = p[M];
    (!q || B.updatedAt >= q.updatedAt) && (p[M] = B);
  }
  const F = u.updatedAt >= x.updatedAt;
  return {
    version: 1,
    translation: F ? u.translation : x.translation,
    lastRead: p,
    bookLayout: F ? u.bookLayout : x.bookLayout,
    theme: (F ? u.theme : x.theme) || (F ? x.theme : u.theme),
    updatedAt: Math.max(x.updatedAt, u.updatedAt),
  };
}
let Ic = null;
let kh = null;
function Hh(r) {
  return `zau_bible_progress_v1:${Et === "local" ? "local:" : ""}${encodeURIComponent(String(r || "guest"))}`;
}
function Lh(r, m) {
  const x = m.books.find((M) => M.id === r.bookId) || m.books[0];
  if (!x) return { bookId: "GEN", chapter: 1, verse: 1, updatedAt: r.updatedAt || 0 };
  const u = Math.max(1, Math.min(x.chapters.length, r.chapter || 1)),
    p = x.chapters[u - 1] || [],
    F = Math.max(1, Math.min(Math.max(1, p.length), r.verse || 1));
  return { bookId: x.id, chapter: u, verse: F, updatedAt: r.updatedAt || 0 };
}
function ny({ visible: r, userId: m, authenticated: x = !1, onClose: u }) {
  const stamp = () => Math.max(Date.now(), (Number(X.current.updatedAt) || 0) + 1);
  const [filters, setFilters] = d.useState(readFilters),
    [jump, setJump] = d.useState(0);
  const changeFilter = (patch) =>
    setFilters((old) => {
      const next = { ...old, ...patch };
      setFilterPrefs(next);
      return next;
    });
  const [p, F] = d.useState(Ic),
    [M, B] = d.useState(kh),
    [q, J] = d.useState(!Ic),
    [ae, G] = d.useState(""),
    [L, Q] = d.useState(pn),
    X = d.useRef(pn),
    [H, R] = d.useState("Доступно офлайн"),
    [Z, ie] = d.useState(() => {
      const w = Number(localStorage.getItem("zau_bible_font_size") || 18);
      return w >= 14 && w <= 26 ? w : 18;
    }),
    [Y, ne] = d.useState(() => {
      const w = localStorage.getItem("zau_bible_surface");
      return w === "sepia" || w === "night" ? w : "ivory";
    }),
    [me, re] = d.useState("all"),
    [$, Me] = d.useState("all"),
    [De, je] = d.useState(""),
    [ue, oe] = d.useState(!1),
    [de, se] = d.useState(!1),
    [ge, U] = d.useState(""),
    [ce, le] = d.useState(null),
    we = d.useRef(null),
    Ee = d.useRef(null),
    Te = d.useRef(null);
  d.useEffect(() => {
    if (!r || !p || kh) return;
    let live = true;
    loadEdition(p)
      .then((b) => {
        if (live && b && !kh) {
          kh = b;
          B(b);
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [r, p]);
  d.useEffect(
    () => () => {
      if (Te.current) clearTimeout(Te.current);
    },
    [m],
  );
  (d.useEffect(() => {
    if (!r) return;
    if (Ic) {
      F(Ic);
      J(false);
      return;
    }
    let w = !0;
    return (
      J(!0),
      G(""),
      fetch(new URL("data/synodal_bible.json", document.baseURI), { credentials: "omit" })
        .then((k) => {
          if (!k.ok) throw new Error("Не удалось загрузить корпус Библии");
          return k.json();
        })
        .then((k) => {
          if (k?.books?.length !== 66) throw Error("Файл Синодального перевода неполон.");
          ((Ic = k), w && F(k));
        })
        .catch((k) => {
          w && G(k?.message || "Ошибка загрузки текста Библии.");
        })
        .finally(() => {
          w && J(!1);
        }),
      () => {
        w = !1;
      }
    );
  }, [r]),
    d.useEffect(() => {
      if (!r) return;
      let w = !1;
      const k = Hh(m);
      let O = pn;
      try {
        const W = localStorage.getItem(k);
        if (W) O = ld(JSON.parse(W));
        const prev =
          Et !== "local"
            ? localStorage.getItem(
                "zau_bible_progress_v1_" + encodeURIComponent(String(m || "guest")),
              )
            : null;
        if (prev) O = Uh(ld(JSON.parse(prev)), O);
      } catch {}
      return (
        (X.current = O),
        Q(O),
        x
          ? be("/api/mobile/bible-progress")
              .then((W) => {
                if (w || !W?.progress) return;
                const ve = Uh(X.current, W.progress);
                ((X.current = ve), Q(ve));
                try {
                  localStorage.setItem(k, JSON.stringify(ve));
                } catch {}
                R("Синхронизировано с аккаунтом");
              })
              .catch(() => {
                w || R("Сохранено на устройстве (офлайн)");
              })
          : R("Сохранено в браузере (офлайн)"),
        () => {
          w = !0;
        }
      );
    }, [r, m, x]));
  d.useEffect(() => {
    if (r && L.theme) {
      const surface = { light: "ivory", sepia: "sepia", dark: "night" }[L.theme];
      if (surface) {
        ne(surface);
        try {
          localStorage.setItem("zau_bible_surface", surface);
        } catch {}
      }
    }
  }, [r, L.theme]);
  const Re = L.translation === "kulakov" && M ? "kulakov" : "synodal",
    Ne = Re === "kulakov" && M ? M : p,
    K = d.useCallback(
      (w, k = !1) => {
        ((X.current = w), Q(w));
        try {
          localStorage.setItem(Hh(m), JSON.stringify(w));
          if (x) localStorage.setItem(Hh(m) + ":pending", String(w.updatedAt || 0));
        } catch {}
        if (!x) {
          R("Сохранено в браузере");
          return;
        }
        Te.current && window.clearTimeout(Te.current);
        const generation = sessionGeneration,
          key = Hh(m);
        const O = () => {
          if (generation !== sessionGeneration) return;
          const sent = X.current;
          be("/api/mobile/bible-progress", {
            method: "PUT",
            body: sent,
            retryTransport: !1,
            timeoutMs: 9e3,
          })
            .then((W) => {
              if (W?.progress) {
                const ve = Uh(X.current, W.progress);
                ((X.current = ve), Q(ve));
                try {
                  const saved = ld(JSON.parse(localStorage.getItem(key) || "null"));
                  localStorage.setItem(key, JSON.stringify(Uh(saved, ve)));
                  if (
                    localStorage.getItem(key + ":pending") === String(sent.updatedAt || 0)
                  )
                    localStorage.removeItem(key + ":pending");
                } catch {}
                R("Место чтения синхронизировано");
              } else R("Сохранено на устройстве");
            })
            .catch(() => {
              R("Сохранено локально");
            });
        };
        k ? O() : (Te.current = window.setTimeout(O, 650));
      },
      [x, m],
    ),
    h = d.useMemo(() => {
      const w = L.lastRead[Re] || pn.lastRead.synodal;
      return Ne ? Lh(w, Ne) : w;
    }, [L, Re, Ne]),
    D = d.useMemo(
      () => (Ne && (Ne.books.find((w) => w.id === h.bookId) || Ne.books[0])) || null,
      [Ne, h.bookId],
    ),
    he = d.useMemo(() => (D ? D.chapters[h.chapter - 1] || [] : []), [D, h.chapter]);
  const restorePending = d.useCallback(() => {
    if (!x) return;
    try {
      const key = Hh(m);
      if (localStorage.getItem(key + ":pending") !== null) {
        const value = localStorage.getItem(key);
        if (value) K(ld(JSON.parse(value)), true);
      }
    } catch {}
  }, [m, x, K]);
  useRecovery(restorePending);
  d.useEffect(() => {
    restorePending();
  }, [restorePending]);
  d.useEffect(() => {
    if (!r || !D) return;
    const w = we.current;
    if (!w) return;
    if (h.verse <= 1) {
      w.scrollTop = 0;
      return;
    }
    const k = window.setTimeout(() => {
      const O = w.querySelector(`[data-verse="${h.verse}"]`);
      O && O.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 60);
    return () => window.clearTimeout(k);
  }, [r, D?.id, h.chapter, jump, Re]);
  const Ae = d.useCallback(
      (w, k, O = 1) => {
        if (!Ne) return;
        const W = stamp(),
          ve = Lh({ bookId: w, chapter: k, verse: O, updatedAt: W }, Ne),
          Be = {
            ...X.current,
            translation: Re,
            lastRead: { ...X.current.lastRead, [Re]: ve },
            updatedAt: W,
          };
        K(Be);
      },
      [Ne, Re, K],
    ),
    V = d.useCallback(
      (w) => {
        if (!Ne || !D) return;
        const k = Ne.books.findIndex((W) => W.id === D.id),
          O = h.chapter + w;
        if (O >= 1 && O <= D.chapters.length) {
          Ae(D.id, O, 1);
          return;
        }
        if (w === 1 && k + 1 < Ne.books.length) Ae(Ne.books[k + 1].id, 1, 1);
        else if (w === -1 && k > 0) {
          const W = Ne.books[k - 1];
          Ae(W.id, W.chapters.length, 1);
        }
      },
      [Ne, D, h.chapter, Ae],
    ),
    Ce = d.useCallback(() => {
      (x && K(X.current, !0), u());
    }, [x, K, u]);
  d.useEffect(() => {
    if (!r) return;
    const w = (k) => {
      if (document.querySelector("dialog[open]")) return;
      const O = k.target?.tagName;
      if (k.key === "Escape") {
        de ? se(!1) : Ce();
        return;
      }
      O === "INPUT" ||
        O === "TEXTAREA" ||
        (k.key === "ArrowLeft" ? V(-1) : k.key === "ArrowRight" && V(1));
    };
    return (
      window.addEventListener("keydown", w),
      () => window.removeEventListener("keydown", w)
    );
  }, [r, de, V, Ce]);
  const j = d.useMemo(() => bb.filter((w) => me === "all" || w.testament === me), [me]),
    ee = d.useMemo(() => {
      if (!Ne) return [];
      const w = De.trim().toLowerCase(),
        k = new Map();
      for (const O of Ne.books) {
        if (me !== "all" && O.testament !== me) continue;
        const { section: W, abbr: ve } = Rh(O.id, O.name);
        if (
          ($ !== "all" && W.id !== $) ||
          (w &&
            !O.name.toLowerCase().includes(w) &&
            !ve.toLowerCase().includes(w) &&
            !W.title.toLowerCase().includes(w))
        )
          continue;
        const Be = k.get(W.id);
        Be
          ? Be.items.push({ book: O, abbr: ve })
          : k.set(W.id, { section: W, items: [{ book: O, abbr: ve }] });
      }
      return Array.from(k.values()).sort((O, W) => O.section.order - W.section.order);
    }, [Ne, me, $, De]),
    ze = Y === "night" ? "dark" : Y === "sepia" ? "sepia" : "light",
    Le = d.useCallback((w) => w[ze], [ze]),
    Ze = d.useMemo(
      () =>
        Ne && de && ge.trim().length >= 2
          ? searchVerses(Ne.books, ge, { ...filters, bookId: D?.id, limit: 60 })
          : [],
      [Ne, de, ge, filters, D?.id],
    ),
    Ue = (w) => {
      const k = stamp();
      K({ ...X.current, bookLayout: w, updatedAt: k });
    },
    qe = (w) => {
      ie((k) => {
        const O = Math.max(14, Math.min(26, k + w));
        try {
          localStorage.setItem("zau_bible_font_size", String(O));
        } catch {}
        return O;
      });
    },
    T = (w) => {
      ne(w);
      K({
        ...X.current,
        theme: { ivory: "light", sepia: "sepia", night: "dark" }[w],
        updatedAt: stamp(),
      });
      try {
        localStorage.setItem("zau_bible_surface", w);
      } catch {}
    },
    xe = async (w, k, label = w) => {
      if (!D) return;
      Ae(D.id, h.chapter, w);
      const O = `«${k}» (${D.name} ${h.chapter}:${label})`;
      try {
        (await navigator.clipboard.writeText(O),
          le(w),
          window.setTimeout(() => le(null), 1600));
      } catch {}
    },
    acceptEdition = (bible) => {
      kh = bible;
      B(bible);
      K({ ...X.current, translation: "kulakov", updatedAt: stamp() });
    };
  if (!r) return null;
  const I =
    Y === "night"
      ? "bg-[#18171C] text-[#EAE5DC]"
      : Y === "sepia"
        ? "bg-[#F6EFE2] text-[#2B2218]"
        : "bg-[#FFFEFC] text-[#16161A]";
  return n.jsx("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs",
    children: n.jsxs("div", {
      className:
        "flex h-full sm:h-[92vh] w-full max-w-6xl flex-col overflow-hidden sm:rounded-3xl border border-[#E8E1D9] bg-[#FAF8F5] shadow-2xl",
      children: [
        n.jsxs("header", {
          className:
            "flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E1D9] bg-white px-4 sm:px-6 py-3",
          children: [
            n.jsxs("div", {
              className: "flex items-center gap-3 min-w-0",
              children: [
                n.jsxs("button", {
                  type: "button",
                  onClick: () => oe((w) => !w),
                  className:
                    "lg:hidden inline-flex items-center gap-1.5 rounded-xl bg-[#FCEEEE] px-3 py-2 text-xs font-extrabold text-[#93161B]",
                  children: [
                    n.jsx(ma, { className: "h-4 w-4" }),
                    D ? `${D.name} ${h.chapter}` : "Книги",
                  ],
                }),
                n.jsxs("div", {
                  className: "hidden lg:flex items-center gap-3",
                  children: [
                    n.jsx("div", {
                      className:
                        "flex h-9 w-9 items-center justify-center rounded-xl bg-[#93161B] text-white",
                      children: n.jsx(ma, { className: "h-4 w-4" }),
                    }),
                    n.jsxs("div", {
                      children: [
                        n.jsxs("h2", {
                          className: "text-sm font-extrabold text-[#16161A]",
                          children: [
                            "Священное Писание · ",
                            Ne?.translation || "Синодальный перевод",
                          ],
                        }),
                        n.jsx("p", {
                          className: "text-[11px] text-[#8F8A94]",
                          children: H,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            n.jsxs("div", {
              className: "flex items-center gap-1.5 sm:gap-2",
              children: [
                n.jsxs("button", {
                  type: "button",
                  onClick: () => se((w) => !w),
                  className: `inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${de ? "border-[#93161B] bg-[#FCEEEE] text-[#93161B]" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861] hover:text-[#16161A]"}`,
                  title: "Поиск по стихам Библии",
                  children: [
                    n.jsx(Pu, { className: "h-3.5 w-3.5" }),
                    n.jsx("span", {
                      className: "hidden sm:inline",
                      children: "Поиск",
                    }),
                  ],
                }),
                n.jsx(WebPreferences, {
                  font: Z,
                  step: qe,
                  surface: Y,
                  setSurface: T,
                  filters,
                  changeFilter,
                  canon: p,
                  edition: M,
                  translation: Re,
                  choose: (id) =>
                    K({ ...X.current, translation: id, updatedAt: stamp() }),
                  onImported: acceptEdition,
                }),
                n.jsx("button", {
                  type: "button",
                  onClick: Ce,
                  className:
                    "rounded-xl p-2 text-[#5C5861] hover:bg-[#F3EFEA] hover:text-[#16161A]",
                  "aria-label": "Закрыть Библию",
                  children: n.jsx(Kt, { className: "h-5 w-5" }),
                }),
              ],
            }),
          ],
        }),
        de &&
          Ne &&
          n.jsxs("div", {
            className: "border-b border-[#E8E1D9] bg-[#FAF8F5] px-4 sm:px-6 py-3",
            children: [
              n.jsxs("div", {
                className: "relative",
                children: [
                  n.jsx(Pu, {
                    className:
                      "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8F8A94]",
                  }),
                  n.jsx("input", {
                    type: "text",
                    autoFocus: !0,
                    value: ge,
                    "aria-label": "Поиск по стихам",
                    maxLength: 180,
                    onChange: (w) => U(w.target.value),
                    placeholder: "Введите слова или фразу…",
                    className:
                      "w-full rounded-xl border border-[#E8E1D9] bg-white pl-10 pr-4 py-2.5 text-sm text-[#16161A] placeholder:text-[#8F8A94] focus:border-[#93161B] focus:outline-none",
                  }),
                ],
              }),
              ge.trim().length >= 2 &&
                n.jsx("div", {
                  className: "mt-2.5 max-h-56 overflow-y-auto space-y-1.5",
                  children:
                    Ze.length === 0
                      ? n.jsx("p", {
                          className: "py-3 text-center text-xs text-[#8F8A94]",
                          children: "Стихи по запросу не найдены.",
                        })
                      : Ze.map((w) =>
                          n.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                (Ae(w.bookId, w.chapter, w.verse),
                                  setJump((j) => j + 1),
                                  se(!1));
                              },
                              className:
                                "w-full rounded-xl border border-[#E8E1D9] bg-white px-3.5 py-2 text-left hover:border-[#93161B]/50 transition",
                              children: [
                                n.jsxs("p", {
                                  className: "text-[11px] font-extrabold text-[#93161B]",
                                  children: [w.bookName, " ", w.chapter, ":", w.label],
                                }),
                                n.jsx("p", {
                                  className:
                                    "mt-0.5 line-clamp-2 font-scripture text-xs text-[#16161A]",
                                  children: renderParts(w.parts),
                                }),
                              ],
                            },
                            `${w.bookId}_${w.chapter}_${w.verse}`,
                          ),
                        ),
                }),
            ],
          }),
        q
          ? n.jsxs("div", {
              className:
                "flex flex-1 flex-col items-center justify-center p-8 text-center",
              children: [
                n.jsx(ot, { className: "h-9 w-9 animate-spin text-[#93161B]" }),
                n.jsx("p", {
                  className: "mt-3 text-sm font-extrabold text-[#16161A]",
                  children: "Открываем Синодальную Библию (66 книг)…",
                }),
                n.jsx("p", {
                  className: "mt-1 text-xs text-[#8F8A94]",
                  children:
                    "После первой загрузки весь корпус сохраняется для работы без интернета",
                }),
              ],
            })
          : ae || !Ne || !D
            ? n.jsx("div", {
                className:
                  "flex flex-1 flex-col items-center justify-center p-8 text-center",
                children: n.jsx("p", {
                  className: "text-sm font-bold text-[#C92A2A]",
                  children: ae || "Текст Библии недоступен.",
                }),
              })
            : n.jsxs("div", {
                className: "flex flex-1 min-h-0 overflow-hidden",
                children: [
                  n.jsxs("aside", {
                    className: `${ue ? "flex fixed inset-0 z-30 lg:static" : "hidden lg:flex"} w-full lg:w-84 shrink-0 flex-col border-r ${Y === "night" ? "border-white/10 bg-[#151419] text-[#EAE5DC]" : Y === "sepia" ? "border-[#DFD3BE] bg-[#EFE6D5] text-[#2B2218]" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#16161A]"}`,
                    children: [
                      n.jsxs("div", {
                        className: `p-3 border-b space-y-2 ${Y === "night" ? "border-white/10 bg-[#1C1B22]" : Y === "sepia" ? "border-[#DFD3BE] bg-[#F6EFE2]" : "border-[#E8E1D9] bg-white"}`,
                        children: [
                          n.jsxs("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [
                              n.jsx("div", {
                                className: `flex flex-1 rounded-xl p-0.5 text-[11px] font-bold ${Y === "night" ? "bg-white/8" : "bg-[#F3EFEA]"}`,
                                children: [
                                  { id: "all", label: "Все (66)" },
                                  { id: "old", label: "ВЗ (39)" },
                                  { id: "new", label: "НЗ (27)" },
                                ].map((w) =>
                                  n.jsx(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () => {
                                        (re(w.id), Me("all"));
                                      },
                                      className: `flex-1 rounded-lg py-1.5 transition ${me === w.id ? (Y === "night" ? "bg-[#93161B] text-white font-extrabold" : "bg-white text-[#93161B] shadow-2xs font-extrabold") : Y === "night" ? "text-white/70 hover:text-white" : "text-[#5C5861]"}`,
                                      children: w.label,
                                    },
                                    w.id,
                                  ),
                                ),
                              }),
                              n.jsxs("div", {
                                className: `flex items-center rounded-xl border p-0.5 ${Y === "night" ? "border-white/15" : "border-[#E8E1D9]"}`,
                                children: [
                                  n.jsx("button", {
                                    type: "button",
                                    onClick: () => Ue("list"),
                                    className: `rounded-lg p-1.5 ${L.bookLayout === "list" ? "bg-[#93161B] text-white" : Y === "night" ? "text-white/60" : "text-[#8F8A94]"}`,
                                    title: "Список книг по разделам",
                                    children: n.jsx(eb, {
                                      className: "h-3.5 w-3.5",
                                    }),
                                  }),
                                  n.jsx("button", {
                                    type: "button",
                                    onClick: () => Ue("grid"),
                                    className: `rounded-lg p-1.5 ${L.bookLayout === "grid" ? "bg-[#93161B] text-white" : Y === "night" ? "text-white/60" : "text-[#8F8A94]"}`,
                                    title: "Цветная плитка MyBible",
                                    children: n.jsx(dg, {
                                      className: "h-3.5 w-3.5",
                                    }),
                                  }),
                                ],
                              }),
                              ue &&
                                n.jsx("button", {
                                  type: "button",
                                  onClick: () => oe(!1),
                                  className: "lg:hidden rounded-lg p-1.5 opacity-70",
                                  children: n.jsx(Kt, { className: "h-4 w-4" }),
                                }),
                            ],
                          }),
                          n.jsx("input", {
                            type: "text",
                            value: De,
                            onChange: (w) => je(w.target.value),
                            placeholder: "Поиск книги или сокращения (Быт, Пс, Ин)…",
                            className: `w-full rounded-xl border px-3 py-1.5 text-xs focus:border-[#93161B] focus:outline-none ${Y === "night" ? "border-white/12 bg-white/6 text-white placeholder:text-white/45" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#16161A] placeholder:text-[#8F8A94] focus:bg-white"}`,
                          }),
                          n.jsxs("div", {
                            className: "flex items-center gap-1 overflow-x-auto pb-0.5",
                            children: [
                              n.jsx("button", {
                                type: "button",
                                onClick: () => Me("all"),
                                className: `shrink-0 rounded-lg border px-2 py-1 text-[10.5px] font-extrabold transition ${$ === "all" ? "border-[#93161B] bg-[#93161B] text-white" : Y === "night" ? "border-white/12 bg-white/5 text-white/75" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861]"}`,
                                children: "Все разделы",
                              }),
                              j.map((w) => {
                                const k = Le(w),
                                  O = $ === w.id;
                                return n.jsxs(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => Me((W) => (W === w.id ? "all" : w.id)),
                                    style: {
                                      backgroundColor: O ? k.activeBg : k.bg,
                                      borderColor: O ? k.activeBorder : k.border,
                                      color: O ? k.activeText : k.text,
                                    },
                                    className:
                                      "shrink-0 inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10.5px] font-extrabold transition hover:opacity-90",
                                    children: [
                                      n.jsx("span", {
                                        style: {
                                          backgroundColor: O ? k.activeText : k.dot,
                                        },
                                        className: "h-1.5 w-1.5 rounded-full shrink-0",
                                      }),
                                      w.shortTitle,
                                    ],
                                  },
                                  w.id,
                                );
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsx("div", {
                        className: "flex-1 overflow-y-auto p-2.5 space-y-3.5",
                        children: ee.length
                          ? ee.map(({ section: w, items: k }) => {
                              const O = Le(w);
                              return n.jsxs(
                                "div",
                                {
                                  className: "space-y-1.5",
                                  children: [
                                    n.jsxs("div", {
                                      className:
                                        "flex items-center justify-between gap-2 px-1",
                                      children: [
                                        n.jsxs("span", {
                                          className:
                                            "inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider opacity-85",
                                          children: [
                                            n.jsx("span", {
                                              style: { backgroundColor: O.dot },
                                              className:
                                                "h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs",
                                            }),
                                            n.jsx("span", {
                                              style: { color: O.text },
                                              children: w.title,
                                            }),
                                          ],
                                        }),
                                        n.jsx("span", {
                                          className:
                                            "text-[10px] font-bold opacity-50 tabular-nums",
                                          children: k.length,
                                        }),
                                      ],
                                    }),
                                    L.bookLayout === "grid"
                                      ? n.jsx("div", {
                                          className: "grid grid-cols-4 gap-1.5",
                                          children: k.map(({ book: W, abbr: ve }) => {
                                            const Be = W.id === D.id;
                                            return n.jsxs(
                                              "button",
                                              {
                                                type: "button",
                                                title: `${W.name} (${W.chapters.length} гл.)`,
                                                onClick: () => {
                                                  (Ae(W.id, 1, 1), oe(!1));
                                                },
                                                style: {
                                                  backgroundColor: Be ? O.activeBg : O.bg,
                                                  borderColor: Be
                                                    ? O.activeBorder
                                                    : O.border,
                                                  color: Be ? O.activeText : O.text,
                                                },
                                                className: `rounded-xl border px-1.5 py-2 text-center transition hover:brightness-97 ${Be ? "shadow-xs ring-2 ring-offset-1 ring-black/10" : ""}`,
                                                children: [
                                                  n.jsx("p", {
                                                    className:
                                                      "truncate text-xs font-extrabold leading-tight",
                                                    children: ve,
                                                  }),
                                                  n.jsx("p", {
                                                    className:
                                                      "mt-0.5 text-[9.5px] font-semibold opacity-75 tabular-nums",
                                                    children: W.chapters.length,
                                                  }),
                                                ],
                                              },
                                              W.id,
                                            );
                                          }),
                                        })
                                      : n.jsx("div", {
                                          className: "space-y-1",
                                          children: k.map(({ book: W, abbr: ve }) => {
                                            const Be = W.id === D.id;
                                            return n.jsxs(
                                              "button",
                                              {
                                                type: "button",
                                                onClick: () => {
                                                  (Ae(W.id, 1, 1), oe(!1));
                                                },
                                                style: {
                                                  backgroundColor: Be ? O.activeBg : O.bg,
                                                  borderColor: Be
                                                    ? O.activeBorder
                                                    : O.border,
                                                  color: Be ? O.activeText : O.text,
                                                },
                                                className: `w-full flex items-center gap-2.5 rounded-xl border px-2.5 py-1.5 text-left text-xs transition hover:brightness-98 ${Be ? "font-extrabold shadow-xs" : "font-bold"}`,
                                                children: [
                                                  n.jsx("span", {
                                                    style: {
                                                      backgroundColor: Be
                                                        ? "rgba(255,255,255,0.2)"
                                                        : O.badgeBg,
                                                      color: Be ? O.activeText : O.text,
                                                    },
                                                    className:
                                                      "w-11 shrink-0 rounded-lg py-0.5 text-center text-[10.5px] font-extrabold",
                                                    children: ve,
                                                  }),
                                                  n.jsx("span", {
                                                    className: `min-w-0 flex-1 truncate ${Be ? "" : Y === "night" ? "text-[#F2EFE9]" : "text-[#16161A]"}`,
                                                    children: W.name,
                                                  }),
                                                  n.jsxs("span", {
                                                    className:
                                                      "shrink-0 text-[10px] font-bold opacity-70 tabular-nums",
                                                    children: [W.chapters.length, " гл."],
                                                  }),
                                                ],
                                              },
                                              W.id,
                                            );
                                          }),
                                        }),
                                  ],
                                },
                                w.id,
                              );
                            })
                          : n.jsx("p", {
                              className: "py-8 text-center text-xs opacity-60",
                              children: "Книги не найдены",
                            }),
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className: `flex flex-1 flex-col min-w-0 ${I}`,
                    children: [
                      (() => {
                        const w = Rh(D.id, D.name),
                          k = Le(w.section);
                        return n.jsxs("div", {
                          className: `border-b px-4 sm:px-6 py-2.5 space-y-2 ${Y === "night" ? "border-white/10 bg-[#1F1E24]" : "border-[#E8E1D9] bg-black/[0.02]"}`,
                          children: [
                            n.jsx("div", {
                              className:
                                "flex flex-wrap items-center justify-between gap-2",
                              children: n.jsxs("div", {
                                className: "flex items-center gap-2 min-w-0",
                                children: [
                                  n.jsxs("span", {
                                    style: {
                                      backgroundColor: k.bg,
                                      borderColor: k.border,
                                      color: k.text,
                                    },
                                    className:
                                      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[10.5px] font-extrabold shrink-0",
                                    children: [
                                      n.jsx("span", {
                                        style: { backgroundColor: k.dot },
                                        className: "h-2 w-2 rounded-full",
                                      }),
                                      w.section.title,
                                    ],
                                  }),
                                  n.jsxs("span", {
                                    className:
                                      "truncate text-xs sm:text-sm font-extrabold",
                                    children: [D.name, " · глава ", h.chapter],
                                  }),
                                ],
                              }),
                            }),
                            n.jsxs("div", {
                              className:
                                "flex items-center gap-1.5 overflow-x-auto pb-0.5",
                              children: [
                                n.jsx("span", {
                                  className:
                                    "shrink-0 text-[10.5px] font-extrabold uppercase tracking-wider opacity-60 mr-1",
                                  children: "Глава:",
                                }),
                                D.chapters.map((O, W) => {
                                  const ve = W + 1,
                                    Be = ve === h.chapter;
                                  return n.jsx(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () => Ae(D.id, ve, 1),
                                      style: Be
                                        ? {
                                            backgroundColor: k.activeBg,
                                            color: k.activeText,
                                            borderColor: k.activeBorder,
                                          }
                                        : void 0,
                                      className: `h-7 min-w-7 shrink-0 rounded-lg px-2 text-xs font-bold tabular-nums transition ${Be ? "shadow-2xs border" : Y === "night" ? "bg-white/5 text-white/75 hover:bg-white/15" : "bg-white/80 text-[#5C5861] hover:bg-[#FCEEEE] hover:text-[#93161B] border border-[#E8E1D9]/80"}`,
                                      children: ve,
                                    },
                                    ve,
                                  );
                                }),
                              ],
                            }),
                          ],
                        });
                      })(),
                      n.jsx("div", {
                        ref: we,
                        className: "flex-1 overflow-y-auto px-5 sm:px-10 py-7",
                        children: n.jsxs("div", {
                          className: "mx-auto max-w-2xl",
                          children: [
                            n.jsxs("div", {
                              className:
                                "flex items-baseline justify-between gap-4 border-b border-current/10 pb-4 mb-6",
                              children: [
                                n.jsxs("div", {
                                  children: [
                                    n.jsx("p", {
                                      className:
                                        "text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#B88946]",
                                      children:
                                        D.testament === "old"
                                          ? "Ветхий Завет"
                                          : "Новый Завет",
                                    }),
                                    n.jsxs("h3", {
                                      className:
                                        "font-scripture text-2xl sm:text-3xl font-bold mt-1",
                                      children: [D.name, " · Глава ", h.chapter],
                                    }),
                                  ],
                                }),
                                n.jsxs("span", {
                                  className:
                                    "inline-flex items-center gap-1 rounded-full bg-[#B88946]/15 px-3 py-1 text-xs font-bold text-[#9A6F32] tabular-nums shrink-0",
                                  children: [
                                    n.jsx(fg, { className: "h-3.5 w-3.5" }),
                                    "ст. ",
                                    he[h.verse - 1]?.number || h.verse,
                                  ],
                                }),
                              ],
                            }),
                            n.jsx("div", {
                              className: "space-y-3",
                              style: { fontSize: `${Z}px`, lineHeight: 1.78 },
                              children: he.map((w, k) => {
                                const O = k + 1,
                                  verseText = typeof w === "string" ? w : w.text,
                                  verseLabel = typeof w === "string" ? O : w.number,
                                  W = O === h.verse,
                                  ve = O === ce;
                                return n.jsxs(
                                  "div",
                                  {
                                    "data-verse": O,
                                    onClick: () => Ae(D.id, h.chapter, O),
                                    className: `group relative rounded-xl px-3 py-1.5 -mx-3 cursor-pointer transition ${W ? (Y === "night" ? "bg-[#B88946]/20 ring-1 ring-[#B88946]/40" : "bg-[#FDF6EA] ring-1 ring-[#EBD7B1]") : Y === "night" ? "hover:bg-white/[0.04]" : "hover:bg-black/[0.025]"}`,
                                    children: [
                                      n.jsxs("p", {
                                        className: "font-scripture pr-7",
                                        children: [
                                          n.jsx("sup", {
                                            className:
                                              "mr-2 font-sans text-[0.65em] font-extrabold text-[#93161B] tabular-nums select-none",
                                            children: verseLabel,
                                          }),
                                          renderParts(
                                            highlightedParts(verseText, tokens(ge)),
                                          ),
                                        ],
                                      }),
                                      n.jsx("button", {
                                        type: "button",
                                        onClick: (Be) => {
                                          (Be.stopPropagation(),
                                            xe(O, verseText, verseLabel));
                                        },
                                        title: "Скопировать стих и поставить закладку",
                                        className:
                                          "absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-lg p-1 text-[#8F8A94] hover:text-[#93161B] transition",
                                        children: ve
                                          ? n.jsx(Ni, {
                                              className: "h-3.5 w-3.5 text-[#1F6E4E]",
                                            })
                                          : n.jsx(sd, {
                                              className: "h-3.5 w-3.5",
                                            }),
                                      }),
                                    ],
                                  },
                                  O,
                                );
                              }),
                            }),
                            n.jsxs("div", {
                              className:
                                "mt-10 flex items-center justify-between gap-3 border-t border-current/10 pt-6 pb-4",
                              children: [
                                n.jsxs("button", {
                                  type: "button",
                                  onClick: () => V(-1),
                                  className:
                                    "inline-flex items-center gap-2 rounded-xl border border-current/15 px-4 py-2.5 text-xs font-bold hover:border-[#93161B] hover:text-[#93161B] transition",
                                  children: [
                                    n.jsx(tb, { className: "h-4 w-4" }),
                                    "Предыдущая глава",
                                  ],
                                }),
                                n.jsx("span", {
                                  className: "text-xs opacity-60 hidden sm:inline",
                                  children: "Нажмите на стих для сохранения закладки",
                                }),
                                n.jsxs("button", {
                                  type: "button",
                                  onClick: () => V(1),
                                  className:
                                    "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#6B0D12] transition",
                                  children: [
                                    "Следующая глава",
                                    n.jsx(rr, { className: "h-4 w-4" }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
      ],
    }),
  });
}
function sy({ visible: r, quizTarget: m, groupKey: x, isAdmin: u, onClose: p }) {
  const [F, M] = d.useState(!1),
    [B, q] = d.useState(""),
    [J, ae] = d.useState(""),
    [G, L] = d.useState([]),
    [Q, X] = d.useState(0),
    [H, R] = d.useState(null),
    [Z, ie] = d.useState(0),
    [Y, ne] = d.useState(!1),
    me = d.useCallback(
      async (ue = !1) => {
        if (!m) return;
        (M(!0), q(""), L([]), X(0), R(null), ie(0), ne(!1));
        const oe = u && x ? `?groupKey=${encodeURIComponent(x)}` : "";
        try {
          const de = await be(`/api/mobile/quiz/generate${oe}`, {
            method: "POST",
            timeoutMs: 3e4,
            body: {
              entryId: m.entryId || "",
              subjectId: m.subjectId || "",
              collection: m.collection || "notes",
              regenerate: ue || void 0,
            },
          });
          (ae(de.subjectName || m.title || "Проверка знаний"),
            L(de.questions || []),
            de.questions?.length ||
              q("По этому материалу пока недостаточно текста для составления вопросов."));
        } catch (de) {
          q(de?.message || "Не удалось подготовить вопросы тренажёра.");
        } finally {
          M(!1);
        }
      },
      [m, u, x],
    );
  d.useEffect(() => {
    !r || !m || (Pe("quiz", "start_quiz"), me(!1));
  }, [r, m, me]);
  const re = G[Q],
    $ = d.useCallback(
      (ue) => {
        H !== null || !re || (R(ue), ue === re.correctIndex && ie((oe) => oe + 1));
      },
      [H, re],
    ),
    Me = d.useCallback(() => {
      H !== null &&
        (Q + 1 >= G.length
          ? (Pe("quiz", "finish_quiz"), ne(!0))
          : (X((ue) => ue + 1), R(null)));
    }, [H, Q, G.length]);
  if (
    (d.useEffect(() => {
      if (!r) return;
      const ue = (oe) => {
        if (oe.key === "Escape") {
          p();
          return;
        }
        if (!(F || Y || !re))
          if (H === null && ["1", "2", "3", "4"].includes(oe.key)) {
            const de = Number(oe.key) - 1;
            de < re.options.length && $(de);
          } else
            H !== null &&
              (oe.key === "Enter" || oe.key === " ") &&
              (oe.preventDefault(), Me());
      };
      return (
        window.addEventListener("keydown", ue),
        () => window.removeEventListener("keydown", ue)
      );
    }, [r, F, Y, re, H, $, Me, p]),
    !r || !m)
  )
    return null;
  const De = () => {
      (X(0), R(null), ie(0), ne(!1));
    },
    je = G.length ? Math.round((Z / G.length) * 100) : 0;
  return n.jsx("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
    onClick: p,
    children: n.jsxs("div", {
      className:
        "w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-[#E8E1D9] bg-white shadow-2xl",
      onClick: (ue) => ue.stopPropagation(),
      children: [
        n.jsxs("div", {
          className:
            "flex items-start justify-between gap-3 border-b border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
          children: [
            n.jsxs("div", {
              className: "flex items-center gap-3 min-w-0",
              children: [
                n.jsx("div", {
                  className:
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#93161B] text-white shadow-xs",
                  children: n.jsx(gi, { className: "h-5 w-5" }),
                }),
                n.jsxs("div", {
                  className: "min-w-0",
                  children: [
                    n.jsx("p", {
                      className:
                        "text-[11px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                      children: "ИИ-Тренажёр ЗАУ",
                    }),
                    n.jsx("h3", {
                      className:
                        "truncate text-base sm:text-lg font-extrabold text-[#16161A]",
                      children: J || m.title || "Самопроверка по лекции",
                    }),
                  ],
                }),
              ],
            }),
            n.jsx("button", {
              type: "button",
              onClick: p,
              className:
                "rounded-xl p-2 text-[#8F8A94] hover:bg-[#E8E1D9]/60 hover:text-[#16161A] transition",
              "aria-label": "Закрыть тренажёр",
              children: n.jsx(Kt, { className: "h-5 w-5" }),
            }),
          ],
        }),
        n.jsx("div", {
          className: "flex-1 overflow-y-auto p-6",
          children: F
            ? n.jsxs("div", {
                className: "flex flex-col items-center justify-center py-14 text-center",
                children: [
                  n.jsx(ot, {
                    className: "h-9 w-9 animate-spin text-[#93161B]",
                  }),
                  n.jsx("p", {
                    className: "mt-4 text-sm font-extrabold text-[#16161A]",
                    children: "Анализируем конспект и готовим вопросы…",
                  }),
                  n.jsx("p", {
                    className: "mt-1 text-xs text-[#8F8A94]",
                    children: "Обычно это занимает пару секунд",
                  }),
                ],
              })
            : B
              ? n.jsxs("div", {
                  className: "py-10 text-center",
                  children: [
                    n.jsx("div", {
                      className:
                        "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F0] text-[#C92A2A]",
                      children: n.jsx(wh, { className: "h-6 w-6" }),
                    }),
                    n.jsx("p", {
                      className: "mt-4 text-sm font-bold text-[#16161A]",
                      children: B,
                    }),
                    n.jsxs("div", {
                      className: "mt-5 flex justify-center gap-2.5",
                      children: [
                        n.jsx("button", {
                          type: "button",
                          onClick: () => me(!1),
                          className:
                            "rounded-xl bg-[#93161B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#6B0D12]",
                          children: "Попробовать снова",
                        }),
                        n.jsx("button", {
                          type: "button",
                          onClick: p,
                          className:
                            "rounded-xl border border-[#E8E1D9] px-4 py-2.5 text-xs font-bold text-[#5C5861]",
                          children: "Закрыть",
                        }),
                      ],
                    }),
                  ],
                })
              : Y
                ? n.jsxs("div", {
                    className: "py-6 text-center",
                    children: [
                      n.jsx("div", {
                        className:
                          "mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FDF6EA] border border-[#EBD7B1] text-[#B88946]",
                        children: n.jsx(xg, { className: "h-8 w-8" }),
                      }),
                      n.jsx("p", {
                        className:
                          "mt-4 text-xs font-extrabold tracking-[0.09em] text-[#93161B] uppercase",
                        children: "Тренировка завершена",
                      }),
                      n.jsxs("h4", {
                        className:
                          "mt-1 text-3xl font-extrabold text-[#16161A] tabular-nums",
                        children: [Z, " из ", G.length, " (", je, "%)"],
                      }),
                      n.jsx("p", {
                        className: "mt-2 max-w-md mx-auto text-sm text-[#5C5861]",
                        children:
                          je >= 80
                            ? "Отличное владение материалом лекции! Вы уверенно готовы к семинару и зачёту."
                            : je >= 50
                              ? "Хорошая база! Повторите вопросы с пояснениями, чтобы закрепить детали."
                              : "Рекомендуем перечитать конспект и пройти тест ещё раз для закрепления.",
                      }),
                      n.jsxs("div", {
                        className:
                          "mt-7 flex flex-wrap items-center justify-center gap-3",
                        children: [
                          n.jsxs("button", {
                            type: "button",
                            onClick: De,
                            className:
                              "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6B0D12] transition",
                            children: [
                              n.jsx(lb, { className: "h-4 w-4" }),
                              "Пройти ещё раз",
                            ],
                          }),
                          u &&
                            n.jsxs("button", {
                              type: "button",
                              onClick: () => me(!0),
                              className:
                                "inline-flex items-center gap-2 rounded-xl border border-[#F2CACA] bg-[#FCEEEE] px-4 py-2.5 text-sm font-bold text-[#93161B] hover:bg-[#F9DFDF] transition",
                              children: [
                                n.jsx(or, { className: "h-4 w-4" }),
                                "Новые вопросы ИИ",
                              ],
                            }),
                          n.jsx("button", {
                            type: "button",
                            onClick: p,
                            className:
                              "rounded-xl border border-[#E8E1D9] px-5 py-2.5 text-sm font-bold text-[#5C5861] hover:bg-[#F3EFEA] transition",
                            children: "Готово",
                          }),
                        ],
                      }),
                    ],
                  })
                : re
                  ? n.jsxs("div", {
                      children: [
                        n.jsxs("div", {
                          className:
                            "flex items-center justify-between text-xs font-bold text-[#5C5861] mb-2",
                          children: [
                            n.jsxs("span", {
                              children: ["Вопрос ", Q + 1, " из ", G.length],
                            }),
                            n.jsxs("span", {
                              className: "text-[#1F6E4E] tabular-nums",
                              children: ["Верно: ", Z],
                            }),
                          ],
                        }),
                        n.jsx("div", {
                          className:
                            "h-1.5 w-full overflow-hidden rounded-full bg-[#F3EFEA]",
                          children: n.jsx("div", {
                            className:
                              "h-full rounded-full bg-[#93161B] transition-all duration-300",
                            style: { width: `${((Q + 1) / G.length) * 100}%` },
                          }),
                        }),
                        n.jsx("h4", {
                          className:
                            "mt-5 text-base sm:text-lg font-extrabold leading-snug text-[#16161A]",
                          children: re.question,
                        }),
                        n.jsx("div", {
                          className: "mt-4 space-y-2.5",
                          children: re.options.map((ue, oe) => {
                            const de = H !== null,
                              se = oe === re.correctIndex,
                              ge = oe === H;
                            let U =
                              "border-[#E8E1D9] bg-[#FAF8F5] hover:border-[#93161B]/45 hover:bg-[#FCEEEE]/35 text-[#16161A]";
                            return (
                              de &&
                                (se
                                  ? (U = "border-[#1F6E4E] bg-[#E8F6EF] text-[#134B34]")
                                  : ge
                                    ? (U = "border-[#C92A2A] bg-[#FFF0F0] text-[#8B1E24]")
                                    : (U =
                                        "border-[#E8E1D9] bg-white opacity-60 text-[#5C5861]")),
                              n.jsxs(
                                "button",
                                {
                                  type: "button",
                                  disabled: de,
                                  onClick: () => $(oe),
                                  className: `w-full flex items-start gap-3 rounded-2xl border p-3.5 text-left text-sm font-semibold transition ${U}`,
                                  children: [
                                    n.jsx("span", {
                                      className: `flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${de && se ? "bg-[#1F6E4E] text-white" : de && ge ? "bg-[#C92A2A] text-white" : "bg-white border border-[#E8E1D9] text-[#5C5861]"}`,
                                      children: oe + 1,
                                    }),
                                    n.jsx("span", {
                                      className: "flex-1 leading-relaxed",
                                      children: ue,
                                    }),
                                    de &&
                                      se &&
                                      n.jsx(ur, {
                                        className:
                                          "h-5 w-5 shrink-0 text-[#1F6E4E] mt-0.5",
                                      }),
                                    de &&
                                      ge &&
                                      !se &&
                                      n.jsx(wh, {
                                        className:
                                          "h-5 w-5 shrink-0 text-[#C92A2A] mt-0.5",
                                      }),
                                  ],
                                },
                                oe,
                              )
                            );
                          }),
                        }),
                        H !== null &&
                          n.jsxs("div", {
                            className:
                              "mt-5 rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-4",
                            children: [
                              n.jsx("p", {
                                className: `text-xs font-extrabold uppercase tracking-wide ${H === re.correctIndex ? "text-[#1F6E4E]" : "text-[#C92A2A]"}`,
                                children:
                                  H === re.correctIndex
                                    ? "Правильный ответ!"
                                    : "Есть неточность",
                              }),
                              re.explanation &&
                                n.jsx("p", {
                                  className:
                                    "mt-1.5 text-sm leading-relaxed text-[#5C5861]",
                                  children: re.explanation,
                                }),
                            ],
                          }),
                        n.jsxs("div", {
                          className: "mt-6 flex items-center justify-between gap-3",
                          children: [
                            n.jsx("p", {
                              className: "hidden sm:block text-[11px] text-[#8F8A94]",
                              children: "Клавиши 1–4 — выбор ответа, Enter — далее",
                            }),
                            n.jsxs("button", {
                              type: "button",
                              disabled: H === null,
                              onClick: Me,
                              className:
                                "ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#93161B] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#6B0D12] disabled:opacity-40",
                              children: [
                                Q + 1 >= G.length ? "Показать итог" : "Следующий вопрос",
                                n.jsx(rr, { className: "h-4 w-4" }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  : null,
        }),
      ],
    }),
  });
}
const pb = 6 * 1024 * 1024,
  iy = 9 * 1024 * 1024;
function qh(r) {
  return !Number.isFinite(r) || r <= 0
    ? "0 Б"
    : r < 1024
      ? `${r} Б`
      : r < 1024 * 1024
        ? `${(r / 1024).toFixed(1)} КБ`
        : `${(r / (1024 * 1024)).toFixed(2)} МБ`;
}
function xs(r) {
  return new Promise((m, x) => {
    const u = new FileReader();
    ((u.onerror = () => x(new Error("Не удалось прочитать выбранный файл."))),
      (u.onload = () => {
        const p = String(u.result || ""),
          F = p.includes(",") ? p.split(",").pop() || "" : p;
        F ? m(F) : x(new Error("Файл пуст или повреждён."));
      }),
      u.readAsDataURL(r));
  });
}
async function gb(r) {
  return r.size <= 1.2 * 1024 * 1024 && /^image\/(jpeg|png|webp)$/i.test(r.type)
    ? {
        fileName: r.name || "photo.jpg",
        mimeType: r.type || "image/jpeg",
        base64: await xs(r),
      }
    : new Promise((m, x) => {
        const u = URL.createObjectURL(r),
          p = new Image();
        ((p.onload = () => {
          URL.revokeObjectURL(u);
          const F = 1800;
          let { width: M, height: B } = p;
          if (M > F || B > F) {
            const Q = F / Math.max(M, B);
            ((M = Math.round(M * Q)), (B = Math.round(B * Q)));
          }
          const q = document.createElement("canvas");
          ((q.width = M), (q.height = B));
          const J = q.getContext("2d");
          if (!J) {
            xs(r)
              .then((Q) =>
                m({
                  fileName: r.name || "photo.jpg",
                  mimeType: r.type || "image/jpeg",
                  base64: Q,
                }),
              )
              .catch(x);
            return;
          }
          J.drawImage(p, 0, 0, M, B);
          const G = q.toDataURL("image/jpeg", 0.82).split(",").pop() || "",
            L = (r.name || "photo").replace(/\.[^.]+$/, "") + ".jpg";
          m({ fileName: L, mimeType: "image/jpeg", base64: G });
        }),
          (p.onerror = () => {
            (URL.revokeObjectURL(u),
              xs(r)
                .then((F) =>
                  m({
                    fileName: r.name || "photo.jpg",
                    mimeType: r.type || "image/jpeg",
                    base64: F,
                  }),
                )
                .catch(x));
          }),
          (p.src = u));
      });
}
function Gh(r) {
  const m = String(r || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : r || "";
}
function yi(r) {
  if (!r) return "—";
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(r));
  } catch {
    return new Date(r).toLocaleString("ru-RU");
  }
}
function ms() {
  try {
    const r = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Moscow",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    if (/^\d{4}-\d{2}-\d{2}$/.test(r)) return r;
  } catch {}
  return new Date().toISOString().slice(0, 10);
}
function cy({
  globalSabbathModeEnabled: r,
  onGlobalSabbathModeChanged: m,
  onBack: x,
  onOpenSupportThread: u,
}) {
  const [p, F] = d.useState("overview"),
    [M, B] = d.useState(!1),
    [q, J] = d.useState(""),
    [ae, G] = d.useState(""),
    [L, Q] = d.useState(null),
    [X, H] = d.useState([]),
    [R, Z] = d.useState([]),
    [ie, Y] = d.useState(null),
    [ne, me] = d.useState(""),
    [re, $] = d.useState("Теология"),
    [Me, De] = d.useState("72"),
    [je, ue] = d.useState(!1),
    [oe, de] = d.useState(null),
    se = d.useCallback(
      async (h) => {
        (B(!0), J(""));
        try {
          if (h === "overview" || h === "guests") {
            const D = await be("/api/mobile/admin/overview");
            (Q(D), D.globalSabbathMode && m(D.globalSabbathMode));
          } else if (h === "inbox") {
            const [D, he] = await Promise.all([
              be("/api/mobile/admin/support/threads"),
              be("/api/mobile/admin/feedback"),
            ]);
            (H(D.threads || []), Z(he.feedback || []));
          } else if (h === "logs") {
            const D = await be("/api/mobile/admin/activity/export");
            Y(D);
          }
        } catch (D) {
          J(D?.message || "Не удалось загрузить раздел админ-панели.");
        } finally {
          B(!1);
        }
      },
      [m],
    );
  d.useEffect(() => {
    se(p);
  }, [p, se]);
  const ge = async () => {
      J("");
      try {
        const h = await be("/api/mobile/admin/sabbath-mode", {
          method: "POST",
          body: { enabled: !r },
        });
        h.globalSabbathMode && m(h.globalSabbathMode);
      } catch (h) {
        J(h?.message || "Не удалось переключить глобальный субботний режим.");
      }
    },
    U = fs(),
    ce = async (h) => {
      (h.preventDefault(), ue(!0), J(""));
      try {
        (await be("/api/mobile/admin/guest-links", {
          method: "POST",
          body: {
            label: ne.trim() || "Гостевой доступ",
            faculty: re,
            ttlHours: Math.max(0, Number(Me) || 72),
          },
        }),
          me(""),
          await se("guests"));
      } catch (D) {
        J(D?.message || "Не удалось создать гостевую ссылку.");
      } finally {
        ue(!1);
      }
    },
    le = async (h) => {
      try {
        (await be(`/api/mobile/admin/guest-links/${encodeURIComponent(h.token)}`, {
          method: "PATCH",
          body: { isActive: !h.isActive },
        }),
          await se("guests"));
      } catch (D) {
        J(D?.message);
      }
    },
    we = async (h) => {
      try {
        const D = await be(
          `/api/mobile/admin/guest-links/${encodeURIComponent(h.token)}/credentials`,
          { method: "POST" },
        );
        (D.credentials && de({ ...D.credentials, label: h.label }), await se("guests"));
      } catch (D) {
        J(D?.message || "Не удалось сгенерировать временный аккаунт.");
      }
    },
    Ee = async (h) => {
      try {
        (await be(`/api/mobile/admin/guest-links/${encodeURIComponent(h)}`, {
          method: "DELETE",
        }),
          await se("guests"));
      } catch (D) {
        J(D?.message);
      }
    },
    Te = async (h) => {
      try {
        (await be(`/api/mobile/admin/feedback/${encodeURIComponent(h)}`, {
          method: "DELETE",
        }),
          Z((D) => D.filter((he) => he.id !== h)));
      } catch (D) {
        J(D?.message);
      }
    },
    Re = async (h, D) => {
      try {
        (await navigator.clipboard.writeText(D),
          G(h),
          window.setTimeout(() => G(""), 1600));
      } catch {}
    },
    Ne = () => {
      if (!ie) return;
      const h = new Blob([JSON.stringify(ie, null, 2)], {
          type: "application/json;charset=utf-8",
        }),
        D = URL.createObjectURL(h),
        he = document.createElement("a");
      ((he.href = D),
        (he.download = `zau-activity-${new Date().toISOString().slice(0, 10)}.json`),
        document.body.appendChild(he),
        he.click(),
        he.remove(),
        setTimeout(() => URL.revokeObjectURL(D), 1e3));
    };
  L?.semesters?.find((h) => h.is_active === 1)?.number;
  const K = ie?.events || ie?.activity || [];
  return n.jsxs("div", {
    className: "space-y-5",
    children: [
      n.jsxs("section", {
        className: "zau-card p-5 sm:p-6 space-y-4",
        children: [
          n.jsxs("div", {
            className: "flex flex-wrap items-center justify-between gap-3",
            children: [
              n.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  n.jsxs("button", {
                    type: "button",
                    onClick: x,
                    className:
                      "inline-flex items-center gap-1 rounded-xl bg-[#FCEEEE] px-3 py-2 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF]",
                    children: [n.jsx(id, { className: "h-3.5 w-3.5" }), "Назад"],
                  }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("p", {
                        className:
                          "text-[10.5px] font-extrabold uppercase tracking-wider text-[#93161B]",
                        children: "Управление университетом",
                      }),
                      n.jsx("h2", {
                        className: "text-xl font-extrabold text-[#16161A]",
                        children: "Панель администратора ЗАУ",
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  n.jsxs("a", {
                    href: hb(),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className:
                      "inline-flex items-center gap-1.5 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#16161A] hover:border-[#93161B]",
                    children: [
                      "Полная Веб-студия БД",
                      n.jsx(dr, { className: "h-3.5 w-3.5 text-[#93161B]" }),
                    ],
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => se(p),
                    className:
                      "rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] p-2 text-[#5C5861]",
                    children: n.jsx(vn, {
                      className: `h-4 w-4 ${M ? "animate-spin" : ""}`,
                    }),
                  }),
                ],
              }),
            ],
          }),
          n.jsx("div", {
            className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
            children: [
              { id: "overview", label: "Обзор и режим", icon: vi },
              { id: "guests", label: "Гостевые ссылки", icon: cd },
              { id: "inbox", label: "Входящие и чаты", icon: mg },
              { id: "logs", label: "Активность", icon: hg },
            ].map((h) => {
              const D = h.icon,
                he = p === h.id;
              return n.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => F(h.id),
                  className: `flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-extrabold transition ${he ? "border-[#93161B] bg-[#93161B] text-white" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861] hover:text-[#16161A]"}`,
                  children: [
                    n.jsx(D, { className: "h-3.5 w-3.5 shrink-0" }),
                    n.jsx("span", { className: "truncate", children: h.label }),
                  ],
                },
                h.id,
              );
            }),
          }),
        ],
      }),
      q &&
        n.jsx("div", {
          className:
            "rounded-2xl border border-[#F5C6C6] bg-[#FFF0F0] px-4 py-3 text-xs font-bold text-[#C92A2A]",
          children: q,
        }),
      p === "overview" &&
        n.jsxs("div", {
          className: "space-y-5",
          children: [
            n.jsxs("div", {
              className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
              children: [
                n.jsxs("div", {
                  className: "zau-card p-5",
                  children: [
                    n.jsx("p", {
                      className: "text-xs font-bold text-[#5C5861]",
                      children: "Аккаунтов приложения",
                    }),
                    n.jsx("p", {
                      className:
                        "mt-1.5 text-3xl font-extrabold text-[#93161B] tabular-nums",
                      children: L?.mobileAccountsCount ?? "—",
                    }),
                  ],
                }),
                n.jsxs("div", {
                  className: "zau-card p-5",
                  children: [
                    n.jsx("p", {
                      className: "text-xs font-bold text-[#5C5861]",
                      children: "Админов и старост",
                    }),
                    n.jsx("p", {
                      className:
                        "mt-1.5 text-3xl font-extrabold text-[#16161A] tabular-nums",
                      children: L?.roles?.length ?? "—",
                    }),
                  ],
                }),
                n.jsxs("div", {
                  className: "zau-card p-5",
                  children: [
                    n.jsx("p", {
                      className: "text-xs font-bold text-[#5C5861]",
                      children: "Гостевых ссылок",
                    }),
                    n.jsx("p", {
                      className:
                        "mt-1.5 text-3xl font-extrabold text-[#B88946] tabular-nums",
                      children: L?.guestLinks?.length ?? "—",
                    }),
                  ],
                }),
              ],
            }),
            n.jsxs("div", {
              className: "grid grid-cols-1 md:grid-cols-2 gap-5",
              children: [
                n.jsx("div", {
                  className: "zau-card p-5 space-y-3",
                  children: n.jsxs("div", {
                    className: "flex items-center justify-between gap-3",
                    children: [
                      n.jsxs("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                          n.jsx(ir, { className: "h-5 w-5 text-[#B88946]" }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("h3", {
                                className: "text-sm font-extrabold text-[#16161A]",
                                children: "Глобальный субботний режим",
                              }),
                              n.jsx("p", {
                                className: "text-xs text-[#5C5861]",
                                children:
                                  "Включает субботний покой у всех студентов в приложении и веб-версии",
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsx("button", {
                        type: "button",
                        onClick: ge,
                        className: `rounded-xl px-4 py-2 text-xs font-extrabold transition shrink-0 ${r ? "bg-[#1F6E4E] text-white" : "bg-[#FAF8F5] border border-[#E8E1D9] text-[#16161A] hover:border-[#93161B]"}`,
                        children: r ? "Активен (выкл.)" : "Включить",
                      }),
                    ],
                  }),
                }),
                n.jsxs("div", {
                  className: "zau-card p-5 flex items-center justify-between gap-3",
                  children: [
                    n.jsxs("div", {
                      children: [
                        n.jsx("h3", {
                          className: "text-sm font-extrabold text-[#16161A]",
                          children: "Текущий учебный семестр",
                        }),
                        n.jsx("p", {
                          className: "text-xs text-[#5C5861] mt-0.5",
                          children:
                            "Определяется автоматически по календарю ЗАУ (сент–янв — 1-й, фев–авг — 2-й)",
                        }),
                      ],
                    }),
                    n.jsxs("span", {
                      className:
                        "rounded-xl bg-[#FCEEEE] border border-[#F2CACA] px-3.5 py-2 text-xs font-extrabold text-[#93161B] shrink-0",
                      children: [U, " семестр · авто"],
                    }),
                  ],
                }),
              ],
            }),
            !!L?.roles?.length &&
              n.jsxs("div", {
                className: "zau-card p-5",
                children: [
                  n.jsx("h3", {
                    className: "text-sm font-extrabold text-[#16161A] mb-3",
                    children: "Назначенные администраторы и старосты",
                  }),
                  n.jsx("div", {
                    className: "divide-y divide-[#F3EFEA]",
                    children: L.roles.map((h, D) =>
                      n.jsxs(
                        "div",
                        {
                          className: "flex items-center justify-between py-2.5 text-xs",
                          children: [
                            n.jsxs("div", {
                              children: [
                                n.jsx("span", {
                                  className: "font-extrabold text-[#16161A]",
                                  children: h.username
                                    ? `@${h.username.replace(/^@+/, "")}`
                                    : `ID ${h.telegram_id}`,
                                }),
                                n.jsx("span", {
                                  className: "ml-2 text-[#5C5861]",
                                  children: h.faculty,
                                }),
                              ],
                            }),
                            n.jsx("span", {
                              className: `rounded-md px-2 py-0.5 text-[10.5px] font-extrabold ${h.role === "ADMIN" ? "bg-[#FCEEEE] text-[#93161B]" : "bg-[#FDF6EA] text-[#806332]"}`,
                              children: h.role,
                            }),
                          ],
                        },
                        `${h.telegram_id}_${D}`,
                      ),
                    ),
                  }),
                ],
              }),
          ],
        }),
      p === "guests" &&
        n.jsxs("div", {
          className: "space-y-5",
          children: [
            n.jsxs("form", {
              onSubmit: ce,
              className: "zau-card p-5 space-y-3.5",
              children: [
                n.jsx("h3", {
                  className: "text-sm font-extrabold text-[#16161A]",
                  children: "Новая гостевая ссылка",
                }),
                n.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                  children: [
                    n.jsx("input", {
                      type: "text",
                      value: ne,
                      onChange: (h) => me(h.target.value),
                      placeholder: "Название (напр. Абитуриенты)",
                      className:
                        "rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold",
                    }),
                    n.jsxs("select", {
                      value: re,
                      onChange: (h) => $(h.target.value),
                      className:
                        "rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold",
                      children: [
                        db.map((h) =>
                          n.jsx("option", { value: h.name, children: h.name }, h.id),
                        ),
                        n.jsx("option", {
                          value: "ALL",
                          children: "Все направления (ALL)",
                        }),
                      ],
                    }),
                    n.jsxs("div", {
                      className: "flex gap-2",
                      children: [
                        n.jsx("input", {
                          type: "number",
                          min: 0,
                          max: 8760,
                          value: Me,
                          onChange: (h) => De(h.target.value),
                          placeholder: "Часы (72)",
                          className:
                            "w-24 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3 py-2.5 text-xs font-bold tabular-nums",
                        }),
                        n.jsxs("button", {
                          type: "submit",
                          disabled: je,
                          className:
                            "flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#93161B] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#6B0D12]",
                          children: [
                            je
                              ? n.jsx(ot, {
                                  className: "h-3.5 w-3.5 animate-spin",
                                })
                              : n.jsx(xa, { className: "h-3.5 w-3.5" }),
                            "Создать",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            oe &&
              n.jsxs("div", {
                className:
                  "rounded-2xl border border-[#BFE6D3] bg-[#E8F6EF] p-4 text-xs space-y-1",
                children: [
                  n.jsxs("p", {
                    className: "font-extrabold text-[#1F6E4E]",
                    children: ["Временный гостевой аккаунт создан (", oe.label, "):"],
                  }),
                  n.jsxs("p", {
                    className: "font-mono text-sm font-bold text-[#16161A]",
                    children: ["Логин: ", oe.login, " · Пароль: ", oe.password],
                  }),
                ],
              }),
            n.jsx("div", {
              className: "space-y-3",
              children: (L?.guestLinks || []).map((h) => {
                const D = new URL(
                  "?guest=" + encodeURIComponent(h.token),
                  document.baseURI,
                ).href;
                return n.jsxs(
                  "div",
                  {
                    className: "zau-card p-4 sm:p-5 space-y-3",
                    children: [
                      n.jsxs("div", {
                        className: "flex flex-wrap items-start justify-between gap-3",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("p", {
                                className: "text-sm font-extrabold text-[#16161A]",
                                children: h.label,
                              }),
                              n.jsxs("p", {
                                className: "text-xs text-[#5C5861] mt-0.5",
                                children: [
                                  h.defaultFaculty,
                                  " · входов: ",
                                  h.usesCount,
                                  " · токен:",
                                  " ",
                                  n.jsx("code", {
                                    className: "font-bold text-[#93161B]",
                                    children: h.token,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          n.jsx("button", {
                            type: "button",
                            onClick: () => le(h),
                            className: `rounded-lg px-3 py-1 text-xs font-bold ${h.isActive ? "bg-[#E8F6EF] text-[#1F6E4E]" : "bg-[#E8E1D9] text-[#5C5861]"}`,
                            children: h.isActive ? "Активна" : "Отключена",
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className:
                          "flex flex-wrap items-center gap-2 pt-2 border-t border-[#F3EFEA]",
                        children: [
                          n.jsxs("button", {
                            type: "button",
                            onClick: () => Re(`web_${h.token}`, D),
                            className:
                              "inline-flex items-center gap-1.5 rounded-lg bg-[#FCEEEE] px-3 py-1.5 text-[11px] font-extrabold text-[#93161B]",
                            children: [
                              ae === `web_${h.token}`
                                ? n.jsx(Ni, {
                                    className: "h-3 w-3 text-[#1F6E4E]",
                                  })
                                : n.jsx(sd, { className: "h-3 w-3" }),
                              "Копировать веб-ссылку",
                            ],
                          }),
                          n.jsxs("button", {
                            type: "button",
                            onClick: () => we(h),
                            className:
                              "inline-flex items-center gap-1.5 rounded-lg border border-[#E8E1D9] bg-[#FAF8F5] px-3 py-1.5 text-[11px] font-bold text-[#16161A]",
                            children: [
                              n.jsx(rd, {
                                className: "h-3 w-3 text-[#B88946]",
                              }),
                              "Выдать логин/пароль",
                            ],
                          }),
                          n.jsxs("button", {
                            type: "button",
                            onClick: () => Ee(h.token),
                            className:
                              "ml-auto inline-flex items-center gap-1 rounded-lg bg-[#FFF0F0] px-2.5 py-1.5 text-[11px] font-bold text-[#C92A2A]",
                            children: [n.jsx(hs, { className: "h-3 w-3" }), "Удалить"],
                          }),
                        ],
                      }),
                    ],
                  },
                  h.token,
                );
              }),
            }),
          ],
        }),
      p === "inbox" &&
        n.jsxs("div", {
          className: "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start",
          children: [
            n.jsxs("div", {
              className: "zau-card p-5 space-y-3",
              children: [
                n.jsxs("h3", {
                  className: "text-sm font-extrabold text-[#16161A]",
                  children: ["Переписки поддержки (", X.length, ")"],
                }),
                X.length
                  ? X.map((h) =>
                      n.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => u(h.id),
                          className:
                            "w-full rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-3.5 text-left hover:border-[#93161B] transition",
                          children: [
                            n.jsxs("div", {
                              className: "flex items-center justify-between gap-2",
                              children: [
                                n.jsx("span", {
                                  className: "text-xs font-extrabold text-[#16161A]",
                                  children: h.userName,
                                }),
                                n.jsx("span", {
                                  className: "text-[10.5px] text-[#8F8A94]",
                                  children: yi(h.lastMessageAt || h.updatedAt),
                                }),
                              ],
                            }),
                            n.jsxs("p", {
                              className:
                                "text-[11px] font-semibold text-[#93161B] mt-0.5",
                              children: [
                                h.groupKey,
                                " · ",
                                h.type === "bug" ? "Ошибка" : "Вопрос",
                              ],
                            }),
                            h.lastMessagePreview &&
                              n.jsx("p", {
                                className: "mt-1 line-clamp-2 text-xs text-[#5C5861]",
                                children: h.lastMessagePreview,
                              }),
                          ],
                        },
                        h.id,
                      ),
                    )
                  : n.jsx("p", {
                      className: "text-xs text-[#8F8A94] py-4",
                      children: "Обращений пока нет.",
                    }),
              ],
            }),
            n.jsxs("div", {
              className: "zau-card p-5 space-y-3",
              children: [
                n.jsxs("h3", {
                  className: "text-sm font-extrabold text-[#16161A]",
                  children: ["Предложения и идеи (", R.length, ")"],
                }),
                R.length
                  ? R.map((h) =>
                      n.jsxs(
                        "div",
                        {
                          className:
                            "rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-3.5 space-y-1.5",
                          children: [
                            n.jsxs("div", {
                              className:
                                "flex items-center justify-between gap-2 text-xs",
                              children: [
                                n.jsxs("span", {
                                  className: "font-extrabold text-[#16161A]",
                                  children: [
                                    h.userName,
                                    " · ",
                                    n.jsx("span", {
                                      className: "text-[#5C5861]",
                                      children: h.groupKey,
                                    }),
                                  ],
                                }),
                                n.jsx("button", {
                                  type: "button",
                                  onClick: () => Te(h.id),
                                  className: "text-[#8F8A94] hover:text-[#C92A2A]",
                                  children: n.jsx(hs, {
                                    className: "h-3.5 w-3.5",
                                  }),
                                }),
                              ],
                            }),
                            n.jsx("p", {
                              className: "text-xs leading-relaxed text-[#16161A]",
                              children: h.message,
                            }),
                            n.jsx("p", {
                              className: "text-[10.5px] text-[#8F8A94]",
                              children: yi(h.createdAt),
                            }),
                          ],
                        },
                        h.id,
                      ),
                    )
                  : n.jsx("p", {
                      className: "text-xs text-[#8F8A94] py-4",
                      children: "Новых предложений нет.",
                    }),
              ],
            }),
          ],
        }),
      p === "logs" &&
        n.jsxs("div", {
          className: "zau-card p-5 space-y-4",
          children: [
            n.jsxs("div", {
              className: "flex flex-wrap items-center justify-between gap-3",
              children: [
                n.jsxs("div", {
                  children: [
                    n.jsx("h3", {
                      className: "text-sm font-extrabold text-[#16161A]",
                      children: "Журнал действий студентов",
                    }),
                    n.jsxs("p", {
                      className: "text-xs text-[#5C5861]",
                      children: ["Записей в выгрузке: ", K.length],
                    }),
                  ],
                }),
                n.jsxs("button", {
                  type: "button",
                  disabled: !ie,
                  onClick: Ne,
                  className:
                    "inline-flex items-center gap-1.5 rounded-xl bg-[#93161B] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#6B0D12] disabled:opacity-45",
                  children: [n.jsx(bn, { className: "h-3.5 w-3.5" }), "Скачать JSON"],
                }),
              ],
            }),
            n.jsxs("div", {
              className: "max-h-96 overflow-y-auto divide-y divide-[#F3EFEA]",
              children: [
                K.slice(0, 80).map((h, D) =>
                  n.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between gap-3 py-2 text-xs",
                      children: [
                        n.jsxs("div", {
                          className: "min-w-0",
                          children: [
                            n.jsx("span", {
                              className: "font-bold text-[#16161A]",
                              children:
                                h.userName || h.user_name || h.login || "Пользователь",
                            }),
                            n.jsx("span", {
                              className: "mx-1.5 text-[#8F8A94]",
                              children: "·",
                            }),
                            n.jsx("span", {
                              className: "font-semibold text-[#93161B]",
                              children: h.screen,
                            }),
                            n.jsx("span", {
                              className: "mx-1 text-[#8F8A94]",
                              children: "→",
                            }),
                            n.jsx("span", {
                              className: "text-[#5C5861]",
                              children: h.action,
                            }),
                          ],
                        }),
                        n.jsx("span", {
                          className: "shrink-0 text-[11px] text-[#8F8A94] tabular-nums",
                          children: yi(h.createdAt || h.created_at),
                        }),
                      ],
                    },
                    h.id || D,
                  ),
                ),
                !K.length &&
                  n.jsx("p", {
                    className: "py-6 text-center text-xs text-[#8F8A94]",
                    children: "Записей активности пока нет.",
                  }),
              ],
            }),
          ],
        }),
    ],
  });
}
function Vu({
  value: r,
  onChange: m,
  placeholder: x,
  disabled: u,
  autoComplete: p = "current-password",
}) {
  const [F, M] = d.useState(!1);
  return n.jsxs("div", {
    className: "relative",
    children: [
      n.jsx("input", {
        type: F ? "text" : "password",
        value: r,
        onChange: (B) => m(B.target.value),
        placeholder: x,
        disabled: u,
        autoComplete: p,
        className:
          "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 pr-11 text-sm font-medium text-[#16161A] placeholder:text-[#8F8A94] focus:border-[#93161B] focus:bg-white focus:outline-none transition",
      }),
      n.jsx("button", {
        type: "button",
        onClick: () => M((B) => !B),
        disabled: u,
        "aria-label": F ? "Скрыть пароль" : "Показать пароль",
        className:
          "absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8F8A94] hover:text-[#16161A]",
        children: F
          ? n.jsx(pg, { className: "h-4 w-4" })
          : n.jsx(gg, { className: "h-4 w-4" }),
      }),
    ],
  });
}
function ry({ catalog: r, onAuthenticated: m, onOpenBible: x }) {
  const u = fb(r?.directions),
    [p, F] = d.useState("login"),
    [M, B] = d.useState(() => Ig()),
    [q, J] = d.useState(""),
    [ae, G] = d.useState(""),
    [L, Q] = d.useState(""),
    [X, H] = d.useState(u[0]?.name || "Теология"),
    [R, Z] = d.useState(1),
    [ie, Y] = d.useState(""),
    [ne, me] = d.useState(""),
    [re, $] = d.useState(""),
    [Me, De] = d.useState(""),
    [je, ue] = d.useState(""),
    [oe, de] = d.useState(""),
    [se, ge] = d.useState(!1),
    [U, ce] = d.useState(""),
    [le, we] = d.useState(!1),
    [Ee, Te] = d.useState(""),
    [Re, Ne] = d.useState("");
  d.useEffect(() => {
    let V = !0;
    return (
      !/\.github\.io$/i.test(location.hostname) &&
        fetch("/api/web/status", { headers: { Accept: "application/json" } })
          .then((Ce) => (Ce.ok ? Ce.json() : null))
          .then((Ce) => {
            V && Ce?.localSqlite?.ready && we(!0);
          })
          .catch(() => {}),
      () => {
        V = !1;
      }
    );
  }, []);
  const h = (u.find((V) => V.name === X) || u[0])?.courses || [1, 2, 3, 4],
    D = async (V) => {
      if ((V.preventDefault(), Te(""), de(""), !ne.trim())) {
        Te("Введите ваш логин для отправки кода восстановления.");
        return;
      }
      ge(!0);
      try {
        const Ce = await be("/api/mobile/auth/password-reset/request", {
          method: "POST",
          retryOn403: !0,
          retryOn404: !0,
          body: { login: ne.trim() },
        });
        (Y("confirm"),
          de(
            Ce.message ||
              "Если аккаунт связан с Telegram-ботом @ucheba_ZAU_bot, код отправлен в личные сообщения.",
          ));
      } catch (Ce) {
        Te(Ce?.message || "Не удалось запросить код восстановления.");
      } finally {
        ge(!1);
      }
    },
    he = async (V) => {
      if ((V.preventDefault(), Te(""), !re.trim())) {
        Te("Введите одноразовый код из Telegram.");
        return;
      }
      if (Me.length < 8) {
        Te("Новый пароль должен содержать не менее 8 символов.");
        return;
      }
      if (Me !== je) {
        Te("Пароли не совпадают.");
        return;
      }
      ge(!0);
      try {
        const Ce = await be("/api/mobile/auth/password-reset/confirm", {
          method: "POST",
          retryOn403: !0,
          retryOn404: !0,
          body: { login: ne.trim(), code: re.trim(), newPassword: Me },
        });
        (J(ne.trim()),
          G(""),
          Y(""),
          $(""),
          De(""),
          ue(""),
          de(""),
          Ne(Ce.message || "Пароль обновлён. Войдите с новым паролем."));
      } catch (Ce) {
        Te(Ce?.message || "Не удалось подтвердить смену пароля.");
      } finally {
        ge(!1);
      }
    },
    Ae = async (V) => {
      if ((V.preventDefault(), Te(""), Ne(""), !q.trim() || !ae)) {
        Te("Пожалуйста, введите логин и пароль.");
        return;
      }
      if (p === "register") {
        if (ae.length < 5) {
          Te("Пароль должен содержать минимум 5 символов.");
          return;
        }
        if (!X) {
          Te("Выберите факультет (направление обучения).");
          return;
        }
      }
      ge(!0);
      try {
        if (p === "login") {
          const Ce = await be("/api/mobile/auth/login", {
            method: "POST",
            retryOn403: !0,
            body: { login: q.trim(), password: ae },
          });
          m(Ce.token, Ce.user);
        } else {
          const Ce = await be("/api/mobile/auth/register", {
            method: "POST",
            retryOn403: !0,
            body: {
              login: q.trim(),
              password: ae,
              displayName: L.trim() || q.trim(),
              direction: X,
              course: R,
            },
          });
          m(Ce.token, Ce.user);
        }
      } catch (Ce) {
        Te(Ce?.message || "Ошибка авторизации. Проверьте логин и пароль.");
      } finally {
        ge(!1);
      }
    };
  return n.jsxs("div", {
    className: "min-h-screen bg-[#FAF8F5] flex flex-col lg:flex-row",
    children: [
      n.jsxs("section", {
        className:
          "zau-hero-gradient relative overflow-hidden text-white px-6 py-8 sm:px-10 lg:w-[44%] lg:min-h-screen lg:flex lg:flex-col lg:justify-between lg:p-12",
        children: [
          n.jsx("div", {
            "aria-hidden": "true",
            className:
              "pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full border border-white/10",
          }),
          n.jsx("div", {
            "aria-hidden": "true",
            className:
              "pointer-events-none absolute -right-12 -bottom-12 h-56 w-56 rounded-full border border-[#F0C274]/15",
          }),
          n.jsx("div", {
            className: "relative z-10 flex items-center justify-between gap-3",
            children: n.jsxs("div", {
              className:
                "inline-flex items-center gap-2 rounded-full bg-black/20 border border-white/15 px-3.5 py-1.5 text-xs font-bold text-white/90",
              children: [
                n.jsx(bg, { className: "h-3.5 w-3.5 text-[#86EFAC]" }),
                n.jsx("span", { children: "ЗАУ Учёба · Единый аккаунт" }),
              ],
            }),
          }),
          n.jsxs("div", {
            className: "relative z-10 my-7 lg:my-auto max-w-md",
            children: [
              n.jsx("div", {
                className:
                  "mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/12 border border-[#F0C274]/30 shadow-xs",
                children: n.jsx(bs, { size: 44, variant: "light" }),
              }),
              n.jsx("p", {
                className:
                  "text-xs font-extrabold tracking-[0.16em] text-[#F0C274] uppercase",
                children: "ЗАУ • 1988 • Учись, служи, вдохновляй",
              }),
              n.jsx("h1", {
                className:
                  "mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight",
                children: "Заокский университет",
              }),
              n.jsxs("p", {
                className: "mt-3 text-sm sm:text-base leading-relaxed text-white/82",
                children: [
                  "Единое учебное веб-пространство «ЗАУ Учёба», синхронизированное с мобильным приложением и Telegram-ботом ",
                  n.jsx("strong", {
                    className: "text-white",
                    children: "@ucheba_ZAU_bot",
                  }),
                  ".",
                ],
              }),
              n.jsxs("div", {
                className: "mt-6 hidden sm:grid grid-cols-2 gap-3",
                children: [
                  n.jsxs("div", {
                    className: "rounded-2xl bg-black/18 border border-white/10 p-3.5",
                    children: [
                      n.jsx("p", {
                        className: "text-xs font-extrabold text-white",
                        children: "Расписание Пн–Пт и ДЗ",
                      }),
                      n.jsx("p", {
                        className: "mt-1 text-[11.5px] leading-relaxed text-white/75",
                        children:
                          "Живая таблица пар EduPage, отметки ДЗ, конспекты и экспорт Word.",
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className: "rounded-2xl bg-black/18 border border-white/10 p-3.5",
                    children: [
                      n.jsx("p", {
                        className: "text-xs font-extrabold text-white",
                        children: "ИИ-тренажёр и Библия",
                      }),
                      n.jsx("p", {
                        className: "mt-1 text-[11.5px] leading-relaxed text-white/75",
                        children:
                          "Самопроверка по лекциям, субботний покой и 66 книг Библии офлайн.",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          n.jsxs("div", {
            className:
              "relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/12",
            children: [
              n.jsxs("button", {
                type: "button",
                onClick: x,
                className:
                  "inline-flex items-center gap-2 rounded-xl bg-white/12 border border-[#F0C274]/30 px-4 py-2 text-xs font-extrabold text-white hover:bg-white/20 transition",
                children: [
                  n.jsx(ma, { className: "h-4 w-4 text-[#F0C274]" }),
                  "Открыть Синодальную Библию офлайн",
                ],
              }),
              n.jsx("span", {
                className: "text-[11px] font-semibold text-white/60",
                children: n.jsx(WebStatus, {}),
              }),
            ],
          }),
        ],
      }),
      n.jsx("main", {
        className: "flex-1 flex items-center justify-center px-4 py-8 sm:px-8 lg:p-12",
        children: n.jsx("div", {
          className: "w-full max-w-md",
          children: n.jsx("div", {
            className: "zau-card p-6 sm:p-7",
            children: ie
              ? n.jsxs("form", {
                  onSubmit: ie === "request" ? D : he,
                  className: "space-y-4",
                  children: [
                    n.jsxs("div", {
                      className: "flex items-center gap-2.5",
                      children: [
                        n.jsx("div", {
                          className:
                            "flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCEEEE] text-[#93161B]",
                          children: n.jsx(rd, { className: "h-5 w-5" }),
                        }),
                        n.jsxs("div", {
                          children: [
                            n.jsx("h2", {
                              className: "text-base font-extrabold text-[#16161A]",
                              children:
                                ie === "request"
                                  ? "Восстановление пароля"
                                  : "Подтверждение кода",
                            }),
                            n.jsx("p", {
                              className: "text-xs text-[#5C5861]",
                              children: "Через привязанный @ucheba_ZAU_bot",
                            }),
                          ],
                        }),
                      ],
                    }),
                    n.jsx("p", {
                      className: "text-xs leading-relaxed text-[#5C5861]",
                      children:
                        ie === "request"
                          ? "Введите ваш логин. Если аккаунт связан с Telegram-ботом ЗАУ, бот пришлёт одноразовый код."
                          : oe || "Введите код из Telegram и задайте новый пароль.",
                    }),
                    n.jsxs("div", {
                      children: [
                        n.jsx("label", {
                          className: "block text-xs font-bold text-[#16161A] mb-1.5",
                          children: "Логин",
                        }),
                        n.jsx("input", {
                          type: "text",
                          value: ne,
                          onChange: (V) => me(V.target.value),
                          disabled: se || ie === "confirm",
                          placeholder: "student_zau",
                          className:
                            "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-medium text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none disabled:opacity-65",
                        }),
                      ],
                    }),
                    ie === "confirm" &&
                      n.jsxs(n.Fragment, {
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className:
                                  "block text-xs font-bold text-[#16161A] mb-1.5",
                                children: "Одноразовый код из Telegram",
                              }),
                              n.jsx("input", {
                                type: "text",
                                inputMode: "numeric",
                                value: re,
                                onChange: (V) => $(V.target.value),
                                placeholder: "6-значный код",
                                className:
                                  "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-bold tracking-widest text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className:
                                  "block text-xs font-bold text-[#16161A] mb-1.5",
                                children: "Новый пароль",
                              }),
                              n.jsx(Vu, {
                                value: Me,
                                onChange: De,
                                placeholder: "Минимум 8 символов",
                                disabled: se,
                                autoComplete: "new-password",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className:
                                  "block text-xs font-bold text-[#16161A] mb-1.5",
                                children: "Повторите новый пароль",
                              }),
                              n.jsx(Vu, {
                                value: je,
                                onChange: ue,
                                placeholder: "Повторите пароль",
                                disabled: se,
                                autoComplete: "new-password",
                              }),
                            ],
                          }),
                        ],
                      }),
                    Ee &&
                      n.jsxs("div", {
                        className:
                          "flex items-start gap-2 rounded-xl border border-[#F5C6C6] bg-[#FFF0F0] p-3 text-xs font-semibold text-[#C92A2A]",
                        children: [
                          n.jsx(Ch, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                          n.jsx("span", { children: Ee }),
                        ],
                      }),
                    n.jsxs("button", {
                      type: "submit",
                      disabled: se,
                      className:
                        "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#93161B] py-3 text-sm font-extrabold text-white shadow-xs hover:bg-[#6B0D12] disabled:opacity-55 transition",
                      children: [
                        se && n.jsx(ot, { className: "h-4 w-4 animate-spin" }),
                        ie === "request"
                          ? "Получить код в Telegram"
                          : "Сохранить новый пароль",
                      ],
                    }),
                    n.jsx("button", {
                      type: "button",
                      disabled: se,
                      onClick: () => {
                        (Y(""), $(""), De(""), ue(""), Te(""), de(""));
                      },
                      className:
                        "w-full py-1.5 text-xs font-bold text-[#93161B] hover:underline",
                      children: "Вернуться ко входу",
                    }),
                  ],
                })
              : n.jsxs(n.Fragment, {
                  children: [
                    n.jsxs("div", {
                      className:
                        "grid grid-cols-2 gap-1 rounded-xl bg-[#F3EFEA] p-1 mb-5",
                      children: [
                        n.jsx("button", {
                          type: "button",
                          disabled: se,
                          onClick: () => {
                            (F("login"), Te(""), Ne(""));
                          },
                          className: `rounded-lg py-2 text-xs font-extrabold transition ${p === "login" ? "bg-white text-[#93161B] shadow-2xs" : "text-[#5C5861] hover:text-[#16161A]"}`,
                          children: "Вход",
                        }),
                        n.jsx("button", {
                          type: "button",
                          disabled: se,
                          onClick: () => {
                            (F("register"), Te(""), Ne(""));
                          },
                          className: `rounded-lg py-2 text-xs font-extrabold transition ${p === "register" ? "bg-white text-[#93161B] shadow-2xs" : "text-[#5C5861] hover:text-[#16161A]"}`,
                          children: "Регистрация",
                        }),
                      ],
                    }),
                    n.jsxs("form", {
                      onSubmit: Ae,
                      className: "space-y-4",
                      children: [
                        p === "register" &&
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className:
                                  "block text-xs font-bold text-[#16161A] mb-1.5",
                                children: "Имя и фамилия",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: L,
                                onChange: (V) => Q(V.target.value),
                                disabled: se,
                                placeholder: "Например: Даниил Кушнир",
                                autoComplete: "name",
                                className:
                                  "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-medium text-[#16161A] placeholder:text-[#8F8A94] focus:border-[#93161B] focus:bg-white focus:outline-none transition",
                              }),
                            ],
                          }),
                        n.jsxs("div", {
                          children: [
                            n.jsx("label", {
                              className: "block text-xs font-bold text-[#16161A] mb-1.5",
                              children: "Логин",
                            }),
                            n.jsx("input", {
                              type: "text",
                              value: q,
                              onChange: (V) => J(V.target.value),
                              disabled: se,
                              placeholder:
                                p === "login"
                                  ? "Ваш логин (как в приложении ЗАУ)"
                                  : "Придумайте логин",
                              autoComplete: "username",
                              autoCapitalize: "none",
                              autoCorrect: "off",
                              className:
                                "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-medium text-[#16161A] placeholder:text-[#8F8A94] focus:border-[#93161B] focus:bg-white focus:outline-none transition",
                            }),
                          ],
                        }),
                        n.jsxs("div", {
                          children: [
                            n.jsxs("div", {
                              className: "flex items-center justify-between mb-1.5",
                              children: [
                                n.jsx("label", {
                                  className: "text-xs font-bold text-[#16161A]",
                                  children: "Пароль",
                                }),
                                p === "login" &&
                                  n.jsx("button", {
                                    type: "button",
                                    disabled: se,
                                    onClick: () => {
                                      (me(q.trim()), Y("request"), Te(""), Ne(""));
                                    },
                                    className:
                                      "text-xs font-bold text-[#93161B] hover:underline",
                                    children: "Забыли пароль?",
                                  }),
                              ],
                            }),
                            n.jsx(Vu, {
                              value: ae,
                              onChange: G,
                              placeholder:
                                p === "register"
                                  ? "Минимум 5 символов"
                                  : "Введите пароль",
                              disabled: se,
                              autoComplete:
                                p === "register" ? "new-password" : "current-password",
                            }),
                          ],
                        }),
                        p === "register" &&
                          n.jsxs(n.Fragment, {
                            children: [
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className:
                                      "block text-xs font-bold text-[#16161A] mb-1.5",
                                    children: "Факультет (направление)",
                                  }),
                                  n.jsx("select", {
                                    value: X,
                                    onChange: (V) => H(V.target.value),
                                    disabled: se,
                                    className:
                                      "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                                    children: u.map((V) =>
                                      n.jsx(
                                        "option",
                                        { value: V.name, children: V.name },
                                        V.id,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className:
                                      "block text-xs font-bold text-[#16161A] mb-1.5",
                                    children: "Курс обучения",
                                  }),
                                  n.jsx("div", {
                                    className: "grid grid-cols-4 gap-2",
                                    children: h.map((V) =>
                                      n.jsxs(
                                        "button",
                                        {
                                          type: "button",
                                          disabled: se,
                                          onClick: () => Z(V),
                                          className: `rounded-xl border py-2 text-xs font-extrabold transition ${R === V ? "border-[#93161B] bg-[#93161B] text-white" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861] hover:text-[#16161A]"}`,
                                          children: [V, " курс"],
                                        },
                                        V,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        Ee &&
                          n.jsxs("div", {
                            className:
                              "flex items-start gap-2 rounded-xl border border-[#F5C6C6] bg-[#FFF0F0] p-3 text-xs font-semibold text-[#C92A2A]",
                            children: [
                              n.jsx(Ch, {
                                className: "h-4 w-4 shrink-0 mt-0.5",
                              }),
                              n.jsx("span", { children: Ee }),
                            ],
                          }),
                        Re &&
                          n.jsxs("div", {
                            className:
                              "flex items-start gap-2 rounded-xl border border-[#BFE6D3] bg-[#E8F6EF] p-3 text-xs font-semibold text-[#1F6E4E]",
                            children: [
                              n.jsx(ur, {
                                className: "h-4 w-4 shrink-0 mt-0.5",
                              }),
                              n.jsx("span", { children: Re }),
                            ],
                          }),
                        n.jsxs("button", {
                          type: "submit",
                          disabled: se,
                          className:
                            "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#93161B] py-3 text-sm font-extrabold text-white shadow-xs hover:bg-[#6B0D12] disabled:opacity-55 transition",
                          children: [
                            se && n.jsx(ot, { className: "h-4 w-4 animate-spin" }),
                            p === "login"
                              ? "Войти в учебный кабинет"
                              : "Создать аккаунт студента",
                          ],
                        }),
                      ],
                    }),
                    p === "login" &&
                      M !== "local" &&
                      new URLSearchParams(location.search).has("guest") &&
                      n.jsx(WebGuestLink, { api: be, login: m }),
                  ],
                }),
          }),
        }),
      }),
    ],
  });
}
function mr({ cachedAt: r, onRetry: m }) {
  return n.jsxs("div", {
    className:
      "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EBD7B1] bg-[#FDF6EA] px-4 py-2.5 text-xs text-[#6E5123]",
    children: [
      n.jsxs("div", {
        className: "flex items-center gap-2.5",
        children: [
          n.jsx(yg, { className: "h-4 w-4 shrink-0 text-[#B88946]" }),
          n.jsxs("span", {
            className: "font-semibold",
            children: [
              "Показаны сохранённые офлайн-данные",
              r ? ` (обновлено ${yi(r)})` : "",
            ],
          }),
        ],
      }),
      m &&
        n.jsxs("button", {
          type: "button",
          onClick: m,
          className:
            "inline-flex items-center gap-1.5 rounded-lg border border-[#E2C899] bg-white px-2.5 py-1 text-xs font-bold text-[#6B0D12] transition hover:bg-[#FAF8F5]",
          children: [n.jsx(vn, { className: "h-3.5 w-3.5" }), "Обновить"],
        }),
    ],
  });
}
const Ql = {
    name: "Заокский, Тульская область",
    latitude: 54.76,
    longitude: 37.62,
    timeZone: "Europe/Moscow",
  },
  fa = Math.PI / 180,
  oy = 10800 * 1e3,
  Yh = [
    {
      reference: "ИСАЙЯ 40:29",
      text: "Он даёт утомлённому силу, и изнемогшему дарует крепость.",
    },
    {
      reference: "МАТФЕЯ 11:28",
      text: "Придите ко Мне все труждающиеся и обременённые, и Я успокою вас.",
    },
    {
      reference: "ПСАЛОМ 22:1",
      text: "Господь — Пастырь мой; я ни в чём не буду нуждаться.",
    },
    {
      reference: "ПСАЛОМ 33:9",
      text: "Вкусите, и увидите, как благ Господь! Блажен человек, который уповает на Него!",
    },
    {
      reference: "ИОАННА 14:27",
      text: "Мир оставляю вам, мир Мой даю вам; не так, как мир даёт, Я даю вам. Да не смущается сердце ваше и да не устрашается.",
    },
    {
      reference: "ПРИТЧИ 3:5–6",
      text: "Надейся на Господа всем сердцем твоим, и не полагайся на разум твой. Во всех путях твоих познавай Его, и Он направит стези твои.",
    },
    {
      reference: "ПСАЛОМ 118:105",
      text: "Слово Твоё — светильник ноге моей и свет стезе моей.",
    },
    {
      reference: "ИСАЙЯ 26:3",
      text: "Твердого духом Ты хранишь в совершенном мире, ибо на Тебя уповает он.",
    },
    {
      reference: "РИМЛЯНАМ 15:13",
      text: "Бог же надежды да исполнит вас всякой радости и мира в вере, дабы вы, силою Духа Святого, обогатились надеждою.",
    },
    {
      reference: "ВТОРОЗАКОНИЕ 31:8",
      text: "Сам Господь пойдёт пред тобою, Он будет с тобою, не отступит от тебя и не оставит тебя; не бойся и не ужасайся.",
    },
    {
      reference: "ПСАЛОМ 36:5",
      text: "Предай Господу путь твой и уповай на Него, и Он совершит.",
    },
    {
      reference: "1 ПЕТРА 5:7",
      text: "Все заботы ваши возложите на Него, ибо Он печётся о вас.",
    },
  ];
function uy(r, m) {
  try {
    const x = new Intl.DateTimeFormat("en-US", {
        timeZone: m,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(r),
      u = Object.fromEntries(x.map((p) => [p.type, p.value]));
    return { year: Number(u.year), month: Number(u.month), day: Number(u.day) };
  } catch {
    const x = new Date(r.getTime() + 108e5);
    return {
      year: x.getUTCFullYear(),
      month: x.getUTCMonth() + 1,
      day: x.getUTCDate(),
    };
  }
}
function yb({ year: r, month: m, day: x }) {
  return `${String(r).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(x).padStart(2, "0")}`;
}
function $u(r, m) {
  const [x, u, p] = String(r).split("-").map(Number),
    F = new Date(Date.UTC(x, u - 1, p + m));
  return yb({
    year: F.getUTCFullYear(),
    month: F.getUTCMonth() + 1,
    day: F.getUTCDate(),
  });
}
function Ju(r, m, x) {
  const [u, p, F] = String(r).split("-").map(Number),
    M = Date.UTC(u, p - 1, F),
    B = Math.floor((M - Date.UTC(u, 0, 0)) / 864e5),
    q = x / 15,
    J = B + (18 - q) / 24,
    ae = 0.9856 * J - 3.289,
    G =
      (((ae + 1.916 * Math.sin(ae * fa) + 0.02 * Math.sin(2 * ae * fa) + 282.634) % 360) +
        360) %
      360;
  let L = Math.atan(0.91764 * Math.tan(G * fa)) / fa;
  ((L = ((L % 360) + 360) % 360),
    (L += Math.floor(G / 90) * 90 - Math.floor(L / 90) * 90),
    (L /= 15));
  const Q = 0.39782 * Math.sin(G * fa),
    X = Math.cos(Math.asin(Q)),
    H = (Math.cos(90.833 * fa) - Q * Math.sin(m * fa)) / (X * Math.cos(m * fa));
  if (H < -1 || H > 1) return null;
  let ie = (Math.acos(H) / fa / 15 + L - 0.06571 * J - 6.622 - q) % 24;
  return (ie < 0 && (ie += 24), new Date(M + ie * 36e5));
}
function ad(r) {
  if (!(r instanceof Date) || Number.isNaN(r.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone: Ql.timeZone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(r);
  } catch {
    const m = new Date(r.getTime() + 108e5);
    return `${String(m.getUTCHours()).padStart(2, "0")}:${String(m.getUTCMinutes()).padStart(2, "0")}`;
  }
}
function dy(r) {
  let m = 2166136261;
  for (let x = 0; x < r.length; x += 1)
    ((m ^= r.charCodeAt(x)), (m = Math.imul(m, 16777619)));
  return m >>> 0;
}
function fy(r = "guest", m = new Date()) {
  const x = m instanceof Date && !Number.isNaN(m.getTime()) ? m : new Date(),
    u = dy(String(r || "guest")),
    p = Yh.length,
    F = Math.floor(x.getTime() / oy),
    M = u % p,
    B = [1, 5, 7, 11],
    q = B[Math.floor(u / p) % B.length],
    J = (((M + F * q) % p) + p) % p;
  return Yh[J];
}
function gn(r = new Date()) {
  const m = uy(r, Ql.timeZone),
    x = yb(m),
    u = new Date(Date.UTC(m.year, m.month - 1, m.day)).getUTCDay(),
    p = (5 - u + 7) % 7,
    F = $u(x, p),
    M = Ju(F, Ql.latitude, Ql.longitude);
  if (u !== 5 && u !== 6)
    return {
      active: !1,
      isSaturday: !1,
      startAt: null,
      endAt: null,
      nextFridaySunset: M,
      location: Ql.name,
    };
  const B = u === 5 ? x : $u(x, -1),
    q = $u(B, 1),
    J = Ju(B, Ql.latitude, Ql.longitude),
    ae = Ju(q, Ql.latitude, Ql.longitude);
  return {
    active: !!(J && ae && r.getTime() >= J.getTime() && r.getTime() < ae.getTime()),
    isSaturday: u === 6,
    startAt: J,
    endAt: ae,
    nextFridaySunset: J,
    location: Ql.name,
  };
}
function vb({
  startAt: r,
  endAt: m,
  userId: x = "guest",
  globalModeEnabled: u = !1,
  modeSource: p = "",
  onOpenBible: F,
}) {
  const M =
      r instanceof Date &&
      !Number.isNaN(r.getTime()) &&
      m instanceof Date &&
      !Number.isNaN(m.getTime()),
    B = p === "local-manual",
    q = p === "global" || (!p && u && !M),
    J = fy(x, new Date()),
    ae = B
      ? "РУЧНОЕ ВКЛЮЧЕНИЕ · ЭТОТ БРАУЗЕР"
      : q
        ? "ГЛОБАЛЬНЫЙ РЕЖИМ · ДЛЯ ВСЕХ СТУДЕНТОВ"
        : "ЗАОКСКИЙ · ТУЛЬСКАЯ ОБЛАСТЬ",
    G = B
      ? "Субботний режим включён сейчас"
      : q
        ? "Субботний режим активен"
        : "С благословенной субботой!";
  return n.jsxs("section", {
    className:
      "relative overflow-hidden rounded-3xl border border-[#EBD7B1] bg-gradient-to-br from-[#FFFDF7] via-[#FCF6E8] to-[#F8EDD6] p-6 sm:p-8 shadow-sm",
    children: [
      n.jsxs("div", {
        className: "flex items-start gap-4",
        children: [
          n.jsx("div", {
            className:
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#EBD7B1] bg-white/90 text-[#B88946] shadow-xs",
            children: n.jsx(ir, { className: "h-6 w-6" }),
          }),
          n.jsxs("div", {
            className: "min-w-0 flex-1",
            children: [
              n.jsx("p", {
                className:
                  "text-[11px] font-extrabold tracking-[0.09em] text-[#9A6F32] uppercase",
                children: ae,
              }),
              n.jsx("h2", {
                className:
                  "mt-1 text-xl sm:text-2xl font-extrabold text-[#6B0D12] tracking-tight",
                children: G,
              }),
            ],
          }),
        ],
      }),
      n.jsxs("blockquote", {
        className:
          "mt-5 rounded-2xl border-l-4 border-[#B88946] bg-white/75 px-5 py-4 backdrop-blur-xs",
        children: [
          n.jsxs("p", {
            className:
              "font-scripture text-base sm:text-lg leading-relaxed text-[#16161A] italic",
            children: ["«", J.text, "»"],
          }),
          n.jsx("footer", {
            className:
              "mt-2.5 text-xs font-extrabold tracking-[0.1em] text-[#806332] uppercase",
            children: J.reference,
          }),
        ],
      }),
      n.jsx("p", {
        className: "mt-5 text-sm leading-relaxed font-semibold text-[#5C5861]",
        children:
          "Время покоя, благодарности и общения с Богом. Учебные разделы и ИИ-тренажёр временно скрыты до окончания субботнего покоя.",
      }),
      n.jsxs("div", {
        className: "mt-2.5 flex items-center gap-2 text-xs text-[#7D756C]",
        children: [
          n.jsx(vg, { className: "h-4 w-4 shrink-0 text-[#B88946]" }),
          n.jsx("span", {
            children: B
              ? "Режим включён вручную и действует только в этом браузере, пока вы не выключите переключатель в настройках."
              : q
                ? "Глобальный режим включён администратором. При необходимости его можно отключить для этого устройства в настройках."
                : M
                  ? `Субботний покой — от заката пятницы (${ad(r)}) до заката субботы (${ad(m)}) по времени Заокского.`
                  : "Автоматический субботний режим действует от заката пятницы до заката субботы.",
          }),
        ],
      }),
      n.jsxs("div", {
        className:
          "mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[#EBD7B1]/80 pt-5",
        children: [
          n.jsxs("div", {
            children: [
              n.jsx("p", {
                className: "text-sm font-extrabold text-[#6B0D12]",
                children: "Библия на субботу (66 книг)",
              }),
              n.jsx("p", {
                className: "mt-0.5 text-xs text-[#7D756C]",
                children:
                  "Синодальный перевод доступен полностью офлайн и открывается на вашем сохранённом стихе.",
              }),
            ],
          }),
          n.jsxs("button", {
            type: "button",
            onClick: F,
            className:
              "inline-flex items-center justify-center gap-2 rounded-xl bg-[#93161B] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6B0D12] active:scale-[0.99]",
            children: [n.jsx(ma, { className: "h-4 w-4" }), "Читать Библию"],
          }),
        ],
      }),
    ],
  });
}
function xy({
  user: r,
  groupKey: m,
  catalog: x,
  sabbathModeActive: u,
  sabbathModeSource: p,
  globalSabbathModeEnabled: F,
  onChangeAdminGroup: M,
  onOpenBible: B,
  onNavigateTab: q,
  onOpenQuiz: J,
  onQuickRemindForEntry: ae,
}) {
  const G = (r.isAdmin && m) || r.groupKey,
    L = xb(x?.adminDirections?.length ? x.adminDirections : x?.directions),
    Q = d.useRef(0),
    [X, H] = d.useState(null),
    [R, Z] = d.useState(!0),
    [ie, Y] = d.useState(!1),
    [ne, me] = d.useState(""),
    [re, $] = d.useState(() => gn()),
    [Me, De] = d.useState(""),
    [je, ue] = d.useState(null),
    [oe, de] = d.useState(""),
    [se, ge] = d.useState(!1),
    [U, ce] = d.useState(""),
    [le, we] = d.useState(!1),
    [Ee, Te] = d.useState(null),
    Re = d.useRef(null),
    Ne = d.useRef(null),
    K = X && String(X.groupKey || "") === String(G || "") ? X : null,
    h = d.useCallback(
      async (j = !1) => {
        const ee = ++Q.current,
          ze = String(G || ""),
          Ze = `dash_web_v1_${r.accountId || r.login || r.groupKey || "web"}_${ze}`;
        (j ? Y(!0) : Z(!0), me(""));
        let Ue = null;
        !j &&
          !r.isAdmin &&
          ((Ue = gs(Ze)),
          Ue && String(Ue.groupKey || "") === ze ? (H(Ue), Z(!1)) : (Ue = null));
        try {
          const qe = r.isAdmin ? `?groupKey=${encodeURIComponent(ze)}` : "",
            T = await be(`/api/mobile/dashboard${qe}`, {
              cacheKey: r.isAdmin ? "" : Ze,
              validateResponse: (xe) => String(xe.groupKey || "") === ze,
            });
          if (ee !== Q.current) return;
          H(T);
        } catch (qe) {
          if (ee !== Q.current) return;
          const T = qe?.status === 401 || (qe?.status === 403 && qe?.isApiResponse);
          ((!Ue || T) && H(null),
            (!Ue || T || qe?.status) &&
              me(qe?.message || "Не удалось загрузить сводку учебного дня."));
        } finally {
          ee === Q.current && (Z(!1), Y(!1));
        }
      },
      [G, r.accountId, r.groupKey, r.isAdmin, r.login],
    );
  useRecovery(() => h(false));
  (d.useEffect(
    () => (
      H(null),
      h(!1),
      () => {
        Q.current += 1;
      }
    ),
    [h],
  ),
    d.useEffect(() => {
      const j = window.setInterval(() => $(gn()), 3e4);
      return () => window.clearInterval(j);
    }, []));
  const D = async (j) => {
      if (se) return;
      if (j.size > pb) {
        ce("Максимальный размер вложения — 6 МБ.");
        return;
      }
      const ee = j.type.startsWith("image/");
      (Pe("home", ee ? "attach_homework_photo" : "attach_homework_file"),
        ge(!0),
        ce(ee ? "Загружаем изображение и распознаём текст (OCR)…" : "Прикрепляем файл…"));
      try {
        const ze = ee
            ? await gb(j)
            : {
                fileName: j.name || "homework-file",
                mimeType: j.type || "application/octet-stream",
                base64: await xs(j),
              },
          Le = await be("/api/mobile/upload", {
            method: "POST",
            body: { ...ze, runOcr: ee },
          });
        (ue(Le.file),
          de(Le.ocrText || ""),
          ce(
            ee && Le.ocrText
              ? `Фото прикреплено · распознано ${Le.ocrText.length} симв.`
              : `Файл «${Le.file.name}» прикреплён. Добавьте описание или отправьте.`,
          ));
      } catch (ze) {
        ce(`Ошибка загрузки: ${ze?.message || "попробуйте другой файл"}`);
      } finally {
        ge(!1);
      }
    },
    he = (j) => {
      const ee = j.clipboardData?.items;
      if (ee) {
        for (let ze = 0; ze < ee.length; ze += 1)
          if (ee[ze].type.startsWith("image/")) {
            const Le = ee[ze].getAsFile();
            if (Le) {
              (j.preventDefault(), D(Le));
              return;
            }
          }
      }
    },
    Ae = async (j = "") => {
      if (!(!Me.trim() && !je)) {
        (Pe("home", j ? "confirm_smart_homework" : "submit_smart_input"), ge(!0));
        try {
          const ee = r.isAdmin ? `?groupKey=${encodeURIComponent(G)}` : "",
            ze = await be(`/api/mobile/smart-input${ee}`, {
              method: "POST",
              body: {
                text: Me.trim(),
                files: je ? [je] : [],
                ocrText: oe,
                subjectId: j || void 0,
                forceSave: !!j,
              },
            });
          if (ze.kind === "needs_confirm") {
            (Te(ze), ge(!1));
            return;
          }
          (Te(null),
            De(""),
            ue(null),
            de(""),
            ce(ze.message || "Сохранено и синхронизировано!"),
            await h(!0));
        } catch (ee) {
          ce(`Ошибка: ${ee?.message || "не удалось сохранить запись"}`);
        } finally {
          ge(!1);
        }
      }
    },
    V = async (j) => {
      (Pe("home", "toggle_homework_done"), me(""));
      const ee = r.isAdmin ? `?groupKey=${encodeURIComponent(G)}` : "";
      try {
        const ze = await be(
          `/api/mobile/entries/${encodeURIComponent(j.id)}/toggle-done${ee}`,
          {
            method: "POST",
            retryTransport: !1,
            validateResponse: (Le) => String(Le.groupKey || "") === String(G || ""),
            body: { collection: j.collection || "hw" },
          },
        );
        H((Le) => {
          if (!Le) return Le;
          const Ze = Le.homework || [],
            Ue = Ze.find((T) => String(T.id) === String(j.id)),
            qe = Ue ? +!!ze.isDone - +!!Ue.isDone : 0;
          return {
            ...Le,
            homework: Ze.map((T) =>
              String(T.id) === String(j.id) ? { ...T, isDone: !!ze.isDone } : T,
            ),
            stats: {
              ...Le.stats,
              pendingHwCount: Math.max(0, Number(Le.stats?.pendingHwCount || 0) - qe),
              completedHwCount: Math.max(0, Number(Le.stats?.completedHwCount || 0) + qe),
              totalHwCount: Math.max(0, Number(Le.stats?.totalHwCount || Ze.length || 0)),
            },
          };
        });
      } catch (ze) {
        me(ze?.message || "Не удалось обновить статус домашнего задания.");
      }
    },
    Ce = (r.displayName || r.login || "Студент").split(" ")[0];
  return n.jsxs("div", {
    className: "space-y-6",
    children: [
      n.jsxs("section", {
        className:
          "zau-hero-gradient rounded-3xl p-5 sm:p-7 text-white relative overflow-hidden",
        children: [
          n.jsx("div", {
            "aria-hidden": "true",
            className:
              "pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/[0.05]",
          }),
          n.jsxs("div", {
            className:
              "relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
            children: [
              n.jsxs("div", {
                className: "flex items-center gap-3.5",
                children: [
                  n.jsx("div", {
                    className:
                      "hidden sm:flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white/12 border border-[#F0C274]/30",
                    children: n.jsx(bs, { size: 38, variant: "light" }),
                  }),
                  n.jsxs("div", {
                    children: [
                      n.jsxs("p", {
                        className:
                          "text-[11px] font-extrabold tracking-[0.12em] text-[#F0C274] uppercase",
                        children: [
                          "Заокский университет · ",
                          Number(x?.activeSemester) || fs(),
                          " семестр",
                        ],
                      }),
                      n.jsxs("h2", {
                        className:
                          "text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5",
                        children: ["Привет, ", Ce, "!"],
                      }),
                      n.jsx("p", {
                        className: "text-xs sm:text-sm text-white/80 mt-0.5",
                        children: r.isAdmin
                          ? `Режим администратора · группа «${G}»`
                          : `${r.direction} · ${r.course} курс · ${r.roleLabel}`,
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                  r.isAdmin &&
                    n.jsxs("div", {
                      className: "lg:hidden relative",
                      children: [
                        n.jsx("select", {
                          value: G,
                          onChange: (j) => M(j.target.value),
                          className:
                            "appearance-none rounded-xl bg-black/25 border border-white/20 pl-3 pr-7 py-2 text-xs font-bold text-white",
                          children: L.map((j) =>
                            n.jsx(
                              "option",
                              {
                                value: j.groupKey,
                                className: "text-[#16161A] bg-white",
                                children: j.label,
                              },
                              j.groupKey,
                            ),
                          ),
                        }),
                        n.jsx($h, {
                          className:
                            "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/80",
                        }),
                      ],
                    }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => q("profile"),
                    className: `inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${r.linkedTelegramId ? "border-[#8BE8B9]/40 bg-[#1F6E4E]/55 text-white hover:bg-[#1F6E4E]/75" : "border-white/20 bg-white/12 text-white hover:bg-white/20"}`,
                    children: [
                      n.jsx(cd, { className: "h-3.5 w-3.5" }),
                      r.linkedTelegramId ? "Telegram связан" : "Связать с /app",
                    ],
                  }),
                  !u &&
                    n.jsx("button", {
                      type: "button",
                      onClick: () => h(!0),
                      disabled: ie,
                      title: "Обновить данные",
                      className:
                        "inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/12 p-2 text-white hover:bg-white/20 transition",
                      children: n.jsx(vn, {
                        className: `h-4 w-4 ${ie ? "animate-spin" : ""}`,
                      }),
                    }),
                ],
              }),
            ],
          }),
        ],
      }),
      K?._offline && !u && n.jsx(mr, { cachedAt: K._cachedAt, onRetry: () => h(!0) }),
      ne &&
        !u &&
        n.jsxs("div", {
          className:
            "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F5C6C6] bg-[#FFF0F0] px-4 py-3 text-xs font-bold text-[#8B1E24]",
          children: [
            n.jsxs("span", { children: ["Не удалось загрузить сводку: ", ne] }),
            n.jsx("button", {
              type: "button",
              onClick: () => h(!0),
              className:
                "rounded-lg bg-[#93161B] px-3 py-1.5 text-white hover:bg-[#6B0D12]",
              children: "Повторить",
            }),
          ],
        }),
      u
        ? n.jsx(vb, {
            startAt: re.startAt,
            endAt: re.endAt,
            modeSource: p || (F ? "global" : "calendar"),
            globalModeEnabled: F,
            userId: r.accountId || r.effectiveUserId || r.login,
            onOpenBible: B,
          })
        : n.jsxs(n.Fragment, {
            children: [
              n.jsxs("section", {
                className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
                children: [
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => q("study", "hw"),
                    className:
                      "zau-card p-4 text-left hover:border-[#93161B]/40 transition group",
                    children: [
                      n.jsx("p", {
                        className:
                          "text-xs font-bold text-[#5C5861] group-hover:text-[#93161B] transition",
                        children: "Осталось ДЗ",
                      }),
                      n.jsx("p", {
                        className:
                          "mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#93161B] tabular-nums",
                        children: K?.stats?.pendingHwCount ?? 0,
                      }),
                    ],
                  }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => q("study", "hw"),
                    className:
                      "zau-card p-4 text-left hover:border-[#1F6E4E]/40 transition group",
                    children: [
                      n.jsxs("div", {
                        className: "flex items-center justify-between gap-1",
                        children: [
                          n.jsx("p", {
                            className:
                              "text-xs font-bold text-[#5C5861] group-hover:text-[#1F6E4E] transition",
                            children: "Выполнено",
                          }),
                          !!K?.stats?.totalHwCount &&
                            n.jsxs("span", {
                              className:
                                "rounded-md bg-[#E8F6EF] px-1.5 py-0.5 text-[10px] font-extrabold text-[#1F6E4E] tabular-nums",
                              children: [
                                Math.round(
                                  ((K?.stats?.completedHwCount || 0) /
                                    Math.max(1, K?.stats?.totalHwCount || 1)) *
                                    100,
                                ),
                                "%",
                              ],
                            }),
                        ],
                      }),
                      n.jsx("p", {
                        className:
                          "mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#1F6E4E] tabular-nums",
                        children: K?.stats?.completedHwCount ?? 0,
                      }),
                    ],
                  }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => q("reminders"),
                    className:
                      "zau-card p-4 text-left hover:border-[#B88946]/50 transition group",
                    children: [
                      n.jsx("p", {
                        className:
                          "text-xs font-bold text-[#5C5861] group-hover:text-[#9A6F32] transition",
                        children: "Напоминаний",
                      }),
                      n.jsx("p", {
                        className:
                          "mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#B88946] tabular-nums",
                        children: K?.stats?.activeRemindersCount ?? 0,
                      }),
                    ],
                  }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => q("study", "notes"),
                    className:
                      "zau-card p-4 text-left hover:border-[#93161B]/40 transition group",
                    children: [
                      n.jsx("p", {
                        className:
                          "text-xs font-bold text-[#5C5861] group-hover:text-[#16161A] transition",
                        children: "Дисциплин",
                      }),
                      n.jsx("p", {
                        className:
                          "mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#16161A] tabular-nums",
                        children: K?.subjectsCount ?? 0,
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs("section", {
                onDragOver: (j) => {
                  (j.preventDefault(), we(!0));
                },
                onDragLeave: () => we(!1),
                onDrop: (j) => {
                  (j.preventDefault(), we(!1));
                  const ee = j.dataTransfer.files?.[0];
                  ee && D(ee);
                },
                className: `zau-card p-4 sm:p-5 transition ${le ? "border-[#93161B] ring-2 ring-[#93161B]/20 bg-[#FCEEEE]/30" : ""}`,
                children: [
                  n.jsxs("div", {
                    className: "flex flex-wrap items-center justify-between gap-2 mb-2.5",
                    children: [
                      n.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          n.jsx(or, { className: "h-4 w-4 text-[#93161B]" }),
                          n.jsx("h3", {
                            className: "text-sm font-extrabold text-[#16161A]",
                            children: "Быстрое ДЗ или напоминание в одну строку",
                          }),
                        ],
                      }),
                      n.jsx("span", {
                        className: "hidden md:inline text-[11px] text-[#8F8A94]",
                        children: "Можно перетащить файл или вставить скриншот (Ctrl+V)",
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className: "flex items-end gap-2",
                    children: [
                      n.jsx("input", {
                        ref: Re,
                        type: "file",
                        accept: "image/*",
                        className: "hidden",
                        onChange: (j) => {
                          const ee = j.target.files?.[0];
                          ((j.target.value = ""), ee && D(ee));
                        },
                      }),
                      n.jsx("input", {
                        ref: Ne,
                        type: "file",
                        className: "hidden",
                        onChange: (j) => {
                          const ee = j.target.files?.[0];
                          ((j.target.value = ""), ee && D(ee));
                        },
                      }),
                      n.jsx("button", {
                        type: "button",
                        disabled: se,
                        onClick: () => Re.current?.click(),
                        title: "Прикрепить фото доски/конспекта с ИИ-OCR",
                        className:
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861] hover:border-[#93161B]/40 hover:text-[#93161B] disabled:opacity-50 transition",
                        children: n.jsx(ab, { className: "h-4.5 w-4.5" }),
                      }),
                      n.jsx("button", {
                        type: "button",
                        disabled: se,
                        onClick: () => Ne.current?.click(),
                        title: "Прикрепить документ (до 6 МБ)",
                        className:
                          "hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861] hover:border-[#93161B]/40 hover:text-[#93161B] disabled:opacity-50 transition",
                        children: n.jsx(Pc, { className: "h-4.5 w-4.5" }),
                      }),
                      n.jsx("input", {
                        type: "text",
                        value: Me,
                        onChange: (j) => De(j.target.value),
                        onPaste: he,
                        onKeyDown: (j) => {
                          j.key === "Enter" &&
                            !j.shiftKey &&
                            (j.preventDefault(), Ae(""));
                        },
                        placeholder:
                          "Например: «По философии прочитать гл. 3 к пятнице» или «Напомни по пн, ср в 19:00…»",
                        className:
                          "h-11 flex-1 min-w-0 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 text-sm text-[#16161A] placeholder:text-[#8F8A94] focus:border-[#93161B] focus:bg-white focus:outline-none transition",
                      }),
                      n.jsxs("button", {
                        type: "button",
                        disabled: se || (!Me.trim() && !je),
                        onClick: () => Ae(""),
                        className:
                          "inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#93161B] px-4 text-sm font-bold text-white shadow-xs hover:bg-[#6B0D12] disabled:opacity-40 transition",
                        children: [
                          se
                            ? n.jsx(ot, { className: "h-4 w-4 animate-spin" })
                            : n.jsx(fr, { className: "h-4 w-4" }),
                          n.jsx("span", {
                            className: "hidden sm:inline",
                            children: "Добавить",
                          }),
                        ],
                      }),
                    ],
                  }),
                  je &&
                    n.jsxs("div", {
                      className:
                        "mt-2.5 flex items-center justify-between gap-2 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3 py-2 text-xs",
                      children: [
                        n.jsxs("span", {
                          className: "truncate font-semibold text-[#16161A]",
                          children: [je.name, oe ? ` · OCR: ${oe.length} симв.` : ""],
                        }),
                        n.jsx("button", {
                          type: "button",
                          onClick: () => {
                            (ue(null), de(""));
                          },
                          className: "text-[#8F8A94] hover:text-[#C92A2A]",
                          "aria-label": "Удалить вложение",
                          children: n.jsx(Kt, { className: "h-4 w-4" }),
                        }),
                      ],
                    }),
                  U &&
                    n.jsx("p", {
                      className: "mt-2 text-xs font-semibold text-[#5C5861]",
                      children: U,
                    }),
                ],
              }),
              R && !K
                ? n.jsxs("div", {
                    className: "zau-card py-16 flex flex-col items-center justify-center",
                    children: [
                      n.jsx(ot, {
                        className: "h-8 w-8 animate-spin text-[#93161B]",
                      }),
                      n.jsx("p", {
                        className: "mt-3 text-xs font-bold text-[#5C5861]",
                        children: "Загружаем учебный день…",
                      }),
                    ],
                  })
                : n.jsxs("div", {
                    className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
                    children: [
                      n.jsxs("div", {
                        className: "lg:col-span-7 space-y-6",
                        children: [
                          n.jsxs("section", {
                            className: "zau-card p-5 sm:p-6",
                            children: [
                              n.jsxs("div", {
                                className: "flex items-start justify-between gap-3 mb-4",
                                children: [
                                  n.jsxs("div", {
                                    children: [
                                      n.jsx("p", {
                                        className:
                                          "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                                        children: K?.isWeekendRedirect
                                          ? "Ближайший учебный день (Пн–Пт)"
                                          : "Расписание занятий",
                                      }),
                                      n.jsx("h3", {
                                        className:
                                          "text-lg font-extrabold text-[#16161A] mt-0.5",
                                        children: K?.studyDayTitle || "Учебный день",
                                      }),
                                    ],
                                  }),
                                  n.jsxs("button", {
                                    type: "button",
                                    onClick: () => q("schedule"),
                                    className:
                                      "inline-flex items-center gap-1 rounded-xl bg-[#FCEEEE] px-3 py-1.5 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF] transition shrink-0",
                                    children: [
                                      "Вся неделя",
                                      n.jsx(qu, { className: "h-3.5 w-3.5" }),
                                    ],
                                  }),
                                ],
                              }),
                              K?.lessons?.length
                                ? n.jsx("div", {
                                    className: "space-y-2.5",
                                    children: K.lessons.map((j, ee) =>
                                      n.jsxs(
                                        "div",
                                        {
                                          className: `flex items-start gap-3.5 rounded-2xl border p-3.5 transition ${j.isCancelled ? "border-[#F5C6C6] bg-[#FFF0F0]/40 opacity-65" : j.isPast ? "border-[#E8E1D9] bg-[#FAF8F5]/70 opacity-75" : "border-[#E8E1D9] bg-[#FAF8F5]/50 hover:border-[#93161B]/30"}`,
                                          children: [
                                            n.jsxs("div", {
                                              className:
                                                "w-16 shrink-0 rounded-xl bg-white border border-[#E8E1D9] px-2 py-1.5 text-center tabular-nums",
                                              children: [
                                                n.jsx("p", {
                                                  className:
                                                    "text-xs font-extrabold text-[#93161B]",
                                                  children:
                                                    j.startTime ||
                                                    `${j.period || ee + 1} п.`,
                                                }),
                                                j.endTime &&
                                                  n.jsx("p", {
                                                    className:
                                                      "text-[10.5px] font-semibold text-[#8F8A94]",
                                                    children: j.endTime,
                                                  }),
                                              ],
                                            }),
                                            n.jsxs("div", {
                                              className: "min-w-0 flex-1",
                                              children: [
                                                n.jsxs("div", {
                                                  className:
                                                    "flex flex-wrap items-center gap-2",
                                                  children: [
                                                    n.jsx("p", {
                                                      className: `text-sm font-extrabold ${j.isCancelled ? "line-through text-[#8F8A94]" : "text-[#16161A]"}`,
                                                      children: j.subject,
                                                    }),
                                                    j.isChanged &&
                                                      n.jsx("span", {
                                                        className: `rounded-md px-2 py-0.5 text-[10px] font-extrabold ${j.isCancelled ? "bg-[#FFF0F0] text-[#C92A2A]" : "bg-[#FDF6EA] text-[#9A6F32]"}`,
                                                        children: j.isCancelled
                                                          ? "Отменено"
                                                          : "Изменено",
                                                      }),
                                                  ],
                                                }),
                                                n.jsxs("div", {
                                                  className:
                                                    "mt-1 flex flex-wrap items-center gap-3 text-xs text-[#5C5861]",
                                                  children: [
                                                    j.classrooms?.length
                                                      ? n.jsxs("span", {
                                                          className:
                                                            "inline-flex items-center gap-1 font-semibold",
                                                          children: [
                                                            n.jsx(nb, {
                                                              className:
                                                                "h-3.5 w-3.5 text-[#8F8A94]",
                                                            }),
                                                            (() => {
                                                              const ze =
                                                                j.classrooms.join(", ");
                                                              return /^(ауд|актов|зал|каб)/i.test(
                                                                ze,
                                                              )
                                                                ? ze
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    ze.slice(1)
                                                                : `Ауд. ${ze}`;
                                                            })(),
                                                          ],
                                                        })
                                                      : null,
                                                    j.teachers?.length
                                                      ? n.jsx("span", {
                                                          className: "text-[#8F8A94]",
                                                          children: j.teachers.join(", "),
                                                        })
                                                      : null,
                                                    j.note
                                                      ? n.jsx("span", {
                                                          className:
                                                            "text-[#9A6F32] font-semibold",
                                                          children: j.note,
                                                        })
                                                      : null,
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        },
                                        `${j.period}_${ee}`,
                                      ),
                                    ),
                                  })
                                : n.jsx("div", {
                                    className:
                                      "rounded-2xl bg-[#FAF8F5] border border-[#E8E1D9] p-5 text-sm text-[#5C5861]",
                                    children:
                                      "На этот учебный день пар в расписании нет — отличное время для конспектов, чтения литературы и отдыха.",
                                  }),
                            ],
                          }),
                          n.jsxs("section", {
                            className: "zau-card p-5 sm:p-6",
                            children: [
                              n.jsxs("div", {
                                className: "flex items-start justify-between gap-3 mb-4",
                                children: [
                                  n.jsxs("div", {
                                    children: [
                                      n.jsx("p", {
                                        className:
                                          "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                                        children: "Единая база с ботом",
                                      }),
                                      n.jsx("h3", {
                                        className:
                                          "text-lg font-extrabold text-[#16161A] mt-0.5",
                                        children: "Домашние задания",
                                      }),
                                    ],
                                  }),
                                  n.jsxs("button", {
                                    type: "button",
                                    onClick: () => q("study", "hw"),
                                    className:
                                      "inline-flex items-center gap-1 rounded-xl bg-[#FCEEEE] px-3 py-1.5 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF] transition shrink-0",
                                    children: [
                                      "Все ДЗ",
                                      n.jsx(qu, { className: "h-3.5 w-3.5" }),
                                    ],
                                  }),
                                ],
                              }),
                              K?.homework?.length
                                ? n.jsx("div", {
                                    className: "divide-y divide-[#F3EFEA]",
                                    children: K.homework.slice(0, 6).map((j) =>
                                      n.jsxs(
                                        "div",
                                        {
                                          className:
                                            "flex items-start gap-3 py-3.5 first:pt-0 last:pb-0",
                                          children: [
                                            n.jsx("button", {
                                              type: "button",
                                              role: "checkbox",
                                              "aria-checked": j.isDone,
                                              "aria-label": j.isDone
                                                ? "Снять отметку о выполнении ДЗ"
                                                : "Отметить ДЗ выполненным",
                                              onClick: () => V(j),
                                              className: `mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-lg border-2 transition ${j.isDone ? "border-[#1F6E4E] bg-[#1F6E4E] text-white" : "border-[#CFC5B8] bg-white hover:border-[#93161B]"}`,
                                              children:
                                                j.isDone &&
                                                n.jsx(Ni, {
                                                  className: "h-3.5 w-3.5 stroke-[3]",
                                                }),
                                            }),
                                            n.jsxs("button", {
                                              type: "button",
                                              onClick: () => q("study", "hw"),
                                              className: "min-w-0 flex-1 text-left group",
                                              children: [
                                                n.jsxs("div", {
                                                  className:
                                                    "flex items-baseline justify-between gap-2",
                                                  children: [
                                                    n.jsx("p", {
                                                      className:
                                                        "truncate text-xs font-extrabold text-[#93161B] group-hover:underline",
                                                      children: j.subjectName,
                                                    }),
                                                    n.jsx("span", {
                                                      className:
                                                        "shrink-0 text-[11px] font-semibold text-[#8F8A94] tabular-nums",
                                                      children: j.dateFormatted,
                                                    }),
                                                  ],
                                                }),
                                                n.jsx("p", {
                                                  className: `mt-1 line-clamp-2 text-sm leading-snug ${j.isDone ? "line-through text-[#8F8A94]" : "text-[#16161A] font-medium"}`,
                                                  children: j.preview,
                                                }),
                                              ],
                                            }),
                                            n.jsx("button", {
                                              type: "button",
                                              onClick: () => ae(j),
                                              title: "Создать напоминание по этому ДЗ",
                                              className:
                                                "rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] p-2 text-[#5C5861] hover:border-[#B88946] hover:bg-[#FDF6EA] hover:text-[#9A6F32] transition shrink-0",
                                              children: n.jsx(sb, {
                                                className: "h-4 w-4",
                                              }),
                                            }),
                                          ],
                                        },
                                        j.id,
                                      ),
                                    ),
                                  })
                                : n.jsx("div", {
                                    className:
                                      "rounded-2xl bg-[#FAF8F5] border border-[#E8E1D9] p-5 text-sm text-[#5C5861]",
                                    children:
                                      "По этому курсу пока нет добавленных домашних заданий.",
                                  }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "lg:col-span-5 space-y-6",
                        children: [
                          n.jsxs("section", {
                            className:
                              "rounded-3xl border border-[#EBD7B1] bg-gradient-to-br from-[#FFFDF7] to-[#F9EFE0] p-5 shadow-2xs",
                            children: [
                              n.jsxs("div", {
                                className: "flex items-start justify-between gap-3",
                                children: [
                                  n.jsxs("div", {
                                    children: [
                                      n.jsx("p", {
                                        className:
                                          "text-[10px] font-extrabold tracking-[0.1em] text-[#9A6F32] uppercase",
                                        children: "Священное Писание · Офлайн",
                                      }),
                                      n.jsx("h3", {
                                        className:
                                          "text-base font-extrabold text-[#6B0D12] mt-1",
                                        children: "Синодальная Библия (66 книг)",
                                      }),
                                      n.jsx("p", {
                                        className:
                                          "mt-1 text-xs leading-relaxed text-[#5C5861]",
                                        children:
                                          "Продолжите чтение с сохранённого стиха, ищите цитаты к семинарам и синхронизируйте закладку с телефоном.",
                                      }),
                                    ],
                                  }),
                                  n.jsx("div", {
                                    className:
                                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EBD7B1] text-[#B88946]",
                                    children: n.jsx(ma, {
                                      className: "h-5 w-5",
                                    }),
                                  }),
                                ],
                              }),
                              n.jsxs("button", {
                                type: "button",
                                onClick: B,
                                className:
                                  "mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#93161B] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#6B0D12] transition",
                                children: [
                                  "Открыть Библию",
                                  n.jsx(qu, { className: "h-3.5 w-3.5" }),
                                ],
                              }),
                            ],
                          }),
                          n.jsxs("section", {
                            className: "zau-card p-5",
                            children: [
                              n.jsx("p", {
                                className:
                                  "text-[10.5px] font-extrabold tracking-[0.08em] text-[#8F8A94] uppercase mb-3",
                                children: "Учебные материалы",
                              }),
                              n.jsx("div", {
                                className: "grid grid-cols-2 gap-2.5",
                                children: [
                                  { col: "hw", label: "Домашние ДЗ", icon: ur },
                                  {
                                    col: "notes",
                                    label: "Конспекты",
                                    icon: od,
                                  },
                                  { col: "lit", label: "Литература", icon: ib },
                                  { col: "exam", label: "Сессия", icon: cb },
                                ].map((j) => {
                                  const ee = j.icon;
                                  return n.jsxs(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () => q("study", j.col),
                                      className:
                                        "flex items-center gap-2.5 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3 py-2.5 text-left text-xs font-bold text-[#16161A] hover:border-[#93161B]/40 hover:bg-[#FCEEEE]/50 hover:text-[#93161B] transition",
                                      children: [
                                        n.jsx(ee, {
                                          className: "h-4 w-4 shrink-0 text-[#93161B]",
                                        }),
                                        n.jsx("span", {
                                          className: "truncate",
                                          children: j.label,
                                        }),
                                      ],
                                    },
                                    j.col,
                                  );
                                }),
                              }),
                            ],
                          }),
                          !!K?.recentNotes?.length &&
                            n.jsxs("section", {
                              className:
                                "rounded-3xl border border-[#F2CACA] bg-[#FCEEEE]/65 p-5",
                              children: [
                                n.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    n.jsx(gi, {
                                      className: "h-4.5 w-4.5 text-[#93161B]",
                                    }),
                                    n.jsx("p", {
                                      className:
                                        "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                                      children: "Подготовка к семинарам",
                                    }),
                                  ],
                                }),
                                n.jsx("h3", {
                                  className:
                                    "text-base font-extrabold text-[#16161A] mt-1 mb-3",
                                  children: "ИИ-Тренажёр по свежим лекциям",
                                }),
                                n.jsx("div", {
                                  className: "space-y-2",
                                  children: K.recentNotes.slice(0, 3).map((j) =>
                                    n.jsxs(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () =>
                                          J({
                                            entryId: j.id,
                                            collection: "notes",
                                            title: j.subjectName,
                                          }),
                                        className:
                                          "w-full flex items-center justify-between gap-3 rounded-2xl border border-[#F2CACA] bg-white p-3 text-left hover:border-[#93161B] transition group",
                                        children: [
                                          n.jsxs("div", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                              n.jsx("p", {
                                                className:
                                                  "truncate text-xs font-extrabold text-[#16161A]",
                                                children: j.subjectName,
                                              }),
                                              n.jsxs("p", {
                                                className:
                                                  "mt-0.5 truncate text-[11px] text-[#5C5861]",
                                                children: [
                                                  j.dateFormatted,
                                                  " · ",
                                                  j.preview,
                                                ],
                                              }),
                                            ],
                                          }),
                                          n.jsx("span", {
                                            className:
                                              "shrink-0 rounded-lg bg-[#93161B] px-2.5 py-1 text-[11px] font-bold text-white group-hover:bg-[#6B0D12]",
                                            children: "Тест →",
                                          }),
                                        ],
                                      },
                                      j.id,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          !!K?.exams?.length &&
                            n.jsxs("section", {
                              className: "zau-card p-5",
                              children: [
                                n.jsxs("div", {
                                  className: "flex items-center justify-between mb-3",
                                  children: [
                                    n.jsx("p", {
                                      className:
                                        "text-[10.5px] font-extrabold tracking-[0.08em] text-[#9A6F32] uppercase",
                                      children: "Экзамены и зачёты",
                                    }),
                                    n.jsx("button", {
                                      type: "button",
                                      onClick: () => q("study", "exam"),
                                      className:
                                        "text-xs font-bold text-[#93161B] hover:underline",
                                      children: "Все →",
                                    }),
                                  ],
                                }),
                                n.jsx("div", {
                                  className: "space-y-2",
                                  children: K.exams.slice(0, 3).map((j) =>
                                    n.jsxs(
                                      "div",
                                      {
                                        className:
                                          "rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5",
                                        children: [
                                          n.jsxs("div", {
                                            className:
                                              "flex items-center justify-between gap-2",
                                            children: [
                                              n.jsx("p", {
                                                className:
                                                  "truncate text-xs font-extrabold text-[#16161A]",
                                                children: j.subjectName,
                                              }),
                                              n.jsx("span", {
                                                className:
                                                  "shrink-0 rounded-md bg-[#FDF6EA] border border-[#EBD7B1] px-2 py-0.5 text-[10.5px] font-bold text-[#806332] tabular-nums",
                                                children: j.dateFormatted,
                                              }),
                                            ],
                                          }),
                                          n.jsx("p", {
                                            className:
                                              "mt-1 line-clamp-1 text-[11.5px] text-[#5C5861]",
                                            children: j.preview,
                                          }),
                                        ],
                                      },
                                      j.id,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          !!K?.reminders?.length &&
                            n.jsxs("section", {
                              className: "zau-card p-5",
                              children: [
                                n.jsxs("div", {
                                  className: "flex items-center justify-between mb-3",
                                  children: [
                                    n.jsx("p", {
                                      className:
                                        "text-[10.5px] font-extrabold tracking-[0.08em] text-[#8F8A94] uppercase",
                                      children: "Ближайшие напоминания",
                                    }),
                                    n.jsx("button", {
                                      type: "button",
                                      onClick: () => q("reminders"),
                                      className:
                                        "text-xs font-bold text-[#93161B] hover:underline",
                                      children: "Управлять →",
                                    }),
                                  ],
                                }),
                                n.jsx("div", {
                                  className: "space-y-2",
                                  children: K.reminders.slice(0, 3).map((j) =>
                                    n.jsxs(
                                      "div",
                                      {
                                        className:
                                          "flex items-start gap-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] px-3 py-2.5 text-xs",
                                        children: [
                                          n.jsx(ud, {
                                            className:
                                              "h-3.5 w-3.5 text-[#B88946] shrink-0 mt-0.5",
                                          }),
                                          n.jsxs("div", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                              n.jsx("p", {
                                                className:
                                                  "font-bold text-[#16161A] line-clamp-1",
                                                children: j.text,
                                              }),
                                              n.jsxs("p", {
                                                className:
                                                  "text-[11px] text-[#8F8A94] mt-0.5",
                                                children: [
                                                  j.whenFormatted,
                                                  j.repeatRule !== "none"
                                                    ? ` · ${j.repeatLabel}`
                                                    : "",
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      j.id,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
            ],
          }),
      Ee &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs",
          onClick: () => Te(null),
          children: n.jsxs("div", {
            className:
              "w-full max-w-md rounded-3xl border border-[#E8E1D9] bg-white p-6 shadow-2xl",
            onClick: (j) => j.stopPropagation(),
            children: [
              n.jsxs("div", {
                className: "flex items-center gap-2.5 text-[#93161B]",
                children: [
                  n.jsx(Ih, { className: "h-5 w-5" }),
                  n.jsx("h3", {
                    className: "text-base font-extrabold text-[#16161A]",
                    children: "К какому предмету отнести ДЗ?",
                  }),
                ],
              }),
              Ee.cleanDescription &&
                n.jsx("p", {
                  className: "mt-2 rounded-xl bg-[#FAF8F5] p-3 text-xs text-[#5C5861]",
                  children: Ee.cleanDescription,
                }),
              n.jsx("div", {
                className: "mt-4 max-h-64 overflow-y-auto space-y-1.5",
                children: (Ee.candidateSubjects || []).map((j) =>
                  n.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => Ae(j.id),
                      className:
                        "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-4 py-2.5 text-left text-xs font-bold text-[#16161A] hover:border-[#93161B] hover:bg-[#FCEEEE] hover:text-[#93161B] transition",
                      children: j.name,
                    },
                    j.id,
                  ),
                ),
              }),
              n.jsx("button", {
                type: "button",
                onClick: () => Te(null),
                className:
                  "mt-4 w-full rounded-xl border border-[#E8E1D9] py-2.5 text-xs font-bold text-[#5C5861] hover:bg-[#F3EFEA]",
                children: "Отмена",
              }),
            ],
          }),
        }),
    ],
  });
}
const lr = "zau_web_notif_optin_v1",
  Nb = "zau_web_notif_fired_v1";
function my() {
  if (typeof window > "u" || typeof navigator > "u") return !1;
  const r = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(r) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    ? !(
        window.matchMedia?.("(display-mode: standalone)")?.matches ||
        !!navigator.standalone
      )
    : !1;
}
function Kh() {
  if (typeof window > "u") return !1;
  try {
    return window.self !== window.top;
  } catch {
    return !0;
  }
}
function yn() {
  return typeof window > "u"
    ? "unsupported"
    : !window.isSecureContext &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ? "insecure"
      : "Notification" in window
        ? Notification.permission
        : my()
          ? "ios-pwa-required"
          : "unsupported";
}
function ps() {
  try {
    return localStorage.getItem(lr) === "1" && yn() === "granted";
  } catch {
    return !1;
  }
}
async function hd(r, m, x = "zau-general") {
  if (yn() !== "granted") return !1;
  const u = {
    body: m,
    icon: "./pwa-icon-192.png",
    badge: "./pwa-icon-192.png",
    tag: x,
  };
  if (typeof navigator < "u" && "serviceWorker" in navigator)
    try {
      const p = await navigator.serviceWorker.getRegistration();
      if (p && typeof p.showNotification == "function")
        return (await p.showNotification(r, u), !0);
    } catch {}
  try {
    const p = new Notification(r, u);
    return (
      (p.onclick = () => {
        try {
          (window.focus(), p.close());
        } catch {}
      }),
      !0
    );
  } catch {
    return !1;
  }
}
function jb(r, m = !0) {
  if (!r) {
    try {
      localStorage.setItem(lr, "0");
    } catch {}
    try {
      window.dispatchEvent(
        new CustomEvent("zau-web-notif-changed", { detail: { active: !1 } }),
      );
    } catch {}
    return Promise.resolve({
      active: !1,
      status: yn(),
      message: "Уведомления в этом браузере выключены.",
    });
  }
  const x = yn();
  if (x === "ios-pwa-required")
    return Promise.resolve({
      active: !1,
      status: x,
      message:
        "На iPhone и iPad нажмите «Поделиться → На экран Домой», откройте «ЗАУ Учёба» с домашнего экрана и включите уведомления там.",
    });
  if (x === "insecure")
    return Promise.resolve({
      active: !1,
      status: x,
      message: "Браузерные уведомления работают только по защищённому соединению HTTPS.",
    });
  if (x === "unsupported")
    return Promise.resolve({
      active: !1,
      status: x,
      message: "Этот браузер не поддерживает системные Web-уведомления.",
    });
  if (x === "denied")
    return Promise.resolve({
      active: !1,
      status: "denied",
      message: Kh()
        ? "Во встроенном окне предпросмотра уведомления заблокированы браузером. Откройте сайт в отдельной вкладке и разрешите уведомления (значок замка в адресной строке)."
        : "Уведомления запрещены в настройках браузера. Нажмите на значок замка слева от адреса сайта → «Уведомления → Разрешить» и нажмите переключатель снова.",
    });
  const u = async (p) => {
    if (p === "granted") {
      try {
        localStorage.setItem(lr, "1");
      } catch {}
      try {
        window.dispatchEvent(
          new CustomEvent("zau-web-notif-changed", { detail: { active: !0 } }),
        );
      } catch {}
      return (
        m &&
          (await hd(
            "ЗАУ Учёба · Уведомления включены",
            "Напоминания и оповещения теперь будут приходить на это устройство.",
            "zau-notif-enabled",
          )),
        {
          active: !0,
          status: "granted",
          message: "Уведомления в браузере включены.",
        }
      );
    }
    try {
      localStorage.setItem(lr, "0");
    } catch {}
    return Kh()
      ? {
          active: !1,
          status: "iframe-blocked",
          message:
            "Встроенное окно предпросмотра не может запрашивать разрешение. Откройте сайт по прямой ссылке в отдельной вкладке браузера.",
        }
      : p === "denied"
        ? {
            active: !1,
            status: "denied",
            message:
              "Разрешение отклонено. Разрешите уведомления через значок замка в адресной строке браузера.",
          }
        : {
            active: !1,
            status: "default",
            message:
              "Подтвердите запрос «Разрешить уведомления» во всплывающем окне браузера.",
          };
  };
  if (x === "granted") return u("granted");
  try {
    let p = !1;
    return new Promise((F) => {
      const M = (q) => {
          p || ((p = !0), u(q).then(F));
        },
        B = Notification.requestPermission((q) => M(q));
      B &&
        typeof B.then == "function" &&
        B.then(M).catch(() => M(Notification.permission));
    });
  } catch {
    return u(Notification.permission);
  }
}
function hy() {
  try {
    const r = localStorage.getItem(Nb);
    return r ? JSON.parse(r) : {};
  } catch {
    return {};
  }
}
function by(r) {
  try {
    const m = Date.now() - 1728e5,
      x = {};
    for (const [u, p] of Object.entries(r)) p > m && (x[u] = p);
    localStorage.setItem(Nb, JSON.stringify(x));
  } catch {}
}
function Eb(r) {
  if (!ps()) return null;
  const m = Date.now(),
    x = hy();
  let u = null;
  for (const p of r) {
    if (p.status !== "pending" || !p.fireAt) continue;
    const F = `${p.id}_${p.fireAt}`;
    x[F] ||
      (m >= p.fireAt - 15e3 &&
        m <= p.fireAt + 600 * 1e3 &&
        ((x[F] = m), (u = p), hd("ЗАУ Учёба · Напоминание", p.text, `zau-rem-${p.id}`)));
  }
  return (u && by(x), u);
}
const Wc = {
    subEnabled: !0,
    hwEnabled: !0,
    hwHour: 19,
    hwOnlyUndone: !0,
    firstClassMins: 20,
    nextClassMins: 10,
  },
  py = [17, 18, 19, 20, 21, 22],
  gy = [10, 15, 20, 30, 45, 60];
function Qh(r) {
  const m = Number(r);
  return Number.isFinite(m) ? Math.max(0, Math.min(120, Math.round(m))) : 0;
}
function ar({ checked: r, onChange: m, disabled: x = !1, label: u }) {
  return n.jsx("button", {
    type: "button",
    role: "switch",
    "aria-checked": r,
    "aria-label": u,
    disabled: x,
    onClick: () => m(!r),
    className: `relative h-6.5 w-11.5 shrink-0 rounded-full transition disabled:opacity-45 ${r ? "bg-[#93161B]" : "bg-[#D6D1CA]"}`,
    children: n.jsx("span", {
      className: `absolute top-0.5 h-5.5 w-5.5 rounded-full bg-white shadow-xs transition-transform ${r ? "left-5.5" : "left-0.5"}`,
    }),
  });
}
function hi({ title: r, subtitle: m, checked: x, onChange: u, disabled: p = !1 }) {
  return n.jsxs("div", {
    className: "flex items-center justify-between gap-4 py-3.5 border-t border-[#F3EFEA]",
    children: [
      n.jsxs("div", {
        className: "min-w-0",
        children: [
          n.jsx("p", {
            className: "text-sm font-bold text-[#16161A]",
            children: r,
          }),
          n.jsx("p", {
            className: "text-xs text-[#5C5861] mt-0.5 leading-relaxed",
            children: m,
          }),
        ],
      }),
      n.jsx(ar, { checked: x, onChange: u, disabled: p, label: r }),
    ],
  });
}
function Iu({ label: r, enabled: m }) {
  return n.jsxs("div", {
    className:
      "flex items-center justify-between gap-3 py-3 border-t border-[#F3EFEA] text-xs sm:text-sm",
    children: [
      n.jsx("span", { className: "text-[#5C5861] font-medium", children: r }),
      n.jsx("span", {
        className: `inline-flex items-center gap-1.5 text-xs font-extrabold shrink-0 ${m ? "text-[#1F6E4E]" : "text-[#8F8A94]"}`,
        children: m
          ? n.jsxs(n.Fragment, {
              children: [n.jsx(cr, { className: "h-3.5 w-3.5" }), "Включено"],
            })
          : n.jsxs(n.Fragment, {
              children: [n.jsx(Eg, { className: "h-3.5 w-3.5" }), "Выключено"],
            }),
      }),
    ],
  });
}
function yy({
  user: r,
  groupKey,
  localGlobalSabbathEnabled: m,
  localSabbathForceEnabled: x,
  globalSabbathModeEnabled: u,
  onToggleLocalGlobalSabbath: p,
  onToggleLocalSabbathForce: F,
  onUserUpdated: M,
  onOpenAdminPanel: B,
  onOpenSupportChat: q,
  onLogout: J,
}) {
  const [ae, G] = d.useState("profile"),
    [L, Q] = d.useState("notifications"),
    [X, H] = d.useState(Wc),
    [R, Z] = d.useState(Wc),
    [ie, Y] = d.useState(!1),
    [ne, me] = d.useState(!1),
    [re, $] = d.useState(""),
    [Me, De] = d.useState(""),
    [je, ue] = d.useState(!0),
    [oe, de] = d.useState(!1),
    [se, ge] = d.useState(""),
    [U, ce] = d.useState(() => ps()),
    [le, we] = d.useState(() => yn()),
    [Ee, Te] = d.useState(!1),
    [Re, Ne] = d.useState(""),
    [K, h] = d.useState(""),
    [D, he] = d.useState(!1),
    [Ae, V] = d.useState(""),
    [Ce, j] = d.useState(""),
    [ee, ze] = d.useState(""),
    [Le, Ze] = d.useState(""),
    [Ue, qe] = d.useState(!1),
    [T, xe] = d.useState(""),
    [A, I] = d.useState(!1),
    [w, k] = d.useState("bug"),
    [O, W] = d.useState(""),
    [ve, Be] = d.useState(!1),
    [Lt, Ke] = d.useState(""),
    _t = gn(),
    dl = fs();
  (d.useEffect(() => {
    let P = !0;
    return (
      be("/api/mobile/me")
        .then((Se) => {
          if (!P) return;
          const mt = {
            ...Wc,
            ...(Se.appNotificationPrefs || Se.notificationPrefs || {}),
          };
          (H(mt),
            Z(mt),
            ue(!!(Se.telegramNotificationPrefs?.telegramEnabled ?? !0)),
            Se.user && M(Se.user));
        })
        .catch((Se) => {
          P && De(Se?.message || "");
        }),
      () => {
        P = !1;
      }
    );
  }, []),
    d.useEffect(() => {
      const P = () => {
        (ce(ps()), we(yn()));
      };
      return (
        window.addEventListener("focus", P),
        window.addEventListener("zau-web-notif-changed", P),
        () => {
          (window.removeEventListener("focus", P),
            window.removeEventListener("zau-web-notif-changed", P));
        }
      );
    }, []));
  const Nn = () => {
      (Z({ ...X }), $(""), Y(!0));
    },
    Ga = async () => {
      (Pe("settings", "save_notifications"), me(!0), $(""));
      try {
        const P = {
            subEnabled: !!R.subEnabled,
            hwEnabled: !!R.hwEnabled,
            hwHour: Math.max(7, Math.min(23, Number(R.hwHour) || 19)),
            hwOnlyUndone: !!R.hwOnlyUndone,
            firstClassMins: Qh(R.firstClassMins),
            nextClassMins: Qh(X.nextClassMins),
          },
          Se = await be("/api/mobile/me", {
            method: "PATCH",
            body: { appNotificationPrefs: P },
          }),
          mt = { ...P, ...(Se.appNotificationPrefs || {}) };
        (H(mt),
          Z(mt),
          Y(!1),
          Se.user && M(Se.user),
          $("Настройки уведомлений сохранены."));
      } catch (P) {
        $(`Ошибка: ${P?.message || "не удалось сохранить настройки"}`);
      } finally {
        me(!1);
      }
    },
    Zl = (P) => {
      (Te(!0),
        Ne(""),
        jb(P, !0)
          .then((Se) => {
            (ce(Se.active), we(Se.status), Ne(Se.message));
          })
          .finally(() => {
            Te(!1);
          }));
    },
    ha = async () => {
      if ((Ne(""), !U)) {
        Zl(!0);
        return;
      }
      const P = await hd(
        "ЗАУ Учёба · Проверка уведомлений",
        "Браузерные уведомления работают исправно!",
        `zau-test-${Date.now()}`,
      );
      Ne(
        P
          ? "Тестовое уведомление отправлено! Проверьте центр уведомлений вашего устройства."
          : "Не удалось показать уведомление. Проверьте, не включён ли режим «Не беспокоить» в системе.",
      );
    },
    Qt = async (P) => {
      const Se = je;
      (Pe(
        "settings",
        P ? "enable_telegram_notifications" : "disable_telegram_notifications",
      ),
        ue(P),
        de(!0),
        ge(""));
      try {
        const Jt = !!(
          (
            await be("/api/mobile/me", {
              method: "PATCH",
              retryOn403: !0,
              body: { telegramNotificationPrefs: { telegramEnabled: P } },
            })
          ).telegramNotificationPrefs?.telegramEnabled ?? P
        );
        (ue(Jt),
          ge(
            Jt
              ? "Уведомления Telegram-бота включены. Уведомления приложения настраиваются отдельно."
              : "Уведомления Telegram-бота выключены. Уведомления приложения остаются включёнными по своим настройкам.",
          ));
      } catch (mt) {
        (ue(Se), ge(`Ошибка: ${mt?.message || "проверьте привязку Telegram"}`));
      } finally {
        de(!1);
      }
    },
    jn = async (P) => {
      if ((P.preventDefault(), !(!K.trim() || D))) {
        (Pe("settings", "link_telegram"), he(!0), V(""));
        try {
          const Se = await be("/api/mobile/link-bot", {
            method: "POST",
            body: { code: K.trim() },
          });
          (h(""),
            Se.user && M(Se.user),
            V(Se.message || "Аккаунт Telegram успешно привязан!"));
        } catch (Se) {
          V(`Ошибка: ${Se?.message || "неверный или истёкший код"}`);
        } finally {
          he(!1);
        }
      }
    },
    En = async () => {
      (Pe("settings", "unlink_telegram"), he(!0), V(""));
      try {
        const P = await be("/api/mobile/unlink-bot", { method: "POST" });
        (P.user && M(P.user), V("Связь с Telegram отключена."));
      } catch (P) {
        V(`Ошибка: ${P?.message}`);
      } finally {
        he(!1);
      }
    },
    Ot = async (P) => {
      if ((P.preventDefault(), xe(""), I(!1), !Ce || ee.length < 8)) {
        (I(!0), xe("Новый пароль должен содержать не менее 8 символов."));
        return;
      }
      if (ee !== Le) {
        (I(!0), xe("Подтверждение пароля не совпадает."));
        return;
      }
      qe(!0);
      try {
        const Se = await be("/api/mobile/auth/change-password", {
          method: "POST",
          retryOn404: !0,
          body: { currentPassword: Ce, newPassword: ee },
        });
        (j(""), ze(""), Ze(""), I(!1), xe(Se.message || "Пароль изменён."));
      } catch (Se) {
        (I(!0),
          xe(Se?.message || "Не удалось изменить пароль. Проверьте текущий пароль."));
      } finally {
        qe(!1);
      }
    },
    Vl = async (P) => {
      P.preventDefault();
      const Se = O.trim();
      if (!Se || ve) return;
      (Be(!0), Ke(""));
      const mt = `web_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      try {
        if (w === "idea")
          (await be("/api/mobile/feedback", {
            method: "POST",
            retryOn403: !0,
            body: { type: "idea", message: Se, clientRequestId: mt },
          }),
            W(""),
            Ke("Спасибо! Ваше предложение отправлено разработчику."));
        else {
          const Jt = await be("/api/mobile/support/threads", {
            method: "POST",
            retryOn403: !0,
            body: { type: w, message: Se, clientRequestId: mt },
          });
          (W(""), Jt.threadId && q(Jt.threadId));
        }
      } catch (Jt) {
        Ke(`Ошибка: ${Jt?.message || "не удалось отправить сообщение"}`);
      } finally {
        Be(!1);
      }
    },
    $l = async () => {
      (Be(!0), Ke(""));
      try {
        const Se = (await be("/api/mobile/support/threads")).threads?.[0];
        Se
          ? q(Se.id)
          : Ke(
              "У вас пока нет активных переписок. Напишите вопрос ниже, чтобы начать чат.",
            );
      } catch (P) {
        Ke(`Ошибка: ${P?.message}`);
      } finally {
        Be(!1);
      }
    };
  if (ae === "profile")
    return n.jsxs("div", {
      className: "max-w-2xl mx-auto space-y-5",
      children: [
        n.jsxs("section", {
          className:
            "zau-hero-gradient rounded-3xl px-6 py-8 text-white text-center flex flex-col items-center",
          children: [
            n.jsx("div", {
              className:
                "flex h-17 w-17 items-center justify-center rounded-2xl bg-white/12 border border-[#F0C274]/35",
              children: n.jsx(bs, { size: 48, variant: "light" }),
            }),
            n.jsx("h2", {
              className: "mt-3.5 text-xl sm:text-2xl font-extrabold tracking-tight",
              children: r.displayName,
            }),
            n.jsxs("p", {
              className: "mt-1 text-xs sm:text-sm text-white/82",
              children: ["@", r.login, " · ", r.roleLabel],
            }),
            r.isAdmin &&
              n.jsxs("span", {
                className:
                  "mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/25 border border-[#F0C274]/35 px-3.5 py-1 text-xs font-extrabold text-[#F5D69B]",
                children: [n.jsx(vi, { className: "h-3.5 w-3.5" }), "Администратор"],
              }),
          ],
        }),
        n.jsxs("section", {
          className: "zau-card p-5 sm:p-6",
          children: [
            n.jsx("p", {
              className:
                "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
              children: "Учебный профиль",
            }),
            n.jsx("h3", {
              className: "text-lg font-extrabold text-[#16161A] mt-0.5 mb-3",
              children: "Ваш факультет и курс",
            }),
            n.jsxs("div", {
              className: "divide-y divide-[#F3EFEA] border-t border-[#F3EFEA]",
              children: [
                n.jsxs("div", {
                  className: "flex items-center justify-between gap-4 py-3 text-sm",
                  children: [
                    n.jsx("span", {
                      className: "font-semibold text-[#5C5861]",
                      children: "Факультет",
                    }),
                    n.jsx("span", {
                      className: "font-extrabold text-[#16161A] text-right",
                      children: r.direction,
                    }),
                  ],
                }),
                n.jsxs("div", {
                  className: "flex items-center justify-between gap-4 py-3 text-sm",
                  children: [
                    n.jsx("span", {
                      className: "font-semibold text-[#5C5861]",
                      children: "Курс",
                    }),
                    n.jsxs("span", {
                      className: "font-extrabold text-[#16161A] text-right",
                      children: [r.course, " курс"],
                    }),
                  ],
                }),
                n.jsxs("div", {
                  className: "flex items-center justify-between gap-4 py-3 text-sm",
                  children: [
                    n.jsx("span", {
                      className: "font-semibold text-[#5C5861]",
                      children: "Учебный семестр",
                    }),
                    n.jsxs("span", {
                      className: "font-extrabold text-[#16161A] text-right",
                      children: [dl, " семестр · авто"],
                    }),
                  ],
                }),
              ],
            }),
            n.jsx("p", {
              className: "mt-3 text-xs leading-relaxed text-[#5C5861]",
              children:
                "Факультет и курс закреплены за аккаунтом — поэтому материалы других направлений недоступны. Курс обновляется автоматически в августе, а семестр — по учебному календарю.",
            }),
            n.jsx("p", {
              className: "mt-2 text-xs leading-relaxed text-[#5C5861]",
              children:
                "Если при регистрации указаны неверные данные, попросите администратора исправить профиль.",
            }),
          ],
        }),
        n.jsxs("button", {
          type: "button",
          onClick: () => {
            (Pe("profile", "open_settings"), G("settings"));
          },
          className:
            "w-full zau-card p-4 sm:p-5 flex items-center gap-4 text-left hover:border-[#93161B]/45 transition group",
          children: [
            n.jsx("div", {
              className:
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FCEEEE] text-[#93161B] group-hover:bg-[#93161B] group-hover:text-white transition",
              children: n.jsx(Ng, { className: "h-5 w-5" }),
            }),
            n.jsxs("div", {
              className: "min-w-0 flex-1",
              children: [
                n.jsx("p", {
                  className: "text-base font-extrabold text-[#16161A]",
                  children: "Настройки",
                }),
                n.jsx("p", {
                  className: "text-xs text-[#5C5861] mt-0.5",
                  children: r.isGuest
                    ? "Субботний режим и связь с разработчиком"
                    : "Уведомления, субботний режим, безопасность и Telegram",
                }),
              ],
            }),
            n.jsx(rr, {
              className:
                "h-5 w-5 text-[#93161B] shrink-0 group-hover:translate-x-0.5 transition-transform",
            }),
          ],
        }),
        r.isAdmin &&
          n.jsxs("div", {
            className:
              "zau-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3",
            children: [
              n.jsxs("div", {
                className: "flex items-center gap-3.5",
                children: [
                  n.jsx("div", {
                    className:
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FDF6EA] text-[#9A6F32]",
                    children: n.jsx(vi, { className: "h-5 w-5" }),
                  }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("p", {
                        className: "text-sm font-extrabold text-[#16161A]",
                        children: "Управление университетом",
                      }),
                      n.jsx("p", {
                        className: "text-xs text-[#5C5861]",
                        children: "Админ-панель и веб-студия базы данных",
                      }),
                    ],
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  n.jsx("button", {
                    type: "button",
                    onClick: B,
                    className:
                      "rounded-xl bg-[#93161B] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#6B0D12] transition",
                    children: "Админ-панель",
                  }),
                  n.jsxs("a", {
                    href: hb(),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className:
                      "inline-flex items-center gap-1 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3 py-2 text-xs font-bold text-[#16161A] hover:border-[#93161B]",
                    children: [
                      "БД",
                      n.jsx(dr, { className: "h-3.5 w-3.5 text-[#93161B]" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        n.jsxs("button", {
          type: "button",
          onClick: J,
          className:
            "w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F5C6C6] bg-[#FFF0F0] py-3.5 text-sm font-extrabold text-[#C92A2A] hover:bg-[#FFE3E3] transition",
          children: [n.jsx(Ph, { className: "h-4 w-4" }), "Выйти из аккаунта"],
        }),
      ],
    });
  const Ya =
    U && le === "granted"
      ? "Включены — напоминания приходят системными уведомлениями на это устройство"
      : le === "denied"
        ? "Заблокированы в настройках браузера (разрешите через значок замка у адреса сайта)"
        : le === "ios-pwa-required"
          ? "На iPhone/iPad добавьте сайт «На экран Домой», чтобы получать уведомления"
          : le === "unsupported"
            ? "Текущий браузер не поддерживает системные Web-уведомления"
            : "Выключены — включите, чтобы получать напоминания прямо в браузере или PWA";
  return n.jsxs("div", {
    className: "max-w-2xl mx-auto space-y-5",
    children: [
      n.jsxs("section", {
        className: "zau-card p-5 space-y-4",
        children: [
          n.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              n.jsxs("button", {
                type: "button",
                onClick: () => G("profile"),
                className:
                  "inline-flex items-center gap-1 rounded-xl bg-[#FCEEEE] px-3 py-2 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF] transition",
                children: [n.jsx(id, { className: "h-3.5 w-3.5" }), "Профиль"],
              }),
              n.jsxs("div", {
                children: [
                  n.jsxs("p", {
                    className:
                      "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                    children: ["Профиль · @", r.login],
                  }),
                  n.jsx("h2", {
                    className: "text-xl font-extrabold text-[#16161A]",
                    children: "Настройки",
                  }),
                ],
              }),
            ],
          }),
          !r.isGuest &&
            n.jsx("div", {
              className: "grid grid-cols-3 gap-2",
              children: [
                { id: "notifications", label: "Уведомления" },
                { id: "main", label: "Основное" },
                { id: "security", label: "Безопасность" },
              ].map((P) => {
                const Se = L === P.id;
                return n.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => Q(P.id),
                    className: `rounded-xl border py-2.5 px-2 text-xs font-extrabold transition ${Se ? "border-[#93161B] bg-[#93161B] text-white shadow-2xs" : "border-[#E8E1D9] bg-[#F3EFEA] text-[#5C5861] hover:text-[#16161A]"}`,
                    children: P.label,
                  },
                  P.id,
                );
              }),
            }),
        ],
      }),
      Me &&
        n.jsx("div", {
          className:
            "rounded-2xl border border-[#F5C6C6] bg-[#FFF0F0] px-4 py-3 text-xs font-bold text-[#C92A2A]",
          children: Me,
        }),
      !r.isGuest &&
        L === "notifications" &&
        n.jsxs("div", {
          className: "space-y-4",
          children: [
            n.jsxs("section", {
              className: "zau-card p-5 sm:p-6",
              children: [
                n.jsxs("div", {
                  className: "flex items-start justify-between gap-3",
                  children: [
                    n.jsxs("div", {
                      children: [
                        n.jsx("p", {
                          className:
                            "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                          children: "Push-уведомления приложения",
                        }),
                        n.jsxs("h3", {
                          className:
                            "text-base sm:text-lg font-extrabold text-[#16161A] mt-0.5 flex items-center gap-2",
                          children: [
                            n.jsx(cr, {
                              className: "h-4.5 w-4.5 text-[#93161B]",
                            }),
                            "Пары и домашние задания",
                          ],
                        }),
                      ],
                    }),
                    !ie &&
                      n.jsxs("button", {
                        type: "button",
                        onClick: Nn,
                        className:
                          "inline-flex items-center gap-1.5 rounded-xl bg-[#FCEEEE] px-3 py-1.5 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF] transition shrink-0",
                        children: [n.jsx(ji, { className: "h-3.5 w-3.5" }), "Изменить"],
                      }),
                  ],
                }),
                n.jsx("p", {
                  className: "mt-2 mb-3 text-xs leading-relaxed text-[#5C5861]",
                  children:
                    "Эти настройки относятся только к уведомлениям в приложении. Переключатели в Telegram-боте на них не влияют. Время пар и перемен берётся напрямую из онлайн-расписания ЗАУ.",
                }),
                ie
                  ? n.jsxs("div", {
                      children: [
                        n.jsx(hi, {
                          title: "Замены и отмены в расписании",
                          subtitle: "Сообщать об изменениях занятий",
                          checked: !!R.subEnabled,
                          onChange: (P) => Z((Se) => ({ ...Se, subEnabled: P })),
                        }),
                        n.jsx(hi, {
                          title: "Вечерняя сводка ДЗ на завтра",
                          subtitle: `Напоминать примерно в ${R.hwHour || 19}:00 по Москве`,
                          checked: !!R.hwEnabled,
                          onChange: (P) => Z((Se) => ({ ...Se, hwEnabled: P })),
                        }),
                        R.hwEnabled &&
                          n.jsxs("div", {
                            className:
                              "rounded-2xl bg-[#FAF8F5] border border-[#E8E1D9] p-3.5 mb-2 space-y-3",
                            children: [
                              n.jsxs("div", {
                                children: [
                                  n.jsx("p", {
                                    className:
                                      "text-xs font-extrabold text-[#16161A] mb-2",
                                    children: "Время по Москве",
                                  }),
                                  n.jsx("div", {
                                    className: "grid grid-cols-3 sm:grid-cols-6 gap-1.5",
                                    children: py.map((P) => {
                                      const Se = Number(R.hwHour) === P;
                                      return n.jsxs(
                                        "button",
                                        {
                                          type: "button",
                                          onClick: () =>
                                            Z((mt) => ({ ...mt, hwHour: P })),
                                          className: `rounded-xl border py-2 text-xs font-extrabold tabular-nums transition ${Se ? "border-[#93161B] bg-[#93161B] text-white" : "border-[#E8E1D9] bg-white text-[#5C5861] hover:border-[#93161B]/40"}`,
                                          children: [P, ":00"],
                                        },
                                        P,
                                      );
                                    }),
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                className:
                                  "flex items-center justify-between gap-3 pt-2.5 border-t border-[#E8E1D9]",
                                children: [
                                  n.jsxs("div", {
                                    children: [
                                      n.jsx("p", {
                                        className: "text-xs font-bold text-[#16161A]",
                                        children: "Только при невыполненных ДЗ",
                                      }),
                                      n.jsx("p", {
                                        className: "text-[11px] text-[#5C5861]",
                                        children:
                                          "Не беспокоить, если все задания на завтра уже закрыты",
                                      }),
                                    ],
                                  }),
                                  n.jsx(ar, {
                                    checked: !!R.hwOnlyUndone,
                                    onChange: (P) =>
                                      Z((Se) => ({ ...Se, hwOnlyUndone: P })),
                                    label: "Только при невыполненных ДЗ",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        n.jsx(hi, {
                          title: "Перед первой парой",
                          subtitle:
                            Number(R.firstClassMins) > 0
                              ? `Напомнить за ${R.firstClassMins} мин до начала учебного дня`
                              : "Выключено",
                          checked: Number(R.firstClassMins) > 0,
                          onChange: (P) =>
                            Z((Se) => ({
                              ...Se,
                              firstClassMins: P
                                ? Number(Se.firstClassMins) || Wc.firstClassMins
                                : 0,
                            })),
                        }),
                        Number(R.firstClassMins) > 0 &&
                          n.jsxs("div", {
                            className:
                              "rounded-2xl bg-[#FAF8F5] border border-[#E8E1D9] p-3.5 space-y-2.5",
                            children: [
                              n.jsxs("div", {
                                className: "flex items-center justify-between gap-3",
                                children: [
                                  n.jsxs("div", {
                                    children: [
                                      n.jsx("p", {
                                        className:
                                          "text-xs font-extrabold text-[#16161A]",
                                        children: "Минут до начала первой пары",
                                      }),
                                      n.jsx("p", {
                                        className: "text-[11px] text-[#5C5861]",
                                        children:
                                          "От 1 до 120 минут; выключите переключатель выше, чтобы отключить.",
                                      }),
                                    ],
                                  }),
                                  n.jsxs("div", {
                                    className: "flex items-center gap-1.5 shrink-0",
                                    children: [
                                      n.jsx("input", {
                                        type: "text",
                                        inputMode: "numeric",
                                        maxLength: 3,
                                        value:
                                          R.firstClassMins > 0
                                            ? String(R.firstClassMins)
                                            : "",
                                        onChange: (P) => {
                                          const Se = P.target.value
                                            .replace(/[^0-9]/g, "")
                                            .slice(0, 3);
                                          Z((mt) => ({
                                            ...mt,
                                            firstClassMins: Se
                                              ? Math.min(120, Number(Se))
                                              : 0,
                                          }));
                                        },
                                        placeholder: "20",
                                        "aria-label": "Минут до начала первой пары",
                                        className:
                                          "w-16 rounded-xl border border-[#E8E1D9] bg-white px-2.5 py-2 text-center text-sm font-extrabold text-[#16161A] tabular-nums focus:border-[#93161B] focus:outline-none",
                                      }),
                                      n.jsx("span", {
                                        className: "text-xs font-bold text-[#5C5861]",
                                        children: "мин",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              n.jsx("div", {
                                className: "flex flex-wrap gap-1.5",
                                children: gy.map((P) => {
                                  const Se = Number(R.firstClassMins) === P;
                                  return n.jsxs(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () =>
                                        Z((mt) => ({
                                          ...mt,
                                          firstClassMins: P,
                                        })),
                                      className: `rounded-lg border px-2.5 py-1 text-[11px] font-extrabold tabular-nums transition ${Se ? "border-[#93161B] bg-[#FCEEEE] text-[#93161B]" : "border-[#E8E1D9] bg-white text-[#5C5861] hover:text-[#16161A]"}`,
                                      children: [P, " мин"],
                                    },
                                    P,
                                  );
                                }),
                              }),
                            ],
                          }),
                        n.jsxs("div", {
                          className:
                            "mt-4 flex items-center justify-end gap-2.5 pt-3 border-t border-[#F3EFEA]",
                          children: [
                            n.jsx("button", {
                              type: "button",
                              disabled: ne,
                              onClick: () => {
                                (Z({ ...X }), Y(!1));
                              },
                              className:
                                "rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-4 py-2.5 text-xs font-bold text-[#5C5861] hover:text-[#16161A]",
                              children: "Отмена",
                            }),
                            n.jsxs("button", {
                              type: "button",
                              disabled: ne,
                              onClick: Ga,
                              className:
                                "inline-flex items-center gap-1.5 rounded-xl bg-[#93161B] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#6B0D12] disabled:opacity-50 transition",
                              children: [
                                ne &&
                                  n.jsx(ot, {
                                    className: "h-3.5 w-3.5 animate-spin",
                                  }),
                                "Сохранить",
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  : n.jsxs("div", {
                      children: [
                        n.jsx(Iu, {
                          label: "Замены и отмены в расписании",
                          enabled: !!X.subEnabled,
                        }),
                        n.jsx(Iu, {
                          label: `Сводка ДЗ на завтра · ${X.hwHour || 19}:00`,
                          enabled: !!X.hwEnabled,
                        }),
                        n.jsx(Iu, {
                          label:
                            Number(X.firstClassMins) > 0
                              ? `Перед первой парой · за ${X.firstClassMins} мин`
                              : "Перед первой парой",
                          enabled: Number(X.firstClassMins) > 0,
                        }),
                        re &&
                          n.jsx("p", {
                            className: "mt-3 text-xs font-bold text-[#1F6E4E]",
                            children: re,
                          }),
                      ],
                    }),
              ],
            }),
            n.jsxs("section", {
              className: "zau-card p-5 sm:p-6",
              children: [
                n.jsx("p", {
                  className:
                    "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                  children: "Это устройство · Веб-версия",
                }),
                n.jsxs("h3", {
                  className:
                    "text-base sm:text-lg font-extrabold text-[#16161A] mt-0.5 flex items-center gap-2",
                  children: [
                    n.jsx(ed, { className: "h-4.5 w-4.5 text-[#93161B]" }),
                    "Уведомления в браузере",
                  ],
                }),
                n.jsx("p", {
                  className: "mt-1.5 mb-2 text-xs leading-relaxed text-[#5C5861]",
                  children:
                    "Разрешите показ системных уведомлений, чтобы личные напоминания и оповещения о первой паре приходили прямо на компьютер или телефон.",
                }),
                n.jsx(hi, {
                  title: "Браузерные уведомления",
                  subtitle: Ya,
                  checked: U,
                  disabled: Ee,
                  onChange: Zl,
                }),
                U &&
                  n.jsx("div", {
                    className: "pt-2",
                    children: n.jsxs("button", {
                      type: "button",
                      onClick: ha,
                      className:
                        "inline-flex items-center gap-1.5 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#16161A] hover:border-[#93161B] hover:text-[#93161B] transition",
                      children: [
                        n.jsx(ed, { className: "h-3.5 w-3.5 text-[#93161B]" }),
                        "Проверить уведомление",
                      ],
                    }),
                  }),
                Re &&
                  n.jsx("div", {
                    className: `mt-3 rounded-xl border px-3.5 py-2.5 text-xs font-semibold leading-relaxed ${U ? "border-[#BFE6D3] bg-[#E8F6EF] text-[#1F6E4E]" : "border-[#EBD7B1] bg-[#FDF6EA] text-[#806332]"}`,
                    children: Re,
                  }),
              ],
            }),
            n.jsxs("section", {
              className: "zau-card p-5 sm:p-6",
              children: [
                n.jsx("p", {
                  className:
                    "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                  children: "Отдельный канал",
                }),
                n.jsx("h3", {
                  className: "text-base sm:text-lg font-extrabold text-[#16161A] mt-0.5",
                  children: "Telegram-уведомления бота",
                }),
                n.jsx("p", {
                  className: "mt-1.5 mb-2 text-xs leading-relaxed text-[#5C5861]",
                  children:
                    "Этот переключатель отключает автоматические сообщения и личные напоминания в Telegram. Уведомления приложения остаются независимыми.",
                }),
                r.linkedTelegramId
                  ? n.jsxs(n.Fragment, {
                      children: [
                        n.jsx(hi, {
                          title: "Сообщения Telegram-бота",
                          subtitle: je
                            ? "Включены"
                            : "Выключены; уведомления приложения не затронуты",
                          checked: je,
                          disabled: oe,
                          onChange: Qt,
                        }),
                        se &&
                          n.jsx("p", {
                            className:
                              "mt-2 text-xs font-semibold text-[#1F6E4E] leading-relaxed",
                            children: se,
                          }),
                      ],
                    })
                  : n.jsxs("div", {
                      className:
                        "mt-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] p-3.5 flex items-center justify-between gap-3",
                      children: [
                        n.jsx("p", {
                          className: "text-xs text-[#5C5861] leading-relaxed",
                          children:
                            "Чтобы управлять уведомлениями бота из приложения, сначала привяжите Telegram-аккаунт внизу вкладки «Основное».",
                        }),
                        n.jsx("button", {
                          type: "button",
                          onClick: () => Q("main"),
                          className:
                            "rounded-lg bg-[#FCEEEE] px-3 py-1.5 text-xs font-extrabold text-[#93161B] shrink-0",
                          children: "Перейти",
                        }),
                      ],
                    }),
              ],
            }),
          ],
        }),
      (r.isGuest || L === "main") &&
        n.jsxs("div", {
          className: "space-y-4",
          children: [
            !r.isGuest && n.jsx(SharedPair, { api: be, group: groupKey }, groupKey),
            r.isAdmin && n.jsx(AdminReports, { api: be }),
            n.jsx(WebStatus, {}),
            r.isGuest &&
              n.jsxs("section", {
                className: "zau-card p-5 sm:p-6",
                children: [
                  n.jsx("p", {
                    className:
                      "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                    children: "Гостевой доступ",
                  }),
                  n.jsx("h3", {
                    className: "text-base font-extrabold text-[#16161A] mt-0.5",
                    children: "Вы вошли как гость",
                  }),
                  n.jsxs("p", {
                    className: "mt-1.5 text-xs leading-relaxed text-[#5C5861]",
                    children: [
                      "Доступ ограничен направлением «",
                      r.groupKey || r.direction,
                      "».",
                    ],
                  }),
                ],
              }),
            n.jsxs("section", {
              className: "zau-card p-5 sm:p-6",
              children: [
                n.jsxs("div", {
                  className: "flex items-start justify-between gap-4",
                  children: [
                    n.jsxs("div", {
                      className: "min-w-0",
                      children: [
                        n.jsx("p", {
                          className:
                            "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                          children: "Глобальный режим · Это устройство",
                        }),
                        n.jsx("h3", {
                          className: "text-base font-extrabold text-[#16161A] mt-0.5",
                          children: "Применять настройку администратора",
                        }),
                        n.jsx("p", {
                          className: "mt-1.5 text-xs leading-relaxed text-[#5C5861]",
                          children: u
                            ? m
                              ? "Глобальный режим администратора включён и действует в этом браузере."
                              : "Глобальный режим отключён только на этом устройстве; у остальных пользователей он остаётся включён."
                            : "Администратор сейчас не включал глобальный режим. Календарное расписание по закату в Заокском действует автоматически.",
                        }),
                      ],
                    }),
                    n.jsx(ar, {
                      checked: m,
                      onChange: p,
                      label: "Применять глобальный субботний режим на этом устройстве",
                    }),
                  ],
                }),
                n.jsxs("p", {
                  className: "mt-2.5 text-[11px] leading-relaxed text-[#8F8A94]",
                  children: [
                    "Заокский, Тульская обл.",
                    _t.nextFridaySunset
                      ? ` · ближайший закат пятницы в ${ad(_t.nextFridaySunset)} МСК.`
                      : "",
                  ],
                }),
              ],
            }),
            n.jsx("section", {
              className: "zau-card p-5 sm:p-6",
              children: n.jsxs("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                  n.jsxs("div", {
                    className: "min-w-0",
                    children: [
                      n.jsx("p", {
                        className:
                          "text-[10.5px] font-extrabold tracking-[0.08em] text-[#9A6F32] uppercase",
                        children: "Ручное локальное управление",
                      }),
                      n.jsxs("h3", {
                        className:
                          "text-base font-extrabold text-[#16161A] mt-0.5 flex items-center gap-2",
                        children: [
                          n.jsx(ir, {
                            className: "h-4.5 w-4.5 text-[#B88946]",
                          }),
                          "Включить субботний режим сейчас",
                        ],
                      }),
                      n.jsx("p", {
                        className: "mt-1.5 text-xs leading-relaxed text-[#5C5861]",
                        children: x
                          ? "Режим включён немедленно на этом устройстве; учебные разделы скрыты."
                          : "Включите вручную в любое время. Это действует только на текущем устройстве.",
                      }),
                    ],
                  }),
                  n.jsx(ar, {
                    checked: x,
                    onChange: F,
                    label: "Включить субботний режим вручную",
                  }),
                ],
              }),
            }),
            n.jsxs("form", {
              onSubmit: Vl,
              className: "zau-card p-5 sm:p-6 space-y-3.5",
              children: [
                n.jsxs("div", {
                  className: "flex items-start justify-between gap-3",
                  children: [
                    n.jsxs("div", {
                      children: [
                        n.jsx("p", {
                          className:
                            "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                          children: "Связь с разработчиком",
                        }),
                        n.jsxs("h3", {
                          className:
                            "text-base font-extrabold text-[#16161A] mt-0.5 flex items-center gap-2",
                          children: [
                            n.jsx(Wh, {
                              className: "h-4.5 w-4.5 text-[#93161B]",
                            }),
                            "Обнаружили баг или есть предложение?",
                          ],
                        }),
                      ],
                    }),
                    n.jsx("button", {
                      type: "button",
                      onClick: $l,
                      className:
                        "rounded-xl bg-[#FCEEEE] px-3 py-1.5 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF] shrink-0",
                      children: "Мой чат",
                    }),
                  ],
                }),
                n.jsx("p", {
                  className: "text-xs leading-relaxed text-[#5C5861]",
                  children:
                    "Ошибки и вопросы открывают переписку с разработчиком прямо в приложении. Предложения отправляются отдельно.",
                }),
                n.jsx("div", {
                  className:
                    "grid grid-cols-3 gap-1.5 rounded-xl bg-[#F3EFEA] p-1 text-xs font-bold",
                  children: [
                    { id: "bug", label: "Ошибка" },
                    { id: "question", label: "Вопрос" },
                    { id: "idea", label: "Идея" },
                  ].map((P) =>
                    n.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => k(P.id),
                        className: `rounded-lg py-1.5 transition ${w === P.id ? "bg-white text-[#93161B] font-extrabold shadow-2xs" : "text-[#5C5861]"}`,
                        children: P.label,
                      },
                      P.id,
                    ),
                  ),
                }),
                n.jsx("textarea", {
                  rows: 3,
                  value: O,
                  onChange: (P) => W(P.target.value),
                  placeholder: "Опишите ошибку, вопрос или идею улучшения…",
                  className:
                    "w-full rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-3 text-xs leading-relaxed text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                }),
                Lt &&
                  n.jsx("p", {
                    className: "text-xs font-bold text-[#1F6E4E]",
                    children: Lt,
                  }),
                n.jsx("div", {
                  className: "flex justify-end",
                  children: n.jsxs("button", {
                    type: "submit",
                    disabled: ve || !O.trim(),
                    className:
                      "inline-flex items-center gap-1.5 rounded-xl bg-[#93161B] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#6B0D12] disabled:opacity-45",
                    children: [
                      ve
                        ? n.jsx(ot, { className: "h-3.5 w-3.5 animate-spin" })
                        : n.jsx(fr, { className: "h-3.5 w-3.5" }),
                      "Отправить",
                    ],
                  }),
                }),
              ],
            }),
            !r.isGuest &&
              n.jsxs("section", {
                className: "zau-card p-5 sm:p-6 space-y-3.5",
                children: [
                  n.jsxs("div", {
                    children: [
                      n.jsx("p", {
                        className:
                          "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                        children: "Синхронизация",
                      }),
                      n.jsxs("h3", {
                        className:
                          "text-base font-extrabold text-[#16161A] mt-0.5 flex items-center gap-2",
                        children: [
                          n.jsx(cd, {
                            className: "h-4.5 w-4.5 text-[#93161B]",
                          }),
                          "Telegram-бот @ucheba_ZAU_bot",
                        ],
                      }),
                    ],
                  }),
                  r.linkedTelegramId
                    ? n.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          n.jsxs("div", {
                            className:
                              "rounded-2xl border border-[#BFE6D3] bg-[#E8F6EF] p-4 space-y-1",
                            children: [
                              n.jsx("p", {
                                className: "text-xs font-extrabold text-[#1F6E4E]",
                                children: "Аккаунт привязан",
                              }),
                              n.jsx("p", {
                                className: "text-xs font-bold text-[#16161A]",
                                children: r.telegramUsername
                                  ? `@${r.telegramUsername.replace(/^@+/, "")}`
                                  : `Telegram ID ${r.linkedTelegramId}`,
                              }),
                              n.jsx("p", {
                                className:
                                  "text-[11px] text-[#1F6E4E]/90 leading-relaxed",
                                children:
                                  "Отметки ДЗ, личные напоминания и права синхронизируются с ботом.",
                              }),
                            ],
                          }),
                          n.jsxs("button", {
                            type: "button",
                            disabled: D,
                            onClick: En,
                            className:
                              "inline-flex items-center gap-1.5 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-4 py-2 text-xs font-bold text-[#C92A2A] hover:bg-[#FFF0F0] hover:border-[#F5C6C6] transition",
                            children: [
                              n.jsx(jg, { className: "h-3.5 w-3.5" }),
                              D ? "Подождите…" : "Отвязать Telegram",
                            ],
                          }),
                        ],
                      })
                    : n.jsxs("form", {
                        onSubmit: jn,
                        className: "space-y-2.5",
                        children: [
                          n.jsxs("p", {
                            className: "text-xs text-[#5C5861] leading-relaxed",
                            children: [
                              "В боте",
                              " ",
                              n.jsx("a", {
                                href: "https://t.me/ucheba_ZAU_bot",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "font-bold text-[#93161B] hover:underline",
                                children: "@ucheba_ZAU_bot",
                              }),
                              " ",
                              "откройте «Профиль → Мобильное приложение» (или отправьте",
                              " ",
                              n.jsx("code", {
                                className: "font-bold text-[#93161B]",
                                children: "/app",
                              }),
                              "), затем введите код:",
                            ],
                          }),
                          n.jsxs("div", {
                            className: "flex gap-2",
                            children: [
                              n.jsx("input", {
                                type: "text",
                                inputMode: "numeric",
                                maxLength: 6,
                                value: K,
                                onChange: (P) => h(P.target.value),
                                placeholder: "123456",
                                className:
                                  "flex-1 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-bold tracking-widest text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                              }),
                              n.jsx("button", {
                                type: "submit",
                                disabled: D || !K.trim(),
                                className:
                                  "rounded-xl bg-[#93161B] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#6B0D12] disabled:opacity-50",
                                children: D ? "…" : "Привязать",
                              }),
                            ],
                          }),
                        ],
                      }),
                  Ae &&
                    n.jsx("p", {
                      className: "text-xs font-bold text-[#5C5861]",
                      children: Ae,
                    }),
                ],
              }),
            n.jsx("p", {
              className: "text-center text-[11px] text-[#8F8A94] pt-1",
              children:
                "Имя, факультет и курс студент изменить не может. Для исправления данных обратитесь к администратору.",
            }),
          ],
        }),
      !r.isGuest &&
        L === "security" &&
        n.jsxs("div", {
          className: "space-y-4",
          children: [
            n.jsxs("form", {
              onSubmit: Ot,
              className: "zau-card p-5 sm:p-6 space-y-3.5",
              children: [
                n.jsxs("div", {
                  children: [
                    n.jsx("p", {
                      className:
                        "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                      children: "Пароль аккаунта",
                    }),
                    n.jsxs("h3", {
                      className:
                        "text-base sm:text-lg font-extrabold text-[#16161A] mt-0.5 flex items-center gap-2",
                      children: [
                        n.jsx(rd, { className: "h-4.5 w-4.5 text-[#93161B]" }),
                        "Изменить пароль",
                      ],
                    }),
                    n.jsx("p", {
                      className: "mt-1.5 text-xs leading-relaxed text-[#5C5861]",
                      children:
                        "После смены пароля другие устройства выйдут из аккаунта. Текущая сессия останется активной.",
                    }),
                  ],
                }),
                n.jsx("input", {
                  type: "password",
                  value: Ce,
                  onChange: (P) => j(P.target.value),
                  disabled: Ue,
                  placeholder: "Текущий пароль",
                  autoComplete: "current-password",
                  className:
                    "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-medium focus:border-[#93161B] focus:bg-white focus:outline-none",
                }),
                n.jsx("input", {
                  type: "password",
                  value: ee,
                  onChange: (P) => ze(P.target.value),
                  disabled: Ue,
                  placeholder: "Новый пароль (от 8 символов)",
                  autoComplete: "new-password",
                  className:
                    "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-medium focus:border-[#93161B] focus:bg-white focus:outline-none",
                }),
                n.jsx("input", {
                  type: "password",
                  value: Le,
                  onChange: (P) => Ze(P.target.value),
                  disabled: Ue,
                  placeholder: "Повторите новый пароль",
                  autoComplete: "new-password",
                  className:
                    "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-medium focus:border-[#93161B] focus:bg-white focus:outline-none",
                }),
                T &&
                  n.jsx("p", {
                    className: `text-xs font-bold ${A ? "text-[#C92A2A]" : "text-[#1F6E4E]"}`,
                    children: T,
                  }),
                n.jsxs("button", {
                  type: "submit",
                  disabled: Ue,
                  className:
                    "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#93161B] py-3 text-xs font-extrabold text-white hover:bg-[#6B0D12] disabled:opacity-50 transition",
                  children: [
                    Ue && n.jsx(ot, { className: "h-3.5 w-3.5 animate-spin" }),
                    "Изменить пароль",
                  ],
                }),
              ],
            }),
            n.jsxs("section", {
              className: "zau-card p-5 sm:p-6",
              children: [
                n.jsx("p", {
                  className:
                    "text-[10.5px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                  children: "Защита аккаунта",
                }),
                n.jsxs("h3", {
                  className:
                    "text-base font-extrabold text-[#16161A] mt-0.5 flex items-center gap-2",
                  children: [
                    n.jsx(rb, { className: "h-4 w-4 text-[#93161B]" }),
                    "Держите пароль в секрете",
                  ],
                }),
                n.jsx("p", {
                  className: "mt-1.5 text-xs leading-relaxed text-[#5C5861]",
                  children:
                    "Не отправляйте пароль в чатах и обращениях. После его смены другие активные устройства будут отключены.",
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
const vy = [
  { num: 1, label: "Пн" },
  { num: 2, label: "Вт" },
  { num: 3, label: "Ср" },
  { num: 4, label: "Чт" },
  { num: 5, label: "Пт" },
  { num: 6, label: "Сб" },
  { num: 0, label: "Вс" },
];
function Xh(r) {
  return r.startsWith("days:")
    ? new Set(
        r
          .slice(5)
          .split(",")
          .map((m) => Number(m.trim()))
          .filter((m) => Number.isInteger(m) && m >= 0 && m <= 6),
      )
    : new Set();
}
function Ny({ user: r, prefillEntry: m, onClearPrefill: x }) {
  const [u, p] = d.useState([]),
    [F, M] = d.useState(0),
    [B, q] = d.useState(!0),
    [J, ae] = d.useState(!1),
    [G, L] = d.useState(!1),
    [Q, X] = d.useState(""),
    [H, R] = d.useState(""),
    [Z, ie] = d.useState(""),
    [Y, ne] = d.useState(!1),
    [me, re] = d.useState(() => ps()),
    $ = yn(),
    [Me, De] = d.useState(!1),
    [je, ue] = d.useState(""),
    [oe, de] = d.useState(""),
    [se, ge] = d.useState("19:00"),
    [U, ce] = d.useState(""),
    [le, we] = d.useState("none"),
    [Ee, Te] = d.useState(""),
    [Re, Ne] = d.useState(""),
    [K, h] = d.useState(!1),
    D = d.useCallback(
      async (T = !1) => {
        const xe = `reminders_web_v1_${r.effectiveUserId}`;
        (T ? ae(!0) : q(!0), X(""));
        let A = null;
        T || ((A = gs(xe)), A?.reminders && (p(A.reminders), M(A._cachedAt || 0), q(!1)));
        try {
          const I = await be("/api/mobile/reminders", { cacheKey: xe });
          (p(I.reminders || []), M((I._offline && I._cachedAt) || 0));
        } catch (I) {
          ((A && !([401, 403].includes(I?.status) && I?.isApiResponse)) || p([]),
            X(I?.message || "Не удалось загрузить напоминания."));
        } finally {
          (q(!1), ae(!1));
        }
      },
      [r.effectiveUserId],
    );
  useRecovery(() => D(false));
  (d.useEffect(() => {
    D(!1);
  }, [D]),
    d.useEffect(() => {
      const T = () => re(ps());
      return (
        window.addEventListener("focus", T),
        window.addEventListener("zau-web-notif-changed", T),
        () => {
          (window.removeEventListener("focus", T),
            window.removeEventListener("zau-web-notif-changed", T));
        }
      );
    }, []),
    d.useEffect(() => {
      if (!me || !u.length) return;
      const T = () => {
        const A = Eb(u);
        A && R(`Напоминание: ${A.text}`);
      };
      T();
      const xe = window.setInterval(T, 25e3);
      return () => window.clearInterval(xe);
    }, [me, u]),
    d.useEffect(() => {
      m &&
        (ue(""),
        de(`${m.subjectName}: ${m.preview}`.slice(0, 220)),
        ge("19:00"),
        ce(""),
        we("none"),
        Te(m.collection),
        Ne(m.id),
        De(!0),
        x());
    }, [m, x]));
  const he = async (T) => {
      if ((T.preventDefault(), !(!Z.trim() || Y))) {
        (Pe("reminders", "quick_create"), ne(!0), R(""));
        try {
          (await be("/api/mobile/reminders", {
            method: "POST",
            body: { naturalInput: Z.trim() },
          }),
            ie(""),
            R("Напоминание создано и синхронизировано с Telegram-ботом."),
            await D(!0));
        } catch (xe) {
          R(`Ошибка: ${xe?.message || "не удалось создать напоминание"}`);
        } finally {
          ne(!1);
        }
      }
    },
    Ae = () => {
      (ue(""), de(""), ge("19:00"), ce(""), we("none"), Te(""), Ne(""), De(!0));
    },
    V = (T) => {
      (ue(T.id), de(T.text));
      const xe = String(T.hour ?? 19).padStart(2, "0"),
        A = String(T.minute ?? 0).padStart(2, "0");
      (ge(T.timeFormatted || `${xe}:${A}`),
        ce(""),
        we(T.repeatRule || "none"),
        Te(T.linkedCol || ""),
        Ne(T.linkedEntryId || ""),
        De(!0));
    },
    Ce = (T) => {
      const xe = Xh(le);
      if ((xe.has(T) ? xe.delete(T) : xe.add(T), !xe.size)) {
        we("none");
        return;
      }
      const A = Array.from(xe).sort((I, w) => I - w);
      we(`days:${A.join(",")}`);
    },
    j = async (T) => {
      if ((T.preventDefault(), !oe.trim() || K)) return;
      const [xe, A] = se.split(":"),
        I = Math.max(0, Math.min(23, Number(xe) || 0)),
        w = Math.max(0, Math.min(59, Number(A) || 0));
      h(!0);
      try {
        (je
          ? await be(`/api/mobile/reminders/${encodeURIComponent(je)}`, {
              method: "PATCH",
              body: {
                text: oe.trim(),
                hour: I,
                minute: w,
                repeatRule: le,
                enabled: !0,
              },
            })
          : await be("/api/mobile/reminders", {
              method: "POST",
              body: {
                text: oe.trim(),
                hour: I,
                minute: w,
                dateIso: U || void 0,
                repeatRule: le,
                linkedCol: Ee,
                linkedEntryId: Re,
              },
            }),
          De(!1),
          R(je ? "Напоминание обновлено." : "Напоминание добавлено."),
          await D(!0));
      } catch (k) {
        R(`Ошибка: ${k?.message || "не удалось сохранить"}`);
      } finally {
        h(!1);
      }
    },
    ee = async (T) => {
      const xe = T.status !== "pending";
      p((A) =>
        A.map((I) => (I.id === T.id ? { ...I, status: xe ? "pending" : "paused" } : I)),
      );
      try {
        (await be(`/api/mobile/reminders/${encodeURIComponent(T.id)}`, {
          method: "PATCH",
          body: { enabled: xe },
        }),
          await D(!0));
      } catch (A) {
        (p((I) => I.map((w) => (w.id === T.id ? T : w))), R(`Ошибка: ${A?.message}`));
      }
    },
    ze = async (T, xe) => {
      if (G) return;
      const A = u.findIndex((W) => W.id === T),
        I = A + xe;
      if (A < 0 || I < 0 || I >= u.length) return;
      const w = u,
        k = [...u],
        [O] = k.splice(A, 1);
      (k.splice(I, 0, O), p(k), L(!0));
      try {
        await be("/api/mobile/reminders/reorder", {
          method: "POST",
          retryOn403: !0,
          body: { reminderIds: k.map((W) => W.id) },
        });
      } catch (W) {
        (p(w), R(`Ошибка сортировки: ${W?.message}`));
      } finally {
        L(!1);
      }
    },
    Le = async (T, xe) => {
      try {
        (await be(`/api/mobile/reminders/${encodeURIComponent(T.id)}`, {
          method: "PATCH",
          body: { snoozeMinutes: xe, enabled: !0 },
        }),
          R(`Отложено на +${xe >= 60 ? `${xe / 60} ч` : `${xe} мин`}.`),
          await D(!0));
      } catch (A) {
        R(`Ошибка: ${A?.message}`);
      }
    },
    Ze = async (T) => {
      Pe("reminders", "delete_reminder");
      try {
        (await be(`/api/mobile/reminders/${encodeURIComponent(T)}`, {
          method: "DELETE",
        }),
          p((xe) => xe.filter((A) => A.id !== T)),
          R("Напоминание удалено."));
      } catch (xe) {
        R(`Ошибка удаления: ${xe?.message}`);
      }
    },
    Ue = () => {
      jb(!me, !0).then((xe) => {
        (re(xe.active), R(xe.message));
      });
    },
    qe = Xh(le);
  return n.jsxs("div", {
    className: "space-y-5",
    children: [
      n.jsxs("section", {
        className: "zau-card p-5 sm:p-6 space-y-4",
        children: [
          n.jsxs("div", {
            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
            children: [
              n.jsxs("div", {
                children: [
                  n.jsx("p", {
                    className:
                      "text-[11px] font-extrabold tracking-[0.09em] text-[#93161B] uppercase",
                    children: "Личный планировщик · Синхронизация с @ucheba_ZAU_bot",
                  }),
                  n.jsx("h2", {
                    className: "text-xl sm:text-2xl font-extrabold text-[#16161A] mt-0.5",
                    children: "Напоминания",
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                  $ !== "unsupported" &&
                    n.jsxs("button", {
                      type: "button",
                      onClick: Ue,
                      className: `inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${me ? "border-[#BFE6D3] bg-[#E8F6EF] text-[#1F6E4E]" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861] hover:text-[#16161A]"}`,
                      children: [
                        n.jsx(ed, { className: "h-3.5 w-3.5" }),
                        me ? "Веб-уведомления вкл." : "Включить в браузере",
                      ],
                    }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: Ae,
                    className:
                      "inline-flex items-center gap-1.5 rounded-xl bg-[#93161B] px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#6B0D12] transition",
                    children: [
                      n.jsx(xa, { className: "h-4 w-4" }),
                      "Настроить будильник",
                    ],
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => D(!0),
                    disabled: J,
                    className:
                      "rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] p-2 text-[#5C5861]",
                    title: "Обновить",
                    children: n.jsx(vn, {
                      className: `h-4 w-4 ${J ? "animate-spin" : ""}`,
                    }),
                  }),
                ],
              }),
            ],
          }),
          n.jsxs("form", {
            onSubmit: he,
            className: "flex items-center gap-2",
            children: [
              n.jsxs("div", {
                className: "relative flex-1",
                children: [
                  n.jsx(or, {
                    className:
                      "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B88946]",
                  }),
                  n.jsx("input", {
                    type: "text",
                    value: Z,
                    onChange: (T) => ie(T.target.value),
                    placeholder:
                      "Быстрая фраза: «завтра в 18:30 сдать реферат» или «по пн, ср, пт в 08:15 повторить греческий»",
                    className:
                      "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] pl-10 pr-4 py-2.5 text-sm text-[#16161A] placeholder:text-[#8F8A94] focus:border-[#93161B] focus:bg-white focus:outline-none",
                  }),
                ],
              }),
              n.jsxs("button", {
                type: "submit",
                disabled: Y || !Z.trim(),
                className:
                  "inline-flex items-center gap-2 rounded-xl bg-[#16161A] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#2C2C34] disabled:opacity-40 transition shrink-0",
                children: [
                  Y
                    ? n.jsx(ot, { className: "h-4 w-4 animate-spin" })
                    : n.jsx(fr, { className: "h-4 w-4" }),
                  n.jsx("span", {
                    className: "hidden sm:inline",
                    children: "Создать",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      F > 0 && n.jsx(mr, { cachedAt: F, onRetry: () => D(!0) }),
      H &&
        n.jsxs("div", {
          className:
            "flex items-center justify-between gap-2 rounded-2xl border border-[#E8E1D9] bg-white px-4 py-3 text-xs font-bold text-[#16161A]",
          children: [
            n.jsx("span", { children: H }),
            n.jsx("button", {
              type: "button",
              onClick: () => R(""),
              className: "text-[#8F8A94] hover:text-[#16161A]",
              children: n.jsx(Kt, { className: "h-4 w-4" }),
            }),
          ],
        }),
      Q &&
        n.jsx("div", {
          className:
            "rounded-2xl border border-[#F5C6C6] bg-[#FFF0F0] px-4 py-3 text-xs font-bold text-[#C92A2A]",
          children: Q,
        }),
      B && !u.length
        ? n.jsxs("div", {
            className: "zau-card py-16 flex flex-col items-center justify-center",
            children: [
              n.jsx(ot, { className: "h-8 w-8 animate-spin text-[#93161B]" }),
              n.jsx("p", {
                className: "mt-3 text-xs font-bold text-[#5C5861]",
                children: "Загружаем напоминания…",
              }),
            ],
          })
        : u.length
          ? n.jsx("div", {
              className: "space-y-3",
              children: u.map((T, xe) => {
                const A = T.status === "pending";
                return n.jsxs(
                  "article",
                  {
                    className: `zau-card p-4 sm:p-5 transition ${A ? "" : "opacity-65 bg-[#FAF8F5]"}`,
                    children: [
                      n.jsxs("div", {
                        className: "flex items-start justify-between gap-4",
                        children: [
                          n.jsxs("div", {
                            className: "flex items-start gap-4 min-w-0 flex-1",
                            children: [
                              n.jsxs("div", {
                                className:
                                  "shrink-0 rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-center tabular-nums",
                                children: [
                                  n.jsx("p", {
                                    className: `text-lg sm:text-xl font-extrabold leading-none ${A ? "text-[#93161B]" : "text-[#8F8A94]"}`,
                                    children: T.timeFormatted || "—:—",
                                  }),
                                  n.jsx("p", {
                                    className:
                                      "mt-1 text-[10px] font-bold text-[#8F8A94]",
                                    children: "МСК",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                  n.jsx("p", {
                                    className:
                                      "text-sm sm:text-base font-extrabold text-[#16161A] leading-snug",
                                    children: T.text,
                                  }),
                                  n.jsxs("div", {
                                    className:
                                      "mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#5C5861]",
                                    children: [
                                      n.jsxs("span", {
                                        className:
                                          "inline-flex items-center gap-1 font-semibold",
                                        children: [
                                          n.jsx(ud, {
                                            className: "h-3.5 w-3.5 text-[#B88946]",
                                          }),
                                          T.whenFormatted,
                                        ],
                                      }),
                                      T.repeatRule &&
                                        T.repeatRule !== "none" &&
                                        n.jsxs("span", {
                                          className:
                                            "inline-flex items-center gap-1 rounded-md bg-[#FCEEEE] px-2 py-0.5 text-[11px] font-bold text-[#93161B]",
                                          children: [
                                            n.jsx(wg, { className: "h-3 w-3" }),
                                            T.repeatLabel,
                                          ],
                                        }),
                                      !A &&
                                        n.jsx("span", {
                                          className:
                                            "rounded-md bg-[#E8E1D9] px-2 py-0.5 text-[11px] font-bold text-[#5C5861]",
                                          children: "На паузе",
                                        }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          n.jsx("button", {
                            type: "button",
                            role: "switch",
                            "aria-checked": A,
                            onClick: () => ee(T),
                            className: `relative h-7 w-12 shrink-0 rounded-full transition ${A ? "bg-[#1F6E4E]" : "bg-[#D5CCC2]"}`,
                            children: n.jsx("span", {
                              className: `absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${A ? "left-5.5" : "left-0.5"}`,
                            }),
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className:
                          "mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F3EFEA]",
                        children: [
                          n.jsx("div", {
                            className: "flex flex-wrap items-center gap-1.5",
                            children: [
                              { mins: 15, label: "+15 мин" },
                              { mins: 60, label: "+1 ч" },
                              { mins: 180, label: "+3 ч" },
                            ].map((I) =>
                              n.jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => Le(T, I.mins),
                                  className:
                                    "rounded-lg border border-[#E8E1D9] bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-bold text-[#5C5861] hover:border-[#B88946] hover:text-[#806332] transition",
                                  children: I.label,
                                },
                                I.mins,
                              ),
                            ),
                          }),
                          n.jsxs("div", {
                            className: "flex items-center gap-1",
                            children: [
                              u.length > 1 &&
                                n.jsxs(n.Fragment, {
                                  children: [
                                    n.jsx("button", {
                                      type: "button",
                                      disabled: xe === 0 || G,
                                      onClick: () => ze(T.id, -1),
                                      className:
                                        "rounded-lg p-1.5 text-[#8F8A94] hover:bg-[#FAF8F5] hover:text-[#16161A] disabled:opacity-30",
                                      title: "Выше",
                                      children: n.jsx(Cg, {
                                        className: "h-3.5 w-3.5",
                                      }),
                                    }),
                                    n.jsx("button", {
                                      type: "button",
                                      disabled: xe === u.length - 1 || G,
                                      onClick: () => ze(T.id, 1),
                                      className:
                                        "rounded-lg p-1.5 text-[#8F8A94] hover:bg-[#FAF8F5] hover:text-[#16161A] disabled:opacity-30",
                                      title: "Ниже",
                                      children: n.jsx(Ag, {
                                        className: "h-3.5 w-3.5",
                                      }),
                                    }),
                                  ],
                                }),
                              n.jsx("button", {
                                type: "button",
                                onClick: () => V(T),
                                className:
                                  "rounded-lg p-1.5 text-[#8F8A94] hover:bg-[#FAF8F5] hover:text-[#16161A]",
                                title: "Изменить",
                                children: n.jsx(ji, {
                                  className: "h-3.5 w-3.5",
                                }),
                              }),
                              n.jsx("button", {
                                type: "button",
                                onClick: () => Ze(T.id),
                                className:
                                  "rounded-lg p-1.5 text-[#8F8A94] hover:bg-[#FFF0F0] hover:text-[#C92A2A]",
                                title: "Удалить",
                                children: n.jsx(hs, {
                                  className: "h-3.5 w-3.5",
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  },
                  T.id,
                );
              }),
            })
          : n.jsxs("div", {
              className: "zau-card p-10 text-center",
              children: [
                n.jsx("div", {
                  className:
                    "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF6EA] text-[#B88946]",
                  children: n.jsx(cr, { className: "h-6 w-6" }),
                }),
                n.jsx("p", {
                  className: "mt-3 text-sm font-extrabold text-[#16161A]",
                  children: "Активных напоминаний пока нет",
                }),
                n.jsx("p", {
                  className: "mt-1 text-xs text-[#5C5861]",
                  children:
                    "Напишите фразу выше или нажмите «Настроить будильник», чтобы выбрать время и дни недели.",
                }),
              ],
            }),
      Me &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
          onClick: () => De(!1),
          children: n.jsxs("form", {
            onSubmit: j,
            onClick: (T) => T.stopPropagation(),
            className:
              "w-full max-w-md rounded-3xl border border-[#E8E1D9] bg-white p-6 shadow-2xl space-y-4",
            children: [
              n.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  n.jsx("h3", {
                    className: "text-lg font-extrabold text-[#16161A]",
                    children: je ? "Изменить напоминание" : "Новое напоминание",
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => De(!1),
                    className: "rounded-xl p-1.5 text-[#8F8A94]",
                    children: n.jsx(Kt, { className: "h-5 w-5" }),
                  }),
                ],
              }),
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    className: "block text-xs font-bold text-[#5C5861] mb-1",
                    children: "О чём напомнить",
                  }),
                  n.jsx("textarea", {
                    rows: 3,
                    value: oe,
                    onChange: (T) => de(T.target.value),
                    placeholder: "Например: подготовить конспект по Истории церкви",
                    className:
                      "w-full rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-3.5 text-sm text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  n.jsxs("div", {
                    children: [
                      n.jsx("label", {
                        className: "block text-xs font-bold text-[#5C5861] mb-1",
                        children: "Время (Москва)",
                      }),
                      n.jsx("input", {
                        type: "time",
                        value: se,
                        onChange: (T) => ge(T.target.value),
                        className:
                          "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-bold text-[#16161A] tabular-nums",
                      }),
                    ],
                  }),
                  le === "none" &&
                    !je &&
                    n.jsxs("div", {
                      children: [
                        n.jsx("label", {
                          className: "block text-xs font-bold text-[#5C5861] mb-1",
                          children: "Дата (необяз.)",
                        }),
                        n.jsx("input", {
                          type: "date",
                          value: U,
                          onChange: (T) => ce(T.target.value),
                          className:
                            "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3 py-2.5 text-sm font-semibold text-[#16161A]",
                        }),
                      ],
                    }),
                ],
              }),
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    className: "block text-xs font-bold text-[#5C5861] mb-1.5",
                    children: "Повтор",
                  }),
                  n.jsx("div", {
                    className: "flex flex-wrap gap-1.5 mb-2.5",
                    children: [
                      { id: "none", label: "Один раз" },
                      { id: "daily", label: "Ежедневно" },
                      { id: "weekdays", label: "Пн–Пт" },
                    ].map((T) =>
                      n.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => we(T.id),
                          className: `rounded-xl border px-3 py-1.5 text-xs font-bold transition ${le === T.id ? "border-[#93161B] bg-[#93161B] text-white" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861]"}`,
                          children: T.label,
                        },
                        T.id,
                      ),
                    ),
                  }),
                  n.jsx("p", {
                    className: "text-[11px] font-semibold text-[#8F8A94] mb-1.5",
                    children: "Или выберите конкретные дни недели:",
                  }),
                  n.jsx("div", {
                    className: "grid grid-cols-7 gap-1.5",
                    children: vy.map((T) => {
                      const xe = qe.has(T.num);
                      return n.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => Ce(T.num),
                          className: `rounded-xl border py-2 text-xs font-extrabold transition ${xe ? "border-[#93161B] bg-[#FCEEEE] text-[#93161B]" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861]"}`,
                          children: T.label,
                        },
                        T.num,
                      );
                    }),
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex justify-end gap-2 pt-2",
                children: [
                  n.jsx("button", {
                    type: "button",
                    onClick: () => De(!1),
                    className:
                      "rounded-xl border border-[#E8E1D9] px-4 py-2.5 text-xs font-bold text-[#5C5861]",
                    children: "Отмена",
                  }),
                  n.jsxs("button", {
                    type: "submit",
                    disabled: K || !oe.trim(),
                    className:
                      "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#6B0D12] disabled:opacity-50",
                    children: [
                      K && n.jsx(ot, { className: "h-3.5 w-3.5 animate-spin" }),
                      "Сохранить",
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function jy({
  user: r,
  groupKey: m,
  sabbathModeActive: x,
  sabbathModeSource: u,
  globalSabbathModeEnabled: p,
  onOpenBible: F,
  onNavigateTab: M,
}) {
  const B = (r.isAdmin && m) || r.groupKey,
    q = d.useRef(0),
    [J, ae] = d.useState(null),
    [G, L] = d.useState(""),
    [Q, X] = d.useState(
      () => (typeof window < "u" && window.innerWidth >= 1024, "table"),
    ),
    [H, R] = d.useState(!0),
    [Z, ie] = d.useState(!1),
    [Y, ne] = d.useState(""),
    [me, re] = d.useState(() => gn()),
    [$, Me] = d.useState(!1),
    [De, je] = d.useState(""),
    [ue, oe] = d.useState("REPLACE"),
    [de, se] = d.useState("1"),
    [ge, U] = d.useState("09:00–10:20"),
    [ce, le] = d.useState(""),
    [we, Ee] = d.useState(""),
    [Te, Re] = d.useState(""),
    [Ne, K] = d.useState(""),
    [h, D] = d.useState(!1),
    [he, Ae] = d.useState(""),
    V = ms(),
    Ce = d.useCallback(
      async (A = "", I = !1) => {
        const w = ++q.current,
          k = String(B || ""),
          W = `sched_web_v1_${r.accountId || r.effectiveUserId || r.login || "web"}_${k}_${A || "current"}`;
        (I ? ie(!0) : R(!0), ne(""));
        let ve = null;
        !I &&
          !r.isAdmin &&
          ((ve = gs(W)),
          ve && String(ve.groupKey || "") === k
            ? (ae(ve),
              L((Ke) => Ke || ve.selectedDateIso || ve.days?.[0]?.dateIso || ""),
              R(!1))
            : (ve = null));
        const Be = new URLSearchParams();
        (A && Be.set("date", A),
          I && Be.set("refresh", "1"),
          r.isAdmin && Be.set("groupKey", k));
        const Lt = Be.toString() ? `?${Be.toString()}` : "";
        try {
          const Ke = await be(`/api/mobile/schedule${Lt}`, {
            cacheKey: r.isAdmin ? "" : W,
            validateResponse: (_t) => String(_t.groupKey || "") === k,
          });
          if (w !== q.current) return;
          (ae(Ke), L(A || Ke.selectedDateIso || Ke.days?.[0]?.dateIso || ""));
        } catch (Ke) {
          if (w !== q.current) return;
          ((ve && !([401, 403].includes(Ke?.status) && Ke?.isApiResponse)) || ae(null),
            ne(Ke?.message || "Не удалось загрузить расписание ЗАУ."));
        } finally {
          w === q.current && (R(!1), ie(!1));
        }
      },
      [B, r.accountId, r.effectiveUserId, r.isAdmin, r.login],
    );
  useRecovery(() => Ce(G || "", false));
  (d.useEffect(
    () => (
      ae(null),
      L(""),
      Ce("", !1),
      () => {
        q.current += 1;
      }
    ),
    [Ce],
  ),
    d.useEffect(() => {
      const A = window.setInterval(() => re(gn()), 3e4);
      return () => window.clearInterval(A);
    }, []));
  const j = (A, I) => {
      (Pe("schedule", "open_lesson_editor"),
        je(I),
        oe("REPLACE"),
        se(A.period || "1"),
        U(A.startTime && A.endTime ? `${A.startTime}–${A.endTime}` : "09:00–10:20"),
        le(A.subject || ""),
        Ee(""),
        Re(A.classrooms?.[0] || ""),
        K(A.note || ""),
        Ae(""),
        Me(!0));
    },
    ee = (A) => {
      (Pe("schedule", "open_add_lesson"),
        je(A),
        oe("ADD"),
        se("5"),
        U("16:30–17:50"),
        le(""),
        Ee(""),
        Re(""),
        K(""),
        Ae(""),
        Me(!0));
    },
    ze = async (A) => {
      if ((A.preventDefault(), (ue === "REPLACE" || ue === "ADD") && !we.trim())) {
        Ae("Укажите название предмета.");
        return;
      }
      (Pe("schedule", "save_schedule_change"), D(!0), Ae(""));
      try {
        const I = r.isAdmin ? `?groupKey=${encodeURIComponent(B)}` : "";
        (await be(`/api/mobile/schedule/override${I}`, {
          method: "POST",
          body: {
            dateIso: De,
            actionType: ue,
            period: de,
            timeRange: ge,
            origSubject: ce,
            newSubject: we.trim(),
            newRoom: Te.trim(),
            comment: Ne.trim(),
          },
        }),
          Me(!1),
          await Ce(De, !0));
      } catch (I) {
        Ae(I?.message || "Не удалось сохранить изменение расписания.");
      } finally {
        D(!1);
      }
    },
    Le = async (A, I) => {
      Pe("schedule", "reset_schedule_change");
      try {
        const w = r.isAdmin ? `?groupKey=${encodeURIComponent(B)}` : "";
        (await be(`/api/mobile/schedule/override/${encodeURIComponent(A)}${w}`, {
          method: "DELETE",
        }),
          await Ce(I, !0));
      } catch (w) {
        ne(w?.message || "Не удалось сбросить правку.");
      }
    };
  const Ze = J?.days || [],
    Ue = Ze.find((A) => A.dateIso === G) || Ze[0] || null,
    qe = Ze.reduce((A, I) => A + (I.lessons?.length || 0), 0),
    T = ob.useMemo(() => {
      const A = (w) => {
          if (!w) return 9999;
          const [k, O] = w.split(":").map(Number);
          return Number.isFinite(k) ? k * 60 + (Number.isFinite(O) ? O : 0) : 9999;
        },
        I = new Map();
      for (const w of Ze)
        w.lessons.forEach((k, O) => {
          const W = String(k.period || "").trim(),
            ve = String(k.startTime || "").trim(),
            Be = String(k.endTime || "").trim(),
            Lt = W ? `p:${W}` : ve ? `t:${ve}-${Be}` : `i:${O + 1}`,
            Ke = I.get(Lt);
          if (Ke)
            (!Ke.startTime && ve && (Ke.startTime = ve),
              !Ke.endTime && Be && (Ke.endTime = Be),
              Ke.byDay[w.dateIso] || (Ke.byDay[w.dateIso] = []),
              Ke.byDay[w.dateIso].push(k));
          else {
            const _t = Number(W),
              dl = Number.isFinite(_t) && _t > 0 ? _t * 10 : 1e3 + A(ve);
            I.set(Lt, {
              key: Lt,
              periodLabel: W ? `${W} пара` : ve ? "Занятие" : `${O + 1} пара`,
              startTime: ve,
              endTime: Be,
              sortKey: dl,
              byDay: { [w.dateIso]: [k] },
            });
          }
        });
      return Array.from(I.values()).sort((w, k) => w.sortKey - k.sortKey);
    }, [Ze]),
    xe = (A, I, w, k = !1) =>
      n.jsxs(
        "article",
        {
          className: `rounded-2xl border transition ${k ? "p-3" : "p-4 sm:p-5"} ${A.isCancelled ? "border-[#F5C6C6] bg-[#FFF0F0]/45" : A.isPast ? "border-[#E8E1D9] bg-[#FAF8F5] opacity-80" : "border-[#E8E1D9] bg-white shadow-2xs hover:border-[#93161B]/35"}`,
          children: [
            n.jsxs("div", {
              className: "flex flex-wrap items-center justify-between gap-1.5 text-xs",
              children: [
                n.jsx("span", {
                  className: `rounded-lg px-2 py-0.5 text-[11px] font-extrabold ${A.isPast ? "bg-[#E8E1D9]/70 text-[#5C5861]" : "bg-[#FCEEEE] text-[#93161B]"}`,
                  children: A.period ? `${A.period} пара` : `${w + 1} пара`,
                }),
                n.jsxs("span", {
                  className:
                    "inline-flex items-center gap-1 text-[11px] font-bold text-[#5C5861] tabular-nums",
                  children: [
                    n.jsx(ud, { className: "h-3 w-3 text-[#8F8A94]" }),
                    A.startTime || "—",
                    A.endTime ? `–${A.endTime}` : "",
                  ],
                }),
              ],
            }),
            n.jsx("h4", {
              className: `mt-2 font-extrabold leading-snug ${k ? "text-xs" : "text-base"} ${A.isCancelled ? "line-through text-[#8F8A94]" : "text-[#16161A]"}`,
              children: A.subject,
            }),
            n.jsxs("div", {
              className:
                "mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[#5C5861]",
              children: [
                A.classrooms?.length
                  ? n.jsxs("span", {
                      className:
                        "inline-flex items-center gap-1 rounded-md bg-[#F3EFEA] px-2 py-0.5 font-bold text-[#16161A]",
                      children: [
                        n.jsx(nb, { className: "h-3 w-3 text-[#93161B]" }),
                        A.classrooms.join(", "),
                      ],
                    })
                  : null,
                A.teachers?.length
                  ? n.jsx("span", {
                      className: "truncate text-[#5C5861]",
                      children: A.teachers.join(", "),
                    })
                  : null,
              ],
            }),
            A.isChanged &&
              n.jsx("p", {
                className: `mt-2 text-[11px] font-extrabold ${A.isCancelled ? "text-[#C92A2A]" : "text-[#9A6F32]"}`,
                children: A.isCancelled
                  ? "Занятие отменено"
                  : "В расписании есть изменение",
              }),
            A.note &&
              n.jsx("p", {
                className:
                  "mt-1.5 rounded-lg bg-[#FDF6EA] px-2.5 py-1.5 text-[11px] font-semibold text-[#6E5123]",
                children: A.note,
              }),
            A.linkedHomework &&
              n.jsxs("button", {
                type: "button",
                onClick: () => M("study", "hw"),
                className: `mt-2.5 w-full rounded-xl border px-3 py-2 text-left transition ${A.linkedHomework.isDone ? "border-[#BFE6D3] bg-[#E8F6EF]/60 text-[#1F6E4E]" : "border-[#F2CACA] bg-[#FCEEEE]/55 text-[#6B0D12] hover:bg-[#FCEEEE]"}`,
                children: [
                  n.jsxs("p", {
                    className: "flex items-center gap-1 text-[10.5px] font-extrabold",
                    children: [
                      n.jsx(ma, { className: "h-3 w-3 shrink-0" }),
                      A.linkedHomework.isDone
                        ? "ДЗ выполнено"
                        : "Домашнее задание к паре",
                    ],
                  }),
                  n.jsx("p", {
                    className: "mt-0.5 line-clamp-2 text-[11px] font-medium opacity-90",
                    children: A.linkedHomework.preview,
                  }),
                ],
              }),
            J?.canManage &&
              n.jsxs("div", {
                className:
                  "no-print mt-3 flex flex-wrap items-center gap-2 pt-2.5 border-t border-[#F3EFEA]",
                children: [
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => j(A, I),
                    className:
                      "inline-flex items-center gap-1 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] px-2.5 py-1 text-[11px] font-bold text-[#5C5861] hover:border-[#93161B] hover:text-[#93161B] transition",
                    children: [n.jsx(ji, { className: "h-3 w-3" }), "Править"],
                  }),
                  A.overrideId &&
                    n.jsxs("button", {
                      type: "button",
                      onClick: () => Le(A.overrideId, I),
                      className:
                        "inline-flex items-center gap-1 rounded-lg bg-[#FFF0F0] px-2.5 py-1 text-[11px] font-bold text-[#C92A2A] hover:bg-[#FDE2E2] transition",
                      children: [n.jsx(lb, { className: "h-3 w-3" }), "Сбросить"],
                    }),
                ],
              }),
          ],
        },
        `${I}_${A.period}_${w}`,
      );
  if (x)
    return n.jsxs("div", {
      className: "space-y-5",
      children: [
        n.jsxs("div", {
          className: "zau-card p-5 sm:p-6",
          children: [
            n.jsx("p", {
              className:
                "text-[11px] font-extrabold tracking-[0.09em] text-[#9A6F32] uppercase",
              children: "Учебная неделя ЗАУ (Пн–Пт)",
            }),
            n.jsx("h2", {
              className: "text-xl font-extrabold text-[#16161A] mt-0.5",
              children: "Расписание занятий",
            }),
            n.jsx("p", {
              className: "mt-1 text-xs text-[#5C5861]",
              children:
                "В Заокском университете суббота — день покоя; учебные занятия проходят с понедельника по пятницу.",
            }),
          ],
        }),
        n.jsx(vb, {
          startAt: me.startAt,
          endAt: me.endAt,
          modeSource: u || (p ? "global" : "calendar"),
          globalModeEnabled: p,
          userId: r.accountId || r.effectiveUserId || r.login,
          onOpenBible: F,
        }),
      ],
    });
  return n.jsxs("div", {
    className: "space-y-5",
    children: [
      n.jsxs("section", {
        className: "zau-card p-5 sm:p-6",
        children: [
          n.jsxs("div", {
            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
            children: [
              n.jsxs("div", {
                children: [
                  n.jsx("p", {
                    className:
                      "text-[11px] font-extrabold tracking-[0.09em] text-[#93161B] uppercase",
                    children: r.isAdmin
                      ? "Админ · Просмотр группы"
                      : "Учебная неделя ЗАУ (Пн–Пт)",
                  }),
                  n.jsx("h2", {
                    className: "text-xl sm:text-2xl font-extrabold text-[#16161A] mt-0.5",
                    children: r.isAdmin ? B : `${r.direction} · ${r.course} курс`,
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "no-print flex flex-wrap items-center gap-2",
                children: [
                  n.jsxs("div", {
                    className: "inline-flex rounded-xl bg-[#F3EFEA] p-1",
                    children: [
                      n.jsxs("button", {
                        type: "button",
                        onClick: () => {
                          (Pe("schedule", "switch_table_view"), X("table"));
                        },
                        className: `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${Q === "table" ? "bg-white text-[#93161B] shadow-2xs" : "text-[#5C5861]"}`,
                        children: [n.jsx(Sg, { className: "h-3.5 w-3.5" }), "Таблица"],
                      }),
                      n.jsxs("button", {
                        type: "button",
                        onClick: () => {
                          (Pe("schedule", "toggle_day_week_view"), X("day"));
                        },
                        className: `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${Q === "day" ? "bg-white text-[#93161B] shadow-2xs" : "text-[#5C5861]"}`,
                        children: [n.jsx(eb, { className: "h-3.5 w-3.5" }), "День"],
                      }),
                      n.jsxs("button", {
                        type: "button",
                        onClick: () => {
                          (Pe("schedule", "toggle_day_week_view"), X("week"));
                        },
                        className: `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${Q === "week" ? "bg-white text-[#93161B] shadow-2xs" : "text-[#5C5861]"}`,
                        children: [n.jsx(Fg, { className: "h-3.5 w-3.5" }), "Карточки"],
                      }),
                    ],
                  }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => Ce(G, !0),
                    disabled: Z,
                    title: "Синхронизировать с EduPage ЗАУ",
                    className:
                      "inline-flex items-center gap-1.5 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3 py-2 text-xs font-bold text-[#16161A] hover:bg-[#F3EFEA] transition",
                    children: [
                      n.jsx(vn, {
                        className: `h-3.5 w-3.5 text-[#93161B] ${Z ? "animate-spin" : ""}`,
                      }),
                      n.jsx("span", {
                        className: "hidden sm:inline",
                        children: "EduPage",
                      }),
                    ],
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => window.print(),
                    title: "Распечатать расписание",
                    className:
                      "hidden md:inline-flex items-center justify-center rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] p-2 text-[#5C5861] hover:text-[#16161A] transition",
                    children: n.jsx(Dg, { className: "h-4 w-4" }),
                  }),
                ],
              }),
            ],
          }),
          J &&
            n.jsxs("div", {
              className:
                "mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#F3EFEA] pt-4",
              children: [
                n.jsxs("button", {
                  type: "button",
                  onClick: () => {
                    (Pe("schedule", "previous_week"), Ce(J.prevWeekIso, !1));
                  },
                  className:
                    "no-print inline-flex items-center gap-1 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#16161A] hover:border-[#93161B]/40 transition",
                  children: [n.jsx(tb, { className: "h-4 w-4" }), "Пред. неделя"],
                }),
                n.jsxs("div", {
                  className: "flex items-center gap-2.5 text-center",
                  children: [
                    n.jsx(Jh, { className: "h-4 w-4 text-[#93161B]" }),
                    n.jsxs("span", {
                      className: "text-sm font-extrabold text-[#16161A] tabular-nums",
                      children: [Ze[0]?.shortDate, " – ", Ze[4]?.shortDate],
                    }),
                    n.jsxs("span", {
                      className:
                        "rounded-full bg-[#F3EFEA] px-2.5 py-0.5 text-[11px] font-bold text-[#5C5861]",
                      children: [qe, " пар"],
                    }),
                    n.jsx("button", {
                      type: "button",
                      onClick: () => Ce("", !1),
                      className:
                        "no-print text-xs font-bold text-[#93161B] hover:underline ml-1",
                      children: "Сегодня",
                    }),
                  ],
                }),
                n.jsxs("button", {
                  type: "button",
                  onClick: () => {
                    (Pe("schedule", "next_week"), Ce(J.nextWeekIso, !1));
                  },
                  className:
                    "no-print inline-flex items-center gap-1 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#16161A] hover:border-[#93161B]/40 transition",
                  children: ["След. неделя", n.jsx(rr, { className: "h-4 w-4" })],
                }),
              ],
            }),
          Ze.length > 0 &&
            n.jsx("div", {
              className: "no-print mt-4 grid grid-cols-5 gap-2",
              children: Ze.map((A) => {
                const I = Q === "day" && A.dateIso === Ue?.dateIso,
                  w = A.dateIso === V;
                return n.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      (Pe("schedule", "select_day"), L(A.dateIso), X("day"));
                    },
                    className: `rounded-2xl border px-2 py-2.5 text-center transition ${I ? "border-[#93161B] bg-[#93161B] text-white shadow-xs" : w ? "border-[#F2CACA] bg-[#FCEEEE]/65 text-[#93161B]" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#16161A] hover:border-[#93161B]/35"}`,
                    children: [
                      n.jsx("p", {
                        className: "text-xs font-extrabold",
                        children: A.weekdayShort,
                      }),
                      n.jsx("p", {
                        className: `mt-0.5 text-[11px] font-semibold tabular-nums ${I ? "text-white/85" : "text-[#5C5861]"}`,
                        children: A.shortDate,
                      }),
                      n.jsx("p", {
                        className: `mt-1 text-[10px] font-bold ${I ? "text-[#F0C274]" : "text-[#8F8A94]"}`,
                        children: A.lessons.length ? `${A.lessons.length} п.` : "своб.",
                      }),
                    ],
                  },
                  A.dateIso,
                );
              }),
            }),
        ],
      }),
      J?._offline && n.jsx(mr, { cachedAt: J._cachedAt, onRetry: () => Ce(G, !0) }),
      Y &&
        n.jsx("div", {
          className:
            "rounded-2xl border border-[#F5C6C6] bg-[#FFF0F0] px-4 py-3 text-xs font-bold text-[#C92A2A]",
          children: Y,
        }),
      H && !J
        ? n.jsxs("div", {
            className: "zau-card py-16 flex flex-col items-center justify-center",
            children: [
              n.jsx(ot, { className: "h-8 w-8 animate-spin text-[#93161B]" }),
              n.jsx("p", {
                className: "mt-3 text-xs font-bold text-[#5C5861]",
                children: "Загружаем расписание Заокского университета…",
              }),
            ],
          })
        : Q === "table"
          ? n.jsx("section", {
              className: "zau-card overflow-hidden",
              children: T.length
                ? n.jsx("div", {
                    className: "overflow-x-auto",
                    children: n.jsxs("table", {
                      className: "w-full min-w-[780px] border-collapse text-left",
                      children: [
                        n.jsx("thead", {
                          children: n.jsxs("tr", {
                            className: "border-b border-[#E8E1D9] bg-[#FAF8F5]",
                            children: [
                              n.jsx("th", {
                                className:
                                  "sticky left-0 z-10 w-28 border-r border-[#E8E1D9] bg-[#F3EFEA] px-3.5 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#5C5861]",
                                children: "Пара / Время",
                              }),
                              Ze.map((A) => {
                                const I = A.dateIso === V;
                                return n.jsx(
                                  "th",
                                  {
                                    className: `w-[18%] border-r last:border-r-0 border-[#E8E1D9] px-3.5 py-3 align-top ${I ? "bg-[#FCEEEE]/85" : "bg-[#FAF8F5]"}`,
                                    children: n.jsxs("div", {
                                      className:
                                        "flex items-center justify-between gap-1.5",
                                      children: [
                                        n.jsxs("div", {
                                          children: [
                                            n.jsxs("div", {
                                              className: "flex items-center gap-1.5",
                                              children: [
                                                n.jsx("span", {
                                                  className:
                                                    "text-xs font-extrabold uppercase text-[#93161B]",
                                                  children: A.weekdayShort,
                                                }),
                                                n.jsx("span", {
                                                  className:
                                                    "text-xs font-bold text-[#16161A] tabular-nums",
                                                  children: A.shortDate,
                                                }),
                                              ],
                                            }),
                                            I &&
                                              n.jsx("span", {
                                                className:
                                                  "mt-0.5 inline-block rounded-md bg-[#93161B] px-1.5 py-0.5 text-[9.5px] font-extrabold text-white",
                                                children: "Сегодня",
                                              }),
                                          ],
                                        }),
                                        J?.canManage &&
                                          n.jsx("button", {
                                            type: "button",
                                            onClick: () => ee(A.dateIso),
                                            title: `Добавить пару (${A.weekdayShort})`,
                                            className:
                                              "no-print rounded-lg border border-[#E8E1D9] bg-white p-1 text-[#93161B] hover:bg-[#FCEEEE]",
                                            children: n.jsx(xa, {
                                              className: "h-3 w-3",
                                            }),
                                          }),
                                      ],
                                    }),
                                  },
                                  A.dateIso,
                                );
                              }),
                            ],
                          }),
                        }),
                        n.jsx("tbody", {
                          className: "divide-y divide-[#E8E1D9]",
                          children: T.map((A) =>
                            n.jsxs(
                              "tr",
                              {
                                className: "align-top",
                                children: [
                                  n.jsxs("td", {
                                    className:
                                      "sticky left-0 z-10 border-r border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-3 whitespace-nowrap",
                                    children: [
                                      n.jsx("p", {
                                        className:
                                          "text-xs font-extrabold text-[#93161B]",
                                        children: A.periodLabel,
                                      }),
                                      A.startTime &&
                                        n.jsxs("p", {
                                          className:
                                            "mt-1 text-[11px] font-bold text-[#5C5861] tabular-nums",
                                          children: [
                                            A.startTime,
                                            A.endTime ? `–${A.endTime}` : "",
                                          ],
                                        }),
                                    ],
                                  }),
                                  Ze.map((I) => {
                                    const w = A.byDay[I.dateIso] || [],
                                      k = I.dateIso === V;
                                    return n.jsx(
                                      "td",
                                      {
                                        className: `border-r last:border-r-0 border-[#E8E1D9] p-2.5 transition ${k ? "bg-[#FCEEEE]/20" : "bg-white"}`,
                                        children: w.length
                                          ? n.jsx("div", {
                                              className: "space-y-2",
                                              children: w.map((O, W) => {
                                                const ve =
                                                  O.startTime &&
                                                  (O.startTime !== A.startTime ||
                                                    O.endTime !== A.endTime);
                                                return n.jsxs(
                                                  "div",
                                                  {
                                                    className: `${W > 0 ? "pt-2 border-t border-dashed border-[#E8E1D9]" : ""} ${O.isCancelled ? "rounded-xl bg-[#FFF0F0]/70 p-2" : O.isPast ? "opacity-75" : ""}`,
                                                    children: [
                                                      n.jsxs("div", {
                                                        className:
                                                          "flex items-start justify-between gap-1.5",
                                                        children: [
                                                          n.jsx("p", {
                                                            className: `text-xs font-extrabold leading-snug ${O.isCancelled ? "line-through text-[#8F8A94]" : "text-[#16161A]"}`,
                                                            children: O.subject,
                                                          }),
                                                          J?.canManage &&
                                                            n.jsx("button", {
                                                              type: "button",
                                                              onClick: () =>
                                                                j(O, I.dateIso),
                                                              title: "Изменить занятие",
                                                              className:
                                                                "no-print shrink-0 rounded-md p-1 text-[#8F8A94] hover:bg-[#FCEEEE] hover:text-[#93161B]",
                                                              children: n.jsx(ji, {
                                                                className: "h-3 w-3",
                                                              }),
                                                            }),
                                                        ],
                                                      }),
                                                      ve &&
                                                        n.jsxs("p", {
                                                          className:
                                                            "mt-0.5 text-[10.5px] font-bold text-[#93161B] tabular-nums",
                                                          children: [
                                                            O.startTime,
                                                            O.endTime
                                                              ? `–${O.endTime}`
                                                              : "",
                                                          ],
                                                        }),
                                                      O.teachers?.length
                                                        ? n.jsx("p", {
                                                            className:
                                                              "mt-1 text-[11px] text-[#5C5861] leading-tight",
                                                            children:
                                                              O.teachers.join(", "),
                                                          })
                                                        : null,
                                                      n.jsxs("div", {
                                                        className:
                                                          "mt-1.5 flex flex-wrap items-center gap-1",
                                                        children: [
                                                          O.classrooms?.length
                                                            ? n.jsx("span", {
                                                                className:
                                                                  "inline-flex items-center gap-1 rounded-md bg-[#F3EFEA] px-1.5 py-0.5 text-[10.5px] font-bold text-[#16161A]",
                                                                children:
                                                                  O.classrooms.join(", "),
                                                              })
                                                            : null,
                                                          O.linkedHomework &&
                                                            n.jsxs("button", {
                                                              type: "button",
                                                              onClick: () =>
                                                                M("study", "hw"),
                                                              title:
                                                                O.linkedHomework.preview,
                                                              className: `no-print inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-extrabold transition ${O.linkedHomework.isDone ? "border-[#BFE6D3] bg-[#E8F6EF] text-[#1F6E4E]" : "border-[#F2CACA] bg-[#FCEEEE] text-[#93161B] hover:bg-[#F9DFDF]"}`,
                                                              children: [
                                                                n.jsx(ma, {
                                                                  className:
                                                                    "h-2.5 w-2.5",
                                                                }),
                                                                O.linkedHomework.isDone
                                                                  ? "ДЗ ✓"
                                                                  : "ДЗ",
                                                              ],
                                                            }),
                                                        ],
                                                      }),
                                                      O.isChanged &&
                                                        n.jsx("p", {
                                                          className: `mt-1 text-[10px] font-extrabold ${O.isCancelled ? "text-[#C92A2A]" : "text-[#9A6F32]"}`,
                                                          children: O.isCancelled
                                                            ? "Отменено"
                                                            : "Замена",
                                                        }),
                                                      O.note &&
                                                        n.jsx("p", {
                                                          className:
                                                            "mt-1 rounded-md bg-[#FDF6EA] px-2 py-1 text-[10.5px] font-semibold text-[#6E5123] leading-tight",
                                                          children: O.note,
                                                        }),
                                                    ],
                                                  },
                                                  `${I.dateIso}_${A.key}_${W}`,
                                                );
                                              }),
                                            })
                                          : n.jsx("div", {
                                              className:
                                                "h-full min-h-14 flex items-center justify-center text-xs text-[#D5CCC2] select-none",
                                              children: "—",
                                            }),
                                      },
                                      I.dateIso,
                                    );
                                  }),
                                ],
                              },
                              A.key,
                            ),
                          ),
                        }),
                      ],
                    }),
                  })
                : n.jsxs("div", {
                    className: "p-10 text-center",
                    children: [
                      n.jsx("p", {
                        className: "text-sm font-extrabold text-[#16161A]",
                        children: "На выбранную неделю пар в расписании нет",
                      }),
                      n.jsx("p", {
                        className: "mt-1 text-xs text-[#5C5861]",
                        children:
                          "Попробуйте переключить неделю или нажать «EduPage» для обновления.",
                      }),
                    ],
                  }),
            })
          : Q === "week"
            ? n.jsx("section", {
                className:
                  "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start",
                children: Ze.map((A) => {
                  const I = A.dateIso === V;
                  return n.jsxs(
                    "div",
                    {
                      className: `zau-card p-3.5 space-y-2.5 ${I ? "ring-2 ring-[#93161B]/25 border-[#93161B]/45" : ""}`,
                      children: [
                        n.jsxs("div", {
                          className:
                            "flex items-center justify-between gap-2 border-b border-[#F3EFEA] pb-2.5",
                          children: [
                            n.jsxs("div", {
                              children: [
                                n.jsxs("p", {
                                  className:
                                    "text-xs font-extrabold text-[#93161B] uppercase",
                                  children: [A.weekdayShort, " · ", A.shortDate],
                                }),
                                I &&
                                  n.jsx("span", {
                                    className:
                                      "text-[10px] font-extrabold text-[#1F6E4E]",
                                    children: "Сегодня",
                                  }),
                              ],
                            }),
                            J?.canManage &&
                              n.jsx("button", {
                                type: "button",
                                onClick: () => ee(A.dateIso),
                                title: "Добавить пару",
                                className:
                                  "no-print rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] p-1.5 text-[#93161B] hover:bg-[#FCEEEE]",
                                children: n.jsx(xa, {
                                  className: "h-3.5 w-3.5",
                                }),
                              }),
                          ],
                        }),
                        A.lessons.length
                          ? A.lessons.map((w, k) => xe(w, A.dateIso, k, !0))
                          : n.jsx("p", {
                              className: "py-6 text-center text-xs text-[#8F8A94]",
                              children: "Занятий по расписанию нет",
                            }),
                      ],
                    },
                    A.dateIso,
                  );
                }),
              })
            : Ue
              ? n.jsxs("section", {
                  className: "space-y-3",
                  children: [
                    n.jsxs("div", {
                      className: "flex items-center justify-between gap-3 px-1",
                      children: [
                        n.jsx("h3", {
                          className: "text-base sm:text-lg font-extrabold text-[#16161A]",
                          children: Ue.header,
                        }),
                        J?.canManage &&
                          n.jsxs("button", {
                            type: "button",
                            onClick: () => ee(Ue.dateIso),
                            className:
                              "no-print inline-flex items-center gap-1.5 rounded-xl bg-[#93161B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#6B0D12] transition",
                            children: [
                              n.jsx(xa, { className: "h-3.5 w-3.5" }),
                              "Добавить занятие",
                            ],
                          }),
                      ],
                    }),
                    Ue.lessons.length
                      ? n.jsx("div", {
                          className: "space-y-3",
                          children: Ue.lessons.map((A, I) => xe(A, Ue.dateIso, I, !1)),
                        })
                      : n.jsxs("div", {
                          className: "zau-card p-8 text-center",
                          children: [
                            n.jsx("p", {
                              className: "text-sm font-bold text-[#16161A]",
                              children: "На этот день пар в расписании нет",
                            }),
                            n.jsx("p", {
                              className: "mt-1 text-xs text-[#5C5861]",
                              children:
                                "День для самостоятельной подготовки, работы в библиотеке или отдыха.",
                            }),
                          ],
                        }),
                  ],
                })
              : null,
      $ &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs",
          onClick: () => Me(!1),
          children: n.jsxs("form", {
            onSubmit: ze,
            onClick: (A) => A.stopPropagation(),
            className:
              "w-full max-w-lg rounded-3xl border border-[#E8E1D9] bg-white p-6 shadow-2xl space-y-4",
            children: [
              n.jsxs("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                  n.jsxs("div", {
                    children: [
                      n.jsxs("p", {
                        className:
                          "text-[11px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                        children: ["Управление расписанием · ", De],
                      }),
                      n.jsx("h3", {
                        className: "text-lg font-extrabold text-[#16161A] mt-0.5",
                        children: "Изменение занятия для группы",
                      }),
                    ],
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => Me(!1),
                    className: "rounded-xl p-1.5 text-[#8F8A94] hover:bg-[#F3EFEA]",
                    children: n.jsx(Kt, { className: "h-5 w-5" }),
                  }),
                ],
              }),
              n.jsx("div", {
                className:
                  "grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl bg-[#F3EFEA] p-1",
                children: [
                  { id: "REPLACE", label: "Замена" },
                  { id: "CANCEL", label: "Отмена" },
                  { id: "ADD", label: "Доп. пара" },
                  { id: "NOTE", label: "Пометка" },
                ].map((A) =>
                  n.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => oe(A.id),
                      className: `rounded-lg py-2 text-xs font-extrabold transition ${ue === A.id ? "bg-white text-[#93161B] shadow-2xs" : "text-[#5C5861]"}`,
                      children: A.label,
                    },
                    A.id,
                  ),
                ),
              }),
              n.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  n.jsxs("div", {
                    children: [
                      n.jsx("label", {
                        className: "block text-xs font-bold text-[#5C5861] mb-1",
                        children: "Номер пары",
                      }),
                      n.jsx("input", {
                        type: "text",
                        value: de,
                        onChange: (A) => se(A.target.value),
                        className:
                          "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-sm font-semibold",
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("label", {
                        className: "block text-xs font-bold text-[#5C5861] mb-1",
                        children: "Время",
                      }),
                      n.jsx("input", {
                        type: "text",
                        value: ge,
                        onChange: (A) => U(A.target.value),
                        placeholder: "09:00–10:20",
                        className:
                          "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-sm font-semibold",
                      }),
                    ],
                  }),
                ],
              }),
              ce &&
                ue !== "ADD" &&
                n.jsxs("p", {
                  className:
                    "rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] px-3.5 py-2 text-xs text-[#5C5861]",
                  children: [
                    "Исходная пара: ",
                    n.jsx("strong", {
                      className: "text-[#16161A]",
                      children: ce,
                    }),
                  ],
                }),
              (ue === "REPLACE" || ue === "ADD") &&
                n.jsxs("div", {
                  children: [
                    n.jsx("label", {
                      className: "block text-xs font-bold text-[#5C5861] mb-1",
                      children: "Название предмета",
                    }),
                    n.jsx("input", {
                      type: "text",
                      value: we,
                      onChange: (A) => Ee(A.target.value),
                      placeholder: "Введите предмет",
                      className:
                        "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold",
                    }),
                  ],
                }),
              ue !== "CANCEL" &&
                n.jsxs("div", {
                  children: [
                    n.jsx("label", {
                      className: "block text-xs font-bold text-[#5C5861] mb-1",
                      children: "Аудитория",
                    }),
                    n.jsx("input", {
                      type: "text",
                      value: Te,
                      onChange: (A) => Re(A.target.value),
                      placeholder: "Например: 214",
                      className:
                        "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-sm font-semibold",
                    }),
                  ],
                }),
              n.jsxs("div", {
                children: [
                  n.jsx("label", {
                    className: "block text-xs font-bold text-[#5C5861] mb-1",
                    children: "Комментарий для группы",
                  }),
                  n.jsx("input", {
                    type: "text",
                    value: Ne,
                    onChange: (A) => K(A.target.value),
                    placeholder: "Например: перенос в актовый зал",
                    className:
                      "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-sm",
                  }),
                ],
              }),
              he &&
                n.jsx("p", {
                  className: "text-xs font-bold text-[#C92A2A]",
                  children: he,
                }),
              n.jsxs("div", {
                className: "flex justify-end gap-2.5 pt-2",
                children: [
                  n.jsx("button", {
                    type: "button",
                    onClick: () => Me(!1),
                    className:
                      "rounded-xl border border-[#E8E1D9] px-4 py-2.5 text-xs font-bold text-[#5C5861]",
                    children: "Отмена",
                  }),
                  n.jsxs("button", {
                    type: "submit",
                    disabled: h,
                    className:
                      "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6B0D12] disabled:opacity-50",
                    children: [
                      h && n.jsx(ot, { className: "h-3.5 w-3.5 animate-spin" }),
                      "Сохранить изменение",
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function Ey({ url: r, name: m, onClose: x }) {
  const [u, p] = d.useState(!1);
  return (
    d.useEffect(() => {
      const F = (M) => {
        M.key === "Escape" && x();
      };
      return (
        window.addEventListener("keydown", F),
        () => window.removeEventListener("keydown", F)
      );
    }, [x]),
    r
      ? n.jsxs("div", {
          className: "fixed inset-0 z-50 flex flex-col bg-black/88 backdrop-blur-xs",
          onClick: x,
          children: [
            n.jsxs("div", {
              className:
                "flex items-center justify-between gap-3 px-4 py-3 text-white border-b border-white/10",
              onClick: (F) => F.stopPropagation(),
              children: [
                n.jsx("p", {
                  className: "truncate text-sm font-semibold text-white/90",
                  children: m || "Просмотр изображения",
                }),
                n.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    n.jsxs("button", {
                      type: "button",
                      onClick: () => p((F) => !F),
                      className:
                        "inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition",
                      children: [
                        u
                          ? n.jsx(Bg, { className: "h-4 w-4" })
                          : n.jsx(Tg, { className: "h-4 w-4" }),
                        u ? "Уменьшить" : "Увеличить",
                      ],
                    }),
                    n.jsxs("a", {
                      href: r,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      download: m || "zau-photo.jpg",
                      className:
                        "inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition",
                      children: [
                        n.jsx(bn, { className: "h-4 w-4" }),
                        n.jsx("span", {
                          className: "hidden sm:inline",
                          children: "Скачать",
                        }),
                      ],
                    }),
                    n.jsx("a", {
                      href: r,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className:
                        "inline-flex items-center gap-1.5 rounded-lg bg-white/10 p-1.5 hover:bg-white/20 transition",
                      title: "Открыть в новой вкладке",
                      children: n.jsx(dr, { className: "h-4 w-4" }),
                    }),
                    n.jsx("button", {
                      type: "button",
                      onClick: x,
                      className:
                        "rounded-lg bg-white/15 p-1.5 hover:bg-white/25 transition",
                      "aria-label": "Закрыть",
                      children: n.jsx(Kt, { className: "h-4 w-4" }),
                    }),
                  ],
                }),
              ],
            }),
            n.jsx("div", {
              className: "flex-1 overflow-auto flex items-center justify-center p-4",
              onClick: x,
              children: n.jsx("img", {
                src: r,
                alt: m || "Вложение",
                onClick: (F) => {
                  (F.stopPropagation(), p((M) => !M));
                },
                className: `rounded-lg shadow-2xl transition-transform duration-200 ${u ? "max-w-none scale-125 cursor-zoom-out" : "max-h-[84vh] max-w-[94vw] object-contain cursor-zoom-in"}`,
              }),
            }),
          ],
        })
      : null
  );
}
function wy({
  visible: r,
  user: m,
  groupKey: x,
  subjects: u,
  defaultSubjectId: p,
  onSave: F,
  onClose: M,
}) {
  const [B, q] = d.useState(""),
    [J, ae] = d.useState(""),
    [G, L] = d.useState(ms()),
    [Q, X] = d.useState(""),
    [H, R] = d.useState(null),
    [Z, ie] = d.useState(!1),
    [Y, ne] = d.useState(!1),
    [me, re] = d.useState(!1),
    [$, Me] = d.useState(!1),
    [De, je] = d.useState(!1),
    [ue, oe] = d.useState(""),
    [de, se] = d.useState(""),
    ge = d.useRef(null),
    U = d.useRef(null),
    ce =
      typeof window < "u" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  if (
    (d.useEffect(() => {
      if (!r) return;
      const K = u.find((D) => D.id === p) || u[0] || null;
      (q(K?.id || ""),
        ae(K ? `Лекция — ${K.name}` : "Конспект лекции"),
        L(ms()),
        X(""),
        R(null),
        se(""),
        oe(""),
        ne(!0));
      let h = !0;
      return (
        be("/api/mobile/lecture/status", { retryOn404: !0 })
          .then((D) => {
            h && ie(!!D.enabled);
          })
          .catch(() => {
            h && ie(!1);
          })
          .finally(() => {
            h && ne(!1);
          }),
        () => {
          h = !1;
          try {
            U.current?.stop?.();
          } catch {}
          je(!1);
        }
      );
    }, [r, p, u]),
    !r)
  )
    return null;
  const le = u.find((K) => K.id === B) || u[0],
    we = (K) => {
      const h = K.target.files?.[0];
      if (((K.target.value = ""), !!h)) {
        if ((se(""), h.size > iy)) {
          se("Максимальный размер аудиозаписи — 9 МБ. Выберите более короткий фрагмент.");
          return;
        }
        (R(h), oe(`Выбран файл «${h.name}» (${qh(h.size)})`));
      }
    },
    Ee = async () => {
      if (!(!H || !le || me)) {
        (re(!0), se(""), oe("Отправляем аудио в облачный ИИ и распознаём русскую речь…"));
        try {
          const K = await xs(H),
            h = m.isAdmin && x ? `?groupKey=${encodeURIComponent(x)}` : "",
            D = await be(`/api/mobile/lecture/transcribe${h}`, {
              method: "POST",
              retryOn404: !0,
              retryTransport: !1,
              timeoutMs: 12e4,
              body: {
                fileName: H.name,
                mimeType: H.type || "audio/mpeg",
                base64: K,
                language: "ru",
                subjectName: le.name,
              },
            }),
            he = String(D.transcript || "").trim();
          if (!he) throw new Error("Сервис не вернул распознанный текст.");
          (X((Ae) =>
            Ae.trim()
              ? `${Ae.trim()}

${he}`
              : he,
          ),
            oe(`Готово! Распознано слов: ${D.wordCount || he.split(/\s+/).length}.`));
        } catch (K) {
          (se(K?.message || "Не удалось расшифровать аудиозапись."), oe(""));
        } finally {
          re(!1);
        }
      }
    },
    Te = () => {
      if (De) {
        try {
          U.current?.stop?.();
        } catch {}
        je(!1);
        return;
      }
      const K = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!K) {
        se(
          "Ваш браузер не поддерживает голосовую диктовку (используйте Chrome, Edge или Safari).",
        );
        return;
      }
      se("");
      const h = new K();
      ((h.lang = "ru-RU"),
        (h.continuous = !0),
        (h.interimResults = !1),
        (h.onresult = (D) => {
          const he = [];
          for (let V = D.resultIndex; V < D.results.length; V += 1)
            D.results[V].isFinal &&
              he.push(String(D.results[V][0]?.transcript || "").trim());
          const Ae = he.filter(Boolean).join(" ");
          Ae && X((V) => (V.trim() ? `${V.trim()} ${Ae}` : Ae));
        }),
        (h.onerror = (D) => {
          (D?.error && D.error !== "aborted" && se(`Диктовка остановлена: ${D.error}`),
            je(!1));
        }),
        (h.onend = () => {
          je(!1);
        }),
        (U.current = h),
        h.start(),
        je(!0),
        oe(
          "Идёт живая запись с микрофона (ru-RU). Говорите — текст добавляется в поле ниже.",
        ));
    },
    Re = async () => {
      if (!le) {
        se("Сначала выберите предмет.");
        return;
      }
      if (Q.trim().length < 5) {
        se("Введите, надиктуйте или расшифруйте текст конспекта.");
        return;
      }
      (Me(!0), se(""));
      try {
        if (De) {
          try {
            U.current?.stop?.();
          } catch {}
          je(!1);
        }
        (await F({
          title: J.trim() || `Лекция — ${le.name}`,
          transcript: Q.trim(),
          lectureDate: G,
          subject: le,
        }),
          M());
      } catch (K) {
        se(K?.message || "Не удалось сохранить личный конспект.");
      } finally {
        Me(!1);
      }
    },
    Ne = Q.trim() ? Q.trim().split(/\s+/).length : 0;
  return n.jsx("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
    onClick: M,
    children: n.jsxs("div", {
      className:
        "w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-[#E8E1D9] bg-white shadow-2xl",
      onClick: (K) => K.stopPropagation(),
      children: [
        n.jsxs("div", {
          className:
            "flex items-start justify-between gap-3 border-b border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
          children: [
            n.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                n.jsx("div", {
                  className:
                    "flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCEEEE] text-[#93161B]",
                  children: n.jsx(ub, { className: "h-5 w-5" }),
                }),
                n.jsxs("div", {
                  children: [
                    n.jsx("p", {
                      className:
                        "text-[11px] font-extrabold tracking-[0.08em] text-[#93161B] uppercase",
                      children: "Личный конспект · Word DOCX",
                    }),
                    n.jsx("h3", {
                      className: "text-lg font-extrabold text-[#16161A]",
                      children: "Расшифровка и запись лекции",
                    }),
                  ],
                }),
              ],
            }),
            n.jsx("button", {
              type: "button",
              onClick: M,
              className:
                "rounded-xl p-2 text-[#8F8A94] hover:bg-[#E8E1D9]/60 hover:text-[#16161A]",
              "aria-label": "Закрыть",
              children: n.jsx(Kt, { className: "h-5 w-5" }),
            }),
          ],
        }),
        n.jsxs("div", {
          className: "flex-1 overflow-y-auto p-6 space-y-4",
          children: [
            n.jsxs("div", {
              className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
              children: [
                n.jsxs("div", {
                  className: "sm:col-span-2",
                  children: [
                    n.jsx("label", {
                      className: "block text-xs font-bold text-[#5C5861] mb-1",
                      children: "Предмет",
                    }),
                    n.jsx("select", {
                      value: B,
                      onChange: (K) => {
                        const h = K.target.value;
                        q(h);
                        const D = u.find((he) => he.id === h);
                        D &&
                          (!J.trim() || J.startsWith("Лекция — ")) &&
                          ae(`Лекция — ${D.name}`);
                      },
                      className:
                        "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                      children: u.map((K) =>
                        n.jsx("option", { value: K.id, children: K.name }, K.id),
                      ),
                    }),
                  ],
                }),
                n.jsxs("div", {
                  children: [
                    n.jsx("label", {
                      className: "block text-xs font-bold text-[#5C5861] mb-1",
                      children: "Дата лекции",
                    }),
                    n.jsx("input", {
                      type: "date",
                      value: G,
                      onChange: (K) => L(K.target.value),
                      className:
                        "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                    }),
                  ],
                }),
              ],
            }),
            n.jsxs("div", {
              children: [
                n.jsx("label", {
                  className: "block text-xs font-bold text-[#5C5861] mb-1",
                  children: "Заголовок конспекта",
                }),
                n.jsx("input", {
                  type: "text",
                  value: J,
                  onChange: (K) => ae(K.target.value),
                  placeholder: "Лекция — Введение в предмет",
                  className:
                    "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                }),
              ],
            }),
            n.jsxs("div", {
              className: "rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-4 space-y-3",
              children: [
                n.jsxs("div", {
                  className: "flex flex-wrap items-center justify-between gap-2",
                  children: [
                    n.jsx("p", {
                      className: "text-xs font-extrabold text-[#16161A]",
                      children: "Голосовой ввод и ИИ-расшифровка",
                    }),
                    n.jsx("span", {
                      className: `rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${Y ? "bg-[#E8E1D9] text-[#5C5861]" : Z ? "bg-[#E8F6EF] text-[#1F6E4E]" : "bg-[#FDF6EA] text-[#806332]"}`,
                      children: Y
                        ? "Проверка ИИ…"
                        : Z
                          ? "Облачный Whisper активен"
                          : "Режим браузерной диктовки и текста",
                    }),
                  ],
                }),
                n.jsxs("div", {
                  className: "flex flex-wrap gap-2",
                  children: [
                    ce &&
                      n.jsxs("button", {
                        type: "button",
                        onClick: Te,
                        className: `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${De ? "bg-[#C92A2A] text-white animate-pulse" : "bg-[#93161B] text-white hover:bg-[#6B0D12]"}`,
                        children: [
                          De
                            ? n.jsx(zg, { className: "h-4 w-4" })
                            : n.jsx(_g, { className: "h-4 w-4" }),
                          De ? "Остановить диктовку" : "Диктовать с микрофона",
                        ],
                      }),
                    n.jsx("input", {
                      ref: ge,
                      type: "file",
                      accept: "audio/*,.m4a,.mp3,.wav,.aac,.ogg,.opus,.webm",
                      className: "hidden",
                      onChange: we,
                    }),
                    n.jsxs("button", {
                      type: "button",
                      onClick: () => ge.current?.click(),
                      disabled: me,
                      className:
                        "inline-flex items-center gap-2 rounded-xl border border-[#E8E1D9] bg-white px-3.5 py-2 text-xs font-bold text-[#16161A] hover:bg-[#F3EFEA] transition",
                      children: [
                        n.jsx(nd, { className: "h-4 w-4 text-[#93161B]" }),
                        "Загрузить аудио (до 9 МБ)",
                      ],
                    }),
                    H &&
                      n.jsxs("button", {
                        type: "button",
                        disabled: !Z || me,
                        onClick: Ee,
                        className:
                          "inline-flex items-center gap-2 rounded-xl border border-[#F2CACA] bg-[#FCEEEE] px-3.5 py-2 text-xs font-bold text-[#93161B] hover:bg-[#F9DFDF] disabled:opacity-50 transition",
                        children: [
                          me
                            ? n.jsx(ot, { className: "h-4 w-4 animate-spin" })
                            : n.jsx(or, { className: "h-4 w-4" }),
                          "Расшифровать через ИИ",
                        ],
                      }),
                  ],
                }),
                H &&
                  n.jsxs("div", {
                    className:
                      "flex items-center justify-between gap-2 rounded-xl bg-white border border-[#E8E1D9] px-3 py-2 text-xs",
                    children: [
                      n.jsxs("span", {
                        className: "truncate font-semibold text-[#16161A]",
                        children: [H.name, " · ", qh(H.size)],
                      }),
                      n.jsx("button", {
                        type: "button",
                        onClick: () => R(null),
                        className: "text-[#C92A2A] hover:opacity-75",
                        "aria-label": "Убрать аудиофайл",
                        children: n.jsx(hs, { className: "h-4 w-4" }),
                      }),
                    ],
                  }),
              ],
            }),
            ue &&
              n.jsx("p", {
                className:
                  "rounded-xl bg-[#FDF6EA] border border-[#EBD7B1] px-3.5 py-2 text-xs font-semibold text-[#6E5123]",
                children: ue,
              }),
            de &&
              n.jsx("p", {
                className:
                  "rounded-xl bg-[#FFF0F0] border border-[#F5C6C6] px-3.5 py-2 text-xs font-bold text-[#C92A2A]",
                children: de,
              }),
            n.jsxs("div", {
              children: [
                n.jsxs("div", {
                  className: "flex items-center justify-between mb-1",
                  children: [
                    n.jsx("label", {
                      className: "text-xs font-bold text-[#5C5861]",
                      children: "Текст лекции",
                    }),
                    n.jsxs("span", {
                      className: "text-[11px] text-[#8F8A94] tabular-nums",
                      children: ["Слов: ", Ne],
                    }),
                  ],
                }),
                n.jsx("textarea", {
                  rows: 9,
                  value: Q,
                  onChange: (K) => X(K.target.value),
                  placeholder:
                    "Нажмите «Диктовать с микрофона», загрузите аудиозапись для ИИ-расшифровки или вставьте текст лекции — сервер автоматически сформирует личный конспект и файл Word (.docx).",
                  className:
                    "w-full rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-4 text-sm leading-relaxed text-[#16161A] placeholder:text-[#8F8A94] focus:border-[#93161B] focus:bg-white focus:outline-none",
                }),
                n.jsx("p", {
                  className: "mt-1 text-[11px] text-[#8F8A94]",
                  children:
                    "Конспект сохраняется приватно только в вашем аккаунте (исходный аудиофайл в базе не хранится).",
                }),
              ],
            }),
          ],
        }),
        n.jsxs("div", {
          className:
            "flex items-center justify-end gap-2.5 border-t border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
          children: [
            n.jsx("button", {
              type: "button",
              onClick: M,
              className:
                "rounded-xl border border-[#E8E1D9] bg-white px-4 py-2.5 text-sm font-bold text-[#5C5861] hover:bg-[#F3EFEA]",
              children: "Отмена",
            }),
            n.jsxs("button", {
              type: "button",
              disabled: $ || !Q.trim() || !le,
              onClick: Re,
              className:
                "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#6B0D12] disabled:opacity-45 transition",
              children: [
                $
                  ? n.jsx(ot, { className: "h-4 w-4 animate-spin" })
                  : n.jsx(od, { className: "h-4 w-4" }),
                "Сохранить и создать DOCX",
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function Cy(r) {
  const m = String(r || "").replace(/^\uFEFF/, ""),
    x = [];
  let u = [],
    p = "",
    F = !1;
  for (let M = 0; M < m.length; M += 1) {
    const B = m[M];
    if (F) {
      B === '"' ? (m[M + 1] === '"' ? ((p += '"'), (M += 1)) : (F = !1)) : (p += B);
      continue;
    }
    B === '"' && p.length === 0
      ? (F = !0)
      : B === ","
        ? (u.push(p), (p = ""))
        : B ===
              `
` || B === "\r"
          ? (B === "\r" &&
              m[M + 1] ===
                `
` &&
              (M += 1),
            u.push(p),
            (p = ""),
            u.some((q) => String(q).trim()) && x.push(u),
            (u = []))
          : (p += B);
  }
  return (
    (p.length || u.length) && (u.push(p), u.some((M) => String(M).trim()) && x.push(u)),
    x
  );
}
function pi(r) {
  return String(r || "")
    .replace(/\r/g, "")
    .trim();
}
function Ay(r, m, x) {
  const u = pi(r).match(/(?:^|\D)(\d{1,2})\.(\d{1,2})(?:\D|$)/);
  if (!u) return null;
  const p = Number(u[1]),
    F = Number(u[2]);
  if (F < 1 || F > 12 || p < 1 || p > 31) return null;
  const M = F >= 8 ? m : x;
  if (!M) return null;
  const B = new Date(Date.UTC(M, F - 1, p));
  return B.getUTCFullYear() !== M || B.getUTCMonth() !== F - 1 || B.getUTCDate() !== p
    ? null
    : `${M}-${String(F).padStart(2, "0")}-${String(p).padStart(2, "0")}`;
}
function Sy(r) {
  const m = Cy(r),
    x = m.flat().map(pi).filter(Boolean).join(`
`),
    u = x.match(/\b(20\d{2})\s*[/-]\s*(20\d{2})\b/),
    p = new Date().getFullYear(),
    F = u ? Number(u[1]) : p,
    M = u ? Number(u[2]) : p + 1,
    B = x.match(/([12])\s*СЕМЕСТР/i),
    q = x.match(/([1-6])\s*КУРС/i),
    ae = (
      m
        .flat()
        .map(pi)
        .find((ie) => /\b\d{2}\.\d{2}\.\d{2}\b/.test(ie)) || ""
    )
      .replace(/^.*?\b\d{2}\.\d{2}\.\d{2}\b\s*/i, "")
      .trim(),
    G = B ? Number(B[1]) : 0,
    L = q ? Number(q[1]) : 0,
    Q = u ? `${F}/${M}` : "",
    X = [],
    H = [];
  let R = [];
  for (const ie of m) {
    const Y = ie.map(($) => Ay($, F, M));
    if (Y.some(Boolean)) {
      R = Y;
      continue;
    }
    const me = pi(ie[0]).match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/);
    if (!me || !R.length) continue;
    const re = `${me[1]}–${me[2]}`;
    for (let $ = 1; $ < ie.length; $ += 1) {
      const Me = R[$],
        De = pi(ie[$])
          .split(
            `
`,
          )
          .map((de) => de.trim())
          .filter(Boolean);
      if (!Me || !De.length) continue;
      const je = De[0],
        ue = De.slice(1).join(" · "),
        oe = {
          subject: je.replace(/\s+/g, " ").trim(),
          dateKey: Me,
          time: re,
          details: ue,
        };
      /^консультация(?:\s|$)/i.test(je)
        ? H.push({
            ...oe,
            subject: je.replace(/^консультация\s*/i, "").trim() || "Консультация",
          })
        : X.push(oe);
    }
  }
  const Z = (ie, Y) =>
    ie.dateKey.localeCompare(Y.dateKey) || ie.time.localeCompare(Y.time);
  return (
    X.sort(Z),
    H.sort(Z),
    {
      format: "zau-session-schedule-csv-v1",
      academicYear: Q,
      semester: G,
      direction: ae,
      course: L,
      exams: X,
      consultations: H,
      rowsRead: m.length,
    }
  );
}
const Wu = [
  { id: "hw", label: "Домашние ДЗ", singular: "Домашнее задание", icon: ur },
  { id: "notes", label: "Конспекты", singular: "Конспект лекции", icon: od },
  { id: "lit", label: "Литература", singular: "Литература", icon: ib },
  { id: "exam", label: "Сессия", singular: "Экзамен / зачёт", icon: cb },
];
function bi(r) {
  return String(r || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim();
}
function Fy({
  user: r,
  groupKey: m,
  activeSemester: x,
  initialCollection: u,
  sabbathModeActive: p,
  onOpenQuiz: F,
  onQuickRemindForEntry: M,
}) {
  const B = (r.isAdmin && m) || r.groupKey,
    q = d.useRef(0),
    J = d.useRef(0),
    [ae, G] = d.useState(u || "hw"),
    L = x || 1,
    [Q, X] = d.useState(""),
    [H, R] = d.useState(""),
    [Z, ie] = d.useState(""),
    [Y, ne] = d.useState(!1),
    [me, re] = d.useState(!1),
    [$, Me] = d.useState([]),
    [De, je] = d.useState([]),
    [ue, oe] = d.useState(0),
    [de, se] = d.useState(!0),
    [ge, U] = d.useState(!1),
    [ce, le] = d.useState(""),
    [we, Ee] = d.useState(!1),
    [Te, Re] = d.useState(""),
    [Ne, K] = d.useState([]),
    [h, D] = d.useState(!1),
    [he, Ae] = d.useState(null),
    [V, Ce] = d.useState(null),
    [j, ee] = d.useState(null),
    [ze, Le] = d.useState(null),
    [Ze, Ue] = d.useState(""),
    [qe, T] = d.useState(!1),
    [xe, A] = d.useState(""),
    [I, w] = d.useState(""),
    [k, O] = d.useState(ms()),
    [lessonDate, setLessonDate] = d.useState(""),
    [W, ve] = d.useState(""),
    [Be, Lt] = d.useState(""),
    [Ke, _t] = d.useState([]),
    [dl, Nn] = d.useState(!1),
    [Ga, Zl] = d.useState(!1),
    [ha, Qt] = d.useState(""),
    jn = d.useRef(null),
    En = d.useRef(null),
    [Ot, Vl] = d.useState(!1),
    [$l, Ya] = d.useState(""),
    [P, Se] = d.useState(!1),
    [mt, Jt] = d.useState(!1),
    [Ei, Ka] = d.useState(""),
    [ut, jl] = d.useState(null),
    [qt, hr] = d.useState(!0),
    [ys, wi] = d.useState(!1),
    [Qa, El] = d.useState(""),
    [Jl, wl] = d.useState(null),
    Xa = d.useRef(null);
  (d.useEffect(() => {
    u && G(u);
  }, [u]),
    d.useEffect(() => {
      const g = window.setTimeout(() => ie(H.trim()), 260);
      return () => window.clearTimeout(g);
    }, [H]),
    d.useEffect(() => {
      (X(""), ne(!1), re(!1), Re(""), Ce(null));
    }, [B, L]));
  const It = d.useCallback(
    async (g = !1) => {
      const ye = ++q.current,
        Ge = String(B || ""),
        et = r.accountId || r.effectiveUserId || r.login || "web";
      (g ? U(!0) : se(!0), le(""));
      const _e = new URLSearchParams({
          collection: ae,
          semester: String(L),
          ...(Q ? { subjectId: Q } : {}),
          ...(Z.length >= 2 ? { q: Z } : {}),
          ...(r.isAdmin ? { groupKey: Ge } : {}),
        }).toString(),
        ht = `entries_web_v1_${et}_${Ge}_${_e}`;
      let Ft = null;
      !r.isAdmin &&
        !g &&
        ((Ft = gs(ht)),
        Ft && String(Ft.groupKey || "") === Ge && Number(Ft.semester ?? L) === Number(L)
          ? (Me(Ft.subjects || []), je(Ft.entries || []), oe(Ft._cachedAt || 0), se(!1))
          : (Ft = null));
      try {
        const Dt = await be(`/api/mobile/entries?${_e}`, {
          cacheKey: r.isAdmin ? "" : ht,
          validateResponse: (ft) =>
            String(ft.groupKey || "") === Ge && Number(ft.semester ?? L) === Number(L),
        });
        if (ye !== q.current) return;
        (Me(Dt.subjects || []),
          je(Dt.entries || []),
          oe((Dt._offline && Dt._cachedAt) || 0));
      } catch (Dt) {
        if (ye !== q.current) return;
        ((Ft && !([401, 403].includes(Dt?.status) && Dt?.isApiResponse)) ||
          (Me([]), je([])),
          le(Dt?.message || "Не удалось загрузить учебные материалы."));
      } finally {
        ye === q.current && (se(!1), U(!1));
      }
    },
    [ae, L, Q, Z, B, r.accountId, r.effectiveUserId, r.isAdmin, r.login],
  );
  useRecovery(() => It(false));
  d.useEffect(() => {
    It(!1);
  }, [It]);
  const wn = d.useCallback(async () => {
    const g = ++J.current,
      ye = String(B || ""),
      Ge = r.isAdmin ? `?groupKey=${encodeURIComponent(ye)}` : "";
    try {
      const et = await be(`/api/mobile/lectures${Ge}`, {
        retryOn404: !0,
        validateResponse: (_e) => String(_e.groupKey || "") === ye,
      });
      if (g !== J.current) return;
      K(et.lectures || []);
    } catch {
      g === J.current && K([]);
    }
  }, [B, r.isAdmin]);
  d.useEffect(
    () => (
      wn(),
      () => {
        J.current += 1;
      }
    ),
    [wn],
  );
  const Ci = d.useMemo(
      () =>
        De.filter(
          (g) =>
            !(
              (Y && (ae === "hw" || ae === "exam") && g.isDone) ||
              (me && !g.ocrText?.trim())
            ),
        ),
      [De, Y, me, ae],
    ),
    Cn = d.useMemo(
      () =>
        ae !== "notes"
          ? []
          : Ne.filter(
              (g) =>
                !(
                  (Q && g.subjectId !== Q) ||
                  (Z.length >= 2 &&
                    !`${g.title} ${g.subjectName} ${g.preview || ""} ${g.transcript || ""}`
                      .toLowerCase()
                      .includes(Z.toLowerCase()))
                ),
            ),
      [ae, Ne, Q, Z],
    ),
    vs = async (g) => {
      Pe("study", "toggle_material_done");
      const ye = r.isAdmin ? `?groupKey=${encodeURIComponent(B)}` : "";
      Re("");
      try {
        const et = !!(
          await be(`/api/mobile/entries/${encodeURIComponent(g.id)}/toggle-done${ye}`, {
            method: "POST",
            retryTransport: !1,
            validateResponse: (_e) => String(_e.groupKey || "") === String(B || ""),
            body: { collection: g.collection },
          })
        ).isDone;
        (je((_e) =>
          _e.map((ht) => (String(ht.id) === String(g.id) ? { ...ht, isDone: et } : ht)),
        ),
          Ce((_e) =>
            _e && String(_e.id) === String(g.id) ? { ..._e, isDone: et } : _e,
          ));
      } catch (Ge) {
        Re(`Ошибка: ${Ge?.message || "не удалось изменить отметку"}`);
      }
    },
    Za = async () => {
      (Pe("study", "complete_previous_homework"), Ee(!0), Re(""));
      try {
        const g = r.isAdmin ? `?groupKey=${encodeURIComponent(B)}` : "",
          ye = await be(`/api/mobile/entries/complete-previous${g}`, {
            method: "POST",
            retryOn403: !0,
            validateResponse: (et) => String(et.groupKey || "") === String(B || ""),
            body: { collection: "hw", subjectId: Q || "" },
          }),
          Ge = new Set((ye.entryIds || []).map(String));
        (Ge.size &&
          je((et) =>
            et.map((_e) => (Ge.has(String(_e.id)) ? { ..._e, isDone: !0 } : _e)),
          ),
          Re(
            ye.completedCount
              ? `Отмечено выполненными прошедших ДЗ: ${ye.completedCount}.`
              : "Все прошедшие домашние задания уже отмечены выполненными.",
          ));
      } catch (g) {
        const ye = g?.status ? ` (HTTP ${g.status})` : "";
        Re(`Не удалось закрыть прошедшие ДЗ${ye}: ${g?.message || "ошибка"}`);
      } finally {
        Ee(!1);
      }
    },
    Ai = () => {
      (Pe("study", `open_new_${ae}`),
        A(""),
        w(Q || $[0]?.id || ""),
        O(ms()),
        setLessonDate(""),
        ve(""),
        Lt(""),
        _t([]),
        Qt(""),
        T(!0));
    },
    Ns = (g) => {
      (Pe("study", `open_edit_${g.collection}`),
        A(g.id),
        w(g.subjectId || $[0]?.id || ""),
        O(g.dateKey || ms()),
        setLessonDate(g.lessonDate || ""),
        ve(g.description || ""),
        Lt(g.ocrText || ""),
        _t(g.files || []),
        Qt(""),
        Ce(null),
        T(!0));
    },
    js = async (g, ye) => {
      if (g.size > pb) {
        Qt("Максимальный размер одного файла — 6 МБ.");
        return;
      }
      (Nn(!0), Qt(""));
      try {
        const Ge = g.type.startsWith("image/"),
          et = Ge
            ? await gb(g)
            : {
                fileName: g.name || "document",
                mimeType: g.type || "application/octet-stream",
                base64: await xs(g),
              },
          _e = await be("/api/mobile/upload", {
            method: "POST",
            body: { ...et, runOcr: ye && Ge },
          });
        (_t((ht) => [...ht, _e.file]),
          _e.ocrText &&
            Lt((ht) =>
              [ht, _e.ocrText].filter(Boolean).join(`

`),
            ));
      } catch (Ge) {
        Qt(Ge?.message || "Не удалось загрузить вложение.");
      } finally {
        Nn(!1);
      }
    },
    Si = async (g) => {
      if ((g.preventDefault(), !I)) {
        Qt("Выберите дисциплину.");
        return;
      }
      if (!W.trim() && !Be.trim() && !Ke.length) {
        Qt("Добавьте текст описания или прикрепите файл/фото.");
        return;
      }
      (Zl(!0), Qt(""));
      try {
        const ye = r.isAdmin ? `?groupKey=${encodeURIComponent(B)}` : "";
        (await be(`/api/mobile/entries${ye}`, {
          method: "POST",
          body: {
            id: xe || void 0,
            collection: ae,
            semester: L,
            subjectId: I,
            dateKey: k,
            ...(ae === "hw" ? { lessonDate } : {}),
            description: W.trim(),
            ocrText: Be.trim(),
            files: Ke,
          },
        }),
          T(!1),
          Re(xe ? "Материал обновлён." : "Материал добавлен в общую базу группы."),
          await It(!0));
      } catch (ye) {
        Qt(ye?.message || "Не удалось сохранить запись.");
      } finally {
        Zl(!1);
      }
    },
    Es = async () => {
      if (!ze) return;
      const g = ze;
      Le(null);
      try {
        const ye = new URLSearchParams({
          collection: g.collection,
          ...(r.isAdmin ? { groupKey: B } : {}),
        }).toString();
        (await be(`/api/mobile/entries/${encodeURIComponent(g.id)}?${ye}`, {
          method: "DELETE",
        }),
          V?.id === g.id && Ce(null),
          Re("Запись удалена."),
          await It(!0));
      } catch (ye) {
        Re(`Не удалось удалить: ${ye?.message || "ошибка доступа"}`);
      }
    },
    ws = async (g) => {
      if ((g.preventDefault(), !(!$l.trim() || P))) {
        (Pe("study", "create_subject"), Se(!0));
        try {
          const ye = r.isAdmin ? `?groupKey=${encodeURIComponent(B)}` : "",
            Ge = await be(`/api/mobile/subjects${ye}`, {
              method: "POST",
              body: { name: $l.trim(), semester: L },
            });
          (Ya(""), Vl(!1), Ge.id && X(Ge.id), await It(!0));
        } catch (ye) {
          Re(`Не удалось создать предмет: ${ye?.message || "нет прав"}`);
        } finally {
          Se(!1);
        }
      }
    },
    Fi = async ({ title: g, transcript: ye, lectureDate: Ge, subject: et }) => {
      const _e = r.isAdmin ? `?groupKey=${encodeURIComponent(B)}` : "",
        ht = await be(`/api/mobile/lectures${_e}`, {
          method: "POST",
          retryOn404: !0,
          retryTransport: !1,
          timeoutMs: 2e4,
          body: {
            title: g,
            transcript: ye,
            lectureDate: Ge,
            semester: L,
            subjectId: et.id,
          },
        });
      (G("notes"),
        ht.lecture &&
          K((Ft) => [ht.lecture, ...Ft.filter((Dt) => Dt.id !== ht.lecture.id)]),
        Re("Личный конспект лекции сохранён (доступно скачивание Word .docx)."),
        await wn());
    },
    Di = async (g) => {
      const ye = g.target.files?.[0];
      if (((g.target.value = ""), !!ye)) {
        (El(""), wl(null));
        try {
          const Ge = await ye.text(),
            et = Sy(Ge);
          if (!et.exams.length && !et.consultations.length) {
            (El(
              "В CSV не найдено дат и времени экзаменов. Экспортируйте лист расписания сессии ЗАУ из Google Sheets в формат CSV.",
            ),
              jl(null));
            return;
          }
          (Ka(ye.name), jl(et));
        } catch (Ge) {
          El(Ge?.message || "Не удалось прочитать CSV-файл.");
        }
      }
    },
    Cl = async () => {
      if (!ut || ys) return;
      (wi(!0), El(""));
      let g = 0,
        ye = 0;
      const Ge = [];
      try {
        const et = r.isAdmin ? `?groupKey=${encodeURIComponent(B)}` : "",
          _e = await be(
            `/api/mobile/entries?collection=exam&semester=${L}${r.isAdmin ? `&groupKey=${encodeURIComponent(B)}` : ""}`,
            {
              validateResponse: (ft) => String(ft.groupKey || "") === String(B || ""),
            },
          ),
          ht = [...(_e.subjects || $)],
          Ft = [...(_e.entries || [])],
          Dt = [
            ...ut.exams.map((ft) => ({ ...ft, isConsult: !1 })),
            ...(qt ? ut.consultations.map((ft) => ({ ...ft, isConsult: !0 })) : []),
          ];
        for (const ft of Dt) {
          const fl = ft.subject.trim(),
            Al = bi(fl);
          if (
            Ft.some(
              (Gt) =>
                bi(Gt.subjectName) === Al && String(Gt.dateKey || "") === ft.dateKey,
            )
          ) {
            ye += 1;
            continue;
          }
          let Il = ht.find(
            (Gt) =>
              bi(Gt.name) === Al || bi(Gt.name).includes(Al) || Al.includes(bi(Gt.name)),
          );
          if (!Il && r.canManageCurrentGroup)
            try {
              const Gt = await be(`/api/mobile/subjects${et}`, {
                method: "POST",
                body: { name: fl, semester: L },
              });
              ((Il = { id: Gt.id, name: Gt.name || fl }), ht.push(Il));
            } catch (Gt) {
              Ge.push(`${fl}: ${Gt?.message || "не удалось добавить предмет"}`);
              continue;
            }
          if (!Il?.id) {
            Ge.push(`${fl}: предмета нет в списке группы`);
            continue;
          }
          const Bi = [
            `${ft.isConsult ? "Консультация" : "Экзамен"}: ${ft.time}`,
            ft.details,
          ].filter(Boolean);
          try {
            (await be(`/api/mobile/entries${et}`, {
              method: "POST",
              body: {
                collection: "exam",
                semester: L,
                subjectId: Il.id,
                dateKey: ft.dateKey,
                description: Bi.join(`
`),
              },
            }),
              Ft.push({ subjectName: Il.name, dateKey: ft.dateKey }),
              (g += 1));
          } catch (Gt) {
            Ge.push(`${fl} (${Gh(ft.dateKey)}): ${Gt?.message}`);
          }
        }
        (wl({ added: g, skipped: ye, errors: Ge }), await It(!0));
      } catch (et) {
        El(et?.message || "Ошибка импорта сессии.");
      } finally {
        wi(!1);
      }
    },
    wt = async (g, ye) => {
      try {
        (await navigator.clipboard.writeText(ye),
          Ue(g),
          window.setTimeout(() => Ue(""), 1500));
      } catch {}
    },
    St = Wu.find((g) => g.id === ae) || Wu[0],
    _l = $.find((g) => g.id === Q) || null;
  return n.jsxs("div", {
    className: "space-y-5",
    children: [
      n.jsxs("section", {
        className: "zau-card p-5 sm:p-6 space-y-4",
        children: [
          n.jsxs("div", {
            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
            children: [
              n.jsxs("div", {
                children: [
                  n.jsxs("p", {
                    className:
                      "text-[11px] font-extrabold tracking-[0.09em] text-[#93161B] uppercase",
                    children: ["Учебная база · ", B, " · ", L, " семестр"],
                  }),
                  n.jsx("h2", {
                    className: "text-xl sm:text-2xl font-extrabold text-[#16161A] mt-0.5",
                    children: "Материалы и задания",
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                  !r.isGuest &&
                    n.jsxs("button", {
                      type: "button",
                      onClick: () => D(!0),
                      className:
                        "inline-flex items-center gap-1.5 rounded-xl border border-[#F2CACA] bg-[#FCEEEE] px-3.5 py-2 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF] transition",
                      children: [
                        n.jsx(ub, { className: "h-3.5 w-3.5" }),
                        "Лекция в DOCX",
                      ],
                    }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: Ai,
                    disabled: !$.length,
                    className:
                      "inline-flex items-center gap-1.5 rounded-xl bg-[#93161B] px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#6B0D12] disabled:opacity-45 transition",
                    children: [n.jsx(xa, { className: "h-4 w-4" }), "Добавить"],
                  }),
                ],
              }),
            ],
          }),
          n.jsx("div", {
            className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
            children: Wu.map((g) => {
              const ye = g.icon,
                Ge = ae === g.id;
              return n.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    (Pe("study", `switch_${g.id}`), G(g.id), Re(""));
                  },
                  className: `flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-extrabold transition ${Ge ? "border-[#93161B] bg-[#93161B] text-white shadow-xs" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861] hover:text-[#16161A] hover:border-[#93161B]/35"}`,
                  children: [
                    n.jsx(ye, { className: "h-4 w-4 shrink-0" }),
                    n.jsx("span", { className: "truncate", children: g.label }),
                  ],
                },
                g.id,
              );
            }),
          }),
          n.jsxs("div", {
            className: "flex flex-col sm:flex-row gap-2.5",
            children: [
              n.jsxs("div", {
                className: "relative flex-1",
                children: [
                  n.jsx(Pu, {
                    className:
                      "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8F8A94]",
                  }),
                  n.jsx("input", {
                    type: "text",
                    value: H,
                    onChange: (g) => R(g.target.value),
                    placeholder:
                      "Поиск по предметам, описаниям и распознанным фото (OCR)…",
                    className:
                      "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] pl-10 pr-9 py-2.5 text-sm text-[#16161A] placeholder:text-[#8F8A94] focus:border-[#93161B] focus:bg-white focus:outline-none",
                  }),
                  H &&
                    n.jsx("button", {
                      type: "button",
                      onClick: () => R(""),
                      className:
                        "absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#8F8A94] hover:text-[#16161A]",
                      children: n.jsx(Kt, { className: "h-4 w-4" }),
                    }),
                ],
              }),
              n.jsxs("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                  (ae === "hw" || ae === "exam") &&
                    n.jsx("button", {
                      type: "button",
                      onClick: () => ne((g) => !g),
                      className: `rounded-xl border px-3 py-2 text-xs font-bold transition ${Y ? "border-[#93161B] bg-[#FCEEEE] text-[#93161B]" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861]"}`,
                      children: "Невыполненные",
                    }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => re((g) => !g),
                    className: `inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${me ? "border-[#93161B] bg-[#FCEEEE] text-[#93161B]" : "border-[#E8E1D9] bg-[#FAF8F5] text-[#5C5861]"}`,
                    children: [n.jsx(Og, { className: "h-3.5 w-3.5" }), "OCR"],
                  }),
                  ae === "hw" &&
                    n.jsxs("button", {
                      type: "button",
                      disabled: we,
                      onClick: Za,
                      title: "Отметить выполненными все прошлые невыполненные ДЗ",
                      className:
                        "inline-flex items-center gap-1.5 rounded-xl border border-[#BFE6D3] bg-[#E8F6EF] px-3 py-2 text-xs font-bold text-[#1F6E4E] hover:bg-[#D8EFE4] disabled:opacity-50 transition",
                      children: [
                        we
                          ? n.jsx(ot, { className: "h-3.5 w-3.5 animate-spin" })
                          : n.jsx(Mg, { className: "h-3.5 w-3.5" }),
                        "Закрыть прошлые",
                      ],
                    }),
                  ae === "exam" &&
                    n.jsxs("button", {
                      type: "button",
                      onClick: () => {
                        (Jt(!0), El(""), wl(null));
                      },
                      className:
                        "inline-flex items-center gap-1.5 rounded-xl border border-[#EBD7B1] bg-[#FDF6EA] px-3 py-2 text-xs font-bold text-[#806332] hover:bg-[#F8EBD2] transition",
                      children: [n.jsx(Rg, { className: "h-3.5 w-3.5" }), "Импорт CSV"],
                    }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => It(!0),
                    disabled: ge,
                    className:
                      "rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] p-2 text-[#5C5861] hover:text-[#16161A]",
                    title: "Обновить",
                    children: n.jsx(vn, {
                      className: `h-4 w-4 ${ge ? "animate-spin" : ""}`,
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      ue > 0 && n.jsx(mr, { cachedAt: ue, onRetry: () => It(!0) }),
      Te &&
        n.jsxs("div", {
          className:
            "flex items-center justify-between gap-2 rounded-2xl border border-[#E8E1D9] bg-white px-4 py-3 text-xs font-bold text-[#16161A]",
          children: [
            n.jsx("span", { children: Te }),
            n.jsx("button", {
              type: "button",
              onClick: () => Re(""),
              className: "text-[#8F8A94] hover:text-[#16161A]",
              children: n.jsx(Kt, { className: "h-4 w-4" }),
            }),
          ],
        }),
      ce &&
        n.jsx("div", {
          className:
            "rounded-2xl border border-[#F5C6C6] bg-[#FFF0F0] px-4 py-3 text-xs font-bold text-[#C92A2A]",
          children: ce,
        }),
      n.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
        children: [
          n.jsxs("div", {
            className: "lg:hidden flex items-center gap-2",
            children: [
              n.jsxs("select", {
                value: Q,
                onChange: (g) => X(g.target.value),
                className:
                  "flex-1 rounded-xl border border-[#E8E1D9] bg-white px-3.5 py-2.5 text-xs font-bold text-[#16161A]",
                children: [
                  n.jsxs("option", {
                    value: "",
                    children: ["Все дисциплины (", $.length, ")"],
                  }),
                  $.map((g) => n.jsx("option", { value: g.id, children: g.name }, g.id)),
                ],
              }),
              r.canManageCurrentGroup &&
                n.jsx("button", {
                  type: "button",
                  onClick: () => Vl(!0),
                  className:
                    "rounded-xl border border-[#E8E1D9] bg-white p-2.5 text-[#93161B]",
                  title: "Добавить дисциплину",
                  children: n.jsx(Ug, { className: "h-4 w-4" }),
                }),
            ],
          }),
          n.jsxs("aside", {
            className: "hidden lg:block lg:col-span-4 zau-card p-4 sticky top-6",
            children: [
              n.jsxs("div", {
                className:
                  "flex items-center justify-between gap-2 pb-3 border-b border-[#F3EFEA]",
                children: [
                  n.jsxs("p", {
                    className:
                      "text-xs font-extrabold tracking-[0.06em] text-[#5C5861] uppercase",
                    children: ["Дисциплины (", $.length, ")"],
                  }),
                  r.canManageCurrentGroup &&
                    n.jsxs("button", {
                      type: "button",
                      onClick: () => Vl(!0),
                      className:
                        "inline-flex items-center gap-1 rounded-lg bg-[#FCEEEE] px-2.5 py-1 text-[11px] font-bold text-[#93161B] hover:bg-[#F9DFDF]",
                      children: [n.jsx(xa, { className: "h-3 w-3" }), "Предмет"],
                    }),
                ],
              }),
              n.jsxs("div", {
                className: "mt-2.5 max-h-[62vh] overflow-y-auto space-y-1 pr-0.5",
                children: [
                  n.jsx("button", {
                    type: "button",
                    onClick: () => X(""),
                    className: `w-full rounded-xl px-3 py-2.5 text-left text-xs font-bold transition ${Q ? "text-[#16161A] hover:bg-[#FAF8F5]" : "bg-[#93161B] text-white shadow-2xs"}`,
                    children: "Все дисциплины семестра",
                  }),
                  $.map((g) => {
                    const ye = Q === g.id;
                    return n.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => X(g.id),
                        className: `w-full rounded-xl px-3 py-2.5 text-left text-xs transition ${ye ? "bg-[#FCEEEE] text-[#93161B] font-extrabold" : "text-[#5C5861] font-semibold hover:bg-[#FAF8F5] hover:text-[#16161A]"}`,
                        children: g.name,
                      },
                      g.id,
                    );
                  }),
                ],
              }),
              _l &&
                !p &&
                n.jsxs("button", {
                  type: "button",
                  onClick: () =>
                    F({
                      subjectId: _l.id,
                      collection: "notes",
                      title: _l.name,
                    }),
                  className:
                    "mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#F2CACA] bg-[#FCEEEE] py-2.5 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF] transition",
                  children: [
                    n.jsx(gi, { className: "h-4 w-4" }),
                    "Тренажёр по дисциплине",
                  ],
                }),
            ],
          }),
          n.jsxs("div", {
            className: "lg:col-span-8 space-y-4",
            children: [
              ae === "notes" &&
                Cn.length > 0 &&
                n.jsxs("section", {
                  className:
                    "rounded-3xl border border-[#EBD7B1] bg-[#FFFDF7] p-4 sm:p-5 space-y-3",
                  children: [
                    n.jsxs("div", {
                      className: "flex items-center justify-between gap-2",
                      children: [
                        n.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            n.jsx(rb, { className: "h-4 w-4 text-[#B88946]" }),
                            n.jsxs("h3", {
                              className:
                                "text-xs font-extrabold uppercase tracking-wider text-[#806332]",
                              children: [
                                "Мои личные расшифровки лекций (",
                                Cn.length,
                                ")",
                              ],
                            }),
                          ],
                        }),
                        n.jsx("button", {
                          type: "button",
                          onClick: () => D(!0),
                          className: "text-xs font-bold text-[#93161B] hover:underline",
                          children: "+ Новая запись",
                        }),
                      ],
                    }),
                    n.jsx("div", {
                      className: "space-y-2",
                      children: Cn.map((g) =>
                        n.jsxs(
                          "div",
                          {
                            className:
                              "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8E1D9] bg-white p-3.5",
                            children: [
                              n.jsxs("button", {
                                type: "button",
                                onClick: () => Ae(g),
                                className: "min-w-0 flex-1 text-left",
                                children: [
                                  n.jsx("p", {
                                    className:
                                      "text-[11px] font-extrabold text-[#93161B]",
                                    children: g.subjectName,
                                  }),
                                  n.jsx("p", {
                                    className:
                                      "truncate text-sm font-extrabold text-[#16161A] mt-0.5",
                                    children: g.title,
                                  }),
                                  g.preview &&
                                    n.jsx("p", {
                                      className:
                                        "mt-0.5 line-clamp-1 text-xs text-[#5C5861]",
                                      children: g.preview,
                                    }),
                                ],
                              }),
                              n.jsxs("a", {
                                href: Oh(g.id, r.isAdmin ? B : ""),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className:
                                  "inline-flex items-center gap-1.5 rounded-xl bg-[#FCEEEE] px-3 py-2 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF] transition shrink-0",
                                children: [
                                  n.jsx(bn, { className: "h-3.5 w-3.5" }),
                                  "DOCX",
                                ],
                              }),
                            ],
                          },
                          g.id,
                        ),
                      ),
                    }),
                  ],
                }),
              de && !De.length
                ? n.jsxs("div", {
                    className: "zau-card py-16 flex flex-col items-center justify-center",
                    children: [
                      n.jsx(ot, {
                        className: "h-8 w-8 animate-spin text-[#93161B]",
                      }),
                      n.jsx("p", {
                        className: "mt-3 text-xs font-bold text-[#5C5861]",
                        children: "Загружаем материалы…",
                      }),
                    ],
                  })
                : Ci.length
                  ? n.jsx("div", {
                      className: "space-y-3",
                      children: Ci.map((g) => {
                        const ye = g.collection === "hw" || g.collection === "exam",
                          Ge = (g.files || []).filter((_e) => _e.kind === "photo"),
                          et = (g.files || []).filter((_e) => _e.kind !== "photo");
                        return n.jsx(
                          "article",
                          {
                            className:
                              "zau-card p-4 sm:p-5 hover:border-[#93161B]/35 transition",
                            children: n.jsxs("div", {
                              className: "flex items-start gap-3.5",
                              children: [
                                ye &&
                                  n.jsx("button", {
                                    type: "button",
                                    role: "checkbox",
                                    "aria-checked": g.isDone,
                                    onClick: () => vs(g),
                                    className: `mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition ${g.isDone ? "border-[#1F6E4E] bg-[#1F6E4E] text-white" : "border-[#CFC5B8] bg-white hover:border-[#93161B]"}`,
                                    children:
                                      g.isDone &&
                                      n.jsx(Ni, {
                                        className: "h-3.5 w-3.5 stroke-[3]",
                                      }),
                                  }),
                                n.jsxs("div", {
                                  className: "min-w-0 flex-1",
                                  children: [
                                    n.jsxs("div", {
                                      className:
                                        "flex flex-wrap items-center justify-between gap-2",
                                      children: [
                                        n.jsx("span", {
                                          className:
                                            "text-xs font-extrabold text-[#93161B]",
                                          children: g.subjectName,
                                        }),
                                        n.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            g.ocrText &&
                                              n.jsx("span", {
                                                className:
                                                  "rounded-md bg-[#FDF6EA] border border-[#EBD7B1] px-2 py-0.5 text-[10px] font-bold text-[#806332]",
                                                children: "OCR",
                                              }),
                                            g.dateFormatted &&
                                              n.jsx("span", {
                                                className:
                                                  "text-xs font-semibold text-[#8F8A94] tabular-nums",
                                                children: g.dateFormatted,
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    n.jsx("button", {
                                      type: "button",
                                      onClick: () => Ce(g),
                                      className: "mt-1.5 block w-full text-left",
                                      children: n.jsx("p", {
                                        className: `whitespace-pre-line line-clamp-4 text-sm leading-relaxed ${g.isDone ? "line-through text-[#8F8A94]" : "text-[#16161A]"}`,
                                        children: g.description || g.preview,
                                      }),
                                    }),
                                    Ge.length > 0 &&
                                      n.jsx("div", {
                                        className: "mt-3 flex flex-wrap gap-2",
                                        children: Ge.slice(0, 4).map((_e) =>
                                          n.jsx(
                                            "button",
                                            {
                                              type: "button",
                                              onClick: () =>
                                                _e.url &&
                                                ee({
                                                  url: _e.url,
                                                  name: _e.name,
                                                }),
                                              className:
                                                "h-18 w-24 overflow-hidden rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] hover:border-[#93161B] transition",
                                              children: _e.url
                                                ? n.jsx("img", {
                                                    src: _e.url,
                                                    alt: _e.name,
                                                    loading: "lazy",
                                                    className:
                                                      "h-full w-full object-cover",
                                                  })
                                                : n.jsx("span", {
                                                    className:
                                                      "flex h-full items-center justify-center text-xs text-[#8F8A94]",
                                                    children: "Фото",
                                                  }),
                                            },
                                            _e.fileId,
                                          ),
                                        ),
                                      }),
                                    et.length > 0 &&
                                      n.jsx("div", {
                                        className: "mt-2.5 flex flex-wrap gap-1.5",
                                        children: et.map((_e) =>
                                          n.jsxs(
                                            "a",
                                            {
                                              href: _e.url,
                                              target: "_blank",
                                              rel: "noopener noreferrer",
                                              className:
                                                "inline-flex items-center gap-1.5 rounded-lg border border-[#E8E1D9] bg-[#FAF8F5] px-2.5 py-1 text-xs font-semibold text-[#16161A] hover:border-[#93161B]",
                                              children: [
                                                n.jsx(Pc, {
                                                  className: "h-3 w-3 text-[#93161B]",
                                                }),
                                                n.jsx("span", {
                                                  className: "max-w-48 truncate",
                                                  children: _e.name,
                                                }),
                                              ],
                                            },
                                            _e.fileId,
                                          ),
                                        ),
                                      }),
                                    n.jsxs("div", {
                                      className:
                                        "mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F3EFEA]",
                                      children: [
                                        n.jsxs("div", {
                                          className:
                                            "flex flex-wrap items-center gap-1.5",
                                          children: [
                                            n.jsx("button", {
                                              type: "button",
                                              onClick: () => Ce(g),
                                              className:
                                                "rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] px-2.5 py-1.5 text-[11px] font-bold text-[#16161A] hover:border-[#93161B]",
                                              children: "Открыть",
                                            }),
                                            (g.collection === "notes" || g.ocrText) &&
                                              !p &&
                                              n.jsxs("button", {
                                                type: "button",
                                                onClick: () =>
                                                  F({
                                                    entryId: g.id,
                                                    subjectId: g.subjectId,
                                                    collection: g.collection,
                                                    title: g.subjectName,
                                                  }),
                                                className:
                                                  "inline-flex items-center gap-1 rounded-lg bg-[#FCEEEE] px-2.5 py-1.5 text-[11px] font-extrabold text-[#93161B] hover:bg-[#F9DFDF]",
                                                children: [
                                                  n.jsx(gi, {
                                                    className: "h-3 w-3",
                                                  }),
                                                  "Тест ИИ",
                                                ],
                                              }),
                                            (g.description || g.ocrText) &&
                                              n.jsxs("a", {
                                                href: _h(
                                                  g.id,
                                                  g.collection,
                                                  r.isAdmin ? B : "",
                                                ),
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className:
                                                  "inline-flex items-center gap-1 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] px-2.5 py-1.5 text-[11px] font-bold text-[#5C5861] hover:text-[#16161A]",
                                                children: [
                                                  n.jsx(bn, {
                                                    className: "h-3 w-3",
                                                  }),
                                                  "DOCX",
                                                ],
                                              }),
                                            n.jsxs("button", {
                                              type: "button",
                                              onClick: () => M(g),
                                              className:
                                                "inline-flex items-center gap-1 rounded-lg bg-[#FAF8F5] border border-[#E8E1D9] px-2.5 py-1.5 text-[11px] font-bold text-[#5C5861] hover:text-[#9A6F32]",
                                              title: "Напомнить",
                                              children: [
                                                n.jsx(sb, {
                                                  className: "h-3 w-3",
                                                }),
                                                "Напомнить",
                                              ],
                                            }),
                                          ],
                                        }),
                                        g.canManage &&
                                          n.jsxs("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                              n.jsx("button", {
                                                type: "button",
                                                onClick: () => Ns(g),
                                                className:
                                                  "rounded-lg p-1.5 text-[#8F8A94] hover:bg-[#FAF8F5] hover:text-[#16161A]",
                                                title: "Редактировать",
                                                children: n.jsx(ji, {
                                                  className: "h-3.5 w-3.5",
                                                }),
                                              }),
                                              n.jsx("button", {
                                                type: "button",
                                                onClick: () => Le(g),
                                                className:
                                                  "rounded-lg p-1.5 text-[#8F8A94] hover:bg-[#FFF0F0] hover:text-[#C92A2A]",
                                                title: "Удалить",
                                                children: n.jsx(hs, {
                                                  className: "h-3.5 w-3.5",
                                                }),
                                              }),
                                            ],
                                          }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          },
                          g.id,
                        );
                      }),
                    })
                  : n.jsxs("div", {
                      className: "zau-card p-10 text-center",
                      children: [
                        n.jsxs("p", {
                          className: "text-sm font-extrabold text-[#16161A]",
                          children: ["В разделе «", St.label, "» пока пусто"],
                        }),
                        n.jsx("p", {
                          className: "mt-1 text-xs text-[#5C5861]",
                          children:
                            Y || me || Z
                              ? "Попробуйте сбросить фильтры поиска."
                              : "Добавьте первую карточку, прикрепите фото доски или загрузите конспект.",
                        }),
                        $.length > 0 &&
                          !Y &&
                          !me &&
                          !Z &&
                          n.jsxs("button", {
                            type: "button",
                            onClick: Ai,
                            className:
                              "mt-4 inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#6B0D12]",
                            children: [
                              n.jsx(xa, { className: "h-4 w-4" }),
                              "Добавить материал",
                            ],
                          }),
                      ],
                    }),
            ],
          }),
        ],
      }),
      V &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
          onClick: () => Ce(null),
          children: n.jsxs("div", {
            className:
              "w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-[#E8E1D9] bg-white shadow-2xl",
            onClick: (g) => g.stopPropagation(),
            children: [
              n.jsxs("div", {
                className:
                  "flex items-start justify-between gap-3 border-b border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
                children: [
                  n.jsxs("div", {
                    className: "min-w-0",
                    children: [
                      n.jsxs("p", {
                        className:
                          "text-[11px] font-extrabold text-[#93161B] uppercase tracking-wider",
                        children: [
                          V.subjectName,
                          V.dateFormatted ? ` · ${V.dateFormatted}` : "",
                        ],
                      }),
                      n.jsx("h3", {
                        className:
                          "text-base sm:text-lg font-extrabold text-[#16161A] mt-0.5",
                        children: St.singular,
                      }),
                    ],
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => Ce(null),
                    className: "rounded-xl p-2 text-[#8F8A94] hover:bg-[#E8E1D9]/60",
                    children: n.jsx(Kt, { className: "h-5 w-5" }),
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex-1 overflow-y-auto p-6 space-y-5",
                children: [
                  V.description &&
                    n.jsx("div", {
                      className:
                        "whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-[#16161A]",
                      children: V.description,
                    }),
                  V.ocrText &&
                    n.jsxs("div", {
                      className: "rounded-2xl border border-[#EBD7B1] bg-[#FFFDF7] p-4",
                      children: [
                        n.jsxs("div", {
                          className: "flex items-center justify-between gap-2 mb-2",
                          children: [
                            n.jsx("p", {
                              className:
                                "text-xs font-extrabold text-[#806332] uppercase",
                              children: "Распознанный текст с фото (OCR)",
                            }),
                            n.jsx("button", {
                              type: "button",
                              onClick: () => wt(V.id, V.ocrText),
                              className:
                                "inline-flex items-center gap-1 text-xs font-bold text-[#93161B]",
                              children:
                                Ze === V.id
                                  ? n.jsxs(n.Fragment, {
                                      children: [
                                        n.jsx(Ni, {
                                          className: "h-3.5 w-3.5 text-[#1F6E4E]",
                                        }),
                                        "Скопировано",
                                      ],
                                    })
                                  : n.jsxs(n.Fragment, {
                                      children: [
                                        n.jsx(sd, { className: "h-3.5 w-3.5" }),
                                        "Копировать",
                                      ],
                                    }),
                            }),
                          ],
                        }),
                        n.jsx("p", {
                          className:
                            "whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-[#16161A]",
                          children: V.ocrText,
                        }),
                      ],
                    }),
                  V.files?.length > 0 &&
                    n.jsxs("div", {
                      className: "space-y-2.5",
                      children: [
                        n.jsxs("p", {
                          className: "text-xs font-extrabold text-[#5C5861] uppercase",
                          children: ["Вложения (", V.files.length, ")"],
                        }),
                        n.jsx("div", {
                          className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                          children: V.files.map((g) =>
                            g.kind === "photo" && g.url
                              ? n.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => ee({ url: g.url, name: g.name }),
                                    className:
                                      "overflow-hidden rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] hover:border-[#93161B]",
                                    children: n.jsx("img", {
                                      src: g.url,
                                      alt: g.name,
                                      className: "h-44 w-full object-cover",
                                    }),
                                  },
                                  g.fileId,
                                )
                              : n.jsxs(
                                  "a",
                                  {
                                    href: g.url,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className:
                                      "flex items-center gap-3 rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-3.5 text-xs font-bold text-[#16161A] hover:border-[#93161B]",
                                    children: [
                                      n.jsx(Pc, {
                                        className: "h-4 w-4 text-[#93161B] shrink-0",
                                      }),
                                      n.jsx("span", {
                                        className: "truncate flex-1",
                                        children: g.name,
                                      }),
                                      n.jsx(bn, {
                                        className: "h-4 w-4 text-[#8F8A94]",
                                      }),
                                    ],
                                  },
                                  g.fileId,
                                ),
                          ),
                        }),
                      ],
                    }),
                  V.externalLinks?.length > 0 &&
                    n.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        n.jsx("p", {
                          className: "text-xs font-extrabold text-[#5C5861] uppercase",
                          children: "Ссылки",
                        }),
                        V.externalLinks.map((g, ye) =>
                          n.jsxs(
                            "a",
                            {
                              href: g,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className:
                                "flex items-center gap-2 text-xs font-bold text-[#93161B] hover:underline break-all",
                              children: [
                                n.jsx(dr, {
                                  className: "h-3.5 w-3.5 shrink-0",
                                }),
                                g,
                              ],
                            },
                            ye,
                          ),
                        ),
                      ],
                    }),
                ],
              }),
              n.jsxs("div", {
                className:
                  "flex flex-wrap items-center justify-between gap-2 border-t border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
                children: [
                  n.jsxs("div", {
                    className: "flex flex-wrap gap-2",
                    children: [
                      n.jsxs("a", {
                        href: _h(V.id, V.collection, r.isAdmin ? B : ""),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className:
                          "inline-flex items-center gap-1.5 rounded-xl bg-[#93161B] px-4 py-2 text-xs font-bold text-white hover:bg-[#6B0D12]",
                        children: [
                          n.jsx(bn, { className: "h-3.5 w-3.5" }),
                          "Скачать Word (.docx)",
                        ],
                      }),
                      !p &&
                        n.jsxs("button", {
                          type: "button",
                          onClick: () => {
                            const g = V;
                            (Ce(null),
                              F({
                                entryId: g.id,
                                subjectId: g.subjectId,
                                collection: g.collection,
                                title: g.subjectName,
                              }));
                          },
                          className:
                            "inline-flex items-center gap-1.5 rounded-xl border border-[#F2CACA] bg-[#FCEEEE] px-4 py-2 text-xs font-extrabold text-[#93161B]",
                          children: [
                            n.jsx(gi, { className: "h-3.5 w-3.5" }),
                            "ИИ-Тренажёр",
                          ],
                        }),
                    ],
                  }),
                  V.canManage &&
                    n.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        n.jsx("button", {
                          type: "button",
                          onClick: () => Ns(V),
                          className:
                            "rounded-xl border border-[#E8E1D9] bg-white px-3.5 py-2 text-xs font-bold text-[#16161A]",
                          children: "Изменить",
                        }),
                        n.jsx("button", {
                          type: "button",
                          onClick: () => Le(V),
                          className:
                            "rounded-xl bg-[#FFF0F0] px-3.5 py-2 text-xs font-bold text-[#C92A2A]",
                          children: "Удалить",
                        }),
                      ],
                    }),
                ],
              }),
            ],
          }),
        }),
      he &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
          onClick: () => Ae(null),
          children: n.jsxs("div", {
            className:
              "w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden rounded-3xl border border-[#E8E1D9] bg-white shadow-2xl",
            onClick: (g) => g.stopPropagation(),
            children: [
              n.jsxs("div", {
                className:
                  "flex items-start justify-between gap-3 border-b border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
                children: [
                  n.jsxs("div", {
                    children: [
                      n.jsxs("p", {
                        className: "text-[11px] font-extrabold text-[#9A6F32] uppercase",
                        children: ["Личный конспект · ", he.subjectName],
                      }),
                      n.jsx("h3", {
                        className: "text-lg font-extrabold text-[#16161A] mt-0.5",
                        children: he.title,
                      }),
                    ],
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => Ae(null),
                    className: "rounded-xl p-2 text-[#8F8A94]",
                    children: n.jsx(Kt, { className: "h-5 w-5" }),
                  }),
                ],
              }),
              n.jsx("div", {
                className:
                  "flex-1 overflow-y-auto p-6 whitespace-pre-wrap text-sm leading-relaxed text-[#16161A]",
                children:
                  he.transcript || he.preview || "Текст доступен в файле Word (.docx).",
              }),
              n.jsx("div", {
                className:
                  "flex justify-end gap-2 border-t border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
                children: n.jsxs("a", {
                  href: Oh(he.id, r.isAdmin ? B : ""),
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6B0D12]",
                  children: [n.jsx(bn, { className: "h-4 w-4" }), "Скачать Word (.docx)"],
                }),
              }),
            ],
          }),
        }),
      qe &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
          onClick: () => T(!1),
          children: n.jsxs("form", {
            onSubmit: Si,
            onClick: (g) => g.stopPropagation(),
            className:
              "w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-[#E8E1D9] bg-white shadow-2xl",
            children: [
              n.jsxs("div", {
                className:
                  "flex items-center justify-between border-b border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
                children: [
                  n.jsxs("h3", {
                    className: "text-base sm:text-lg font-extrabold text-[#16161A]",
                    children: [xe ? "Редактировать" : "Добавить", " · ", St.singular],
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => T(!1),
                    className: "rounded-xl p-1.5 text-[#8F8A94]",
                    children: n.jsx(Kt, { className: "h-5 w-5" }),
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex-1 overflow-y-auto p-6 space-y-4",
                children: [
                  n.jsxs("div", {
                    className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                    children: [
                      n.jsxs("div", {
                        className: "sm:col-span-2",
                        children: [
                          n.jsx("label", {
                            className: "block text-xs font-bold text-[#5C5861] mb-1",
                            children: "Дисциплина",
                          }),
                          n.jsx("select", {
                            value: I,
                            onChange: (g) => w(g.target.value),
                            className:
                              "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#16161A]",
                            children: $.map((g) =>
                              n.jsx("option", { value: g.id, children: g.name }, g.id),
                            ),
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("label", {
                            className: "block text-xs font-bold text-[#5C5861] mb-1",
                            children: ae === "hw" ? "Срок сдачи" : "Дата",
                          }),
                          n.jsx("input", {
                            type: "date",
                            value: k,
                            "aria-label": ae === "hw" ? "Срок сдачи" : "Дата",
                            onChange: (g) => O(g.target.value),
                            className:
                              "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#16161A]",
                          }),
                        ],
                      }),
                    ],
                  }),
                  ae === "hw" &&
                    n.jsxs("label", {
                      className: "block text-xs font-bold text-[#5C5861]",
                      children: [
                        "Дата самой пары (если отличается от срока сдачи)",
                        n.jsx("input", {
                          type: "date",
                          value: lessonDate,
                          onChange: (e) => setLessonDate(e.target.value),
                          "aria-label": "Дата самой пары",
                          className:
                            "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#16161A]",
                        }),
                      ],
                    }),
                  n.jsxs("div", {
                    children: [
                      n.jsx("label", {
                        className: "block text-xs font-bold text-[#5C5861] mb-1",
                        children: "Описание / текст материала",
                      }),
                      n.jsx("textarea", {
                        rows: 6,
                        value: W,
                        onChange: (g) => ve(g.target.value),
                        placeholder:
                          "Введите текст задания, конспект лекции, список литературы или билеты к экзамену…",
                        className:
                          "w-full rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-3.5 text-sm leading-relaxed text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      n.jsxs("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                          n.jsx("input", {
                            ref: jn,
                            type: "file",
                            accept: "image/*",
                            className: "hidden",
                            onChange: (g) => {
                              const ye = g.target.files?.[0];
                              ((g.target.value = ""), ye && js(ye, !0));
                            },
                          }),
                          n.jsx("input", {
                            ref: En,
                            type: "file",
                            className: "hidden",
                            onChange: (g) => {
                              const ye = g.target.files?.[0];
                              ((g.target.value = ""), ye && js(ye, !1));
                            },
                          }),
                          n.jsxs("button", {
                            type: "button",
                            disabled: dl,
                            onClick: () => jn.current?.click(),
                            className:
                              "inline-flex items-center gap-1.5 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#16161A] hover:border-[#93161B]",
                            children: [
                              dl
                                ? n.jsx(ot, {
                                    className: "h-3.5 w-3.5 animate-spin text-[#93161B]",
                                  })
                                : n.jsx(ab, {
                                    className: "h-3.5 w-3.5 text-[#93161B]",
                                  }),
                              "Фото + ИИ-OCR",
                            ],
                          }),
                          n.jsxs("button", {
                            type: "button",
                            disabled: dl,
                            onClick: () => En.current?.click(),
                            className:
                              "inline-flex items-center gap-1.5 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2 text-xs font-bold text-[#16161A] hover:border-[#93161B]",
                            children: [
                              n.jsx(Pc, {
                                className: "h-3.5 w-3.5 text-[#93161B]",
                              }),
                              "Прикрепить файл (PDF, DOCX…)",
                            ],
                          }),
                        ],
                      }),
                      Ke.length > 0 &&
                        n.jsx("div", {
                          className: "flex flex-wrap gap-2 pt-1",
                          children: Ke.map((g, ye) =>
                            n.jsxs(
                              "span",
                              {
                                className:
                                  "inline-flex items-center gap-1.5 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-[#16161A]",
                                children: [
                                  n.jsx("span", {
                                    className: "max-w-44 truncate",
                                    children: g.name,
                                  }),
                                  n.jsx("button", {
                                    type: "button",
                                    onClick: () =>
                                      _t((Ge) => Ge.filter((et, _e) => _e !== ye)),
                                    className: "text-[#8F8A94] hover:text-[#C92A2A]",
                                    children: n.jsx(Kt, {
                                      className: "h-3.5 w-3.5",
                                    }),
                                  }),
                                ],
                              },
                              `${g.fileId}_${ye}`,
                            ),
                          ),
                        }),
                    ],
                  }),
                  Be &&
                    n.jsxs("div", {
                      children: [
                        n.jsx("label", {
                          className: "block text-xs font-bold text-[#806332] mb-1",
                          children: "Распознанный текст (OCR)",
                        }),
                        n.jsx("textarea", {
                          rows: 4,
                          value: Be,
                          onChange: (g) => Lt(g.target.value),
                          className:
                            "w-full rounded-2xl border border-[#EBD7B1] bg-[#FFFDF7] p-3 text-xs leading-relaxed text-[#16161A]",
                        }),
                      ],
                    }),
                  ha &&
                    n.jsx("p", {
                      className:
                        "rounded-xl bg-[#FFF0F0] px-3.5 py-2 text-xs font-bold text-[#C92A2A]",
                      children: ha,
                    }),
                ],
              }),
              n.jsxs("div", {
                className:
                  "flex justify-end gap-2.5 border-t border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
                children: [
                  n.jsx("button", {
                    type: "button",
                    onClick: () => T(!1),
                    className:
                      "rounded-xl border border-[#E8E1D9] bg-white px-4 py-2.5 text-xs font-bold text-[#5C5861]",
                    children: "Отмена",
                  }),
                  n.jsxs("button", {
                    type: "submit",
                    disabled: Ga || dl,
                    className:
                      "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#6B0D12] disabled:opacity-50",
                    children: [
                      Ga && n.jsx(ot, { className: "h-3.5 w-3.5 animate-spin" }),
                      xe ? "Сохранить изменения" : "Опубликовать",
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      ze &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
          onClick: () => Le(null),
          children: n.jsxs("div", {
            className:
              "w-full max-w-sm rounded-3xl border border-[#E8E1D9] bg-white p-6 shadow-2xl",
            onClick: (g) => g.stopPropagation(),
            children: [
              n.jsx("h3", {
                className: "text-base font-extrabold text-[#16161A]",
                children: "Удалить материал?",
              }),
              n.jsxs("p", {
                className: "mt-1.5 text-xs text-[#5C5861]",
                children: ["«", ze.subjectName, "» — ", ze.preview.slice(0, 90)],
              }),
              n.jsxs("div", {
                className: "mt-5 flex justify-end gap-2",
                children: [
                  n.jsx("button", {
                    type: "button",
                    onClick: () => Le(null),
                    className:
                      "rounded-xl border border-[#E8E1D9] px-4 py-2 text-xs font-bold text-[#5C5861]",
                    children: "Отмена",
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: Es,
                    className:
                      "rounded-xl bg-[#C92A2A] px-4 py-2 text-xs font-bold text-white",
                    children: "Удалить",
                  }),
                ],
              }),
            ],
          }),
        }),
      Ot &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
          onClick: () => Vl(!1),
          children: n.jsxs("form", {
            onSubmit: ws,
            onClick: (g) => g.stopPropagation(),
            className:
              "w-full max-w-md rounded-3xl border border-[#E8E1D9] bg-white p-6 shadow-2xl space-y-4",
            children: [
              n.jsxs("h3", {
                className: "text-base font-extrabold text-[#16161A]",
                children: ["Новая дисциплина (", L, " семестр)"],
              }),
              n.jsx("input", {
                type: "text",
                autoFocus: !0,
                value: $l,
                onChange: (g) => Ya(g.target.value),
                placeholder: "Название предмета",
                className:
                  "w-full rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none",
              }),
              n.jsxs("div", {
                className: "flex justify-end gap-2",
                children: [
                  n.jsx("button", {
                    type: "button",
                    onClick: () => Vl(!1),
                    className:
                      "rounded-xl border border-[#E8E1D9] px-4 py-2 text-xs font-bold text-[#5C5861]",
                    children: "Отмена",
                  }),
                  n.jsxs("button", {
                    type: "submit",
                    disabled: P || !$l.trim(),
                    className:
                      "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-5 py-2 text-xs font-bold text-white disabled:opacity-50",
                    children: [
                      P && n.jsx(ot, { className: "h-3.5 w-3.5 animate-spin" }),
                      "Создать",
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      mt &&
        n.jsx("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
          onClick: () => Jt(!1),
          children: n.jsxs("div", {
            className:
              "w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-[#E8E1D9] bg-white shadow-2xl",
            onClick: (g) => g.stopPropagation(),
            children: [
              n.jsxs("div", {
                className:
                  "flex items-center justify-between border-b border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
                children: [
                  n.jsxs("div", {
                    children: [
                      n.jsx("p", {
                        className: "text-[11px] font-extrabold text-[#806332] uppercase",
                        children: "Сессия ЗАУ · Google Sheets CSV",
                      }),
                      n.jsx("h3", {
                        className: "text-base font-extrabold text-[#16161A]",
                        children: "Импорт расписания экзаменов",
                      }),
                    ],
                  }),
                  n.jsx("button", {
                    type: "button",
                    onClick: () => Jt(!1),
                    className: "rounded-xl p-1.5 text-[#8F8A94]",
                    children: n.jsx(Kt, { className: "h-5 w-5" }),
                  }),
                ],
              }),
              n.jsxs("div", {
                className: "flex-1 overflow-y-auto p-6 space-y-4",
                children: [
                  n.jsx("p", {
                    className: "text-xs leading-relaxed text-[#5C5861]",
                    children:
                      "Выберите CSV-файл, экспортированный из таблицы расписания сессии Заокского университета. Даты, время, аудитории и консультации распознаются автоматически.",
                  }),
                  n.jsx("input", {
                    ref: Xa,
                    type: "file",
                    accept: ".csv,text/csv",
                    className: "hidden",
                    onChange: Di,
                  }),
                  n.jsxs("button", {
                    type: "button",
                    onClick: () => Xa.current?.click(),
                    className:
                      "inline-flex items-center gap-2 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-4 py-2.5 text-xs font-bold text-[#16161A] hover:border-[#93161B]",
                    children: [
                      n.jsx(nd, { className: "h-4 w-4 text-[#93161B]" }),
                      Ei ? `Файл: ${Ei}` : "Выбрать CSV-файл сессии",
                    ],
                  }),
                  ut &&
                    n.jsxs("div", {
                      className:
                        "rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] p-4 space-y-3",
                      children: [
                        n.jsxs("div", {
                          className: "flex flex-wrap gap-2 text-xs font-bold",
                          children: [
                            n.jsxs("span", {
                              className:
                                "rounded-lg bg-white border border-[#E8E1D9] px-2.5 py-1",
                              children: ["Экзаменов: ", ut.exams.length],
                            }),
                            n.jsxs("span", {
                              className:
                                "rounded-lg bg-white border border-[#E8E1D9] px-2.5 py-1",
                              children: ["Консультаций: ", ut.consultations.length],
                            }),
                            ut.academicYear &&
                              n.jsx("span", {
                                className:
                                  "rounded-lg bg-white border border-[#E8E1D9] px-2.5 py-1",
                                children: ut.academicYear,
                              }),
                          ],
                        }),
                        ut.consultations.length > 0 &&
                          n.jsxs("label", {
                            className:
                              "flex items-center gap-2 text-xs font-semibold text-[#16161A]",
                            children: [
                              n.jsx("input", {
                                type: "checkbox",
                                checked: qt,
                                onChange: (g) => hr(g.target.checked),
                                className: "accent-[#93161B]",
                              }),
                              "Добавить также консультации",
                            ],
                          }),
                        n.jsx("div", {
                          className: "max-h-48 overflow-y-auto space-y-1.5",
                          children: ut.exams.map((g, ye) =>
                            n.jsxs(
                              "div",
                              {
                                className:
                                  "rounded-xl bg-white border border-[#E8E1D9] px-3 py-2 text-xs",
                                children: [
                                  n.jsxs("div", {
                                    className:
                                      "flex justify-between gap-2 font-bold text-[#16161A]",
                                    children: [
                                      n.jsx("span", { children: g.subject }),
                                      n.jsxs("span", {
                                        className: "text-[#93161B] tabular-nums shrink-0",
                                        children: [Gh(g.dateKey), " · ", g.time],
                                      }),
                                    ],
                                  }),
                                  g.details &&
                                    n.jsx("p", {
                                      className: "text-[11px] text-[#5C5861]",
                                      children: g.details,
                                    }),
                                ],
                              },
                              ye,
                            ),
                          ),
                        }),
                      ],
                    }),
                  Qa &&
                    n.jsx("p", {
                      className:
                        "rounded-xl bg-[#FFF0F0] p-3 text-xs font-bold text-[#C92A2A]",
                      children: Qa,
                    }),
                  Jl &&
                    n.jsxs("div", {
                      className:
                        "rounded-2xl border border-[#BFE6D3] bg-[#E8F6EF] p-4 text-xs space-y-1",
                      children: [
                        n.jsxs("p", {
                          className: "font-extrabold text-[#1F6E4E]",
                          children: [
                            "Импорт завершён: добавлено ",
                            Jl.added,
                            ", пропущено дубликатов",
                            " ",
                            Jl.skipped,
                            ".",
                          ],
                        }),
                        Jl.errors.map((g, ye) =>
                          n.jsxs(
                            "p",
                            {
                              className: "text-[#8B1E24]",
                              children: ["• ", g],
                            },
                            ye,
                          ),
                        ),
                      ],
                    }),
                ],
              }),
              n.jsxs("div", {
                className:
                  "flex justify-end gap-2 border-t border-[#E8E1D9] bg-[#FAF8F5] px-6 py-4",
                children: [
                  n.jsx("button", {
                    type: "button",
                    onClick: () => Jt(!1),
                    className:
                      "rounded-xl border border-[#E8E1D9] bg-white px-4 py-2 text-xs font-bold text-[#5C5861]",
                    children: "Закрыть",
                  }),
                  ut &&
                    n.jsxs("button", {
                      type: "button",
                      disabled: ys,
                      onClick: Cl,
                      className:
                        "inline-flex items-center gap-2 rounded-xl bg-[#93161B] px-5 py-2 text-xs font-bold text-white disabled:opacity-50",
                      children: [
                        ys && n.jsx(ot, { className: "h-3.5 w-3.5 animate-spin" }),
                        "Импортировать в группу",
                      ],
                    }),
                ],
              }),
            ],
          }),
        }),
      n.jsx(wy, {
        visible: h,
        user: r,
        groupKey: B,
        subjects: $,
        defaultSubjectId: Q,
        onSave: Fi,
        onClose: () => D(!1),
      }),
      j && n.jsx(Ey, { url: j.url, name: j.name, onClose: () => ee(null) }),
    ],
  });
}
function Dy({ threadId: r, isAdmin: m, onBack: x }) {
  const [u, p] = d.useState(null),
    [F, M] = d.useState([]),
    [B, q] = d.useState(""),
    [J, ae] = d.useState(!0),
    [G, L] = d.useState(!1),
    [Q, X] = d.useState(""),
    H = d.useRef(null),
    R = d.useCallback(
      async (Y = !1) => {
        Y || ae(!0);
        try {
          const ne = await be(`/api/mobile/support/threads/${encodeURIComponent(r)}`);
          (p(ne.thread || null), M(ne.messages || []), X(""));
        } catch (ne) {
          X(ne?.message || "Не удалось загрузить переписку.");
        } finally {
          Y || ae(!1);
        }
      },
      [r],
    );
  (d.useEffect(() => {
    R(!1);
    const Y = window.setInterval(() => R(!0), 15e3);
    return () => window.clearInterval(Y);
  }, [R]),
    d.useEffect(() => {
      H.current?.scrollIntoView({ behavior: "smooth" });
    }, [F.length]));
  const Z = async (Y) => {
      Y?.preventDefault();
      const ne = B.trim();
      if (!(!ne || G)) {
        if (ne.length > 3e3) {
          X("Максимальная длина сообщения — 3000 символов.");
          return;
        }
        (L(!0), X(""));
        try {
          (await be(`/api/mobile/support/threads/${encodeURIComponent(r)}/messages`, {
            method: "POST",
            body: { message: ne },
          }),
            q(""),
            await R(!0));
        } catch (me) {
          X(me?.message || "Не удалось отправить сообщение.");
        } finally {
          L(!1);
        }
      }
    },
    ie = async (Y) => {
      try {
        (await be(`/api/mobile/admin/support/messages/${encodeURIComponent(Y)}`, {
          method: "DELETE",
        }),
          await R(!0));
      } catch (ne) {
        X(ne?.message || "Не удалось удалить сообщение.");
      }
    };
  return n.jsxs("div", {
    className:
      "zau-card overflow-hidden flex flex-col h-[calc(100vh-8rem)] max-h-[760px]",
    children: [
      n.jsxs("header", {
        className:
          "flex items-center justify-between gap-3 border-b border-[#E8E1D9] bg-white px-5 py-3.5",
        children: [
          n.jsxs("div", {
            className: "flex items-center gap-3 min-w-0",
            children: [
              n.jsxs("button", {
                type: "button",
                onClick: x,
                className:
                  "inline-flex items-center gap-1 rounded-xl bg-[#FCEEEE] px-3 py-1.5 text-xs font-extrabold text-[#93161B] hover:bg-[#F9DFDF]",
                children: [n.jsx(id, { className: "h-3.5 w-3.5" }), "Назад"],
              }),
              n.jsxs("div", {
                className: "min-w-0",
                children: [
                  n.jsx("p", {
                    className:
                      "text-[10px] font-extrabold uppercase tracking-wider text-[#93161B]",
                    children: m ? "Админ · Поддержка" : "Поддержка ЗАУ Учёба",
                  }),
                  n.jsx("h2", {
                    className:
                      "truncate text-sm sm:text-base font-extrabold text-[#16161A]",
                    children:
                      m && u
                        ? `${u.userName || "Студент"} · ${u.groupKey || "без группы"}`
                        : "Переписка с разработчиком",
                  }),
                ],
              }),
            ],
          }),
          n.jsx("button", {
            type: "button",
            onClick: () => R(!1),
            className:
              "rounded-xl bg-[#FAF8F5] border border-[#E8E1D9] p-2 text-[#5C5861] hover:text-[#16161A]",
            title: "Обновить переписку",
            children: n.jsx(vn, { className: "h-4 w-4" }),
          }),
        ],
      }),
      n.jsxs("div", {
        className: "flex-1 overflow-y-auto bg-[#FAF8F5] p-5 space-y-3",
        children: [
          J
            ? n.jsxs("div", {
                className: "flex flex-col items-center justify-center py-16",
                children: [
                  n.jsx(ot, {
                    className: "h-7 w-7 animate-spin text-[#93161B]",
                  }),
                  n.jsx("p", {
                    className: "mt-2 text-xs text-[#5C5861]",
                    children: "Загружаем сообщения…",
                  }),
                ],
              })
            : F.length
              ? F.map((Y) => {
                  const ne = m ? Y.senderRole === "admin" : Y.senderRole === "student";
                  return n.jsx(
                    "div",
                    {
                      className: `flex ${ne ? "justify-end" : "justify-start"}`,
                      children: n.jsxs("div", {
                        className: `max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-2xs ${ne ? "bg-[#93161B] text-white rounded-br-sm" : "bg-white border border-[#E8E1D9] text-[#16161A] rounded-bl-sm"}`,
                        children: [
                          !ne &&
                            n.jsx("p", {
                              className: "text-[11px] font-extrabold text-[#93161B] mb-1",
                              children: Y.senderName || (m ? "Студент" : "Разработчик"),
                            }),
                          n.jsx("p", {
                            className: "whitespace-pre-wrap text-sm leading-relaxed",
                            children: Y.message,
                          }),
                          n.jsxs("div", {
                            className:
                              "mt-1.5 flex items-center justify-between gap-3 text-[10px]",
                            children: [
                              n.jsx("span", {
                                className: ne ? "text-white/75" : "text-[#8F8A94]",
                                children: yi(Y.createdAt),
                              }),
                              m &&
                                Y.senderRole === "student" &&
                                n.jsxs("button", {
                                  type: "button",
                                  onClick: () => ie(Y.id),
                                  className:
                                    "inline-flex items-center gap-0.5 font-bold text-[#C92A2A] hover:underline",
                                  children: [
                                    n.jsx(hs, { className: "h-3 w-3" }),
                                    "Удалить",
                                  ],
                                }),
                            ],
                          }),
                        ],
                      }),
                    },
                    Y.id,
                  );
                })
              : n.jsx("p", {
                  className: "py-12 text-center text-xs text-[#8F8A94]",
                  children: "В переписке пока нет сообщений.",
                }),
          n.jsx("div", { ref: H }),
        ],
      }),
      n.jsxs("form", {
        onSubmit: Z,
        className: "border-t border-[#E8E1D9] bg-white p-4 space-y-2",
        children: [
          Q &&
            n.jsx("p", {
              className: "text-xs font-bold text-[#C92A2A]",
              children: Q,
            }),
          n.jsxs("div", {
            className: "flex items-end gap-2",
            children: [
              n.jsx("textarea", {
                rows: 2,
                maxLength: 3e3,
                value: B,
                onChange: (Y) => q(Y.target.value),
                onKeyDown: (Y) => {
                  Y.key === "Enter" && !Y.shiftKey && (Y.preventDefault(), Z());
                },
                placeholder: m ? "Ответить студенту…" : "Написать разработчику…",
                className:
                  "flex-1 rounded-xl border border-[#E8E1D9] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#16161A] focus:border-[#93161B] focus:bg-white focus:outline-none resize-none",
              }),
              n.jsxs("button", {
                type: "submit",
                disabled: G || !B.trim(),
                className:
                  "inline-flex h-11 items-center gap-2 rounded-xl bg-[#93161B] px-4 text-xs font-extrabold text-white hover:bg-[#6B0D12] disabled:opacity-45 shrink-0",
                children: [
                  G
                    ? n.jsx(ot, { className: "h-4 w-4 animate-spin" })
                    : n.jsx(fr, { className: "h-4 w-4" }),
                  "Отправить",
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const Zh = "zau_sabbath_mode_enabled_local_v1",
  Vh = "zau_sabbath_mode_forced_local_v1";
function By() {
  const [r, m] = d.useState(!0),
    [x, u] = d.useState(null),
    [p, F] = d.useState(null),
    [M, B] = d.useState("home"),
    [q, J] = d.useState("hw"),
    [ae, G] = d.useState(""),
    [L, Q] = d.useState(null),
    [X, H] = d.useState(!0),
    [R, Z] = d.useState(!1),
    [ie, Y] = d.useState({ enabled: !1, updatedAt: 0 }),
    [ne, me] = d.useState(() => gn()),
    [re, $] = d.useState(null),
    [Me, De] = d.useState(!1),
    [je, ue] = d.useState(null),
    oe = ne.active || ne.isSaturday,
    de = R || oe || (X && ie.enabled),
    se = R ? "local-manual" : ie.enabled && X ? "global" : oe ? "calendar" : "",
    ge = x?.isAdmin ? ae || x.groupKey : x?.groupKey || "",
    U = d.useCallback((h) => {
      !h ||
        typeof h.enabled != "boolean" ||
        Y((D) => {
          const he = Number(h.updatedAt) || 0;
          return he < (Number(D.updatedAt) || 0)
            ? D
            : { enabled: h.enabled, updatedAt: he };
        });
    }, []),
    ce = d.useCallback(
      async (h, D) => {
        h && D ? (u(D), G(D.isAdmin ? D.groupKey : "")) : (u(null), G(""));
        const he = gs("zau_catalog");
        if (
          (he && (F(he), U(he.globalSabbathMode)),
          be("/api/mobile/catalog", { cacheKey: "zau_catalog" })
            .then((Ae) => {
              (F(Ae), U(Ae.globalSabbathMode));
            })
            .catch(() => {}),
          h)
        )
          try {
            const Ae = await be("/api/mobile/me");
            Xl === h &&
              Ae.user &&
              (u(Ae.user),
              G((V) => (Ae.user.isAdmin ? V || Ae.user.groupKey : "")),
              Zu(h, Ae.user));
          } catch (Ae) {
            Xl === h &&
              Ae?.status === 401 &&
              Ae.isApiResponse &&
              (zh(), u(null), Q(null), G(""), $(null), De(false), ue(null), B("home"));
          }
      },
      [U],
    );
  useRecovery(() => {
    const token = Xl;
    if (!token) return;
    be("/api/mobile/me", { timeoutMs: 5500 })
      .then((res) => {
        if (token === Xl && res.user) {
          u(res.user);
          Zu(token, res.user);
        }
      })
      .catch((e) => {
        if (token === Xl && e.status === 401 && e.isApiResponse) {
          zh();
          u(null);
          G("");
          Q(null);
          De(false);
          $(null);
          ue(null);
          B("home");
        }
      });
  });
  (d.useEffect(() => {
    try {
      const he = localStorage.getItem(Zh),
        Ae = localStorage.getItem(Vh);
      (he !== null && H(he !== "0"), Ae !== null && Z(Ae === "1"));
    } catch {}
    const { token: h, user: D } = Wg();
    ce(h, D).catch(() => {});
    m(false);
  }, [ce]),
    d.useEffect(() => {
      if (r) return;
      let h = !0;
      const D = () => {
          be("/api/mobile/sabbath-mode")
            .then((V) => {
              h && U(V.globalSabbathMode);
            })
            .catch(() => {});
        },
        he = window.setInterval(D, 2e4),
        Ae = () => D();
      return (
        window.addEventListener("focus", Ae),
        () => {
          ((h = !1), window.clearInterval(he), window.removeEventListener("focus", Ae));
        }
      );
    }, [r, U]),
    d.useEffect(() => {
      const h = window.setInterval(() => me(gn()), 3e4);
      return () => window.clearInterval(h);
    }, []),
    d.useEffect(() => {
      if (!x) return;
      const h = () => {
          ps() &&
            be("/api/mobile/reminders", { retryTransport: !1 })
              .then((he) => {
                he.reminders?.length && Eb(he.reminders);
              })
              .catch(() => {});
        },
        D = window.setInterval(h, 35e3);
      return () => window.clearInterval(D);
    }, [x]),
    d.useEffect(() => {
      de && ($(null), M === "study" && B("home"));
    }, [de, M]));
  const le = (h, D) => {
      (Zu(h, D),
        u(D),
        G(D.isAdmin ? D.groupKey : ""),
        Q(null),
        B("home"),
        Pe("auth", "web_login"));
    },
    we = async () => {
      try {
        be("/api/mobile/auth/logout", {
          method: "POST",
          retryTransport: !1,
          timeoutMs: 4000,
        }).catch(() => {});
      } catch {}
      (zh(), Q(null), G(""), u(null), De(false), $(null), ue(null), B("home"));
    },
    Ee = (h, D) => {
      if (h === "study" && de) {
        B("home");
        return;
      }
      (D && J(D), Q(null), B(h), Pe("navigation", `open_${h}`));
    },
    Te = (h) => {
      H(h);
      try {
        localStorage.setItem(Zh, h ? "1" : "0");
      } catch {}
    },
    Re = (h) => {
      Z(h);
      try {
        localStorage.setItem(Vh, h ? "1" : "0");
      } catch {}
    },
    Ne = async () => {
      try {
        const D = (await be("/api/mobile/support/threads")).threads?.[0];
        if (D) {
          Q({ name: "support", threadId: D.id, returnTo: "profile" });
          return;
        }
      } catch {}
      (Q(null), B("profile"));
    };
  if (r)
    return n.jsxs("div", {
      className:
        "min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-[#93161B]",
      children: [
        n.jsx("div", {
          className:
            "flex h-16 w-16 items-center justify-center rounded-2xl bg-[#93161B] shadow-md mb-4",
          children: n.jsx(bs, { size: 42, variant: "light" }),
        }),
        n.jsxs("div", {
          className: "flex items-center gap-2 text-sm font-extrabold",
          children: [
            n.jsx(ot, { className: "h-4 w-4 animate-spin" }),
            n.jsx("span", { children: "ЗАУ Учёба…" }),
          ],
        }),
      ],
    });
  const K = xb(p?.adminDirections?.length ? p.adminDirections : p?.directions);
  return n.jsxs(n.Fragment, {
    children: [
      x
        ? n.jsx(ey, {
            user: x,
            activeTab: M,
            activeSecondary: L?.name || null,
            activeSemester: Number(p?.activeSemester) || fs(),
            activeGroupKey: ge,
            adminGroupOptions: K,
            sabbathModeActive: de,
            onChangeAdminGroup: (h) => {
              (Pe("admin", "change_view_group"), G(h));
            },
            onNavigateTab: (h) => Ee(h),
            onOpenBible: () => De(!0),
            onOpenAdmin: () => Q({ name: "admin" }),
            onOpenSupport: Ne,
            onLogout: we,
            children:
              L?.name === "admin" && x.isAdmin
                ? n.jsx(cy, {
                    globalSabbathModeEnabled: ie.enabled,
                    onGlobalSabbathModeChanged: (h) =>
                      Y({
                        enabled: h.enabled,
                        updatedAt: h.updatedAt || Date.now(),
                      }),
                    onBack: () => Q(null),
                    onOpenSupportThread: (h) =>
                      Q({ name: "support", threadId: h, returnTo: "admin" }),
                  })
                : L?.name === "support"
                  ? n.jsx(Dy, {
                      threadId: L.threadId,
                      isAdmin: !!x.isAdmin,
                      onBack: () => Q(L.returnTo === "admin" ? { name: "admin" } : null),
                    })
                  : M === "home"
                    ? n.jsx(xy, {
                        user: x,
                        groupKey: ge,
                        catalog: p,
                        sabbathModeActive: de,
                        sabbathModeSource: se,
                        globalSabbathModeEnabled: ie.enabled,
                        onChangeAdminGroup: G,
                        onOpenBible: () => De(!0),
                        onNavigateTab: Ee,
                        onOpenQuiz: (h) => {
                          de || $(h);
                        },
                        onQuickRemindForEntry: (h) => {
                          (ue(h), Q(null), B("reminders"));
                        },
                      })
                    : M === "schedule"
                      ? n.jsx(jy, {
                          user: x,
                          groupKey: ge,
                          sabbathModeActive: de,
                          sabbathModeSource: se,
                          globalSabbathModeEnabled: ie.enabled,
                          onOpenBible: () => De(!0),
                          onNavigateTab: Ee,
                        })
                      : M === "study" && !de
                        ? n.jsx(
                            Fy,
                            {
                              user: x,
                              groupKey: ge,
                              activeSemester: Number(p?.activeSemester) || fs(),
                              initialCollection: q,
                              sabbathModeActive: de,
                              onOpenQuiz: (h) => {
                                de || $(h);
                              },
                              onQuickRemindForEntry: (h) => {
                                (ue(h), Q(null), B("reminders"));
                              },
                            },
                            `${x.accountId}:${ge}:${p?.activeSemester || fs()}`,
                          )
                        : M === "reminders"
                          ? n.jsx(Ny, {
                              user: x,
                              prefillEntry: je,
                              onClearPrefill: () => ue(null),
                            })
                          : n.jsx(yy, {
                              user: x,
                              groupKey: ge,
                              localGlobalSabbathEnabled: X,
                              localSabbathForceEnabled: R,
                              globalSabbathModeEnabled: ie.enabled,
                              onToggleLocalGlobalSabbath: Te,
                              onToggleLocalSabbathForce: Re,
                              onUserUpdated: (h) => {
                                (u(h), Zu(h.token || Xl, h));
                              },
                              onOpenAdminPanel: () => Q({ name: "admin" }),
                              onOpenSupportChat: (h) =>
                                Q({
                                  name: "support",
                                  threadId: h,
                                  returnTo: "profile",
                                }),
                              onLogout: we,
                            }),
          })
        : n.jsx(ry, {
            catalog: p,
            onAuthenticated: le,
            onOpenBible: () => De(!0),
          }),
      n.jsx(sy, {
        visible: !!re && !de,
        quizTarget: re,
        groupKey: ge,
        isAdmin: !!x?.isAdmin,
        onClose: () => $(null),
      }),
      n.jsx(WebUpdate, {}),
      n.jsx(
        ny,
        {
          visible: Me,
          userId: x?.accountId || x?.effectiveUserId || x?.login || "guest",
          authenticated: !!x,
          onClose: () => De(!1),
        },
        `${Et}:${x?.accountId || x?.effectiveUserId || x?.login || "guest"}`,
      ),
    ],
  });
}
Xg.createRoot(document.getElementById("root")).render(
  n.jsx(ob.StrictMode, { children: n.jsx(By, {}) }),
);
window.addEventListener("storage", (e) => {
  if (
    (e.key === nr(Et) && e.newValue !== Xl) ||
    (e.key === tr && e.newValue !== Et) ||
    e.key === null
  ) {
    sessionGeneration++;
    if (e.key === nr(Et) && !e.newValue) purgeStudy(Et, xr);
    location.reload();
  }
});
window.addEventListener("online", recovered);
initWebOffline();

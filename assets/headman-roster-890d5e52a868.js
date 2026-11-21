// Shared live roster contract (Android & Pages). No storage/cache for student lists or queued role changes.
export function useHeadmen(React, api, refreshKey = 0) {
  const { useState, useEffect, useRef } = React;
  const [group, groupTo] = useState("Теология"),
    [q, search] = useState(""),
    [filter, filterTo] = useState("all"),
    [offset, page] = useState(0);
  const [tick, bump] = useState(0),
    [state, setState] = useState(null),
    [selected, pick] = useState(null),
    [working, work] = useState(false),
    [notice, tell] = useState("");
  const lock = useRef(false),
    live = useRef(false),
    key = JSON.stringify([group, q, filter, offset, tick, refreshKey]),
    active = useRef(key);
  active.current = key;
  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
    };
  }, []);
  useEffect(() => {
    let alive = true;
    pick(null);
    const t = setTimeout(async () => {
      try {
        const r = await api(
          "/api/mobile/admin/headmen?group=" +
            encodeURIComponent(group) +
            "&q=" +
            encodeURIComponent(q.trim()) +
            "&filter=" +
            filter +
            "&offset=" +
            offset,
          { retryTransport: false },
        );
        if (!alive) return;
        if (
          r.groupKey !== group ||
          r.q !== q.trim() ||
          r.filter !== filter ||
          r.offset !== offset ||
          !Array.isArray(r.items) ||
          r.items.some((a) => a.groupKey !== group)
        )
          throw Error("Получен другой список. Обновите страницу списка.");
        if (!r.items.length && offset > 0) {
          page(Math.max(0, offset - r.pageSize));
          return;
        }
        setState({ key, data: r });
      } catch (e) {
        if (alive)
          setState({
            key,
            error:
              e.status === 404
                ? "На сервере ещё нет раздела «Старосты». Выпустите полное обновление."
                : e.message || "Не удалось загрузить список.",
          });
      }
    }, 160);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [api, key]);
  const ready = state?.key === key ? state : null,
    selection = selected?.key === key ? selected.row : null;
  const change = (f, v) => {
    if (lock.current) return;
    tell("");
    pick(null);
    page(0);
    f(v);
  };
  async function submit() {
    if (
      !selection ||
      selection.locked ||
      lock.current ||
      selection.groupKey !== group
    )
      return;
    lock.current = true;
    work(true);
    tell("");
    const a = selection,
      assigned = !a.assigned;
    try {
      const r = await api(
        "/api/mobile/admin/headmen/" + encodeURIComponent(a.id),
        {
          method: "PUT",
          retryTransport: false,
          body: { groupKey: group, assigned, stamp: a.stamp },
        },
      );
      if (
        !r.ok ||
        r.groupKey !== group ||
        r.accountId !== a.id ||
        r.assigned !== assigned
      )
        throw Error("Сервер не подтвердил действие. Проверьте список.");
      if (live.current && active.current === key)
        tell(
          assigned
            ? "Назначен староста: " + a.name + "."
            : "Назначение снято: " + a.name + ".",
        );
    } catch (e) {
      if (live.current && active.current === key)
        tell(
          (e.message || "Не удалось подтвердить изменение.") +
            " Список запрошен заново.",
        );
    } finally {
      lock.current = false;
      if (live.current) {
        work(false);
        pick(null);
        bump((t) => t + 1);
      }
    }
  }
  return {
    group,
    setGroup: (v) => {
      change(groupTo, v);
      if (!lock.current) search("");
    },
    q,
    setQ: (v) => change(search, v),
    filter,
    setFilter: (v) => change(filterTo, v),
    offset,
    page: (v) => {
      if (!lock.current) {
        pick(null);
        page(v);
        tell("");
      }
    },
    reload: () => {
      if (!lock.current) {
        pick(null);
        bump((t) => t + 1);
      }
    },
    data: ready?.data,
    error: ready?.error,
    busy: !ready,
    working,
    notice,
    selection,
    open: (a) => {
      if (!a.locked && !lock.current && ready?.data?.items.includes(a))
        pick({ key, row: a });
    },
    cancel: () => {
      if (!lock.current) pick(null);
    },
    submit,
  };
}
export function roleCaption(a) {
  return a.source === "admin"
    ? "Администратор"
    : a.source === "global"
      ? "Общая роль Telegram"
      : a.locked
        ? "Роль Telegram · проверьте привязку"
        : a.assigned
          ? "Староста группы"
          : "Студент";
}
export function confirmCopy(a) {
  return a.assigned
    ? a.source === "legacy" || a.source === "both"
      ? "Будет снята и прежняя роль Telegram для этой группы. Остальные назначения не изменятся."
      : "Права старосты этой группы будут сняты. Остальные старосты сохранят свои права."
    : "Студент сможет править расписание и учебные материалы только своей группы. Назначение не даёт доступа к админ-панели.";
}
